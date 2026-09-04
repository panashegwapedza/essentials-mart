# EDA-002 Amendment 001 — BuckPay Financial Boundary

**Status:** Proposed
**Date:** 2026-09-04
**Parent:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Trigger:** ADR-021 — BuckPay Value Account Architecture

## Change

BuckPay is introduced as an Essentials Mart-owned value-account capability whose authoritative ledger remains inside the platform domain boundary.

External financial providers may supply funding, payment, withdrawal, settlement, custody or investment capabilities, but those capabilities must cross the partner-neutral boundary established by EDA-002 and ADR-019.

## Boundary

```text
Customer
   ↓
Essentials Mart / BuckPay
   ↓
Canonical Financial Capability Contract
   ↓
External Partner Adapter
   ↓
Approved Financial Provider
```

The external provider is authoritative only for the provider-side transaction or financial service it actually executes. Essentials Mart remains authoritative for its own BuckPay account state and platform transaction references.

## Security

BuckPay mutations require authenticated customer context, server-side authority, idempotency and auditability. Provider credentials remain outside the client.

## Secondary Impact

- EIP-034 implements the BuckPay ledger and redemption boundary.
- EIP-017 remains the external-provider adapter pattern.
- Future regulated financial operations require separate provider capability and compliance approval before activation.

## Forward-Consistency

Reviewed against ADR-004, ADR-005, ADR-006, ADR-015, ADR-016, ADR-019, EIP-017, EIP-028, EIP-029, EIP-030 and EIP-031. No existing provider-neutral decision is replaced; BuckPay extends the existing financial integration boundary.
