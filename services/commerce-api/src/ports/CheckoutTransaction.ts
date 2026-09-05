/**
 * Explicit seam for the checkout transaction boundary.
 * Production implementations must provide atomicity and concurrency control.
 */
export interface CheckoutTransaction {
  run<T>(work: () => Promise<T>): Promise<T>;
  commitCheckout?: (input: { customerId: string; basketId: string; order: unknown }) => Promise<unknown>;
}
