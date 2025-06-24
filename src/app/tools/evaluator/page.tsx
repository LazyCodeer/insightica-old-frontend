import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FunctionSquare } from 'lucide-react';

export default function EvaluatorToolPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="text-center">
            <FunctionSquare className="mx-auto h-16 w-16 text-accent mb-6" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Evaluator <span className="text-accent">Tool</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
              Unlock Historical Indicator Performance. This tool is currently under development.
              Check back soon for powerful historical analysis capabilities.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
