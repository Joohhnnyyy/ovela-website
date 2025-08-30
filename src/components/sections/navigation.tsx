"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinkClasses = "flex items-center text-white uppercase text-sm font-normal tracking-wider hover:opacity-70 transition-opacity";

const AnnouncementBar = ({ onHide }: { onHide: () => void }) => {
  return (
    <motion.div 
      className="h-[40px] w-full border-b border-white/15 bg-white/[.08]"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-[70px]">
        <motion.div 
          className="flex-1 lg:text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
            <span className="text-xs text-white/60 uppercase tracking-wider">
              "Memory" collection now available
            </span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-x-3 lg:gap-x-4 text-xs text-white/80"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
            <Link href="#" className="hover:text-white transition-colors uppercase">Fr</Link>
          </motion.div>
          <span className="font-bold text-white uppercase">En</span>
          <motion.button 
            onClick={onHide} 
            aria-label="close banner" 
            className="hover:text-white transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <X size={18} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Navigation() {
  const [isAnnouncementVisible, setAnnouncementVisible] = useState(true);

  const headerVariants = {
    hidden: { y: -75, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
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
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="fixed top-0 z-20 w-full">
      <div className="bg-black/50 backdrop-blur-lg">
        <AnimatePresence>
          {isAnnouncementVisible && <AnnouncementBar onHide={() => setAnnouncementVisible(false)} />}
        </AnimatePresence>
        
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
              className="p-2 -ml-2 text-white lg:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.button>
            <nav aria-label="menu principale" className="hidden lg:block">
              <ul role="menu" className="flex gap-x-8">
                {[
                  { href: "/collections/all", text: "Shop" },
                  { href: "/pages/about", text: "About" },
                  { href: "/pages/lookbook", text: "Lookbook" }
                ].map((link, index) => (
                  <motion.li 
                    key={link.href}
                    role="menuitem"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
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
              <Link href="/" aria-label="Oflyn Home">
                <span className="font-sans text-3xl font-normal tracking-[0.1em] text-white">
                  0FLYN
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Bag */}
          <motion.div 
            className="flex-1 flex justify-end"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <motion.button 
                aria-label="Open bag" 
                className={`${navLinkClasses} p-2 -mr-2 lg:hidden`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag size={24} />
              </motion.button>
              <motion.button 
                aria-label="Open bag with 0 items" 
                className={`${navLinkClasses} hidden lg:flex items-center gap-x-1.5`}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <span>Bag</span>
                <span>/</span>
                <motion.span
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  0
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </motion.header>
      </div>
    </div>
  );
}