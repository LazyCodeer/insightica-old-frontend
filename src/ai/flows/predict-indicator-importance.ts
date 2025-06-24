'use server';

/**
 * @fileOverview Predicts the relative importance of technical indicators for trading parameters.
 *
 * - predictIndicatorImportance - Predicts indicator importance based on input parameters.
 * - PredictIndicatorImportanceInput - Input type for predictIndicatorImportance.
 * - PredictIndicatorImportanceOutput - Output type for predictIndicatorImportance.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictIndicatorImportanceInputSchema = z.object({
  tradingParameters: z
    .string()
    .describe('The specific trading parameters for which to predict indicator importance.'),
});
export type PredictIndicatorImportanceInput = z.infer<typeof PredictIndicatorImportanceInputSchema>;

const IndicatorPredictionSchema = z.object({
  indicator: z.string().describe('The name of the technical indicator.'),
  importanceScore: z.number().describe('A score indicating the relative importance of the indicator.'),
  confidenceScore: z.number().describe('The confidence score for the prediction.'),
  recommendation: z.string().describe('A recommendation for using this indicator based on its predicted importance.'),
});

const PredictIndicatorImportanceOutputSchema = z.object({
  predictions: z.array(IndicatorPredictionSchema).describe(
    'An array of predictions for the relative importance of technical indicators, with confidence scores and recommendations.'
  ),
});
export type PredictIndicatorImportanceOutput = z.infer<typeof PredictIndicatorImportanceOutputSchema>;

export async function predictIndicatorImportance(
  input: PredictIndicatorImportanceInput
): Promise<PredictIndicatorImportanceOutput> {
  return predictIndicatorImportanceFlow(input);
}

const predictIndicatorImportancePrompt = ai.definePrompt({
  name: 'predictIndicatorImportancePrompt',
  input: {schema: PredictIndicatorImportanceInputSchema},
  output: {schema: PredictIndicatorImportanceOutputSchema},
  prompt: `You are an expert in financial technical analysis. Given the following trading parameters, predict the relative importance of various technical indicators.

Trading Parameters: {{{tradingParameters}}}

Provide a confidence score for each prediction and a recommendation for using the indicator.

Output should be structured as a JSON array of indicator predictions, including the indicator name, importance score, confidence score, and a recommendation.`,
});

const predictIndicatorImportanceFlow = ai.defineFlow(
  {
    name: 'predictIndicatorImportanceFlow',
    inputSchema: PredictIndicatorImportanceInputSchema,
    outputSchema: PredictIndicatorImportanceOutputSchema,
  },
  async input => {
    const {output} = await predictIndicatorImportancePrompt(input);
    return output!;
  }
);
