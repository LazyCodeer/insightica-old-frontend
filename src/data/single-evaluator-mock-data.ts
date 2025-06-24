
import type { EvaluatorData, Metric, StockData, ConditionData } from '@/types/single-evaluator';

const generateMetrics = (): StockData => {
    const profitable_trades = Math.floor(Math.random() * 25) + 5; // 5 to 30
    const loss_trades = Math.floor(Math.random() * 20) + 5; // 5 to 25
    const total_trades = profitable_trades + loss_trades;
    
    // Sharpe Ratio: can be negative. Let's say from -2.5 to 2.5
    const sharpe_ratio = (Math.random() * 5) - 2.5;
    
    // Total Return %: can be negative. -10% to 10%
    const total_return = (Math.random() * 20) - 10;
    
    // Avg Daily Return %: correlated with total return
    const avg_daily_return = total_return / (total_trades * (Math.random() * 0.5 + 0.8));
    
    // Max Drawdown %: always positive (represented as a positive number)
    const max_drawdown = Math.random() * 0.15 + 0.02; // 2% to 17%
    
    const winning_percentage = total_trades > 0 ? (profitable_trades / total_trades) * 100 : 0;

    return {
        sharpe_ratio,
        profitable_trades,
        loss_trades,
        total_return,
        avg_daily_return,
        max_drawdown,
        winning_percentage
    };
};


export const generateMockData = (stockNames: string[], conditionIds: string[]): EvaluatorData => {
    const data: EvaluatorData = {};

    for (let i = 0; i < 100; i++) {
        const historyKey = `history_${i}`;
        const historyData: ConditionData = {};

        conditionIds.forEach(condId => {
            const conditionKey = `c${condId}`;
            const conditionValue: { [stock: string]: StockData } = {};
            
            stockNames.forEach(stockName => {
                conditionValue[stockName] = generateMetrics();
            });
            historyData[conditionKey] = conditionValue;
        });

        data[historyKey] = historyData;
    }

    return data;
};
