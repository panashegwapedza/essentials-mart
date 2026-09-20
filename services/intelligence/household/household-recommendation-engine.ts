export type HouseholdSignal = {
  productId: string | null;
  productName: string;
  purchaseCount: number;
  averageQuantity: number;
  averageIntervalDays: number;
  lastPurchasedAt: string;
  nextExpectedAt: string;
  confidence: number;
  classification: 'recurring' | 'emerging';
};

export type RecommendationCandidate = {
  recommendationId: string;
  type: 'replenishment';
  productId: string;
  productName: string;
  suggestedQuantity: number;
  reason: string;
  signal: {
    source: 'household-purchase-history';
    purchaseCount: number;
    averageIntervalDays: number;
    nextExpectedAt: string;
  };
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  authority: 'recommendation-only';
};

export type CatalogueProduct = { id: string; name: string; is_active: boolean };

export function generateHouseholdRecommendations(signals: HouseholdSignal[], catalogue: CatalogueProduct[], now = new Date()): RecommendationCandidate[] {
  const byId = new Map(catalogue.filter(p => p.is_active).map(p => [p.id, p]));
  const timestamp = now.getTime();
  return signals
    .filter(s => s.productId && s.confidence >= 0.65 && s.averageIntervalDays > 0)
    .map(signal => {
      const product = byId.get(signal.productId!);
      if (!product) return null;
      const daysUntilExpected = (Date.parse(signal.nextExpectedAt) - timestamp) / 86400000;
      const priority: RecommendationCandidate['priority'] = daysUntilExpected <= 0 ? 'high' : daysUntilExpected <= 7 ? 'medium' : 'low';
      return {
        recommendationId: `household-replenishment:${signal.productId}:${signal.lastPurchasedAt}`,
        type: 'replenishment',
        productId: product.id,
        productName: product.name,
        suggestedQuantity: Math.max(1, Math.round(signal.averageQuantity)),
        reason: `Purchased ${signal.purchaseCount} times with an average interval of ${signal.averageIntervalDays} days.`,
        signal: { source: 'household-purchase-history', purchaseCount: signal.purchaseCount, averageIntervalDays: signal.averageIntervalDays, nextExpectedAt: signal.nextExpectedAt },
        confidence: Number(Math.max(0, Math.min(1, signal.confidence)).toFixed(2)),
        priority,
        authority: 'recommendation-only',
      };
    })
    .filter((item): item is RecommendationCandidate => item !== null)
    .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority] || b.confidence - a.confidence))
    .slice(0, 20);
}
