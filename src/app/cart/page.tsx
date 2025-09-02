'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, isLoading, clearCart } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const handleQuantityChange = async (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, size, color, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: string, size: string, color: string) => {
    try {
      await removeFromCart(productId, size, color);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-white mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-gray-500 animate-pulse mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-medium">Loading your cart...</p>
            <p className="text-gray-400 text-sm">Preparing your shopping experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Continue Shopping</span>
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-gray-400 text-sm mt-1">Review your selected items</p>
            </div>
            <div className="flex items-center space-x-4">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-gray-600/20 border border-gray-600/30 hover:bg-gray-600/30 rounded-lg text-sm transition-all duration-300 hover:scale-105 text-white hover:text-gray-300"
                >
                  Clear Cart
                </button>
              )}
              <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/50">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
                <span className="text-lg font-semibold">{totalItems}</span>
                <span className="text-gray-400 text-sm">{totalItems === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          // Empty Cart
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-600/20 rounded-full blur-3xl"></div>
              <ShoppingBag className="h-32 w-32 text-gray-600 mx-auto relative z-10" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Discover our amazing collection of premium products and start building your perfect order.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
              </Link>
              <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Free Shipping</span>
                </div>

              </div>
            </div>
          </motion.div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/20"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 relative">
                        <div className="relative overflow-hidden rounded-xl">
                          <Image
                            src={item.product.images?.[0] || '/products/placeholder.svg'} 
                            alt={`Product ${item.product.name}`}
                            width={140}
                            height={140}
                            className="rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== '/products/placeholder.svg') {
                                target.src = '/products/placeholder.svg';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                            {item.product.description}
                          </p>
                        </div>
                        
                        {/* Size and Color */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {item.size && (
                            <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                              <span className="text-gray-400 text-xs font-medium">Size:</span>
                              <span className="text-white text-xs font-semibold">{item.size}</span>
                            </div>
                          )}
                          {item.color && (
                            <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                              <span className="text-gray-400 text-xs font-medium">Color:</span>
                              <span className="text-white text-xs font-semibold">{item.color}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-2xl font-bold">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-4">
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.size || 'M', item.color || 'Default')}
                          className="group p-3 text-white hover:text-gray-300 hover:bg-gray-700/20 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Remove item"
                        >
                          <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                        
                        <div className="flex items-center bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId,
                              item.size || 'M',
                              item.color || 'Default',
                              item.quantity - 1
                            )}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-semibold text-white bg-gray-700/30 h-10 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId,
                              item.size || 'M',
                              item.color || 'Default',
                              item.quantity + 1
                            )}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-white mb-1">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-gray-400">
                            ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 sticky top-8 shadow-2xl"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-white to-gray-400 rounded-full"></div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Order Summary
                  </h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 font-medium">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span className="font-bold text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-white" />
                      <span className="text-gray-400 font-medium">Shipping</span>
                    </div>
                    <span className="font-bold text-white">Free</span>
                  </div>
                  
                  {/* Tax Breakdown */}
                  <div className="bg-gray-800/20 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">CGST (9%)</span>
                      <span className="font-semibold text-gray-300">₹{Math.round(totalPrice * 0.09).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">SGST (9%)</span>
                      <span className="font-semibold text-gray-300">₹{Math.round(totalPrice * 0.09).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">IGST (0%)</span>
                      <span className="font-semibold text-gray-400">₹0</span>
                    </div>
                    <div className="border-t border-gray-700/50 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Total GST (18%)</span>
                        <span className="font-bold text-lg">₹{Math.round(totalPrice * 0.18).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Charges */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400 font-medium text-sm">Processing Fee</span>
                      <span className="font-semibold text-sm">₹{Math.round(totalPrice * 0.005).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400 font-medium text-sm">Payment Gateway Fee</span>
                      <span className="font-semibold text-sm">₹{Math.round(totalPrice * 0.002).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400 font-medium text-sm">Insurance (Optional)</span>
                      <span className="font-semibold text-sm text-white">Free</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600/50 pt-4 mt-4">
                    <div className="flex justify-between items-center py-2 bg-gray-800/30 rounded-lg px-4">
                      <span className="font-bold text-xl">Total Amount</span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        ₹{Math.round(totalPrice * 1.18 + (totalPrice * 0.007)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="group w-full bg-white text-black font-bold py-4 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 text-center block hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                  <Link
                    href="/"
                    className="group w-full border border-gray-600/50 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700/30 hover:border-gray-500/50 transition-all duration-300 text-center block"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <span>Continue Shopping</span>
                    </div>
                  </Link>
                </div>
                

              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;