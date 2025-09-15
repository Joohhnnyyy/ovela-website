'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderService, Order } from '@/services/orderService';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilterValue, setStatusFilterValue] = useState(statusFilter || 'all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilterValue]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const allOrders = await orderService.getOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilterValue !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilterValue);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/dashboard')}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Order Management</h1>
              <p className="text-gray-400">Manage and track all orders</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by order number or customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilterValue} onValueChange={setStatusFilterValue}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
                <p className="text-gray-400">No orders match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{order.orderNumber}</h3>
                        <Badge className={`border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ₹{order.total.toFixed(2)}
                        </div>
                        <span>{order.shippingAddress.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                      >
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Order Details</CardTitle>
                    <CardDescription className="text-gray-400">{selectedOrder.orderNumber}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Shipping Address</h4>
                  <div className="p-3 bg-gray-700/50 rounded-lg text-gray-300">
                    <p className="font-medium text-white">{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
                  <div className="space-y-2 p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax:</span>
                      <span>₹{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping:</span>
                      <span>₹{selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2 flex justify-between text-white font-semibold">
                      <span>Total:</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}