# ADR-016 Amendment 001 — External Partner Observability & Auditability

**Status:** Proposed
**Date:** 2026-08-20
**Parent ADR:** ADR-016 — Observability, Auditability & Trust
**Related Architecture:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Related Pattern:** EIP-017 — External Partner Adapter / Gateway
**Related Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This amendment extends enterprise observability and auditability to external partner interactions.

## 2. Amendment

Significant partner actions must produce sufficient evidence to reconstruct:

- which partner acted;
- which partner identity or credential was used;
- which customer or recipient context applied;
- which capability was invoked;
- which resource was affected;
- which authorisation decision allowed the action;
- which request or event correlation ID applied;
- what response was returned;
- what state changed;
- what happened afterwards.

## 3. Correlation

Partner-originated transactions must preserve correlation across the partner boundary and internal enterprise workflows.

```text
Partner Request
      |
      v
Partner Adapter
      |
      v
Canonical Command
      |
      v
Domain Workflow
      |
      +-- Events
      +-- Payment
      +-- Fulfilment
      +-- Delivery
```

The same transaction must remain traceable across these stages.

## 4. Trust Evidence

Partner operational status, security state, capability registration, failures, unusual activity, and revocation events should be observable by authorised operators and security systems.

## 5. Privacy

Partner telemetry must follow the platform's data minimisation, access-control, retention, and privacy requirements. Observability must not become unrestricted surveillance of partner or customer activity.

## 6. Consequences

This amendment makes partner activity auditable without making the partner system itself a source of truth for Essentials Mart audit records.

**ADR-016 remains authoritative together with this amendment unless superseded by a later ADR.**
