import { clampConfidence, createTrace, type IntelligenceTrace } from '../core/intelligence-contracts';

export type CommerceActionProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: boolean;
};

export type CommerceActionInventory = {
  productId: string;
  quantity: number;
  reservedQuantity: number;
};

export type CommerceActionRequest = {
  productId: string;
  requestedQuantity?: number;
};

export type CommerceAction = {
  productId: string;
  productName: string;
  requestedQuantity: number;
  permittedQuantity: number;
  availableQuantity: number;
  canAdd: boolean;
  reason: string;
  confidence: number;
};

export type CommerceActionResult = {
  actions: CommerceAction[];
  trace: IntelligenceTrace;
};

export function prepareCommerceActions(
  requests: CommerceActionRequest[],
  catalogue: CommerceActionProduct[],
  inventory: CommerceActionInventory[],
): CommerceActionResult {
  const products = new Map(catalogue.filter((product) => product.available).map((product) => [product.id, product]));
  const stock = new Map(
    inventory.map((row) => [
      row.productId,
      Math.max(0, Number(row.quantity) - Number(row.reservedQuantity)),
    ]),
  );

  const actions = requests
    .slice(0, 100)
    .map((request) => {
      const product = products.get(request.productId);
      const availableQuantity = stock.get(request.productId) ?? 0;
      const requestedQuantity = Math.max(1, Math.min(100, Math.floor(request.requestedQuantity ?? 1)));

      if (!product) {
        return {
          productId: request.productId,
          productName: 'Unknown product',
          requestedQuantity,
          permittedQuantity: 0,
          availableQuantity,
          canAdd: false,
          reason: 'Product is not currently available in the authoritative catalogue.',
          confidence: 0,
        };
      }

      const permittedQuantity = Math.min(requestedQuantity, availableQuantity);
      const canAdd = permittedQuantity > 0;
      const reason = canAdd
        ? permittedQuantity < requestedQuantity
          ? `Only ${permittedQuantity} of ${requestedQuantity} requested units are currently available.`
          : 'Product and requested quantity are currently available.'
        : 'The product has no available quantity after reservations.';

      return {
        productId: product.id,
        productName: product.name,
        requestedQuantity,
        permittedQuantity,
        availableQuantity,
        canAdd,
        reason,
        confidence: clampConfidence(canAdd ? 1 : 0),
      };
    });

  return {
    actions,
    trace: createTrace(
      'commerce-action-agent.v1',
      'commerce-action-engine.v1',
      'recommendation-only',
      actions.map((action) => `commerce-action:${action.productId}`),
    ),
  };
}
