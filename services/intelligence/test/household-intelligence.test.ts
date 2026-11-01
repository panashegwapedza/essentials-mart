import test from 'node:test';
import assert from 'node:assert/strict';
import { generateHouseholdNeeds } from '../household/household-needs-engine.ts';
import { generateHouseholdPredictions } from '../household/household-prediction-engine.ts';
import { generateHouseholdRecommendations } from '../household/household-recommendation-engine.ts';
import { generateHouseholdPersonalisation } from '../household/household-personalisation-engine.ts';
import { generateHouseholdIntelligence } from '../core/household-intelligence-orchestrator.ts';

const now = new Date('2026-10-02T00:00:00.000Z');

const signal = {
  productId: 'p1',
  productName: 'Milk',
  purchaseCount: 3,
  averageQuantity: 2,
  averageIntervalDays: 7,
  lastPurchasedAt: '2026-09-28T00:00:00.000Z',
  nextExpectedAt: '2026-10-05T00:00:00.000Z',
  confidence: 0.9,
  classification: 'recurring' as const,
};

test('household needs are normalised, prioritised, and summarised', () => {
  const result = generateHouseholdNeeds([
    {
      needId: 'low',
      type: 'pantry-replenishment',
      productId: 'p2',
      productName: 'Rice',
      priority: 'low',
      reason: 'Low stock',
      source: 'pantry',
      confidence: 0.7,
    },
    {
      needId: 'high',
      type: 'recurring-purchase-due',
      productId: 'p1',
      productName: 'Milk',
      priority: 'high',
      reason: 'Due',
      source: 'purchase-history',
      confidence: 0.9,
      expectedAt: '2026-10-01T00:00:00.000Z',
    },
  ]);

  assert.equal(result.needs[0].needId, 'high');
  assert.equal(result.summary.total, 2);
  assert.equal(result.summary.highPriority, 1);
  assert.equal(result.summary.recurringDue, 1);
});

test('household predictions calculate the next purchase from observed cadence', () => {
  const result = generateHouseholdPredictions(
    [{
      signalId: 's1',
      type: 'recurring-purchase',
      productId: 'p1',
      productName: 'Milk',
      purchaseCount: 3,
      averageQuantity: 2,
      averageIntervalDays: 7,
      lastObservedAt: '2026-09-28T00:00:00.000Z',
      confidence: 0.9,
    }],
    [],
    now,
  );

  assert.equal(result.predictions.length, 1);
  assert.equal(result.predictions[0].expectedAt, '2026-10-05T00:00:00.000Z');
  assert.equal(result.predictions[0].authority, 'prediction-only');
});

test('household recommendations honour active catalogue and recommendation-only authority', () => {
  const result = generateHouseholdRecommendations(
    [signal],
    [{ id: 'p1', name: 'Milk', is_active: true }],
    [{
      needId: 'recurring:p1',
      type: 'recurring-purchase-due',
      productId: 'p1',
      productName: 'Milk',
      priority: 'high',
      reason: 'Observed purchase pattern is due.',
      source: 'purchase-history',
      confidence: 0.9,
      expectedAt: '2026-10-01T00:00:00.000Z',
      quantity: 2,
    }],
    now,
  );

  assert.equal(result.recommendations.length, 1);
  assert.equal(result.recommendations[0].suggestedQuantity, 2);
  assert.equal(result.recommendations[0].authority, 'recommendation-only');
});

test('household personalisation ranks recent, repeated purchases', () => {
  const result = generateHouseholdPersonalisation([{
    signalId: 's1',
    productId: 'p1',
    productName: 'Milk',
    purchaseCount: 4,
    averageQuantity: 2,
    averageIntervalDays: 7,
    confidence: 0.9,
    lastObservedAt: '2026-09-28T00:00:00.000Z',
  }], [], now);

  assert.equal(result.products.length, 1);
  assert.ok(result.products[0].relevance > 0.5);
});

test('household intelligence orchestrator composes bounded engines without granting action authority', () => {
  const result = generateHouseholdIntelligence({
    needs: [{
      needId: 'recurring:p1',
      type: 'recurring-purchase-due',
      productId: 'p1',
      productName: 'Milk',
      priority: 'high',
      reason: 'Due from purchase history.',
      source: 'purchase-history',
      confidence: 0.9,
      expectedAt: '2026-10-01T00:00:00.000Z',
      quantity: 2,
    }],
    householdSignals: [signal],
    catalogue: [{ id: 'p1', name: 'Milk', is_active: true }],
    predictionSignals: [{
      signalId: 's1',
      type: 'recurring-purchase',
      productId: 'p1',
      productName: 'Milk',
      purchaseCount: 3,
      averageQuantity: 2,
      averageIntervalDays: 7,
      lastObservedAt: '2026-09-28T00:00:00.000Z',
      confidence: 0.9,
    }],
    personalisationSignals: [{
      signalId: 's1',
      productId: 'p1',
      productName: 'Milk',
      purchaseCount: 3,
      averageQuantity: 2,
      averageIntervalDays: 7,
      confidence: 0.9,
      lastObservedAt: '2026-09-28T00:00:00.000Z',
    }],
    inventorySignals: [],
    substitutionSignals: [],
    substitutionProducts: [],
    substitutionInventory: [],
  }, now);

  assert.equal(result.householdNeeds.summary.highPriority, 1);
  assert.equal(result.recommendations.recommendations[0].authority, 'recommendation-only');
  assert.equal(result.predictions.predictions[0].authority, 'prediction-only');
  assert.ok(result.intelligenceLayer.items.some(item => item.productId === 'p1'));
});


import { generateInventorySubstitutions } from '../inventory/inventory-substitution-engine.ts';

test('inventory substitutions are only generated for low or out-of-stock signals', () => {
  const products = [
    { id: 'p1', name: 'Milk Original', category: 'Dairy', product_family: 'Milk', brand: 'A', variant_label: 'Full cream', size_label: '1L', price: 2, currency: 'USD', is_active: true },
    { id: 'p2', name: 'Milk Alternative', category: 'Dairy', product_family: 'Milk', brand: 'B', variant_label: 'Full cream', size_label: '1L', price: 2.1, currency: 'USD', is_active: true },
  ];
  const inventory = [
    { productId: 'p1', storeId: 'store-1', quantity: 20, reservedQuantity: 0 },
    { productId: 'p2', storeId: 'store-1', quantity: 10, reservedQuantity: 0 },
  ];

  const healthy = generateInventorySubstitutions([{
    signalId: 'healthy-stock',
    productId: 'p1',
    productName: 'Milk Original',
    storeId: 'store-1',
    availableQuantity: 20,
    reason: 'low-stock',
  }], products, inventory, now);
  assert.equal(healthy.substitutions.length, 0);

  const constrained = generateInventorySubstitutions([{
    signalId: 'low-stock',
    productId: 'p1',
    productName: 'Milk Original',
    storeId: 'store-1',
    availableQuantity: 3,
    reason: 'low-stock',
  }], products, inventory, now);
  assert.equal(constrained.substitutions.length, 1);
  assert.equal(constrained.substitutions[0].productId, 'p2');
});
