'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { products, getProductsByCategory } from '@/data/products';



const categories = ["ALL PRODUCTS", "SNEAKERS", "CLOTHING", "ACCESSORIES", "BAGS"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL PRODUCTS");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getCategoryKey = (category: string) => {
    const categoryMap: { [key: string]: "sneakers" | "clothing" | "accessories" | "bags" } = {
      "SNEAKERS": "sneakers",
      "CLOTHING": "clothing", 
      "ACCESSORIES": "accessories",
      "BAGS": "bags"
    };
    return categoryMap[category];
  };

  const filteredProducts = selectedCategory === "ALL PRODUCTS" 
    ? products 
    : getProductsByCategory(getCategoryKey(selectedCategory));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Scroll setup for OVELA section
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Scroll animation for OVELA reveal effect
  const [ovelaInView, setOvelaInView] = useState(false);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Trigger animation when scroll progress is near the end (90% or more)
      if (latest >= 0.9 && !ovelaInView) {
        setOvelaInView(true);
      }
    });
    
    return unsubscribe;
  }, [scrollYProgress, ovelaInView]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black z-10" />
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-20 text-center"
        >
          <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-6">
            COLLECTIONS
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide opacity-80">
            Discover Our Latest Pieces
          </p>
        </motion.div>
      </section>

      {/* Back Button */}
      <section className="pt-8 px-4 lg:px-[70px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-16 px-4 lg:px-[70px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 text-sm tracking-wider transition-all duration-300 border-b-2 ${
                selectedCategory === category
                  ? 'border-white text-white'
                  : 'border-transparent text-white/60 hover:text-white hover:border-white/30'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pl-8 pr-4 lg:pl-[100px] lg:pr-[70px]"
        >
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
            role="grid"
            aria-label="Products collection"
          >
            {currentProducts.map((product, index) => {
              // Different layout patterns for each page
              let isLargeCard = false;
              if (currentPage === 1) {
                // Page 1: Every 4th item is large
                isLargeCard = index % 4 === 0;
              } else if (currentPage === 2) {
                // Page 2: 1st and 4th items are large
                isLargeCard = index === 0 || index === 3;
              } else if (currentPage === 3) {
                // Page 3: 2nd and 5th items are large
                isLargeCard = index === 1 || index === 4;
              } else {
                // Other pages: Dynamic pattern based on page number
                isLargeCard = (index + currentPage) % 3 === 0;
              }

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group ${
                    isLargeCard ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  role="gridcell"
                >
                  <Link 
                    href={`/products/${product.id}`} 
                    className="block h-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-xl transition-all duration-200"
                    aria-label={`View ${product.name} for ₹${product.price.toLocaleString('en-IN')}`}
                  >
                    <div className="relative overflow-hidden bg-gray-100 rounded-xl h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="relative flex-1 min-h-[300px]"
                      >
                        <img
                          src={product.images[0]}
                          alt={`${product.name} product image`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span 
                            className="bg-black text-white px-3 py-1 text-xs uppercase tracking-wider"
                            aria-label={`Category: ${product.category}`}
                          >
                            {product.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      </motion.div>
                      
                      <div className="p-6 bg-white text-black">
                        <h3 className="text-lg font-medium mb-2 group-hover:text-gray-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-light" aria-label={`Price: ${product.price} rupees`}>
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <button 
                            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                            aria-label={`Add ${product.name} to cart`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Add to cart functionality would go here
                            }}
                          >
                            <span className="text-lg leading-none" aria-hidden="true">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
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

      {/* Footer */}
      <Footer />
      
      {/* OVELA Section with reveal effect */}
      <motion.div 
         className="h-auto py-16 flex items-center justify-center bg-black relative"
       >
        <motion.h1
           className="text-[30vw] lg:text-[28vw] xl:text-[25vw] font-light tracking-wider text-white/80 select-none"
         >
          {"OVELA".split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                y: 100,
                filter: "blur(20px)",
              }}
              animate={{
                opacity: ovelaInView ? 0.8 : 0,
                y: ovelaInView ? 0 : 100,
                filter: ovelaInView ? "blur(0px)" : "blur(20px)",
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: index * 0.2,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>
    </div>
  );
}