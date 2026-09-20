import { understandSearchQuery, type SearchInterpretation } from './search/search-intelligence-engine';
import { generateHouseholdRecommendations, type CatalogueProduct, type HouseholdSignal, type RecommendationCandidate } from './household/household-recommendation-engine';

export type IntelligenceRequest =
  | { capability: 'search-understanding'; query: string; vocabulary?: string[] }
  | { capability: 'household-recommendations'; signals: HouseholdSignal[]; catalogue: CatalogueProduct[] };

export type IntelligenceResponse =
  | (SearchInterpretation & { trace: { agentId: 'catalogue-search-agent.v1'; authority: 'interpretation-only' } })
  | { recommendations: RecommendationCandidate[]; trace: { agentId: 'household-recommendation-agent.v1'; engineId: 'household-recommendation-engine.v1'; authority: 'recommendation-only' } };

export function runAISociety(request: IntelligenceRequest): IntelligenceResponse {
  if (request.capability === 'search-understanding') {
    return { ...understandSearchQuery(request.query, request.vocabulary), trace: { agentId: 'catalogue-search-agent.v1', authority: 'interpretation-only' } };
  }
  if (request.capability === 'household-recommendations') {
    return { recommendations: generateHouseholdRecommendations(request.signals, request.catalogue), trace: { agentId: 'household-recommendation-agent.v1', engineId: 'household-recommendation-engine.v1', authority: 'recommendation-only' } };
  }
  throw new Error('Unsupported AI Society capability.');
}
