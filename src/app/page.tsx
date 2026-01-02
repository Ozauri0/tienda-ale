import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import ScrollHandler from '@/components/ScrollHandler';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <div className="min-h-screen">
      <ScrollHandler />
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Features />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
