"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CustomCursorProps {
  isHovering?: boolean;
  isInteractive?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractiveElement = target.closest('button, a, [role="button"], .cursor-interactive, .group, [data-interactive="true"]');
      
      if (isInteractiveElement) {
        setIsInteractive(true);
        setIsHovering(true);
      } else {
        setIsInteractive(false);
        setIsHovering(false);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: mousePosition.x - (isInteractive ? 12 : 8),
        y: mousePosition.y - (isInteractive ? 12 : 8),
      }}
      animate={{
        scale: isInteractive ? 1.5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
      }}
    >
      <div 
        className="bg-white rounded-full transition-all duration-200"
        style={{
          width: isInteractive ? '24px' : '16px',
          height: isInteractive ? '24px' : '16px',
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;