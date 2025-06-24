'use server';

/**
 * @fileOverview An AI agent to generate performance benchmarks for technical indicators.
 *
 * - generateIndicatorPerformance - A function that handles the generation of indicator performance benchmarks.
 * - GenerateIndicatorPerformanceInput - The input type for the generateIndicatorPerformance function.
 * - GenerateIndicatorPerformanceOutput - The return type for the generateIndicatorPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIndicatorPerformanceInputSchema = z.object({
  stockTicker: z.string().describe('The stock ticker symbol to analyze.'),
  timeframe: z.string().describe('The timeframe for the historical data (e.g., 1d, 1w, 1mo).'),
  indicators: z.array(z.string()).describe('An array of technical indicators to evaluate (e.g., RSI, MACD).'),
  evaluationParameters: z
    .string()
    .optional()
    .describe('Optional parameters to customize the evaluation (e.g., overbought/oversold levels).'),
});

export type GenerateIndicatorPerformanceInput = z.infer<typeof GenerateIndicatorPerformanceInputSchema>;

const GenerateIndicatorPerformanceOutputSchema = z.object({
  analysisResults: z.string().describe('Detailed analysis of the indicator performance, including benchmarks and comparisons.'),
});

export type GenerateIndicatorPerformanceOutput = z.infer<typeof GenerateIndicatorPerformanceOutputSchema>;

export async function generateIndicatorPerformance(
  input: GenerateIndicatorPerformanceInput
): Promise<GenerateIndicatorPerformanceOutput> {
  return generateIndicatorPerformanceFlow(input);
}

const generateIndicatorPerformancePrompt = ai.definePrompt({
  name: 'generateIndicatorPerformancePrompt',
  input: {schema: GenerateIndicatorPerformanceInputSchema},
  output: {schema: GenerateIndicatorPerformanceOutputSchema},
  prompt: `You are an expert financial analyst specializing in evaluating the performance of technical indicators.

You will use historical market data to generate performance benchmarks for the specified technical indicators for a given stock and timeframe. You will compare the performance of different indicators and combinations, providing clear data-backed insights.

Stock Ticker: {{{stockTicker}}}
Timeframe: {{{timeframe}}}
Indicators: {{#each indicators}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Evaluation Parameters: {{{evaluationParameters}}}

Analyze the historical performance of these indicators for the given stock and timeframe, providing a detailed analysis of their effectiveness. Compare the indicators against each other and identify any complementary combinations. Return the analysis in a clear and concise manner.
`,
});

const generateIndicatorPerformanceFlow = ai.defineFlow(
  {
    name: 'generateIndicatorPerformanceFlow',
    inputSchema: GenerateIndicatorPerformanceInputSchema,
    outputSchema: GenerateIndicatorPerformanceOutputSchema,
  },
  async input => {
    const {output} = await generateIndicatorPerformancePrompt(input);
    return output!;
  }
);
