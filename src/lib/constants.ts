
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

export const NORMALIZATION_MAX_VALUES: Record<Metric, number> = {
    sharpe_ratio: 3,
    total_return: 50,
    winning_percentage: 100,
    max_drawdown: 50,
    profitable_trades: 45,
    loss_trades: 45,
    avg_daily_return: 5,
};
