# EIP-009 — Idempotent Consumer

**Status:** Proposed
**Date:** 2026-08-17
**Pattern Type:** Reliability / Messaging

---

## 1. Purpose

Ensure that processing the same message more than once does not create unintended duplicate business effects.

## 2. Context

Distributed messaging systems may deliver a message more than once because of retries, acknowledgement loss, consumer restarts, network failures, or replay operations.

Essentials Mart includes business operations where duplicate effects could be serious, including orders, payments, inventory changes, notifications, fulfilment actions, delivery coordination, and AI-initiated actions.

## 3. Decision

Consumers of messages that can produce side effects must implement idempotent processing appropriate to the operation.

The preferred identity for duplicate detection is the immutable message/event identifier, supplemented by business idempotency keys where the business operation requires them.

## 4. Processing Model

```text
Message
   │
   ▼
Consumer
   │
   ▼
Check Processing / Idempotency Record
   │
   ├── Already processed ──► Return recorded outcome / safely acknowledge
   │
   └── Not processed
          │
          ▼
      Execute operation
          │
          ▼
      Record outcome
          │
          ▼
        Complete
```

The exact transaction boundary must ensure that recording successful processing cannot become permanently inconsistent with the business effect.

## 5. Idempotency Strategies

Depending on the workflow, implementations may use:

- Processed-message records
- Unique database constraints
- Business idempotency keys
- Conditional writes
- Upserts
- State-transition guards
- Provider-supported idempotency mechanisms

The strategy must be appropriate to the domain's authoritative state model.

## 6. Domain Ownership

Idempotency controls must not bypass domain ownership.

For example, an Inventory consumer must enforce duplicate protection through the Inventory domain's authoritative capabilities rather than directly manipulating another domain's records.

## 7. AI Society Impact

AI agents are not exempt from idempotency requirements.

An agent may reason about the same event more than once, or an agent's tool invocation may be retried.

An AI-generated request must therefore pass through an authorised capability that can safely identify and reject or reconcile duplicate execution.

**Reasoning may repeat. Enterprise side effects must remain controlled.**

## 8. Notifications

Notifications require particular care because duplicate delivery may degrade user trust.

Notification consumers should distinguish between:

- Duplicate internal processing
- Legitimate multi-channel delivery
- Legitimate repeated notifications for distinct events

For example, an order-status event may legitimately result in both an in-app notification and a WhatsApp message if the user's communication permissions allow it. That is not necessarily a duplicate business action.

## 9. Observability

Idempotency decisions should be observable without exposing unnecessary sensitive data.

Useful telemetry includes:

- Message identifier
- Consumer
- Idempotency key type
- Duplicate detection result
- Original processing reference
- Correlation identifier
- Outcome

## 10. Consequences

### Positive

- Safer retries and redelivery.
- Protection against duplicate business effects.
- Safer message replay.
- Greater resilience to infrastructure failures.
- Safer AI-initiated operations.

### Negative

- Additional state and storage may be required.
- Idempotency windows must be designed carefully.
- Incorrect key selection can create false duplicates or missed duplicates.
- Some operations require domain-specific reconciliation.

## 11. Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-009 — AI Agent Governance & Permissions
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-016 — Observability, Auditability & Trust

## 12. Related EIPs

- EIP-004 — Command Message
- EIP-007 — Dead Letter Channel
- EIP-008 — Retry and Redelivery
- EIP-015 — Correlation and Distributed Tracing

## 13. Final Decision

> Essentials Mart will require idempotent processing for message-driven operations capable of producing business side effects, ensuring that retries, duplicate delivery, and controlled replay do not create unintended duplicate outcomes.
