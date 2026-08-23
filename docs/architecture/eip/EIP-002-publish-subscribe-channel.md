# EIP-002 — Publish-Subscribe Channel

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Messaging

---

## 1. Context

Essentials Mart has multiple domains and AI capabilities that may need to react independently to the same enterprise event. ADR-003 requires loose coupling between event producers and consumers.

## 2. Problem

A point-to-point integration model requires the producer to maintain knowledge of each consumer. This becomes increasingly difficult as stores, domains, channels, Intelligence Engines, and AI agents grow.

## 3. Decision

Essentials Mart will use Publish-Subscribe Channels for event categories that legitimately have multiple independent consumers.

A producer publishes once to the governed channel. Authorised subscribers receive the event according to their subscription and access policy.

## 4. Pattern Intent

**Allow one business event to reach multiple independent consumers without coupling the producer to their identities.**

## 5. Participants

- Publisher: authoritative domain or approved event producer.
- Publish-subscribe channel.
- Subscription registry/policy.
- Independent consumers.

## 6. Message / Event Contract

Published events must use governed event contracts and include identity, type, version, timestamp, source, correlation information, and appropriate business identifiers.

## 7. Interaction Flow

```text
Producer
   │
   │ Event
   ▼
Publish-Subscribe Channel
   ├──► Consumer A
   ├──► Consumer B
   ├──► Consumer C
   └──► Consumer N
```

## 8. Reliability and Failure Handling

Consumer failure must not unnecessarily prevent other subscribers from processing the event. Failed processing follows retry and dead-letter policies.

## 9. Idempotency and Ordering

Each consumer owns its processing semantics and must tolerate duplicate delivery. Ordering is a subscription/contract concern and must be explicit where business correctness depends on it.

## 10. Security and Authority

Subscriptions are governed by domain and capability permissions. Sensitive events must not be broadcast indiscriminately. An AI agent's subscription does not grant action authority.

## 11. Observability and Auditability

The platform should record publication, subscription, delivery, processing, retry, and failure information with shared correlation identifiers.

## 12. AI Society Impact

The AI Society can subscribe to authorised enterprise events. This provides shared awareness while preserving each agent's explicit capabilities and governance boundaries under ADR-009.

## 13. Domain Impact

Consumers receive event information but do not gain ownership of the source domain's state.

## 14. Consequences

### Positive

- Strong producer/consumer decoupling.
- Natural fan-out.
- Easy addition of future consumers.
- Good fit for Intelligence Engines and AI Society participation.

### Negative

- Subscription governance becomes important.
- Event storms can affect many consumers.
- Distributed processing requires strong observability.

## 15. Alternatives Considered

### Point-to-point messaging

Rejected for broad multi-consumer events because it increases coupling.

### Direct synchronous calls

Rejected for asynchronous notification scenarios.

## 16. Implementation Implications

The event infrastructure must support consumer isolation, access-controlled subscriptions, retry handling, observability, and scalable fan-out.

## 17. Dependencies

- ADR-003 — Event-Driven Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

## 18. Related EIPs

- EIP-001 — Event Notification
- EIP-006 — Message Router
- EIP-009 — Dead Letter Channel
- EIP-011 — Idempotent Consumer

## 19. Review Conditions

Review when an integration requires strict ordering, replay, workflow coordination, or a point-to-point command rather than a broadcast fact.

## 20. Final Decision

> Essentials Mart will use governed Publish-Subscribe Channels for enterprise events that have multiple independent authorised consumers, preserving producer independence and domain ownership.
