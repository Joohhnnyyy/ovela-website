'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Eye, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { orderService, Order } from '@/services/orderService';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // Scroll animations
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const footerY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, router]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setIsLoading(true);
        const userOrders = await orderService.getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Navigation */}
      <Navigation />
      

      
      {/* Animated background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black opacity-50"
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-8 pt-24 pb-32 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link
              href="/"
              className="group flex items-center space-x-3 text-white/60 hover:text-white/90 transition-colors duration-300"
            >
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span className="font-light tracking-wider uppercase text-sm">Back to Home</span>
            </Link>
          </motion.div>
          
          <motion.h1 
            className="text-4xl lg:text-6xl font-light mb-4 text-white/90 tracking-wider uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Order History
          </motion.h1>
          
          <motion.p 
            className="text-white/50 text-lg font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Track your orders and view your purchase history
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              className="w-16 h-16 border-2 border-white/20 border-t-white/60 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.p 
              className="mt-6 text-white/60 font-light tracking-wider uppercase text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Loading your orders...
            </motion.p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
            >
              <XCircle className="w-8 h-8 text-red-400" />
            </motion.div>
            <h2 className="text-2xl font-light mb-4 text-white/80 tracking-wider uppercase">{error}</h2>
            <motion.button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-light tracking-wider uppercase text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        {/* Orders Content */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {orders.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, duration: 1.2, type: "spring", stiffness: 150, damping: 25 }}
                  className="relative mb-8"
                >
                  <div className="w-24 h-24 mx-auto relative">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
                    />
                    <ShoppingBag className="w-24 h-24 text-white/40 relative z-10" />
                  </div>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl lg:text-4xl font-light mb-6 text-white/80 tracking-wider uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  No Orders Yet
                </motion.h2>
                
                <motion.p 
                  className="text-white/50 mb-12 max-w-lg mx-auto text-lg font-light leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  You haven't placed any orders yet. Start exploring our premium collection to see your order history here.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link
                    href="/"
                    className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-light tracking-wider uppercase text-sm"
                  >
                    <motion.span
                      className="mr-2"
                      whileHover={{ x: -5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      Start Shopping
                    </motion.span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                      →
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              /* Orders List */
              <div className="space-y-8">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.2,
                      duration: 1.2,
                      type: "spring",
                      stiffness: 150,
                      damping: 25
                    }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 group"
                  >
                    {/* Order Header */}
                    <div className="p-8 border-b border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="space-y-2">
                          <motion.h3 
                            className="text-xl font-light text-white/90 tracking-wider uppercase"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 + 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            Order #{order.id.slice(-8).toUpperCase()}
                          </motion.h3>
                          <motion.p 
                            className="text-sm text-white/50 font-light"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 + 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            Placed on {formatDate(new Date(order.date))}
                          </motion.p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-3">
                          <motion.span 
                            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-light tracking-wider uppercase backdrop-blur-sm ${
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                              order.status === 'processing' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              order.status === 'shipped' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              'bg-white/10 text-white/70 border border-white/20'
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 + 0.7, duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </motion.span>
                          <motion.p 
                            className="text-2xl font-light text-white tracking-wide"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 + 0.9, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            ${order.total}
                          </motion.p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-8 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <motion.div 
                          className="flex -space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 1.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          {order.items.slice(0, 3).map((item, itemIndex) => (
                            <motion.div 
                              key={itemIndex} 
                              className="w-16 h-16 rounded-xl border-2 border-white/20 overflow-hidden relative backdrop-blur-sm bg-white/5 hover:border-white/40 transition-all duration-500"
                              initial={{ opacity: 0, scale: 0.3, rotateY: 90, z: -100 }}
                              animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
                              transition={{ 
                                delay: index * 0.2 + 1.3 + itemIndex * 0.15, 
                                duration: 1.2, 
                                type: "spring", 
                                stiffness: 120, 
                                damping: 15,
                                rotateY: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }
                              }}
                              whileHover={{ 
                                scale: 1.15, 
                                rotateY: 15, 
                                z: 20,
                                transition: { duration: 0.3, ease: "easeOut" }
                              }}
                            >
                              <Image
                                src={imageErrors.has(item.image) ? '/products/placeholder.svg' : item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                onError={() => {
                                  setImageErrors(prev => new Set([...prev, item.image]));
                                }}
                              />
                            </motion.div>
                          ))}
                          {order.items.length > 3 && (
                            <motion.div 
                              className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-xs font-light tracking-wider text-white/70"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.2 + 1.5, duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              +{order.items.length - 3}
                            </motion.div>
                          )}
                        </motion.div>
                        <motion.div 
                          className="flex-1 space-y-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 1.7, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <p className="text-white/60 text-sm font-light">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-white/40 text-xs font-light tracking-wide">
                              Tracking: {order.trackingNumber}
                            </p>
                          )}
                        </motion.div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div 
                        className="flex items-center space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 1.9, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <motion.button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="group flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-sm font-light tracking-wider uppercase"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            animate={{ rotate: selectedOrder?.id === order.id ? 180 : 0 }}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            <Eye className="w-4 h-4 group-hover:text-white/90 transition-colors" />
                          </motion.div>
                          <span className="group-hover:text-white/90 transition-colors">
                            {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                          </span>
                        </motion.button>
                        {order.status === 'shipped' && (
                          <motion.button 
                            className="group px-6 py-3 border border-white/20 hover:border-white/30 hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-light tracking-wider uppercase backdrop-blur-sm"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="group-hover:text-white/90 transition-colors">Track Order</span>
                          </motion.button>
                        )}
                      </motion.div>
                    </div>

                    {/* Expandable Order Details */}
                    {selectedOrder?.id === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="p-8 bg-white/5 backdrop-blur-sm border-t border-white/10"
                      >
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Items List */}
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            <h4 className="text-xl font-light mb-6 text-white/90 tracking-wider uppercase">Items Ordered</h4>
                            <div className="space-y-4">
                              {order.items.map((item, itemIndex) => (
                                <motion.div 
                                  key={itemIndex} 
                                  className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 + itemIndex * 0.2, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                >
                                  <motion.div 
                                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20"
                                    initial={{ opacity: 0, scale: 0.4, rotateZ: -180 }}
                                    animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                                    transition={{
                                      delay: 0.6 + itemIndex * 0.2 + 0.3,
                                      duration: 1.4,
                                      type: "spring",
                                      stiffness: 100,
                                      damping: 18,
                                      rotateZ: { duration: 1.2, ease: [0.68, -0.55, 0.265, 1.55] }
                                    }}
                                    whileHover={{
                                      scale: 1.15,
                                      rotateZ: 5,
                                      transition: { duration: 0.4, ease: "easeOut" }
                                    }}
                                  >
                                    <Image
                                      src={imageErrors.has(item.image) ? '/products/placeholder.svg' : item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                      onError={() => {
                                        setImageErrors(prev => new Set([...prev, item.image]));
                                      }}
                                    />
                                  </motion.div>
                                  <div className="flex-1 space-y-1">
                                    <h5 className="font-light text-white/90 tracking-wide">{item.name}</h5>
                                    <p className="text-white/60 text-sm font-light">
                                      Size: {item.size} • Color: {item.color}
                                    </p>
                                    <p className="text-white/50 text-sm font-light">
                                      Qty: {item.quantity} × ${item.price}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-light text-white/90 tracking-wide">
                                      ${(item.price * item.quantity)}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          {/* Order Summary & Shipping */}
                          <motion.div 
                            className="space-y-8"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                          >
                            {/* Order Summary */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                              <h4 className="text-xl font-light mb-6 text-white/90 tracking-wider uppercase">Order Summary</h4>
                              <div className="space-y-3 text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                <div className="flex justify-between items-center">
                                  <span className="text-white/60 font-light tracking-wide">Subtotal</span>
                                  <span className="text-white/90 font-light">${order.subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-white/60 font-light tracking-wide">Tax</span>
                                  <span className="text-white/90 font-light">${order.tax}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-white/60 font-light tracking-wide">Shipping</span>
                                  <span className="text-green-400/80 font-light">Free</span>
                                </div>
                                <div className="border-t border-white/20 pt-3 mt-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-white/90 font-light tracking-wider uppercase">Total</span>
                                    <span className="text-xl text-white font-light tracking-wide">${order.total}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Shipping Address */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.2, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                              <h4 className="text-xl font-light mb-6 text-white/90 tracking-wider uppercase">Shipping Address</h4>
                              <div className="text-sm text-white/60 space-y-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 font-light leading-relaxed">
                                <p className="text-white/80">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <p>{order.shippingAddress.country}</p>
                              </div>
                            </motion.div>

                            {/* Estimated Delivery */}
                            {order.estimatedDelivery && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                              >
                                <h4 className="text-xl font-light mb-4 text-white/90 tracking-wider uppercase">Estimated Delivery</h4>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                  <p className="text-white/70 font-light tracking-wide">
                                    {formatDate(order.estimatedDelivery)}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      <motion.div style={{ y: footerY }}>
        <Footer />
      </motion.div>
    </div>
  );
};

export default OrdersPage;