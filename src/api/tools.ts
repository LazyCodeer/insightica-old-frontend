
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
type SingleAnalyzerAPIOutput = HistoricalData;

// This is the processed data the component will use. Maps stock name to condition metrics.
export type ProcessedSingleAnalyzerOutput = Record<string, Record<string, StockMetrics>>;


export const runSingleAnalyzer = async (input: SingleAnalyzerInput): Promise<ProcessedSingleAnalyzerOutput> => {
  const response = await apiClient.post<SingleAnalyzerAPIOutput>('/tools/single_condition_analyzer/', input);
  const historicalData = response.data;
  
  const processedData: ProcessedSingleAnalyzerOutput = {};
  
  const historyKeys = Object.keys(historicalData);
  
  if (historyKeys.length === 0) {
    return {};
  }

  // Initialize processedData structure and sum metrics from all history entries
  input.stock_names.forEach(stockName => {
    processedData[stockName] = {};
    input.condition_ids.forEach(conditionId => {
      const totals: StockMetrics & { count: number } = {
        sharpe_ratio: 0, profitable_trades: 0, loss_trades: 0, total_return: 0,
        avg_daily_return: 0, max_drawdown: 0, winning_percentage: 0, count: 0,
      };

      const conditionKey = `condition_${conditionId}`;

      historyKeys.forEach(historyKey => {
        const metrics = historicalData[historyKey]?.[conditionKey]?.[stockName];
        if (metrics) {
          totals.count++;
          totals.sharpe_ratio += metrics.sharpe_ratio;
          totals.profitable_trades += metrics.profitable_trades;
          totals.loss_trades += metrics.loss_trades;
          totals.total_return += metrics.total_return;
          totals.avg_daily_return += metrics.avg_daily_return;
          totals.max_drawdown += metrics.max_drawdown;
          totals.winning_percentage += metrics.winning_percentage;
        }
      });
      
      // Average the metrics
      if (totals.count > 0) {
        processedData[stockName][String(conditionId)] = {
          sharpe_ratio: totals.sharpe_ratio / totals.count,
          profitable_trades: totals.profitable_trades / totals.count,
          loss_trades: totals.loss_trades / totals.count,
          total_return: totals.total_return / totals.count,
          avg_daily_return: totals.avg_daily_return / totals.count,
          max_drawdown: totals.max_drawdown / totals.count,
          winning_percentage: totals.winning_percentage / totals.count,
        };
      }
    });
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
type DoubleAnalyzerAPIOutput = HistoricalData;

// This is the processed data the component will use. Maps stock name to condition pair metrics.
export type ProcessedDoubleAnalyzerOutput = Record<string, Record<string, StockMetrics>>;

export const runDoubleAnalyzer = async (input: DoubleAnalyzerInput): Promise<ProcessedDoubleAnalyzerOutput> => {
  const response = await apiClient.post<DoubleAnalyzerAPIOutput>('/tools/double_condition_analyzer/', input);
  const historicalData = response.data;
  
  const processedData: ProcessedDoubleAnalyzerOutput = {};
  const historyKeys = Object.keys(historicalData);
  
  if (historyKeys.length === 0) {
    return {};
  }
  
  const conditionPairs: { backendKey: string; frontendKey: string }[] = [];
  for (let i = 0; i < input.condition_ids.length; i++) {
    for (let j = i + 1; j < input.condition_ids.length; j++) {
      const id1 = input.condition_ids[i];
      const id2 = input.condition_ids[j];
      const minId = Math.min(id1, id2);
      const maxId = Math.max(id1, id2);
      // Backend returns keys like `condition_1_2`
      conditionPairs.push({
          backendKey: `condition_${minId}_${maxId}`,
          frontendKey: `${minId}-${maxId}`
      });
    }
  }

  // Initialize processedData structure and sum metrics from all history entries
  input.stock_names.forEach(stockName => {
    processedData[stockName] = {};
    conditionPairs.forEach(({ backendKey, frontendKey }) => {
      const totals: StockMetrics & { count: number } = {
        sharpe_ratio: 0, profitable_trades: 0, loss_trades: 0, total_return: 0,
        avg_daily_return: 0, max_drawdown: 0, winning_percentage: 0, count: 0,
      };

      historyKeys.forEach(historyKey => {
        const metrics = historicalData[historyKey]?.[backendKey]?.[stockName];
        if (metrics) {
          totals.count++;
          totals.sharpe_ratio += metrics.sharpe_ratio;
          totals.profitable_trades += metrics.profitable_trades;
          totals.loss_trades += metrics.loss_trades;
          totals.total_return += metrics.total_return;
          totals.avg_daily_return += metrics.avg_daily_return;
          totals.max_drawdown += metrics.max_drawdown;
          totals.winning_percentage += metrics.winning_percentage;
        }
      });
      
      // Average the metrics
      if (totals.count > 0) {
        processedData[stockName][frontendKey] = {
          sharpe_ratio: totals.sharpe_ratio / totals.count,
          profitable_trades: totals.profitable_trades / totals.count,
          loss_trades: totals.loss_trades / totals.count,
          total_return: totals.total_return / totals.count,
          avg_daily_return: totals.avg_daily_return / totals.count,
          max_drawdown: totals.max_drawdown / totals.count,
          winning_percentage: totals.winning_percentage / totals.count,
        };
      }
    });
  });

  return processedData;
};
