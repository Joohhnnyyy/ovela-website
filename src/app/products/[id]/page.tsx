"use client";

import Navigation from '@/components/sections/navigation';
import Footer from '@/components/sections/footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

const products = [
  {
    id: 1,
    name: "Black Hoodie Set",
    price: "$189",
    images: [
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E03.webp",
      "/LOOK_H_25_4_LOOK_070_E04.webp"
    ],
    category: "Hoodies",
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium hoodie set with matching accessories",
    details: "100% cotton fleece with adjustable hood",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 2,
    name: "Black Hoodie Set",
    price: "$189",
    images: [
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E03.webp",
      "/LOOK_H_25_4_LOOK_070_E04.webp"
    ],
    category: "Hoodies",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium hoodie set with matching accessories",
    details: "100% cotton fleece with adjustable hood",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 3,
    name: "Black Hoodie Set",
    price: "$189",
    images: [
      "/LOOK_H_25_4_LOOK_070_E03.webp",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E04.webp"
    ],
    category: "Hoodies",
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium hoodie set with matching accessories",
    details: "100% cotton fleece with adjustable hood",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 4,
    name: "Black Hoodie Set",
    price: "$189",
    images: [
      "/LOOK_H_25_4_LOOK_070_E04.webp",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E03.webp"
    ],
    category: "Hoodies",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium hoodie set with matching accessories",
    details: "100% cotton fleece with adjustable hood",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 5,
    name: "Black Jacket",
    price: "$249",
    images: [
      "/493C424D6500C980_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E03.webp"
    ],
    category: "Jackets",
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium black jacket with modern design",
    details: "High-quality materials with water-resistant coating",
    care: "Dry clean only",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 6,
    name: "Black Outfit",
    price: "$199",
    images: [
      "/541V01A1699X8830_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/493C424D6500C980_E01.jpeg"
    ],
    category: "Sets",
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    description: "Complete black outfit set for modern style",
    details: "Coordinated pieces for a complete look",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 7,
    name: "Premium Hoodie",
    price: "$229",
    images: [
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E03.webp",
      "/LOOK_H_25_4_LOOK_070_E04.webp"
    ],
    category: "Hoodies",
    colors: ["Black", "Gray", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Premium quality hoodie with superior comfort",
    details: "Premium cotton blend with reinforced stitching",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 8,
    name: "Urban Jacket",
    price: "$299",
    images: [
      "/493C424D6500C980_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/541V01A1699X8830_E01.jpeg"
    ],
    category: "Jackets",
    colors: ["Black", "Olive", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Urban style jacket for city adventures",
    details: "Durable fabric with multiple pockets",
    care: "Machine wash cold, hang dry",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 9,
    name: "Complete Set",
    price: "$349",
    images: [
      "/541V01A1699X8830_E01.jpeg",
      "/493C424D6500C980_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp"
    ],
    category: "Sets",
    colors: ["Black", "Charcoal", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Complete outfit set with all essentials",
    details: "Full coordinated set for any occasion",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 10,
    name: "Oversized Hoodie",
    price: "$209",
    images: [
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E03.webp",
      "/LOOK_H_25_4_LOOK_070_E04.webp"
    ],
    category: "Hoodies",
    colors: ["Black", "Gray"],
    sizes: ["M", "L", "XL", "XXL"],
    description: "Oversized hoodie for ultimate comfort",
    details: "Relaxed fit with dropped shoulders",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 11,
    name: "Bomber Jacket",
    price: "$279",
    images: [
      "/493C424D6500C980_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/541V01A1699X8830_E01.jpeg"
    ],
    category: "Jackets",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    description: "Classic bomber jacket with modern twist",
    details: "Lightweight yet durable construction",
    care: "Machine wash cold, hang dry",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 12,
    name: "Casual Set",
    price: "$259",
    images: [
      "/541V01A1699X8830_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/493C424D6500C980_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E02.webp"
    ],
    category: "Sets",
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Casual set perfect for everyday wear",
    details: "Comfortable and versatile pieces",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 13,
    name: "Zip Hoodie",
    price: "$199",
    images: [
      "/LOOK_H_25_4_LOOK_070_E03.webp",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/LOOK_H_25_4_LOOK_070_E04.webp"
    ],
    category: "Hoodies",
    colors: ["Black", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Zip-up hoodie for versatile styling",
    details: "Full-zip design with kangaroo pocket",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 14,
    name: "Denim Jacket",
    price: "$319",
    images: [
      "/493C424D6500C980_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/541V01A1699X8830_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E02.webp"
    ],
    category: "Jackets",
    colors: ["Black", "Indigo"],
    sizes: ["S", "M", "L", "XL"],
    description: "Classic denim jacket with modern fit",
    details: "Premium denim with vintage wash",
    care: "Machine wash cold, hang dry",
    shipping: "Free shipping on orders over 50€"
  },
  {
    id: 15,
    name: "Sport Set",
    price: "$289",
    images: [
      "/541V01A1699X8830_E01.jpeg",
      "/LOOK_H_25_4_LOOK_070_E01.webp",
      "/LOOK_H_25_4_LOOK_070_E02.webp",
      "/493C424D6500C980_E01.jpeg"
    ],
    category: "Sets",
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Athletic set for active lifestyle",
    details: "Moisture-wicking fabric with stretch",
    care: "Machine wash cold, tumble dry low",
    shipping: "Free shipping on orders over 50€"
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = products.find(p => p.id === productId);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Scroll setup for OVELA section
  const containerRef = useRef(null);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Product not found</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16">
            
            {/* Left Side - Enhanced Image Gallery */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <motion.div 
                className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden group cursor-zoom-in"
                onClick={() => setIsFullscreen(true)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`w-full h-full transition-transform duration-500 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  onHoverStart={() => setIsZoomed(true)}
                  onHoverEnd={() => setIsZoomed(false)}
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onLoad={() => setImageLoading(false)}
                    onLoadStart={() => setImageLoading(true)}
                  />
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                  )}
                </motion.div>
                
                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </motion.div>
              
              {/* Enhanced Thumbnail Images */}
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageLoading(true);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-white shadow-lg scale-105' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: selectedImage === index ? 1.05 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="bg-black text-white p-4 md:p-8 rounded-lg">
              <div className="space-y-4 md:space-y-6">
                
                {/* Product Name and Price */}
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{product.name}</h1>
                  <p className="text-xl md:text-2xl font-semibold">{product.price}</p>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-center lg:text-left">Color</h3>
                  <div className="flex justify-center lg:justify-start space-x-4">
                    {product.colors.map((color, index) => (
                      <motion.button
                        key={color}
                        onClick={() => setSelectedColor(index)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all touch-manipulation ${
                          selectedColor === index ? 'border-white shadow-lg' : 'border-gray-500 hover:border-gray-400'
                        } ${
                          color.toLowerCase() === 'black' ? 'bg-black' : 'bg-white'
                        }`}
                        whileHover={{ scale: selectedColor === index ? 1.1 : 1.15 }}
                        whileTap={{ scale: 0.95 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium uppercase tracking-wide">Size</h3>
                    <button className="text-xs underline">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size, index) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(index)}
                        className={`py-3 md:py-2 px-4 border rounded transition-all text-sm md:text-base font-medium touch-manipulation ${
                          selectedSize === index 
                            ? 'border-white bg-white text-black shadow-lg' 
                            : 'border-gray-500 hover:border-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                 <div className="space-y-3">
                   <h3 className="text-sm font-medium uppercase tracking-wide text-center lg:text-left">Quantity</h3>
                   <div className="flex justify-center lg:justify-start">
                     <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
                       <motion.button
                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
                         className="px-4 py-3 hover:bg-gray-700 transition-colors touch-manipulation"
                         whileHover={{ backgroundColor: "rgb(55 65 81)" }}
                         whileTap={{ scale: 0.95 }}
                         disabled={quantity <= 1}
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                         </svg>
                       </motion.button>
                       <input
                         type="number"
                         value={quantity}
                         onChange={(e) => {
                           const value = parseInt(e.target.value) || 1;
                           setQuantity(Math.max(1, Math.min(10, value)));
                         }}
                         className="w-16 py-3 text-center bg-transparent border-none outline-none text-white"
                         min="1"
                         max="10"
                       />
                       <motion.button
                         onClick={() => setQuantity(Math.min(10, quantity + 1))}
                         className="px-4 py-3 hover:bg-gray-700 transition-colors touch-manipulation"
                         whileHover={{ backgroundColor: "rgb(55 65 81)" }}
                         whileTap={{ scale: 0.95 }}
                         disabled={quantity >= 10}
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                       </motion.button>
                     </div>
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="space-y-3 pt-4">
                   <motion.button 
                     className="w-full bg-white text-black py-4 md:py-3 px-6 rounded-xl md:rounded font-medium hover:bg-gray-100 transition-colors text-base md:text-lg touch-manipulation"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     Buy now
                   </motion.button>
                   <motion.button 
                     className="w-full border-2 border-white text-white py-4 md:py-3 px-6 rounded-xl md:rounded font-medium hover:bg-white hover:text-black transition-colors text-base md:text-lg touch-manipulation"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     Add to bag ({quantity})
                   </motion.button>
                 </div>

                {/* Enhanced Product Details */}
                <div className="space-y-3 pt-6 border-t border-gray-700">
                  <motion.details 
                    className="group bg-gray-900/50 rounded-lg overflow-hidden"
                    whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.6)" }}
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-800/50 transition-colors touch-manipulation">
                      <span className="font-semibold text-base tracking-wide">Product Details</span>
                      <motion.span 
                        className="text-xl group-open:rotate-45 transition-transform"
                        whileHover={{ scale: 1.1 }}
                      >
                        +
                      </motion.span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-300 leading-relaxed">{product.details}</p>
                    </div>
                  </motion.details>
                  
                  <motion.details 
                    className="group bg-gray-900/50 rounded-lg overflow-hidden"
                    whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.6)" }}
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-800/50 transition-colors touch-manipulation">
                      <span className="font-semibold text-base tracking-wide">Product Care</span>
                      <motion.span 
                        className="text-xl group-open:rotate-45 transition-transform"
                        whileHover={{ scale: 1.1 }}
                      >
                        +
                      </motion.span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-300 leading-relaxed">{product.care}</p>
                    </div>
                  </motion.details>
                  
                  <motion.details 
                    className="group bg-gray-900/50 rounded-lg overflow-hidden"
                    whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.6)" }}
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-800/50 transition-colors touch-manipulation">
                      <span className="font-semibold text-base tracking-wide">Shipping & Returns</span>
                      <motion.span 
                        className="text-xl group-open:rotate-45 transition-transform"
                        whileHover={{ scale: 1.1 }}
                      >
                        +
                      </motion.span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-300 leading-relaxed">{product.shipping}</p>
                    </div>
                  </motion.details>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products Section */}
        <motion.div 
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">You might also like</h2>
            <p className="text-gray-300">Discover more from our collection</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).filter(p => p.id !== product.id).map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden mb-3">
                  <Image
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-white mb-1 text-sm md:text-base group-hover:text-gray-200 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base">{relatedProduct.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullscreen(false)}
        >
          <motion.div
            className="relative max-w-4xl max-h-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={1200}
              height={1200}
              className="w-full h-full object-contain rounded-lg"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {product.images.length}
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Footer with faster scroll */}
      <motion.div style={{ y: footerY }} className="mt-8">
        <Footer />
      </motion.div>
      
      {/* OVELA Section with slower scroll and reveal effect */}
      <motion.div 
        ref={ovelaRef}
        className="w-full h-[60vh] lg:h-[70vh] xl:h-[80vh] flex items-center justify-center bg-black text-white relative z-10 -mt-16"
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