"use client";

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import LoadingScreen from '@/components/sections/loading-screen';
import Navigation from '@/components/sections/navigation';
import HeroVideo from '@/components/sections/hero-video';
import BrandMessage from '@/components/sections/brand-message';
import NewArrivals from '@/components/sections/new-arrivals';
import BrandShowcase from '@/components/sections/brand-showcase';
import ProductCarousel from '@/components/sections/product-carousel';
import ProductsCategories from '@/components/sections/products-categories';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [ovelaInView, setOvelaInView] = useState(false);
  const ovelaRef = useRef(null);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && ovelaRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setOvelaInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      
      observer.observe(ovelaRef.current);
      
      return () => observer.disconnect();
    }
  }, [isLoading]);



  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Turn page black as soon as user starts scrolling (when nav becomes visible)
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <AnimatePresence>
        {!isLoading && (
          <div 
              className={`min-h-screen transition-colors duration-500 ${
                isScrolled ? 'bg-black' : 'bg-transparent'
              }`}
            >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Navigation />
              <main>
                <HeroVideo />
                <BrandMessage />
                <NewArrivals />
                <BrandShowcase />
                <ProductCarousel />
                <ProductsCategories />
              </main>
              
              {/* Footer */}
              <Footer />
              
              {/* OVELA Section with reveal effect */}
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
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}