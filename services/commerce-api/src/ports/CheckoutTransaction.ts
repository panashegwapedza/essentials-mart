/**
 * Explicit seam for the checkout transaction boundary.
 * Production implementations must provide atomicity and concurrency control.
 * The development adapter intentionally does not.
 */
export interface CheckoutTransaction {
  run<T>(work: () => Promise<T>): Promise<T>;
}
