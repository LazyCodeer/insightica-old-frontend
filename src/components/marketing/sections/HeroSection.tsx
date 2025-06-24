import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageSection from './PageSection';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <PageSection className="bg-gradient-to-br from-background to-primary/10 text-center relative overflow-hidden min-h-screen flex items-center justify-center py-0">
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
          Clarity Over Chaos, <br />
          <span className="text-accent">Insights</span> Over Noise
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-foreground/80 sm:text-xl">
          Insightica provides clear historical indicator analysis, identifies optimal complementary pairings, and employs ML to forecast future indicator effectiveness—delivering data-driven insights rigorously validated against extensive market data for your trades.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link href="/early-access">
              Try Now <ArrowRight className="ml-2 h-5 w-5" />
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
