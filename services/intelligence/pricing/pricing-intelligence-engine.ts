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
  normalizedUnitPrice: number | null;
  normalizedUnit: 'L' | 'kg' | null;
  position: 'below-family-average' | 'near-family-average' | 'above-family-average' | 'no-comparison';
  reason: string;
  confidence: number;
};

export type PricingContext = { productIds?: string[]; basketProductIds?: string[] };

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

function parseNormalizedSize(label: string | null): { value: number; unit: 'L' | 'kg' } | null {
  if (!label) return null;
  const match = label.trim().toLowerCase().match(/([0-9]+(?:\\.[0-9]+)?)\\s*(ml|l|g|kg)\\b/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (match[2] === 'ml') return { value: value / 1000, unit: 'L' };
  if (match[2] === 'l') return { value, unit: 'L' };
  if (match[2] === 'g') return { value: value / 1000, unit: 'kg' };
  return { value, unit: 'kg' };
}

export function generatePricingIntelligence(products: PricingProduct[], context: PricingContext = {}): PricingIntelligenceResult {
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
    const size = parseNormalizedSize(product.sizeLabel);
    const productUnitPrice = size ? product.price / size.value : null;
    const peers = (groups.get(key) ?? []).filter((peer) => {
      if (peer.currency !== product.currency || peer.id === product.id) return false;
      const peerSize = parseNormalizedSize(peer.sizeLabel);
      return size && peerSize ? peerSize.unit === size.unit : !size && !peerSize;
    });
    const peerUnitPrices = peers.map((peer) => {
      const peerSize = parseNormalizedSize(peer.sizeLabel);
      return peerSize ? peer.price / peerSize.value : peer.price;
    });
    const average = peerUnitPrices.length ? peerUnitPrices.reduce((sum, price) => sum + price, 0) / peerUnitPrices.length : null;
    const index = average && average > 0 && productUnitPrice !== null ? productUnitPrice / average : null;
    const position = index === null
      ? 'no-comparison'
      : index < 0.95
        ? 'below-family-average'
        : index > 1.05
          ? 'above-family-average'
          : 'near-family-average';
    const inContext = new Set([...(context.productIds ?? []), ...(context.basketProductIds ?? [])]).has(product.id);
    const inContext = new Set([...(context.productIds ?? []), ...(context.basketProductIds ?? [])]).has(product.id);
    const reason = index === null
      ? (inContext ? 'No same-currency comparison products are currently available for this household-relevant product.' : 'No same-currency comparison products are currently available.')
      : position === 'below-family-average'
        ? (inContext ? 'This household-relevant product is priced below the observed family average per normalized unit.' : 'The current catalogue price is below the observed family average per normalized unit.')
        : position === 'above-family-average'
          ? (inContext ? 'This household-relevant product is priced above the observed family average per normalized unit.' : 'The current catalogue price is above the observed family average per normalized unit.')
          : (inContext ? 'This household-relevant product is close to the observed family average per normalized unit.' : 'The current catalogue price is close to the observed family average per normalized unit.');

    return {
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      currency: product.currency,
      familyAveragePrice: average === null ? null : Number(average.toFixed(2)),
      familyPriceIndex: index === null ? null : Number(index.toFixed(3)),
      normalizedUnitPrice: productUnitPrice === null ? null : Number(productUnitPrice.toFixed(3)),
      normalizedUnit: size?.unit ?? null,
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
