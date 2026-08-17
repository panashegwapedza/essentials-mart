# EIP-007 — Dead Letter Channel

**Status:** Proposed
**Date:** 2026-08-17
**Pattern Type:** Reliability / Messaging

---

## 1. Purpose

Provide a controlled destination for messages that cannot be successfully processed after the permitted delivery attempts.

## 2. Context

Essentials Mart uses event-driven communication for appropriate asynchronous cross-domain workflows. Messages may fail because of transient infrastructure problems, invalid payloads, unavailable dependencies, contract incompatibilities, or application defects.

A message that repeatedly fails must not block healthy messages indefinitely or disappear without trace.

## 3. Decision

Essentials Mart will use a **Dead Letter Channel (DLC)** for messages that cannot be processed successfully within their configured retry policy.

A dead-lettered message must remain identifiable, traceable, and recoverable subject to retention and security policies.

Dead lettering does not mean the message is discarded. It means normal processing has stopped and the message has entered an exception workflow.

## 4. Processing Flow

```text
Producer
   │
   ▼
Message / Event Channel
   │
   ▼
Consumer
   │
   ├── Success ──► Complete
   │
   └── Failure
          │
          ▼
     Retry Policy
          │
          ├── Retry succeeds ──► Complete
          │
          └── Retry exhausted
                    │
                    ▼
             Dead Letter Channel
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      Monitoring          Controlled Replay
```

## 5. Dead-Letter Record Requirements

A dead-letter record should preserve, where appropriate:

- Original message identifier
- Message/event type and version
- Original source
- Destination/consumer
- Correlation identifier
- Causation identifier where applicable
- Entity or aggregate identifier
- Original timestamp
- Failure timestamp
- Retry count
- Failure classification
- Error information suitable for diagnosis
- Original payload or a secure reference to it
- Processing metadata

Sensitive data must be minimised and protected according to security and privacy requirements.

## 6. Failure Classification

Failures should be classified so that automated recovery can be distinguished from defects requiring intervention.

Examples:

- Transient infrastructure failure
- Dependency unavailable
- Timeout
- Invalid message
- Schema/contract incompatibility
- Authorisation failure
- Business-rule rejection
- Consumer defect
- Unknown/unclassified failure

A business rejection should not automatically be treated as a technical retry condition.

## 7. Replay

Dead-lettered messages may be replayed only through a controlled mechanism.

Replay must:

- Preserve the original message identity where required for traceability.
- Generate an explicit replay/correction record.
- Respect idempotency controls.
- Respect current authorisation and security policy.
- Avoid bypassing domain ownership.
- Remain observable and auditable.

A replay must not silently create a second business transaction when the original operation already succeeded but acknowledgement was lost.

## 8. AI Society Impact

AI agents and Intelligence Engines may consume events and can therefore encounter the same messaging failures as conventional services.

A dead-letter workflow must not cause an AI agent to repeatedly execute an action or infer that an operation succeeded merely because its message was published.

Dead-letter handling is an integration reliability mechanism; it does not grant an AI agent additional authority.

## 9. Observability

Dead-letter activity must be observable through the platform's observability architecture.

Operational monitoring should identify:

- Dead-letter volume
- Failure rate by message type
- Failure rate by consumer
- Retry exhaustion
- Long-lived dead letters
- Replay activity
- Repeated failure patterns

Significant failures should be linked to the original distributed trace where possible.

## 10. Security

Dead-letter channels are controlled enterprise infrastructure and may contain sensitive business information.

Access must therefore be restricted according to least privilege.

Requirements include:

- Authenticated producers and consumers
- Authorised access to dead-letter records
- Encryption where appropriate
- Audit logging for inspection and replay
- Payload minimisation
- Retention and deletion controls

## 11. Consequences

### Positive

- Failed messages are not silently lost.
- Healthy message processing is protected from poison messages.
- Failures become diagnosable and recoverable.
- Replay can be controlled and audited.
- Distributed workflows become more resilient.

### Negative

- Additional infrastructure and operational processes are required.
- Dead-letter queues require monitoring and ownership.
- Replay introduces risk if idempotency is weak.
- Retention of failed messages creates data-governance obligations.

## 12. Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-018 — Deployment & Environment Strategy

## 13. Related EIPs

- EIP-001 — Event Notification
- EIP-002 — Publish/Subscribe Channel
- EIP-003 — Event Stream
- EIP-004 — Command Message
- EIP-006 — Message Router
- EIP-008 — Retry and Redelivery
- EIP-009 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## 14. Final Decision

> Essentials Mart will use a Dead Letter Channel to isolate messages that cannot be processed successfully within their permitted retry policy, while preserving traceability, security, observability, and controlled recovery.
