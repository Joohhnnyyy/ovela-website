"use client";

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ContactButton = () => (
  <Link href="/en/pages/contact" className="group flex gap-x-2" aria-label="Contact us">
    <motion.span 
      className="flex h-[38px] w-[38px] items-center justify-center rounded-sm border border-border bg-black p-2 text-white transition-colors group-hover:bg-accent"
      whileHover={{ rotate: 5, scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={1} />
    </motion.span>
    <motion.span 
      className="flex h-[38px] items-center justify-center rounded-sm border border-border bg-black px-4 text-base text-white transition-colors group-hover:bg-accent"
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
    >
      Contact us
    </motion.span>
  </Link>
);

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

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

  const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0
    }
  };

  return (
    <motion.footer
      ref={ref}
      aria-label="Footer"
      className="relative grid gap-y-18 bg-black px-4 pb-8 pt-24 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-0 lg:px-[70px] lg:pb-14 lg:pt-40"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Column 1: KNOW MORE */}
      <motion.div 
        className="grid w-fit content-start gap-y-6 justify-self-start"
        variants={columnVariants}
      >
        <motion.p 
          className="font-sans text-sm uppercase tracking-wider text-white/40"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          KNOW MORE
        </motion.p>
        <ul className="grid gap-y-4">
          {[
            { href: "/en/policies/terms-of-service", text: "Terms & conditions" },
            { href: "/en/policies/refund-policy", text: "Return & Exchanges" },
            { href: "/en/policies/privacy-policy", text: "Privacy policy" }
          ].map((link, index) => (
            <motion.li 
              key={link.href}
              variants={linkVariants}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={link.href} 
                  className="text-base text-white transition-opacity hover:opacity-80"
                >
                  {link.text}
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Column 2: Social */}
      <motion.div 
        className="grid w-fit content-start justify-self-start lg:justify-self-center"
        variants={columnVariants}
      >
        <ul className="grid gap-y-4">
          {[
            { href: "https://www.instagram.com/oflyn_clo/", text: "Instagram" },
            { href: "https://twitter.com/Oflyn_clo", text: "Twitter" },
            { href: "https://www.facebook.com/profile.php?id=100092305583617", text: "Facebook" }
          ].map((social, index) => (
            <motion.li 
              key={social.href}
              variants={linkVariants}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <motion.div
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base text-white transition-opacity hover:opacity-80"
                >
                  {social.text}
                </a>
              </motion.div>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Column 3: Contact */}
      <motion.div 
        className="grid w-fit content-start justify-self-start lg:justify-self-end"
        variants={columnVariants}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <ContactButton />
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;