"use client";

import React from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FinalBrandingSection = () => {
  const parallaxRef = useRef(null);
  const { ref, isInView, blurToAppearVariants } = useScrollAnimation({ margin: "-20%" });
  const { scrollYProgress } = useScroll({
    container: typeof window !== 'undefined' ? { current: document.body } : undefined
  });
  
  // Reveal when scroll reaches near the end (90% or more)
  const isScrollAtEnd = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const [shouldReveal, setShouldReveal] = React.useState(false);
  
  React.useEffect(() => {
    const unsubscribe = isScrollAtEnd.on('change', (latest) => {
      if (latest >= 0.5) {
        setShouldReveal(true);
      }
    });
    return unsubscribe;
  }, [isScrollAtEnd]);
  
  const { scrollYProgress: sectionProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(sectionProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(sectionProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  const brandTextVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.2
      }
    }
  };



  return (
    <motion.footer 
      ref={parallaxRef}
      className="bg-black text-white relative"
      variants={blurToAppearVariants}
      initial="visible"
      animate="visible"
    >
      <div className="relative h-[574px] overflow-hidden">
        {/* Background gradient glow with parallax effect */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'linear-gradient(to top, hsl(var(--primary)), transparent 50%)',
            opacity: 0.5,
            y
          }}
          initial={{ scale: 1.2, opacity: 0.3 }}
          animate={shouldReveal ? { scale: 1, opacity: 0.5 } : { scale: 1.2, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Large "OVELA" branding text */}
        <motion.div 
          ref={ref}
          className="absolute top-1/2 -translate-y-1/2 z-10 w-max left-1/2 -translate-x-1/2 lg:left-[310px] lg:-translate-x-0"
          variants={brandTextVariants}
          initial="visible"
          animate="visible"
        >
          <motion.h1
            className="bg-gradient-to-t from-white via-gray-200 to-gray-400 bg-clip-text font-heading text-transparent text-center"
            style={{
              fontFamily: "'Neue', var(--font-heading)",
              fontSize: 'clamp(300px, 40vw, 600px)',
              lineHeight: 0.7,
              fontWeight: 400,
            }}
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 30px rgba(255, 255, 255, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            OVELA
          </motion.h1>
        </motion.div>


      </div>
    </motion.footer>
  );
};

export default FinalBrandingSection;