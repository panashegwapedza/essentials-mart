import type { CheckoutTransaction } from "../../ports/CheckoutTransaction.js";

/** Development-only seam. It provides no atomicity or concurrency guarantee. */
export class InMemoryCheckoutTransaction implements CheckoutTransaction {
  async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }
}
