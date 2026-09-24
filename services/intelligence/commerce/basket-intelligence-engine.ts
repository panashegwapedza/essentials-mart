import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type BasketIntelligenceItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  availableQuantity: number;
  status: 'healthy' | 'low-stock' | 'out-of-stock' | 'over-stocked' | 'invalid';
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
    invalidCount: number;
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

function finiteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function generateBasketIntelligence(
  basket: BasketIntelligenceBasketItem[],
  catalogue: BasketIntelligenceProduct[],
  inventory: BasketIntelligenceInventory[],
): BasketIntelligenceResult {
  const products = new Map(catalogue.map((product) => [product.id, product]));
  const stock = new Map(
    inventory.map((row) => [
      row.productId,
      Math.max(0, finiteNumber(row.quantity) - finiteNumber(row.reservedQuantity)),
    ]),
  );

  const items = basket.slice(0, 100).map((line) => {
    const product = products.get(line.productId);
    const availableQuantity = stock.get(line.productId) ?? 0;
    const rawQuantity = Number(line.quantity);
    const quantityValid = Number.isFinite(rawQuantity) && Number.isInteger(rawQuantity) && rawQuantity > 0;
    const quantity = quantityValid ? rawQuantity : 0;
    const productUnavailable = !product || !product.available;
    const currencyMismatch = Boolean(product && line.currency !== product.currency);
    const unitPrice = Number(line.unitPrice);
    const cataloguePrice = product ? Number(product.price) : NaN;
    const priceValid =
      !product ||
      (Number.isFinite(unitPrice) && Number.isFinite(cataloguePrice));
    const priceMismatch = Boolean(
      product &&
      priceValid &&
      Math.abs(unitPrice - cataloguePrice) > 0.000001,
    );
    const invalid =
      !quantityValid ||
      currencyMismatch ||
      !priceValid ||
      priceMismatch;

    const status: BasketIntelligenceItem['status'] =
      invalid ? 'invalid' :
      productUnavailable || availableQuantity <= 0 ? 'out-of-stock' :
      quantity > availableQuantity + 20 ? 'over-stocked' :
      quantity > availableQuantity ? 'low-stock' : 'healthy';

    const issue =
      !quantityValid ? 'Basket quantity must be a positive whole number.' :
      !product ? 'Product is no longer present in the authoritative catalogue.' :
      !product.available ? 'Product is currently unavailable.' :
      !priceValid ? 'Basket price must be a finite number.' :
      currencyMismatch ? `Basket currency ${line.currency} does not match the catalogue currency ${product.currency}.` :
      priceMismatch ? `Basket price ${Number(line.unitPrice)} does not match the current catalogue price ${Number(product.price)}.` :
      availableQuantity <= 0 ? 'There is no available stock after reservations.' :
      quantity > availableQuantity ? `Basket requests ${quantity} units but only ${availableQuantity} are currently available.` :
      null;

    return {
      productId: line.productId,
      productName: product?.name ?? 'Unknown product',
      quantity,
      unitPrice: finiteNumber(unitPrice),
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
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      healthyCount: items.filter((item) => item.status === 'healthy').length,
      lowStockCount: items.filter((item) => item.status === 'low-stock').length,
      outOfStockCount: items.filter((item) => item.status === 'out-of-stock').length,
      overRequestedCount: items.filter((item) => item.status === 'over-stocked').length,
      invalidCount: items.filter((item) => item.status === 'invalid').length,
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
