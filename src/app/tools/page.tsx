"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageSection from "@/components/marketing/sections/PageSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Settings2,
  BarChart3,
  SearchCheck,
  Lightbulb,
  History,
  Loader2,
  CopyCheck,
  HelpCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { BarGraph } from "@/components/charts/BarGraph";
import {
  conditionMapIdName,
  tickerMap,
} from "@/components/tools/single/components/Mappings";
import SingleEvaluator from "@/components/tools/SingleEvaluator";
import DoubleEvaluator from "@/components/tools/DoubleEvaluator";
import Backtester from "@/components/tools/Backtester";
import { runSinglePredictor } from "@/api/tools";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ToolTabInfo {
  value: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const toolTabs: ToolTabInfo[] = [
  {
    value: "backtester",
    label: "Backtester",
    icon: History,
    description: "Test your trading strategies against historical market data.",
  },
  {
    value: "double_evaluator",
    label: "Double Evaluator",
    icon: CopyCheck,
    description: "Analyze stock data based on given double conditions.",
  },
  {
    value: "single_evaluator",
    label: "Single Evaluator",
    icon: BarChart3,
    description:
      "Evaluate individual conditions against historical data using various metrics.",
  },
  {
    value: "single_predictor",
    label: "Single Predictor",
    icon: Lightbulb,
    description:
      "Predict future indicator effectiveness for specific scenarios.",
  },
];

interface ConditionOption {
  value: number;
  label: string;
}

interface GraphData {
  condition: string;
  value: number;
}

const predictorMetricOptions = [
  { value: 0, label: "Total Return" },
  { value: 1, label: "Sharpe Ratio" },
  { value: 2, label: "Max Drawdown" },
  { value: 3, label: "Profitable Trades" },
  { value: 4, label: "Winning Percentage" },
  { value: 5, label: "Total Return * Sharpe Ratio" },
];

export default function ToolsPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  const [stock, setStock] = useState<string>("ACC.NS");
  const [conditions, setConditions] = useState<readonly ConditionOption[]>([]);
  const [duration, setDuration] = useState<number>(45);
  const [predictorMetric, setPredictorMetric] = useState<number>(0);

  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [predictorGraphDomain, setPredictorGraphDomain] = useState<
    [number, number] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, loading, router]);

  const stockOptions = Object.entries(tickerMap).map(([value, label]) => ({
    value,
    label,
  }));
  const conditionOptions: ConditionOption[] = Object.entries(
    conditionMapIdName
  ).map(([key, label]) => ({
    value: parseInt(key.slice(1)),
    label,
  }));

  const handlePredictorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (conditions.length === 0) {
      setError("Please select at least one trading strategy.");
      return;
    }
    if (conditions.length > 10) {
      setError("You can select a maximum of 10 trading strategies.");
      return;
    }

    setIsLoading(true);
    setGraphData([]);

    try {
      const apiInput = {
        stock_name: stock,
        condition_indices: conditions.map((c) => c.value),
        ticker_size: "1d",
        duration: duration,
        what_to_optimise: predictorMetric,
      };
      const response = await runSinglePredictor(apiInput);
      const transformedData = Object.entries(response.result).map(
        ([conditionIndex, value]) => ({
          condition:
            conditionMapIdName[`c${conditionIndex}`] ||
            `Condition ${conditionIndex}`,
          value: value,
        })
      );

      const values = transformedData.map((d) => d.value);
      if (values.length > 0) {
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const padding = (maxValue - minValue) * 0.1 || 0.1;
        const domain: [number, number] = [
          minValue - padding,
          maxValue + padding,
        ];
        setPredictorGraphDomain(domain);
      } else {
        setPredictorGraphDomain(undefined);
      }

      setGraphData(transformedData);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to fetch data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-8">
        <PageSection>
          <div className="text-center mb-12 md:mb-16">
            <Settings2 className="mx-auto h-16 w-16 text-accent mb-6" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Insightica <span className="text-accent">Trading Tools</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-muted-foreground">
              Explore our suite of powerful tools designed to provide
              data-driven insights for your trading strategies.
            </p>
          </div>

          <div className="text-left mb-8 max-w-4xl mx-auto bg-card/50 p-6 rounded-lg border border-border/50">
            <p className="text-muted-foreground mb-4">
              Insightica's suite of tools empowers traders with data-driven
              insights to make informed trading decisions. Each tool is crafted
              for simplicity and precision, leveraging machine learning and
              historical data to support your strategies.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Single Predictor:</strong> Discover trading strategies
                predicted to perform best for a chosen stock in the upcoming
                period.
              </li>
              <li>
                <strong>Single Evaluator:</strong> Explore the historical
                performance of different trading strategies across various
                stocks.
              </li>
              <li>
                <strong>Double Evaluator:</strong> Explore the historical
                performance of different pairs of trading strategies across
                various stocks.
              </li>
              <li>
                <strong>Backtester:</strong> Evaluate the performance of a
                custom combination of trading strategies for a specific stock
                over a chosen time period.
              </li>
            </ul>
          </div>

          <Tabs defaultValue="single_predictor" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 h-auto p-1">
              {toolTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2.5 text-sm sm:text-base h-auto data-[state=active]:shadow-md"
                >
                  <tab.icon className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="single_predictor">
              <Accordion
                type="single"
                collapsible
                className="w-full mb-6 bg-card/50 px-4 rounded-lg border border-border/50"
              >
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-accent" />
                      <span>How to use the Single Predictor</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                      <h4>Single Predictor – Interpretation Guide</h4>
                      <p>
                        This tool predicts the performance of selected trading
                        strategies for a given stock in the upcoming period.
                      </p>
                      <ul>
                        <li>
                          <strong>Inputs:</strong> A stock, a performance
                          metric, and a list of trading strategies.
                        </li>
                        <li>
                          <strong>Output:</strong> A bar graph where:
                          <ul>
                            <li>X-axis: Displays the trading strategies.</li>
                            <li>
                              Y-axis: Shows the predicted values of the chosen
                              metric.
                            </li>
                          </ul>
                        </li>
                        <li>
                          <strong>Purpose:</strong> Helps you identify which
                          strategies are expected to perform best for the stock
                          in the near future.
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Card>
                <CardHeader>
                  <CardTitle>Predictor Controls</CardTitle>
                  <CardDescription>
                    Configure your prediction parameters.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handlePredictorSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
                  >
                    <div className="lg:col-span-1">
                      <Label htmlFor="stock-select">Stock</Label>
                      <ShadSelect value={stock} onValueChange={setStock}>
                        <SelectTrigger id="stock-select" className="mt-1">
                          <SelectValue placeholder="Select a stock" />
                        </SelectTrigger>
                        <SelectContent>
                          {stockOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </ShadSelect>
                    </div>

                    <div className="lg:col-span-1">
                      <Label htmlFor="duration">Duration (days)</Label>
                      <ShadSelect
                        value={String(duration)}
                        onValueChange={(value) =>
                          setDuration(parseInt(value, 10))
                        }
                      >
                        <SelectTrigger id="duration" className="mt-1">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="45">45</SelectItem>
                        </SelectContent>
                      </ShadSelect>
                    </div>

                    <div className="lg:col-span-2">
                      <Label htmlFor="predictor-metric">
                        Metric to Optimize
                      </Label>
                      <ShadSelect
                        value={String(predictorMetric)}
                        onValueChange={(value) =>
                          setPredictorMetric(parseInt(value, 10))
                        }
                      >
                        <SelectTrigger id="predictor-metric" className="mt-1">
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          {predictorMetricOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </ShadSelect>
                    </div>

                    <div className="lg:col-span-4">
                      <Label htmlFor="conditions-select">
                        Trading Strategies (Max 10)
                      </Label>
                      <Select
                        id="conditions-select"
                        isMulti
                        options={conditionOptions}
                        value={conditions}
                        onChange={setConditions}
                        className="mt-1 text-sm"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            background: "hsl(var(--input))",
                            borderColor: "hsl(var(--border))",
                          }),
                          menu: (base) => ({
                            ...base,
                            background: "hsl(var(--background))",
                            zIndex: 10,
                          }),
                          option: (base, state) => ({
                            ...base,
                            background: state.isFocused
                              ? "hsl(var(--accent))"
                              : "hsl(var(--background))",
                            color: state.isFocused
                              ? "hsl(var(--accent-foreground))"
                              : "hsl(var(--foreground))",
                            cursor: "pointer",
                          }),
                          multiValue: (base) => ({
                            ...base,
                            background: "hsl(var(--secondary))",
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: "hsl(var(--secondary-foreground))",
                          }),
                        }}
                      />
                    </div>

                    <div className="lg:col-span-4 mt-4">
                      {error && (
                        <p className="text-sm font-medium text-destructive mb-2">
                          {error}
                        </p>
                      )}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isLoading ? "Generating..." : "Generate Graph"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-8 min-h-[500px]">
                <CardHeader>
                  <CardTitle>Prediction Results</CardTitle>
                  <CardDescription>
                    Predicted effectiveness score for selected strategies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-80">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : graphData.length > 0 ? (
                    <BarGraph
                      data={graphData}
                      xAxisKey="condition"
                      yAxisKey="value"
                      yAxisDomain={predictorGraphDomain}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-80 text-muted-foreground">
                      <p>Submit the form to view the prediction graph.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="single_evaluator">
              <SingleEvaluator />
            </TabsContent>

            <TabsContent value="double_evaluator">
              <DoubleEvaluator />
            </TabsContent>

            <TabsContent value="backtester">
              <Accordion
                type="single"
                collapsible
                className="w-full mb-6 bg-card/50 px-4 rounded-lg border border-border/50"
              >
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-accent" />
                      <span>How to use the Backtester</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                      <h4>Backtester – Interpretation Guide</h4>
                      <p>
                        This tool evaluates the historical performance of a
                        custom combination of trading strategies for a chosen
                        stock over a specified time period.
                      </p>
                      <ul>
                        <li>
                          <strong>Inputs:</strong> Stock name, stop-loss,
                          brokerage, and a combination of trading strategies.
                        </li>
                        <li>
                          <strong>Output:</strong> A table showing the
                          performance across seven key metrics (e.g., Sharpe
                          Ratio, Total Return).
                        </li>
                        <li>
                          <strong>Purpose:</strong> Allows you to assess how
                          your custom strategy combination would have performed
                          historically.
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Backtester />
            </TabsContent>
          </Tabs>

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
