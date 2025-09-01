'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
              >
                Clear Cart
              </button>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-lg">{totalItems} items</span>
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
            className="text-center py-16"
          >
            <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Shopping
            </Link>
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
                    className="bg-gray-900 rounded-lg p-6 mb-4 border border-gray-800"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={(() => {
                            // Check if existing image path is incorrect (contains 'general')
                            const existingImage = item.product.images?.[0];
                            if (existingImage && !existingImage.includes('/general/')) {
                              return existingImage;
                            }
                            
                            // Determine correct category and extension for fallback
                            let category = 'sneakers';
                            if (item.productId.includes('bag') || item.productId.includes('backpack') || item.productId.includes('briefcase') || item.productId.includes('messenger') || item.productId.includes('pouch') || item.productId.includes('hobo')) {
                              category = 'bags';
                            } else if (item.productId.includes('coat') || item.productId.includes('pants') || item.productId.includes('sweater') || item.productId.includes('sweatshirt') || item.productId.includes('tshirt') || item.productId.includes('jacket') || item.productId.includes('blouson') || item.productId.includes('shirt')) {
                              category = 'clothing';
                            } else if (item.productId.includes('bracelet') || item.productId.includes('cap') || item.productId.includes('sunglasses') || item.productId.includes('necklace') || item.productId.includes('bangle') || item.productId.includes('brooch') || item.productId.includes('ring') || item.productId.includes('tie')) {
                              category = 'accessories';
                            }
                            const extension = item.productId === 'b30-countdown-black-mesh' || item.productId.includes('b80-lounge') || item.productId.includes('cd-icon') ? '.webp' : '.jpg';
                            return `/products/${category}/${item.productId}-1${extension}`;
                          })()}
                          alt={`Product ${item.product.name}`}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold mb-2">{item.product.name}</h3>
                        <div className="flex items-center space-x-4 text-gray-400 mb-4">
                          {item.size && (
                            <span className="text-sm">
                              Size: <span className="text-white">{item.size}</span>
                            </span>
                          )}
                          {item.color && (
                            <span className="text-sm">
                              Color: <span className="text-white">{item.color}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-4">
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.size || 'M', item.color || 'Default')}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        
                        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-2">
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId,
                              item.size || 'M',
                              item.color || 'Default',
                              item.quantity - 1
                            )}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId,
                              item.size || 'M',
                              item.color || 'Default',
                              item.quantity + 1
                            )}
                            className="p-1 rounded hover:bg-gray-700 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-lg font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-8"
              >
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>GST (18%)</span>
                    <span>₹{Math.round(totalPrice * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>₹{Math.round(totalPrice * 1.18).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-white text-black font-semibold py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Continue Shopping
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