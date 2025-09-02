'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className = '' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  
  // Smooth spring animation for the progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Show progress bar when user starts scrolling
      setIsVisible(latest > 0.01);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      
      {/* Progress bar */}
      <motion.div
        className="h-full bg-white shadow-lg shadow-white/20"
        style={{
          scaleX,
          transformOrigin: '0%'
        }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute top-0 h-full w-full bg-white/30 blur-sm"
        style={{
          scaleX,
          transformOrigin: '0%'
        }}
      />
    </motion.div>
  );
}