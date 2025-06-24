
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageSection from './PageSection';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    // Set container to relative, and adjust min-height to account for the sticky header (h-20 = 5rem)
    <PageSection className="text-center relative overflow-hidden min-h-screen flex items-center justify-center py-0">
      
      {/* Background with grid and color washes */}
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-background" 
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px),
            radial-gradient(at 20% 25%, hsl(var(--primary) / 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 75%, hsl(var(--chart-4) / 0.1) 0px, transparent 50%)
          `,
          backgroundSize: '3rem 3rem, 3rem 3rem, 100% 100%, 100% 100%'
        }}
      />

      {/* Main content with z-10 to be on top of the background */}
      <div className="relative z-10">
        <h1 
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          data-aos="fade-up"
        >
          Clarity Over Chaos, <br />
          <span className="text-accent">Insights</span> Over Noise
        </h1>
        <p 
          className="mt-8 max-w-6xl mx-auto text-lg leading-8 text-foreground/80 sm:text-xl"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Insightica provides clear historical indicator analysis, identifies optimal complementary pairings, and employs ML to forecast future indicator effectiveness—delivering data-driven insights rigorously validated against extensive market data for your trades.
        </p>
        <div 
          className="mt-10 flex items-center justify-center gap-x-6"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Button asChild size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link href="/early-access">
              Try Now
              <ArrowRight className="h-5 w-5 ml-0 group-hover:ml-2 w-0 group-hover:w-5 transition-all duration-300" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent shadow-md">
            <Link href="/tutorials">Learn More</Link>
          </Button>
        </div>
      </div>
    </PageSection>
  );
};

export default HeroSection;
