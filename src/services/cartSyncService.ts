import { supabase } from '@/lib/supabase';
import { Cart, CartItem, ApiResponse } from '@/types/database';
import { CartService } from './cartService';

interface CartSyncData {
  user_id: string;
  cart_data: {
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
  };
  last_modified: string;
  device_id?: string;
  sync_version: number;
}

interface SyncConflict {
  localCart: Cart;
  serverCart: CartSyncData;
  conflictType: 'local_newer' | 'server_newer' | 'merge_required';
}

export class CartSyncService {
  private static readonly SYNC_INTERVAL = 30000; // 30 seconds
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static syncIntervals = new Map<string, NodeJS.Timeout>();
  private static deviceId: string;

  /**
   * Initialize device ID for conflict resolution
   */
  static initializeDeviceId(): void {
    if (typeof window === 'undefined') return;
    
    let deviceId = localStorage.getItem('ovela_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ovela_device_id', deviceId);
    }
    this.deviceId = deviceId;
  }

  /**
   * Start automatic cart synchronization for a user
   */
  static startAutoSync(userId: string): void {
    if (!userId || this.syncIntervals.has(userId)) return;

    // Initial sync
    this.syncCart(userId);

    // Set up periodic sync
    const interval = setInterval(() => {
      this.syncCart(userId);
    }, this.SYNC_INTERVAL);

    this.syncIntervals.set(userId, interval);
  }

  /**
   * Stop automatic cart synchronization for a user
   */
  static stopAutoSync(userId: string): void {
    const interval = this.syncIntervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(userId);
    }
  }

  /**
   * Perform bidirectional cart synchronization
   */
  static async syncCart(userId: string): Promise<ApiResponse<Cart>> {
    try {
      // Get local cart
      const localCartResult = await CartService.getUserCart(userId);
      if (!localCartResult.success || !localCartResult.data) {
        return { success: false, error: 'Failed to get local cart' };
      }

      const localCart = localCartResult.data;

      // Get server cart
      const serverCartResult = await this.getServerCart(userId);
      
      if (!serverCartResult.success) {
        // Server cart doesn't exist, upload local cart
        return await this.uploadCart(userId, localCart);
      }

      const serverCart = serverCartResult.data!;

      // Check for conflicts
      const conflict = this.detectConflict(localCart, serverCart);
      
      if (!conflict) {
        // No conflict, carts are in sync
        return { success: true, data: localCart };
      }

      // Resolve conflict
      const resolvedCart = await this.resolveConflict(conflict);
      
      if (!resolvedCart.success) {
        return resolvedCart;
      }

      // Update both local and server with resolved cart
      await CartService.setLocalCart(userId, resolvedCart.data!);
      await this.uploadCart(userId, resolvedCart.data!);

      return resolvedCart;
    } catch (error) {
      console.error('Cart sync error:', error);
      return { success: false, error: 'Cart synchronization failed' };
    }
  }

  /**
   * Get cart data from server
   */
  private static async getServerCart(userId: string): Promise<ApiResponse<CartSyncData>> {
    try {
      const { data, error } = await (supabase as any).rpc('get_cart_sync', {
        p_user_id: userId
      });

      if (error) {
        if (error.code === 'PGRST116') {
          // No cart found
          return { success: false, error: 'Cart not found' };
        }
        throw error;
      }

      return { success: true, data: data?.[0] || null };
    } catch (error) {
      console.error('Error getting server cart:', error);
      return { success: false, error: 'Failed to get server cart' };
    }
  }

  /**
   * Upload cart to server
   */
  private static async uploadCart(userId: string, cart: Cart): Promise<ApiResponse<Cart>> {
    try {
      const { error } = await (supabase as any).rpc('upsert_cart_sync', {
        p_user_id: userId,
        p_cart_data: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          totalItems: cart.totalItems
        },
        p_device_id: this.deviceId
      });

      if (error) {
        throw error;
      }

      return { success: true, data: cart };
    } catch (error) {
      console.error('Error uploading cart:', error);
      return { success: false, error: 'Failed to upload cart' };
    }
  }

  /**
   * Detect synchronization conflicts
   */
  private static detectConflict(localCart: Cart, serverCart: CartSyncData): SyncConflict | null {
    const localModified = localCart.updatedAt.getTime();
    const serverModified = new Date(serverCart.last_modified).getTime();
    const timeDiff = Math.abs(localModified - serverModified);

    // If timestamps are very close (within 5 seconds), consider them the same
    if (timeDiff < 5000) {
      return null;
    }

    // Determine conflict type
    let conflictType: SyncConflict['conflictType'];
    
    if (localModified > serverModified) {
      conflictType = 'local_newer';
    } else if (serverModified > localModified) {
      conflictType = 'server_newer';
    } else {
      // Same timestamp but different content
      conflictType = 'merge_required';
    }

    return {
      localCart,
      serverCart,
      conflictType
    };
  }

  /**
   * Resolve synchronization conflicts
   */
  private static async resolveConflict(conflict: SyncConflict): Promise<ApiResponse<Cart>> {
    try {
      switch (conflict.conflictType) {
        case 'local_newer':
          // Local cart is newer, use local version
          return { success: true, data: conflict.localCart };

        case 'server_newer':
          // Server cart is newer, use server version
          const serverCart: Cart = {
            id: conflict.localCart.id,
            userId: conflict.localCart.userId,
            items: conflict.serverCart.cart_data.items,
            totalPrice: conflict.serverCart.cart_data.totalPrice,
            totalItems: conflict.serverCart.cart_data.totalItems,
            createdAt: conflict.localCart.createdAt,
            updatedAt: new Date(conflict.serverCart.last_modified)
          };
          return { success: true, data: serverCart };

        case 'merge_required':
          // Merge both carts intelligently
          return await this.mergeCarts(conflict.localCart, conflict.serverCart);

        default:
          return { success: false, error: 'Unknown conflict type' };
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
      return { success: false, error: 'Failed to resolve sync conflict' };
    }
  }

  /**
   * Intelligently merge two carts
   */
  private static async mergeCarts(localCart: Cart, serverCartData: CartSyncData): Promise<ApiResponse<Cart>> {
    try {
      const mergedItems = new Map<string, CartItem>();
      
      // Add all local items
      localCart.items.forEach(item => {
        const key = `${item.productId}_${item.size}_${item.color}`;
        mergedItems.set(key, { ...item });
      });

      // Merge server items
      serverCartData.cart_data.items.forEach(serverItem => {
        const key = `${serverItem.productId}_${serverItem.size}_${serverItem.color}`;
        const localItem = mergedItems.get(key);

        if (localItem) {
          // Item exists in both, use higher quantity
          if (serverItem.quantity > localItem.quantity) {
            mergedItems.set(key, { ...serverItem });
          }
        } else {
          // Item only exists on server, add it
          mergedItems.set(key, { ...serverItem });
        }
      });

      const mergedItemsArray = Array.from(mergedItems.values());
      const { totalItems, totalPrice } = CartService.calculateCartTotals(mergedItemsArray);

      const mergedCart: Cart = {
        id: localCart.id,
        userId: localCart.userId,
        items: mergedItemsArray,
        totalPrice,
        totalItems,
        createdAt: localCart.createdAt,
        updatedAt: new Date()
      };

      return { success: true, data: mergedCart };
    } catch (error) {
      console.error('Error merging carts:', error);
      return { success: false, error: 'Failed to merge carts' };
    }
  }

  /**
   * Force sync cart immediately
   */
  static async forceSyncCart(userId: string): Promise<ApiResponse<Cart>> {
    return await this.syncCart(userId);
  }

  /**
   * Clear server cart data
   */
  static async clearServerCart(userId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await (supabase as any).rpc('delete_cart_sync', {
        p_user_id: userId
      });

      if (error) {
        throw error;
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error('Error clearing server cart:', error);
      return { success: false, error: 'Failed to clear server cart' };
    }
  }

  /**
   * Get sync status for debugging
   */
  static async getSyncStatus(userId: string): Promise<ApiResponse<{
    localLastModified: Date;
    serverLastModified: Date | null;
    isInSync: boolean;
    deviceId: string;
  }>> {
    try {
      const localCartResult = await CartService.getUserCart(userId);
      if (!localCartResult.success) {
        return { success: false, error: 'Failed to get local cart' };
      }

      const serverCartResult = await this.getServerCart(userId);
      
      const status = {
        localLastModified: localCartResult.data!.updatedAt,
        serverLastModified: serverCartResult.success ? new Date(serverCartResult.data!.last_modified) : null,
        isInSync: false,
        deviceId: this.deviceId
      };

      if (status.serverLastModified) {
        const timeDiff = Math.abs(status.localLastModified.getTime() - status.serverLastModified.getTime());
        status.isInSync = timeDiff < 5000; // Within 5 seconds
      }

      return { success: true, data: status };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return { success: false, error: 'Failed to get sync status' };
    }
  }
}

// Initialize device ID when module loads
if (typeof window !== 'undefined') {
  CartSyncService.initializeDeviceId();
}