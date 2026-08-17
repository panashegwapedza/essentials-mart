# EIP-010 — Transactional Outbox

**Status:** Proposed
**Date:** 2026-08-17
**Pattern Type:** Reliability / Data Integration

---

## 1. Purpose

Ensure that an authoritative domain state change and the intent to publish its corresponding integration event are persisted reliably without requiring a distributed transaction between the domain database and the messaging infrastructure.

## 2. Context

Essentials Mart uses domain-owned data and event-driven integration. A critical failure mode exists if a domain successfully commits business state but fails before publishing the event, or publishes an event before the business transaction commits.

For example:

```text
Order created successfully
        │
        └── Event publication fails
                 │
                 ▼
          Other domains never learn
          that the order was created
```

The platform requires a reliable bridge between domain state and event publication.

## 3. Decision

Where reliable event publication is required, Essentials Mart will use a **Transactional Outbox** pattern.

The authoritative domain transaction will persist the business state change and an outbox record in the same database transaction. A separate publisher will deliver pending outbox records to the event infrastructure.

## 4. Processing Model

```text
              Domain Transaction
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   Authoritative State       Outbox Record
          │                     │
          └──────────┬──────────┘
                     │
               Same Transaction
                     │
                     ▼
                  Commit
                     │
                     ▼
              Outbox Publisher
                     │
                     ▼
              Event Backbone
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      Consumers   Consumers   AI Society
```

## 5. Outbox Record

An outbox record should contain appropriate metadata such as:

- Outbox identifier
- Event identifier
- Event type and version
- Aggregate/entity identifier
- Correlation identifier
- Causation identifier where applicable
- Creation timestamp
- Payload or secure payload reference
- Publication status
- Attempt count
- Last attempt timestamp
- Error metadata where appropriate

## 6. Publication Semantics

The outbox publisher may publish a record more than once in failure scenarios.

Therefore, the Transactional Outbox pattern **does not by itself guarantee exactly-once business effects**.

Consumers must apply the Idempotent Consumer pattern defined in EIP-009.

## 7. Domain Ownership

The outbox belongs to the domain that owns the state change.

A consumer must not write to another domain's outbox or database.

The outbox is an integration mechanism attached to authoritative domain ownership, not a shared enterprise database.

## 8. Failure Handling

If publication fails:

1. The outbox record remains available.
2. The publisher retries according to EIP-008.
3. Persistent publication failures are surfaced through observability.
4. Operational recovery must not silently alter the original business event.

If the event infrastructure accepts the event but acknowledgement is lost, the publisher may attempt delivery again. Consumers must therefore remain idempotent.

## 9. AI Society Impact

AI Society consumers may receive events produced through an outbox.

The outbox guarantees reliable publication of the domain event; it does not grant the AI Society authority to act.

As established by the AI architecture:

> Events provide awareness. They do not automatically provide authority.

Any AI-initiated side effect must still pass through authorised capabilities and idempotency controls.

## 10. Observability

Outbox processing must be observable.

Important metrics include:

- Pending outbox count
- Publication latency
- Publication failure rate
- Retry count
- Oldest pending record age
- Successful publication rate
- Dead-lettered publication failures where applicable

The original domain transaction and published event should remain correlated.

## 11. Retention and Cleanup

Published outbox records should be retained according to audit, recovery, and operational requirements.

Cleanup must not occur before the record is safely published and any required retention period has elapsed.

Retention policy must align with ADR-016 and applicable data governance requirements.

## 12. Consequences

### Positive

- Prevents the classic database/event publication gap.
- Preserves domain ownership.
- Supports reliable integration events.
- Works naturally with asynchronous architectures.
- Supports recovery after messaging outages.

### Negative

- Adds outbox storage and publisher infrastructure.
- Requires cleanup and retention policies.
- Can produce duplicate publication attempts.
- Requires idempotent consumers.
- Adds operational complexity.

## 13. Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-018 — Deployment & Environment Strategy

## 14. Related EIPs

- EIP-001 — Event Notification
- EIP-002 — Publish/Subscribe Channel
- EIP-007 — Dead Letter Channel
- EIP-008 — Retry and Redelivery
- EIP-009 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## 15. Final Decision

> Essentials Mart will use the Transactional Outbox pattern where reliable publication of domain-owned integration events is required, persisting the business state change and publication intent atomically within the authoritative domain boundary.
