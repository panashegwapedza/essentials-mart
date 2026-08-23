# EIP-014 — Transactional Outbox

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Reliability / Data Integration

---

## Purpose

Reliably persist a domain state change and the intent to publish its integration event without requiring a distributed transaction between the domain database and messaging infrastructure.

## Decision

Where reliable event publication is required, the authoritative domain transaction will persist both business state and an outbox record atomically. A publisher will later deliver pending records to the event infrastructure.

```text
Domain Transaction
 ├→ Authoritative State
 └→ Outbox Record
          │
        Commit
          │
          ▼
   Outbox Publisher
          │
          ▼
    Event Backbone
```

## Domain Ownership

The outbox belongs to the domain that owns the state change. It is not a shared enterprise database.

## Publication Semantics

Publication may occur more than once when acknowledgement is lost. Transactional Outbox therefore does not itself guarantee exactly-once business effects. Consumers must apply EIP-011.

## Failure Handling

Failed publication remains pending and follows EIP-010. Persistent failures must be observable and recoverable through controlled operations.

## AI Society Impact

The outbox reliably publishes domain facts to AI consumers but does not grant the AI Society authority to act. AI side effects still require authorised capabilities and idempotency.

## Retention

Published outbox records must be retained and cleaned according to operational, audit, security, and data-governance requirements.

## Observability

Monitor pending records, publication latency, failure rate, retry count, oldest pending record, and publication success. Correlate the original domain transaction with the published event.

## Consequences

### Positive

- Prevents the database/event publication gap.
- Preserves domain ownership.
- Supports reliable asynchronous integration.

### Negative

- Adds storage and publisher infrastructure.
- Requires cleanup and monitoring.
- Can produce duplicate publication attempts.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-018 — Deployment & Environment Strategy

## Related EIPs

- EIP-001 — Event Notification
- EIP-002 — Publish/Subscribe Channel
- EIP-009 — Dead Letter Channel
- EIP-010 — Retry and Redelivery
- EIP-011 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will use the Transactional Outbox pattern where reliable publication of domain-owned integration events is required, atomically coupling state change and publication intent within the authoritative domain boundary.
