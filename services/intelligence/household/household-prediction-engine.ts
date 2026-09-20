import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type PredictionSignal = {
  signalId: string;
  type: 'recurring-purchase' | 'consumption';
  productId: string;
  productName: string;
  purchaseCount: number;
  averageQuantity: number;
  averageIntervalDays: number;
  lastObservedAt: string;
  confidence: number;
};

export type Prediction = {
  predictionId: string;
  type: 'next-purchase';
  productId: string;
  productName: string;
  predictedAt: string;
  expectedAt: string;
  horizonDays: number;
  confidence: number;
  basis: string;
  authority: 'prediction-only';
};

export type PredictionResult = {
  predictions: Prediction[];
  trace: IntelligenceTrace;
};

export function generateHouseholdPredictions(
  signals: PredictionSignal[],
  now = new Date(),
): PredictionResult {
  const nowMs = now.getTime();

  const predictions = signals
    .filter(
      signal =>
        signal.productId &&
        signal.purchaseCount >= 2 &&
        signal.averageIntervalDays > 0 &&
        signal.averageIntervalDays <= 90 &&
        signal.confidence >= 0.5,
    )
    .map(signal => {
      const expectedMs =
        Date.parse(signal.lastObservedAt) +
        signal.averageIntervalDays * 86_400_000;
      const horizonDays = Math.max(0, (expectedMs - nowMs) / 86_400_000);

      return {
        predictionId:
          'household-next-purchase:' +
          signal.productId +
          ':' +
          signal.lastObservedAt,
        type: 'next-purchase' as const,
        productId: signal.productId,
        productName: signal.productName,
        predictedAt: now.toISOString(),
        expectedAt: new Date(expectedMs).toISOString(),
        horizonDays: Number(horizonDays.toFixed(1)),
        confidence: clampConfidence(signal.confidence),
        basis:
          'Observed ' +
          signal.purchaseCount +
          ' purchases with an average interval of ' +
          signal.averageIntervalDays +
          ' days and average quantity ' +
          signal.averageQuantity +
          '.',
        authority: 'prediction-only' as const,
      };
    })
    .sort((a, b) => a.horizonDays - b.horizonDays || b.confidence - a.confidence)
    .slice(0, 50);

  return {
    predictions,
    trace: createTrace(
      'household-prediction-agent.v1',
      'household-prediction-engine.v1',
      'prediction-only',
      signals.map(signal => signal.signalId),
      now,
    ),
  };
}
