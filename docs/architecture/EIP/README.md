# Essentials Mart — Enterprise Integration Patterns

## Purpose

This directory documents the Enterprise Integration Patterns (EIPs) used by Essentials Mart to implement reliable, governed communication between enterprise domains, services, AI agents, Intelligence Engines, channels, and external systems.

EIPs describe **how integration is implemented**. They complement the architectural decisions recorded in the ADRs.

## Relationship to Other Architecture Documentation

- **ADR** — records why an architectural decision was made.
- **EDA** — defines the event-driven architectural style adopted by Essentials Mart.
- **EIP** — defines a reusable integration mechanism used to implement that architecture.
- **API contracts** — define synchronous interfaces and capability boundaries.
- **Event contracts** — define the structure and semantics of asynchronous messages.

ADR-003 establishes that events represent facts, commands request actions, and queries request information. The EIPs in this directory must preserve that distinction.

## EIP Catalogue

| ID | Pattern | Primary Purpose | Status |
| --- | --- | --- | --- |
| EIP-001 | Event Notification | Notify interested consumers that a state change occurred | Proposed |
| EIP-002 | Publish-Subscribe Channel | Distribute events to multiple authorised consumers | Proposed |
| EIP-003 | Event Stream | Provide an ordered, durable stream of events where required | Proposed |
| EIP-004 | Command Message | Represent an explicit request to perform an action | Proposed |
| EIP-005 | Request-Reply | Support synchronous request/response interactions | Proposed |
| EIP-006 | Message Router | Route messages between integration participants | Proposed |
| EIP-007 | Content-Based Router | Route messages according to message content | Proposed |
| EIP-008 | Recipient List | Deliver one message to a dynamically determined set of recipients | Proposed |
| EIP-009 | Dead Letter Channel | Isolate messages that cannot be successfully processed | Proposed |
| EIP-010 | Retry and Redelivery | Recover from transient processing failures | Proposed |
| EIP-011 | Idempotent Consumer | Prevent duplicate delivery from producing duplicate effects | Proposed |
| EIP-012 | Message Filter | Prevent irrelevant messages from reaching consumers | Proposed |
| EIP-013 | Saga Orchestration | Coordinate long-running distributed business workflows | Proposed |
| EIP-014 | Transactional Outbox | Reliably publish integration messages with domain state changes | Proposed |
| EIP-015 | Correlation and Distributed Tracing | Maintain workflow identity across distributed processing | Proposed |
| EIP-016 | Human-in-the-Loop Routing | Escalate actions requiring human authority | Proposed |

## Governing Principles

1. Domain ownership remains authoritative. EIPs must not create shared-state ownership outside the responsible domain.
2. Events communicate facts; commands request actions; queries request information.
3. Receiving a message does not automatically grant authority to act.
4. Every integration path must have an identifiable producer, consumer, purpose, and security boundary.
5. Messages must support correlation, traceability, versioning, and safe evolution where applicable.
6. Consumers must tolerate duplicate delivery where the transport does not guarantee exactly-once processing.
7. Failure handling must be explicit rather than hidden inside application code.
8. Sensitive information must be minimised in messages and protected according to the security architecture.
9. EIPs must remain consistent with the ADR tree and undergo forward-consistency review when architectural decisions change.
10. Integration patterns should be used deliberately; not every interaction should be converted into asynchronous messaging.

## EIP Lifecycle

Each EIP follows:

`Proposed → Accepted → Implemented → Deprecated → Superseded`

An EIP may remain Proposed while implementation decisions are still being validated. When implementation begins, its concrete technology must remain an implementation detail unless a separate ADR establishes that technology as an architectural decision.

## Related Architecture

Primary dependencies include:

- ADR-001 — Enterprise Architecture Principles
- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-018 — Deployment & Environment Strategy

## Naming and Message Conventions

Message names should describe business meaning rather than implementation details.

Examples:

- `OrderCreated`
- `InventoryAvailabilityChanged`
- `OrderReadyForDelivery`
- `CreateOrder`
- `ReserveInventory`
- `GetOrderStatus`

Transport-specific names, broker-specific terminology, and implementation details belong in implementation documentation unless they have architectural significance.
