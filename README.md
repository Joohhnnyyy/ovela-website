# 🌟 OVELA - Premium Fashion Website Clone

> A stunning, modern e-commerce website built with Next.js 14, featuring smooth animations, custom cursor interactions, and a premium user experience.

## ✨ Features

### 🎨 **Design & UI**
- **Custom Circular Cursor** with negative blend mode effects
- **Smooth Parallax Scrolling** animations throughout the site
- **Responsive Design** optimized for all devices
- **Premium Typography** using custom Melodrama font family
- **Modern Glass Morphism** effects and backdrop blur

### 🚀 **Performance & Technology**
- **Next.js 14** with App Router for optimal performance
- **Framer Motion** for buttery-smooth animations
- **TypeScript** for type-safe development
- **Tailwind CSS** for rapid styling
- **Custom Hooks** for scroll animations and interactions

### 🛍️ **E-commerce Features**
- **Product Carousel** with interactive hover effects
- **Brand Showcase** with parallax scrolling
- **Navigation System** with smooth transitions
- **Shopping Cart** integration ready
- **Product Categories** and collections

### 🎭 **Interactive Elements**
- **Custom Cursor** that responds to interactive elements
- **Hover Animations** on cards, buttons, and links
- **Scroll-triggered Animations** for engaging user experience
- **Video Background** with autoplay and loop
- **Loading Screen** with brand animation

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **Lucide React** | Beautiful icons |
| **Custom Fonts** | Melodrama typography |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
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
│   ├── pages/             # Static pages (about, lookbook)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── sections/          # Page sections
│   │   ├── navigation.tsx
│   │   ├── hero-video.tsx
│   │   ├── product-carousel.tsx
│   │   ├── brand-showcase.tsx
│   │   └── final-branding.tsx
│   └── ui/                # Reusable UI components
│       ├── custom-cursor.tsx
│       ├── container-scroll-animation.tsx
│       └── scroll-area.tsx
├── hooks/                 # Custom React hooks
│   ├── useScrollAnimation.ts
│   └── use-mobile.ts
└── lib/                   # Utilities
    └── utils.ts
```

## 🎨 Key Components

### Custom Cursor
- **Interactive Design**: Responds to buttons, links, and interactive elements
- **Smooth Animations**: Uses Framer Motion for fluid transitions
- **Blend Mode Effects**: Creates striking visual contrast

### Parallax Scrolling
- **Scroll-triggered Animations**: Elements animate based on scroll position
- **Performance Optimized**: Uses `useScroll` hook for efficient calculations
- **Multiple Layers**: Different scroll speeds for depth effect

### Product Carousel
- **Horizontal Scrolling**: Smooth product browsing experience
- **Hover Effects**: Scale and shadow animations on interaction
- **Responsive Design**: Adapts to different screen sizes

## 🎯 Performance Optimizations

- ⚡ **Next.js 14** App Router for optimal loading
- 🖼️ **Image Optimization** with Next.js Image component
- 📱 **Mobile-first** responsive design
- 🎭 **Lazy Loading** for improved performance
- 🔄 **Efficient Re-renders** with React best practices

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📱 Responsive Breakpoints

| Device | Breakpoint |
|--------|------------|
| Mobile | `< 768px` |
| Tablet | `768px - 1024px` |
| Desktop | `> 1024px` |
| Large Desktop | `> 1440px` |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OVELA** for the original design inspiration
- **Framer Motion** for amazing animation capabilities
- **Next.js Team** for the incredible framework
- **Tailwind CSS** for the utility-first approach

## 📞 Contact

- **GitHub**: [@Joohhnnyyy](https://github.com/Joohhnnyyy)
- **Project Link**: [https://github.com/Joohhnnyyy/ovela-website](https://github.com/Joohhnnyyy/ovela-website)

---

<div align="center">
  <p>Made with ❤️ and lots of ☕</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
