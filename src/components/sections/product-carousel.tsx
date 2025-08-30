"use client";

import Image from 'next/image';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Product {
  id: number;
  name: string;
  href: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Amnesia',
    href: '/en/products/amnesia',
    price: '40€',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Amnesia-Focus-22.webp?',
    imageAlt: 'Black bucket hat on a light background',
  },
  {
    id: 2,
    name: 'Quiet remorse',
    href: '/en/products/quiet-remorse-noir',
    price: '64€',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Remose-Focus-23.webp?',
    imageAlt: 'Black t-shirt with a white graphic on a light background',
  },
  {
    id: 3,
    name: 'Fragment',
    href: '/en/products/fragment',
    price: '160€',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Fragment-Focus-24.webp?',
    imageAlt: 'Black hoodie with a white graphic on a light background',
  },
  {
    id: 4,
    name: 'Quiet remorse blue',
    href: '/en/products/quiet-remorse-bleu',
    price: '64€',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/RemoseB-Focus-25.webp?',
    imageAlt: 'Blue t-shirt with a white graphic on a light background',
  },
  {
    id: 5,
    name: 'Amnesia blue',
    href: '/en/products/amnesia-bleu',
    price: '40€',
    imageSrc: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/AmnesiaB-Focus-26.webp?',
    imageAlt: 'Blue bucket hat on a light background',
  },
];

const ProductCarousel = () => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const productVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="bg-black py-24"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="px-4 lg:px-[70px]">
        <motion.div 
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          variants={itemVariants}
        >
          {products.map((product, index) => (
            <motion.div 
              key={product.id} 
              className="w-[220px] flex-shrink-0 lg:w-[260px]"
              variants={productVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={product.href} className="group grid gap-y-6">
                <motion.div 
                  className="aspect-[4/5] overflow-hidden rounded-md bg-off-white"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      width={260}
                      height={325}
                      className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out"
                    />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="grid gap-y-1 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                >
                  <motion.h3 
                    className="text-base font-normal uppercase text-white group-hover:text-white/80 transition-colors duration-200"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.name}
                  </motion.h3>
                  <motion.p 
                    className="text-base font-normal text-white/60 group-hover:text-white/50 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.price}
                  </motion.p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductCarousel;