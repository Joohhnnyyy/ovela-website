import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { CartItem } from '@/types/database';

type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export interface CreateOrderData {
  items: CartItem[];
  shippingAddress: {
    name: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}

class OrderService {
  // Generate a unique order number
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `OV${timestamp}${random}`;
  }

  // Create a new order
  async createOrder(orderData: CreateOrderData, userId?: string): Promise<Order> {
    try {
      const orderItems: OrderItem[] = orderData.items.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '/products/placeholder.svg',
        size: item.size,
        color: item.color
      }));

      const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18; // 18% GST
      const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
      const total = subtotal + tax + shipping;

      // Create order in Supabase
      const orderInsert: OrderInsert = {
        order_number: this.generateOrderNumber(),
        user_id: userId || null,
        guest_email: !userId ? `${orderData.shippingAddress.firstName.toLowerCase()}.${orderData.shippingAddress.lastName.toLowerCase()}@guest.com` : null,
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        tax_amount: tax,
        shipping_amount: shipping,
        discount_amount: 0,
        total_amount: total,
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod,
        order_date: new Date().toISOString()
      };

      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsInsert: OrderItemInsert[] = orderItems.map(item => ({
        order_id: createdOrder.id,
        product_id: item.productId,
        product_name: item.name,
        product_sku: `SKU-${item.productId}`,
        product_image_url: item.image,
        size: item.size || null,
        color: item.color || null,
        unit_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsInsert);

      if (itemsError) throw itemsError;

      const order: Order = {
        id: createdOrder.id,
        orderNumber: createdOrder.order_number,
        date: createdOrder.order_date,
        orderDate: new Date(createdOrder.order_date),
        status: createdOrder.status as Order['status'],
        items: orderItems,
        subtotal: createdOrder.subtotal,
        tax: createdOrder.tax_amount,
        shipping: createdOrder.shipping_amount,
        total: createdOrder.total_amount,
        shippingAddress: createdOrder.shipping_address as Order['shippingAddress'],
        trackingNumber: createdOrder.tracking_number || undefined
      };

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Get all orders for a user
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('order_date', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: ordersData, error } = await query;

      if (error) throw error;

      const orders: Order[] = ordersData.map(orderRow => {
        const items: OrderItem[] = orderRow.order_items.map((item: any) => ({
          productId: item.product_id,
          name: item.product_name,
          price: item.unit_price,
          quantity: item.quantity,
          image: item.product_image_url || '/products/placeholder.svg'
        }));

        return {
          id: orderRow.id,
          orderNumber: orderRow.order_number,
          date: orderRow.order_date,
          orderDate: new Date(orderRow.order_date),
          status: orderRow.status as Order['status'],
          items,
          subtotal: orderRow.subtotal,
          tax: orderRow.tax_amount,
          shipping: orderRow.shipping_amount,
          total: orderRow.total_amount,
          shippingAddress: orderRow.shipping_address as Order['shippingAddress'],
          trackingNumber: orderRow.tracking_number || undefined
        };
      });

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Get orders for a specific user
  async getUserOrders(userId: string): Promise<Order[]> {
    return this.getOrders(userId);
  }

  // Get a specific order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      if (!orderData) return null;

      const items: OrderItem[] = orderData.order_items.map((item: any) => ({
        productId: item.product_id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity,
        image: item.product_image_url || '/products/placeholder.svg'
      }));

      return {
        id: orderData.id,
        orderNumber: orderData.order_number,
        date: orderData.order_date,
        orderDate: new Date(orderData.order_date),
        status: orderData.status as Order['status'],
        items,
        subtotal: orderData.subtotal,
        tax: orderData.tax_amount,
        shipping: orderData.shipping_amount,
        total: orderData.total_amount,
        shippingAddress: orderData.shipping_address as Order['shippingAddress'],
        trackingNumber: orderData.tracking_number || undefined
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string): Promise<Order | null> {
    try {
      const updateData: any = { status };
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }
      if (status === 'shipped') {
        updateData.shipped_date = new Date().toISOString();
      }
      if (status === 'delivered') {
        updateData.delivered_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      return await this.getOrder(orderId);
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  }

  // Cancel an order
  async cancelOrder(orderId: string): Promise<boolean> {
    const order = await this.updateOrderStatus(orderId, 'cancelled');
    return order !== null;
  }



  // Get order status display text
  getStatusDisplay(status: Order['status']): string {
    const statusMap = {
      pending: 'Order Placed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  }

  // Get order status color
  getStatusColor(status: Order['status']): string {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      case 'shipped':
        return 'text-purple-400';
      case 'delivered':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  }

  getStatusText(status: Order['status']): string {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  // Generate tracking number
  generateTrackingNumber(): string {
    const prefix = 'TRK';
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp.slice(-6)}${random}`;
  }

  // Get orders count for a user
  async getOrdersCount(userId?: string): Promise<number> {
    try {
      let query = supabase
        .from('orders')
        .select('id', { count: 'exact', head: true });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { count, error } = await query;

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting orders count:', error);
      return 0;
    }
  }

  // Get recent orders
  async getRecentOrders(userId?: string, limit: number = 5): Promise<Order[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('order_date', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: ordersData, error } = await query;

      if (error) throw error;

      const orders: Order[] = ordersData.map(orderRow => {
        const items: OrderItem[] = orderRow.order_items.map((item: any) => ({
          productId: item.product_id,
          name: item.product_name,
          price: item.unit_price,
          quantity: item.quantity,
          image: item.product_image_url || '/products/placeholder.svg'
        }));

        return {
          id: orderRow.id,
          orderNumber: orderRow.order_number,
          date: orderRow.order_date,
          orderDate: new Date(orderRow.order_date),
          status: orderRow.status as Order['status'],
          items,
          subtotal: orderRow.subtotal,
          tax: orderRow.tax_amount,
          shipping: orderRow.shipping_amount,
          total: orderRow.total_amount,
          shippingAddress: orderRow.shipping_address as Order['shippingAddress'],
          trackingNumber: orderRow.tracking_number || undefined
        };
      });

      return orders;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  }
}

export const orderService = new OrderService();
export default orderService;