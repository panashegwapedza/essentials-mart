import type { Product, ProductId } from "../../domain.js";
import type { ProductRepository } from "../../ports/ProductRepository.js";

export const DEV_FIXTURE_CURRENCY = "ZiG";

/** Development/test fixture data only; not a production catalogue or currency decision. */
export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Map<ProductId, Product>;

  constructor(seed: Product[] = InMemoryProductRepository.defaultSeed()) {
    this.products = new Map(seed.map((product) => [product.id, structuredClone(product)]));
  }

  async list(): Promise<Product[]> {
    return structuredClone([...this.products.values()]);
  }

  async getById(id: ProductId): Promise<Product | null> {
    const product = this.products.get(id);
    return product ? structuredClone(product) : null;
  }

  /**
   * Takes currency as an explicit parameter rather than reading
   * process.env internally — keeps this class free of implicit global
   * state, so tests can construct different fixture sets without mutating
   * and restoring process.env (which risks cross-test/parallel-worker
   * contamination). The composition root (src/index.ts) is responsible
   * for reading any environment override and passing it in explicitly.
   */
  static defaultSeed(currency: string = DEV_FIXTURE_CURRENCY): Product[] {
    return [
      { id: "bread", name: "Bread [DEV FIXTURE]", price: { amountMinor: 250, currency }, available: true },
      { id: "milk", name: "Milk [DEV FIXTURE]", price: { amountMinor: 300, currency }, available: true },
      { id: "eggs", name: "Eggs (dozen) [DEV FIXTURE]", price: { amountMinor: 450, currency }, available: true },
      { id: "discontinued-item", name: "Discontinued Item [DEV FIXTURE]", price: { amountMinor: 100, currency }, available: false },
    ];
  }
}
