
import type { Metric } from '@/types/single-evaluator';

interface MetricInfo {
    key: Metric;
    label: string;
}

export const METRICS: MetricInfo[] = [
    { key: 'sharpe_ratio', label: 'Sharpe Ratio' },
    { key: 'total_return', label: 'Total Return (%)' },
    { key: 'winning_percentage', label: 'Winning Percentage (%)' },
    { key: 'max_drawdown', label: 'Max Drawdown (%)' },
    { key: 'profitable_trades', label: 'Profitable Trades' },
    { key: 'loss_trades', label: 'Losing Trades' },
    { key: 'avg_daily_return', label: 'Avg. Daily Return (%)' },
];
