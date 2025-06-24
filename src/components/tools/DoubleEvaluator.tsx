
"use client";

import { useState } from 'react';
import Select from 'react-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { runDoubleAnalyzer } from '@/api/tools';
import type { StockMetrics } from '@/api/tools';
import { conditionMapIdName, tickerMap } from '@/components/tools/single/components/Mappings';
import { METRICS } from '@/lib/constants';

import { Heatmap } from '@/components/charts/Heatmap';
import { RadarChart } from '@/components/charts/RadarChart';
import { ChordDiagram } from '@/components/charts/ChordDiagram';

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

export default function DoubleEvaluator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Control states
  const [tickerSize] = useState('1d');
  const [selectedStocks, setSelectedStocks] = useState<readonly StringSelectOption[]>([stockOptions[0]]);
  const [selectedConditions, setSelectedConditions] = useState<readonly NumberSelectOption[]>([conditionOptions[0], conditionOptions[1], conditionOptions[2]]);
  const [selectedMetric, setSelectedMetric] = useState<Metric>('sharpe_ratio');
  const [duration, setDuration] = useState<number>(30);
  
  // Data states
  const [analysisData, setAnalysisData] = useState<Record<string, Record<string, StockMetrics>>>({});

  const handleRunAnalysis = async () => {
    if (selectedStocks.length === 0 || selectedConditions.length < 2) {
      setError("Please select at least one stock and two conditions.");
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
      
      const response = await runDoubleAnalyzer(input);
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

  const getHeatmapData = () => {
    const data: { stock: string; condition: string; value: number }[] = [];
    const conditionIds = selectedConditions.map(c => c.value);
    
    selectedStocks.forEach(stock => {
      const stockData = analysisData[stock.value];
      if (stockData) {
        for (let i = 0; i < conditionIds.length; i++) {
          for (let j = i + 1; j < conditionIds.length; j++) {
            const pairKey = getPairKey(conditionIds[i], conditionIds[j]);
            if (stockData[pairKey] && stockData[pairKey][selectedMetric] !== undefined) {
              const cond1Label = conditionOptions.find(c => c.value === conditionIds[i])?.label || '';
              const cond2Label = conditionOptions.find(c => c.value === conditionIds[j])?.label || '';
              data.push({
                  stock: stock.label,
                  condition: `${cond1Label.substring(0,5)} + ${cond2Label.substring(0,8)}`,
                  value: stockData[pairKey][selectedMetric]
              });
            }
          }
        }
      }
    });
    return data;
  }

  const getRadarData = () => {
    if (selectedStocks.length === 0) return [];
    const stock = selectedStocks[0];
    const stockData = analysisData[stock.value];
    if (!stockData) return [];

    const data: any[] = [];
    const conditionIds = selectedConditions.map(c => c.value);

    for (let i = 0; i < conditionIds.length; i++) {
      for (let j = i + 1; j < conditionIds.length; j++) {
        const pairKey = getPairKey(conditionIds[i], conditionIds[j]);
        if (stockData[pairKey]) {
          const cond1Label = conditionOptions.find(c => c.value === conditionIds[i])?.label || '';
          const cond2Label = conditionOptions.find(c => c.value === conditionIds[j])?.label || '';
          data.push({
              condition: `${cond1Label.substring(0,10)} & ${cond2Label.substring(0,10)}`,
              ...stockData[pairKey]
          });
        }
      }
    }
    return data;
  }
  
  const getChordData = () => {
      if (selectedStocks.length === 0 || selectedConditions.length < 3) return undefined;
      const stock = selectedStocks[0];
      const stockData = analysisData[stock.value];
      if (!stockData) return undefined;
      
      const conditions = selectedConditions;
      const matrix: number[][] = Array(conditions.length).fill(0).map(() => Array(conditions.length).fill(0));
      const names = conditions.map(c => c.label);

      for (let i = 0; i < conditions.length; i++) {
          for (let j = i; j < conditions.length; j++) {
              if (i === j) continue;
              const pairKey = getPairKey(conditions[i].value, conditions[j].value);
              let value = 0;
              if (stockData[pairKey] && stockData[pairKey][selectedMetric] !== undefined) {
                  value = stockData[pairKey][selectedMetric];
              }
              matrix[i][j] = Math.max(0, value); 
              matrix[j][i] = Math.max(0, value);
          }
      }
      return { matrix, names };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Double Condition Evaluator</CardTitle>
        <CardDescription>Analyze the historical performance of condition pairs across stocks and metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg mb-6">
            <div className="space-y-2">
                <Label>Stocks (Select 1 for Radar/Chord)</Label>
                <Select isMulti options={stockOptions} value={selectedStocks} onChange={(o) => setSelectedStocks(o as readonly StringSelectOption[])} styles={reactSelectStyles}/>
            </div>
            <div className="space-y-2">
                <Label>Conditions (Min 2)</Label>
                <Select isMulti options={conditionOptions} value={selectedConditions} onChange={(o) => setSelectedConditions(o as readonly NumberSelectOption[])} styles={reactSelectStyles}/>
            </div>
            <div className="space-y-2">
                <Label>Metric</Label>
                <ShadSelect value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as Metric)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{metricOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </ShadSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)} min="1" />
            </div>
        </div>
        <Button onClick={handleRunAnalysis} disabled={isLoading} className="w-full mb-6">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Run Analysis
        </Button>
        {error && <p className="text-sm font-medium text-destructive text-center mb-4">{error}</p>}

        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 h-auto p-1">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="radar">Metrics Overview</TabsTrigger>
            <TabsTrigger value="chord">Pairwise Synergy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="heatmap">
            <Card className="mt-4">
              <CardHeader><CardTitle>Pairwise Heatmap</CardTitle><CardDescription>Performance of condition pairs across stocks.</CardDescription></CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : 
                  getHeatmapData().length > 0 ? <Heatmap data={getHeatmapData()} xAxisKey="stock" yAxisKey="condition" valueKey="value" /> : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">No data to display. Run an analysis.</div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radar">
            <Card className="mt-4">
              <CardHeader><CardTitle>Pair Metrics Overview</CardTitle><CardDescription>Holistic view of all metrics for selected pairs on the first selected stock.</CardDescription></CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : 
                  getRadarData().length > 0 ?
                  <RadarChart data={getRadarData()} angleKey="condition" domain={[-2.5, 5]} radars={[ { name: 'Sharpe Ratio', dataKey: 'sharpe_ratio', stroke: 'hsl(var(--chart-1))', fill: 'hsl(var(--chart-1))' }, { name: 'Total Return', dataKey: 'total_return', stroke: 'hsl(var(--chart-2))', fill: 'hsl(var(--chart-2))' }, { name: 'Winning %', dataKey: 'winning_percentage', stroke: 'hsl(var(--chart-3))', fill: 'hsl(var(--chart-3))' } ]}/>
                  : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">Select one stock to view Radar. Run an analysis.</div>
                }
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chord">
            <Card className="mt-4">
              <CardHeader><CardTitle>Pairwise Synergy</CardTitle><CardDescription>Visualize performance synergy between conditions for the first selected stock.</CardDescription></CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> :
                  getChordData() ? <ChordDiagram data={getChordData()} /> : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">Select 3-6 conditions and one stock for Chord diagram. Run analysis.</div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
