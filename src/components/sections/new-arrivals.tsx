"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
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
    name: 'CD Icon T-Shirt Fitted',
    type: 'T-shirt',
    price: '₹58,500',
    isNew: true,
    productUrl: '/products/cd-icon-tshirt-white-fitted',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    variants: [
      {
        colorHex: '#ffffff',
        images: [
          '/products/clothing/cd-icon-tshirt-white-fitted-1.webp',
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Christian Dior Couture T-Shirt',
    type: 'T-shirt',
    price: '₹67,500',
    isNew: true,
    productUrl: '/products/dior-couture-tshirt-white-relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      {
        colorHex: '#ffffff',
        images: [
          '/products/clothing/dior-couture-tshirt-white-relaxed-1.webp',
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Dior Montaigne T-Shirt',
    type: 'T-shirt',
    price: '₹53,100',
    isNew: true,
    productUrl: '/products/dior-montaigne-tshirt-white-regular',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      {
        colorHex: '#ffffff',
        images: [
          '/products/clothing/dior-montaigne-tshirt-white-regular-1.jpg',
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'CD Icon Sweatshirt',
    type: 'Hoodie',
    price: '₹1,200',
    isNew: true,
    productUrl: '/products/cd-icon-sweatshirt-black',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      {
        colorHex: '#141414',
        images: [
          '/products/clothing/cd-icon-sweatshirt-black-1.webp',
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Dior Montaigne Sweatshirt',
    type: 'Hoodie',
    price: '₹99,000',
    isNew: true,
    productUrl: '/products/dior-montaigne-sweatshirt-black',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      {
        colorHex: '#141414',
        images: [
          '/products/clothing/dior-montaigne-sweatshirt-black-1.jpg',
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Christian Dior Couture Hooded Jacket',
    type: 'Hoodie',
    price: '₹252,000',
    isNew: true,
    productUrl: '/products/dior-couture-hooded-jacket-black',
    sizes: ['46', '48', '50', '52', '54'],
    variants: [
      {
        colorHex: '#141414',
        images: [
          '/products/clothing/dior-couture-hooded-jacket-black-1.jpg',
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
        <Link 
          href={product.productUrl} 
          className="block focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm transition-all duration-200"
          aria-label={`View ${product.name} ${product.type} for ${product.price}`}
        >
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
                alt={`${product.name} ${product.type} product image`}
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
                    className="bg-transparent border-gray-600 text-white hover:bg-white hover:text-black h-9 w-9 rounded-[4px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={`Add ${product.name} size ${size} to cart`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to cart functionality would go here
                    }}
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
                aria-label={`Select ${variant.colorHex === '#141414' ? 'black' : variant.colorHex === '#072f83' ? 'blue' : 'color'} variant`}
                aria-pressed={variantIndex === activeVariantIndex}
                className={cn(
                  'w-5 h-5 rounded-full border border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black',
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
            <Link href="/collections/all" passHref>
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
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3" role="grid" aria-label="New arrivals products">
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