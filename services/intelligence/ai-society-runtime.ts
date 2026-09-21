import { understandSearchQuery, type SearchInterpretation } from './search/search-intelligence-engine';
import { generateHouseholdRecommendations, type CatalogueProduct, type HouseholdSignal, type RecommendationResult } from './household/household-recommendation-engine';
import { generateHouseholdPredictions, type PredictionResult, type PredictionSignal } from './household/household-prediction-engine';
import { generateHouseholdPersonalisation, type PersonalisationResult, type PersonalisationSignal } from './household/household-personalisation-engine';
import { generateInventoryIntelligence, type InventoryIntelligenceResult, type InventorySignal } from './inventory/inventory-intelligence-engine';
import { generateHouseholdNeeds, type HouseholdNeed, type HouseholdNeedsResult } from './household/household-needs-engine';
import { generateInventorySubstitutions, type SubstitutionProduct, type SubstitutionInventory, type SubstitutionResult, type SubstitutionSignal } from './inventory/inventory-substitution-engine';
import { generateIntelligenceLayer, type IntelligenceLayerInput, type IntelligenceLayerResult } from './core/intelligence-layer-engine';
import { generateHouseholdIntelligence, type HouseholdIntelligenceInput, type HouseholdIntelligenceResult } from './core/household-intelligence-orchestrator';
import { prepareCommerceActions, type CommerceActionRequest, type CommerceActionProduct, type CommerceActionInventory, type CommerceActionResult } from './commerce/commerce-action-engine';
import { generateBasketIntelligence, type BasketIntelligenceBasketItem, type BasketIntelligenceProduct, type BasketIntelligenceInventory, type BasketIntelligenceResult } from './commerce/basket-intelligence-engine';
import { generateDeliveryIntelligence, type DeliveryIntelligenceRequest, type DeliveryIntelligenceResult } from './commerce/delivery-intelligence-engine';

export type IntelligenceRequest =
  | { capability: 'search-understanding'; query: string; vocabulary?: string[] }
  | { capability: 'household-recommendations'; signals: HouseholdSignal[]; catalogue: CatalogueProduct[]; needs?: HouseholdNeed[] }
  | { capability: 'household-predictions'; signals: PredictionSignal[]; needs?: HouseholdNeed[] }
  | { capability: 'household-personalisation'; signals: PersonalisationSignal[]; needs?: HouseholdNeed[] }
  | { capability: 'inventory-intelligence'; signals: InventorySignal[] }
  | { capability: 'household-needs'; needs: HouseholdNeed[] }
  | { capability: 'intelligence-layer'; input: IntelligenceLayerInput }
  | { capability: 'inventory-substitution'; signals: SubstitutionSignal[]; products: SubstitutionProduct[]; inventory: SubstitutionInventory[] }
  | { capability: 'household-intelligence'; input: HouseholdIntelligenceInput }
  | { capability: 'commerce-action-preparation'; requests: CommerceActionRequest[]; catalogue: CommerceActionProduct[]; inventory: CommerceActionInventory[] }
  | { capability: 'basket-intelligence'; basket: BasketIntelligenceBasketItem[]; catalogue: BasketIntelligenceProduct[]; inventory: BasketIntelligenceInventory[] }
  | { capability: 'delivery-intelligence'; input: DeliveryIntelligenceRequest };

export type IntelligenceResponse =
  | (SearchInterpretation & { trace: { agentId: 'catalogue-search-agent.v1'; authority: 'interpretation-only' } })
  | RecommendationResult
  | PredictionResult
  | PersonalisationResult
  | InventoryIntelligenceResult
  | HouseholdNeedsResult
  | IntelligenceLayerResult
  | SubstitutionResult
  | HouseholdIntelligenceResult
  | CommerceActionResult
  | BasketIntelligenceResult
  | DeliveryIntelligenceResult;

export function runAISociety(request: IntelligenceRequest): IntelligenceResponse {
  if (request.capability === 'search-understanding') return { ...understandSearchQuery(request.query, request.vocabulary), trace: { agentId: 'catalogue-search-agent.v1', authority: 'interpretation-only' } };
  if (request.capability === 'household-recommendations') return generateHouseholdRecommendations(request.signals, request.catalogue, request.needs ?? []);
  if (request.capability === 'household-predictions') return generateHouseholdPredictions(request.signals, request.needs ?? []);
  if (request.capability === 'household-personalisation') return generateHouseholdPersonalisation(request.signals, request.needs ?? []);
  if (request.capability === 'inventory-intelligence') return generateInventoryIntelligence(request.signals);
  if (request.capability === 'household-needs') return generateHouseholdNeeds(request.needs);
  if (request.capability === 'intelligence-layer') return generateIntelligenceLayer(request.input);
  if (request.capability === 'inventory-substitution') return generateInventorySubstitutions(request.signals, request.products, request.inventory);
  if (request.capability === 'household-intelligence') return generateHouseholdIntelligence(request.input);
  if (request.capability === 'commerce-action-preparation') return prepareCommerceActions(request.requests, request.catalogue, request.inventory);
  if (request.capability === 'basket-intelligence') return generateBasketIntelligence(request.basket, request.catalogue, request.inventory);
  if (request.capability === 'delivery-intelligence') return generateDeliveryIntelligence(request.input);
  throw new Error('Unsupported AI Society capability.');
}
