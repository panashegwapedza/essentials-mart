# EIP-034 — BuckPay Value Ledger & Redemption

**Status:** Proposed / Initial Implementation
**Date:** 2026-09-04
**Parent Architecture:** ADR-021 — BuckPay Value Account Architecture

## 1. Purpose

Define the reusable implementation pattern for BuckPay account reads, immutable value movements, idempotent transaction references and controlled commerce redemption.

## 2. Boundary

BuckPay owns the authoritative value ledger. Commerce may request redemption through a server-side capability boundary, but the client never changes the balance directly.

Financial-provider operations such as card funding, mobile-money funding, withdrawal, custody or investment execution cross the external partner boundary defined by ADR-019 / EIP-017.

## 3. Canonical Operations

- `GetBuckPayAccount` — query current account state.
- `GetBuckPayTransactions` — query customer-visible history.
- `CreditEarnedValue` — command to grant approved platform-earned value.
- `FundBuckPay` — command to credit customer funds after an approved funding rail confirms settlement.
- `RedeemBuckPay` — command to consume available value for an eligible commerce operation.
- `ReverseBuckPayTransaction` — controlled compensating command for authorised correction.

## 4. Invariants

1. Every transaction has a customer identity, amount, currency, type, reference and timestamp.
2. Amounts are represented in integer minor currency units.
3. A transaction reference is idempotent for a customer.
4. Reusing a reference with different transaction data is rejected.
5. The authoritative balance is server-derived from accepted ledger movements.
6. A commerce redemption cannot create a negative balance.
7. Cross-currency mutation is rejected unless a separately governed conversion capability authorises it.
8. Suspended accounts cannot mutate value.
9. Provider credentials never reach the client.

## 5. Development Implementation

The first vertical slice uses an in-memory repository behind a stable application-service interface. This allows API and client behaviour to be verified before production persistence and financial-provider contracts are introduced.

## 6. Client Contract

The client may display the balance and transaction history. Cached values are informational only. Any future redemption must be authorised against the current server state.

## 7. Security

The capability is authenticated and customer-scoped. Mutation endpoints must be protected by replay/idempotency controls, rate limits, anomaly detection and audit logging before production activation.

## 8. Verification

EIP-030 tests must cover:

- zero-balance account creation;
- earned-value credit;
- idempotent replay;
- conflicting reference reuse;
- insufficient-balance rejection;
- successful redemption;
- ownership isolation;
- suspended-account rejection;
- currency mismatch;
- reversal semantics.

## 9. Related Architecture

- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-006 — Identity, Authentication & Authorisation
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust Architecture
- ADR-019 — External Partner Integration Architecture
- ADR-021 — BuckPay Value Account Architecture
- EIP-017 — External Partner Adapter / Gateway
- EIP-028 — Observability, Auditability & Trust Implementation Architecture
- EIP-029 — API & Contract Engineering
- EIP-030 — Testing & Verification Architecture
- EIP-031 — Release & Change Management Architecture
