# EIP-015 — Correlation and Distributed Tracing

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Observability / Integration

---

## Purpose

Maintain a stable identity across distributed messages, commands, services, workflows, and AI interactions so that a business operation can be reconstructed across system boundaries.

## Decision

Essentials Mart will use correlation identifiers and distributed tracing metadata on applicable integration paths.

A workflow may contain multiple messages and processing attempts, while each message may also have its own identifier and causation relationship.

```text
User Action
   │
   ▼
Correlation ID
   │
   ├→ Command
   │    └→ Domain Service
   │          └→ Event
   │                ├→ Inventory
   │                ├→ Fulfilment
   │                └→ AI Society
   │
   └→ Notifications
```

## Required Concepts

Where applicable, integrations should distinguish:

- **Message ID** — identity of the individual message.
- **Correlation ID** — identity of the broader workflow or interaction.
- **Causation ID** — identifies the message/action that caused the current message.
- **Trace/Span context** — technical distributed-tracing context.

## AI Society Impact

AI workflows must remain traceable from initiating principal through agent selection, Intelligence Engine use, tool calls, domain capabilities, actions, and outcome.

Correlation does not grant authority; it provides accountability and context.

## Privacy and Security

Correlation metadata must not become a vehicle for exposing sensitive information. Identifiers should be opaque where appropriate, and sensitive model inputs/outputs should not be placed into telemetry merely for traceability.

## Failure and Retry

Retries must retain enough correlation information to connect attempts to the original workflow while distinguishing individual processing attempts.

## Observability

The architecture should support reconstruction of significant workflows, including:

- Initiating principal
- Workflow ID
- Message IDs
- Commands and events
- Agent identity where applicable
- Tools/capabilities invoked
- Domain interactions
- Approvals
- Errors
- Final outcome

## Consequences

### Positive

- Enables end-to-end debugging.
- Supports auditability.
- Improves incident investigation.
- Makes AI workflows explainable at the execution level.

### Negative

- Requires consistent propagation across services.
- Increases telemetry design complexity.
- Retention creates governance requirements.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-018 — Deployment & Environment Strategy

## Related EIPs

- EIP-001 — Event Notification
- EIP-004 — Command Message
- EIP-009 — Dead Letter Channel
- EIP-010 — Retry and Redelivery
- EIP-013 — Saga Orchestration
- EIP-014 — Transactional Outbox
- EIP-016 — Human-in-the-Loop Routing

## Final Decision

> Essentials Mart will use correlation and distributed-tracing identifiers to preserve workflow identity and causal relationships across distributed integration paths while respecting privacy, security, and audit requirements.
