"use client";

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const lookbookImages = [
  {
    id: 1,
    title: "Memory Collection",
    season: "Spring 2024",
    image: "https://picsum.photos/600/800",
    orientation: "portrait"
  },
  {
    id: 2,
    title: "Urban Essentials",
    season: "Spring 2024",
    image: "https://picsum.photos/800/600",
    orientation: "landscape"
  },
  {
    id: 3,
    title: "Minimal Luxury",
    season: "Spring 2024",
    image: "https://picsum.photos/600/800?random=3",
    orientation: "portrait"
  },
  {
    id: 4,
    title: "Street Culture",
    season: "Spring 2024",
    image: "https://picsum.photos/800/600?random=4",
    orientation: "landscape"
  },
  {
    id: 5,
    title: "Conscious Fashion",
    season: "Spring 2024",
    image: "https://picsum.photos/600/800?random=5",
    orientation: "portrait"
  },
  {
    id: 6,
    title: "Future Forward",
    season: "Spring 2024",
    image: "https://picsum.photos/800/600?random=6",
    orientation: "landscape"
  }
];

const seasons = ["All", "Spring 2024", "Winter 2023", "Fall 2023", "Summer 2023"];

export default function LookbookPage() {
  const { ref, isInView, imageBlurVariants } = useScrollAnimation({ margin: "-20%" });
  const containerRef = useRef(null);
  
  // Scroll setup for OVELA section
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
  
  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-[115px] pb-16 px-4 lg:px-[70px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl lg:text-6xl font-normal text-white mb-4 tracking-wider">
            LOOKBOOK
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Explore our seasonal collections and discover the stories behind each piece
          </p>
        </motion.div>
      </section>

      {/* Season Filter */}
      <section className="px-4 lg:px-[70px] mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {seasons.map((season, index) => (
            <motion.button
              key={season}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 text-sm uppercase tracking-wider transition-all duration-300 ${
                index === 0
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-white hover:bg-primary'
              }`}
            >
              {season}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="px-4 lg:px-[70px] mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[60vh] lg:h-[80vh] overflow-hidden bg-secondary"
        >
          <Image
            src="https://picsum.photos/1200/800"
            alt="Featured Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-3xl lg:text-5xl font-normal mb-4 tracking-wider"
              >
                MEMORY COLLECTION
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-lg lg:text-xl text-white/80 mb-8"
              >
                Spring 2024 • Now Available
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-primary/80 transition-colors"
              >
                Shop Collection
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Lookbook Grid */}
      <section className="px-4 lg:px-[70px] pb-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {lookbookImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className={`group cursor-pointer ${
                item.orientation === 'landscape' ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative overflow-hidden bg-secondary">
                <motion.div
                  variants={imageBlurVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className={`w-full overflow-hidden ${
                    item.orientation === 'landscape' ? 'h-[400px]' : 'h-[500px]'
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={item.orientation === 'landscape' ? 800 : 600}
                    height={item.orientation === 'landscape' ? 600 : 800}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl lg:text-2xl font-normal mb-2 tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm uppercase tracking-wider">
                      {item.season}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="px-4 lg:px-[70px] py-20 bg-secondary">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-normal text-white mb-6 tracking-wide">
            Stay Updated
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Be the first to see our latest collections and behind-the-scenes content
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button className="bg-primary text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-primary/80 transition-colors">
              Subscribe to Updates
            </button>
          </motion.div>
        </motion.div>
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