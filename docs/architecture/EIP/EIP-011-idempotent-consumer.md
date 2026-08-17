# EIP-011 — Idempotent Consumer

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Reliability / Messaging

---

## Purpose

Ensure that duplicate delivery, retry, replay, or acknowledgement failure does not create unintended duplicate business effects.

## Decision

Consumers capable of producing side effects must implement idempotent processing appropriate to the operation.

```text
Message → Consumer → Idempotency Check
                         ├→ Already processed → Safe outcome
                         └→ New → Execute → Record outcome
```

Strategies may include processed-message records, unique constraints, business idempotency keys, conditional writes, upserts, and state-transition guards.

## Domain Ownership

Idempotency controls must operate within the authoritative domain boundary and must not require consumers to write to another domain's database.

## AI Society Impact

AI reasoning may repeat. Enterprise side effects must not unintentionally repeat. AI-generated requests must therefore pass through authorised capabilities capable of duplicate detection or reconciliation.

## Notifications

The architecture must distinguish duplicate processing from legitimate multi-channel delivery. An event may legitimately produce both an in-app notification and a permitted WhatsApp notification.

## Observability

Record appropriate message identifiers, consumer, idempotency result, original processing reference, correlation ID, and outcome without unnecessary sensitive data.

## Consequences

### Positive

- Safer retries and replay.
- Protection against duplicate business effects.
- Safer AI-initiated operations.

### Negative

- Requires additional state or constraints.
- Key selection must be carefully designed.
- Some domains require reconciliation logic.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-009 — AI Agent Governance & Permissions
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-016 — Observability, Auditability & Trust

## Related EIPs

- EIP-004 — Command Message
- EIP-009 — Dead Letter Channel
- EIP-010 — Retry and Redelivery
- EIP-014 — Transactional Outbox
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will require idempotent processing for message-driven operations capable of producing business side effects.
