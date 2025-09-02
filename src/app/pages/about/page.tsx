"use client";

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const containerRef = useRef(null);
  
  // Scroll setup for OVELA section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Footer scrolls faster (more transform)
  const footerY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  // OVELA div scrolls slower (less transform)
  const ovelaY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Scroll animation for OVELA reveal effect
  const ovelaRef = useRef(null);
  const [ovelaInView, setOvelaInView] = useState(false);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      // Trigger animation when scroll progress is near the end (90% or more)
      if (latest >= 0.9 && !ovelaInView) {
        setOvelaInView(true);
      }
    });
    
    return unsubscribe;
  }, [scrollYProgress, ovelaInView]);
  
  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      <Navigation />
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-[130px] left-4 lg:left-[70px] z-40"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </motion.div>
      
      {/* Hero Section */}
      <section className="pt-[115px] pb-20 px-4 lg:px-[70px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl lg:text-6xl font-normal text-white mb-8 tracking-wider">
            ABOUT OVELA
          </h1>
          <p className="text-white/80 text-lg lg:text-xl leading-relaxed mb-12">
            Born from the intersection of street culture and minimalist design, OVELA represents 
            a new generation of conscious fashion that speaks to the modern urban lifestyle.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="px-4 lg:px-[70px] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl lg:text-4xl font-normal text-white mb-8 tracking-wide">
              Our Story
            </h2>
            <div className="space-y-6 text-white/70 text-base lg:text-lg leading-relaxed">
              <p>
                Founded in 2020, OVELA emerged from a desire to create clothing that transcends 
                traditional boundaries between streetwear and high fashion. Our name represents 
                the concept of being "off-line" from conventional fashion norms.
              </p>
              <p>
                Every piece in our collection is thoughtfully designed with sustainability and 
                longevity in mind, using premium materials and ethical manufacturing processes 
                that respect both people and planet.
              </p>
              <p>
                We believe in the power of simplicity, creating timeless pieces that allow 
                individual expression while maintaining a cohesive aesthetic that speaks to 
                the conscious consumer.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-secondary p-8 lg:p-12">
              <Image
                src="https://picsum.photos/600/400"
                alt="OVELA Studio"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 lg:px-[70px] py-20 bg-secondary">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-normal text-white mb-6 tracking-wide">
            Our Values
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Sustainability",
              description: "Every decision we make considers the environmental impact, from material sourcing to packaging."
            },
            {
              title: "Quality",
              description: "We believe in creating pieces that last, using premium materials and expert craftsmanship."
            },
            {
              title: "Authenticity",
              description: "Our designs reflect genuine street culture and the real experiences of our community."
            }
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + (index * 0.2) }}
              className="text-center"
            >
              <h3 className="text-xl lg:text-2xl font-normal text-white mb-4 tracking-wide uppercase">
                {value.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 lg:px-[70px] py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-normal text-white mb-6 tracking-wide">
            The Team
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A collective of designers, artists, and visionaries united by a shared passion 
            for authentic expression and sustainable fashion.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Alex Chen", role: "Creative Director" },
            { name: "Maya Rodriguez", role: "Head of Design" },
            { name: "Jordan Kim", role: "Sustainability Lead" },
            { name: "Sam Taylor", role: "Brand Strategy" }
          ].map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + (index * 0.1) }}
              className="text-center"
            >
              <div className="bg-secondary mb-4 aspect-square">
                <Image
                  src="https://picsum.photos/300/300"
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white text-lg font-normal mb-2">{member.name}</h3>
              <p className="text-white/60 text-sm uppercase tracking-wider">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer with faster scroll */}
      <motion.div style={{ y: footerY }}>
        <Footer />
      </motion.div>
      
      {/* OVELA Section with slower scroll and reveal effect */}
      <motion.div 
        ref={ovelaRef}
        className="w-full h-[60vh] lg:h-[70vh] xl:h-[80vh] flex items-center justify-center bg-black text-white relative z-10"
        style={{ y: ovelaY }}
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
      </motion.div>
    </div>
  );
}