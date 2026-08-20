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

## ADR-019 Supporting Records

- ADR-019 Forward-Consistency Check

## External Partner Integration Amendments

These amendment records preserve the history of existing decisions while recording their controlled extension for ADR-019:

- ADR-004 Amendment 001 — External Partner Integration
- ADR-005 Amendment 001 — External Partner Data Boundaries
- ADR-006 Amendment 001 — External Partner Identity
- ADR-015 Amendment 001 — External Partner Security
- ADR-016 Amendment 001 — External Partner Observability
- ADR-017 Amendment 001 — Partner Scalability
- ADR-018 Amendment 001 — Partner Deployment

## Architectural Relationship

ADR-019 establishes the decision to use a partner-neutral external integration boundary. EIP-017 defines the reusable integration pattern that implements that boundary, while EDA-002 defines the enterprise capability and data/integration scope.

Mukuru is treated as an initial partner implementation rather than an architectural dependency. Other qualifying partners may occupy the same capability boundary subject to identity, security, capability, operational, geographic, regulatory and commercial requirements.

## Governance

Every ADR must identify:

1. Context and problem.
2. Decision and rationale.
3. Consequences and trade-offs.
4. Dependencies and related ADRs/EIPs/EDA records.
5. Direct and secondary impacts.
6. Required amendments to affected architecture records.
7. Forward-consistency requirements.

ADR amendments must not silently rewrite historical decisions. They must preserve traceability between the parent decision and the architectural change that caused the amendment.
