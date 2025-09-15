"use client";

import Image from 'next/image';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { motion, type Variants } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
    name: 'B27 Uptown Low-Top Sneaker',
    href: '/products/b27-uptown-black',
    price: '₹80,100',
    imageSrc: '/products/sneakers/b27-uptown-black-1.jpg',
    imageAlt: 'Black suede low-top sneaker with modern silhouette',
  },
  {
    id: 2,
    name: 'B30 Countdown Sneaker',
    href: '/products/b30-countdown-black-smooth',
    price: '₹1,08,000',
    imageSrc: '/products/sneakers/b30-countdown-black-smooth-1.jpg',
    imageAlt: 'Black smooth calfskin sneaker with modern design',
  },
  {
    id: 3,
    name: 'B30 Countdown Technical Mesh',
    href: '/products/b30-countdown-black-mesh',
    price: '₹1,03,500',
    imageSrc: '/products/sneakers/b30-countdown-black-mesh-1.webp',
    imageAlt: 'Black technical mesh sneaker with contemporary athletic luxury',
  },
  {
    id: 4,
    name: 'B30 Countdown Blue',
    href: '/products/b30-countdown-blue-mesh',
    price: '₹1,150',
    imageSrc: '/products/sneakers/b30-countdown-blue-mesh-1.webp',
    imageAlt: 'Blue technical mesh sneaker with gradient details',
  },
  {
    id: 5,
    name: 'B80 Lounge Sneaker Black',
    href: '/products/b80-lounge-black',
    price: '₹1,21,500',
    imageSrc: '/products/sneakers/b80-lounge-black-1.webp',
    imageAlt: 'Black Cannage cashmere wool lounge sneaker',
  },
];

const ProductCarousel = () => {
  const { ref, isInView, blurToAppearVariants, imageBlurVariants, staggerContainerVariants, childVariants } = useScrollAnimation({ margin: "-20%" });

  const productVariants: Variants = {
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
      variants={blurToAppearVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="px-4 lg:px-[70px]">
        <motion.div 
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40"
          variants={childVariants}
          role="region"
          aria-label="Product carousel"
        >
          {products.map((product, index) => (
            <motion.article 
              key={product.id} 
              className="w-[220px] flex-shrink-0 lg:w-[260px]"
              variants={productVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={product.href} 
                className="group grid gap-y-6 cursor-interactive focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-lg transition-all duration-200"
                aria-label={`View ${product.name} for ${product.price}`}
              >
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
                    <motion.div
                      variants={imageBlurVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="w-full h-full overflow-hidden"
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
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductCarousel;