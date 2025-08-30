"use client";

import React from 'react';
import { Copyright } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const FinalBrandingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const brandTextVariants = {
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
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const creditsVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer 
      ref={ref}
      className="bg-black text-white"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
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
          animate={isInView ? { scale: 1, opacity: 0.5 } : { scale: 1.2, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Large "OFLYN" branding text */}
        <motion.div 
          className="absolute bottom-0 z-10 w-max left-1/2 -translate-x-1/2 lg:left-[310px] lg:-translate-x-0"
          variants={brandTextVariants}
        >
          <motion.h1
            className="bg-gradient-to-t from-gray-300 via-gray-600 to-gray-800 bg-clip-text font-heading text-transparent"
            style={{
              fontFamily: "'Neue', var(--font-heading)",
              fontSize: 'clamp(200px, 30vw, 400px)',
              lineHeight: 0.7,
              fontWeight: 400,
            }}
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 30px rgba(255, 255, 255, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            OFLYN
          </motion.h1>
        </motion.div>

        {/* Copyright and credits information */}
        <motion.div 
          className="absolute bottom-10 z-20 flex items-center gap-3 px-4 text-white lg:px-[70px]"
          variants={creditsVariants}
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Copyright className="h-7 w-7 shrink-0 md:h-10 md:w-10" />
          </motion.div>
          <div className="grid gap-y-1">
            <motion.p 
              className="font-heading text-base md:text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Thomas B
            </motion.p>
            <motion.div 
              className="flex items-center gap-x-2 font-heading text-base md:text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span>Dev by</span>
              <motion.a
                href="https://teo-b.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
                whileHover={{ scale: 1.05, x: 3 }}
                transition={{ duration: 0.2 }}
              >
                Téo.3tc
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default FinalBrandingSection;