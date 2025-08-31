"use client";

import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import FinalBrandingSection from '@/components/sections/final-branding';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState, useEffect, useRef } from 'react';

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
  }
];

const categories = ["ALL PRODUCTS", "HOODIES", "JACKETS", "SETS"];

export default function ShopPage() {
  const { ref, isInView, imageBlurVariants } = useScrollAnimation({ margin: "-20%" });
  const [ovelaInView, setOvelaInView] = useState(false);
  const ovelaRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-black relative overflow-hidden">
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
        <motion.div
          className="absolute top-1/4 right-0 w-3/4 h-1/2 bg-gradient-radial from-blue-500/30 via-blue-600/20 to-transparent"
          animate={{
            y: [-30, 30, -30],
            x: [-30, 30, -30],
            scale: [0.8, 1.3, 0.8],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
      </div>
      <div className="relative z-10">
        <Navigation />
      </div>
      
      {/* Header Section */}
      <section className="relative z-10 pt-[115px] pb-8 px-4 lg:px-[70px]">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl lg:text-3xl font-normal text-white tracking-wider"
          >
            Products
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 text-white/60 text-sm"
          >
            <span>Sort by</span>
            <select className="bg-transparent border-none text-white/60 text-sm focus:outline-none cursor-pointer">
              <option value="alphabetically">Alphabetically, A-Z</option>
              <option value="price-low">Price, low to high</option>
              <option value="price-high">Price, high to low</option>
              <option value="date">Date, new to old</option>
            </select>
          </motion.div>
        </div>

        {/* Filter Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-6 mb-8"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className={`text-sm uppercase tracking-wider transition-all duration-300 pb-1 border-b-2 ${
                index === 0
                  ? 'text-white border-white'
                  : 'text-white/60 border-transparent hover:text-white hover:border-white/30'
              }`}
            >
              {category}
            </motion.button>
          ))
         }
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 px-4 lg:px-[70px] pb-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-4"
        >
          {/* First Row - 3 Equal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.slice(0, 3).map((product, index) => (
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
                    {/* Product Label */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/80 text-white text-xs px-2 py-1 uppercase tracking-wider">
                        {product.label}
                      </span>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 h-full flex flex-col justify-between p-4">
                      {/* Top Labels */}
                      <div className="flex gap-2">
                        <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                          {product.label}
                        </span>
                        <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Spacer */}
                      <div className="flex-1"></div>
                      
                      {/* Bottom Section */}
                      <div className="flex flex-col justify-end h-full">
                        {/* Quick Add Button - positioned at bottom */}
                        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <button className="w-full bg-white text-black py-4 uppercase tracking-wider text-sm font-medium hover:bg-gray-100 transition-colors">
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

          {/* Second Row - 1 Large + 2 Small */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large Card */}
            {products.slice(3, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer md:col-span-2"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative overflow-hidden bg-gray-100 mb-3 rounded-lg">
                    <motion.div
                      variants={imageBlurVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="w-full h-[500px] overflow-hidden rounded-lg"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </motion.div>
                    {/* Product Label */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/80 text-white text-xs px-2 py-1 uppercase tracking-wider">
                        {product.label}
                      </span>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 h-full flex flex-col justify-between p-4">
                      {/* Top Labels */}
                      <div className="flex gap-2">
                        <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                          {product.label}
                        </span>
                        <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Spacer */}
                      <div className="flex-1"></div>
                      
                      {/* Bottom Section */}
                      <div className="flex flex-col justify-end h-full">
                        {/* Quick Add Button - positioned at bottom */}
                        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <button className="w-full bg-white text-black py-4 uppercase tracking-wider text-sm font-medium hover:bg-gray-100 transition-colors">
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
            
            {/* Small Cards Column */}
            <div className="space-y-4">
              {products.slice(4, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 4) }}
                  whileHover={{ y: -2 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative overflow-hidden bg-gray-100 mb-3 rounded-lg">
                      <motion.div
                        variants={imageBlurVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="w-full h-[287px] overflow-hidden rounded-lg"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </motion.div>
                      {/* Product Label */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/80 text-white text-xs px-2 py-1 uppercase tracking-wider">
                          {product.label}
                        </span>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 h-full flex flex-col justify-between p-4">
                        {/* Top Labels */}
                        <div className="flex gap-2">
                          <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                            {product.label}
                          </span>
                          <span className="bg-white text-black text-xs px-2 py-1 uppercase tracking-wider font-medium">
                            {product.category}
                          </span>
                        </div>
                        
                        {/* Spacer */}
                        <div className="flex-1"></div>
                        
                        {/* Bottom Section */}
                         <div className="flex flex-col justify-end h-full">
                           {/* Quick Add Button - positioned at bottom */}
                           <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                             <button className="w-full bg-white text-black py-3 uppercase tracking-wider text-xs font-medium hover:bg-gray-100 transition-colors">
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
          </div>
        </motion.div>
        
        {/* Subcollection indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center items-center mt-12 gap-2"
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <span className="text-white/60 text-xs uppercase tracking-wider ml-4">Subcollection</span>
          <div className="w-4 h-4 border border-white/30 ml-2"></div>
        </motion.div>
      </section>

      {/* OVELA Footer Section */}
      <div className="relative z-10">
        <div
          ref={ovelaRef}
          className="w-full h-[60vh] lg:h-[70vh] xl:h-[80vh] flex items-center justify-center bg-black text-white relative z-10"
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
                  duration: 1.2,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>
      </div>
    </div>
  );
}