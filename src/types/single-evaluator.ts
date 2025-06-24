
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

export interface ConditionContent {
    [stock: string]: StockData;
}

export interface ConditionData {
    [conditionKey: string]: ConditionContent;
}

export interface EvaluatorData {
    [historyKey: string]: ConditionData;
}
