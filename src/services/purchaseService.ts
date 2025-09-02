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
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Purchase, 
  PurchaseData, 
  PurchaseItem, 
  PurchaseStatus, 
  PurchaseFilters,
  Address,
  PaymentMethod,
  User,
  ApiResponse, 
  PaginatedResponse 
} from '@/types/database';
import { CartService } from './cartService';
import { ProductService } from './productService';
import { UserService } from './userService';

const PURCHASES_COLLECTION = 'purchases';

export class PurchaseService {
  /**
   * Create a new purchase from user's cart
   */
  static async createPurchaseFromCart(
    userId: string,
    shippingAddress: Address,
    billingAddress: Address,
    paymentMethod: PaymentMethod,
    notes?: string
  ): Promise<ApiResponse<Purchase>> {
    try {
      // Get user's cart
      const cartResult = await CartService.getUserCart(userId);
      if (!cartResult.success || !cartResult.data || cartResult.data.items.length === 0) {
        return {
          success: false,
          error: 'Cart is empty or not found'
        };
      }

      const cart = cartResult.data;

      // Validate cart items
      const validationResult = await CartService.validateCart(userId);
      if (!validationResult.success || !validationResult.data?.isValid) {
        return {
          success: false,
          error: 'Cart validation failed: ' + (validationResult.data?.issues.join(', ') || 'Unknown error')
        };
      }

      // Get user data
      const userResult = await UserService.getUserById(userId);
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const user = userResult.data;

      // Convert cart items to purchase items
      const purchaseItems: PurchaseItem[] = cart.items.map((cartItem, index) => ({
        id: `${cartItem.productId}-${cartItem.size}-${cartItem.color}`,
        productId: cartItem.productId,
        product: {
          id: cartItem.product.id,
          name: cartItem.product.name,
          images: cartItem.product.images,
          brand: cartItem.product.brand
        },
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color,
        price: cartItem.price,
        total: cartItem.quantity * cartItem.price
      }));

      // Calculate totals
      const subtotal = purchaseItems.reduce((total, item) => total + item.total, 0);
      const tax = subtotal * 0.08; // 8% tax rate
      const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const discount = 0; // No discount for now
      const total = subtotal + tax + shipping - discount;

      // Create purchase document
      const purchaseRef = doc(collection(db, PURCHASES_COLLECTION));
      
      const purchaseData: PurchaseData = {
        userId,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName
        },
        items: purchaseItems,
        shippingAddress,
        billingAddress,
        paymentMethod,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        status: 'pending',
        notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Use transaction to ensure atomic operations
      await runTransaction(db, async (transaction) => {
        // First, check and reserve inventory for all items
        const productRefs = new Map();
        const inventoryUpdates = new Map();
        
        for (const item of purchaseItems) {
          const productRef = doc(db, 'products', item.productId);
          const productSnap = await transaction.get(productRef);
          
          if (!productSnap.exists()) {
            throw new Error(`Product ${item.product.name} not found`);
          }
          
          const productData = productSnap.data();
          const inventory = productData.inventory || [];
          const inventoryIndex = inventory.findIndex(
            (inv: any) => inv.size === item.size && inv.color === item.color
          );
          
          if (inventoryIndex < 0) {
            throw new Error(`Inventory not found for ${item.product.name} (${item.size}, ${item.color})`);
          }
          
          const currentQuantity = inventory[inventoryIndex].quantity;
          if (currentQuantity < item.quantity) {
            throw new Error(`Insufficient inventory for ${item.product.name}. Available: ${currentQuantity}, Requested: ${item.quantity}`);
          }
          
          // Prepare inventory update
          inventory[inventoryIndex].quantity = currentQuantity - item.quantity;
          productRefs.set(item.productId, productRef);
          inventoryUpdates.set(item.productId, {
            inventory,
            updatedAt: serverTimestamp()
          });
        }
        
        // Create purchase document
        transaction.set(purchaseRef, {
          ...purchaseData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        // Update all product inventories
        for (const [productId, productRef] of productRefs) {
          const updates = inventoryUpdates.get(productId);
          transaction.update(productRef, updates);
        }
      });
      
      // Clear user's cart after successful transaction
      await CartService.clearCart(userId);

      const purchase: Purchase = {
        id: purchaseRef.id,
        ...purchaseData
      };

      return {
        success: true,
        data: purchase,
        message: 'Purchase created successfully'
      };
    } catch (error) {
      console.error('Error creating purchase:', error);
      return {
        success: false,
        error: 'Failed to create purchase'
      };
    }
  }

  /**
   * Get purchase by ID
   */
  static async getPurchaseById(purchaseId: string): Promise<ApiResponse<Purchase>> {
    try {
      const purchaseRef = doc(db, PURCHASES_COLLECTION, purchaseId);
      const purchaseSnap = await getDoc(purchaseRef);

      if (!purchaseSnap.exists()) {
        return {
          success: false,
          error: 'Purchase not found'
        };
      }

      const purchaseData = purchaseSnap.data() as PurchaseData;
      const purchase: Purchase = {
        id: purchaseSnap.id,
        ...purchaseData,
        createdAt: purchaseData.createdAt instanceof Timestamp ? purchaseData.createdAt.toDate() : purchaseData.createdAt,
        updatedAt: purchaseData.updatedAt instanceof Timestamp ? purchaseData.updatedAt.toDate() : purchaseData.updatedAt,
        shippedAt: purchaseData.shippedAt instanceof Timestamp ? purchaseData.shippedAt.toDate() : purchaseData.shippedAt,
        deliveredAt: purchaseData.deliveredAt instanceof Timestamp ? purchaseData.deliveredAt.toDate() : purchaseData.deliveredAt
      };

      return {
        success: true,
        data: purchase
      };
    } catch (error) {
      console.error('Error getting purchase:', error);
      return {
        success: false,
        error: 'Failed to fetch purchase'
      };
    }
  }

  /**
   * Get user's purchase history
   */
  static async getUserPurchases(
    userId: string,
    filters: PurchaseFilters = {},
    page: number = 1,
    pageLimit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Purchase>>> {
    try {
      const purchasesRef = collection(db, PURCHASES_COLLECTION);
      let q = query(purchasesRef, where('userId', '==', userId));

      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.startDate) {
        q = query(q, where('createdAt', '>=', filters.startDate));
      }
      if (filters.endDate) {
        q = query(q, where('createdAt', '<=', filters.endDate));
      }

      // Apply sorting
      q = query(q, orderBy('createdAt', 'desc'));

      // Apply pagination
      const offset = (page - 1) * pageLimit;
      if (offset > 0) {
        const prevQuery = query(q, limit(offset));
        const prevSnapshot = await getDocs(prevQuery);
        if (!prevSnapshot.empty) {
          const lastDoc = prevSnapshot.docs[prevSnapshot.docs.length - 1];
          q = query(q, startAfter(lastDoc), limit(pageLimit));
        }
      } else {
        q = query(q, limit(pageLimit));
      }

      const querySnapshot = await getDocs(q);
      
      let purchases: Purchase[] = querySnapshot.docs.map(doc => {
        const purchaseData = doc.data() as PurchaseData;
        return {
          id: doc.id,
          ...purchaseData,
          createdAt: purchaseData.createdAt instanceof Timestamp ? purchaseData.createdAt.toDate() : purchaseData.createdAt,
          updatedAt: purchaseData.updatedAt instanceof Timestamp ? purchaseData.updatedAt.toDate() : purchaseData.updatedAt,
          shippedAt: purchaseData.shippedAt instanceof Timestamp ? purchaseData.shippedAt.toDate() : purchaseData.shippedAt,
          deliveredAt: purchaseData.deliveredAt instanceof Timestamp ? purchaseData.deliveredAt.toDate() : purchaseData.deliveredAt
        };
      });

      // Client-side filtering for total amount (Firestore doesn't support range queries on multiple fields)
      if (filters.minTotal !== undefined || filters.maxTotal !== undefined) {
        purchases = purchases.filter(purchase => {
          if (filters.minTotal !== undefined && purchase.total < filters.minTotal) return false;
          if (filters.maxTotal !== undefined && purchase.total > filters.maxTotal) return false;
          return true;
        });
      }

      const hasMore = querySnapshot.docs.length === pageLimit;

      return {
        success: true,
        data: {
          data: purchases,
          total: purchases.length,
          page,
          limit: pageLimit,
          hasMore
        }
      };
    } catch (error) {
      console.error('Error getting user purchases:', error);
      return {
        success: false,
        error: 'Failed to fetch purchase history'
      };
    }
  }

  /**
   * Update purchase status
   */
  static async updatePurchaseStatus(
    purchaseId: string,
    status: PurchaseStatus,
    trackingNumber?: string
  ): Promise<ApiResponse<Purchase>> {
    try {
      const purchaseRef = doc(db, PURCHASES_COLLECTION, purchaseId);
      
      // Check if purchase exists
      const purchaseSnap = await getDoc(purchaseRef);
      if (!purchaseSnap.exists()) {
        return {
          success: false,
          error: 'Purchase not found'
        };
      }

      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };

      // Add tracking number if provided
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      // Add timestamp for specific statuses
      if (status === 'shipped') {
        updateData.shippedAt = serverTimestamp();
      } else if (status === 'delivered') {
        updateData.deliveredAt = serverTimestamp();
      }

      await updateDoc(purchaseRef, updateData);

      // Get updated purchase
      const updatedPurchaseSnap = await getDoc(purchaseRef);
      const purchaseData = updatedPurchaseSnap.data() as PurchaseData;
      const purchase: Purchase = {
        id: updatedPurchaseSnap.id,
        ...purchaseData,
        createdAt: purchaseData.createdAt instanceof Timestamp ? purchaseData.createdAt.toDate() : purchaseData.createdAt,
        updatedAt: purchaseData.updatedAt instanceof Timestamp ? purchaseData.updatedAt.toDate() : purchaseData.updatedAt,
        shippedAt: purchaseData.shippedAt instanceof Timestamp ? purchaseData.shippedAt.toDate() : purchaseData.shippedAt,
        deliveredAt: purchaseData.deliveredAt instanceof Timestamp ? purchaseData.deliveredAt.toDate() : purchaseData.deliveredAt
      };

      return {
        success: true,
        data: purchase,
        message: 'Purchase status updated successfully'
      };
    } catch (error) {
      console.error('Error updating purchase status:', error);
      return {
        success: false,
        error: 'Failed to update purchase status'
      };
    }
  }

  /**
   * Cancel purchase (only if status is pending or confirmed)
   */
  static async cancelPurchase(purchaseId: string, reason?: string): Promise<ApiResponse<Purchase>> {
    try {
      const purchaseRef = doc(db, PURCHASES_COLLECTION, purchaseId);
      const purchaseSnap = await getDoc(purchaseRef);

      if (!purchaseSnap.exists()) {
        return {
          success: false,
          error: 'Purchase not found'
        };
      }

      const purchaseData = purchaseSnap.data() as PurchaseData;
      
      // Check if purchase can be cancelled
      if (!['pending', 'confirmed'].includes(purchaseData.status)) {
        return {
          success: false,
          error: 'Purchase cannot be cancelled at this stage'
        };
      }

      // Restore inventory for each item
      for (const item of purchaseData.items) {
        const productResult = await ProductService.updateInventory(
          item.productId,
          item.size,
          item.color,
          item.quantity // Add back the quantity
        );
        
        if (!productResult.success) {
          console.warn(`Failed to restore inventory for ${item.product.name}: ${productResult.error}`);
        }
      }

      // Update purchase status
      const updateData = {
        status: 'cancelled' as PurchaseStatus,
        notes: reason ? `${purchaseData.notes || ''} | Cancelled: ${reason}` : purchaseData.notes,
        updatedAt: serverTimestamp()
      };

      await updateDoc(purchaseRef, updateData);

      // Get updated purchase
      const updatedPurchaseSnap = await getDoc(purchaseRef);
      const updatedPurchaseData = updatedPurchaseSnap.data() as PurchaseData;
      const purchase: Purchase = {
        id: updatedPurchaseSnap.id,
        ...updatedPurchaseData,
        createdAt: updatedPurchaseData.createdAt instanceof Timestamp ? updatedPurchaseData.createdAt.toDate() : updatedPurchaseData.createdAt,
        updatedAt: updatedPurchaseData.updatedAt instanceof Timestamp ? updatedPurchaseData.updatedAt.toDate() : updatedPurchaseData.updatedAt,
        shippedAt: updatedPurchaseData.shippedAt instanceof Timestamp ? updatedPurchaseData.shippedAt.toDate() : updatedPurchaseData.shippedAt,
        deliveredAt: updatedPurchaseData.deliveredAt instanceof Timestamp ? updatedPurchaseData.deliveredAt.toDate() : updatedPurchaseData.deliveredAt
      };

      return {
        success: true,
        data: purchase,
        message: 'Purchase cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling purchase:', error);
      return {
        success: false,
        error: 'Failed to cancel purchase'
      };
    }
  }

  /**
   * Get all purchases (admin function)
   */
  static async getAllPurchases(
    filters: PurchaseFilters = {},
    page: number = 1,
    pageLimit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Purchase>>> {
    try {
      const purchasesRef = collection(db, PURCHASES_COLLECTION);
      let q = query(purchasesRef);

      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.startDate) {
        q = query(q, where('createdAt', '>=', filters.startDate));
      }
      if (filters.endDate) {
        q = query(q, where('createdAt', '<=', filters.endDate));
      }

      // Apply sorting
      q = query(q, orderBy('createdAt', 'desc'));

      // Apply pagination
      const offset = (page - 1) * pageLimit;
      if (offset > 0) {
        const prevQuery = query(q, limit(offset));
        const prevSnapshot = await getDocs(prevQuery);
        if (!prevSnapshot.empty) {
          const lastDoc = prevSnapshot.docs[prevSnapshot.docs.length - 1];
          q = query(q, startAfter(lastDoc), limit(pageLimit));
        }
      } else {
        q = query(q, limit(pageLimit));
      }

      const querySnapshot = await getDocs(q);
      
      let purchases: Purchase[] = querySnapshot.docs.map(doc => {
        const purchaseData = doc.data() as PurchaseData;
        return {
          id: doc.id,
          ...purchaseData,
          createdAt: purchaseData.createdAt instanceof Timestamp ? purchaseData.createdAt.toDate() : purchaseData.createdAt,
          updatedAt: purchaseData.updatedAt instanceof Timestamp ? purchaseData.updatedAt.toDate() : purchaseData.updatedAt,
          shippedAt: purchaseData.shippedAt instanceof Timestamp ? purchaseData.shippedAt.toDate() : purchaseData.shippedAt,
          deliveredAt: purchaseData.deliveredAt instanceof Timestamp ? purchaseData.deliveredAt.toDate() : purchaseData.deliveredAt
        };
      });

      // Client-side filtering for total amount
      if (filters.minTotal !== undefined || filters.maxTotal !== undefined) {
        purchases = purchases.filter(purchase => {
          if (filters.minTotal !== undefined && purchase.total < filters.minTotal) return false;
          if (filters.maxTotal !== undefined && purchase.total > filters.maxTotal) return false;
          return true;
        });
      }

      const hasMore = querySnapshot.docs.length === pageLimit;

      return {
        success: true,
        data: {
          data: purchases,
          total: purchases.length,
          page,
          limit: pageLimit,
          hasMore
        }
      };
    } catch (error) {
      console.error('Error getting all purchases:', error);
      return {
        success: false,
        error: 'Failed to fetch purchases'
      };
    }
  }

  /**
   * Get purchase statistics
   */
  static async getPurchaseStats(userId?: string): Promise<ApiResponse<{
    totalPurchases: number;
    totalSpent: number;
    averageOrderValue: number;
    statusBreakdown: Record<PurchaseStatus, number>;
  }>> {
    try {
      const purchasesRef = collection(db, PURCHASES_COLLECTION);
      let q = query(purchasesRef);
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }

      const querySnapshot = await getDocs(q);
      
      const purchases = querySnapshot.docs.map(doc => doc.data() as PurchaseData);
      
      const totalPurchases = purchases.length;
      const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
      const averageOrderValue = totalPurchases > 0 ? totalSpent / totalPurchases : 0;
      
      const statusBreakdown: Record<PurchaseStatus, number> = {
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0
      };
      
      purchases.forEach(purchase => {
        statusBreakdown[purchase.status]++;
      });

      return {
        success: true,
        data: {
          totalPurchases,
          totalSpent,
          averageOrderValue,
          statusBreakdown
        }
      };
    } catch (error) {
      console.error('Error getting purchase stats:', error);
      return {
        success: false,
        error: 'Failed to fetch purchase statistics'
      };
    }
  }

  /**
   * Search purchases by tracking number
   */
  static async searchByTrackingNumber(trackingNumber: string): Promise<ApiResponse<Purchase>> {
    try {
      const purchasesRef = collection(db, PURCHASES_COLLECTION);
      const q = query(purchasesRef, where('trackingNumber', '==', trackingNumber));
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return {
          success: false,
          error: 'No purchase found with this tracking number'
        };
      }
      
      const purchaseDoc = querySnapshot.docs[0];
      const purchaseData = purchaseDoc.data() as PurchaseData;
      const purchase: Purchase = {
        id: purchaseDoc.id,
        ...purchaseData,
        createdAt: purchaseData.createdAt instanceof Timestamp ? purchaseData.createdAt.toDate() : purchaseData.createdAt,
        updatedAt: purchaseData.updatedAt instanceof Timestamp ? purchaseData.updatedAt.toDate() : purchaseData.updatedAt,
        shippedAt: purchaseData.shippedAt instanceof Timestamp ? purchaseData.shippedAt.toDate() : purchaseData.shippedAt,
        deliveredAt: purchaseData.deliveredAt instanceof Timestamp ? purchaseData.deliveredAt.toDate() : purchaseData.deliveredAt
      };

      return {
        success: true,
        data: purchase
      };
    } catch (error) {
      console.error('Error searching by tracking number:', error);
      return {
        success: false,
        error: 'Failed to search by tracking number'
      };
    }
  }
}