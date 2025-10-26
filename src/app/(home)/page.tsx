
import FeatureCards from '@/components/home/feature-card';
import FeaturedProducts from '@/components/home/featured-product';
import Header from '@/components/home/header';
import MedicalServicesSection from '@/components/home/MedicalSection';
import PromoBanner from '@/components/home/PromoBanner';
import TestimonialSection from '@/components/home/testimonial';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'MediMart | Your Healthcare Marketplace',
  description: 'MediMart offers a wide range of healthcare products, medical supplies, and equipment for hospitals, clinics, and personal use.',
  keywords: 'healthcare, medical supplies, pharmacy, health equipment',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 ">
      <Header />
     
      <FeaturedProducts />
      <FeatureCards/>
      
      
      {/* <ContactSection /> */}
      <MedicalServicesSection/>
      <TestimonialSection />
      <PromoBanner/>
    </main>
  );
}