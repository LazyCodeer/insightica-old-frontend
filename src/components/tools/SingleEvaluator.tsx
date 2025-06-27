
"use client";

import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { HeatMapGrid } from 'react-grid-heatmap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


import { runSingleAnalyzer } from '@/api/tools';
import type { StockMetrics, SingleAnalyzerAPIOutput } from '@/api/tools';
import { conditionMapIdName, tickerMap } from '@/components/tools/single/components/Mappings';
import { METRICS, NORMALIZATION_MAX_VALUES } from '@/lib/constants';

import { BarGraph } from '@/components/charts/BarGraph';
import { RadarChart } from '@/components/charts/RadarChart';


type StringSelectOption = { value: string; label: string };
type NumberSelectOption = { value: number; label: string };
type Metric = keyof StockMetrics;

const stockOptions: StringSelectOption[] = Object.entries(tickerMap).map(([value, label]) => ({ value, label }));
const conditionOptions: NumberSelectOption[] = Object.entries(conditionMapIdName).map(([value, label]) => ({ value: parseInt(value.slice(1)), label }));
const metricOptions: StringSelectOption[] = METRICS.map(m => ({ value: m.key, label: m.label }));

export default function SingleEvaluator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('heatmap');


  // Control states
  const [tickerSize] = useState('1d'); // Fixed for now
  const [selectedStocks, setSelectedStocks] = useState<readonly StringSelectOption[]>([stockOptions[0]]);
  const [selectedConditions, setSelectedConditions] = useState<readonly NumberSelectOption[]>([conditionOptions[0], conditionOptions[1]]);
  const [selectedMetric, setSelectedMetric] = useState<Metric>('sharpe_ratio');
  const [duration, setDuration] = useState<number>(30);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [radarStock, setRadarStock] = useState<StringSelectOption | null>(selectedStocks[0] || null);
  
  // New state for the "Performance Analysis" tab
  const [analysisMode, setAnalysisMode] = useState<'stock-fixed' | 'time-fixed'>('stock-fixed');
  const [analysisStock, setAnalysisStock] = useState<StringSelectOption | null>(stockOptions[0]);
  const [analysisCondition, setAnalysisCondition] = useState<NumberSelectOption | null>(conditionOptions[0]);
  const [analysisMetric, setAnalysisMetric] = useState<Metric>('sharpe_ratio');

  // Data states
  const [analysisData, setAnalysisData] = useState<SingleAnalyzerAPIOutput>({});
  
  const dateRange = useMemo(() => {
    const baseDate = new Date('2025-05-23T00:00:00Z');
    
    const endDate = new Date(baseDate);
    endDate.setUTCDate(baseDate.getUTCDate() - (historyIndex * duration));

    const startDate = new Date(baseDate);
    startDate.setUTCDate(baseDate.getUTCDate() - ((historyIndex + 1) * duration));

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };

    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  }, [historyIndex, duration]);

  useEffect(() => {
    if (!selectedStocks.find(s => s.value === radarStock?.value)) {
        setRadarStock(selectedStocks.length > 0 ? selectedStocks[0] : null);
    }
     if (!selectedStocks.find(s => s.value === analysisStock?.value)) {
        setAnalysisStock(selectedStocks.length > 0 ? selectedStocks[0] : null);
    }
  }, [selectedStocks, radarStock, analysisStock]);

  useEffect(() => {
    if (!selectedConditions.find(c => c.value === analysisCondition?.value)) {
        setAnalysisCondition(selectedConditions.length > 0 ? selectedConditions[0] : null);
    }
  }, [selectedConditions, analysisCondition]);


  const handleRunAnalysis = async () => {
    if (selectedStocks.length === 0 || selectedConditions.length === 0) {
      setError("Please select at least one stock and one condition.");
      return;
    }
     if (selectedStocks.length > 9) {
      setError("Please select a maximum of 9 stocks.");
      return;
    }
    if (selectedConditions.length > 9) {
      setError("Please select a maximum of 9 conditions.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisData({});

    try {
      const input = {
        stock_names: selectedStocks.map(s => s.value),
        condition_ids: selectedConditions.map(c => c.value),
        ticker_size: tickerSize,
        duration: duration
      };
      const response = await runSingleAnalyzer(input);
      setAnalysisData(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch analysis data.");
    } finally {
      setIsLoading(false);
    }
  };

  const reactSelectStyles = {
    control: (base: any) => ({...base, background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))'}),
    menu: (base: any) => ({...base, background: 'hsl(var(--background))', zIndex: 10}),
    option: (base: any, state: any) => ({...base, background: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--background))', color: state.isFocused ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))', cursor: 'pointer' }),
    multiValue: (base: any) => ({...base, background: 'hsl(var(--secondary))'}),
    multiValueLabel: (base: any) => ({...base, color: 'hsl(var(--secondary-foreground))'}),
  };

  const getHeatmapGridData = () => {
    const historyKey = `history_${historyIndex}`;
    const currentHistoryData = analysisData[historyKey];

    if (!currentHistoryData || Object.keys(analysisData).length === 0 || selectedStocks.length === 0 || selectedConditions.length === 0) {
        return null;
    }

    const xLabels = selectedStocks.map(s => s.label.replace('.NS', '')); // Stocks
    const yLabels = selectedConditions.map(c => c.label); // Conditions

    const data = yLabels.map((_, i) => {
        const conditionKey = `c${selectedConditions[i].value}`;
        return xLabels.map((_, j) => {
            const stockName = selectedStocks[j].value;
            const metricValue = currentHistoryData[conditionKey]?.[stockName]?.[selectedMetric];
            return typeof metricValue === 'number' ? parseFloat(metricValue.toFixed(2)) : 0;
        });
    });

    return { xLabels, yLabels, data };
  }

  const getRadarData = () => {
    const historyKey = `history_${historyIndex}`;
    const currentHistoryData = analysisData[historyKey];
    
    if (!currentHistoryData || !radarStock) return [];

    const stock = radarStock;
    const rawData: any[] = [];
    
    selectedConditions.slice(0, 8).forEach(cond => {
        const conditionKey = `c${cond.value}`;
        const conditionDataForStock = currentHistoryData[conditionKey]?.[stock.value];
        if (conditionDataForStock) {
            rawData.push({
                condition: cond.label,
                ...conditionDataForStock
            });
        }
    });
    
    // Normalize the data
    const normalizedData = rawData.map(item => {
        const newItem = { ...item };
        METRICS.forEach(({ key }) => {
            const value = newItem[key];
            if (typeof value === 'number') {
                const max = NORMALIZATION_MAX_VALUES[key];
                let normalizedValue;
                
                // Invert metrics where lower is better
                if (key === 'max_drawdown' || key === 'loss_trades') {
                    normalizedValue = 1 - (value / max);
                } else {
                    normalizedValue = value / max;
                }
                
                // Clamp the value between -1 and 1
                newItem[key] = Math.max(-1, Math.min(1, normalizedValue));
            }
        });
        return newItem;
    });

    return normalizedData;
  }

  const getLeaderboardData = () => {
    const historyKey = `history_${historyIndex}`;
    const currentHistoryData = analysisData[historyKey];

    if (!currentHistoryData || selectedStocks.length === 0) return [];
    
    const stockName = selectedStocks[0].value;
      
    return selectedConditions
      .map(cond => {
          const conditionKey = `c${cond.value}`;
          const metrics = currentHistoryData[conditionKey]?.[stockName];
          return {
              condition: cond.label,
              value: metrics ? metrics[selectedMetric] : undefined,
          };
      })
      .filter((item): item is { condition: string, value: number } => item.value !== undefined)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }
  
    const getStockFixedData = () => {
    if (!hasData || !analysisCondition || !analysisStock) return [];
    
    const data: { history: string; value: number }[] = [];
    const conditionKey = `c${analysisCondition.value}`;
    const stockName = analysisStock.value;

    for (let i = 0; i < 100; i++) {
        const historyKey = `history_${i}`;
        const metricValue = analysisData[historyKey]?.[conditionKey]?.[stockName]?.[analysisMetric];
        data.push({
            history: `H ${i}`,
            value: typeof metricValue === 'number' ? metricValue : 0,
        });
    }
    return data;
  };
  
  const getTimeFixedData = () => {
    if (!hasData || !analysisCondition || selectedStocks.length === 0) return [];

    const historyKey = `history_${historyIndex}`;
    const currentHistoryData = analysisData[historyKey];
    if (!currentHistoryData) return [];
    
    const conditionKey = `c${analysisCondition.value}`;

    return selectedStocks.map(stock => {
        const metricValue = currentHistoryData[conditionKey]?.[stock.value]?.[analysisMetric];
        return {
            stock: stock.label.replace('.NS', ''),
            value: typeof metricValue === 'number' ? metricValue : 0,
        };
    });
  };

  const hasData = Object.keys(analysisData).length > 0;

  const radarChartRadars = METRICS.map((metric, index) => ({
      name: metric.label,
      dataKey: metric.key,
      stroke: `hsl(var(--chart-${(index % 5) + 1}))`,
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const radarData = getRadarData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Condition Evaluator</CardTitle>
        <CardDescription>Analyze the historical performance of individual trading conditions across various stocks and metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg mb-4">
            <div className="space-y-2">
                <Label>Stocks (Max 9)</Label>
                <Select isMulti options={stockOptions} value={selectedStocks} onChange={(o) => setSelectedStocks(o as readonly StringSelectOption[])} styles={reactSelectStyles}/>
            </div>
            <div className="space-y-2">
                <Label>Conditions (Max 9)</Label>
                <Select isMulti options={conditionOptions} value={selectedConditions} onChange={(o) => setSelectedConditions(o as readonly NumberSelectOption[])} styles={reactSelectStyles}/>
            </div>
            <div className="space-y-2">
                <Label>Duration (days)</Label>
                <ShadSelect
                    value={String(duration)}
                    onValueChange={(value) => setDuration(parseInt(value, 10))}
                >
                    <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="45">45</SelectItem>
                    </SelectContent>
                </ShadSelect>
            </div>
        </div>

        <Tabs defaultValue="heatmap" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1 mb-4">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="radar">Metrics Overview</TabsTrigger>
            <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg items-end mb-4">
                {(activeTab === 'heatmap' || activeTab === 'leaderboard') && (
                    <div className="space-y-2">
                        <Label>Metric</Label>
                        <ShadSelect value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as Metric)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>{metricOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </ShadSelect>
                    </div>
                )}
                {activeTab === 'radar' && (
                    <div className="space-y-2">
                        <Label>Stock</Label>
                        <ShadSelect
                            value={radarStock?.value}
                            onValueChange={(value) => setRadarStock(selectedStocks.find(s => s.value === value) || null)}
                            disabled={selectedStocks.length === 0 || isLoading || !hasData}
                        >
                            <SelectTrigger><SelectValue placeholder="Select a stock" /></SelectTrigger>
                            <SelectContent>{selectedStocks.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                        </ShadSelect>
                    </div>
                )}
                {activeTab === 'analysis' && (
                    <>
                        <div className="space-y-2">
                          <Label>Analysis Mode</Label>
                          <RadioGroup defaultValue="stock-fixed" value={analysisMode} onValueChange={(v) => setAnalysisMode(v as any)} className="flex space-x-4 pt-2">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="stock-fixed" id="stock-fixed" /><Label htmlFor="stock-fixed" className="font-normal">Stock Fixed</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="time-fixed" id="time-fixed" /><Label htmlFor="time-fixed" className="font-normal">Time Fixed</Label></div>
                          </RadioGroup>
                        </div>
                        {analysisMode === 'stock-fixed' && (
                          <div className="space-y-2">
                            <Label>Stock</Label>
                            <ShadSelect value={analysisStock?.value} onValueChange={v => setAnalysisStock(selectedStocks.find(s => s.value === v) || null)}>
                                <SelectTrigger><SelectValue placeholder="Select a stock" /></SelectTrigger>
                                <SelectContent>{selectedStocks.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </ShadSelect>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Condition</Label>
                          <ShadSelect value={String(analysisCondition?.value)} onValueChange={v => setAnalysisCondition(selectedConditions.find(c => c.value === parseInt(v)) || null)}>
                              <SelectTrigger><SelectValue placeholder="Select a condition" /></SelectTrigger>
                              <SelectContent>{selectedConditions.map(opt => <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>)}</SelectContent>
                          </ShadSelect>
                        </div>
                        <div className="space-y-2">
                          <Label>Metric</Label>
                          <ShadSelect value={analysisMetric} onValueChange={(v) => setAnalysisMetric(v as Metric)}>
                              <SelectTrigger><SelectValue placeholder="Select a metric" /></SelectTrigger>
                              <SelectContent>{metricOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                          </ShadSelect>
                        </div>
                    </>
                )}
            </div>

            <Button onClick={handleRunAnalysis} disabled={isLoading} className="w-full mb-6">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Run Analysis
            </Button>
            <div className="space-y-2 p-4 border rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <Label>History Point: {historyIndex}</Label>
                    <span className="text-sm text-muted-foreground font-mono">{dateRange}</span>
                </div>
                <Slider 
                    value={[historyIndex]} 
                    onValueChange={(v) => setHistoryIndex(v[0])} 
                    max={99} 
                    step={1} 
                    disabled={!hasData || isLoading}
                />
            </div>
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
        
          <TabsContent value="heatmap">
            <Accordion type="single" collapsible className="w-full mb-4 bg-card/50 px-4 rounded-lg border border-border/50">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-accent" /><span>How to use the Heatmap</span></div></AccordionTrigger>
                <AccordionContent><div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1"><p>This tool helps you see at a glance the performance of multiple trading strategies across multiple stocks for a single chosen metric at a specific historical point.</p><ul><li><strong>Rows:</strong> Represent trading strategies (e.g., Support and Resistance).</li><li><strong>Columns:</strong> Represent stocks (e.g., ABBOTTINDIA).</li><li><strong>Cell Values:</strong> Show the performance of the i-th strategy for the j-th stock, based on the chosen metric at the historical point set by the slider.</li></ul></div></AccordionContent>
              </AccordionItem>
            </Accordion>
            <Card>
              <CardHeader><CardTitle>Heatmap Analysis</CardTitle><CardDescription>Compare performance of conditions across stocks for the selected metric and history point.</CardDescription></CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : 
                 (() => {
                    const heatmapData = getHeatmapGridData();
                    return heatmapData ? (
                      <div className="w-full overflow-x-auto p-1">
                          <div className="min-w-[1200px]">
                            <HeatMapGrid
                            data={heatmapData.data}
                            xLabels={heatmapData.xLabels}
                            yLabels={heatmapData.yLabels}
                            cellRender={(_x, _y, value) => <div title={`Value: ${value}`}>{value}</div>}
                            xLabelsStyle={() => ({
                                color: 'hsl(var(--muted-foreground))',
                                fontSize: '.8rem',
                            })}
                            yLabelsStyle={() => ({
                                color: 'hsl(var(--muted-foreground))',
                                fontSize: '.8rem',
                                textTransform: 'capitalize',
                                width: '200px'
                            })}
                            cellStyle={(_x, _y, ratio) => {
                                const hue = ratio * 120; // 0=red, 120=green
                                return {
                                background: `hsl(${hue}, 90%, 60%)`,
                                fontSize: '12px',
                                color: 'hsl(var(--foreground))',
                                border: '1px solid hsl(var(--border))',
                                }
                            }}
                            cellHeight="2rem"
                            xLabelsPos="bottom"
                            square={false}
                            />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center h-80 flex items-center justify-center text-muted-foreground">No data to display. Run an analysis.</div>
                    );
                  })()
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radar">
             <Accordion type="single" collapsible className="w-full mb-4 bg-card/50 px-4 rounded-lg border border-border/50">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-accent" /><span>How to use the Radial Graph</span></div></AccordionTrigger>
                <AccordionContent><div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1"><p>This tool helps you see at a glance the performance of multiple trading strategies for a given stock across multiple metrics at a specific historical point.</p><ul><li><strong>Spokes:</strong> Each spoke corresponds to a trading strategy (e.g., Bollinger Bands).</li><li><strong>Colored Lines:</strong> Each line represents a performance metric (e.g., Sharpe Ratio).</li><li><strong>Intersection Points:</strong> Indicate the performance of the i-th strategy for the j-th metric for the selected stock at the historical point set by the slider.</li></ul></div></AccordionContent>
              </AccordionItem>
            </Accordion>
             <Card>
              <CardHeader><CardTitle>Metrics Overview Radar</CardTitle><CardDescription>Holistic view of all metrics for up to 8 conditions on a single stock.</CardDescription></CardHeader>
              <CardContent>
                 {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> :
                  radarData.length > 0 ?
                  <RadarChart 
                    data={radarData}
                    angleKey="condition"
                    domain={[-1, 1]}
                    radars={radarChartRadars}
                  /> : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">Select a stock to view Radar. Run an analysis.</div>
                 }
              </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="analysis">
             <Accordion type="single" collapsible className="w-full mb-4 bg-card/50 px-4 rounded-lg border border-border/50">
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-accent" /><span>How to use the Bar Graphs</span></div></AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                      <h4>Metric vs History Bar Graph</h4>
                      <p>This tool shows the historical performance of a chosen trading strategy for a selected stock, based on a chosen metric.</p>
                      <ul><li><strong>X-axis:</strong> Represents different historical points (labeled as History 0, History 1, etc.).</li><li><strong>Y-axis:</strong> Displays the values of the chosen metric.</li><li><strong>Purpose:</strong> Reveals how the strategy’s performance evolves over time for the stock.</li></ul>
                      <hr className="my-4" />
                      <h4>Metric vs Stock Bar Graph</h4>
                      <p>This tool shows the performance of a chosen trading strategy across multiple stocks at a given historical point, adjustable via slider.</p>
                      <ul><li><strong>X-axis:</strong> Lists the stocks.</li><li><strong>Y-axis:</strong> Displays the values of the chosen metric.</li><li><strong>Purpose:</strong> Compares the strategy’s effectiveness across different stocks at the selected time.</li></ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            <Card>
              <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                  <CardDescription>Analyze condition performance over time or across different stocks.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="min-h-[400px]">
                  {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : 
                  !hasData ? <div className="text-center h-80 flex items-center justify-center text-muted-foreground">No data to display. Run an analysis.</div> :
                  analysisMode === 'stock-fixed' ? (
                      <div className="w-full overflow-x-auto">
                        <div className="min-w-[1500px] h-[400px]">
                           <BarGraph data={getStockFixedData()} xAxisKey="history" yAxisKey="value" />
                        </div>
                      </div>
                  ) : (
                      <BarGraph data={getTimeFixedData()} xAxisKey="stock" yAxisKey="value" />
                  )
                  }
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="mt-4">
                <CardHeader><CardTitle>Top Conditions Leaderboard</CardTitle><CardDescription>Top 10 performing conditions for the first selected stock and metric.</CardDescription></CardHeader>
                <CardContent>
                    {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> :
                     (() => {
                         const leaderboardData = getLeaderboardData();
                         return leaderboardData && leaderboardData.length > 0 ? (
                           <BarGraph data={leaderboardData} xAxisKey="condition" yAxisKey="value" />
                         ) : (
                           <div className="text-center h-80 flex items-center justify-center text-muted-foreground">Select one stock to view Leaderboard. Run an analysis.</div>
                         );
                     })()
                    }
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}

    