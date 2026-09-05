import type { AuthenticatedPrincipal, Money } from "./domain.js";

export type BuckPayTransactionType =
  | "earned_reward"
  | "customer_funding"
  | "commerce_redemption"
  | "reversal";

export type BuckPayTransaction = {
  id: string;
  customerId: string;
  type: BuckPayTransactionType;
  amount: Money;
  reference: string;
  createdAt: string;
};

export type BuckPayAccount = {
  customerId: string;
  balance: Money;
  status: "active" | "suspended";
};

export class BuckPayError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_AMOUNT"
      | "INVALID_CURRENCY"
      | "INSUFFICIENT_BALANCE"
      | "ACCOUNT_SUSPENDED"
      | "DUPLICATE_REFERENCE"
      | "NOT_FOUND",
  ) {
    super(message);
    this.name = "BuckPayError";
  }
}

export interface BuckPayRepository {
  getAccount(customerId: string): Promise<BuckPayAccount>;
  getTransactions(customerId: string): Promise<BuckPayTransaction[]>;
  findTransactionByReference(customerId: string, reference: string): Promise<BuckPayTransaction | null>;
  appendTransaction(transaction: BuckPayTransaction): Promise<BuckPayTransaction>;
}

export class InMemoryBuckPayRepository implements BuckPayRepository {
  private readonly accounts = new Map<string, BuckPayAccount>();
  private readonly transactions = new Map<string, BuckPayTransaction[]>();

  async getAccount(customerId: string): Promise<BuckPayAccount> {
    const existing = this.accounts.get(customerId);
    if (existing) return structuredClone(existing);
    const account: BuckPayAccount = {
      customerId,
      balance: { amountMinor: 0, currency: "ZiG" },
      status: "active",
    };
    this.accounts.set(customerId, account);
    this.transactions.set(customerId, []);
    return structuredClone(account);
  }

  async getTransactions(customerId: string): Promise<BuckPayTransaction[]> {
    await this.getAccount(customerId);
    return structuredClone(this.transactions.get(customerId) ?? []);
  }

  async findTransactionByReference(customerId: string, reference: string): Promise<BuckPayTransaction | null> {
    await this.getAccount(customerId);
    const transaction = (this.transactions.get(customerId) ?? []).find((item) => item.reference === reference);
    return transaction ? structuredClone(transaction) : null;
  }

  async appendTransaction(transaction: BuckPayTransaction): Promise<BuckPayTransaction> {
    const account = await this.getAccount(transaction.customerId);
    const current = account.balance;
    if (current.currency !== transaction.amount.currency) {
      throw new BuckPayError("BuckPay account currency does not match transaction currency", "INVALID_CURRENCY");
    }

    const signedAmount = transaction.type === "commerce_redemption" ? -transaction.amount.amountMinor : transaction.amount.amountMinor;
    const nextAmount = current.amountMinor + signedAmount;
    if (nextAmount < 0) throw new BuckPayError("Insufficient BuckPay balance", "INSUFFICIENT_BALANCE");

    const existing = (this.transactions.get(transaction.customerId) ?? []).find((item) => item.reference === transaction.reference);
    if (existing) {
      if (existing.type === transaction.type && existing.amount.amountMinor === transaction.amount.amountMinor && existing.amount.currency === transaction.amount.currency) return structuredClone(existing);
      throw new BuckPayError("Transaction reference has already been used", "DUPLICATE_REFERENCE");
    }

    const updated = { ...account, balance: { ...current, amountMinor: nextAmount } };
    this.accounts.set(transaction.customerId, updated);
    const history = this.transactions.get(transaction.customerId) ?? [];
    history.push(structuredClone(transaction));
    this.transactions.set(transaction.customerId, history);
    return structuredClone(transaction);
  }
}

export function validateBuckPayPrincipal(principal: AuthenticatedPrincipal): void {
  if (!principal.customerId) throw new BuckPayError("Customer identity is required", "NOT_FOUND");
}
