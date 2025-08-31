"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BrandShowcase = () => {
  const parallaxRef = useRef(null);
  const { ref, isInView, blurToAppearVariants, imageBlurVariants, staggerContainerVariants, childVariants } = useScrollAnimation({ margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);

  const backgroundImageUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/d64gy-s7uro-18.webp?";
  const gifUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/giftest-21.gif?";

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <motion.section
      ref={parallaxRef}
      className="relative w-full bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      aria-label="Brand Showcase"
      variants={blurToAppearVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >

      <div className="container relative mx-auto h-full min-h-[400px] px-16 lg:min-h-[560px] lg:px-70">
        <motion.div 
          ref={ref}
          className="flex h-full items-center justify-center py-8"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="flex w-full justify-between items-center"
            variants={childVariants}
          >
            <motion.h3 
              className="font-heading text-xl font-normal uppercase tracking-[0.2em] text-white md:text-2xl"
              variants={titleVariants}
            >
              Wear Quality - Embrace Uniqueness
            </motion.h3>
            
            <motion.div 
              className="h-[35px] w-[140px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                variants={imageBlurVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="w-full h-full overflow-hidden"
              >
                <Image
                  src={gifUrl}
                  alt="OVELA brand values animation"
                  width={140}
                  height={35}
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/en/pages/about"
                className="group flex items-center gap-x-2.5 rounded-lg border border-white/20 bg-black/10 px-4 py-2.5 text-sm text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-black/30 hover:shadow-lg"
              >
                <span className="relative block h-[18px] w-[18px] overflow-hidden">
                  <motion.span 
                    className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:-translate-y-full"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight className="h-full w-full" strokeWidth={1.5} />
                  </motion.span>
                  <motion.span 
                    className="absolute inset-0 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight className="h-full w-full" strokeWidth={1.5} />
                  </motion.span>
                </span>
                <span className="font-body text-base font-light capitalize">More about ovela</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BrandShowcase;