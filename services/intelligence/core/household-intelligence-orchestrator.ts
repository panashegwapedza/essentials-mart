import { generateHouseholdNeeds, type HouseholdNeed, type HouseholdNeedsResult } from '../household/household-needs-engine';
import { generateHouseholdRecommendations, type CatalogueProduct, type HouseholdSignal, type RecommendationResult } from '../household/household-recommendation-engine';
import { generateHouseholdPredictions, type PredictionResult, type PredictionSignal } from '../household/household-prediction-engine';
import { generateHouseholdPersonalisation, type PersonalisationResult, type PersonalisationSignal } from '../household/household-personalisation-engine';
import { generateInventoryIntelligence, type InventoryIntelligenceResult, type InventorySignal } from '../inventory/inventory-intelligence-engine';
import { generateInventorySubstitutions, type SubstitutionInventory, type SubstitutionProduct, type SubstitutionResult, type SubstitutionSignal } from '../inventory/inventory-substitution-engine';
import { generateIntelligenceLayer, type IntelligenceLayerResult } from './intelligence-layer-engine';

export type HouseholdIntelligenceInput = {
  needs: HouseholdNeed[];
  householdSignals: HouseholdSignal[];
  catalogue: CatalogueProduct[];
  predictionSignals: PredictionSignal[];
  personalisationSignals: PersonalisationSignal[];
  inventorySignals: InventorySignal[];
  substitutionSignals: SubstitutionSignal[];
  substitutionProducts: SubstitutionProduct[];
  substitutionInventory: SubstitutionInventory[];
};

export type HouseholdIntelligenceResult = {
  householdNeeds: HouseholdNeedsResult;
  recommendations: RecommendationResult;
  predictions: PredictionResult;
  personalisation: PersonalisationResult;
  inventory: InventoryIntelligenceResult;
  substitutions: SubstitutionResult;
  intelligenceLayer: IntelligenceLayerResult;
};

export function generateHouseholdIntelligence(
  input: HouseholdIntelligenceInput,
  now = new Date(),
): HouseholdIntelligenceResult {
  // The Society owns the execution sequence. Engines remain specialised and bounded.
  const householdNeeds = generateHouseholdNeeds(input.needs, now);
  const recommendations = generateHouseholdRecommendations(input.householdSignals, input.catalogue, householdNeeds.needs, now);
  const predictions = generateHouseholdPredictions(input.predictionSignals, householdNeeds.needs, now);
  const personalisation = generateHouseholdPersonalisation(input.personalisationSignals, householdNeeds.needs, now);
  const inventory = generateInventoryIntelligence(input.inventorySignals, now);

  const substitutions = generateInventorySubstitutions(
    input.substitutionSignals,
    input.substitutionProducts,
    input.substitutionInventory,
    now,
  );

  const intelligenceLayer = generateIntelligenceLayer({
    needs: householdNeeds.needs,
    recommendations: recommendations.recommendations,
    predictions: predictions.predictions,
    personalisation: personalisation.products,
    inventory: inventory.insights,
  }, now);

  return {
    householdNeeds,
    recommendations,
    predictions,
    personalisation,
    inventory,
    substitutions,
    intelligenceLayer,
  };
}
