"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, X, User, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const navLinkClasses = "flex items-center text-white uppercase text-sm font-normal tracking-wider hover:opacity-70 transition-opacity cursor-interactive";



export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          {/* Mobile Top Controls Container */}
          <motion.div 
            className="lg:hidden fixed top-4 left-4 right-4 z-50 flex justify-between items-center"
            variants={itemVariants}
          >
            <motion.button 
              aria-label="open menu" 
              className="p-2 text-white cursor-interactive touch-manipulation bg-black/20 backdrop-blur-sm rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ touchAction: 'manipulation' }}
            >
              <Menu size={24} />
            </motion.button>
            
            <Link href="/cart" className="block">
              <motion.div 
                className="p-2 text-white cursor-interactive touch-manipulation bg-black/20 backdrop-blur-sm rounded-lg relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{ touchAction: 'manipulation' }}
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
              </motion.div>
            </Link>
          </motion.div>

          {/* Left Side: Desktop Navigation */}
          <motion.div 
            className="flex-1 flex justify-start"
            variants={itemVariants}
          >
            <nav aria-label="menu principale" className="hidden lg:block">
              <ul role="menu" className="flex gap-x-8">
                {/* Shop Link */}
                <motion.li 
                  role="menuitem"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href="/collections/all" className={navLinkClasses}>Shop</Link>
                  </motion.div>
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
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full w-80 bg-black/95 backdrop-blur-lg border-r border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="font-sans text-2xl font-normal tracking-[0.1em] text-white">
                  OVELA
                </span>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white hover:opacity-70 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
              
              {/* Navigation Links */}
              <div className="p-6 space-y-6">
                {/* Shop Section */}
                <div className="space-y-4">
                  <h3 className="text-white/60 uppercase text-xs tracking-wider font-medium">
                    Shop
                  </h3>
                  <div className="space-y-3 pl-4">
                    {[
                      { href: '/collections/all', text: 'All Products' },
                      { href: '/collections/hoodies', text: 'Hoodies' },
                      { href: '/collections/jackets', text: 'Jackets' },
                      { href: '/collections/sets', text: 'Sets' }
                    ].map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="block text-white text-lg hover:opacity-70 transition-opacity"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.text}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Other Pages */}
                <div className="space-y-4">
                  <h3 className="text-white/60 uppercase text-xs tracking-wider font-medium">
                    Pages
                  </h3>
                  <div className="space-y-3 pl-4">
                    {[
                      { href: '/pages/about', text: 'About' },
                      { href: '/pages/lookbook', text: 'Lookbook' }
                    ].map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="block text-white text-lg hover:opacity-70 transition-opacity"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.text}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Account Section */}
                <div className="space-y-4">
                  <h3 className="text-white/60 uppercase text-xs tracking-wider font-medium">
                    Account
                  </h3>
                  <div className="space-y-3 pl-4">
                    {currentUser ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <span className="block text-white/70 text-sm">
                            {currentUser.displayName || currentUser.email}
                          </span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 }}
                        >
                          <Link
                            href="/orders"
                            className="flex items-center text-white text-lg hover:opacity-70 transition-opacity"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Package size={18} className="mr-2" />
                            Orders
                          </Link>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center text-white text-lg hover:opacity-70 transition-opacity"
                          >
                            <LogOut size={18} className="mr-2" />
                            Logout
                          </button>
                        </motion.div>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          href="/auth/login"
                          className="flex items-center text-white text-lg hover:opacity-70 transition-opacity"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User size={18} className="mr-2" />
                          Login
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}