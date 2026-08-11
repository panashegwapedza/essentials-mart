# ADR-002 — Domain-Driven Enterprise Architecture

**Status:** Proposed
**Date:** 2026-08-11
**Decision Type:** Domain

---

## 1. Context

ADR-001 established that Essentials Mart will be designed around explicit enterprise domains with clear ownership and separation of responsibilities.

Essentials Mart contains multiple business capabilities that interact with one another, including:

* Customers
* Households
* Products
* Inventory
* Commerce
* Fulfilment
* Delivery
* Customer Support
* Identity
* Notifications and Communication
* AI Society
* Intelligence Engines
* Store Operations
* Walk Mode

Without clearly defined boundaries, these capabilities could become tightly coupled.

For example, a customer-facing application could begin implementing inventory rules, an AI agent could directly manipulate order data, or multiple services could independently maintain product or customer information.

As the platform expands into multiple stores, AI-driven workflows, WhatsApp, Walk Mode, and additional channels, such coupling would make the system increasingly difficult to maintain and evolve.

---

## 2. Problem

Essentials Mart requires a consistent method for determining:

* Which business capability owns a responsibility;
* Which domain owns particular data;
* Where business rules belong;
* Which domains may communicate with one another;
* How domain boundaries should be maintained;
* How applications and AI agents interact with domains;
* And how the architecture can evolve without creating uncontrolled dependencies.

Without explicit domain boundaries, business logic and data ownership will gradually become distributed across applications and services without a coherent architectural model.

---

## 3. Decision

Essentials Mart will adopt a **Domain-Driven Enterprise Architecture** in which major business capabilities are represented as explicit enterprise domains with defined responsibilities, ownership boundaries, interfaces, and lifecycle responsibilities.

Each domain will:

1. Own clearly defined business responsibilities.
2. Own the authoritative data associated with those responsibilities.
3. Contain or govern the business rules required to fulfil its responsibilities.
4. Expose capabilities through defined contracts.
5. Publish relevant domain or integration events.
6. Consume events and services from other domains where required.
7. Prevent external components from directly modifying its internal state without authorised domain mechanisms.
8. Maintain clear boundaries between its internal implementation and external consumers.

The domain model will be established independently from the user interface and implementation technology.

Applications, AI agents, services, and integrations will consume domain capabilities rather than becoming alternative owners of domain responsibilities.

---

## 4. Rationale

Domain-driven architecture provides Essentials Mart with a stable method for organising a complex enterprise.

It allows the platform to distinguish between:

**What the enterprise does**

and

**How the technology implements it.**

This distinction is important because the same business capability may eventually be consumed by:

* Flutter;
* WhatsApp;
* AI agents;
* staff applications;
* administrative systems;
* Walk Mode;
* external integrations;
* and future applications.

Domain ownership therefore becomes the stable architectural layer beneath those channels.

It also prevents the AI Society from becoming a collection of agents with unrestricted access to unrelated business capabilities.

An AI agent should interact with the appropriate domain rather than bypassing domain boundaries.

---

## 5. Architectural Principles Affected

This decision establishes or reinforces:

* Domain ownership
* Separation of concerns
* Single source of truth
* API-first integration
* Event-driven communication
* Channel independence
* AI governance
* Security by design
* Long-term evolution

---

## 6. Alternatives Considered

### Alternative A — Application-Centred Architecture

**Description:**
Organise the system primarily around applications and screens.

**Why not selected:**
Applications are interaction channels, not stable representations of enterprise responsibilities. This would encourage business logic to become duplicated across clients.

---

### Alternative B — Technical-Layer Architecture

**Description:**
Organise the enterprise primarily around technical layers such as controllers, repositories, databases, and UI components.

**Why not selected:**
Technical layers describe implementation structure but do not provide clear ownership of business capabilities.

---

### Alternative C — Shared Business Logic

**Description:**
Allow multiple applications and services to directly share and manipulate common business logic and data.

**Why not selected:**
This creates hidden coupling, unclear ownership, conflicting business rules, and difficulty changing individual capabilities independently.

---

### Alternative D — Domain-Driven Enterprise Architecture

**Description:**
Define explicit business domains with clear responsibilities, ownership, boundaries, contracts, and events.

**Why selected:**
This provides the clearest foundation for a complex, multi-channel, AI-enabled enterprise platform.

---

## 7. Consequences

### Positive

* Clear business ownership.
* Clear data ownership.
* Reduced coupling.
* Easier system evolution.
* Reusable enterprise capabilities.
* Better alignment between business and technology.
* Controlled AI interaction with enterprise capabilities.
* Easier integration of new channels.
* Better support for multiple stores.
* Stronger foundation for event-driven architecture.

### Negative

* Domain boundaries require careful analysis.
* Some business processes will cross multiple domains.
* Additional integration contracts are required.
* Incorrect domain boundaries can create unnecessary complexity.
* Domains must be actively governed as the enterprise evolves.

### Neutral / Trade-offs

* A domain does not necessarily equal a deployable service.
* Multiple domains may initially exist within the same deployment unit.
* Domain boundaries represent business responsibility; deployment boundaries can evolve independently.

---

## 8. Domain Impact

The following domains are expected to be affected by this decision:

| Domain           | Impact | Responsibility                                                      |
| ---------------- | ------ | ------------------------------------------------------------------- |
| Customer         | High   | Customer identity and customer-facing business context              |
| Household        | High   | Household relationships, membership, preferences and shared context |
| Product          | High   | Product identity and product information                            |
| Inventory        | High   | Stock state and inventory operations                                |
| Commerce         | High   | Shopping, carts, orders and transactions                            |
| Fulfilment       | High   | Order preparation and fulfilment                                    |
| Delivery         | High   | Delivery planning and execution                                     |
| Customer Support | Medium | Support cases and human assistance                                  |
| Identity         | High   | Authentication, authorisation and identity                          |
| Communication    | Medium | Notifications and communication workflows                           |
| Store Operations | High   | Physical-store operational context                                  |
| AI Society       | High   | AI-agent coordination                                               |
| Intelligence     | High   | Intelligence Engines and decision-support                           |

These domains are provisional until formally established in `DOMAINS.md`.

---

## 9. Data Impact

Each domain will have clearly defined authoritative data ownership.

Examples include:

```text
Customer Domain
    → Customer information

Household Domain
    → Household membership and household context

Product Domain
    → Product information

Inventory Domain
    → Inventory state

Commerce Domain
    → Cart and order state

Delivery Domain
    → Delivery state
```

The exact entity ownership model, aggregate boundaries, identifiers, and relationships will be established during Phase 2 — Information Architecture.

**Data impact:** High.

---

## 10. Event Impact

Domains will communicate important state changes through domain and integration events where appropriate.

For example:

```text
Commerce
   │
   └── OrderCreated
           │
           ├── Fulfilment
           ├── Inventory
           ├── Notification
           └── Intelligence
```

Events will represent meaningful changes in domain state rather than arbitrary technical activity.

The definitive event catalogue and event ownership model will be established in `EVENT-ARCHITECTURE.md` and ADR-003.

**Event impact:** High.

---

## 11. API / Integration Impact

Domains will expose capabilities through defined contracts.

External consumers should interact with a domain through:

* APIs;
* domain services;
* authorised commands;
* events;
* or approved integration mechanisms.

Direct access to another domain's internal database or internal implementation will not be considered the normal integration mechanism.

This applies to:

* Flutter;
* administrative applications;
* staff applications;
* AI agents;
* WhatsApp;
* Walk Mode;
* and external integrations.

**Integration impact:** High.

---

## 12. Security Impact

Domain boundaries will become security boundaries where appropriate.

Access to a domain capability should be determined by:

* identity;
* role;
* permissions;
* service identity;
* AI-agent authority;
* data sensitivity;
* and operational context.

A user or AI agent should not receive unrestricted access merely because another component can technically reach a database or service.

Detailed identity and authorisation mechanisms will be established in ADR-006.

**Security impact:** High.

---

## 13. AI / Intelligence Impact

AI agents will operate through domain capabilities rather than bypassing domain ownership.

For example:

```text
Customer AI Agent
       │
       ▼
Commerce Capability
       │
       ▼
Order Domain
```

rather than:

```text
AI Agent
   │
   └── Direct database manipulation
```

Intelligence Engines may consume information from multiple domains where authorised, but they will not automatically become owners of the underlying domain data.

The AI Society will therefore depend upon domain contracts and permissions.

**AI impact:** High.

---

## 14. Implementation Implications

The architecture must establish:

* Domain catalogue
* Domain responsibilities
* Domain boundaries
* Domain ownership
* Entity ownership
* Aggregate boundaries
* Domain services
* Commands
* Events
* Integration contracts
* Cross-domain workflows
* Domain security boundaries

The resulting model must be documented in:

`docs/architecture/DOMAINS.md`

and subsequently reflected in the Information Architecture.

---

## 15. Dependencies

This ADR depends upon:

* ADR-001 — Enterprise Architecture Principles

It establishes the foundation for:

* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation
* ADR-007 — AI Society Architecture
* ADR-008 — Intelligence Engine Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-010 — Human-in-the-Loop Architecture
* ADR-014 — Walk Mode / Living Digital Supermarket
* ADR-017 — Scalability & Multi-Store Architecture

---

## 16. Related Architecture Documents

* `EDA-001-enterprise-data-architecture.md`
* `DOMAINS.md`
* `EVENT-ARCHITECTURE.md`
* `SECURITY-ARCHITECTURE.md`
* `AI-001-ai-society.md`

---

## 17. Related ADRs

* ADR-001 — Enterprise Architecture Principles
* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation
* ADR-007 — AI Society Architecture

---

## 18. Decision Lifecycle

**Current Status:** Proposed

### Review Conditions

This ADR should be reviewed if:

* The enterprise business model changes substantially.
* A domain boundary proves consistently incorrect.
* A major business capability cannot be represented within the existing domain model.
* Regulatory requirements require a different ownership structure.
* Multi-store expansion introduces new domain requirements.
* AI capabilities require a fundamental change to domain interaction.

### Supersession

If this decision is replaced, the replacement ADR must reference ADR-002 and explain why the domain-driven model has changed.

---

## 19. Final Decision

> **Essentials Mart will organise its enterprise capabilities around explicit business domains with defined responsibilities, authoritative ownership, controlled interfaces, and clear boundaries. Applications, services, AI agents, and integrations will consume domain capabilities rather than becoming independent owners of enterprise responsibilities or data.**

**ADR-002 remains authoritative unless superseded by a subsequent ADR.**
