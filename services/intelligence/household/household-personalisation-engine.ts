import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type PersonalisationSignal = {
  signalId: string;
  productId: string;
  productName: string;
  purchaseCount: number;
  averageQuantity: number;
  averageIntervalDays: number;
  confidence: number;
  lastObservedAt: string;
};

export type PersonalisedProduct = {
  productId: string;
  productName: string;
  relevance: number;
  reason: string;
  sourceSignalId: string;
};

export type PersonalisationResult = {
  products: PersonalisedProduct[];
  trace: IntelligenceTrace;
};

export function generateHouseholdPersonalisation(
  signals: PersonalisationSignal[],
  now = new Date(),
): PersonalisationResult {
  const products = signals
    .filter(signal => signal.productId && signal.confidence >= 0.5)
    .map(signal => {
      const recencyDays = Math.max(
        0,
        (now.getTime() - Date.parse(signal.lastObservedAt)) / 86_400_000,
      );
      const recencyFactor = Math.max(0, 1 - recencyDays / 90);
      const frequencyFactor = Math.min(1, signal.purchaseCount / 6);
      const consistencyFactor = Math.min(1, signal.confidence);
      const relevance = clampConfidence(
        frequencyFactor * 0.4 +
          recencyFactor * 0.3 +
          consistencyFactor * 0.3,
      );

      return {
        productId: signal.productId,
        productName: signal.productName,
        relevance,
        reason:
          'Relevant because this household has purchased it ' +
          signal.purchaseCount +
          ' times, with an average quantity of ' +
          signal.averageQuantity +
          '.',
        sourceSignalId: signal.signalId,
      };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 20);

  return {
    products,
    trace: createTrace(
      'household-personalisation-agent.v1',
      'household-personalisation-engine.v1',
      'recommendation-only',
      signals.map(signal => signal.signalId),
      now,
    ),
  };
}
