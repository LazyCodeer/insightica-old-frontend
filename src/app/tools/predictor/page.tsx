import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

export default function PredictorToolPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="text-center">
            <Lightbulb className="mx-auto h-16 w-16 text-accent mb-6" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Predictor <span className="text-accent">Tool</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
              Forecast Future Indicator Effectiveness. Our AI-powered prediction engine is currently under development.
              Sign up for early access to be notified when it's available.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/early-access">Join Early Access</Link>
              </Button>
               <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/20 hover:text-primary">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
