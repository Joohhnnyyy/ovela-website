export interface Product {
  id: string;
  name: string;
  category: 'sneakers' | 'clothing' | 'accessories' | 'bags';
  gender: 'him' | 'her';
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
  // MALE SNEAKERS
  {
    id: 'b27-uptown-black',
    name: 'B27 Uptown Low-Top Sneaker',
    category: 'sneakers',
    gender: 'him',
    price: 80100,
    description: 'The B27 low-top sneaker is a new essential that plays with codes and materials. Crafted in black suede, it features a modern silhouette.',
    material: 'Black Suede and Smooth Calfskin',
    colors: ['Black'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b27-uptown-black-1.jpg'],
    featured: true
  },
  {
    id: 'b30-countdown-black-smooth',
    name: 'B30 Countdown Sneaker',
    category: 'sneakers',
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
    price: 1350,
    description: 'The B80 lounge sneaker in navy blue Cannage cashmere wool.',
    material: 'Navy Blue Cannage Cashmere Wool and Calfskin',
    colors: ['Navy'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    images: ['/products/sneakers/b80-lounge-navy-1.webp']
  },

  // MALE CLOTHING
  {
    id: 'cd-icon-sweatshirt-black',
    name: 'CD Icon Sweatshirt',
    category: 'clothing',
    gender: 'him',
    price: 1200,
    description: 'The CD Icon sweatshirt in black cotton fleece features the iconic CD signature.',
    material: 'Black Cotton Fleece',
    colors: ['Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/cd-icon-sweatshirt-black-1.webp'],
    featured: true
  },
  {
    id: 'cd-icon-tshirt-white-fitted',
    name: 'CD Icon T-Shirt Fitted',
    category: 'clothing',
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
    price: 148500,
    description: 'CD Icon zipped sweater in gray virgin wool Punto Milano.',
    material: 'Gray Virgin Wool Punto Milano',
    colors: ['Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/products/clothing/cd-icon-sweater-gray-zipped-1.webp']
  },

  // MALE ACCESSORIES
  {
    id: 'cd-icon-sunglasses-black-square',
    name: 'CD Icon S4I Black Square Sunglasses',
    category: 'accessories',
    gender: 'him',
    price: 420,
    description: 'CD Icon S4I black square sunglasses with signature detailing.',
    material: 'Acetate',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/accessories/cd-icon-sunglasses-black-square-1.webp'],
    featured: true
  },
  {
    id: 'cd-icon-sunglasses-gray-square',
    name: 'CD Icon S4I Transparent Gray Square Sunglasses',
    category: 'accessories',
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
    price: 28800,
    description: 'Dior Black Star ring in silver and black resin.',
    material: 'Silver and Black Resin',
    colors: ['Silver', 'Black'],
    sizes: ['52', '54', '56', '58', '60'],
    images: ['/products/accessories/dior-black-star-ring-silver-1.jpg']
  },

  // MALE BAGS
  {
    id: 'cd-icon-triangle-pouch-black',
    name: 'CD Icon A5 Triangle Pouch',
    category: 'bags',
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
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
    gender: 'him',
    price: 288000,
    description: 'Large Dior Slider zipped hobo bag in black smooth calfskin.',
    material: 'Black Smooth Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/bags/dior-slider-hobo-bag-black-1.webp']
  },

  // FEMALE SNEAKERS
  {
    id: 'jadior-slingback-pump-black',
    name: 'J\'Adior Slingback Pump',
    category: 'sneakers',
    gender: 'her',
    price: 89000,
    description: 'Elegant J\'Adior slingback pump in black calfskin with signature embroidery.',
    material: 'Black Calfskin',
    colors: ['Black'],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    images: ['/products/female/footwear/JAdior_Slingback_Pump_Black_Calfskin_Embroidered_w.webp'],
    featured: true
  },
  {
    id: 'd-quest-boot-black',
    name: 'D-Quest Boot',
    category: 'sneakers',
    gender: 'her',
    price: 125000,
    description: 'Modern D-Quest boot in black grained calfskin with contemporary design.',
    material: 'Black Grained Calfskin',
    colors: ['Black'],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    images: ['/products/female/footwear/D-Quest_Boot_Black_Grained_Calfskin_E02.webp']
  },
  {
    id: 'd-town-boot-black',
    name: 'D-Town Boot',
    category: 'sneakers',
    gender: 'her',
    price: 115000,
    description: 'Stylish D-Town boot in black supple calfskin for urban elegance.',
    material: 'Black Supple Calfskin',
    colors: ['Black'],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    images: ['/products/female/footwear/D-Town_Boot_Black_Supple_Calfskin_E02.webp'],
    featured: true
  },

  // FEMALE CLOTHING
  {
    id: 'bar-jacket-gray-wool-tweed',
    name: 'Bar Jacket',
    category: 'clothing',
    gender: 'her',
    price: 389000,
    description: 'Iconic Bar jacket in gray wool tweed with signature silhouette and structured shoulders.',
    material: 'Gray Wool Tweed',
    colors: ['Gray'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    images: ['/products/female/clothing/Bar_Jacket_Gray_Wool_Tweed_E01.jpg'],
    featured: true
  },
  {
    id: 'fitted-jacket-black-velvet',
    name: 'Fitted Jacket',
    category: 'clothing',
    gender: 'her',
    price: 245000,
    description: 'Elegant fitted jacket in black technical velvet-finish knit.',
    material: 'Black Technical Velvet-Finish Knit',
    colors: ['Black'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    images: ['/products/female/clothing/Fitted_Jacket_Black_Technical_Velvet-Finish_Knit_E.jpg'],
    featured: true
  },
  {
    id: 'cardigan-removable-collar-ecru',
    name: 'Cardigan with Removable Ruched Collar',
    category: 'clothing',
    gender: 'her',
    price: 198000,
    description: 'Luxurious cardigan in ecru linen silk with removable ruched collar.',
    material: 'Ecru Linen Silk',
    colors: ['Ecru'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/products/female/clothing/Cardigan_with_Removable_Ruched_Collar_Ecru_Linen_S.webp']
  },
  {
    id: 'skort-gray-technical-jacquard',
    name: 'Skort',
    category: 'clothing',
    gender: 'her',
    price: 156000,
    description: 'Modern skort in gray technical jacquard taffeta with Dior Oblique pattern.',
    material: 'Gray Technical Jacquard Taffeta',
    colors: ['Gray'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    images: ['/products/female/clothing/Skort_Gray_Technical_Jacquard_Taffeta_with_Dior_Ob.webp']
  },
  {
    id: 'trench-coat-beige-cotton',
    name: 'Trench Coat',
    category: 'clothing',
    gender: 'her',
    price: 334000,
    description: 'Classic trench coat in beige cotton gabardine with timeless elegance.',
    material: 'Beige Cotton Gabardine',
    colors: ['Beige'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    images: ['/products/female/clothing/Trench_Coat_Beige_Cotton_Gabardine.jpg']
  },

  // FEMALE ACCESSORIES
  {
    id: 'dior-tribales-earrings-gold-white',
    name: 'Dior Tribales Earrings',
    category: 'accessories',
    gender: 'her',
    price: 42000,
    description: 'Elegant Dior Tribales earrings in gold finish with white resin pearl details.',
    material: 'Gold-Finish Metal and White Resin Pearls',
    colors: ['Gold'],
    sizes: ['One Size'],
    images: ['/products/female/accessories/Dior_Tribales_Earrings_Gold-Finish_Metal_with_Whit.webp'],
    featured: true
  },
  {
    id: 'dior-destiny-earrings-gold',
    name: 'Dior Destiny Earrings',
    category: 'accessories',
    gender: 'her',
    price: 67500,
    description: 'Sophisticated Dior Destiny earrings in gold finish with mother-of-pearl details.',
    material: 'Gold-Finish Metal and Mother-of-Pearl',
    colors: ['Gold'],
    sizes: ['One Size'],
    images: ['/products/female/accessories/Dior_Destiny_Earrings_Gold-Finish_Metal_and_Mother.jpg']
  },
  {
    id: 'petit-cd-lucky-star-bracelet',
    name: 'Petit CD Lucky Star Bracelet',
    category: 'accessories',
    gender: 'her',
    price: 38500,
    description: 'Delicate Petit CD Lucky Star bracelet in gold finish with white resin pearls.',
    material: 'Gold-Finish Metal and White Resin Pearls',
    colors: ['Gold'],
    sizes: ['One Size'],
    images: ['/products/female/accessories/Petit_CD_Lucky_Star_Bracelet_Gold-Finish_Metal_and.webp']
  },
  {
    id: 'dior-cannage-s2u-sunglasses',
    name: 'DiorCannage S2U Sunglasses',
    category: 'accessories',
    gender: 'her',
    price: 45000,
    description: 'Elegant DiorCannage S2U sunglasses with gradient gray lenses.',
    material: 'Acetate',
    colors: ['Gray'],
    sizes: ['One Size'],
    images: ['/products/female/accessories/DiorCannage_S2U_Gradient_Gray_Rectangular_Sunglass.jpg']
  },

  // FEMALE BAGS
  {
    id: 'large-dior-book-tote-black',
    name: 'Large Dior Book Tote',
    category: 'bags',
    gender: 'her',
    price: 425000,
    description: 'Spacious Large Dior Book Tote in black Dior Ornamental embroidery.',
    material: 'Black Dior Ornamental Embroidery',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/female/bags/Large_Dior_Book_Tote_Black_Dior_Ornemental_Embroid.webp'],
    featured: true
  },
  {
    id: 'medium-dior-book-tote-gray',
    name: 'Medium Dior Book Tote',
    category: 'bags',
    gender: 'her',
    price: 298000,
    description: 'Medium Dior Book Tote in gray Dior Oblique denim embroidery.',
    material: 'Gray Dior Oblique Denim Embroidery',
    colors: ['Gray'],
    sizes: ['One Size'],
    images: ['/products/female/bags/Medium_Dior_Book_Tote_Gray_Dior_Oblique_Denim_Embr.jpg'],
    featured: true
  },
  {
    id: 'large-dior-voyage-bag-black',
    name: 'Large Dior Voyage Bag',
    category: 'bags',
    gender: 'her',
    price: 267000,
    description: 'Elegant Large Dior Voyage bag in black flat macrocannage grained calfskin.',
    material: 'Black Flat Macrocannage Grained Calfskin',
    colors: ['Black'],
    sizes: ['One Size'],
    images: ['/products/female/bags/Large_Dior_Voyage_Bag_Black_Flat_Macrocannage_Crin.webp']
  },
  {
    id: 'medium-d-journey-bag-gray',
    name: 'Medium D-Journey Bag',
    category: 'bags',
    gender: 'her',
    price: 356000,
    description: 'Sophisticated Medium D-Journey bag in gray denim Dior Oblique jacquard.',
    material: 'Gray Denim Dior Oblique Jacquard',
    colors: ['Gray'],
    sizes: ['One Size'],
    images: ['/products/female/bags/Medium_D-Journey_Bag_Gray_Denim_Dior_Oblique_Jacqu.webp']
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductsByGender = (gender: Product['gender']): Product[] => {
  return products.filter(product => product.gender === gender);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
};