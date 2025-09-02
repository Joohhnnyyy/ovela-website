import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type InventoryRow = Database['public']['Tables']['inventory']['Row'];
type InventoryInsert = Database['public']['Tables']['inventory']['Insert'];
type InventoryUpdate = Database['public']['Tables']['inventory']['Update'];
type InventoryMovementInsert = Database['public']['Tables']['inventory_movements']['Insert'];

export interface InventoryItem {
  id: string;
  productId: string | null;
  variantId: string | null;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number | null;
  maxStockLevel: number | null;
  location: string;
  lastRestockedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  inventoryId: string;
  movementType: 'in' | 'out' | 'adjustment' | 'reserved' | 'released';
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  reason: string | null;
  performedBy: string | null;
  createdAt: string;
}

export interface StockCheckResult {
  productId: string;
  variantId?: string;
  available: boolean;
  quantity: number;
  requestedQuantity: number;
}

class InventoryService {
  // Get inventory for a specific product or variant
  async getInventory(productId: string, variantId?: string): Promise<InventoryItem | null> {
    try {
      let query = supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId);

      if (variantId) {
        query = query.eq('variant_id', variantId);
      } else {
        query = query.is('variant_id', null);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return this.mapInventoryRow(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return null;
    }
  }

  // Get all inventory items
  async getAllInventory(): Promise<InventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map(this.mapInventoryRow);
    } catch (error) {
      console.error('Error fetching all inventory:', error);
      return [];
    }
  }

  // Check stock availability for multiple items
  async checkStockAvailability(items: { productId: string; variantId?: string; quantity: number }[]): Promise<StockCheckResult[]> {
    const results: StockCheckResult[] = [];

    for (const item of items) {
      const inventory = await this.getInventory(item.productId, item.variantId);
      
      if (!inventory) {
        results.push({
          productId: item.productId,
          variantId: item.variantId,
          available: false,
          quantity: 0,
          requestedQuantity: item.quantity
        });
        continue;
      }

      const availableQuantity = inventory.quantity - inventory.reservedQuantity;
      results.push({
        productId: item.productId,
        variantId: item.variantId,
        available: availableQuantity >= item.quantity,
        quantity: availableQuantity,
        requestedQuantity: item.quantity
      });
    }

    return results;
  }

  // Reserve stock for an order
  async reserveStock(items: { productId: string; variantId?: string; quantity: number }[], orderId: string): Promise<boolean> {
    try {
      // Check availability first
      const stockCheck = await this.checkStockAvailability(items);
      const unavailableItems = stockCheck.filter(item => !item.available);
      
      if (unavailableItems.length > 0) {
        console.error('Insufficient stock for items:', unavailableItems);
        return false;
      }

      // Use transaction to ensure atomicity
      const { data, error } = await (supabase as any).rpc('reserve_stock_atomic', {
        items_data: items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId || null,
          quantity: item.quantity
        })),
        order_id: orderId
      });

      if (error) {
        console.error('Error in atomic stock reservation:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error reserving stock:', error);
      return false;
    }
  }

  // Release reserved stock (e.g., when order is cancelled)
  async releaseReservedStock(items: { productId: string; variantId?: string; quantity: number }[], orderId: string): Promise<boolean> {
    try {
      // Use transaction to ensure atomicity
      const { data, error } = await (supabase as any).rpc('release_reserved_stock_atomic', {
        items_data: items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId || null,
          quantity: item.quantity
        })),
        order_id: orderId
      });

      if (error) {
        console.error('Error in atomic stock release:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error releasing reserved stock:', error);
      return false;
    }
  }

  // Fulfill order (convert reserved stock to sold)
  async fulfillOrder(items: { productId: string; variantId?: string; quantity: number }[], orderId: string): Promise<boolean> {
    try {
      // Use transaction to ensure atomicity
      const { data, error } = await (supabase as any).rpc('fulfill_order_atomic', {
        items_data: items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId || null,
          quantity: item.quantity
        })),
        order_id: orderId
      });

      if (error) {
        console.error('Error in atomic order fulfillment:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error fulfilling order:', error);
      return false;
    }
  }

  // Add stock (restock)
  async addStock(productId: string, quantity: number, variantId?: string, location: string = 'main', reason?: string, performedBy?: string): Promise<boolean> {
    try {
      let inventory = await this.getInventory(productId, variantId);

      if (!inventory) {
        // Create new inventory record
        const inventoryInsert: InventoryInsert = {
          product_id: productId,
          variant_id: variantId || null,
          quantity,
          reserved_quantity: 0,
          location,
          last_restocked_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('inventory')
          .insert(inventoryInsert)
          .select()
          .single();

        if (error) throw error;
        inventory = this.mapInventoryRow(data);
      } else {
        // Update existing inventory
        const { error: updateError } = await supabase
          .from('inventory')
          .update({
            quantity: inventory.quantity + quantity,
            last_restocked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', inventory.id);

        if (updateError) throw updateError;
      }

      // Record movement
      await this.recordMovement({
        inventory_id: inventory.id,
        movement_type: 'in',
        quantity,
        reason: reason || 'Stock added',
        performed_by: performedBy || null
      });

      return true;
    } catch (error) {
      console.error('Error adding stock:', error);
      return false;
    }
  }

  // Adjust stock (for corrections)
  async adjustStock(productId: string, newQuantity: number, variantId?: string, reason?: string, performedBy?: string): Promise<boolean> {
    try {
      const inventory = await this.getInventory(productId, variantId);
      if (!inventory) {
        console.error('Inventory not found for adjustment');
        return false;
      }

      const difference = newQuantity - inventory.quantity;
      
      const { error: updateError } = await supabase
        .from('inventory')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', inventory.id);

      if (updateError) throw updateError;

      // Record movement
      await this.recordMovement({
        inventory_id: inventory.id,
        movement_type: 'adjustment',
        quantity: Math.abs(difference),
        reason: reason || `Stock adjustment: ${difference > 0 ? 'increase' : 'decrease'}`,
        performed_by: performedBy || null
      });

      return true;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      return false;
    }
  }

  // Get stock movements for an inventory item
  async getStockMovements(inventoryId: string, limit: number = 50): Promise<StockMovement[]> {
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .eq('inventory_id', inventoryId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(movement => ({
        id: movement.id,
        inventoryId: movement.inventory_id,
        movementType: movement.movement_type as StockMovement['movementType'],
        quantity: movement.quantity,
        referenceType: movement.reference_type,
        referenceId: movement.reference_id,
        reason: movement.reason,
        performedBy: movement.performed_by,
        createdAt: movement.created_at
      }));
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      return [];
    }
  }

  // Get low stock items
  async getLowStockItems(): Promise<InventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .not('reorder_level', 'is', null)
        .filter('quantity', 'lte', 'reorder_level');

      if (error) throw error;

      return data.map(this.mapInventoryRow);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      return [];
    }
  }

  // Private helper methods
  private mapInventoryRow(row: InventoryRow): InventoryItem {
    return {
      id: row.id,
      productId: row.product_id,
      variantId: row.variant_id,
      quantity: row.quantity,
      reservedQuantity: row.reserved_quantity,
      availableQuantity: row.quantity - row.reserved_quantity,
      reorderLevel: row.reorder_level,
      maxStockLevel: row.max_stock_level,
      location: row.location,
      lastRestockedAt: row.last_restocked_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private async recordMovement(movement: InventoryMovementInsert): Promise<void> {
    try {
      const { error } = await supabase
        .from('inventory_movements')
        .insert(movement);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording stock movement:', error);
      // Don't throw here as it's a logging operation
    }
  }
}

// Export singleton instance
export const inventoryService = new InventoryService();
export default inventoryService;