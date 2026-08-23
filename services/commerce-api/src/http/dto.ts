import type { Basket, Order, Product } from "../domain.js";

export const toProductDto = (product: Product) => structuredClone(product);
export const toBasketDto = (basket: Basket) => structuredClone(basket);
export const toOrderDto = (order: Order) => structuredClone(order);
