import type { Basket, Order, Product } from "../domain.js";
import type { BuckPayAccount, BuckPayTransaction } from "../buckpay.js";

export function toProductDto(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: { amountMinor: product.price.amountMinor, currency: product.price.currency },
    available: product.available,
  };
}

export function toBasketDto(basket: Basket) {
  return {
    id: basket.id,
    lines: basket.lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: { amountMinor: line.unitPrice.amountMinor, currency: line.unitPrice.currency },
    })),
  };
}

export function toOrderDto(order: Order) {
  return {
    id: order.id,
    lines: order.lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice: { amountMinor: line.unitPrice.amountMinor, currency: line.unitPrice.currency },
    })),
    total: { amountMinor: order.total.amountMinor, currency: order.total.currency },
    status: order.status,
  };
}

export function toBuckPayAccountDto(account: BuckPayAccount) {
  return {
    customerId: account.customerId,
    balance: { amountMinor: account.balance.amountMinor, currency: account.balance.currency },
    status: account.status,
  };
}

export function toBuckPayTransactionDto(transaction: BuckPayTransaction) {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: { amountMinor: transaction.amount.amountMinor, currency: transaction.amount.currency },
    reference: transaction.reference,
    createdAt: transaction.createdAt,
  };
}
