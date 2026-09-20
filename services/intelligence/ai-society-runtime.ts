import { understandSearchQuery, type SearchInterpretation } from './search/search-intelligence-engine';
import { generateHouseholdRecommendations, type CatalogueProduct, type HouseholdSignal, type RecommendationResult } from './household/household-recommendation-engine';
import { generateHouseholdPredictions, type PredictionResult, type PredictionSignal } from './household/household-prediction-engine';
import { generateHouseholdPersonalisation, type PersonalisationResult, type PersonalisationSignal } from './household/household-personalisation-engine';

export type IntelligenceRequest =
  | { capability: 'search-understanding'; query: string; vocabulary?: string[] }
  | { capability: 'household-recommendations'; signals: HouseholdSignal[]; catalogue: CatalogueProduct[] }
  | { capability: 'household-predictions'; signals: PredictionSignal[] }
  | { capability: 'household-personalisation'; signals: PersonalisationSignal[] };

export type IntelligenceResponse =
  | (SearchInterpretation & { trace: { agentId: 'catalogue-search-agent.v1'; authority: 'interpretation-only' } })
  | RecommendationResult
  | PredictionResult
  | PersonalisationResult;

export function runAISociety(request: IntelligenceRequest): IntelligenceResponse {
  if (request.capability === 'search-understanding') return { ...understandSearchQuery(request.query, request.vocabulary), trace: { agentId: 'catalogue-search-agent.v1', authority: 'interpretation-only' } };
  if (request.capability === 'household-recommendations') return generateHouseholdRecommendations(request.signals, request.catalogue);
  if (request.capability === 'household-predictions') return generateHouseholdPredictions(request.signals);
  if (request.capability === 'household-personalisation') return generateHouseholdPersonalisation(request.signals);
  throw new Error('Unsupported AI Society capability.');
}
