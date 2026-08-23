# EIP-003 — Event Stream

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Event

---

## 1. Context

Some Essentials Mart workloads require more than transient event notification. Analytics, Intelligence Engines, audit-oriented processing, operational monitoring, and selected replayable workflows may require a durable sequence of events.

## 2. Problem

A simple notification channel may not provide the retention, replay, ordering, or independent consumption characteristics required by high-volume or analytical workloads.

## 3. Decision

Essentials Mart will use Event Streams where an integration requires durable, ordered or partitioned event processing and controlled replay.

Event streams are not the default for every event. Their use must be justified by workload and reliability requirements.

## 4. Pattern Intent

**Provide a durable sequence of events that authorised consumers can process independently, with replay where the stream contract permits it.**

## 5. Participants

- Event producers.
- Event stream.
- Stream partitions/ordering boundaries where applicable.
- Consumer groups or independent consumers.
- Retention and replay controls.

## 6. Message / Event Contract

Events must be versioned and contain stable identifiers, source, timestamp, correlation information, entity/aggregate identifiers where applicable, and a governed payload. Ordering scope must be explicit rather than assumed globally.

## 7. Interaction Flow

```text
Domain / Service
       │
       ▼
   Event Stream
       │
 ┌─────┼──────────────┐
 ▼     ▼              ▼
AI     Analytics    Operations
```

## 8. Reliability and Failure Handling

Consumers must track processing position/checkpoint state and recover safely after failure. Retention, replay, and poison-message behaviour must be explicitly governed.

## 9. Idempotency and Ordering

Consumers must tolerate reprocessing because replay and recovery can produce duplicate processing attempts. Ordering is guaranteed only within the declared stream/partition scope.

## 10. Security and Authority

Stream access is subject to least privilege. Sensitive events must have restricted subscriptions and appropriate retention. Replay capability must be controlled because replay can reproduce consequential data-processing workflows.

## 11. Observability and Auditability

The platform should observe stream lag, throughput, consumer health, processing failures, checkpoints, replay operations, and correlation identifiers.

## 12. AI Society Impact

Intelligence Engines may consume streams for forecasting, optimisation, and analysis. AI agents may consume selected streams where there is a defined operational reason and explicit authorisation. Stream access does not grant action authority.

## 13. Domain Impact

The stream is a representation of published facts, not a replacement for authoritative domain state.

## 14. Consequences

### Positive

- Durable processing.
- Replay capability.
- Independent consumers.
- Strong fit for intelligence and analytics workloads.

### Negative

- Greater infrastructure complexity.
- Retention and storage costs.
- Replay can create operational risk if consumers are not idempotent.

## 15. Alternatives Considered

### Transient Event Notification

Rejected when durable replay or stream processing is required.

### Direct database polling

Rejected because it creates coupling to domain storage and bypasses event contracts.

## 16. Implementation Implications

The implementation must define retention, partitioning, ordering, consumer position, replay controls, schema evolution, access control, and operational monitoring.

## 17. Dependencies

- ADR-003 — Event-Driven Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-008 — Intelligence Engine Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

## 18. Related EIPs

- EIP-001 — Event Notification
- EIP-002 — Publish-Subscribe Channel
- EIP-010 — Retry and Redelivery
- EIP-011 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## 19. Review Conditions

Review if retention, ordering, replay, or throughput requirements change materially, or if the stream becomes an accidental substitute for authoritative data storage.

## 20. Final Decision

> Essentials Mart will use Event Streams selectively for durable, scalable, replayable event processing where the workload justifies stream semantics, while preserving domain ownership and governed event contracts.
