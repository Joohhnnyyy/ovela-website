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
import { handleFirestoreError, retryOperation } from '@/lib/firestore-utils';
import { getProductById } from '@/data/products';

// Local storage key for offline cart data
const LOCAL_CART_KEY = 'ovela_cart_';

// Helper functions for local storage
class LocalCartStorage {
  static getCart(userId: string): Cart | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY + userId);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt)
      };
    } catch (error) {
      console.warn('Failed to parse local cart data:', error);
      return null;
    }
  }

  static setCart(userId: string, cart: Cart): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_CART_KEY + userId, JSON.stringify(cart));
    } catch (error) {
      console.warn('Failed to save cart to local storage:', error);
    }
  }

  static removeCart(userId: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(LOCAL_CART_KEY + userId);
    } catch (error) {
      console.warn('Failed to remove cart from local storage:', error);
    }
  }
}

const CARTS_COLLECTION = 'carts';

export class CartService {
  /**
   * Get user's cart (offline-first approach)
   */
  static async getUserCart(userId: string): Promise<ApiResponse<Cart>> {
    try {
      // Get cart from local storage only (offline-first)
      let cart = LocalCartStorage.getCart(userId);
      
      if (!cart) {
        // Create empty cart if it doesn't exist
        const newCart: Cart = {
          id: userId,
          userId,
          items: [],
          totalPrice: 0,
          totalItems: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Save to local storage
        LocalCartStorage.setCart(userId, newCart);
        cart = newCart;
      }

      return {
        success: true,
        data: cart
      };
    } catch (error) {
      console.error('Error getting user cart:', error);
      return {
        success: false,
        error: 'Failed to get cart from local storage'
      };
    }
  }

  /**
   * Add item to cart (offline-first approach)
   */
  static async addToCart(
    userId: string, 
    productId: string, 
    size: string, 
    color: string, 
    quantity: number = 1
  ): Promise<ApiResponse<Cart>> {
    try {
      // Get current cart from local storage
      const cartResult = await this.getUserCart(userId);
      if (!cartResult.success || !cartResult.data) {
        return {
          success: false,
          error: 'Failed to get cart'
        };
      }

      const cart = cartResult.data;
      
      // For offline mode, we'll use a simplified product object
      // Determine category based on product ID
      let category = 'sneakers';
      if (productId.includes('bag') || productId.includes('backpack') || productId.includes('briefcase') || productId.includes('messenger') || productId.includes('pouch') || productId.includes('hobo')) {
        category = 'bags';
      } else if (productId.includes('coat') || productId.includes('pants') || productId.includes('sweater') || productId.includes('sweatshirt') || productId.includes('tshirt') || productId.includes('jacket') || productId.includes('blouson') || productId.includes('shirt')) {
        category = 'clothing';
      } else if (productId.includes('bracelet') || productId.includes('cap') || productId.includes('sunglasses') || productId.includes('necklace') || productId.includes('bangle') || productId.includes('brooch') || productId.includes('ring') || productId.includes('tie')) {
        category = 'accessories';
      }

      // Determine the correct file extension based on known products
      let imageExtension = '.jpg';
      if (productId === 'b30-countdown-black-mesh' || productId.includes('b80-lounge') || productId.includes('cd-icon')) {
        imageExtension = '.webp';
      }

      // Create a simplified product object for offline mode
      // Get actual product price from product data
      const getProductPrice = (productId: string): number => {
        const actualProduct = getProductById(productId);
        if (actualProduct) {
          return actualProduct.price;
        }
        
        // Fallback to base prices in INR if product not found
        const basePrices = {
          sneakers: 8999,
          bags: 4999,
          clothing: 2999,
          accessories: 1999
        };
        
        return basePrices[category as keyof typeof basePrices] || 8999;
      };

      const simpleProduct: Product = {
        id: productId,
        name: productId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: 'Premium product with modern design',
        price: getProductPrice(productId),
        category,
        brand: 'Ovela',
        images: [`/products/${category}/${productId}-1${imageExtension}`],
        sizes: [
          { size: 'S', label: 'Small', available: true },
          { size: 'M', label: 'Medium', available: true },
          { size: 'L', label: 'Large', available: true }
        ],
        colors: [
          { color: 'black', name: 'Black', hexCode: '#000000', available: true },
          { color: 'white', name: 'White', hexCode: '#FFFFFF', available: true }
        ],
        inventory: [],
        tags: [],
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].updatedAt = new Date();
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: `${productId}-${size}-${color}`,
          userId,
          productId,
          product: simpleProduct,
          size,
          color,
          quantity,
          price: simpleProduct.price,
          addedAt: new Date(),
          updatedAt: new Date()
        };
        
        cart.items.push(newCartItem);
      }

      // Recalculate totals
      cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
      cart.updatedAt = new Date();

      // Save to local storage
      LocalCartStorage.setCart(userId, cart);

      return {
        success: true,
        data: cart,
        message: 'Item added to cart successfully'
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        error: handleFirestoreError(error)
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
   * Clear cart (offline-first approach)
   */
  static async clearCart(userId: string): Promise<ApiResponse<Cart>> {
    try {
      const emptyCart: Cart = {
        id: userId,
        userId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to local storage
      LocalCartStorage.setCart(userId, emptyCart);

      return {
        success: true,
        data: emptyCart,
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
   * Update cart prices to match current product prices
   */
  static async updateCartPrices(userId: string): Promise<ApiResponse<Cart>> {
    try {
      const cartResult = await this.getUserCart(userId);
      
      if (!cartResult.success || !cartResult.data) {
        return {
          success: false,
          error: 'Cart not found'
        };
      }

      const cart = cartResult.data;
      let hasUpdates = false;

      // Update prices for each item
      const updatedItems = cart.items.map(item => {
        const actualProduct = getProductById(item.productId);
        if (actualProduct && actualProduct.price !== item.price) {
          hasUpdates = true;
          return {
            ...item,
            price: actualProduct.price
          };
        }
        return item;
      });

      if (hasUpdates) {
        const totals = this.calculateCartTotals(updatedItems);
        const updatedCart: Cart = {
          ...cart,
          items: updatedItems,
          totalPrice: totals.totalPrice,
          totalItems: totals.totalItems,
          updatedAt: new Date()
        };

        // Save updated cart
        LocalCartStorage.setCart(userId, updatedCart);

        return {
          success: true,
          data: updatedCart,
          message: 'Cart prices updated successfully'
        };
      }

      return {
        success: true,
        data: cart,
        message: 'No price updates needed'
      };
    } catch (error) {
      console.error('Error updating cart prices:', error);
      return {
        success: false,
        error: 'Failed to update cart prices'
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