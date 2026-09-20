import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';
import type { HouseholdNeed } from './household-needs-engine';

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
  needs: HouseholdNeed[] = [],
  now = new Date(),
): PredictionResult {
  const nowMs = now.getTime();
  const predictions = new Map<string, Prediction>();

  for (const signal of signals) {
    if (
      !signal.productId ||
      signal.purchaseCount < 2 ||
      signal.averageIntervalDays <= 0 ||
      signal.averageIntervalDays > 90 ||
      signal.confidence < 0.5
    ) continue;

    const expectedMs = Date.parse(signal.lastObservedAt) + signal.averageIntervalDays * 86_400_000;
    if (!Number.isFinite(expectedMs)) continue;

    const horizonDays = Math.max(0, (expectedMs - nowMs) / 86_400_000);
    predictions.set(signal.productId, {
      predictionId: 'household-next-purchase:' + signal.productId + ':' + signal.lastObservedAt,
      type: 'next-purchase',
      productId: signal.productId,
      productName: signal.productName,
      predictedAt: now.toISOString(),
      expectedAt: new Date(expectedMs).toISOString(),
      horizonDays: Number(horizonDays.toFixed(1)),
      confidence: clampConfidence(signal.confidence),
      basis:
        'Observed ' + signal.purchaseCount +
        ' purchases with an average interval of ' + signal.averageIntervalDays +
        ' days and average quantity ' + signal.averageQuantity + '.',
      authority: 'prediction-only',
    });
  }

  for (const need of needs) {
    if (need.type !== 'recurring-purchase-due' || !need.productId || !need.expectedAt) continue;
    const expectedMs = Date.parse(need.expectedAt);
    if (!Number.isFinite(expectedMs)) continue;
    const existing = predictions.get(need.productId);
    const signal = signals.find(item => item.productId === need.productId);
    const confidence = clampConfidence(need.confidence ?? signal?.confidence ?? 0.8);
    if (existing && Date.parse(existing.expectedAt) <= expectedMs) continue;

    predictions.set(need.productId, {
      predictionId: 'household-need-prediction:' + need.needId,
      type: 'next-purchase',
      productId: need.productId,
      productName: need.productName ?? signal?.productName ?? need.productId,
      predictedAt: now.toISOString(),
      expectedAt: new Date(expectedMs).toISOString(),
      horizonDays: Number(Math.max(0, (expectedMs - nowMs) / 86_400_000).toFixed(1)),
      confidence,
      basis: need.reason,
      authority: 'prediction-only',
    });
  }

  const result = [...predictions.values()]
    .sort((a, b) => a.horizonDays - b.horizonDays || b.confidence - a.confidence)
    .slice(0, 50);

  return {
    predictions: result,
    trace: createTrace(
      'household-prediction-agent.v1',
      'household-prediction-engine.v1',
      'prediction-only',
      [...new Set([
        ...signals.map(signal => signal.signalId),
        ...needs.filter(need => need.type === 'recurring-purchase-due').map(need => need.needId),
      ])],
      now,
    ),
  };
}
