export interface Product {
  id: string;
  name: string;
  category: 'sneakers' | 'clothing' | 'accessories' | 'bags';
  price: number;
  originalPrice?: number;
  description: string;
  material: string;
  colors: string[];
  sizes: string[];
  images: string[];
  featured?: boolean;
  details?: {
    craftsmanship?: string;
    origin?: string;
    artisanStory?: string;
    uniqueFeatures?: string[];
  };
  care?: {
    instructions: string[];
    warnings?: string[];
    professionalCare?: boolean;
  };
  shipping?: {
    freeShippingThreshold?: number;
    estimatedDelivery: string;
    expeditedOptions?: string[];
  };
  returns?: {
    policy: string;
    timeframe: string;
    conditions: string[];
  };
}

export const products: Product[] = [
  // SNEAKERS
  {
    id: 'b27-uptown-black',
    name: 'B27 Uptown Low-Top Sneaker',
    category: 'sneakers',
    price: 80100,
    description: 'The B27 low-top sneaker is a new essential that plays with codes and materials. Crafted in black suede, it features a modern silhouette.',
    material: 'Black Suede and Smooth Calfskin',
    colors: ['Black'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b27-uptown-black-1.jpg'],
    featured: true,
    details: {
      craftsmanship: 'Handcrafted by skilled artisans in Italy using traditional techniques passed down through generations.',
      origin: 'Made in Italy',
      artisanStory: 'Each pair is meticulously crafted by master shoemakers in our Italian atelier, where attention to detail and quality are paramount.',
      uniqueFeatures: ['Hand-stitched construction', 'Premium Italian leather', 'Signature CD logo detailing', 'Cushioned insole for comfort']
    },
    care: {
      instructions: [
        'Clean with a soft, dry cloth to remove surface dirt',
        'Use a suede brush to maintain texture',
        'Apply suede protector spray before first wear',
        'Store in dust bags when not in use',
        'Avoid exposure to water and direct sunlight'
      ],
      warnings: ['Do not machine wash', 'Avoid harsh chemicals'],
      professionalCare: true
    },
    shipping: {
      freeShippingThreshold: 45000,
      estimatedDelivery: '3-5 business days',
      expeditedOptions: ['Next day delivery', '2-day express']
    },
    returns: {
      policy: 'Free returns within 30 days',
      timeframe: '30 days',
      conditions: [
        'Items must be in original condition',
        'Original packaging required',
        'Proof of purchase needed',
        'Unworn with all tags attached'
      ]
    }
  },
  {
    id: 'b30-countdown-black-smooth',
    name: 'B30 Countdown Sneaker',
    category: 'sneakers',
    price: 108000,
    description: 'The B30 sneaker has become a new House essential, distinguished by its modern design. Crafted in black smooth calfskin.',
    material: 'Black Smooth Calfskin',
    colors: ['Black'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b30-countdown-black-smooth-1.jpg']
  },
  {
    id: 'b30-countdown-black-mesh',
    name: 'B30 Countdown Sneaker Technical Mesh',
    category: 'sneakers',
    price: 103500,
    description: 'The B30 sneaker in black technical mesh offers a contemporary take on athletic luxury.',
    material: 'Black Technical Mesh and Calfskin',
    colors: ['Black'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b30-countdown-black-mesh-1.webp', '/products/sneakers/b30-countdown-black-mesh-2.webp']
  },
  {
    id: 'b30-countdown-blue-mesh',
    name: 'B30 Countdown Sneaker Blue',
    category: 'sneakers',
    price: 1150,
    description: 'The B30 sneaker in blue technical mesh with gradient details for a modern athletic aesthetic.',
    material: 'Blue Technical Mesh with Gradient',
    colors: ['Blue'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b30-countdown-blue-mesh-1.webp']
  },
  {
    id: 'b80-lounge-black',
    name: 'B80 Lounge Sneaker Black',
    category: 'sneakers',
    price: 121500,
    description: 'The B80 lounge sneaker combines comfort and luxury in black Cannage cashmere wool.',
    material: 'Black Cannage Cashmere Wool and Calfskin',
    colors: ['Black'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b80-lounge-black-1.webp', '/products/sneakers/b80-lounge-black-2.webp', '/products/sneakers/b80-lounge-black-3.webp'],
    featured: true
  },
  {
    id: 'b80-lounge-brown',
    name: 'B80 Lounge Sneaker Brown',
    category: 'sneakers',
    price: 1350,
    description: 'The B80 lounge sneaker in brown Cannage cashmere wool for a sophisticated casual look.',
    material: 'Brown Cannage Cashmere Wool and Calfskin',
    colors: ['Brown'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b80-lounge-brown-1.webp']
  },
  {
    id: 'b80-lounge-gray',
    name: 'B80 Lounge Sneaker Gray',
    category: 'sneakers',
    price: 1350,
    description: 'The B80 lounge sneaker in Dior gray Cannage cashmere wool.',
    material: 'Dior Gray Cannage Cashmere Wool and Calfskin',
    colors: ['Gray'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b80-lounge-gray-1.webp']
  },
  {
    id: 'b80-lounge-navy',
    name: 'B80 Lounge Sneaker Navy',
    category: 'sneakers',
    price: 1350,
    description: 'The B80 lounge sneaker in navy blue Cannage cashmere wool.',
    material: 'Navy Blue Cannage Cashmere Wool and Calfskin',
    colors: ['Navy'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b80-lounge-navy-1.webp']
  },

  // CLOTHING
  {
    id: 'cd-icon-sweatshirt-black',
    name: 'CD Icon Sweatshirt',
    category: 'clothing',
    price: 1200,
    description: 'The CD Icon sweatshirt in black cotton fleece features the iconic CD signature.',
    material: 'Black Cotton Fleece',
    colors: ['Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/cd-icon-sweatshirt-black-1.webp'],
    featured: true,
    details: {
      craftsmanship: 'Expertly tailored using premium cotton fleece with meticulous attention to fit and comfort.',
      origin: 'Made in Italy',
      artisanStory: 'Crafted in our Italian workshops where traditional tailoring meets contemporary streetwear design.',
      uniqueFeatures: ['Signature CD Icon embroidery', 'Premium cotton fleece', 'Ribbed cuffs and hem', 'Relaxed fit silhouette', 'Soft interior lining']
    },
    care: {
      instructions: [
        'Machine wash cold with like colors',
        'Use gentle cycle',
        'Do not bleach',
        'Tumble dry low heat',
        'Iron on low temperature if needed',
        'Do not dry clean'
      ],
      warnings: ['Avoid fabric softeners', 'Do not iron directly on embroidery'],
      professionalCare: false
    },
    shipping: {
      freeShippingThreshold: 45000,
      estimatedDelivery: '2-4 business days',
      expeditedOptions: ['Same day delivery (select cities)', 'Next day delivery']
    },
    returns: {
      policy: 'Free returns and exchanges',
      timeframe: '30 days',
      conditions: [
        'Items must be unworn and unwashed',
        'Original tags must be attached',
        'Return in original packaging',
        'Receipt or proof of purchase required'
      ]
    }
  },
  {
    id: 'cd-icon-tshirt-white-fitted',
    name: 'CD Icon T-Shirt Fitted',
    category: 'clothing',
    price: 58500,
    description: 'The CD Icon T-shirt in fitted silhouette crafted in white cotton jersey.',
    material: 'White Cotton Jersey',
    colors: ['White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/products/clothing/cd-icon-tshirt-white-fitted-1.webp']
  },
  {
    id: 'dior-couture-tshirt-white-relaxed',
    name: 'Christian Dior Couture T-Shirt Relaxed',
    category: 'clothing',
    price: 67500,
    description: 'Christian Dior Couture T-shirt in relaxed fit, crafted in white cotton.',
    material: 'White Cotton',
    colors: ['White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/dior-couture-tshirt-white-relaxed-1.webp']
  },
  {
    id: 'dior-montaigne-sweatshirt-black',
    name: 'Dior Montaigne Sweatshirt',
    category: 'clothing',
    price: 99000,
    description: 'The Dior Montaigne sweatshirt in black cotton fleece with signature details.',
    material: 'Black Cotton Fleece',
    colors: ['Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/dior-montaigne-sweatshirt-black-1.jpg']
  },
  {
    id: 'dior-montaigne-tshirt-white-regular',
    name: 'Dior Montaigne T-Shirt Regular',
    category: 'clothing',
    price: 53100,
    description: 'Dior Montaigne T-shirt in regular fit, crafted in white mercerized cotton.',
    material: 'White Mercerized Cotton',
    colors: ['White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/dior-montaigne-tshirt-white-regular-1.jpg']
  },
  {
    id: 'car-coat-black',
    name: 'Car Coat',
    category: 'clothing',
    price: 288000,
    description: 'Elegant car coat in black technical fabric with modern tailoring.',
    material: 'Black Technical Fabric',
    colors: ['Black'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/car-coat-black-1.jpg'],
    featured: true
  },
  {
    id: 'cargo-pants-black',
    name: 'Cargo Pants',
    category: 'clothing',
    price: 130500,
    description: 'Modern cargo pants in black stretch cotton gabardine with functional pockets.',
    material: 'Black Stretch Cotton Gabardine',
    colors: ['Black'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/cargo-pants-black-1.jpg']
  },
  {
    id: 'dior-couture-hooded-jacket-black',
    name: 'Christian Dior Couture Hooded Jacket',
    category: 'clothing',
    price: 252000,
    description: 'Christian Dior Couture hooded jacket in black technical fabric.',
    material: 'Black Technical Fabric',
    colors: ['Black'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/dior-couture-hooded-jacket-black-1.jpg']
  },
  {
    id: 'dior-oblique-blouson-gray',
    name: 'Dior Oblique Blouson Jacket',
    category: 'clothing',
    price: 216000,
    description: 'Dior Oblique blouson jacket in gray technical jacquard.',
    material: 'Gray Technical Jacquard',
    colors: ['Gray'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/dior-oblique-blouson-gray-1.jpg']
  },
  {
    id: 'dior-oblique-jacket-blue-denim',
    name: 'Dior Oblique Jacket Denim',
    category: 'clothing',
    price: 171000,
    description: 'Dior Oblique jacket in blue raw cotton denim with signature pattern.',
    material: 'Blue Raw Cotton Denim',
    colors: ['Blue'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/dior-oblique-jacket-blue-denim-1.webp']
  },
  {
    id: 'dior-oblique-tshirt-offwhite-relaxed',
    name: 'Dior Oblique Relaxed-Fit T-Shirt',
    category: 'clothing',
    price: 64800,
    description: 'Dior Oblique relaxed-fit T-shirt in off-white terry cotton.',
    material: 'Off-White Terry Cotton',
    colors: ['Off-White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/dior-oblique-tshirt-offwhite-relaxed-1.webp']
  },
  {
    id: 'cd-icon-sweater-gray-zipped',
    name: 'CD Icon Zipped Sweater',
    category: 'clothing',
    price: 148500,
    description: 'CD Icon zipped sweater in gray virgin wool Punto Milano.',
    material: 'Gray Virgin Wool Punto Milano',
    colors: ['Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/cd-icon-sweater-gray-zipped-1.webp']
  },
  {
    id: 'tailored-pants-gray',
    name: 'Tailored Pants',
    category: 'clothing',
    price: 1200,
    description: 'Tailored pants in anthracite gray virgin wool flannel.',
    material: 'Anthracite Gray Virgin Wool Flannel',
    colors: ['Gray'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/tailored-pants-gray-1.jpg']
  },
  {
    id: 'tailored-track-pants-dior',
    name: 'Tailored Track Pants with Christian Dior Couture',
    category: 'clothing',
    price: 1350,
    description: 'Tailored track pants with Christian Dior Couture signature.',
    material: 'Technical Fabric',
    colors: ['Black'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/tailored-track-pants-dior-1.jpg']
  },
  {
    id: 'zipped-shirt-blue-dior-oblique',
    name: 'Zipped Shirt with Dior Oblique Interior',
    category: 'clothing',
    price: 139500,
    description: 'Zipped shirt with Dior Oblique interior in blue virgin wool.',
    material: 'Blue Virgin Wool',
    colors: ['Blue'],
    sizes: ['46', '48', '50', '52', '54'],
    images: ['/products/clothing/zipped-shirt-blue-dior-oblique-1.jpg']
  },

  // ACCESSORIES
  {
    id: 'cd-icon-sunglasses-black-square',
    name: 'CD Icon S4I Black Square Sunglasses',
    category: 'accessories',
    price: 37800,
    description: 'CD Icon S4I black square sunglasses with signature details.',
    material: 'Acetate',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/accessories/cd-icon-sunglasses-black-square-1.webp'],
    featured: true,
    details: {
      craftsmanship: 'Handcrafted using premium acetate with precision-cut lenses and meticulous finishing.',
      origin: 'Made in Italy',
      artisanStory: 'Created by master eyewear artisans in Italy, combining traditional craftsmanship with modern design innovation.',
      uniqueFeatures: ['UV400 protection', 'Signature CD Icon temples', 'Premium acetate frame', 'Anti-reflective coating', 'Comfortable nose pads']
    },
    care: {
      instructions: [
        'Clean lenses with provided microfiber cloth',
        'Use lens cleaning solution if needed',
        'Store in protective case when not in use',
        'Avoid leaving in direct sunlight or heat',
        'Handle by the frame, not the lenses'
      ],
      warnings: ['Do not use paper towels on lenses', 'Avoid harsh chemicals'],
      professionalCare: true
    },
    shipping: {
      freeShippingThreshold: 27000,
      estimatedDelivery: '3-5 business days',
      expeditedOptions: ['Express 2-day delivery', 'Next day delivery']
    },
    returns: {
      policy: 'Free returns within 30 days',
      timeframe: '30 days',
      conditions: [
        'Sunglasses must be in original condition',
        'Include protective case and cleaning cloth',
        'No scratches on lenses or frame',
        'Original packaging required'
      ]
    }
  },
  {
    id: 'cd-icon-sunglasses-gray-square',
    name: 'CD Icon S4I Transparent Gray Square Sunglasses',
    category: 'accessories',
    price: 420,
    description: 'CD Icon S4I transparent gray square sunglasses.',
    material: 'Acetate',
    colors: ['Gray'],
    sizes: ['One Size'],
    images: ['/products/accessories/cd-icon-sunglasses-gray-square-1.webp']
  },
  {
    id: 'dior-label-sunglasses-black-beige',
    name: 'Christian Dior Label R1I Pantos Sunglasses',
    category: 'accessories',
    price: 34200,
    description: 'Christian Dior Label R1I black and beige pantos sunglasses.',
    material: 'Acetate',
    colors: ['Black', 'Beige'],
    sizes: ['One Size'],
    images: ['/products/accessories/dior-label-sunglasses-black-beige-1.jpg']
  },
  {
    id: 'cd-icon-cap-white',
    name: 'CD Icon Cap',
    category: 'accessories',
    price: 44100,
    description: 'CD Icon cap in white cotton with signature embroidery.',
    material: 'White Cotton',
    colors: ['White'],
    sizes: ['One Size'],
    images: ['/products/accessories/cd-icon-cap-white-1.jpg']
  },
  {
    id: 'striped-cannage-tie-navy',
    name: 'Striped Cannage Tie',
    category: 'accessories',
    price: 26100,
    description: 'Striped Cannage tie in navy blue, gray and white silk.',
    material: 'Navy Blue, Gray and White Silk',
    colors: ['Navy', 'Gray', 'White'],
    sizes: ['One Size'],
    images: ['/products/accessories/striped-cannage-tie-navy-1.webp']
  },
  {
    id: 'cd-icon-bracelet-beige-leather',
    name: 'CD Icon Braided Leather Bracelet',
    category: 'accessories',
    price: 31500,
    description: 'CD Icon braided leather bracelet in beige lambskin.',
    material: 'Beige Lambskin',
    colors: ['Beige'],
    sizes: ['One Size'],
    images: ['/products/accessories/cd-icon-bracelet-beige-leather-1.jpg']
  },
  {
    id: 'dior-argent-necklace-silver',
    name: 'Dior Argent Necklace',
    category: 'accessories',
    price: 53100,
    description: 'Dior Argent necklace in silver finish.',
    material: 'Silver',
    colors: ['Silver'],
    sizes: ['One Size'],
    images: ['/products/accessories/dior-argent-necklace-silver-1.jpg']
  },
  {
    id: 'dior-black-star-bangle-silver',
    name: 'Dior Black Star Bangle',
    category: 'accessories',
    price: 40500,
    description: 'Dior Black Star bangle in silver-finish brass and black resin.',
    material: 'Silver-Finish Brass and Black Resin',
    colors: ['Silver', 'Black'],
    sizes: ['One Size'],
    images: ['/products/accessories/dior-black-star-bangle-silver-1.jpg']
  },
  {
    id: 'dior-black-star-brooch-silver',
    name: 'Dior Black Star Brooch',
    category: 'accessories',
    price: 35100,
    description: 'Dior Black Star brooch in silver-finish brass.',
    material: 'Silver-Finish Brass',
    colors: ['Silver'],
    sizes: ['One Size'],
    images: ['/products/accessories/dior-black-star-brooch-silver-1.jpg']
  },
  {
    id: 'dior-black-star-ring-silver',
    name: 'Dior Black Star Ring',
    category: 'accessories',
    price: 28800,
    description: 'Dior Black Star ring in silver and black resin.',
    material: 'Silver and Black Resin',
    colors: ['Silver', 'Black'],
    sizes: ['52', '54', '56', '58', '60'],
    images: ['/products/accessories/dior-black-star-ring-silver-1.jpg']
  },

  // BAGS
  {
    id: 'cd-icon-triangle-pouch-black',
    name: 'CD Icon A5 Triangle Pouch',
    category: 'bags',
    price: 1200,
    description: 'CD Icon A5 triangle pouch in black matte grained calfskin.',
    material: 'Black Matte Grained Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/bags/cd-icon-triangle-pouch-black-1.webp']
  },
  {
    id: 'cd-icon-messenger-bag-black-flap',
    name: 'CD Icon Messenger Bag with Flap',
    category: 'bags',
    price: 198000,
    description: 'CD Icon messenger bag with flap in black matte grained calfskin.',
    material: 'Black Matte Grained Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/bags/cd-icon-messenger-bag-black-flap-1.webp'],
    featured: true
  },
  {
    id: 'cd-icon-backpack-black',
    name: 'CD Icon Zipped Backpack',
    category: 'bags',
    price: 2800,
    description: 'CD Icon zipped backpack in black matte grained calfskin.',
    material: 'Black Matte Grained Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/bags/cd-icon-backpack-black-1.webp', '/products/bags/cd-icon-backpack-black-2.webp', '/products/bags/cd-icon-backpack-black-3.webp'],
    featured: true
  },
  {
    id: 'cd-icon-briefcase-black',
    name: 'CD Icon Zipped Briefcase',
    category: 'bags',
    price: 234000,
    description: 'CD Icon zipped briefcase in black matte grained calfskin.',
    material: 'Black Matte Grained Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/bags/cd-icon-briefcase-black-1.webp']
  },
  {
    id: 'cd-icon-messenger-bag-black-zipped',
    name: 'CD Icon Zipped Messenger Bag',
    category: 'bags',
    price: 2400,
    description: 'CD Icon zipped messenger bag in black matte grained calfskin.',
    material: 'Black Matte Grained Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/bags/cd-icon-messenger-bag-black-zipped-1.webp']
  },
  {
    id: 'dior-slider-hobo-bag-black',
    name: 'Large Dior Slider Zipped Hobo Bag',
    category: 'bags',
    price: 288000,
    description: 'Large Dior Slider zipped hobo bag in black smooth calfskin.',
    material: 'Black Smooth Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/bags/dior-slider-hobo-bag-black-1.webp'],
    details: {
      craftsmanship: 'Expertly crafted using the finest French savoir-faire, combining traditional leatherworking with contemporary design.',
      origin: 'Made in France',
      artisanStory: 'Created in our French ateliers by master craftspeople who specialize in luxury leather goods, ensuring each piece meets the highest standards.',
      uniqueFeatures: ['Spacious interior compartment', 'Signature Dior Slider closure', 'Adjustable shoulder strap', 'Premium smooth calfskin', 'Interior organization pockets']
    },
    care: {
      instructions: [
        'Gently wipe with a clean, soft cloth',
        'Avoid contact with water and moisture',
        'Store in provided dust bag',
        'Keep away from direct heat and sunlight',
        'Handle with clean hands to prevent staining'
      ],
      warnings: ['Do not use leather cleaners', 'Avoid exposure to perfumes and cosmetics'],
      professionalCare: true
    },
    shipping: {
      freeShippingThreshold: 90000,
      estimatedDelivery: '5-7 business days',
      expeditedOptions: ['Express 2-day delivery', 'Priority overnight']
    },
    returns: {
      policy: 'Complimentary returns within 30 days',
      timeframe: '30 days',
      conditions: [
        'Item must be unused and in pristine condition',
        'Original dust bag and authenticity card required',
        'No signs of wear or damage',
        'Return shipping label provided'
      ]
    }
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const currentProduct = getProductById(productId);
  if (!currentProduct) return [];
  
  return products
    .filter(product => 
      product.id !== productId && 
      product.category === currentProduct.category
    )
    .slice(0, limit);
};