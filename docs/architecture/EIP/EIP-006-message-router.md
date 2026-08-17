# EIP-006 — Message Router

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Routing

---

## 1. Context

Essentials Mart will have many domains, services, channels, AI agents, Intelligence Engines, and external integrations. Messages cannot rely on every producer knowing every possible destination.

## 2. Problem

Without governed routing, producers become coupled to recipients and integration rules become scattered across applications.

## 3. Decision

Essentials Mart will use Message Router components to direct messages to the appropriate authorised destination according to declared routing rules.

Routing may be used for events, commands, integration messages, notifications, or other governed message types.

## 4. Pattern Intent

**Separate the decision about where a message goes from the component that produced it.**

## 5. Participants

- Message producer.
- Router.
- Routing policy/rules.
- One or more authorised destinations.
- Observability and audit infrastructure.

## 6. Message / Event Contract

Messages must carry enough metadata for routing without requiring the router to become an owner of domain business state. Typical routing metadata includes message type, version, source, tenant/store context where applicable, correlation ID, and destination capability/classification.

## 7. Interaction Flow

```text
Producer
   │
   ▼
Message Router
   │
   ├──► Domain A
   ├──► Domain B
   └──► AI / Intelligence Capability
```

## 8. Reliability and Failure Handling

Invalid or unroutable messages must be rejected or sent to defined failure handling rather than silently discarded. Routing failures should be observable and recoverable where appropriate.

## 9. Idempotency and Ordering

Routing itself should not create duplicate effects. Downstream consumers remain responsible for idempotent processing. Ordering must be preserved where the routing contract requires it.

## 10. Security and Authority

Routing rules must enforce destination authorisation and must not be treated as a permission escalation mechanism. A router may determine where a message is allowed to go, but it does not grant the recipient authority beyond existing policy.

## 11. Observability and Auditability

The router should expose traceable routing decisions, selected destination, rejected routes, rule version, latency, and failures. Sensitive message content should not be unnecessarily logged.

## 12. AI Society Impact

The router may direct tasks or events to the appropriate AI agent or Intelligence Engine. Agent selection must respect ADR-009 governance, capability boundaries, and human approval requirements.

## 13. Domain Impact

Routing must not transfer domain ownership. The destination receives an authorised integration message, not ownership of the originating domain's data.

## 14. Consequences

### Positive

- Reduced producer/consumer coupling.
- Centralised routing policy.
- Easier evolution of integrations.
- Supports AI Society orchestration.

### Negative

- Router rules become operationally important.
- Incorrect routing can affect multiple workflows.
- Routing infrastructure requires strong observability and testing.

## 15. Alternatives Considered

### Hard-coded point-to-point destinations

Rejected because it couples producers to consumers.

### Every consumer independently polls all messages

Rejected because it increases processing cost and exposes consumers to irrelevant messages.

## 16. Implementation Implications

Routing rules should be versioned, tested, observable, and governed. The router should remain focused on integration concerns rather than accumulating domain business logic.

## 17. Dependencies

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

## 18. Related EIPs

- EIP-002 — Publish-Subscribe Channel
- EIP-007 — Content-Based Router
- EIP-008 — Recipient List
- EIP-012 — Message Filter
- EIP-015 — Correlation and Distributed Tracing

## 19. Review Conditions

Review if routing rules become indistinguishable from domain business logic or if the integration topology requires a fundamentally different orchestration model.

## 20. Final Decision

> Essentials Mart will use governed Message Routers to separate integration routing decisions from message producers while preserving explicit destination authorisation and enterprise domain ownership.
