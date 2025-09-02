"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, X, ChevronDown, User, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const navLinkClasses = "flex items-center text-white uppercase text-sm font-normal tracking-wider hover:opacity-70 transition-opacity cursor-interactive";



export default function Navigation() {
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const cart = useCart();
  const cartItems = cart?.items || [];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const headerVariants = {
    hidden: { y: -75, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="fixed top-0 z-20 w-full">
      <div className="bg-black/50 backdrop-blur-lg">

        
        <motion.header 
          className="relative flex h-[75px] items-center justify-between px-4 lg:px-[70px]"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side: Mobile Menu Toggle & Desktop Navigation */}
          <motion.div 
            className="flex-1 flex justify-start"
            variants={itemVariants}
          >
            <motion.button 
              aria-label="open menu" 
              className="p-2 -ml-2 text-white lg:hidden cursor-interactive"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.button>
            <nav aria-label="menu principale" className="hidden lg:block">
              <ul role="menu" className="flex gap-x-8">
                {/* Shop Dropdown */}
                <motion.li 
                  role="menuitem"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="relative"
                  onMouseEnter={() => setIsShopDropdownOpen(true)}
                  onMouseLeave={() => setIsShopDropdownOpen(false)}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1"
                  >
                    <Link href="/collections/all" className={navLinkClasses}>Shop</Link>
                    <ChevronDown size={16} className="text-white" />
                  </motion.div>
                  
                  <AnimatePresence>
                    {isShopDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg p-4 min-w-[200px]"
                      >
                        <div className="flex flex-col gap-3">
                          <Link href="/collections/all" className="text-white text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
                            All Products
                          </Link>
                          <Link href="/collections/hoodies" className="text-white text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
                            Hoodies
                          </Link>
                          <Link href="/collections/jackets" className="text-white text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
                            Jackets
                          </Link>
                          <Link href="/collections/sets" className="text-white text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
                            Sets
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
                
                {/* Other Navigation Items */}
                {[
                  { href: "/pages/about", text: "About" },
                  { href: "/pages/lookbook", text: "Lookbook" }
                ].map((link, index) => (
                  <motion.li 
                    key={link.href}
                    role="menuitem"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={link.href} className={navLinkClasses}>{link.text}</Link>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Center: Logo */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            variants={logoVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" aria-label="Ovela Home" className="cursor-interactive">
                <span className="font-sans text-4xl font-normal tracking-[0.1em] text-white">
                  OVELA
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Auth & Bag */}
          <motion.div 
            className="flex-1 flex justify-end"
            variants={itemVariants}
          >
            <div className="flex items-center gap-x-4">
              {/* Mobile Cart */}
              <Link href="/cart" className="lg:hidden">
                <motion.button 
                  aria-label={`Open cart with ${cartItems?.length || 0} items`}
                  className={`${navLinkClasses} p-2 relative`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShoppingBag size={24} />
                  {cartItems?.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                    >
                      {cartItems?.length || 0}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
              
              {/* Desktop Auth Links */}
              <div className="hidden lg:flex items-center gap-x-6">
                {currentUser ? (
                  <div className="flex items-center gap-x-4">
                    <span className={`${navLinkClasses} cursor-default`}>
                      <User size={16} className="mr-1" />
                      {currentUser.displayName || currentUser.email}
                    </span>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/orders" className={navLinkClasses}>
                        <Package size={16} className="mr-1" />
                        Orders
                      </Link>
                    </motion.div>
                    <motion.button
                      onClick={handleLogout}
                      className={navLinkClasses}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LogOut size={16} className="mr-1" />
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href="/auth/login" className={navLinkClasses}>
                      <User size={16} className="mr-1" />
                      Login
                    </Link>
                  </motion.div>
                )}
                
                <Link href="/cart">
                  <motion.button 
                    aria-label={`Open cart with ${cartItems?.length || 0} items`}
                    className={`${navLinkClasses} flex items-center gap-x-1.5`}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Cart</span>
                    <span>/</span>
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {cartItems?.length || 0}
                    </motion.span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.header>
      </div>
    </div>
  );
}