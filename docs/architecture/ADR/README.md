# Essentials Mart — Architecture Decision Records

## ADR Catalogue

| ID | Decision | Status |
| --- | --- | --- |
| ADR-001 | Enterprise Architecture Principles | Proposed |
| ADR-002 | Domain-Driven Enterprise Architecture | Proposed |
| ADR-003 | Event-Driven Architecture | Proposed |
| ADR-004 | API & Service Architecture | Proposed |
| ADR-005 | Data Ownership & Database Boundaries | Proposed |
| ADR-006 | Identity, Authentication & Authorisation | Proposed |
| ADR-007 | AI Society Architecture | Proposed |
| ADR-008 | Intelligence Engine Architecture | Proposed |
| ADR-009 | AI Agent Governance & Permissions | Proposed |
| ADR-010 | Human-in-the-Loop Architecture | Proposed |
| ADR-011 | Notification & Communication Architecture | Proposed |
| ADR-012 | WhatsApp Integration Architecture | Proposed |
| ADR-013 | Flutter Client Architecture | Proposed |
| ADR-014 | Walk Mode / Living Digital Supermarket Architecture | Proposed |
| ADR-015 | Security & Anti-Replication Architecture | Proposed |
| ADR-016 | Observability, Auditability & Trust Architecture | Proposed |
| ADR-017 | Scalability & Multi-Store Architecture | Proposed |
| ADR-018 | Deployment & Environment Strategy | Proposed |
| ADR-019 | External Partner Integration Architecture | Proposed |
| ADR-020 | Essentials Subscription & Multimodal Delivery Optimisation Architecture | Proposed |

## ADR-019 Supporting Records

- ADR-019 Forward-Consistency Check

## ADR-020 Supporting Records

- ADR-020 Forward-Consistency Check
- ADR-020 Forward-Consistency Closure Record

## External Partner Integration Amendments

These amendment records preserve the history of existing decisions while recording their controlled extension for ADR-019:

- ADR-004 Amendment 001 — External Partner Integration
- ADR-005 Amendment 001 — External Partner Data Boundaries
- ADR-006 Amendment 001 — External Partner Identity
- ADR-015 Amendment 001 — External Partner Security
- ADR-016 Amendment 001 — External Partner Observability
- ADR-017 Amendment 001 — Partner Scalability
- ADR-018 Amendment 001 — Partner Deployment

## ADR-020 Subscription & Multimodal Delivery Amendments

These amendment records preserve the history of existing decisions while recording the controlled architectural impact of ADR-020:

- ADR-004 Amendment 002 — Subscription & Multimodal Delivery Orchestration
- ADR-005 Amendment 002 — Subscription & Delivery Data Boundaries
- ADR-007 Amendment 001 — Subscription & Delivery AI Participation
- ADR-008 Amendment 001 — Resource-Aware Delivery Intelligence
- ADR-010 Amendment 001 — Subscription & Delivery Human Control
- ADR-014 Amendment 001 — Walk Mode Shared Delivery Pipeline
- ADR-016 Amendment 001 — Subscription & Delivery Observability
- ADR-017 Amendment 001 — Subscription & Multimodal Delivery Scalability
- ADR-019 Amendment 001 — Scheduled Transport & Delivery Capabilities

## Architectural Relationship

ADR-019 establishes the decision to use a partner-neutral external integration boundary. EIP-017 defines the reusable integration pattern that implements that boundary, while EDA-002 defines the enterprise capability and data/integration scope.

ADR-020 establishes the decision to extend existing commerce and delivery capabilities with customer-configurable subscriptions and a shared, resource-aware multimodal delivery optimisation layer. EIP-018 defines the reusable integration pattern that operationalises delivery-job orchestration, resource evaluation, multimodal transport selection and route/dispatch optimisation, while EDA-003 defines the enterprise capability and boundaries.

## ADR-020 Closure

The ADR-020 forward-consistency review is closed. The closure record confirms that the identified direct and secondary impacts have been represented through controlled amendments and that the new subscription and multimodal delivery capabilities extend shared commerce, fulfilment and delivery infrastructure rather than creating parallel systems.

Future material changes to subscription behaviour, transport capabilities, routing constraints, partner contracts or customer delivery guarantees require a new architectural impact review.

## Governance

Every ADR must identify:

1. Context and problem.
2. Decision and rationale.
3. Consequences and trade-offs.
4. Dependencies and related ADRs/EIPs/EDA records.
5. Direct and secondary impacts.
6. Required amendments to affected architecture records.
7. Forward-consistency requirements.
8. Closure status for material architectural change sets.

ADR amendments must not silently rewrite historical decisions. They must preserve traceability between the parent decision and the architectural change that caused the amendment.
