# EIP-001 — Event Notification

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Event

---

## 1. Context

ADR-003 establishes events as facts representing meaningful changes in enterprise state. Essentials Mart needs a simple mechanism for notifying authorised consumers that such a change has occurred without requiring the producer to know every consumer.

## 2. Problem

Directly calling every interested service, AI agent, or Intelligence Engine when a business event occurs would tightly couple the producer to its consumers and make new consumers expensive to introduce.

## 3. Decision

Essentials Mart will use Event Notification when a producer needs to announce that a meaningful state change occurred and consumers can independently decide whether further processing is required.

Examples include `OrderCreated`, `InventoryAdjusted`, `OrderPacked`, and `DeliveryCompleted`.

## 4. Pattern Intent

**Tell interested consumers that something happened; do not use the notification as an instruction to perform unrelated actions.**

## 5. Participants

- Event producer: authoritative enterprise domain.
- Event channel/backbone.
- Authorised consumers: domains, services, notifications, Intelligence Engines, or AI agents.

## 6. Message / Event Contract

Events should contain a unique event ID, event type, version, timestamp, source, correlation ID, relevant entity/aggregate ID, and an appropriately scoped payload. The originating domain remains authoritative for the underlying state.

## 7. Interaction Flow

```text
Authoritative Domain
       │
       │ OrderCreated
       ▼
 Event Channel
       │
 ┌─────┼───────────────┐
 ▼     ▼               ▼
Fulfilment  Notification  Intelligence
```

## 8. Reliability and Failure Handling

Event delivery may be retried according to the reliability architecture. Consumers must fail safely and must not assume that one notification represents exactly one delivery attempt.

## 9. Idempotency and Ordering

Consumers must be designed to tolerate duplicate notifications unless an explicit transport guarantee and business requirement establish otherwise. Ordering requirements must be declared by the event contract where relevant.

## 10. Security and Authority

Only authorised producers may publish integration events and only authorised consumers may subscribe. An event communicates awareness and does not itself grant permission to execute an action.

## 11. Observability and Auditability

Event ID, correlation ID, source, consumer processing status, failures, retries, and final outcome should be traceable in accordance with ADR-016.

## 12. AI Society Impact

AI agents and Intelligence Engines may consume authorised event notifications. Receiving `OrderCreated`, for example, may trigger analysis or a governed workflow, but does not automatically authorise an agent to modify the order.

## 13. Domain Impact

The producer retains ownership of the state represented by the event. Consumers should not mutate the producer's data directly.

## 14. Consequences

### Positive

- Loose coupling.
- Easy addition of consumers.
- Natural integration for AI and intelligence.
- Supports asynchronous processing.

### Negative

- Eventual consistency may occur.
- Duplicate delivery must be handled.
- Distributed debugging becomes more important.

## 15. Alternatives Considered

### Direct service calls

Rejected for broad fan-out because they increase coupling.

### Shared database observation

Rejected because it violates domain ownership.

## 16. Implementation Implications

A governed event channel, schema/version management, access control, observability, retry handling, and consumer registration are required.

## 17. Dependencies

- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-016 — Observability, Auditability & Trust

## 18. Related EIPs

- EIP-002 — Publish-Subscribe Channel
- EIP-010 — Retry and Redelivery
- EIP-011 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## 19. Review Conditions

Review if event notification becomes insufficient for ordering, replay, workflow coordination, or delivery guarantees.

## 20. Final Decision

> Essentials Mart will use Event Notification to communicate meaningful facts about enterprise state changes to authorised consumers while preserving domain ownership and separating awareness from authority.
