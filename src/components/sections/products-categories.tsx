"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const categories = [
  {
    name: "T-shirt",
    href: "/en/collections/t-shirt",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/cmnf7-znhug-27.webp?",
  },
  {
    name: "Hoodie",
    href: "/en/collections/hoodie",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/hoodie1920-28.webp?",
  },
  {
    name: "Hat",
    href: "/en/collections/hat",
    image:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/bucketstub-29.webp?",
  },
];

interface CategoryCardProps {
  href: string;
  imgSrc: string;
  categoryName: string;
  index: number;
  imageBlurVariants: any;
  isInView: boolean;
}

const CategoryCard = ({ href, imgSrc, categoryName, index, imageBlurVariants, isInView }: CategoryCardProps) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.a 
      href={href} 
      className="grid rounded-md overflow-hidden group aspect-[380/480] relative focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20%" }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-label={`Browse ${categoryName} collection`}
      role="link"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="col-start-1 row-start-1"
      >
        <motion.div
          variants={imageBlurVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full h-full overflow-hidden"
        >
          <Image
            src={imgSrc}
            alt={`${categoryName} category showcase image`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      <motion.div 
        className="col-start-1 row-start-1 bg-gradient-to-t from-black/60 via-black/30 to-transparent" 
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span 
        className="col-start-1 row-start-1 self-end p-5 text-2xl text-white font-light z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
        whileHover={{ y: -5, scale: 1.05 }}
      >
        {categoryName}
      </motion.span>
    </motion.a>
  );
};

const ProductsCategories = () => {
  const { ref, isInView, blurToAppearVariants, imageBlurVariants, staggerContainerVariants, childVariants } = useScrollAnimation({ margin: "-20%" });

  const titleVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
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
      className="bg-black text-white py-16 lg:py-40 px-4 lg:px-[70px]"
      variants={blurToAppearVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div 
        className="h-px bg-border" 
        variants={childVariants}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ originX: 0 }}
      />
      <div className="mt-16 grid lg:grid-cols-2 lg:gap-x-20 gap-y-16">
        <motion.div 
          className="flex flex-col gap-12 justify-start lg:justify-center"
          variants={childVariants}
        >
          <div className="flex flex-col gap-4">
            <motion.p 
              className="text-sm uppercase text-muted-foreground tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Our products
            </motion.p>
            <motion.h2 
              className="text-5xl font-light leading-tight"
              variants={titleVariants}
            >
              Limited-stock
              <br />
              sustainable apparel
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="/en/collections/all"
              className="inline-flex items-center gap-3 bg-secondary text-foreground py-3 px-5 rounded-md text-sm font-light hover:opacity-90 transition-all duration-200 w-fit group"
            >
              <motion.div
                whileHover={{ rotate: 5, x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
              <span>Discover all items</span>
            </a>
          </motion.div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={childVariants}
          role="grid"
          aria-label="Product categories"
        >
          {categories.map((category, index) => (
            <div key={category.name} role="gridcell">
              <CategoryCard
                href={category.href}
                imgSrc={category.image}
                categoryName={category.name}
                index={index}
                imageBlurVariants={imageBlurVariants}
                isInView={isInView}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductsCategories;