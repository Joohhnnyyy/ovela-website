import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp,
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cart, CartData, CartItem, CartItemData, Product, ApiResponse } from '@/types/database';
import { ProductService } from './productService';

const CARTS_COLLECTION = 'carts';

export class CartService {
  /**
   * Get user's cart
   */
  static async getUserCart(userId: string): Promise<ApiResponse<Cart>> {
    try {
      const cartRef = doc(db, CARTS_COLLECTION, userId);
      const cartSnap = await getDoc(cartRef);

      if (!cartSnap.exists()) {
        // Create empty cart if it doesn't exist
        const newCart: CartData = {
          userId,
          items: [],
          totalPrice: 0,
          totalItems: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(cartRef, {
          ...newCart,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        return {
          success: true,
          data: { id: userId, ...newCart }
        };
      }

      const cartData = cartSnap.data() as CartData;
      const cart: Cart = {
        id: cartSnap.id,
        ...cartData,
        createdAt: cartData.createdAt instanceof Timestamp ? cartData.createdAt.toDate() : cartData.createdAt,
        updatedAt: cartData.updatedAt instanceof Timestamp ? cartData.updatedAt.toDate() : cartData.updatedAt
      };

      return {
        success: true,
        data: cart
      };
    } catch (error) {
      console.error('Error getting user cart:', error);
      return {
        success: false,
        error: 'Failed to fetch cart'
      };
    }
  }

  /**
   * Add item to cart
   */
  static async addToCart(
    userId: string, 
    productId: string, 
    size: string, 
    color: string, 
    quantity: number = 1
  ): Promise<ApiResponse<Cart>> {
    try {
      // First, verify the product exists and has sufficient inventory
      const productResult = await ProductService.getProductById(productId);
      if (!productResult.success || !productResult.data) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      const product = productResult.data;
      
      // Check inventory
      const inventoryItem = product.inventory?.find(item => item.size === size && item.color === color);
      if (!inventoryItem || inventoryItem.quantity < quantity) {
        return {
          success: false,
          error: 'Insufficient inventory'
        };
      }

      const cartRef = doc(db, CARTS_COLLECTION, userId);
      const cartSnap = await getDoc(cartRef);

      let cartData: CartData;
      
      if (!cartSnap.exists()) {
        // Create new cart
        cartData = {
          userId,
          items: [],
          totalPrice: 0,
          totalItems: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else {
        cartData = cartSnap.data() as CartData;
      }

      // Check if item already exists in cart
      const existingItemIndex = cartData.items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newQuantity = cartData.items[existingItemIndex].quantity + quantity;
        
        // Check if new quantity exceeds inventory
        if (newQuantity > inventoryItem.quantity) {
          return {
            success: false,
            error: 'Cannot add more items than available in inventory'
          };
        }

        cartData.items[existingItemIndex].quantity = newQuantity;
        // Update item price if needed
        cartData.items[existingItemIndex].price = product.price;
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: `${productId}-${size}-${color}`,
          userId,
          productId,
          product,
          size,
          color,
          quantity,
          price: product.price,
          addedAt: new Date(),
          updatedAt: new Date()
        };
        
        cartData.items.push(newCartItem);
      }

      // Recalculate totals
      cartData.totalItems = cartData.items.reduce((total, item) => total + item.quantity, 0);
      cartData.totalPrice = cartData.items.reduce((total, item) => total + (item.quantity * item.price), 0);
      cartData.updatedAt = new Date();

      // Save to Firestore
      await setDoc(cartRef, {
        ...cartData,
        updatedAt: serverTimestamp()
      });

      const updatedCart: Cart = {
        id: userId,
        ...cartData
      };

      return {
        success: true,
        data: updatedCart,
        message: 'Item added to cart successfully'
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        error: 'Failed to add item to cart'
      };
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(
    userId: string,
    productId: string,
    size: string,
    color: string,
    quantity: number
  ): Promise<ApiResponse<Cart>> {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(userId, productId, size, color);
      }

      // Verify product and inventory
      const productResult = await ProductService.getProductById(productId);
      if (!productResult.success || !productResult.data) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      const product = productResult.data;
      const inventoryItem = product.inventory?.find(item => item.size === size && item.color === color);
      
      if (!inventoryItem || inventoryItem.quantity < quantity) {
        return {
          success: false,
          error: 'Insufficient inventory'
        };
      }

      const cartRef = doc(db, CARTS_COLLECTION, userId);
      const cartSnap = await getDoc(cartRef);

      if (!cartSnap.exists()) {
        return {
          success: false,
          error: 'Cart not found'
        };
      }

      const cartData = cartSnap.data() as CartData;
      const itemIndex = cartData.items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      );

      if (itemIndex < 0) {
        return {
          success: false,
          error: 'Item not found in cart'
        };
      }

      // Update item
      cartData.items[itemIndex].quantity = quantity;
      cartData.items[itemIndex].updatedAt = new Date();

      // Recalculate totals
      cartData.totalItems = cartData.items.reduce((total, item) => total + item.quantity, 0);
      cartData.totalPrice = cartData.items.reduce((total, item) => total + (item.quantity * item.price), 0);
      cartData.updatedAt = new Date();

      await updateDoc(cartRef, {
        items: cartData.items,
        totalItems: cartData.totalItems,
        totalPrice: cartData.totalPrice,
        updatedAt: serverTimestamp()
      });

      const updatedCart: Cart = {
        id: userId,
        ...cartData
      };

      return {
        success: true,
        data: updatedCart,
        message: 'Cart item updated successfully'
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return {
        success: false,
        error: 'Failed to update cart item'
      };
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(
    userId: string,
    productId: string,
    size: string,
    color: string
  ): Promise<ApiResponse<Cart>> {
    try {
      const cartRef = doc(db, CARTS_COLLECTION, userId);
      const cartSnap = await getDoc(cartRef);

      if (!cartSnap.exists()) {
        return {
          success: false,
          error: 'Cart not found'
        };
      }

      const cartData = cartSnap.data() as CartData;
      const itemIndex = cartData.items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      );

      if (itemIndex < 0) {
        return {
          success: false,
          error: 'Item not found in cart'
        };
      }

      // Remove item
      cartData.items.splice(itemIndex, 1);

      // Recalculate totals
      cartData.totalItems = cartData.items.reduce((total, item) => total + item.quantity, 0);
      cartData.totalPrice = cartData.items.reduce((total, item) => total + (item.quantity * item.price), 0);
      cartData.updatedAt = new Date();

      await updateDoc(cartRef, {
        items: cartData.items,
        totalItems: cartData.totalItems,
        totalPrice: cartData.totalPrice,
        updatedAt: serverTimestamp()
      });

      const updatedCart: Cart = {
        id: userId,
        ...cartData
      };

      return {
        success: true,
        data: updatedCart,
        message: 'Item removed from cart successfully'
      };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        error: 'Failed to remove item from cart'
      };
    }
  }

  /**
   * Clear entire cart
   */
  static async clearCart(userId: string): Promise<ApiResponse<Cart>> {
    try {
      const cartRef = doc(db, CARTS_COLLECTION, userId);
      
      const emptyCartData: CartData = {
        userId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(cartRef, {
        ...emptyCartData,
        updatedAt: serverTimestamp()
      });

      const clearedCart: Cart = {
        id: userId,
        ...emptyCartData
      };

      return {
        success: true,
        data: clearedCart,
        message: 'Cart cleared successfully'
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        error: 'Failed to clear cart'
      };
    }
  }

  /**
   * Get cart item count
   */
  static async getCartItemCount(userId: string): Promise<ApiResponse<number>> {
    try {
      const cartResult = await this.getUserCart(userId);
      
      if (!cartResult.success) {
        return {
          success: false,
          error: cartResult.error
        };
      }

      return {
        success: true,
        data: cartResult.data?.totalItems || 0
      };
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return {
        success: false,
        error: 'Failed to get cart item count'
      };
    }
  }

  /**
   * Validate cart items (check inventory and prices)
   */
  static async validateCart(userId: string): Promise<ApiResponse<{ isValid: boolean; issues: string[] }>> {
    try {
      const cartResult = await this.getUserCart(userId);
      
      if (!cartResult.success || !cartResult.data) {
        return {
          success: false,
          error: 'Cart not found'
        };
      }

      const cart = cartResult.data;
      const issues: string[] = [];
      let isValid = true;

      // Check each item in cart
      for (const cartItem of cart.items) {
        const productResult = await ProductService.getProductById(cartItem.productId);
        
        if (!productResult.success || !productResult.data) {
          issues.push(`Product ${cartItem.product.name} is no longer available`);
          isValid = false;
          continue;
        }

        const product = productResult.data;
        
        // Check if product is still active
        if (!product.isActive) {
          issues.push(`Product ${cartItem.product.name} is no longer available`);
          isValid = false;
          continue;
        }

        // Check inventory
        const inventoryItem = product.inventory?.find(
          item => item.size === cartItem.size && item.color === cartItem.color
        );
        
        if (!inventoryItem) {
          issues.push(`${cartItem.product.name} in ${cartItem.size}/${cartItem.color} is no longer available`);
          isValid = false;
          continue;
        }

        if (inventoryItem.quantity < cartItem.quantity) {
          issues.push(`Only ${inventoryItem.quantity} units of ${cartItem.product.name} (${cartItem.size}/${cartItem.color}) are available`);
          isValid = false;
        }

        // Check price changes
        if (product.price !== cartItem.price) {
          issues.push(`Price of ${cartItem.product.name} has changed from $${cartItem.price} to $${product.price}`);
          isValid = false;
        }
      }

      return {
        success: true,
        data: { isValid, issues }
      };
    } catch (error) {
      console.error('Error validating cart:', error);
      return {
        success: false,
        error: 'Failed to validate cart'
      };
    }
  }

  /**
   * Merge guest cart with user cart (for when user logs in)
   */
  static async mergeGuestCart(userId: string, guestCartItems: CartItem[]): Promise<ApiResponse<Cart>> {
    try {
      const cartResult = await this.getUserCart(userId);
      
      if (!cartResult.success) {
        return cartResult;
      }

      const userCart = cartResult.data!;
      
      // Add each guest cart item to user cart
      for (const guestItem of guestCartItems) {
        await this.addToCart(
          userId,
          guestItem.productId,
          guestItem.size,
          guestItem.color,
          guestItem.quantity
        );
      }

      // Get updated cart
      return this.getUserCart(userId);
    } catch (error) {
      console.error('Error merging guest cart:', error);
      return {
        success: false,
        error: 'Failed to merge guest cart'
      };
    }
  }

  /**
   * Calculate cart totals (utility function)
   */
  static calculateCartTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + (item.quantity * item.price), 0);
    
    return { totalItems, totalPrice };
  }

  /**
   * Check if item exists in cart
   */
  static async isItemInCart(
    userId: string,
    productId: string,
    size: string,
    color: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const cartResult = await this.getUserCart(userId);
      
      if (!cartResult.success || !cartResult.data) {
        return {
          success: true,
          data: false
        };
      }

      const exists = cartResult.data.items.some(
        item => item.productId === productId && item.size === size && item.color === color
      );

      return {
        success: true,
        data: exists
      };
    } catch (error) {
      console.error('Error checking if item is in cart:', error);
      return {
        success: false,
        error: 'Failed to check cart item'
      };
    }
  }
}