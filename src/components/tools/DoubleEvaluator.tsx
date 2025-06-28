
"use client";

import { useState, useMemo, useEffect } from 'react';
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

import { runDoubleAnalyzer } from '@/api/tools';
import type { StockMetrics, DoubleAnalyzerAPIOutput } from '@/api/tools';
import { conditionMapIdName, tickerMap } from '@/components/tools/single/components/Mappings';
import { METRICS, NORMALIZATION_MAX_VALUES } from '@/lib/constants';

import { RadarChart } from '@/components/charts/RadarChart';
import { ChordDiagram } from '@/components/charts/ChordDiagram';
import { BarGraph } from '@/components/charts/BarGraph';

type StringSelectOption = { value: string; label: string };
type NumberSelectOption = { value: number; label: string };
type Metric = keyof StockMetrics;

const validStocks = [
    "ADANIENT.NS", "AXISBANK.NS", "BAJAJ-AUTO.NS", "BAJAJFINSV.NS", "BAJFINANCE.NS",
    "BEL.NS", "BHARTIARTL.NS", "CIPLA.NS", "HCLTECH.NS", "HDFCBANK.NS",
    "HEROMOTOCO.NS", "HINDUNILVR.NS", "ICICIBANK.NS", "INFY.NS", "ITC.NS",
    "KOTAKBANK.NS", "LT.NS", "M&M.NS", "MARUTI.NS", "NTPC.NS",
    "ONGC.NS", "RELIANCE.NS", "SBIN.NS", "SUNPHARMA.NS", "TATAMOTORS.NS",
    "TATASTEEL.NS", "TCS.NS", "TITAN.NS", "ULTRACEMCO.NS", "WIPRO.NS"
];

const stockOptions: StringSelectOption[] = Object.entries(tickerMap)
    .filter(([ticker]) => validStocks.includes(ticker))
    .map(([value, label]) => ({ value, label }));

const conditionOptions: NumberSelectOption[] = Object.entries(conditionMapIdName).map(([value, label]) => ({ value: parseInt(value.slice(1)), label }));
const metricOptions: StringSelectOption[] = METRICS.map(m => ({ value: m.key, label: m.label }));

const getPairKey = (id1: number, id2: number): string => {
    return `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;
};

const defaultColorScale = (value: number, min: number, max: number): string => {
  if (max === min || value === null || value === undefined) return 'hsl(0, 90%, 60%)'; // Default to red if invalid
  const ratio = (value - min) / (max - min);
  // A scale from red (low) to green (high). hue 0 is red, 120 is green.
  const hue = ratio * 120;
  return `hsl(${hue}, 90%, 60%)`;
};

export default function DoubleEvaluator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('heatmap');


  // Control states
  const [tickerSize] = useState('1d');
  const [selectedStocks, setSelectedStocks] = useState<readonly StringSelectOption[]>([stockOptions[0]]);
  const [fixedCondition, setFixedCondition] = useState<NumberSelectOption | null>(conditionOptions[0]);
  const [otherConditions, setOtherConditions] = useState<readonly NumberSelectOption[]>([conditionOptions[1], conditionOptions[2]]);
  const [selectedMetric, setSelectedMetric] = useState<Metric>('sharpe_ratio');
  const [duration, setDuration] = useState<number>(30);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  // Data states
  const [analysisData, setAnalysisData] = useState<DoubleAnalyzerAPIOutput>({});
  
  // States for Performance Analysis Tab
  const [analysisMode, setAnalysisMode] = useState<'stock-fixed' | 'time-fixed'>('stock-fixed');
  const [analysisStock, setAnalysisStock] = useState<StringSelectOption | null>(null);
  const [analysisCondition1, setAnalysisCondition1] = useState<NumberSelectOption | null>(null);
  const [analysisCondition2, setAnalysisCondition2] = useState<NumberSelectOption | null>(null);
  const [analysisMetric, setAnalysisMetric] = useState<Metric>('sharpe_ratio');
  const [chordStock, setChordStock] = useState<StringSelectOption | null>(null);

  const dateRange = useMemo(() => {
    const baseDate = new Date('2025-05-23T00:00:00Z');
    
    const endDate = new Date(baseDate);
    endDate.setUTCDate(baseDate.getUTCDate() - (historyIndex * duration));

    const startDate = new Date(baseDate);
    startDate.setUTCDate(baseDate.getUTCDate() - ((historyIndex + 1) * duration));

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };

    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  }, [historyIndex, duration]);

  const allSelectedConditions = useMemo(() => {
    if (!fixedCondition) return otherConditions;
    const otherFiltered = otherConditions.filter(c => c.value !== fixedCondition.value);
    return [fixedCondition, ...otherFiltered];
  }, [fixedCondition, otherConditions]);

  const otherConditionOptions = useMemo(() => {
    if (!fixedCondition) return conditionOptions;
    return conditionOptions.filter(c => c.value !== fixedCondition.value);
  }, [fixedCondition]);

  // Ensure "Other Conditions" doesn't contain the "Fixed Condition"
  useEffect(() => {
    if (fixedCondition && otherConditions.some(c => c.value === fixedCondition.value)) {
        setOtherConditions(otherConditions.filter(c => c.value !== fixedCondition.value));
    }
  }, [fixedCondition, otherConditions]);
  
  useEffect(() => {
    if (selectedStocks.length > 0) {
        if (!analysisStock || !selectedStocks.some(s => s.value === analysisStock.value)) {
            setAnalysisStock(selectedStocks[0]);
        }
        if (!chordStock || !selectedStocks.some(s => s.value === chordStock.value)) {
            setChordStock(selectedStocks[0]);
        }
    } else {
        setAnalysisStock(null);
        setChordStock(null);
    }
  }, [selectedStocks, analysisStock, chordStock]);

  useEffect(() => {
     if (allSelectedConditions.length > 0 && (!analysisCondition1 || !allSelectedConditions.some(c => c.value === analysisCondition1.value))) {
        setAnalysisCondition1(allSelectedConditions[0]);
    }
    const availableConditionsForC2 = allSelectedConditions.filter(c => c.value !== analysisCondition1?.value);
    if (availableConditionsForC2.length > 0 && (!analysisCondition2 || !availableConditionsForC2.some(c => c.value === analysisCondition2.value))) {
        setAnalysisCondition2(availableConditionsForC2[0]);
    } else if (availableConditionsForC2.length === 0) {
        setAnalysisCondition2(null);
    }
  }, [allSelectedConditions, analysisCondition1, analysisCondition2]);

  const handleRunAnalysis = async () => {
    if (selectedStocks.length === 0 || allSelectedConditions.length < 2) {
      setError("Please select at least one stock and two conditions (one fixed, one other).");
      return;
    }
     if (selectedStocks.length > 9) {
      setError("Please select a maximum of 9 stocks.");
      return;
    }
    if (otherConditions.length > 9) {
      setError("Please select a maximum of 9 'other' conditions.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisData({});

    try {
      const input = {
        stock_names: selectedStocks.map(s => s.value),
        condition_ids: allSelectedConditions.map(c => c.value),
        ticker_size: tickerSize,
        duration: duration
      };
      
      const response = await runDoubleAnalyzer(input);
      setAnalysisData(response);
      setAnalysisStock(selectedStocks[0]);
      setAnalysisCondition1(allSelectedConditions[0]);
      setAnalysisCondition2(allSelectedConditions[1] || allSelectedConditions[0]);
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

  const hasData = Object.keys(analysisData).length > 0;

  const getHeatmapGridData = () => {
    if (!hasData || !fixedCondition || otherConditions.length === 0) return null;

    const historyKey = `history_${historyIndex}`;
    const currentHistoryData = analysisData[historyKey];
    if (!currentHistoryData) return null;

    const fixedCondId = fixedCondition.value;
    const pairs = otherConditions.map(otherCond => ({
        key: getPairKey(fixedCondId, otherCond.value),
        label: `${conditionMapIdName[`c${fixedCondId}`]} & ${conditionMapIdName[`c${otherCond.value}`]}`
    }));

    const xLabels = selectedStocks.map(s => s.label.replace('.NS', ''));
    const yLabels = pairs.map(p => p.label);

    const data = yLabels.map((_, i) => {
        const pairKey = pairs[i].key;
        return xLabels.map((_, j) => {
            const stockName = selectedStocks[j].value;
            const metricValue = currentHistoryData[pairKey]?.[stockName]?.[selectedMetric];
            return typeof metricValue === 'number' ? parseFloat(metricValue.toFixed(2)) : 0;
        });
    });

    return { xLabels, yLabels, data };
  }

  const getRadarData = () => {
    const historyKey = `history_${historyIndex}`;
    const currentHistoryData = analysisData[historyKey];
    
    if (!currentHistoryData || !selectedStocks.length || !fixedCondition || otherConditions.length === 0) return [];
    
    // Using the first selected stock for the radar view
    const stock = selectedStocks[0];
    const rawData: any[] = [];
    const fixedCondId = fixedCondition.value;

    otherConditions.forEach(otherCond => {
        const pairKey = getPairKey(fixedCondId, otherCond.value);
        const stockMetrics = currentHistoryData[pairKey]?.[stock.value];
        if (stockMetrics) {
            const cond1Label = conditionOptions.find(c => c.value === fixedCondId)?.label || `C${fixedCondId}`;
            const cond2Label = conditionOptions.find(c => c.value === otherCond.value)?.label || `C${otherCond.value}`;
            rawData.push({
                condition: `${cond1Label.substring(0,10)} & ${cond2Label.substring(0,10)}`,
                ...stockMetrics
            });
        }
    });

    // Normalize the data
    const normalizedData = rawData.slice(0, 8).map(item => { // Limit to 8 pairs for readability
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
  
  const getChordData = () => {
      if (!chordStock || allSelectedConditions.length < 3 || allSelectedConditions.length > 6 || !hasData) return undefined;
      
      const historyKey = `history_${historyIndex}`;
      const currentHistoryData = analysisData[historyKey];
      if (!currentHistoryData) return undefined;
      
      const stock = chordStock;
      
      const conditions = allSelectedConditions;
      const matrix: number[][] = Array(conditions.length).fill(0).map(() => Array(conditions.length).fill(0));
      const names = conditions.map(c => c.label);

      for (let i = 0; i < conditions.length; i++) {
          for (let j = i; j < conditions.length; j++) {
              if (i === j) {
                matrix[i][j] = 0;
                continue;
              };
              const pairKey = getPairKey(conditions[i].value, conditions[j].value);
              let value = 0;
              const stockMetrics = currentHistoryData[pairKey]?.[stock.value];
              if (stockMetrics && stockMetrics[selectedMetric] !== undefined) {
                  value = stockMetrics[selectedMetric];
              }
              matrix[i][j] = Math.max(0, value); 
              matrix[j][i] = Math.max(0, value);
          }
      }
      return { matrix, names };
  }

  const getStockFixedData = () => {
    if (!hasData || !analysisCondition1 || !analysisCondition2 || !analysisStock) return [];
    
    const data: { history: string; value: number }[] = [];
    const pairKey = getPairKey(analysisCondition1.value, analysisCondition2.value);
    const stockName = analysisStock.value;

    for (let i = 0; i < 100; i++) {
        const historyKey = `history_${i}`;
        const metricValue = analysisData[historyKey]?.[pairKey]?.[stockName]?.[analysisMetric];
        data.push({
            history: `H ${i}`,
            value: typeof metricValue === 'number' ? metricValue : 0,
        });
    }
    return data;
  };
  
  const getTimeFixedData = () => {
    if (!hasData || !analysisCondition1 || !analysisCondition2 || selectedStocks.length === 0) return [];

    const historyKey = `history_${historyIndex}`;
    const currentHistoryData = analysisData[historyKey];
    if (!currentHistoryData) return [];
    
    const pairKey = getPairKey(analysisCondition1.value, analysisCondition2.value);

    return selectedStocks.map(stock => {
        const metricValue = currentHistoryData[pairKey]?.[stock.value]?.[analysisMetric];
        return {
            stock: stock.label.replace('.NS', ''),
            value: typeof metricValue === 'number' ? metricValue : 0,
        };
    });
  };

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
        <CardTitle>Double Condition Evaluator</CardTitle>
        <CardDescription>Analyze the historical performance of condition pairs across stocks and metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg mb-4">
            <div className="space-y-2">
                <Label>Stocks (Max 9)</Label>
                <Select isMulti options={stockOptions} value={selectedStocks} onChange={(o) => setSelectedStocks(o as readonly StringSelectOption[])} styles={reactSelectStyles}/>
            </div>
            <div className="space-y-2">
                <Label>Fixed Condition</Label>
                <ShadSelect value={String(fixedCondition?.value)} onValueChange={v => setFixedCondition(conditionOptions.find(c => c.value === parseInt(v)) || null)}>
                    <SelectTrigger><SelectValue placeholder="Select a fixed condition" /></SelectTrigger>
                    <SelectContent>{conditionOptions.map(opt => <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>)}</SelectContent>
                </ShadSelect>
            </div>
            <div className="space-y-2">
                <Label>Other Conditions (Max 9)</Label>
                <Select isMulti options={otherConditionOptions} value={otherConditions} onChange={(o) => setOtherConditions(o as readonly NumberSelectOption[])} styles={reactSelectStyles}/>
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
            <TabsTrigger value="chord">Pairwise Synergy</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg items-end mb-4">
                {(activeTab === 'heatmap' || activeTab === 'chord') && (
                     <div className="space-y-2">
                        <Label>Metric</Label>
                        <ShadSelect value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as Metric)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>{metricOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </ShadSelect>
                    </div>
                )}
                {activeTab === 'analysis' && (
                    <>
                         <div className="space-y-2">
                          <Label>Analysis Mode</Label>
                          <RadioGroup defaultValue="stock-fixed" value={analysisMode} onValueChange={(v) => setAnalysisMode(v as any)} className="flex space-x-4 pt-2">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="stock-fixed" id="d-stock-fixed" /><Label htmlFor="d-stock-fixed" className="font-normal">Stock Fixed</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="time-fixed" id="d-time-fixed" /><Label htmlFor="d-time-fixed" className="font-normal">Time Fixed</Label></div>
                          </RadioGroup>
                        </div>
                        {analysisMode === 'stock-fixed' && (
                          <div className="space-y-2">
                              <Label>Stock</Label>
                              <ShadSelect value={analysisStock?.value} onValueChange={v => setAnalysisStock(selectedStocks.find(s => s.value === v) || null)} disabled={!hasData}>
                                  <SelectTrigger><SelectValue placeholder="Select a stock" /></SelectTrigger>
                                  <SelectContent>{selectedStocks.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                              </ShadSelect>
                          </div>
                        )}
                         <div className="space-y-2">
                          <Label>Condition 1</Label>
                          <ShadSelect value={String(analysisCondition1?.value)} onValueChange={v => setAnalysisCondition1(allSelectedConditions.find(c => c.value === parseInt(v)) || null)} disabled={!hasData}>
                              <SelectTrigger><SelectValue placeholder="Select condition 1" /></SelectTrigger>
                              <SelectContent>{allSelectedConditions.map(opt => <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>)}</SelectContent>
                          </ShadSelect>
                        </div>
                        <div className="space-y-2">
                            <Label>Condition 2</Label>
                            <ShadSelect value={String(analysisCondition2?.value)} onValueChange={v => setAnalysisCondition2(allSelectedConditions.find(c => c.value === parseInt(v)) || null)} disabled={!hasData || !analysisCondition1}>
                                <SelectTrigger><SelectValue placeholder="Select condition 2" /></SelectTrigger>
                                <SelectContent>{allSelectedConditions.filter(c => c.value !== analysisCondition1?.value).map(opt => <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>)}</SelectContent>
                            </ShadSelect>
                        </div>
                        <div className="space-y-2">
                            <Label>Metric</Label>
                            <ShadSelect value={analysisMetric} onValueChange={(v) => setAnalysisMetric(v as Metric)} disabled={!hasData}>
                                <SelectTrigger><SelectValue placeholder="Select a metric" /></SelectTrigger>
                                <SelectContent>{metricOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </ShadSelect>
                        </div>
                    </>
                )}
                 {activeTab === 'chord' && (
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <ShadSelect
                          value={chordStock?.value}
                          onValueChange={(value) => setChordStock(selectedStocks.find(s => s.value === value) || null)}
                          disabled={selectedStocks.length === 0 || isLoading || !hasData}
                      >
                          <SelectTrigger><SelectValue placeholder="Select a stock" /></SelectTrigger>
                          <SelectContent>{selectedStocks.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                      </ShadSelect>
                    </div>
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
                    max={44} 
                    step={1} 
                    disabled={!hasData || isLoading}
                />
            </div>
            {error && <p className="text-sm font-medium text-destructive text-center mb-4">{error}</p>}

          <TabsContent value="heatmap">
            <Accordion type="single" collapsible className="w-full mb-4 bg-card/50 px-4 rounded-lg border border-border/50">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-accent" /><span>How to use the Heatmap</span></div></AccordionTrigger>
                <AccordionContent><div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1"><p>This tool helps you see at a glance the performance of multiple pairs of trading strategies across multiple stocks for a single chosen metric at a specific historical point.</p><ul><li><strong>Rows:</strong> Represent trading strategies paired with one selected strategy (Condition_1, chosen via single-select dropdown).</li><li><strong>Columns:</strong> Represent stocks (e.g., ABBOTINDIA).</li><li><strong>Cell Values:</strong> Show the performance of the i-th strategy pair (Condition_1 + Condition_2, where Condition_1 is a strategy chosen from the single-select dropdown, and Condition_2 is one of the strategies chosen from the multi-select dropdown) for the j-th stock, based on the chosen metric at the historical point set by the slider.</li></ul></div></AccordionContent>
              </AccordionItem>
            </Accordion>
            <Card>
              <CardHeader><CardTitle>Pairwise Heatmap</CardTitle><CardDescription>Performance of condition pairs across stocks for the selected metric and history point.</CardDescription></CardHeader>
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
                            xLabelsStyle={() => ({ color: 'hsl(var(--muted-foreground))', fontSize: '.8rem' })}
                            yLabelsStyle={() => ({ color: 'hsl(var(--muted-foreground))', fontSize: '.8rem', textTransform: 'capitalize', whiteSpace: 'nowrap' })}
                            cellStyle={(_x, _y, ratio) => {
                                const hue = ratio * 120; // 0=red, 120=green
                                return {
                                    background: `hsl(${hue}, 90%, 60%)`,
                                    fontSize: '12px',
                                    color: 'hsl(var(--foreground))',
                                    border: '1px solid hsl(var(--border))',
                                };
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
                  <AccordionContent><div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1"><p>This tool helps you see at a glance the performance of multiple pairs of trading strategies for a given stock across multiple metrics at a specific historical point.</p><ul><li><strong>Spokes:</strong> Each spoke corresponds to a trading strategy paired with one selected strategy (Condition_1, chosen via single-select dropdown).</li><li><strong>Colored Lines:</strong> Each line represents a performance metric (e.g., Sharpe Ratio).</li><li><strong>Intersection Points:</strong> Indicate the performance of the i-th strategy pair (Condition_1 + Condition_2, where Condition_1 is a strategy chosen from the single-select dropdown, and Condition_2 is one of the strategies chosen from the multi-select dropdown) for the j-th metric for the selected stock at the historical point set by the slider.</li></ul></div></AccordionContent>
                </AccordionItem>
              </Accordion>
            <Card>
              <CardHeader><CardTitle>Pair Metrics Overview</CardTitle><CardDescription>Holistic view of all metrics for selected pairs on the first selected stock.</CardDescription></CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : 
                  radarData.length > 0 ?
                  <RadarChart 
                    data={radarData}
                    angleKey="condition"
                    domain={[-1, 1]}
                    radars={radarChartRadars}
                  />
                  : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">Select one stock to view Radar. Run an analysis.</div>
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
                        <p>This tool shows the historical performance of a chosen pair of trading strategies (Condition_1 and Condition_2, each selected via single-select dropdown) for a selected stock, based on a chosen metric.</p>
                        <ul><li><strong>X-axis:</strong> Represents different historical points (labeled as History 0, History 1, etc.).</li><li><strong>Y-axis:</strong> Displays the values of the chosen metric.</li><li><strong>Purpose:</strong> Tracks the performance of the strategy pair over time for the stock.</li></ul>
                        <hr className="my-4" />
                        <h4>Metric vs Stock Bar Graph</h4>
                        <p>This tool shows the performance of a chosen pair of trading strategies (Condition_1 and Condition_2, each selected via single-select dropdown) across multiple stocks at a given historical point, adjustable via slider.</p>
                        <ul><li><strong>X-axis:</strong> Lists the stocks.</li><li><strong>Y-axis:</strong> Displays the values of the chosen metric.</li><li><strong>Purpose:</strong> Compares the strategy pair’s effectiveness across different stocks at the selected time.</li></ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            <Card>
              <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                  <CardDescription>Analyze condition pair performance over time or across different stocks.</CardDescription>
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
          
          <TabsContent value="chord">
             <Accordion type="single" collapsible className="w-full mb-4 bg-card/50 px-4 rounded-lg border border-border/50">
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-accent" /><span>How to use the Chord Diagram</span></div></AccordionTrigger>
                  <AccordionContent><div className="prose prose-sm max-w-none text-muted-foreground prose-strong:text-foreground/90 prose-headings:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-1"><p>This tool helps you see at a glance how pairs of trading strategies, selected from a pool of strategies, perform for a chosen stock based on a single metric at a specific historical point.</p><ul><li><strong>Arcs:</strong> Each arc on the diagram’s circumference represents a trading strategy from the selected pool (3–6 strategies, chosen via multi-select dropdown).</li><li><strong>Bands:</strong> Each band connecting two arcs shows the performance of the pair of strategies, with thickness indicating performance strength for the chosen metric at the historical point set by the slider.</li><li><strong>Purpose:</strong> Visualizes the relative performance of strategy pairs for the selected stock.</li></ul></div></AccordionContent>
                </AccordionItem>
              </Accordion>
            <Card>
              <CardHeader>
                <CardTitle>Pairwise Synergy</CardTitle>
                <CardDescription>Visualize performance synergy between conditions for a selected stock (3-6 conditions needed).</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> :
                  <ChordDiagram data={getChordData()} />
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    
