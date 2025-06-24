import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PageSection from './PageSection';
import { BookOpen, MessageSquare } from 'lucide-react';

const FooterCtaSection = () => {
  return (
    <PageSection className="bg-gradient-to-t from-background to-primary/10">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Still Have <span className="text-accent">Questions?</span>
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
          Explore our comprehensive tutorials or reach out to our dedicated support team.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
            <Link href="/tutorials">
              <BookOpen className="mr-2 h-5 w-5" /> Browse Tutorials
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-primary shadow-md w-full sm:w-auto">
            <Link href="/contact">
              <MessageSquare className="mr-2 h-5 w-5" /> Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </PageSection>
  );
};

export default FooterCtaSection;
