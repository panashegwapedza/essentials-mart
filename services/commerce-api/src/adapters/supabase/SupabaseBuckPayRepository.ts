import type { AuthenticatedPrincipal, Money } from "../../domain.js";
import type { BuckPayAccount, BuckPayRepository, BuckPayTransaction } from "../../buckpay.js";
import { supabaseRest, supabaseRpc } from "./SupabaseCommerceRepositories.js";

function moneyFromRow(row: any): Money {
  return { amountMinor: Math.round(Number(row.amount ?? row.balance ?? 0) * 100), currency: row.currency };
}

function transactionFromRow(row: any, customerId: string): BuckPayTransaction {
  return {
    id: row.id,
    customerId,
    type: row.transaction_type,
    amount: moneyFromRow(row),
    reference: row.reference,
    createdAt: row.created_at,
  };
}

async function customerDbId(customerId: string): Promise<string> {
  const rows = await supabaseRest<any[]>(`customers?select=id&external_customer_id=eq.${encodeURIComponent(customerId)}&limit=1`);
  if (rows[0]?.id) return rows[0].id;
  const created = await supabaseRest<any[]>("customers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ external_customer_id: customerId }),
  });
  if (!created[0]?.id) throw new Error("Supabase customer creation returned no id.");
  return created[0].id;
}

export class SupabaseBuckPayRepository implements BuckPayRepository {
  async getAccount(customerId: string): Promise<BuckPayAccount> {
    const dbCustomerId = await customerDbId(customerId);
    const rows = await supabaseRest<any[]>(`buckpay_accounts?select=id,currency,balance,status&customer_id=eq.${dbCustomerId}&limit=1`);
    if (!rows[0]) {
      const created = await supabaseRest<any[]>("buckpay_accounts", {
        method: "POST",
        headers: { Prefer: "return=representation,resolution=merge-duplicates" },
        body: JSON.stringify({ customer_id: dbCustomerId, currency: "ZiG", balance: 0, status: "active" }),
      });
      if (!created[0]) throw new Error("Supabase BuckPay account creation returned no row.");
      return {
        customerId,
        balance: { amountMinor: Math.round(Number(created[0].balance) * 100), currency: created[0].currency },
        status: created[0].status === "active" ? "active" : "suspended",
      };
    }
    return {
      customerId,
      balance: { amountMinor: Math.round(Number(rows[0].balance) * 100), currency: rows[0].currency },
      status: rows[0].status === "active" ? "active" : "suspended",
    };
  }

  async getTransactions(customerId: string): Promise<BuckPayTransaction[]> {
    const account = await this.getAccount(customerId);
    const dbCustomerId = await customerDbId(customerId);
    const accounts = await supabaseRest<any[]>(`buckpay_accounts?select=id&customer_id=eq.${dbCustomerId}&limit=1`);
    const accountId = accounts[0]?.id;
    if (!accountId) return [];
    const rows = await supabaseRest<any[]>(`buckpay_ledger?select=id,transaction_type,amount,currency,reference,created_at&account_id=eq.${accountId}&order=created_at.desc`);
    void account;
    return rows.map((row) => transactionFromRow(row, customerId));
  }

  async findTransactionByReference(customerId: string, reference: string): Promise<BuckPayTransaction | null> {
    const dbCustomerId = await customerDbId(customerId);
    const accounts = await supabaseRest<any[]>(`buckpay_accounts?select=id&customer_id=eq.${dbCustomerId}&limit=1`);
    const accountId = accounts[0]?.id;
    if (!accountId) return null;
    const rows = await supabaseRest<any[]>(`buckpay_ledger?select=id,transaction_type,amount,currency,reference,created_at&account_id=eq.${accountId}&reference=eq.${encodeURIComponent(reference)}&limit=1`);
    return rows[0] ? transactionFromRow(rows[0], customerId) : null;
  }

  async appendTransaction(transaction: BuckPayTransaction): Promise<BuckPayTransaction> {
    const result = await supabaseRpc<any>("buckpay_append_transaction", {
      p_customer_external_id: transaction.customerId,
      p_transaction_id: transaction.id,
      p_transaction_type: transaction.type,
      p_amount: transaction.amount.amountMinor / 100,
      p_currency: transaction.amount.currency,
      p_reference: transaction.reference,
      p_created_at: transaction.createdAt,
    });
    const payload = result?.transaction ?? result;
    return {
      id: payload.id,
      customerId: payload.customerId ?? transaction.customerId,
      type: payload.type ?? transaction.type,
      amount: { amountMinor: Math.round(Number(payload.amount) * 100), currency: payload.currency ?? transaction.amount.currency },
      reference: payload.reference ?? transaction.reference,
      createdAt: payload.createdAt ?? transaction.createdAt,
    };
  }
}
