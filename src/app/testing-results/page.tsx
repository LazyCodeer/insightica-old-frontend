
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TestingResultsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Performance Insights: Real-World Results
            </h1>
            <p className="mt-6 max-w-4xl mx-auto text-lg leading-8 text-muted-foreground">
              At Insightica, we believe in transparency and rigorous validation. Our predictive algorithms are not just theory—they’ve been stress-tested in real-world trading environments.
            </p>
          </div>

          <div className="space-y-8 text-muted-foreground prose max-w-none prose-headings:text-foreground prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent/80">
            
            <Card className="bg-card/80 border-border/50 not-prose">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <ShieldCheck className="h-7 w-7 mr-3 text-primary" />
                  How We Tested
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To evaluate the effectiveness of our predictive models, we conducted 800+ unique backtests across various configurations. Here's how we structured the testing:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Stock Universe:</strong> Focused primarily on large-cap stocks, where alpha is harder to generate, ensuring the toughest test conditions for our tool.
                  </li>
                  <li>
                    <strong>Ticker Interval:</strong> Fixed at 1 day.
                  </li>
                  <li>
                    <strong>Date Ranges:</strong> Test windows span from 3000 Days to 30 Days before the results' publish date.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/50 not-prose">
                <CardContent className="pt-6 space-y-4 text-green-900/90 dark:text-green-200/90">
                <p>
                  These results are based on computer-simulated trades, which generally outperform human execution when following a strict strategy. This is because machines follow rules consistently, without emotional interference, hesitation, or error. However, we believe that real-world results could actually be better with human oversight, not despite, but because of the human ability to think creatively and adaptively.
                </p>
                <p>
                  While factors like slippage (the difference between expected and actual trade prices) do occur in real-world trading, they affect both the chosen strategy and the comparative strategies similarly. As a result, the relative performance differences between them remain meaningful and valid. In other words, even though absolute returns may be slightly impacted, the advantage our predictor shows over alternatives still holds.
                </p>
                <p className="font-semibold text-foreground">
                  At Insightica, we're not here to replace your judgment—we're here to enhance it. Our tools are designed to cut through the noise, present data-backed clarity, and help you make informed decisions in the markets.
                </p>
                </CardContent>
            </Card>
            
            <div>
              <h2 className="text-3xl font-semibold mt-12 mb-4">Key Principles in Our Analysis</h2>
              <p>
                We are not in the business of selling perfection. While our tool doesn’t beat every indicator at every time frame, it consistently outperforms when you look at the bigger picture. The results presented below are not cherry-picked or optimized for optics—they are raw and honest. This is just the beginning—our prototype version already shows strong results, and future iterations will only improve.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mt-8 mb-4">How we got the Results</h3>
              <p>
                We use a simple strategy:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  For each time frame and stock, we select the indicator with the top predicted score.
                </li>
                <li>
                  We compare the return generated from that pick against others.
                </li>
                <li>
                  <strong>Metric Used:</strong> Profit/loss percentage (returns), annualized where appropriate to enable comparisons across different ticker intervals.
                </li>
              </ul>
              <p className="mt-4">
                This is the most primitive implementation of our predictor. More sophisticated usage and strategy layering would result in even stronger performance.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mt-8 mb-4">Interpreting the Results</h3>
              <p>
                While it might be tempting to interpret the results as:
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                "If a strategy delivers x% annual returns, then dynamically switching strategies using our tool would yield x + a% returns"
              </blockquote>
              <p>
                This direct translation can be misleading. The reason lies in the nature of annualisation: different time periods are being scaled to an annual figure, which may unintentionally exaggerate the apparent gains.
              </p>
              <p className="mt-4">
                A more insightful way to view the results is by recognizing the underlying market behavior: no single strategy consistently stays on top. Markets are dynamic and stochastic—what works today may underperform tomorrow.
              </p>
              <p className="mt-4">
                Our tool is designed to help you adapt to these shifting patterns, identifying which strategies are gaining traction and allowing you to stay aligned with them—not by predicting the future, but by being responsive to ongoing change.
              </p>
              <p className="mt-4 font-semibold text-foreground">
                In essence, it’s not just about beating a static strategy—it’s about staying relevant in a constantly evolving market landscape.
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <h2 className="text-3xl font-semibold text-center mb-8">Overall Performance (Annualised results)</h2>
            <Tabs defaultValue="all-vs-all" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
                <TabsTrigger value="all-vs-all">All Indicators vs All</TabsTrigger>
                <TabsTrigger value="all-vs-fav">All Indicators vs Favorites</TabsTrigger>
              </TabsList>
              <TabsContent value="all-vs-all">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>All Indicators vs All</CardTitle>
                    <CardDescription>Performance of our predictor when selecting from all indicators, compared against all others. Returns are annualized for comparability.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                    <p>Performance charts and data will be displayed here soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="all-vs-fav">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>All Indicators vs Favorites</CardTitle>
                    <CardDescription>Predictor selects from all indicators but is benchmarked against popular market indicators.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                    <p>Performance charts and data will be displayed here soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-16 text-center">
            <Button variant="link" asChild>
              <Link href="/" className="text-accent hover:text-accent text-lg">
                &larr; Back to Home
              </Link>
            </Button>
          </div>
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
