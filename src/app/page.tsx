
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/marketing/sections/HeroSection';
import ValuePropositionSection from '@/components/marketing/sections/ValuePropositionSection';
import KeyBenefitsSection from '@/components/marketing/sections/KeyBenefitsSection';
import ToolsShowcaseSection from '@/components/marketing/sections/ToolsShowcaseSection';
import FaqSection from '@/components/marketing/sections/FaqSection';
import TestimonialSection from '@/components/marketing/sections/TestimonialSection';
import FooterCtaSection from '@/components/marketing/sections/FooterCtaSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ValuePropositionSection />
        <KeyBenefitsSection />
        <ToolsShowcaseSection />
        <FaqSection />
        <TestimonialSection />
        <FooterCtaSection />
      </main>
      <Footer />
    </div>
  );
}
