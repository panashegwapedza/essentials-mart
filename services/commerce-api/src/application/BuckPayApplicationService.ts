import { randomUUID } from "node:crypto";
import type { AuthenticatedPrincipal, Money } from "../domain.js";
import {
  BuckPayError,
  type BuckPayAccount,
  type BuckPayRepository,
  type BuckPayTransaction,
  type BuckPayTransactionType,
  validateBuckPayPrincipal,
} from "../buckpay.js";

export class BuckPayApplicationService {
  constructor(private readonly repository: BuckPayRepository) {}

  async getAccount(principal: AuthenticatedPrincipal): Promise<BuckPayAccount> {
    validateBuckPayPrincipal(principal);
    return this.repository.getAccount(principal.customerId);
  }

  async getTransactions(principal: AuthenticatedPrincipal): Promise<BuckPayTransaction[]> {
    validateBuckPayPrincipal(principal);
    return this.repository.getTransactions(principal.customerId);
  }

  async creditEarnedValue(
    principal: AuthenticatedPrincipal,
    amount: Money,
    reference: string,
  ): Promise<BuckPayTransaction> {
    return this.mutate(principal, "earned_reward", amount, reference);
  }

  async fund(
    principal: AuthenticatedPrincipal,
    amount: Money,
    reference: string,
  ): Promise<BuckPayTransaction> {
    return this.mutate(principal, "customer_funding", amount, reference);
  }

  async redeem(
    principal: AuthenticatedPrincipal,
    amount: Money,
    reference: string,
  ): Promise<BuckPayTransaction> {
    return this.mutate(principal, "commerce_redemption", amount, reference);
  }

  private async mutate(
    principal: AuthenticatedPrincipal,
    type: BuckPayTransactionType,
    amount: Money,
    reference: string,
  ): Promise<BuckPayTransaction> {
    validateBuckPayPrincipal(principal);
    if (!reference.trim()) throw new BuckPayError("Transaction reference is required", "DUPLICATE_REFERENCE");
    if (!Number.isInteger(amount.amountMinor) || amount.amountMinor <= 0) {
      throw new BuckPayError("Amount must be a positive integer in minor currency units", "INVALID_AMOUNT");
    }
    if (!amount.currency.trim()) throw new BuckPayError("Currency is required", "INVALID_CURRENCY");

    const account = await this.repository.getAccount(principal.customerId);
    if (account.status !== "active") throw new BuckPayError("BuckPay account is suspended", "ACCOUNT_SUSPENDED");
    if (account.balance.currency !== amount.currency) {
      throw new BuckPayError(`BuckPay account uses ${account.balance.currency}`, "INVALID_CURRENCY");
    }

    const existing = await this.repository.findTransactionByReference(principal.customerId, reference);
    if (existing) {
      if (existing.type === type && existing.amount.amountMinor === amount.amountMinor && existing.amount.currency === amount.currency) return existing;
      throw new BuckPayError("Transaction reference has already been used", "DUPLICATE_REFERENCE");
    }

    const transaction: BuckPayTransaction = {
      id: randomUUID(),
      customerId: principal.customerId,
      type,
      amount: structuredClone(amount),
      reference,
      createdAt: new Date().toISOString(),
    };
    await this.repository.appendTransaction(transaction);
    return transaction;
  }
}
