# EIP-013 — Saga Orchestration

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Distributed Workflow

---

## Purpose

Coordinate long-running workflows spanning multiple domain-owned transactions without requiring one distributed database transaction.

## Decision

Essentials Mart will use Saga orchestration for appropriate distributed workflows such as order, payment, inventory, fulfilment, delivery, and notification coordination.

```text
Saga
 ├→ Command Domain A → Event
 ├→ Command Domain B → Event
 ├→ Command Domain C → Event
 └→ Completion / Compensation / Escalation
```

The orchestrator tracks workflow state and coordinates authorised actions but does not own participating domain data.

## Commands and Events

Commands request actions. Events communicate facts. The saga must preserve this distinction and must not treat an event as permission to perform an unrelated action.

## Compensation

Compensation is an explicit business action that reconciles an earlier action. It is not necessarily a database rollback. Compensating actions must be defined by the owning domain.

## Failure Handling

The saga must define behaviour for timeouts, domain rejection, duplicate events, orchestrator restart, partial completion, compensation failure, and external dependency failure.

Unresolved workflows must be observable and may require human escalation.

## Idempotency

Saga commands, events, and state transitions must be protected against duplicate delivery and repeated execution. EIP-011 applies.

## AI Society Impact

AI agents may recommend or request participation in a saga but do not automatically become workflow authority. AI may assist with exception interpretation, recommendations, customer communication, prioritisation, and escalation.

## Human-in-the-Loop

High-risk, ambiguous, or unrecoverable workflow states should support escalation under ADR-010 and EIP-016.

## Observability

Each saga requires a stable workflow identifier and correlated records of initiating principal, commands, events, completed steps, failures, compensations, escalations, and final outcome.

## Consequences

### Positive

- Supports distributed business workflows.
- Preserves domain ownership.
- Makes failure and compensation explicit.

### Negative

- Adds workflow complexity.
- Compensation can be difficult.
- Partial failure requires operational handling.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

## Related EIPs

- EIP-004 — Command Message
- EIP-005 — Request-Reply
- EIP-009 — Dead Letter Channel
- EIP-010 — Retry and Redelivery
- EIP-011 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing
- EIP-016 — Human-in-the-Loop Routing

## Final Decision

> Essentials Mart will use Saga orchestration for appropriate distributed, long-running workflows while preserving domain ownership and explicit compensation, observability, idempotency, and human-escalation controls.
