# ADR-022 — BuckPay Value Account Architecture

**Status:** Proposed
**Date:** 2026-09-04
**Decision Type:** Capability Architecture

## Decision

Introduce BuckPay as a dedicated platform capability with a customer-scoped value account, immutable transaction ledger, explicit currency, idempotent transaction references, server-side authority for balance-changing decisions, and a partner-neutral boundary for future regulated financial capabilities.

The initial implementation may use an in-memory adapter for development. Production persistence and regulated rails must use the approved data and external-partner architecture rather than provider-specific client behaviour.

## Non-Goals

BuckPay does not establish a bank account, deposit-taking, lending, guaranteed investment returns, investment advice, regulated-asset custody, replacement of ordinary payment methods, or client-side balance authority.

## Value Model

BuckPay distinguishes earned value, customer funds, commerce redemption and reversals. The authoritative balance is derived server-side from the ledger.

## Security and Trust

Balance-changing operations execute server-side and require an authenticated customer principal. Transaction references are idempotent and negative balances are prohibited unless separately approved.

## Dependencies

ADR-004, ADR-005, ADR-006, ADR-009, ADR-010, ADR-015, ADR-016, ADR-017, ADR-019, EDA-001, EDA-002, EIP-017, EIP-028, EIP-029, EIP-030, EIP-031.

## Forward-Consistency

Before promotion beyond the development vertical slice, affected architecture records must be amended through controlled amendments, secondary impacts verified, ledger invariants tested, and closure evidence recorded under EIP-031.
