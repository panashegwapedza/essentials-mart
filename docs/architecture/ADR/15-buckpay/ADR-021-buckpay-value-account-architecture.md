# ADR-021 — BuckPay Value Account Architecture

**Status:** Proposed
**Date:** 2026-09-04
**Decision Type:** Capability Architecture

## 1. Context

Essentials Mart already models rewards, wallet capabilities, partner payments and household financial-value concepts, but BuckPay has remained a future capability. The platform now requires a first implementation slice without prematurely becoming a bank, investment manager or regulated payment institution.

BuckPay therefore needs a governed value-account boundary that can record platform-earned value and customer-funded value, expose a clear balance, and integrate with commerce while keeping regulated financial custody, payment rails and investment execution behind approved external-partner boundaries.

## 2. Decision

Introduce BuckPay as a dedicated platform capability with:

- a customer-scoped BuckPay account;
- a double-entry-style immutable transaction ledger for value movements;
- separate value classifications for earned rewards, customer funds, commerce redemption and reversals;
- idempotent transaction references;
- an explicit currency on every monetary value;
- commerce redemption limited to available BuckPay balance;
- a partner-neutral financial integration boundary for future regulated funding, withdrawal, custody and investment capabilities;
- server-side authority for all balance-changing decisions;
- human-visible transaction history and audit records.

The initial implementation may use an in-memory adapter for the development vertical slice. Production persistence and regulated rails must be introduced through the approved data and external-partner architecture rather than embedding provider-specific behaviour in the client.

## 3. Non-Goals

This decision does not establish:

- a bank account;
- deposit-taking or lending;
- guaranteed investment returns;
- investment advice;
- custody of regulated financial assets by Essentials Mart;
- a replacement for ordinary payment methods;
- client-side authority over balances.

## 4. Value Model

BuckPay distinguishes:

1. **Earned Value** — value granted by approved platform rules, rewards or promotions.
2. **Customer Funds** — funds legitimately credited through an approved funding rail.
3. **Commerce Redemption** — authorised use of BuckPay value against eligible commerce transactions.
4. **Reversal** — controlled correction of a previous BuckPay movement.

A displayed balance is derived from the authoritative ledger. The client must never calculate or mutate the authoritative balance.

## 5. Security and Trust

All balance-changing operations execute server-side and require an authenticated customer principal. Transaction references must be idempotent. Negative balances are prohibited unless a future, separately approved credit product explicitly changes this decision.

Sensitive financial-provider credentials and proprietary value-allocation rules remain outside the client bundle.

## 6. Dependencies

- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust Architecture
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-019 — External Partner Integration Architecture
- EDA-001 — Enterprise Data Architecture
- EDA-002 — External Partner Commerce, Distribution & Financial Integration
- EIP-017 — External Partner Adapter Gateway
- EIP-028 — Observability, Audit & Trust Implementation Architecture
- EIP-029 — API & Contract Engineering
- EIP-030 — Testing & Verification Architecture
- EIP-031 — Release & Change Management Architecture

## 7. Direct Impacts

- Commerce API gains BuckPay account and ledger operations.
- Customer Web gains a BuckPay balance/history surface.
- Checkout may consume eligible BuckPay value only through a server-authorised operation.
- Observability must record balance-changing decisions and transaction references.
- Security controls must cover replay, double-credit, double-spend and ownership attacks.

## 8. Secondary Impacts

- Future AI Society capabilities may recommend but may not autonomously move BuckPay value unless explicitly authorised by capability policy.
- Household Wallet and BuckPay must remain distinguishable until their relationship is separately decided.
- Financial-provider integration must preserve provider-neutral contracts.
- Offline/limited-connectivity clients may display cached balances but must not treat stale balances as authoritative for redemption.

## 9. Forward-Consistency Check

Before this capability is promoted beyond the development vertical slice:

1. identify affected ADR/EIP/EDA records;
2. amend each affected record through a controlled amendment rather than silently rewriting history;
3. verify secondary impacts on commerce, household, AI, security, audit, client and partner boundaries;
4. verify transaction idempotency and replay protection;
5. verify ledger invariants through EIP-030 tests;
6. record closure evidence before production release under EIP-031.

## 10. Consequences

**Positive:** BuckPay becomes a real platform capability without coupling Essentials Mart to a specific financial provider. Balance authority, auditability and security are explicit from the first implementation.

**Trade-off:** A dedicated ledger and partner boundary require more structure than storing a single wallet balance, but this prevents reconciliation, fraud and audit problems as the platform grows.
