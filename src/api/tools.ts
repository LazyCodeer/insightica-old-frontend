
import apiClient from '@/lib/apiClient';

// For Single Predictor
interface SinglePredictorInput {
  stock_name: string;
  condition_indices: number[];
  ticker_size: string;
  duration: number;
  what_to_optimise: number;
}

interface SinglePredictorOutput {
  result: Record<string, number>;
}

export const runSinglePredictor = async (input: SinglePredictorInput): Promise<SinglePredictorOutput> => {
  const response = await apiClient.post('/tools/singlepredictor/', input);
  return response.data;
};

// For Backtester
interface BacktestInput {
    stock_name: string;
    condition_indices: number[];
    ticker_size: string;
    duration: number;
    brokerage: number;
    stoploss: number;
}

// This is the structured data the component will use
export interface BacktestResult {
    sharpe_ratio: number;
    profitable_trades: number;
    loss_trades: number;
    total_return: number;
    avg_daily_return: number;
    max_drawdown: number;
    winning_percentage: number;
}

// This is the actual shape of the API response
interface BacktestAPIOutput {
  result: number[];
}

export const runBacktest = async (input: BacktestInput): Promise<BacktestResult> => {
    const response = await apiClient.post<BacktestAPIOutput>('/tools/backtest/', input);
    const resultArray = response.data.result;

    if (!Array.isArray(resultArray) || resultArray.length < 7) {
        throw new Error('Invalid backtest response format from API');
    }

    // The order of metrics in the result array is defined by the backend API:
    // 1. Sharpe Ratio, 2. Profitable Trades, 3. Loss Trades, 4. Total Returns (%), 
    // 5. Average Daily Return (%), 6. Max Drawdown (%), 7. Winning Percentage (%)
    const [
        sharpe_ratio,
        profitable_trades,
        loss_trades,
        total_return,
        avg_daily_return,
        max_drawdown,
        winning_percentage,
    ] = resultArray;

    return {
        sharpe_ratio,
        profitable_trades,
        loss_trades,
        total_return,
        avg_daily_return,
        max_drawdown,
        winning_percentage,
    };
};

// --- New Analyzer APIs ---

// Shared Metrics Interface
export interface StockMetrics {
    sharpe_ratio: number;
    profitable_trades: number;
    loss_trades: number;
    total_return: number;
    avg_daily_return: number;
    max_drawdown: number;
    winning_percentage: number;
}

// For Single Predictor Analyzer
interface SingleAnalyzerInput {
  stock_names: string[];
  condition_ids: number[];
  ticker_size: string;
  duration: number;
}

// The API response body is the historical data.
type HistoricalData = Record<string, Record<string, Record<string, StockMetrics>>>;
export type SingleAnalyzerAPIOutput = HistoricalData;

// This is the processed data the component will use. Maps stock name to condition metrics.
export type ProcessedSingleAnalyzerOutput = Record<string, Record<string, StockMetrics>>;


export const runSingleAnalyzer = async (input: SingleAnalyzerInput): Promise<SingleAnalyzerAPIOutput> => {
  const response = await apiClient.post('/tools/single_condition_analyzer/', input);
  const historicalData = response.data;

  if (!historicalData || typeof historicalData !== 'object') {
    return {};
  }

  const processedData: SingleAnalyzerAPIOutput = {};

  Object.keys(historicalData).forEach(historyKey => {
    const conditionData = historicalData[historyKey];
    processedData[historyKey] = {};
    
    if (conditionData && typeof conditionData === 'object') {
        Object.keys(conditionData).forEach(backendConditionKey => {
            // Assuming backend key is 'condition_1', 'condition_2', etc.
            // We transform it to 'c1', 'c2' for frontend consistency.
            const match = backendConditionKey.match(/^condition_(\d+)$/);
            if (match && match[1]) {
                const conditionId = match[1];
                const frontendConditionKey = `c${conditionId}`;
                processedData[historyKey][frontendConditionKey] = conditionData[backendConditionKey];
            } else {
                 // If it doesn't match the pattern (e.g., already 'c1'), pass it through.
                 processedData[historyKey][backendConditionKey] = conditionData[backendConditionKey];
            }
        });
    }
  });

  return processedData;
};


// For Double Predictor Analyzer
interface DoubleAnalyzerInput {
  stock_names: string[];
  condition_ids: number[];
  ticker_size: string;
  duration: number;
}

// The API response body for double analyzer is also historical data.
export type DoubleAnalyzerAPIOutput = HistoricalData;

// This is the processed data the component will use. It contains the full history.
export type ProcessedDoubleAnalyzerOutput = DoubleAnalyzerAPIOutput;

export const runDoubleAnalyzer = async (input: DoubleAnalyzerInput): Promise<ProcessedDoubleAnalyzerOutput> => {
  const response = await apiClient.post<DoubleAnalyzerAPIOutput>('/tools/double_condition_analyzer/', input);
  const historicalData = response.data;
  
  if (!historicalData || typeof historicalData !== 'object') {
    return {};
  }
  
  const processedData: ProcessedDoubleAnalyzerOutput = {};

  Object.keys(historicalData).forEach(historyKey => {
    const conditionDataForHistory = historicalData[historyKey];
    processedData[historyKey] = {};
    
    if (conditionDataForHistory && typeof conditionDataForHistory === 'object') {
      Object.keys(conditionDataForHistory).forEach(backendConditionPairKey => {
        const stockDataForCondition = conditionDataForHistory[backendConditionPairKey];
        // backendConditionPairKey from API is `condition_1_2`
        // We need to transform it to `1-2` for the component to use with `getPairKey`.
        const match = backendConditionPairKey.match(/^condition_(\d+)_(\d+)$/);
        if (match && match[1] && match[2]) {
          const id1 = parseInt(match[1]);
          const id2 = parseInt(match[2]);
          const frontendKey = `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;
          processedData[historyKey][frontendKey] = stockDataForCondition;
        } else {
          processedData[historyKey][backendConditionPairKey] = stockDataForCondition;
        }
      });
    }
  });

  return processedData;
};
