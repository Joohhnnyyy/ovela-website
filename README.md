# OVELA - Premium Fashion Website

A stunning, modern e-commerce website built with Next.js 14, featuring smooth animations, custom cursor interactions, and a premium user experience with advanced scroll effects and responsive design.

## ✨ Latest Updates

### OVELA Footer Implementation (Latest)
- **Consistent Branding**: Unified OVELA footer layout across all pages (main, about, lookbook)
- **Scroll-based Parallax**: Differential scroll speeds for footer and OVELA sections
- **Letter Animation**: Individual letter reveal with blur and opacity effects
- **Scroll Triggers**: Animation activates at 90% scroll progress
- **Responsive Typography**: Adaptive text sizing across all breakpoints

### Desktop Layout Enhancements
- **Enhanced Product Grid**: Improved responsive breakpoints (md:grid-cols-2 lg:grid-cols-3)
- **Advanced Spacing**: Dynamic gap sizing (gap-6 lg:gap-8 xl:gap-10)
- **Refined Animations**: Enhanced hover effects with scale and transform
- **Typography Scaling**: Optimized font sizes and tracking for desktop viewing
- **Visual Hierarchy**: Improved spacing and layout consistency

## 🚀 Core Features

### Design & UI
- **Custom Circular Cursor** with negative blend mode effects
- **Advanced Parallax Scrolling** with multiple layer animations
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Premium Typography** using custom Melodrama font family
- **Modern Glass Morphism** effects and backdrop blur
- **Consistent OVELA Branding** across all pages with scroll effects

### Performance & Technology
- **Next.js 14** with App Router for optimal performance
- **Framer Motion** for buttery-smooth animations and scroll effects
- **TypeScript** for type-safe development
- **Tailwind CSS** for rapid styling and responsive design
- **Custom Hooks** for scroll animations and interactions
- **GSAP Integration** for advanced scroll animations

### E-commerce Features
- **Enhanced Product Carousel** with interactive hover effects
- **Brand Showcase** with parallax scrolling
- **Advanced Navigation System** with smooth transitions
- **Shopping Cart** integration ready
- **Product Categories** and collections with improved layouts
- **Responsive Product Grid** with desktop-optimized breakpoints

### Interactive Elements
- **Custom Cursor** that responds to interactive elements
- **Advanced Hover Animations** on cards, buttons, and links
- **Scroll-triggered Animations** for engaging user experience
- **Video Background** with autoplay and loop
- **Loading Screen** with brand animation
- **Letter-by-letter Reveals** for brand text animations

## Tech Stack

| Technology | Purpose |
|------------|----------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **Lucide React** | Beautiful icons |
| **Custom Fonts** | Melodrama typography |

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Download or clone the project**
   ```bash
   # If downloading from GitHub
   git clone https://github.com/Joohhnnyyy/ovela-website.git
   cd ovela-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── collections/        # Product collections pages
│   │   └── all/           # All products page with enhanced grid
│   ├── pages/             # Static pages with OVELA footer
│   │   ├── about/         # About page with scroll effects
│   │   └── lookbook/      # Lookbook page with parallax
│   ├── globals.css        # Global styles and custom fonts
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page with OVELA section
├── components/
│   ├── sections/          # Page sections
│   │   ├── navigation.tsx      # Navigation with smooth transitions
│   │   ├── hero-video.tsx      # Video background with autoplay
│   │   ├── product-carousel.tsx # Enhanced carousel with hover effects
│   │   ├── brand-showcase.tsx  # Parallax brand showcase
│   │   ├── footer.tsx          # Footer component
│   │   ├── final-branding.tsx  # Legacy branding component
│   │   └── loading-screen.tsx  # Animated loading screen
│   └── ui/                # Reusable UI components
│       ├── custom-cursor.tsx           # Interactive cursor
│       ├── container-scroll-animation.tsx # Scroll containers
│       └── scroll-area.tsx             # Custom scroll areas
├── hooks/                 # Custom React hooks
│   ├── useScrollAnimation.ts    # Scroll-based animations
│   ├── useGSAPScrollAnimation.ts # GSAP scroll effects
│   ├── useGSAPScrollEffects.ts  # Advanced GSAP effects
│   ├── useGSAPSmoothScroll.ts   # Smooth scrolling
│   └── use-mobile.ts           # Mobile detection
└── lib/                   # Utilities
    └── utils.ts           # Helper functions
```

## 🔧 Key Components

### OVELA Footer System (Latest)
- **Unified Branding**: Consistent footer across all pages
- **Scroll Parallax**: Differential scroll speeds for depth effect
- **Letter Animations**: Individual character reveals with blur effects
- **Responsive Design**: Adaptive typography across breakpoints
- **Scroll Triggers**: Activates at 90% scroll progress

### Enhanced Product Grid
- **Responsive Breakpoints**: Optimized for mobile, tablet, and desktop
- **Dynamic Spacing**: Adaptive gaps and margins
- **Hover Animations**: Scale and transform effects
- **Image Optimization**: Next.js Image with object-cover
- **Typography Scaling**: Desktop-optimized font sizes

### Custom Cursor
- **Interactive Design**: Responds to buttons, links, and interactive elements
- **Smooth Animations**: Uses Framer Motion for fluid transitions
- **Blend Mode Effects**: Creates striking visual contrast

### Advanced Parallax Scrolling
- **Multi-layer Animations**: Different scroll speeds for depth effect
- **Scroll-triggered Reveals**: Elements animate based on scroll position
- **Performance Optimized**: Uses `useScroll` and `useTransform` hooks
- **GSAP Integration**: Advanced scroll effects with GSAP
- **Differential Speeds**: Footer and OVELA sections scroll at different rates

### Enhanced Product Carousel
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Advanced Hover Effects**: Scale, transform, and shadow animations
- **Desktop Optimization**: Enhanced spacing and typography for larger screens
- **Image Optimization**: Next.js Image with object-cover and hover scaling
- **Interactive Elements**: Smooth transitions and micro-interactions

## 🚀 Performance Optimizations

- **Next.js 14** App Router for optimal loading and routing
- **Advanced Image Optimization** with Next.js Image component
- **Mobile-first** responsive design with desktop enhancements
- **Lazy Loading** for improved performance and faster initial load
- **Efficient Re-renders** with React best practices and custom hooks
- **Scroll Performance**: Optimized scroll animations with `useScroll` and `useTransform`
- **GSAP Integration**: Hardware-accelerated animations for smooth performance
- **TypeScript**: Type safety for better development experience and fewer runtime errors

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Responsive Breakpoints

| Device | Breakpoint |
|--------|------------|
| Mobile | `< 768px` |
| Tablet | `768px - 1024px` |
| Desktop | `> 1024px` |
| Large Desktop | `> 1440px` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Framer Motion** for amazing animation capabilities
- **Next.js Team** for the incredible framework
- **Tailwind CSS** for the utility-first approach
- **Open Source Community** for continuous inspiration

## Contact

- **GitHub**: [@Joohhnnyyy](https://github.com/Joohhnnyyy)
- **Project Link**: [https://github.com/Joohhnnyyy/ovela-website](https://github.com/Joohhnnyyy/ovela-website)
