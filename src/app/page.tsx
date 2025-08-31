"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/sections/navigation';
import HeroVideo from '@/components/sections/hero-video';
import BrandMessage from '@/components/sections/brand-message';
import NewArrivals from '@/components/sections/new-arrivals';
import BrandShowcase from '@/components/sections/brand-showcase';
import ProductCarousel from '@/components/sections/product-carousel';
import ProductsCategories from '@/components/sections/products-categories';
import Footer from '@/components/sections/footer';
import FinalBrandingSection from '@/components/sections/final-branding';
import LoadingScreen from '@/components/sections/loading-screen';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

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
          <motion.div 
            className={`min-h-screen transition-colors duration-500 ${
              isScrolled ? 'bg-black' : 'bg-transparent'
            }`}
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
            <Footer />
            <FinalBrandingSection />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}