
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
import type { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KnowledgeBaseItem {
  id: string;
  image: string;
  imageHint?: string;
  title: string;
  icon: string; // Icon name as string
  summary: string;
  category: string;
  overview: string;
  types: string[];
  usage: string;
  implementation: string;
}

// Icon mapping
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
  HelpCircle: lucideIcons.HelpCircle, // Default/fallback icon
  BookOpen: lucideIcons.BookOpen, // General knowledge icon
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
};


export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeBaseItem | null>(null);

  const filteredData = knowledgeBaseData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const IconComponent = selectedItem ? iconMap[selectedItem.icon] || lucideIcons.HelpCircle : lucideIcons.HelpCircle;

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
              <div className="text-center py-10">
                <lucideIcons.Construction className="mx-auto h-12 w-12 text-accent mb-4" />
                <h2 className="text-2xl font-semibold text-foreground">Tools Usage Guides</h2>
                <p className="text-muted-foreground mt-2">
                  Detailed tutorials on how to use each of Insightica&apos;s tools are coming soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {selectedItem && (
            <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                   <div className="flex items-center space-x-3 mb-2">
                    <IconComponent className="h-7 w-7 text-accent flex-shrink-0" />
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

        </PageSection>
      </main>
      <Footer />
    </div>
  );
}

