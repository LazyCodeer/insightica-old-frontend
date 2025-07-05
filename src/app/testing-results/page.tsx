"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageSection from "@/components/marketing/sections/PageSection";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarGraph } from "@/components/charts/BarGraph";
import { useState, useEffect } from "react";

// Import the data
import tab1Data from "@/data/tab1.json";
import tab2Data from "@/data/tab2.json";

interface ChartData {
  name: string;
  value: number;
}

export default function TestingResultsPage() {
  const [tab1SubCondition, setTab1SubCondition] = useState<string>("");
  const [tab2SubCondition, setTab2SubCondition] = useState<string>("");
  const [tab1Page, setTab1Page] = useState<number>(0);
  const [tab2Page, setTab2Page] = useState<number>(0);

  const DATA_POINTS_PER_PAGE = 200;

  // Process the data to get available conditions (excluding 'main')
  const getAvailableConditions = (data: any[]) => {
    if (data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).filter((key) => key !== "main");
  };

  // Transform data for chart display - show all conditions
  const transformMainData = (data: any[]) => {
    if (data.length === 0 || !data[0].main) return [];

    // Get all condition names (excluding 'main')
    const conditionNames = Object.keys(data[0]).filter((key) => key !== "main");

    // Function to create shorter labels
    const shortenLabel = (label: string) => {
      // Remove text in parentheses
      let shortened = label.replace(/\s*\([^)]*\)/g, "");

      // Common abbreviations for technical indicators
      const abbreviations: { [key: string]: string } = {
        "Simple Moving Average": "SMA",
        "Exponential Moving Average": "EMA",
        "Relative Strength Index": "RSI",
        "Moving Average Convergence Divergence": "MACD",
        "Stochastic Oscillator": "Stoch",
        "Average Directional Index": "ADX",
        "Commodity Channel Index": "CCI",
        "Average True Range": "ATR",
        "Stop and Reverse": "SAR",
        "On-Balance Volume": "OBV",
        "Rate of Change": "ROC",
        "Money Flow Index": "MFI",
        "Volume Weighted Average Price": "VWAP",
        "Bollinger Bands": "BB",
        "Fibonacci Retracement Level": "Fib Retracement",
        "Price Action Breakout": "PA Breakout",
        "New 10-Week High": "10W High",
        "10-Week High-Low Range": "10W Range",
        "Chaikin Money Flow": "CMF",
        "Ease of Movement": "EOM",
        "Volume Oscillator": "Vol Osc",
        "Aroon Oscillator": "Aroon Osc",
        "Awesome Oscillator": "AO",
        "Chaikin Oscillator": "Chaikin Osc",
      };

      // Apply abbreviations
      for (const [full, abbr] of Object.entries(abbreviations)) {
        shortened = shortened.replace(new RegExp(full, "gi"), abbr);
      }

      // Limit length and clean up
      if (shortened.length > 15) {
        shortened = shortened.substring(0, 15) + "...";
      }

      return shortened.trim();
    };

    return data[0].main.map((value: number, index: number) => {
      const originalName = conditionNames[index] || `Data Point ${index + 1}`;
      const shortName = shortenLabel(originalName);
      return {
        name: shortName,
        value: value,
        fullName: originalName, // Keep original for tooltip
      };
    });
  };

  const transformSubData = (
    data: any[],
    condition: string,
    page: number = 0
  ) => {
    if (data.length === 0 || !data[0][condition]) return [];
    const start = page * DATA_POINTS_PER_PAGE;
    const end = start + DATA_POINTS_PER_PAGE;
    return data[0][condition]
      .slice(start, end)
      .map((value: number, index: number) => ({
        value: value,
      }));
  };

  // Get total pages for pagination
  const getTotalPages = (data: any[], key: string = "main") => {
    if (data.length === 0 || !data[0][key]) return 0;
    return Math.ceil(data[0][key].length / DATA_POINTS_PER_PAGE);
  };

  const tab1Conditions = getAvailableConditions(tab1Data);
  const tab2Conditions = getAvailableConditions(tab2Data);

  const tab1MainData = transformMainData(tab1Data);
  const tab2MainData = transformMainData(tab2Data);

  const tab1SubData = tab1SubCondition
    ? transformSubData(tab1Data, tab1SubCondition, tab1Page)
    : [];
  const tab2SubData = tab2SubCondition
    ? transformSubData(tab2Data, tab2SubCondition, tab2Page)
    : [];

  const tab1TotalPages = getTotalPages(tab1Data);
  const tab2TotalPages = getTotalPages(tab2Data);
  const tab1SubTotalPages = tab1SubCondition
    ? getTotalPages(tab1Data, tab1SubCondition)
    : 0;
  const tab2SubTotalPages = tab2SubCondition
    ? getTotalPages(tab2Data, tab2SubCondition)
    : 0;

  // Initialize default conditions
  useEffect(() => {
    if (tab1Conditions.length > 0 && !tab1SubCondition) {
      setTab1SubCondition(tab1Conditions[0]);
    }
    if (tab2Conditions.length > 0 && !tab2SubCondition) {
      setTab2SubCondition(tab2Conditions[0]);
    }
  }, [tab1Conditions, tab2Conditions, tab1SubCondition, tab2SubCondition]);

  // Reset pagination when condition changes
  useEffect(() => {
    setTab1Page(0);
  }, [tab1SubCondition]);

  useEffect(() => {
    setTab2Page(0);
  }, [tab2SubCondition]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-8">
        <PageSection>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Performance Insights: Real-World Results
            </h1>
            <p className="mt-6 max-w-4xl mx-auto text-lg leading-8 text-muted-foreground">
              At Insightica, we believe in transparency and rigorous validation.
              Our predictive algorithms are not just theory—they've been
              stress-tested in real-world trading environments.
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
                  To evaluate the effectiveness of our predictive models, we
                  conducted 800+ unique backtests across various configurations.
                  Here's how we structured the testing:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Stock Universe:</strong> Focused primarily on
                    large-cap stocks, where alpha is harder to generate,
                    ensuring the toughest test conditions for our tool.
                  </li>
                  <li>
                    <strong>Ticker Interval:</strong> Fixed at 1 day.
                  </li>
                  <li>
                    <strong>Date Ranges:</strong> Test windows span from 3000
                    Days to 30 Days before the results' publish date.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/50 not-prose">
              <CardContent className="pt-6 space-y-4 text-green-900/90 dark:text-green-200/90">
                <p>
                  These results are based on computer-simulated trades, which
                  generally outperform human execution when following a strict
                  strategy. This is because machines follow rules consistently,
                  without emotional interference, hesitation, or error. However,
                  we believe that real-world results could actually be better
                  with human oversight, not despite, but because of the human
                  ability to think creatively and adaptively.
                </p>
                <p>
                  While factors like slippage (the difference between expected
                  and actual trade prices) do occur in real-world trading, they
                  affect both the chosen strategy and the comparative strategies
                  similarly. As a result, the relative performance differences
                  between them remain meaningful and valid. In other words, even
                  though absolute returns may be slightly impacted, the
                  advantage our predictor shows over alternatives still holds.
                </p>
                <p className="font-semibold text-foreground">
                  At Insightica, we're not here to replace your judgment—we're
                  here to enhance it. Our tools are designed to cut through the
                  noise, present data-backed clarity, and help you make informed
                  decisions in the markets.
                </p>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-3xl font-semibold mt-12 mb-4">
                Key Principles in Our Analysis
              </h2>
              <p>
                We are not in the business of selling perfection. While our tool
                doesn't beat every indicator at every time frame, it
                consistently outperforms when you look at the bigger picture.
                The results presented below are not cherry-picked or optimized
                for optics—they are raw and honest. This is just the
                beginning—our prototype version already shows strong results,
                and future iterations will only improve.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mt-8 mb-4">
                How we got the Results
              </h3>
              <p>We use a simple strategy:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  For each time frame and stock, we select the indicator with
                  the top predicted score.
                </li>
                <li>
                  We compare the return generated from that pick against others.
                </li>
                <li>
                  <strong>Metric Used:</strong> Profit/loss percentage
                  (returns), annualized where appropriate to enable comparisons
                  across different ticker intervals.
                </li>
              </ul>
              <p className="mt-4">
                This is the most primitive implementation of our predictor. More
                sophisticated usage and strategy layering would result in even
                stronger performance.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mt-8 mb-4">
                Interpreting the Results
              </h3>
              <p>While it might be tempting to interpret the results as:</p>
              <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                "If a strategy delivers x% annual returns, then dynamically
                switching strategies using our tool would yield x + a% returns"
              </blockquote>
              <p>
                This direct translation can be misleading. The reason lies in
                the nature of annualisation: different time periods are being
                scaled to an annual figure, which may unintentionally exaggerate
                the apparent gains.
              </p>
              <p className="mt-4">
                A more insightful way to view the results is by recognizing the
                underlying market behavior: no single strategy consistently
                stays on top. Markets are dynamic and stochastic—what works
                today may underperform tomorrow.
              </p>
              <p className="mt-4">
                Our tool is designed to help you adapt to these shifting
                patterns, identifying which strategies are gaining traction and
                allowing you to stay aligned with them—not by predicting the
                future, but by being responsive to ongoing change.
              </p>
              <p className="mt-4 font-semibold text-foreground">
                In essence, it's not just about beating a static strategy—it's
                about staying relevant in a constantly evolving market
                landscape.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Overall Performance (Annualised results)
            </h2>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
                <TabsTrigger value="tab1">All Indicators vs All Results</TabsTrigger>
                <TabsTrigger value="tab2">All Indicators vs Favorites Results</TabsTrigger>
              </TabsList>

              <TabsContent value="tab1" className="space-y-8">
                {/* Main Chart Section */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Main Performance Chart</CardTitle>
                    <CardDescription>
                      Performance of our predictor when selecting from all indicators, compared against all others. Returns are annualized for comparability.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarGraph
                      data={tab1MainData}
                      xAxisKey="name"
                      yAxisKey="value"
                      barColor="hsl(var(--primary))"
                      xAxisLabel=""
                      yAxisLabel="Values"
                      title="Main Chart"
                      legend={false}
                    />
                  </CardContent>
                </Card>

                {/* Sub Chart Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conditional Performance Chart</CardTitle>
                    <CardDescription>
                      Performance of our predictor when selecting from all indicators, compared against all others. Returns are annualized for comparability.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Select Condition:
                      </label>
                      <Select
                        value={tab1SubCondition}
                        onValueChange={setTab1SubCondition}
                      >
                        <SelectTrigger className="w-full max-w-md">
                          <SelectValue placeholder="Select a condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {tab1Conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {tab1SubCondition && (
                      <>
                        <BarGraph
                          data={tab1SubData}
                          xAxisKey="name"
                          yAxisKey="value"
                          barColor="hsl(var(--accent))"
                          xAxisLabel={tab1SubCondition}
                          yAxisLabel=""
                          title={`Sub Chart - ${tab1SubCondition}`}
                          legend={false}
                        />
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setTab1Page(Math.max(0, tab1Page - 1))
                            }
                            disabled={tab1Page === 0}
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Page {tab1Page + 1} of {tab1SubTotalPages} (
                            {DATA_POINTS_PER_PAGE} points per page)
                          </span>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setTab1Page(
                                Math.min(tab1SubTotalPages - 1, tab1Page + 1)
                              )
                            }
                            disabled={tab1Page >= tab1SubTotalPages - 1}
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tab2" className="space-y-8">
                {/* Main Chart Section */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Main Performance Chart</CardTitle>
                    <CardDescription>
                      Predictor selects from all indicators but is benchmarked against popular market indicators.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarGraph
                      data={tab2MainData}
                      xAxisKey="name"
                      yAxisKey="value"
                      barColor="hsl(var(--primary))"
                      xAxisLabel=""
                      yAxisLabel=""
                      title="Main Chart"
                      legend={false}
                    />
                  </CardContent>
                </Card>

                {/* Sub Chart Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conditional Performance Chart</CardTitle>
                    <CardDescription>
                      Predictor selects from all indicators but is benchmarked against popular market indicators.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Select Condition:
                      </label>
                      <Select
                        value={tab2SubCondition}
                        onValueChange={setTab2SubCondition}
                      >
                        <SelectTrigger className="w-full max-w-md">
                          <SelectValue placeholder="Select a condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {tab2Conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {tab2SubCondition && (
                      <>
                        <BarGraph
                          data={tab2SubData}
                          xAxisKey="name"
                          yAxisKey="value"
                          barColor="hsl(var(--accent))"
                          xAxisLabel={tab2SubCondition}
                          yAxisLabel=""
                          title={`Sub Chart - ${tab2SubCondition}`}
                          legend={false}
                        />
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setTab2Page(Math.max(0, tab2Page - 1))
                            }
                            disabled={tab2Page === 0}
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Page {tab2Page + 1} of {tab2SubTotalPages} (
                            {DATA_POINTS_PER_PAGE} points per page)
                          </span>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setTab2Page(
                                Math.min(tab2SubTotalPages - 1, tab2Page + 1)
                              )
                            }
                            disabled={tab2Page >= tab2SubTotalPages - 1}
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}
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

          {/* Community Section */}
          <div
            className="mt-12 py-10 px-6 rounded-xl bg-blue-50 dark:bg-blue-950/40"
            data-aos="fade-up"
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Get the latest updates — in our Discord community.
              </h2>
              <p className="text-muted-foreground mb-6">
                We're working on new features to enhance your experience.
                <br />
                Stay updated by following us here:
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Link
                  href="https://discord.com/invite/PTCWzMd5YD"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  👉 Join the Community on Discord
                </Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
