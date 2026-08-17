# EIP-007 — Content-Based Router

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Routing

---

## Purpose

Route a message to one or more authorised destinations based on information contained in the message.

## Context

Essentials Mart has multiple domains, stores, channels, AI capabilities, and workflow types. The same integration channel may need different handling depending on business meaning, event type, store context, urgency, capability, or workflow state.

## Decision

Essentials Mart will use Content-Based Routers where routing depends on declared message content or metadata.

Routing rules must remain integration rules and must not become a hidden replacement for domain business logic.

## Flow

```text
Message
   │
   ▼
Content-Based Router
   │
   ├── condition A ──► Destination A
   ├── condition B ──► Destination B
   └── otherwise ────► Failure / Default Route
```

## Rules

Routing conditions should be explicit, versioned, testable, and observable. The router should use stable contract fields rather than brittle implementation details.

Unknown or invalid content must follow an explicit failure route rather than being silently accepted.

## Security and Authority

Routing is not authorisation. A message may only be routed to destinations permitted by policy, and the receiving capability must perform its own authority checks.

## AI Society Impact

Content-based routing may select an appropriate AI agent or Intelligence Engine based on task type, domain, or capability. Selection must respect ADR-009 governance and must not grant additional permissions.

## Observability

Routing decisions, rule versions, destination, failures, and correlation identifiers should be traceable without unnecessarily logging sensitive payloads.

## Consequences

### Positive

- Reduces coupling between producers and specialised consumers.
- Supports differentiated workflows.
- Allows integration topology to evolve through governed rules.

### Negative

- Routing rules can become complex.
- Poorly governed rules can duplicate domain logic.
- Incorrect rules can misroute messages.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

## Related EIPs

- EIP-006 — Message Router
- EIP-008 — Recipient List
- EIP-012 — Message Filter
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will use Content-Based Routers where message content determines an authorised integration destination, while keeping routing logic separate from domain ownership and business authority.
