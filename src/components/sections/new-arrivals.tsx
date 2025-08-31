"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type ProductVariant = {
  colorHex: string;
  images: string[];
};

type Product = {
  id: number;
  name: string;
  type: string;
  price: string;
  isNew: boolean;
  productUrl: string;
  sizes: string[];
  variants: ProductVariant[];
};

const productsData: Product[] = [
  {
    id: 1,
    name: 'Fragment',
    type: 'Hoodie',
    price: '160€',
    isNew: true,
    productUrl: '/en/products/fragment',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      {
        colorHex: '#141414',
        images: [
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Fragment-W-Front-2.webp?',
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Fragment-W-Back-3.webp?',
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Fragment-M-Back-4.webp?',
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Fragment-Focus-5.webp?',
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Amnesia',
    type: 'Bucket hat',
    price: '40€',
    isNew: true,
    productUrl: '/en/products/amnesia-bleu',
    sizes: ['TU'],
    variants: [
      {
        colorHex: '#141414',
        images: [
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Amnesia-Focus2-11.webp?',
        ],
      },
      {
        colorHex: '#072f83',
        images: [
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/AmnesiaB-W-Front-8.webp?',
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/AmnesiaB-W-Side-9.webp?',
          'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/AmnesiaB-Focus-10.webp?',
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Quiet remorse',
    type: 'T-shirt',
    price: '64€',
    isNew: true,
    productUrl: '/en/products/quiet-remorse-noir',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      {
        colorHex: '#141414',
        images: [
            'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Remorse-M-Front-13.webp?',
            'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Remorse-W-Back2-15.webp?',
            'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Remose-Focus-16.webp?',
        ],
      },
      {
        colorHex: '#072f83',
        images: [ // Reusing black images as no blue ones are provided
            'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Remorse-M-Front-13.webp?',
            'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Remorse-W-Back2-15.webp?',
            'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c15368c0-3e82-4fbc-b713-6f8edd52e140-oflyn-fr/assets/images/Remose-Focus-16.webp?',
        ],
      },
    ],
  },
];

function ProductCard({ product, index, imageBlurVariants, isInView }: { product: Product; index: number; imageBlurVariants: any; isInView: boolean }) {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeVariant = useMemo(() => product.variants[activeVariantIndex], [product, activeVariantIndex]);

  const handleVariantHover = (index: number) => {
    setActiveVariantIndex(index);
    setActiveImageIndex(0);
  };

  const currentImages = activeVariant.images;
  const currentImage = currentImages[activeImageIndex] || currentImages[0];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.article 
      className="grid gap-y-8"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      <div className="relative group overflow-hidden rounded-sm">
        <Link href={product.productUrl} passHref>
          <motion.div 
            className="overflow-hidden rounded-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              variants={imageBlurVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="w-full h-full overflow-hidden"
            >
              <Image
                src={currentImage}
                alt={`${product.name} ${product.type}`}
                width={580}
                height={725}
                className="w-full h-full object-cover aspect-[580/725] transition-transform duration-300 group-hover:scale-105"
              />
            </motion.div>
          </motion.div>
        </Link>
        {product.isNew && (
          <motion.div 
            className="absolute top-4 left-4 flex items-center gap-x-2 text-sm uppercase text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-[4px] px-3 py-1.5">New</div>
            <div className="bg-black/40 backdrop-blur-sm rounded-[4px] px-3 py-1.5">{product.type}</div>
          </motion.div>
        )}
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ y: 20 }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-[4px] p-2">
            <p className="text-white text-sm text-center mb-2">Quick add to bag</p>
            <div className="flex justify-center items-center gap-2">
              {product.sizes.map((size, sizeIndex) => (
                <motion.div
                  key={size}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: sizeIndex * 0.05, duration: 0.2 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent border-gray-600 text-white hover:bg-white hover:text-black h-9 w-9 rounded-[4px] transition-all duration-200"
                  >
                    {size}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-4 left-4 flex gap-x-1">
          {currentImages.map((_, index) => (
            <motion.button
              key={index}
              onMouseEnter={() => setActiveImageIndex(index)}
              className={cn(
                'h-1 w-5 rounded-full transition-all duration-200',
                index === activeImageIndex ? 'bg-white' : 'bg-white/50'
              )}
              aria-label={`View image ${index + 1}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      </div>
      <motion.div 
        className="grid gap-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      >
        <div className="flex justify-between items-start text-white">
          <Link href={product.productUrl} passHref>
            <motion.h3 
              className="text-xl hover:opacity-80 transition-opacity"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>
            <span className="sr-only">View product</span>
          </Link>
          <p className="text-xl">{product.price}</p>
        </div>
        
        {product.variants.length > 1 && (
          <div className="flex items-center gap-x-2">
            {product.variants.map((variant, variantIndex) => (
              <motion.button
                key={variant.colorHex}
                onMouseEnter={() => handleVariantHover(variantIndex)}
                onClick={() => handleVariantHover(variantIndex)}
                aria-label={`Color ${variant.colorHex}`}
                className={cn(
                  'w-5 h-5 rounded-full border border-transparent transition-all duration-200',
                   variantIndex === activeVariantIndex ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : 'hover:ring-1 hover:ring-white/50'
                )}
                style={{ backgroundColor: variant.colorHex }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + variantIndex * 0.05, duration: 0.3 }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.article>
  );
}

export default function NewArrivals() {
  const { ref, isInView, blurToAppearVariants, imageBlurVariants, staggerContainerVariants, childVariants } = useScrollAnimation({ margin: "-20%" });

  return (
    <motion.section 
      ref={ref}
      className="grid gap-y-8 px-4 pb-32 lg:px-[70px] lg:pb-40"
      variants={blurToAppearVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div 
        className="border-t border-white/15"
        variants={childVariants}
      />
      <div className="mt-8 grid gap-y-10">
        <motion.div 
          className="flex flex-col items-start gap-y-10 lg:flex-row lg:items-center lg:justify-between"
          variants={childVariants}
        >
          <h2 className="text-xl uppercase text-white">New arrivals</h2>
          <div className="hidden lg:flex">
            <Link href="/en/collections/all" passHref>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="ghost" className="text-white hover:bg-secondary/50 hover:text-white p-0">
                  <div className="flex items-center gap-x-2">
                    <motion.div 
                      className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-gray-dark bg-secondary transition-colors group-hover:bg-primary"
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                    <span className="text-base font-normal normal-case">
                      Discover all items
                    </span>
                  </div>
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {productsData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} imageBlurVariants={imageBlurVariants} isInView={isInView} />
          ))}
        </div>
        <motion.div 
          className="flex lg:hidden pt-4"
          variants={childVariants}
        >
           <Link href="/en/collections/all" passHref>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="ghost" className="text-white hover:bg-secondary/50 hover:text-white p-0">
                  <div className="flex items-center gap-x-2">
                    <motion.div 
                      className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-gray-dark bg-secondary transition-colors group-hover:bg-primary"
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                    <span className="text-base font-normal normal-case">
                      Discover all items
                    </span>
                  </div>
                </Button>
              </motion.div>
            </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}