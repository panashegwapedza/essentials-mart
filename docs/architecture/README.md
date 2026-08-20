# Essentials Mart Architecture

## Enterprise Architecture

- EDA-001 — Enterprise Data Architecture
- EDA-002 — External Partner Commerce, Distribution & Financial Integration

## Architecture Decision Records

- ADR-001 — Enterprise Architecture Principles
- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-008 — Intelligence Engine Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-013 — Flutter Client Architecture
- ADR-014 — Walk Mode / Living Digital Supermarket Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust Architecture
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-018 — Deployment & Environment Strategy
- ADR-019 — External Partner Integration Architecture

### ADR-019 Forward-Consistency Record

- ADR-019 Forward-Consistency Check

### ADR Amendment Records — External Partner Integration

- ADR-004 Amendment 001 — External Partner Integration
- ADR-005 Amendment 001 — External Partner Data Boundaries
- ADR-006 Amendment 001 — External Partner Identity
- ADR-015 Amendment 001 — External Partner Security
- ADR-016 Amendment 001 — External Partner Observability
- ADR-017 Amendment 001 — Partner Scalability
- ADR-018 Amendment 001 — Partner Deployment

## Enterprise Integration Patterns

- EIP-001 — Event Notification
- EIP-002 — Publish-Subscribe Channel
- EIP-003 — Event Stream
- EIP-004 — Command Message
- EIP-005 — Request-Reply
- EIP-006 — Message Router
- EIP-007 — Content-Based Router
- EIP-008 — Recipient List
- EIP-009 — Dead Letter Channel
- EIP-010 — Retry and Redelivery
- EIP-011 — Idempotent Consumer
- EIP-012 — Message Filter
- EIP-013 — Saga Orchestration
- EIP-014 — Transactional Outbox
- EIP-015 — Correlation and Distributed Tracing
- EIP-016 — Human-in-the-Loop Routing
- EIP-017 — External Partner Adapter / Gateway

## User Experience Architecture

- UXA-001 — Shopping Experience Architecture

## AI Architecture

- AIA-001 — AI Society Architecture

## Architectural Governance

All new architecture documents must:

1. Identify their architectural scope and ownership boundaries.
2. Identify dependencies and affected architecture records.
3. Perform a forward-consistency check where an architectural decision changes existing decisions or patterns.
4. Preserve source-of-truth ownership within the responsible domain.
5. Keep implementation-specific details out of architectural documents unless they have architectural significance.
6. Record external integrations through explicit boundaries rather than hard-coding third-party providers into core domain architecture.
