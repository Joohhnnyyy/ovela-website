"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [stage, setStage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const router = useRouter();
  
  // Stage 0: OVELA centered with black text
  // Stage 1: Video div slides up from bottom
  // Stage 2: Background turns black, text turns white
  // Stage 3: OVELA moves to header position
  // Stage 4: Complete

  useEffect(() => {
    // Set initial dimensions
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const timers = [
      setTimeout(() => setStage(1), 1000), // Video slides up
      setTimeout(() => setStage(2), 2000), // Turn background black
      setTimeout(() => setStage(3), 3000), // Move to header
      setTimeout(() => {
        setStage(4);
        onComplete();
      }, 4000), // Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const getHeaderPosition = () => {
    if (dimensions.width === 0) return { x: 0, y: 0 };
    return {
      x: 0, // Center horizontally
      y: -dimensions.height / 2 + 37.5, // Move to header height
    };
  };

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000 ${
            stage >= 2 ? 'bg-black' : 'bg-white'
          }`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Video container sliding from bottom */}
          <motion.div
            className="absolute w-full max-w-6xl aspect-[16/9] lg:aspect-[21/9] overflow-hidden"
            initial={{ y: dimensions.height, opacity: 0 }}
            animate={{
              y: stage >= 1 ? 0 : dimensions.height,
              opacity: stage >= 1 ? 1 : 0,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="relative w-full h-full bg-black overflow-hidden">
              <video
                className="w-full h-full object-cover"
                src="/videos/hero-video.mp4"
                muted
                playsInline
                autoPlay
                loop
              />
              
              {/* Button overlay that appears with video */}
              <motion.div 
                className="absolute z-10 inset-0 flex items-center justify-between px-8 lg:px-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: stage >= 1 ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.div 
                  className="flex w-full justify-between lg:w-1/4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: stage >= 1 ? 1 : 0, x: stage >= 1 ? 0 : -50 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <motion.button 
                    className="font-body text-[20px] uppercase text-white hover:text-white/70 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {/* Already on home page */}}
                  >
                    OVELA
                  </motion.button>
                  <motion.button 
                    className="font-body text-[20px] uppercase text-white hover:text-white/70 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/pages/about')}
                  >
                    memory
                  </motion.button>
                </motion.div>
                <motion.div 
                  className="hidden w-1/4 justify-between lg:flex"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: stage >= 1 ? 1 : 0, x: stage >= 1 ? 0 : 50 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <motion.button 
                    className="font-body text-[20px] uppercase text-white hover:text-white/70 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/collections/all')}
                  >
                    collection
                  </motion.button>
                  <motion.button 
                    className="font-body text-[20px] uppercase text-white hover:text-white/70 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/pages/lookbook')}
                  >
                    2025
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* OVELA Text */}
          <motion.span
              className={`font-sans text-3xl font-normal tracking-[0.1em] transition-colors duration-1000 relative z-10 ${
                stage >= 2 ? "text-white" : "text-black"
              }`}
              initial={{ scale: 4 }}
              animate={{
                ...( stage >= 1 ? getHeaderPosition() : { x: 0, y: 0 }),
                scale: stage >= 1 ? 1 : 4
              }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut"
              }}
          >
            OVELA
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;