
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

import { runSingleAnalyzer, ProcessedSingleAnalyzerOutput } from '@/api/tools';
import type { StockMetrics } from '@/api/tools';
import { conditionMapIdName, tickerMap } from '@/components/tools/single/components/Mappings';
import { METRICS } from '@/lib/constants';

import { Heatmap } from '@/components/charts/Heatmap';
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

  // Control states
  const [tickerSize] = useState('1d'); // Fixed for now
  const [selectedStocks, setSelectedStocks] = useState<readonly StringSelectOption[]>([stockOptions[0]]);
  const [selectedConditions, setSelectedConditions] = useState<readonly NumberSelectOption[]>([conditionOptions[0], conditionOptions[1]]);
  const [selectedMetric, setSelectedMetric] = useState<Metric>('sharpe_ratio');
  const [duration, setDuration] = useState<number>(30);
  
  // Data states
  const [analysisData, setAnalysisData] = useState<ProcessedSingleAnalyzerOutput>({});

  const handleRunAnalysis = async () => {
    if (selectedStocks.length === 0 || selectedConditions.length === 0) {
      setError("Please select at least one stock and one condition.");
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

  const getHeatmapData = () => {
    const data: { stock: string; condition: string; value: number }[] = [];
    selectedConditions.forEach(cond => {
        selectedStocks.forEach(stock => {
            const stockData = analysisData[stock.value];
            if (stockData && stockData[String(cond.value)] && stockData[String(cond.value)][selectedMetric] !== undefined) {
                data.push({
                    stock: stock.label,
                    condition: cond.label,
                    value: stockData[String(cond.value)][selectedMetric]
                });
            }
        });
    });
    return data;
  }

  const getRadarData = () => {
    if (selectedStocks.length === 0) return [];
    const stock = selectedStocks[0];
    const data: any[] = [];
    const stockData = analysisData[stock.value];
    if (stockData) {
        selectedConditions.forEach(cond => {
            if (stockData[String(cond.value)]) {
                data.push({
                    condition: cond.label,
                    ...stockData[String(cond.value)]
                });
            }
        });
    }
    return data;
  }

  const getLeaderboardData = () => {
    if (selectedStocks.length === 0 || !analysisData[selectedStocks[0].value]) return [];
    const stock = selectedStocks[0];
    const stockData = analysisData[stock.value];
      
    return Object.entries(stockData)
      .map(([condId, metrics]) => ({
          condition: conditionMapIdName[`c${condId}`] || `c${condId}`,
          value: metrics[selectedMetric]
      }))
      .filter(item => item.value !== undefined)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Single Condition Evaluator</CardTitle>
        <CardDescription>Analyze the historical performance of individual trading conditions across various stocks and metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg mb-6">
            <div className="space-y-2">
                <Label>Stocks (Select 1 for Radar/Leaderboard)</Label>
                <Select isMulti options={stockOptions} value={selectedStocks} onChange={(o) => setSelectedStocks(o as readonly StringSelectOption[])} styles={reactSelectStyles}/>
            </div>
            <div className="space-y-2">
                <Label>Conditions</Label>
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
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap">
            <Card className="mt-4">
              <CardHeader><CardTitle>Heatmap Analysis</CardTitle><CardDescription>Compare performance of conditions across stocks for the selected metric.</CardDescription></CardHeader>
              <CardContent>
                {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : 
                 getHeatmapData().length > 0 ? <Heatmap data={getHeatmapData()} xAxisKey="stock" yAxisKey="condition" valueKey="value" /> : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">No data to display. Run an analysis.</div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radar">
             <Card className="mt-4">
              <CardHeader><CardTitle>Metrics Overview Radar</CardTitle><CardDescription>Holistic view of all metrics for selected conditions on the first selected stock.</CardDescription></CardHeader>
              <CardContent>
                 {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> :
                  getRadarData().length > 0 ?
                  <RadarChart 
                    data={getRadarData()}
                    angleKey="condition"
                    domain={[-2.5, 5]}
                    radars={[
                        { name: 'Sharpe Ratio', dataKey: 'sharpe_ratio', stroke: 'hsl(var(--chart-1))', fill: 'hsl(var(--chart-1))'},
                        { name: 'Total Return', dataKey: 'total_return', stroke: 'hsl(var(--chart-2))', fill: 'hsl(var(--chart-2))'},
                        { name: 'Winning %', dataKey: 'winning_percentage', stroke: 'hsl(var(--chart-3))', fill: 'hsl(var(--chart-3))'},
                    ]}
                  /> : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">Select one stock to view Radar. Run an analysis.</div>
                 }
              </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="mt-4">
                <CardHeader><CardTitle>Top Conditions Leaderboard</CardTitle><CardDescription>Top 10 performing conditions for the first selected stock and metric.</CardDescription></CardHeader>
                <CardContent>
                    {isLoading ? <div className="flex justify-center items-center h-80"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> :
                     getLeaderboardData() && getLeaderboardData().length > 0 ? <BarGraph data={getLeaderboardData()} xAxisKey="condition" yAxisKey="value" /> : <div className="text-center h-80 flex items-center justify-center text-muted-foreground">Select one stock to view Leaderboard. Run an analysis.</div>
                    }
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}
