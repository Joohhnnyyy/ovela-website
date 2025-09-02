"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Menu, ShoppingBag, X, User, LogOut, Package } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const hoodieProducts = [
  {
    id: 1,
    name: "CD Icon Sweatshirt Black",
    price: "₹18,900",
    image: "/products/clothing/cd-icon-sweatshirt-black-1.webp",
    category: "Hoodies",
    label: "New"
  },
  {
    id: 2,
    name: "Dior Montaigne Sweatshirt",
    price: "₹19,800",
    image: "/products/clothing/dior-montaigne-sweatshirt-black-1.jpg",
    category: "Hoodies",
    label: "Premium"
  },
  {
    id: 3,
    name: "CD Icon Zipped Sweater",
    price: "₹14,850",
    image: "/products/clothing/cd-icon-sweater-gray-zipped-1.webp",
    category: "Hoodies",
    label: "Zip"
  },
  {
    id: 4,
    name: "Dior Couture Hooded Jacket",
    price: "₹25,200",
    image: "/products/clothing/dior-couture-hooded-jacket-black-1.jpg",
    category: "Hoodies",
    label: "Hoodie"
  },
  {
    id: 7,
    name: "CD Icon T-Shirt Fitted",
    price: "₹5,850",
    image: "/products/clothing/cd-icon-tshirt-white-fitted-1.webp",
    category: "Hoodies",
    label: "Casual"
  },
  {
    id: 10,
    name: "Dior Oblique T-Shirt Relaxed",
    price: "₹6,480",
    image: "/products/clothing/dior-oblique-tshirt-offwhite-relaxed-1.webp",
    category: "Hoodies",
    label: "Relaxed"
  },
  {
    id: 13,
    name: "Dior Couture T-Shirt",
    price: "₹6,750",
    image: "/products/clothing/dior-couture-tshirt-white-relaxed-1.webp",
    category: "Hoodies",
    label: "Classic"
  }
];

export default function HoodiesPage() {
  const { ref, isInView, imageBlurVariants } = useScrollAnimation({ margin: "-20%" });
  const [ovelaInView, setOvelaInView] = useState(false);
  const ovelaRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState("alphabetically");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsPerPage = 6;
  const { addToCart } = useCart();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = {
      id: product.id,
      name: product.name,
      description: '',
      price: parseInt(product.price.replace('₹', '').replace(',', '')),
      category: product.category,
      brand: 'OVELA',
      images: [product.image],
      sizes: [{ size: 'M', label: 'Medium', available: true }],
      colors: [{ color: 'black', name: 'Black', hexCode: '#000000', available: true }],
      inventory: [{ size: 'M', color: 'black', quantity: 10, sku: `${product.id}-M-black` }],
      tags: [product.label],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    addToCart(productData, 1, 'M', 'black');
  };

  // Scroll setup for OVELA section
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Footer scrolls faster (more transform)
  const footerY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  // OVELA div scrolls slower (less transform)
  const ovelaY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Scroll animation for OVELA reveal effect
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Trigger animation when scroll progress is near the end (90% or more)
      if (latest >= 0.9 && !ovelaInView) {
        setOvelaInView(true);
      }
    });
    
    return unsubscribe;
  }, [scrollYProgress, ovelaInView]);

  // Sort products based on selected option
  const sortedProducts = [...hoodieProducts].sort((a, b) => {
    switch (sortBy) {
      case "alphabetically":
        return a.name.localeCompare(b.name);
      case "price-low":
        return parseInt(a.price.replace('₹', '').replace(',', '')) - parseInt(b.price.replace('₹', '').replace(',', ''));
      case "price-high":
        return parseInt(b.price.replace('₹', '').replace(',', '')) - parseInt(a.price.replace('₹', '').replace(',', ''));
      case "date":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOvelaInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ovelaRef.current) {
      observer.observe(ovelaRef.current);
    }

    return () => {
      if (ovelaRef.current) {
        observer.unobserve(ovelaRef.current);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Blue Aura Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-2/3 bg-gradient-radial from-blue-400/40 via-blue-500/25 to-transparent"
          animate={{
            y: [-40, 60, -40],
            x: [-20, 20, -20],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-radial from-blue-300/45 via-blue-400/30 to-transparent"
          animate={{
            y: [40, -60, 40],
            x: [20, -20, 20],
            scale: [1.1, 0.9, 1.1],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>
      
      <div className="relative z-10">
        <Navigation />
      </div>
      
      {/* Header Section */}
      <section className="relative z-10 pt-[115px] pb-8 px-4 lg:px-[70px]">
        {/* Mobile Top Controls Container */}
        <motion.div 
          className="lg:hidden fixed top-4 left-4 right-4 z-[100] flex justify-between items-center pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button 
             aria-label="open menu" 
             className="p-3 text-white cursor-interactive touch-manipulation bg-black/30 backdrop-blur-md rounded-lg shadow-lg"
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
              className="p-3 text-white cursor-interactive touch-manipulation bg-black/30 backdrop-blur-md rounded-lg shadow-lg relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{ touchAction: 'manipulation' }}
            >
              <ShoppingBag size={24} />
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
        
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl lg:text-3xl font-normal text-white tracking-wider"
          >
            Hoodies Collection
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 text-white/60 text-sm"
          >
            <span>Sort by</span>
            <select 
              className="bg-transparent border-none text-white/60 text-sm focus:outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="alphabetically">Alphabetically, A-Z</option>
              <option value="price-low">Price, low to high</option>
              <option value="price-high">Price, high to low</option>
              <option value="date">Date, new to old</option>
            </select>
          </motion.div>
        </div>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-2 text-white/60 text-sm mb-8"
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections/all" className="hover:text-white transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-white">Hoodies</span>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 px-4 lg:px-[70px] pb-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative overflow-hidden bg-gray-100 mb-3 rounded-lg">
                    <motion.div
                      variants={imageBlurVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="w-full h-[600px] overflow-hidden rounded-lg"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </motion.div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/80 text-white text-xs px-2 py-1 uppercase tracking-wider">
                        {product.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-full flex flex-col justify-between p-4">
                      <div className="flex gap-2">
                        <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                          {product.label}
                        </span>
                        <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex-1"></div>
                      <div className="flex flex-col justify-end h-full">
                        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full bg-white text-black py-4 uppercase tracking-wider text-sm font-medium hover:bg-gray-100 transition-colors"
                          >
                            QUICK ADD TO BAG
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-sm font-normal mb-1 uppercase tracking-wider">{product.name}</h3>
                    <p className="text-white/60 text-xs uppercase tracking-wider">{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center items-center mt-12 gap-4"
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === index + 1
                    ? 'bg-white'
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
            <span className="text-white/60 text-xs uppercase tracking-wider ml-4">
              Page {currentPage} of {totalPages}
            </span>
          </motion.div>
        )}
      </section>

      {/* Footer with faster scroll */}
      <motion.div style={{ y: footerY }}>
        <Footer />
      </motion.div>
      
      {/* OVELA Section with slower scroll and reveal effect */}
      <motion.div 
        ref={ovelaRef}
        className="w-full h-[60vh] lg:h-[70vh] xl:h-[80vh] flex items-center justify-center bg-black text-white relative z-10"
        style={{ y: ovelaY }}
      >
        <motion.h1
          className="text-[35vw] lg:text-[32vw] xl:text-[28vw] tracking-wider lg:tracking-[0.1em] leading-none"
          style={{ fontWeight: 50 }}
        >
          {"OVELA".split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: "blur(20px)",
                y: 100,
              }}
              animate={ovelaInView ? {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              } : {
                opacity: 0,
                filter: "blur(20px)",
                y: 100,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>
      
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