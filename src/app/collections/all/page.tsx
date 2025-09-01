'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';

const products = [
  {
    id: 1,
    name: "Black Hoodie Set",
    price: "$189",
    image: "/LOOK_H_25_4_LOOK_070_E01.webp",
    category: "Hoodies",
    label: "New"
  },
  {
    id: 2,
    name: "Black Hoodie Set",
    price: "$189",
    image: "/LOOK_H_25_4_LOOK_070_E02.webp",
    category: "Hoodies",
    label: "Hoodie"
  },
  {
    id: 3,
    name: "Black Hoodie Set",
    price: "$189",
    image: "/LOOK_H_25_4_LOOK_070_E03.webp",
    category: "Hoodies",
    label: "Hoodie"
  },
  {
    id: 4,
    name: "Black Hoodie Set",
    price: "$189",
    image: "/LOOK_H_25_4_LOOK_070_E04.webp",
    category: "Hoodies",
    label: "Hoodie"
  },
  {
    id: 5,
    name: "Black Jacket",
    price: "$249",
    image: "/493C424D6500C980_E01.jpeg",
    category: "Jackets",
    label: "Jacket"
  },
  {
    id: 6,
    name: "Black Outfit",
    price: "$199",
    image: "/541V01A1699X8830_E01.jpeg",
    category: "Sets",
    label: "Set"
  },
  {
    id: 7,
    name: "Premium Hoodie",
    price: "$229",
    image: "/LOOK_H_25_4_LOOK_070_E01.webp",
    category: "Hoodies",
    label: "Premium"
  },
  {
    id: 8,
    name: "Urban Jacket",
    price: "$299",
    image: "/493C424D6500C980_E01.jpeg",
    category: "Jackets",
    label: "Urban"
  },
  {
    id: 9,
    name: "Complete Set",
    price: "$349",
    image: "/541V01A1699X8830_E01.jpeg",
    category: "Sets",
    label: "Complete"
  },
  {
    id: 10,
    name: "Oversized Hoodie",
    price: "$209",
    image: "/LOOK_H_25_4_LOOK_070_E02.webp",
    category: "Hoodies",
    label: "Oversized"
  },
  {
    id: 11,
    name: "Bomber Jacket",
    price: "$279",
    image: "/493C424D6500C980_E01.jpeg",
    category: "Jackets",
    label: "Bomber"
  },
  {
    id: 12,
    name: "Casual Set",
    price: "$259",
    image: "/541V01A1699X8830_E01.jpeg",
    category: "Sets",
    label: "Casual"
  },
  {
    id: 13,
    name: "Zip Hoodie",
    price: "$199",
    image: "/LOOK_H_25_4_LOOK_070_E03.webp",
    category: "Hoodies",
    label: "Zip"
  },
  {
    id: 14,
    name: "Denim Jacket",
    price: "$319",
    image: "/493C424D6500C980_E01.jpeg",
    category: "Jackets",
    label: "Denim"
  },
  {
    id: 15,
    name: "Sport Set",
    price: "$289",
    image: "/541V01A1699X8830_E01.jpeg",
    category: "Sets",
    label: "Sport"
  }
];

const categories = ["ALL PRODUCTS", "HOODIES", "JACKETS", "SETS"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL PRODUCTS");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = selectedCategory === "ALL PRODUCTS" 
    ? products 
    : products.filter(product => product.category.toUpperCase() === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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
  const ovelaRef = useRef(null);
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
            <source src="/hero-video.mp4" type="video/mp4" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
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
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group ${
                    isLargeCard ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <Link href={`/products/${product.id}`} className="block h-full cursor-pointer">
                    <div className="relative overflow-hidden bg-gray-100 rounded-xl h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="relative flex-1 min-h-[300px]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-black text-white px-3 py-1 text-xs uppercase tracking-wider">
                            {product.label}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      </motion.div>
                      
                      <div className="p-6 bg-white text-black">
                        <h3 className="text-lg font-medium mb-2 group-hover:text-gray-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-light">{product.price}</span>
                          <button className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                            <span className="text-lg leading-none">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
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

      {/* Footer with faster scroll */}
      <motion.div style={{ y: footerY }}>
        <Footer />
      </motion.div>
      
      {/* OVELA Section with slower scroll and reveal effect */}
      <motion.div 
         ref={ovelaRef}
         className="h-auto py-2 flex items-center justify-center bg-black relative z-10"
         style={{ y: ovelaY }}
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