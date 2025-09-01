"use client";

import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState, useEffect, useRef } from 'react';

const setProducts = [
  {
    id: 9,
    name: "Tracksuit Set",
    price: "₹24,899",
    image: "/LOOK_H_25_4_LOOK_070_E01.webp",
    category: "Sets",
    label: "Set"
  },
  {
    id: 12,
    name: "Casual Set",
    price: "₹20,699",
    image: "/LOOK_H_25_4_LOOK_070_E02.webp",
    category: "Sets",
    label: "Casual"
  },
  {
    id: 15,
    name: "Sport Set",
    price: "₹27,399",
    image: "/LOOK_H_25_4_LOOK_070_E03.webp",
    category: "Sets",
    label: "Sport"
  }
];

export default function SetsPage() {
  const { ref, isInView, imageBlurVariants } = useScrollAnimation({ margin: "-20%" });
  const [ovelaInView, setOvelaInView] = useState(false);
  const ovelaRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState("alphabetically");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Sort products based on selected option
  const sortedProducts = [...setProducts].sort((a, b) => {
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
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Trigger animation when scroll progress is near the end (90% or more)
      if (latest >= 0.9 && !ovelaInView) {
        setOvelaInView(true);
      }
    });
    
    return unsubscribe;
  }, [scrollYProgress, ovelaInView]);
  
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
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl lg:text-3xl font-normal text-white tracking-wider"
          >
            Sets Collection
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
          <span className="text-white">Sets</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="grid" aria-label="Sets collection">
            {paginatedProducts.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer"
                role="gridcell"
              >
                <Link 
                  href={`/products/${product.id}`}
                  className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-lg transition-all duration-200"
                  aria-label={`View ${product.name} for ${product.price}`}
                >
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
              </motion.article>
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
                y: 100,
                filter: "blur(20px)",
              }}
              animate={{
                opacity: ovelaInView ? 1 : 0,
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