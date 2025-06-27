
"use client";

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageSection from '@/components/marketing/sections/PageSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import * as lucideIcons from 'lucide-react';
import knowledgeBaseData from '@/data/knowledge-base.json';
import toolsTutorialsData from '@/data/tools-tutorials.json';
import type { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle } from 'lucide-react';

interface ImageData {
  url: string;
}
interface KnowledgeBaseItem {
  id: string;
  image: string;
  imageHint?: string;
  title: string;
  icon: string; 
  summary: string;
  category: string;
  overview: string;
  types: string[];
  usage: string;
  implementation: string;
}

interface ToolTutorial {
  id: string;
  category: string;
  title: string;
  icon: string;
  summary: string;
  // Old fields for backward compatibility
  steps?: string[];
  tips?: string[];
  // New fields for structured content
  whatItDoes?: string;
  inputs?: string[];
  output?: string;
  whyUseIt?: string[];
  howItHelps?: string;
  howToUse?: string[];
}


const iconMap: { [key: string]: LucideIcon } = {
  TrendingUp: lucideIcons.TrendingUp,
  GitCompareArrows: lucideIcons.GitCompareArrows,
  Gauge: lucideIcons.Gauge,
  Maximize: lucideIcons.Maximize,
  BarChart3: lucideIcons.BarChart3,
  GitFork: lucideIcons.GitFork,
  LineChart: lucideIcons.LineChart,
  Activity: lucideIcons.Activity,
  Cloud: lucideIcons.Cloud,
  SlidersHorizontal: lucideIcons.SlidersHorizontal,
  ScatterChart: lucideIcons.ScatterChart,
  Network: lucideIcons.Network,
  CandlestickChart: lucideIcons.CandlestickChart,
  Waves: lucideIcons.Waves,
  ArrowUpRight: lucideIcons.ArrowUpRight,
  Minus: lucideIcons.Minus,
  MapPin: lucideIcons.MapPin,
  HelpCircle: lucideIcons.HelpCircle, 
  BookOpen: lucideIcons.BookOpen, 
  ListChecks: lucideIcons.ListChecks,
  Presentation: lucideIcons.Presentation,
  BrainCircuit: lucideIcons.BrainCircuit,
  UserCheck: lucideIcons.UserCheck,
  Layers3: lucideIcons.Layers3,
  Target: lucideIcons.Target,
  GaugeCircle: lucideIcons.GaugeCircle,
  FunctionSquare: lucideIcons.FunctionSquare,
  Lightbulb: lucideIcons.Lightbulb,
  History: lucideIcons.History,
  Settings2: lucideIcons.Settings2,
  CopyCheck: lucideIcons.CopyCheck,
  LayoutGrid: lucideIcons.LayoutGrid,
  Radar: lucideIcons.Radar,
  BarChartHorizontal: lucideIcons.BarChartHorizontal,
  BarChart2: lucideIcons.BarChart2,
};


export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeBaseItem | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolTutorial | null>(null);

  const filteredData = knowledgeBaseData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const KnowledgeBaseIcon = selectedItem ? iconMap[selectedItem.icon] || lucideIcons.HelpCircle : lucideIcons.HelpCircle;
  const ToolIcon = selectedTool ? iconMap[selectedTool.icon] || lucideIcons.HelpCircle : lucideIcons.HelpCircle;

  const predictorTutorials = toolsTutorialsData.filter(t => t.category === 'Predictor');
  const singleEvaluatorTutorials = toolsTutorialsData.filter(t => t.category === 'Single Evaluator');
  const doubleEvaluatorTutorials = toolsTutorialsData.filter(t => t.category === 'Double Evaluator');
  const backtesterTutorials = toolsTutorialsData.filter(t => t.category === 'Backtester');

  const ToolTutorialContent = ({ item }: { item: ToolTutorial | null }) => {
    if (!item) return null;

    if (item.whatItDoes) {
      return (
          <div className="space-y-4 text-muted-foreground py-4 text-sm">
              {item.whatItDoes && (
                  <div>
                      <h4 className="font-semibold text-foreground mb-1 text-base">What It Does</h4>
                      <p>{item.whatItDoes}</p>
                  </div>
              )}
              {item.inputs && (
                  <div>
                      <h4 className="font-semibold text-foreground mb-1 text-base">Inputs</h4>
                      <ul className="list-disc list-inside space-y-1">{item.inputs.map((inputItem, i) => <li key={i}>{inputItem}</li>)}</ul>
                  </div>
              )}
              {item.output && (
                  <div>
                      <h4 className="font-semibold text-foreground mb-1 text-base">Output</h4>
                      <div className="whitespace-pre-wrap">{item.output}</div>
                  </div>
              )}
              {item.whyUseIt && (
                  <div>
                      <h4 className="font-semibold text-foreground mb-1 text-base">Why Use It?</h4>
                      <ul className="list-disc list-inside space-y-1">{item.whyUseIt.map((useItem, i) => <li key={i}>{useItem}</li>)}</ul>
                  </div>
              )}
              {item.howItHelps && (
                  <div>
                      <h4 className="font-semibold text-foreground mb-1 text-base">How It Helps</h4>
                      <p>{item.howItHelps}</p>
                  </div>
              )}
              {item.howToUse && (
                  <div>
                      <h4 className="font-semibold text-foreground mb-1 text-base">How to Use</h4>
                      <ol className="list-decimal list-inside space-y-1">{item.howToUse.map((useStep, i) => <li key={i}>{useStep}</li>)}</ol>
                  </div>
              )}
          </div>
      );
    }
    // Fallback for old format
    return (
        <div className="space-y-6 text-muted-foreground py-4">
            <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">How to Use:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {item.steps?.map((step, index) => (<li key={index}>{step}</li>))}
                </ol>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Tips for Best Results:</h4>
                <ul className="space-y-2 text-sm">
                    {item.tips?.map((tip, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
  };

  const renderToolCard = (item: ToolTutorial) => {
    const IconComponent = iconMap[item.icon] || lucideIcons.HelpCircle;
    return (
      <Card key={item.id} className="flex flex-col bg-card/80 border-border/50 overflow-hidden hover:shadow-xl hover:border-accent/50 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <IconComponent className="h-7 w-7 text-accent flex-shrink-0" />
            <CardTitle className="text-xl text-card-foreground">{item.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{item.summary}</p>
        </CardContent>
        <CardFooter>
          <Button 
              variant="outline" 
              className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent"
              onClick={() => setSelectedTool(item)}
            >
            Read More
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const FullWidthTutorial = ({ item }: { item: ToolTutorial }) => {
    if (!item) return null;
    const IconComponent = iconMap[item.icon] || lucideIcons.HelpCircle;
    return (
      <Card className="w-full bg-card/80 border-border/50">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <IconComponent className="h-7 w-7 text-accent flex-shrink-0" />
            <CardTitle className="text-xl text-card-foreground">{item.title}</CardTitle>
          </div>
          <CardDescription>{item.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <ToolTutorialContent item={item} />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PageSection>
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Insightica <span className="text-accent">Tutorials</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
              Explore our guides to make the most of Insightica's features.
            </p>
          </div>

          <Tabs defaultValue="knowledge-base" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-8">
              <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
              <TabsTrigger value="tools-usage">Tools Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="knowledge-base">
              <div className="mb-8">
                <Input
                  type="text"
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-lg mx-auto bg-card/80"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredData.map((item: KnowledgeBaseItem) => {
                  const Icon = iconMap[item.icon] || lucideIcons.HelpCircle;
                  return (
                    <Card key={item.id} className="flex flex-col bg-card/80 border-border/50 overflow-hidden hover:shadow-xl hover:border-accent/50 transition-all duration-300">
                       <CardHeader className="p-0">
                         <div className="relative aspect-video">
                           <Image 
                                src={item.image}
                                alt={item.title} 
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint={item.imageHint || "chart analysis"}
                            />
                         </div>
                         <div className="p-6 pb-2">
                           <div className="flex items-center space-x-3 mb-2">
                            <Icon className="h-6 w-6 text-accent flex-shrink-0" />
                            <CardTitle className="text-xl text-card-foreground">{item.title}</CardTitle>
                          </div>
                          <CardDescription className="text-xs text-muted-foreground font-medium">{item.category}</CardDescription>
                         </div>
                       </CardHeader>
                       <CardContent className="p-6 pt-2 flex-grow">
                         <p className="text-sm text-muted-foreground">{item.summary}</p>
                       </CardContent>
                       <CardFooter className="p-6 pt-0">
                         <Button 
                            variant="outline" 
                            className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent"
                            onClick={() => setSelectedItem(item)}
                          >
                           Read More
                         </Button>
                       </CardFooter>
                     </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="tools-usage">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold tracking-tight text-foreground">Tools Usage</h3>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                  Insightica's suite of tools—Single Predictor, Single Evaluator, Double Evaluator, and Backtester—empowers traders with data-driven insights to optimize trading strategies. Each tool includes subtools (heatmaps, radial graphs, bar graphs, and chord diagrams) tailored for specific analyses. Below, we explain what each subtool does, the required inputs, and their unique use cases, emphasizing why they’re valuable and how to use them effectively.
                </p>
              </div>
               <Tabs defaultValue="predictor" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 h-auto p-1">
                    <TabsTrigger value="predictor">Predictor</TabsTrigger>
                    <TabsTrigger value="single_evaluator">Single Evaluator</TabsTrigger>
                    <TabsTrigger value="double_evaluator">Double Evaluator</TabsTrigger>
                    <TabsTrigger value="backtester">Backtester</TabsTrigger>
                </TabsList>
                <TabsContent value="predictor">
                  <div className="space-y-4">
                      {predictorTutorials.map(item => <FullWidthTutorial key={item.id} item={item} />)}
                  </div>
                </TabsContent>
                <TabsContent value="single_evaluator">
                  <div className="text-center mb-8">
                      <p className="max-w-3xl mx-auto text-muted-foreground">
                          The Single Evaluator analyzes the historical performance of individual trading strategies across stocks and metrics, using three subtools: Heatmap, Radial Graph, and Bar Graphs (Metric vs History and Metric vs Stock).
                      </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {singleEvaluatorTutorials.map(renderToolCard)}
                  </div>
                </TabsContent>
                <TabsContent value="double_evaluator">
                  <div className="text-center mb-8">
                      <p className="max-w-3xl mx-auto text-muted-foreground">
                        The Double Evaluator analyzes the historical performance of strategy pairs (one fixed strategy paired with others) across stocks and metrics. It includes four subtools: Heatmap, Radial Graph, Bar Graphs, and Chord Diagram. Unlike the Single Evaluator, it focuses on how strategy combinations perform, helping you find synergistic pairs.
                      </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {doubleEvaluatorTutorials.map(renderToolCard)}
                  </div>
                </TabsContent>
                <TabsContent value="backtester">
                  <div className="space-y-4">
                    {backtesterTutorials.map(item => <FullWidthTutorial key={item.id} item={item} />)}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>

          {selectedItem && (
            <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                   <div className="flex items-center space-x-3 mb-2">
                    <KnowledgeBaseIcon className="h-7 w-7 text-accent flex-shrink-0" />
                    <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
                  </div>
                  <DialogDescription>{selectedItem.category}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-6">
                   <div className="space-y-4 text-muted-foreground">
                      <div className="relative aspect-video rounded-md overflow-hidden shadow-md my-4">
                        <Image 
                            src={selectedItem.image} 
                            alt={selectedItem.title} 
                            fill 
                            style={{ objectFit: 'cover' }}
                            data-ai-hint={selectedItem.imageHint || "chart analysis"}
                        />
                      </div>
                      <div>
                          <h4 className="text-md font-semibold text-foreground mb-1">Overview</h4>
                          <p className="text-sm">{selectedItem.overview}</p>
                      </div>
                       <div>
                          <h4 className="text-md font-semibold text-foreground mb-1">Types:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {selectedItem.types.map((type, index) => ( <li key={index}>{type}</li> ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-foreground mb-1">Usage:</h4>
                          <p className="text-sm">{selectedItem.usage}</p>
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-foreground mb-1">Insightica Implementation:</h4>
                          <p className="text-sm">{selectedItem.implementation}</p>
                        </div>
                    </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}

          {selectedTool && (
             <Dialog open={!!selectedTool} onOpenChange={(isOpen) => !isOpen && setSelectedTool(null)}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                   <div className="flex items-center space-x-3 mb-2">
                    <ToolIcon className="h-7 w-7 text-accent flex-shrink-0" />
                    <DialogTitle className="text-2xl">{selectedTool.title} Tutorial</DialogTitle>
                  </div>
                  <DialogDescription>{selectedTool.summary}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-6">
                  <ToolTutorialContent item={selectedTool} />
                </ScrollArea>
                 <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          )}

        </PageSection>
      </main>
      <Footer />
    </div>
  );
}
