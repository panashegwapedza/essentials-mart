# Essentials Mart — Architecture-to-Implementation Roadmap

**Status:** Proposed
**Date:** 2026-08-23

## 1. Purpose

This document converts the governed architecture corpus into an implementation sequence. It does not replace ADRs, EIPs, EDAs, UXA records, or AIA records. Those remain the architectural sources of truth.

## 2. Implementation Order

```text
Architecture Baseline
        |
        v
Foundation Platform
        |
        +--> Identity & Authorisation
        +--> Domain Services & Data Ownership
        +--> Event Infrastructure
        +--> API / Service Contracts
        +--> Observability / Audit
        |
        v
Commerce & Fulfilment
        |
        +--> Catalogue / Inventory
        +--> Cart / Order
        +--> Fulfilment / Delivery
        +--> Notifications / WhatsApp
        |
        v
AI Society
        |
        +--> Intelligence Engines
        +--> Agent Governance
        +--> Human-in-the-Loop
        |
        v
Living Digital Supermarket
        |
        +--> Walk Mode
        +--> Manual
        +--> AI Assisted
        +--> Autopilot
        |
        v
External Ecosystem
        |
        +--> Partner Integration
        +--> Subscription
        +--> Multimodal Delivery
        |
        v
Production Hardening
        |
        +--> Security
        +--> Scalability
        +--> Resilience
        +--> Release / Recovery
```

## 3. Phase 0 — Architecture Baseline

**Objective:** Freeze the current architecture baseline before implementation-specific design begins.

### Outputs

- ADR corpus validated.
- EIP corpus validated.
- Architecture map established.
- Definitions of terms established.
- Source-of-truth ownership confirmed.
- Cross-document dependencies recorded.

### Gate

No implementation decision may contradict an ADR/EIP without an explicit architectural change.

## 4. Phase 1 — Platform Foundations

**Primary architecture:** ADR-001 through ADR-006, ADR-015, ADR-016, ADR-018.

### Workstreams

1. Identity, authentication and authorisation.
2. Domain boundaries and ownership.
3. Database boundaries and migrations.
4. API/service contracts.
5. Event infrastructure.
6. Correlation, tracing, audit and operational telemetry.
7. Environment and deployment foundations.

### Acceptance criteria

- Every protected operation has an authoritative identity and authorisation decision.
- Domain-owned data has an explicit owner.
- Internal and external contracts are versioned.
- Events are traceable and idempotency requirements are explicit.
- Production and non-production environments are isolated.

## 5. Phase 2 — Commerce, Fulfilment and Communication

**Primary architecture:** ADR-003, ADR-004, ADR-005, ADR-011, ADR-012, ADR-017; EIP-001 through EIP-016 where applicable.

### Workstreams

- Catalogue and product discovery.
- Inventory.
- Cart and order lifecycle.
- Fulfilment.
- Delivery orchestration.
- Notifications.
- WhatsApp channel integration.
- Multi-store foundations.

### Acceptance criteria

- Commerce state has a single authoritative owner.
- Fulfilment and delivery remain event-aware and observable.
- Notifications are decoupled from core transaction processing.
- WhatsApp cannot bypass platform identity, policy or domain authority.

## 6. Phase 3 — AI Society

**Primary architecture:** ADR-007 through ADR-010; AIA-001.

### Workstreams

- AI Society coordination.
- Intelligence Engines.
- Agent capability registry.
- Agent authority and permissions.
- Human-in-the-loop controls.
- Decision traceability.

### Non-negotiable invariant

> AI capability does not imply AI authority.

AI agents must operate through governed capabilities, policies, tools and domain boundaries. Proprietary decision logic remains server-side where appropriate.

### Acceptance criteria

- Agent actions are attributable.
- Agent permissions are scoped and revocable.
- High-impact actions have defined human-control requirements.
- AI decisions can be audited and correlated with the underlying transaction.

## 7. Phase 4 — Living Digital Supermarket / Walk Mode

**Primary architecture:** ADR-013, ADR-014, ADR-016.

### Modes

1. Manual.
2. AI Assisted.
3. Autopilot.

### Workstreams

- Flutter client foundation.
- Store/aisle spatial model.
- Route planning.
- Product recognition.
- Shopping-list awareness.
- Dynamic substitutions.
- Basket mutation.
- User takeover and pause controls.
- Walk Mode auditability.

### Acceptance criteria

- User remains the authority over delegated shopping decisions.
- Every autonomous or AI-assisted material action is attributable.
- Mode transitions are explicit and observable.
- Unavailable products can trigger governed substitution behaviour.

## 8. Phase 5 — External Ecosystem and Advanced Delivery

**Primary architecture:** ADR-019, ADR-020, EIP-017, EIP-018, EDA-002, EDA-003.

### Workstreams

- Partner-neutral integration boundary.
- Partner adapters/gateways.
- Capability registry.
- Subscription lifecycle.
- Resource-aware multimodal delivery optimisation.
- Scheduled transport/delivery capabilities.
- Settlement/reconciliation integrations.

### Acceptance criteria

- No core domain depends directly on a specific provider.
- Partner capabilities are scoped and revocable.
- Subscription and delivery capabilities extend shared infrastructure rather than creating parallel systems.
- Partner and delivery failures are isolated and observable.

## 9. Phase 6 — Production Hardening

**Primary architecture:** ADR-015 through ADR-018 plus release/recovery architecture.

### Workstreams

- Security hardening.
- Abuse and fraud controls.
- Reliability and resilience.
- Scaling and multi-store expansion.
- Disaster recovery.
- Release/change management.
- Incident response.
- Anti-replication controls.
- Operational readiness.

### Acceptance criteria

- Critical services have defined recovery expectations.
- Security boundaries are testable.
- Releases are reversible or recoverable.
- Incidents produce sufficient evidence for diagnosis and audit.
- Scaling does not introduce uncontrolled ownership or consistency violations.

## 10. Cross-Cutting Implementation Rules

Every implementation change must:

1. Identify the governing ADR/EIP/EDA/AIA/UXA record.
2. Preserve domain ownership.
3. Preserve identity and authorisation boundaries.
4. Preserve event and contract semantics.
5. Preserve observability and auditability.
6. Avoid duplicating an existing governed capability.
7. Keep provider-specific behaviour behind explicit integration boundaries.
8. Keep sensitive/proprietary decision logic off the client where feasible.
9. Define failure, retry, idempotency and recovery behaviour where relevant.
10. Perform an architectural impact review when the implementation changes an architectural invariant.

## 11. Definition of Done for Architecture-to-Implementation Work

A workstream is architecturally ready when:

- its scope is mapped to governing architecture records;
- ownership is explicit;
- interfaces/contracts are identified;
- data boundaries are explicit;
- security and authority are defined;
- failure behaviour is defined;
- observability evidence is defined;
- acceptance criteria are testable;
- unresolved architectural conflicts are either resolved or recorded as formal decisions.

## 12. Next Implementation Planning Step

The next concrete activity is to decompose **Phase 1 — Platform Foundations** into implementation specifications and appropriately sized engineering tasks. This should begin with identity, domain/data boundaries, API contracts, event infrastructure, and observability because downstream commerce and AI capabilities depend on them.
