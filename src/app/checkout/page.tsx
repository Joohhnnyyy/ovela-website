'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, MapPin, User, Mail, Phone, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/orderService';

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

const CheckoutPage = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'India',
    'Japan',
    'Brazil'
  ];

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, router]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Redirect to cart if empty
  React.useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items.length, orderComplete, router]);

  if (!currentUser || (items.length === 0 && !orderComplete)) {
    return null;
  }

  const handleBillingChange = (field: keyof BillingInfo, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      console.log('Starting checkout process...');
      console.log('Current user:', currentUser?.uid);
      console.log('Cart items:', items);
      
      // Validate required fields
      if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.address || 
          !billingInfo.city || !billingInfo.state || !billingInfo.zipCode) {
        throw new Error('Please fill in all required billing information');
      }

      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.nameOnCard) {
        throw new Error('Please fill in all payment information');
      }

      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }

      if (!items || items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Validate cart items structure
      for (const item of items) {
        if (!item.productId || !item.product || !item.quantity) {
          console.error('Invalid cart item:', item);
          throw new Error('Invalid cart item detected');
        }
      }

      console.log('Validation passed, simulating payment...');
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Payment simulated, creating order...');
      // Create order in database
      const orderData = {
        items: items,
        shippingAddress: {
          name: `${billingInfo.firstName} ${billingInfo.lastName}`,
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          address: billingInfo.address,
          city: billingInfo.city,
          state: billingInfo.state,
          pincode: billingInfo.zipCode,
          zipCode: billingInfo.zipCode,
          country: billingInfo.country
        },
        paymentMethod: 'credit_card'
      };

      console.log('Order data prepared:', orderData);
      const createdOrder = await orderService.createOrder(orderData, currentUser.uid);
      console.log('Order created successfully:', createdOrder);
      
      // Clear cart after successful order
      console.log('Clearing cart...');
      await clearCart();
      console.log('Cart cleared, order complete!');
      setOrderComplete(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        currentUser: currentUser?.uid,
        itemsCount: items?.length || 0,
        billingComplete: !!(billingInfo.firstName && billingInfo.lastName && billingInfo.address),
        paymentComplete: !!(paymentInfo.cardNumber && paymentInfo.expiryDate)
      });
      alert(error instanceof Error ? error.message : 'Order creation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = totalPrice;
  const tax = Math.round(totalPrice * 0.18); // GST 18%
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-400 mb-8">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/cart"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </Link>
            <h1 className="text-2xl font-bold">Checkout</h1>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-400">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Billing Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Billing Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      required
                      value={billingInfo.firstName}
                      onChange={(e) => handleBillingChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      required
                      value={billingInfo.lastName}
                      onChange={(e) => handleBillingChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={billingInfo.email}
                      onChange={(e) => handleBillingChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={billingInfo.phone}
                      onChange={(e) => handleBillingChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input
                      type="text"
                      required
                      value={billingInfo.address}
                      onChange={(e) => handleBillingChange('address', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={billingInfo.city}
                      onChange={(e) => handleBillingChange('city', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={billingInfo.state}
                      onChange={(e) => handleBillingChange('state', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={billingInfo.zipCode}
                      onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-left flex items-center justify-between hover:bg-gray-750 transition-colors"
                      >
                        <span>{billingInfo.country}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isCountryDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {countries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() => {
                                handleBillingChange('country', country);
                                setIsCountryDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                                billingInfo.country === country ? 'bg-gray-700 text-white' : 'text-gray-300'
                              }`}
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name on Card</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                type="submit"
                disabled={isProcessing}
                className="w-full bg-white text-black font-semibold py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Complete Order - ${total.toFixed(2)}</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-8"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                    <Image
                      src={item.product.images?.[0] || '/products/placeholder.svg'}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/products/placeholder.svg') {
                          target.src = '/products/placeholder.svg';
                        }
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-400">
                        {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 border-t border-gray-700 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="bg-gray-800/20 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">CGST (9%)</span>
                    <span className="font-semibold text-gray-300">₹{Math.round(subtotal * 0.09).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">SGST (9%)</span>
                    <span className="font-semibold text-gray-300">₹{Math.round(subtotal * 0.09).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">IGST (0%)</span>
                    <span className="font-semibold text-gray-400">₹0</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Total GST (18%)</span>
                      <span className="font-bold text-lg">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-700 pt-3">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;