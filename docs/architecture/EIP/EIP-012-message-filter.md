# EIP-012 — Message Filter

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Filtering

---

## Purpose

Prevent irrelevant or unauthorised messages from reaching a consumer that has no reason to process them.

## Decision

Essentials Mart will use Message Filters to reduce unnecessary processing and enforce declared integration-interest boundaries.

```text
Event Channel
     │
     ▼
Message Filter
   ├── Relevant ──► Consumer
   └── Irrelevant ──► Ignore / alternate route
```

Filters should operate on stable contract fields and must not silently hide messages that are required for audit or operational recovery.

## Security

Filtering is not a replacement for authorisation. Consumers and capabilities remain responsible for their own access controls.

## AI Society Impact

Filters may prevent an AI agent from receiving events outside its declared responsibility or context requirements. This supports least-context and least-authority principles.

## Observability

The platform should make filter behaviour measurable, particularly when filtering causes unexpected loss of expected workflow signals. Sensitive payloads should not be logged unnecessarily.

## Consequences

### Positive

- Reduces unnecessary processing.
- Limits irrelevant AI context.
- Reduces coupling and noise.

### Negative

- Incorrect filters can hide important messages.
- Filter rules require testing and versioning.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust

## Related EIPs

- EIP-002 — Publish/Subscribe Channel
- EIP-006 — Message Router
- EIP-007 — Content-Based Router
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will use governed Message Filters to prevent irrelevant messages from reaching consumers while preserving security, auditability, and domain boundaries.
