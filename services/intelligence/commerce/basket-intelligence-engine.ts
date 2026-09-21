import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type BasketIntelligenceItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  availableQuantity: number;
  status: 'healthy' | 'low-stock' | 'out-of-stock' | 'over-stocked';
  issue: string | null;
  confidence: number;
};

export type BasketIntelligenceResult = {
  items: BasketIntelligenceItem[];
  summary: {
    itemCount: number;
    healthyCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    overRequestedCount: number;
    estimatedSubtotal: number;
    currency: string | null;
  };
  trace: IntelligenceTrace;
};

export type BasketIntelligenceProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: boolean;
};

export type BasketIntelligenceInventory = {
  productId: string;
  quantity: number;
  reservedQuantity: number;
};

export type BasketIntelligenceBasketItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
};

export function generateBasketIntelligence(
  basket: BasketIntelligenceBasketItem[],
  catalogue: BasketIntelligenceProduct[],
  inventory: BasketIntelligenceInventory[],
): BasketIntelligenceResult {
  const products = new Map(catalogue.map((product) => [product.id, product]));
  const stock = new Map(
    inventory.map((row) => [
      row.productId,
      Math.max(0, Number(row.quantity) - Number(row.reservedQuantity)),
    ]),
  );

  const items = basket.slice(0, 100).map((line) => {
    const product = products.get(line.productId);
    const availableQuantity = stock.get(line.productId) ?? 0;
    const quantity = Math.max(0, Math.floor(Number(line.quantity) || 0));
    const status =
      availableQuantity <= 0 ? 'out-of-stock' :
      quantity > availableQuantity ? 'low-stock' :
      quantity > availableQuantity + 20 ? 'over-stocked' : 'healthy';
    const issue =
      !product ? 'Product is no longer present in the authoritative catalogue.' :
      !product.available ? 'Product is currently unavailable.' :
      availableQuantity <= 0 ? 'There is no available stock after reservations.' :
      quantity > availableQuantity ? `Basket requests ${quantity} units but only ${availableQuantity} are currently available.` :
      null;

    return {
      productId: line.productId,
      productName: product?.name ?? 'Unknown product',
      quantity,
      unitPrice: Number(line.unitPrice) || 0,
      currency: line.currency,
      availableQuantity,
      status,
      issue,
      confidence: clampConfidence(product && product.available ? 1 : 0),
    };
  });

  const estimatedSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const currency = items[0]?.currency ?? null;

  return {
    items,
    summary: {
      itemCount: items.length,
      healthyCount: items.filter((item) => item.status === 'healthy').length,
      lowStockCount: items.filter((item) => item.status === 'low-stock').length,
      outOfStockCount: items.filter((item) => item.status === 'out-of-stock').length,
      overRequestedCount: items.filter((item) => item.status === 'over-stocked').length,
      estimatedSubtotal,
      currency,
    },
    trace: createTrace(
      'basket-intelligence-agent.v1',
      'basket-intelligence-engine.v1',
      'recommendation-only',
      items.map((item) => `basket-item:${item.productId}`),
    ),
  };
}
