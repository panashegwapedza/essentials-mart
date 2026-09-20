import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';
import type { HouseholdNeed } from './household-needs-engine';

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
  needs: HouseholdNeed[] = [],
  now = new Date(),
): PersonalisationResult {
  const needsByProduct = new Map<string, HouseholdNeed[]>();
  for (const need of needs) {
    if (!need.productId) continue;
    const values = needsByProduct.get(need.productId) ?? [];
    values.push(need);
    needsByProduct.set(need.productId, values);
  }

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
      const matchingNeeds = needsByProduct.get(signal.productId) ?? [];
      const needBoost = matchingNeeds.some(need => need.priority === 'high')
        ? 0.2
        : matchingNeeds.length
          ? 0.1
          : 0;
      const relevance = clampConfidence(
        frequencyFactor * 0.35 +
          recencyFactor * 0.25 +
          consistencyFactor * 0.2 +
          needBoost,
      );

      const needReason = matchingNeeds[0]?.reason;
      return {
        productId: signal.productId,
        productName: signal.productName,
        relevance,
        reason: needReason
          ? needReason + ' This product is also established in household purchase history.'
          : 'Relevant because this household has purchased it ' +
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
      [
        ...signals.map(signal => signal.signalId),
        ...needs.map(need => need.needId),
      ],
      now,
    ),
  };
}
