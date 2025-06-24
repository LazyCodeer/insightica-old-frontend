
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageSection from './PageSection';
import { BookOpen, MessageSquare } from 'lucide-react';

const FooterCtaSection = () => {
  return (
    <PageSection className="relative overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-background" 
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px),
            radial-gradient(at 10% 90%, hsl(var(--primary) / 0.1) 0px, transparent 50%),
            radial-gradient(at 90% 10%, hsl(var(--chart-4) / 0.1) 0px, transparent 50%)
          `,
          backgroundSize: '3rem 3rem, 3rem 3rem, 100% 100%, 100% 100%'
        }}
      />
      <div className="text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Still Have <span className="text-accent">Questions?</span>
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
          Explore our comprehensive tutorials or reach out to our dedicated support team.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
            <Link href="/tutorials">
              <BookOpen className="mr-1.5 h-5 w-5" /> Browse Tutorials
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-primary shadow-md w-full sm:w-auto">
            <Link href="/contact">
              <MessageSquare className="mr-1.5 h-5 w-5" /> Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </PageSection>
  );
};

export default FooterCtaSection;
