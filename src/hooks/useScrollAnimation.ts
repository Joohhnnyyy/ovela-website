"use client";

import { useRef } from 'react';
import { useInView, Variants } from 'framer-motion';

export const useScrollAnimation = (options?: {
  once?: boolean;
  margin?: string;
  threshold?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: (options?.margin ?? "-10%") as any,
    amount: options?.threshold ?? 0.1
  });

  const blurToAppearVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const imageBlurVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(20px)",
      scale: 1.1
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
      y: 30,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return {
    ref,
    isInView,
    blurToAppearVariants,
    imageBlurVariants,
    staggerContainerVariants,
    childVariants
  };
};