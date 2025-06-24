
import type { DoubleEvaluatorData, ConditionPairData, StockData } from '@/types/double-evaluator';

const generateMetrics = (): StockData => {
    const profitable_trades = Math.floor(Math.random() * 25) + 5;
    const loss_trades = Math.floor(Math.random() * 20) + 5;
    const total_trades = profitable_trades + loss_trades;
    
    const sharpe_ratio = (Math.random() * 5) - 2.5;
    const total_return = (Math.random() * 20) - 10;
    const avg_daily_return = total_return / (total_trades * (Math.random() * 0.5 + 0.8));
    const max_drawdown = Math.random() * 0.15 + 0.02;
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

export const generateMockData = (stockNames: string[], conditionIds: string[]): DoubleEvaluatorData => {
    const data: DoubleEvaluatorData = {};

    const conditionPairs: string[] = [];
    for (let i = 0; i < conditionIds.length; i++) {
        for (let j = i + 1; j < conditionIds.length; j++) {
            const id1 = parseInt(conditionIds[i]);
            const id2 = parseInt(conditionIds[j]);
            conditionPairs.push(`c${Math.min(id1, id2)}_${Math.max(id1, id2)}`);
        }
    }

    for (let i = 0; i < 100; i++) {
        const historyKey = `history_${i}`;
        const historyData: ConditionPairData = {};

        conditionPairs.forEach(pairKey => {
            const pairValue: { [stock: string]: StockData } = {};
            
            stockNames.forEach(stockName => {
                pairValue[stockName] = generateMetrics();
            });
            historyData[pairKey] = pairValue;
        });

        data[historyKey] = historyData;
    }

    return data;
};
