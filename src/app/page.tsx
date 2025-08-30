import Navigation from '@/components/sections/navigation';
import HeroVideo from '@/components/sections/hero-video';
import BrandMessage from '@/components/sections/brand-message';
import NewArrivals from '@/components/sections/new-arrivals';
import BrandShowcase from '@/components/sections/brand-showcase';
import ProductCarousel from '@/components/sections/product-carousel';
import ProductsCategories from '@/components/sections/products-categories';
import Footer from '@/components/sections/footer';
import FinalBrandingSection from '@/components/sections/final-branding';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main>
        <HeroVideo />
        <BrandMessage />
        <NewArrivals />
        <BrandShowcase />
        <ProductCarousel />
        <ProductsCategories />
      </main>
      <Footer />
      <FinalBrandingSection />
    </div>
  );
}