import { clampConfidence, createTrace, type IntelligenceTrace } from './intelligence-contracts';

export type IntelligenceLayerItem = {
  productId: string;
  productName: string;
  priority: 'high' | 'medium' | 'low';
  relevance: number;
  sources: Array<'need' | 'recommendation' | 'prediction' | 'personalisation' | 'inventory'>;
};

export type IntelligenceLayerInput = {
  needs: Array<{ needId: string; productId: string | null; productName: string | null; priority: 'high' | 'medium' | 'low' }>;
  recommendations: Array<{ productId: string; productName: string; priority: 'high' | 'medium' | 'low'; confidence: number }>;
  predictions: Array<{ productId: string; productName: string; confidence: number; predictedAt: string }>;
  personalisation: Array<{ productId: string; productName: string; relevance: number }>;
  inventory: Array<{ productId: string; productName: string; type: 'out-of-stock' | 'low-stock' | 'healthy-stock'; confidence: number }>;
};

export type IntelligenceLayerResult = {
  items: IntelligenceLayerItem[];
  summary: {
    highPriorityCount: number;
    needCount: number;
    recommendationCount: number;
    predictionCount: number;
    personalisationCount: number;
    inventoryIssueCount: number;
    crossSignalProductCount: number;
  };
  trace: IntelligenceTrace;
};

export function generateIntelligenceLayer(
  input: IntelligenceLayerInput,
  now = new Date(),
): IntelligenceLayerResult {
  const byProduct = new Map<string, IntelligenceLayerItem>();

  const add = (
    productId: string,
    productName: string,
    source: IntelligenceLayerItem['sources'][number],
    priority: IntelligenceLayerItem['priority'],
    relevance: number,
  ) => {
    if (!productId) return;
    const existing = byProduct.get(productId);
    if (!existing) {
      byProduct.set(productId, {
        productId,
        productName,
        priority,
        relevance: clampConfidence(relevance),
        sources: [source],
      });
      return;
    }
    if (!existing.sources.includes(source)) existing.sources.push(source);
    if (priority === 'high' || (priority === 'medium' && existing.priority === 'low')) existing.priority = priority;
    existing.relevance = clampConfidence(Math.max(existing.relevance, relevance));
  };

  for (const need of input.needs) {
    if (need.productId) add(need.productId, need.productName ?? need.productId, 'need', need.priority, need.priority === 'high' ? 1 : 0.75);
  }
  for (const item of input.recommendations) add(item.productId, item.productName, 'recommendation', item.priority, item.confidence);
  for (const item of input.predictions) add(item.productId, item.productName, 'prediction', 'medium', item.confidence);
  for (const item of input.personalisation) add(item.productId, item.productName, 'personalisation', 'low', item.relevance);
  for (const item of input.inventory) {
    if (item.type !== 'healthy-stock') {
      add(item.productId, item.productName, 'inventory', item.type === 'out-of-stock' ? 'high' : 'medium', item.confidence);
    }
  }

  const items = [...byProduct.values()]
    .sort((a, b) => {
      const priorityRank = { high: 3, medium: 2, low: 1 };
      return priorityRank[b.priority] - priorityRank[a.priority] || b.relevance - a.relevance;
    })
    .slice(0, 50);

  const crossSignalProductCount = items.filter(item => item.sources.length >= 2).length;
  return {
    items,
    summary: {
      highPriorityCount: items.filter(item => item.priority === 'high').length,
      needCount: input.needs.length,
      recommendationCount: input.recommendations.length,
      predictionCount: input.predictions.length,
      personalisationCount: input.personalisation.length,
      inventoryIssueCount: input.inventory.filter(item => item.type !== 'healthy-stock').length,
      crossSignalProductCount,
    },
    trace: createTrace(
      'intelligence-layer-agent.v1',
      'intelligence-layer-engine.v1',
      'recommendation-only',
      [
        ...input.needs.map(item => item.needId),
        ...input.recommendations.map(item => item.productId),
        ...input.predictions.map(item => item.productId),
        ...input.personalisation.map(item => item.productId),
        ...input.inventory.filter(item => item.type !== 'healthy-stock').map(item => item.productId),
      ],
      now,
    ),
  };
}
