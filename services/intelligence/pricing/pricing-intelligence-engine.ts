import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type PricingProduct = {
  id: string;
  name: string;
  category: string | null;
  productFamily: string | null;
  brand: string | null;
  sizeLabel: string | null;
  price: number;
  currency: string;
  available: boolean;
};

export type PricingSignal = {
  productId: string;
  currentPrice: number;
  currency: string;
  source: 'catalogue';
};

export type PricingInsight = {
  productId: string;
  productName: string;
  currentPrice: number;
  currency: string;
  familyAveragePrice: number | null;
  familyPriceIndex: number | null;
  position: 'below-family-average' | 'near-family-average' | 'above-family-average' | 'no-comparison';
  reason: string;
  confidence: number;
};

export type PricingIntelligenceResult = {
  insights: PricingInsight[];
  summary: {
    itemCount: number;
    belowFamilyAverageCount: number;
    nearFamilyAverageCount: number;
    aboveFamilyAverageCount: number;
    comparisonCount: number;
  };
  trace: IntelligenceTrace;
};

export function generatePricingIntelligence(products: PricingProduct[]): PricingIntelligenceResult {
  const active = products.filter((p) => p.available && Number.isFinite(p.price) && p.price >= 0);
  const groups = new Map<string, PricingProduct[]>();

  for (const product of active) {
    const key = (product.productFamily || product.category || product.name).trim().toLowerCase();
    const group = groups.get(key) ?? [];
    group.push(product);
    groups.set(key, group);
  }

  const insights = active.slice(0, 500).map((product) => {
    const key = (product.productFamily || product.category || product.name).trim().toLowerCase();
    const peers = (groups.get(key) ?? []).filter((peer) => peer.currency === product.currency && peer.id !== product.id);
    const average = peers.length ? peers.reduce((sum, peer) => sum + peer.price, 0) / peers.length : null;
    const index = average && average > 0 ? product.price / average : null;
    const position = index === null
      ? 'no-comparison'
      : index < 0.95
        ? 'below-family-average'
        : index > 1.05
          ? 'above-family-average'
          : 'near-family-average';
    const reason = index === null
      ? 'No same-currency comparison products are currently available.'
      : position === 'below-family-average'
        ? 'The current catalogue price is below the observed family average.'
        : position === 'above-family-average'
          ? 'The current catalogue price is above the observed family average.'
          : 'The current catalogue price is close to the observed family average.';

    return {
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      currency: product.currency,
      familyAveragePrice: average === null ? null : Number(average.toFixed(2)),
      familyPriceIndex: index === null ? null : Number(index.toFixed(3)),
      position,
      reason,
      confidence: clampConfidence(peers.length >= 2 ? 0.9 : peers.length === 1 ? 0.7 : 0.4),
    };
  });

  return {
    insights,
    summary: {
      itemCount: insights.length,
      belowFamilyAverageCount: insights.filter((x) => x.position === 'below-family-average').length,
      nearFamilyAverageCount: insights.filter((x) => x.position === 'near-family-average').length,
      aboveFamilyAverageCount: insights.filter((x) => x.position === 'above-family-average').length,
      comparisonCount: insights.filter((x) => x.familyAveragePrice !== null).length,
    },
    trace: createTrace(
      'pricing-intelligence-agent.v1',
      'pricing-intelligence-engine.v1',
      'recommendation-only',
      insights.map((x) => `pricing:${x.productId}`),
    ),
  };
}
