import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type HouseholdNeed = {
  needId: string;
  type: 'pantry-replenishment' | 'recurring-purchase-due' | 'shopping-list-item';
  productId: string | null;
  productName: string | null;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  source: 'pantry' | 'purchase-history' | 'shopping-list';
  confidence?: number;
  expectedAt?: string;
  quantity?: number;
};

export type HouseholdNeedsResult = {
  needs: HouseholdNeed[];
  summary: {
    total: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    pantryReplenishment: number;
    recurringDue: number;
    shoppingListOpen: number;
  };
  trace: IntelligenceTrace;
};

export function generateHouseholdNeeds(needs: HouseholdNeed[]): HouseholdNeedsResult {
  const normalised = needs.map(need => ({
    ...need,
    confidence: need.confidence === undefined ? undefined : clampConfidence(need.confidence),
  })).sort((a,b) => {
    const rank = { high: 0, medium: 1, low: 2 };
    return rank[a.priority] - rank[b.priority];
  }).slice(0, 100);

  return {
    needs: normalised,
    summary: {
      total: normalised.length,
      highPriority: normalised.filter(n => n.priority === 'high').length,
      mediumPriority: normalised.filter(n => n.priority === 'medium').length,
      lowPriority: normalised.filter(n => n.priority === 'low').length,
      pantryReplenishment: normalised.filter(n => n.type === 'pantry-replenishment').length,
      recurringDue: normalised.filter(n => n.type === 'recurring-purchase-due').length,
      shoppingListOpen: normalised.filter(n => n.type === 'shopping-list-item').length,
    },
    trace: createTrace(
      'household-needs-agent.v1',
      'household-needs-engine.v1',
      'interpretation-only',
      normalised.map(n => n.needId),
    ),
  };
}
