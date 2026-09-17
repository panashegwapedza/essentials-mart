import type { AuthenticatedPrincipal, Money } from "./domain.js";

export type BuckPayTransactionType = "earned_reward" | "customer_funding" | "commerce_redemption" | "reversal";
export type BuckPayTransaction = { id:string; customerId:string; type:BuckPayTransactionType; amount:Money; reference:string; createdAt:string; };
export type BuckPayAccount = { customerId:string; balance:Money; status:"active"|"suspended"; };
export type BuckPayOrderPayment = { id:string; orderId:string; customerId:string; paymentMethod:"buckpay"; amount:Money; status:"pending"|"succeeded"|"failed"|"refunded"; idempotencyKey:string; providerReference?:string; createdAt:string; };

export class BuckPayError extends Error {
  constructor(message:string, public readonly code:"INVALID_AMOUNT"|"INVALID_CURRENCY"|"INSUFFICIENT_BALANCE"|"ACCOUNT_SUSPENDED"|"DUPLICATE_REFERENCE"|"NOT_FOUND"|"ORDER_ALREADY_PAID"|"PAYMENT_IDEMPOTENCY_REUSED") { super(message); this.name="BuckPayError"; }
}

export interface BuckPayRepository {
  getAccount(customerId:string):Promise<BuckPayAccount>;
  getTransactions(customerId:string):Promise<BuckPayTransaction[]>;
  findTransactionByReference(customerId:string,reference:string):Promise<BuckPayTransaction|null>;
  appendTransaction(transaction:BuckPayTransaction):Promise<BuckPayTransaction>;
  payOrderWithBuckPay(input:{customerId:string;authUserId:string;orderId:string;paymentId:string;idempotencyKey:string;requestFingerprint:string}):Promise<BuckPayOrderPayment>;
}

export class InMemoryBuckPayRepository implements BuckPayRepository {
  private readonly accounts=new Map<string,BuckPayAccount>(); private readonly transactions=new Map<string,BuckPayTransaction[]>(); private readonly payments=new Map<string,BuckPayOrderPayment>();
  async getAccount(customerId:string):Promise<BuckPayAccount>{const existing=this.accounts.get(customerId);if(existing)return structuredClone(existing);const account:BuckPayAccount={customerId,balance:{amountMinor:0,currency:"ZiG"},status:"active"};this.accounts.set(customerId,account);this.transactions.set(customerId,[]);return structuredClone(account);}
  async getTransactions(customerId:string){await this.getAccount(customerId);return structuredClone(this.transactions.get(customerId)??[]);}
  async findTransactionByReference(customerId:string,reference:string){await this.getAccount(customerId);const transaction=(this.transactions.get(customerId)??[]).find(item=>item.reference===reference);return transaction?structuredClone(transaction):null;}
  async appendTransaction(transaction:BuckPayTransaction){const account=await this.getAccount(transaction.customerId);if(account.balance.currency!==transaction.amount.currency)throw new BuckPayError("BuckPay account currency does not match transaction currency","INVALID_CURRENCY");const signed=transaction.type==="commerce_redemption"?-transaction.amount.amountMinor:transaction.amount.amountMinor;if(account.balance.amountMinor+signed<0)throw new BuckPayError("Insufficient BuckPay balance","INSUFFICIENT_BALANCE");const existing=(this.transactions.get(transaction.customerId)??[]).find(item=>item.reference===transaction.reference);if(existing){if(existing.type===transaction.type&&existing.amount.amountMinor===transaction.amount.amountMinor&&existing.amount.currency===transaction.amount.currency)return structuredClone(existing);throw new BuckPayError("Transaction reference has already been used","DUPLICATE_REFERENCE");}this.accounts.set(transaction.customerId,{...account,balance:{...account.balance,amountMinor:account.balance.amountMinor+signed}});const history=this.transactions.get(transaction.customerId)??[];history.push(structuredClone(transaction));this.transactions.set(transaction.customerId,history);return structuredClone(transaction);}
  async payOrderWithBuckPay(input:{customerId:string;authUserId:string;orderId:string;paymentId:string;idempotencyKey:string;requestFingerprint:string}):Promise<BuckPayOrderPayment>{const key=`${input.customerId}:${input.idempotencyKey}`;const existing=this.payments.get(key);if(existing){if(existing.orderId!==input.orderId)throw new BuckPayError("Payment idempotency key has already been used with a different request","PAYMENT_IDEMPOTENCY_REUSED");return structuredClone(existing);}throw new BuckPayError("In-memory order payment requires the real order store","NOT_FOUND");}
}
export function validateBuckPayPrincipal(principal:AuthenticatedPrincipal):void{if(!principal.customerId)throw new BuckPayError("Customer identity is required","NOT_FOUND");}
