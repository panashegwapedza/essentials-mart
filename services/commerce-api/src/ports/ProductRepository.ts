import type { Product, ProductId } from "../domain.js";

export interface ProductRepository {
  list(): Promise<Product[]>;
  getById(id: ProductId): Promise<Product | null>;
}
