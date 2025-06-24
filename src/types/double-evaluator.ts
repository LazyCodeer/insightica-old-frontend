
export type Metric = 'sharpe_ratio' | 'profitable_trades' | 'loss_trades' | 'total_return' | 'avg_daily_return' | 'max_drawdown' | 'winning_percentage';

export interface StockData {
    sharpe_ratio: number;
    profitable_trades: number;
    loss_trades: number;
    total_return: number;
    avg_daily_return: number;
    max_drawdown: number;
    winning_percentage: number;
}

export interface ConditionPairContent {
    [stock: string]: StockData;
}

export interface ConditionPairData {
    [conditionPairKey: string]: ConditionPairContent;
}

export interface DoubleEvaluatorData {
    [historyKey: string]: ConditionPairData;
}
