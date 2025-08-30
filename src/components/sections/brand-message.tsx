"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FranceIcon = ({ className }: { className?: string }) => (
    <span className={`inline-block align-middle mx-1 h-[0.8em] w-[1.1em] -translate-y-[0.06em] ${className || ''}`}>
        <svg
            className="w-full h-full"
            viewBox="0 0 30.75 28.5"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
        >
            <g>
                <path
                    d="M7.49988 1.5C3.35777 1.5 0 4.85777 0 9C0 12.016 1.76566 14.6048 4.3125 15.8953V20.25H6.5625V28.5H10.6875V20.25H12.9375V15.8953C15.4843 14.6048 17.25 12.016 17.25 9C17.25 4.85777 13.8921 1.5 9.87488 1.5H7.49988Z M9.87488 3.75H7.49988C4.5966 3.75 2.25 6.0966 2.25 9C2.25 11.2335 3.6339 13.1166 5.625 13.911V18H11.625V13.911C13.6161 13.1166 15 11.2335 15 9C15 6.0966 12.7533 3.75 9.87488 3.75Z"
                />
                <path
                    d="M22.5 1.5V13.5L25.875 11.25V6L30 8.25V0L22.5 1.5Z M27.75 3.54395L24.75 1.78145V4.6875L27.75 6.45V3.54395Z"
                />
                <path
                    d="M27 15.75L20.25 21V28.5H30.75V15.75H27Z M28.5 26.25H22.5V22.9688L27.5625 18H28.5V26.25Z"
                />
            </g>
        </svg>
    </span>
);

const BrandMessage = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });
    
    const fullText = "Exclusive, sustainable fashion, designed and customized in France for those who value quality and authenticity over mass production.";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 30 },
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
        <section
            ref={ref}
            aria-label="Block text"
            className="grid bg-black py-16 lg:py-48"
        >
            <motion.div 
                className="grid w-fit justify-self-center text-center"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                
                {/* Desktop Version */}
                <motion.p 
                    className="hidden font-sans text-[38px] leading-[1.2] -tracking-[0.01em] text-white lg:inline-block max-w-[894px]"
                    variants={textVariants}
                >
                    Exclusive, sustainable fashion, designed and
                    <br />
                    customized in
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <FranceIcon />
                    </motion.span>
                    France for those who value quality
                    <br />
                    and authenticity over mass production.
                </motion.p>
                
                {/* Mobile Version */}
                <motion.p 
                    className="inline-block px-4 font-sans text-[24px] leading-[1.25] -tracking-[0.01em] text-white lg:hidden"
                    variants={textVariants}
                >
                    Exclusive, sustainable fashion,
                    <br />
                    designed and customized
                    <br />
                    in
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <FranceIcon />
                    </motion.span>
                    France for those who value
                    <br />
                    quality and authenticity over
                    <br />
                    mass production.
                </motion.p>

                {/* Screen Reader Only Version */}
                <p className="sr-only" aria-label="presentation brand">
                    {fullText}
                </p>

            </motion.div>
        </section>
    );
};

export default BrandMessage;