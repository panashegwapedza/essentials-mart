# EIP-009 — Dead Letter Channel

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Reliability / Messaging

---

## Purpose

Provide a controlled destination for messages that cannot be successfully processed within their permitted retry policy.

## Decision

Messages that exhaust their applicable retry policy will be isolated in a Dead Letter Channel rather than being silently discarded or allowed to block healthy processing.

```text
Message → Consumer → Failure → Retry → Exhausted → Dead Letter Channel
```

A dead-lettered message remains identifiable, traceable, and recoverable subject to retention and security policy.

## Requirements

A dead-letter record should preserve, where appropriate:

- Original message identifier
- Message type and version
- Source and destination
- Correlation and causation identifiers
- Entity/aggregate identifier
- Failure timestamp
- Retry count
- Failure classification
- Diagnostic error metadata
- Original payload or secure reference

Sensitive information must be minimised and protected.

## Replay

Replay must be controlled, authorised, observable, and idempotent. It must not silently create a second business transaction when the original operation already succeeded.

## AI Society Impact

AI agents and Intelligence Engines may encounter the same failures as conventional consumers. Dead-letter handling must never grant an AI agent additional authority or cause repeated side effects.

## Observability

Monitor dead-letter volume, failure rate, retry exhaustion, message age, replay activity, and recurring failure patterns. Correlate failures with the originating workflow where possible.

## Security

Dead-letter channels may contain sensitive business information and therefore require least-privilege access, encryption where appropriate, audit logging, and retention/deletion controls.

## Consequences

### Positive

- Prevents silent message loss.
- Protects healthy processing from poison messages.
- Enables controlled diagnosis and recovery.

### Negative

- Requires monitoring and operational ownership.
- Replay introduces duplicate-effect risk without idempotency.
- Retention creates data-governance obligations.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-018 — Deployment & Environment Strategy

## Related EIPs

- EIP-007 — Content-Based Router
- EIP-010 — Retry and Redelivery
- EIP-011 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will use a Dead Letter Channel to isolate unprocessable messages while preserving security, traceability, observability, and controlled recovery.
