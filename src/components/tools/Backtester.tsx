
"use client";

import { useState } from 'react';
import Select from 'react-select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { conditionMapIdName, tickerMap } from '@/components/tools/single/components/Mappings';
import { runBacktest } from '@/api/tools';
import type { BacktestResult } from '@/api/tools';

// Type definitions for this component
type StringSelectOption = { value: string; label: string };
type NumberSelectOption = { value: number; label: string };

const stockOptions: StringSelectOption[] = Object.entries(tickerMap).map(([value, label]) => ({ value, label }));
const conditionOptions: NumberSelectOption[] = Object.entries(conditionMapIdName).map(([value, label]) => ({ value: parseInt(value.slice(1)), label }));
const tickerSizeOptions: StringSelectOption[] = [
    { value: '1d', label: '1 Day' },
    { value: '1wk', label: '1 Week' },
    { value: '1mo', label: '1 Month' },
];

const metricLabels: { key: keyof BacktestResult; label: string }[] = [
    { key: 'sharpe_ratio', label: 'Sharpe Ratio' },
    { key: 'profitable_trades', label: 'Profitable Trades' },
    { key: 'loss_trades', label: 'Loss Trades' },
    { key: 'total_return', label: 'Total Returns (%)' },
    { key: 'avg_daily_return', label: 'Average Daily Return (%)' },
    { key: 'max_drawdown', label: 'Max Drawdown (%)' },
    { key: 'winning_percentage', label: 'Winning Percentage (%)' },
];

export default function Backtester() {
    const [stock, setStock] = useState<StringSelectOption>(stockOptions[0]);
    const [conditions, setConditions] = useState<readonly NumberSelectOption[]>([]);
    const [tickerSize, setTickerSize] = useState<string>('1d');
    const [duration, setDuration] = useState<number>(365);
    const [brokerage, setBrokerage] = useState<number>(0.05);
    const [stoploss, setStoploss] = useState<number>(2);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<BacktestResult | null>(null);

    const reactSelectStyles = {
        control: (base: any) => ({...base, background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))'}),
        menu: (base: any) => ({...base, background: 'hsl(var(--background))', zIndex: 10}),
        option: (base: any, state: any) => ({...base, background: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--background))', color: state.isFocused ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))', cursor: 'pointer' }),
        multiValue: (base: any) => ({...base, background: 'hsl(var(--secondary))'}),
        multiValueLabel: (base: any) => ({...base, color: 'hsl(var(--secondary-foreground))'}),
    };
    
    const handleRunBacktest = async () => {
        setError(null);
        if (conditions.length === 0) {
            setError('Please select at least one condition.');
            return;
        }

        setIsLoading(true);
        setResults(null);

        const input = {
            stock_name: stock.value,
            condition_indices: conditions.map(c => c.value),
            ticker_size: tickerSize,
            duration,
            brokerage,
            stoploss
        };

        try {
            const data = await runBacktest(input);
            setResults(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to run backtest. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Backtester Configuration</CardTitle>
                        <CardDescription>Set up your strategy parameters to run a historical test.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Stock</Label>
                            <Select
                                options={stockOptions}
                                value={stock}
                                onChange={(o) => setStock(o!)}
                                styles={reactSelectStyles}
                                className="text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Conditions (Strategies)</Label>
                            <Select
                                isMulti
                                options={conditionOptions}
                                value={conditions}
                                onChange={(o) => setConditions(o as readonly NumberSelectOption[])}
                                styles={reactSelectStyles}
                                className="text-sm"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Ticker Size</Label>
                            <ShadSelect value={tickerSize} onValueChange={setTickerSize}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {tickerSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </ShadSelect>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (days)</Label>
                            <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)} min="1" />
                        </div>
                        <div className="space-y-2">
                            <Label>Brokerage (%): {brokerage.toFixed(2)}</Label>
                            <Slider value={[brokerage]} onValueChange={(v) => setBrokerage(v[0])} max={5} step={0.01} />
                        </div>
                        <div className="space-y-2">
                            <Label>Stoploss (%): {stoploss.toFixed(2)}</Label>
                            <Slider value={[stoploss]} onValueChange={(v) => setStoploss(v[0])} max={20} step={0.1} />
                        </div>
                        
                        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                        <Button onClick={handleRunBacktest} className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Running...' : 'Run Backtest'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="min-h-[500px]">
                    <CardHeader>
                        <CardTitle>Backtest Results</CardTitle>
                        <CardDescription>Performance metrics for your selected strategy.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="flex items-center justify-center h-80">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        {!isLoading && !results && (
                            <div className="flex items-center justify-center h-80 text-muted-foreground">
                                <p>Configure and run a backtest to see the results here.</p>
                            </div>
                        )}
                        {results && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">Metric</TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {metricLabels.map(({ key, label }) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium">{label}</TableCell>
                                            <TableCell>{typeof results[key] === 'number' ? results[key].toFixed(4) : results[key]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
