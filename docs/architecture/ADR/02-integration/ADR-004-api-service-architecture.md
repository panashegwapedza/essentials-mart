# ADR-004 — API & Service Architecture

**Status:** Proposed
**Date:** 2026-08-11
**Decision Type:** Integration

---

## 1. Context

ADR-002 established that Essentials Mart will be organised around explicit enterprise domains.

ADR-003 established event-driven architecture as the primary mechanism for appropriate asynchronous cross-domain communication.

The platform will nevertheless require synchronous communication for many operations.

Examples include:

* Creating a shopping cart
* Adding a product to a cart
* Retrieving product information
* Checking inventory availability
* Creating an order
* Requesting delivery information
* Authenticating a user
* Updating household preferences
* Requesting an AI recommendation
* Retrieving current account information

Essentials Mart will also have multiple consumers of its enterprise capabilities:

* Flutter application
* WhatsApp
* AI agents
* Administrative applications
* Store operations
* Delivery operations
* Future clients
* External integrations

The architecture therefore needs a consistent model for exposing enterprise capabilities without allowing individual applications to own or duplicate business logic.

---

## 2. Problem

Without a defined API and service architecture, different parts of the platform could implement their own communication patterns.

This could result in:

* duplicated business logic;
* inconsistent APIs;
* direct database access from clients;
* tightly coupled services;
* unclear service responsibilities;
* inconsistent authentication;
* uncontrolled AI access;
* difficult API evolution;
* and dependency on specific client implementations.

Essentials Mart requires a consistent architecture for exposing enterprise capabilities while preserving domain ownership and allowing the platform to evolve.

---

## 3. Decision

Essentials Mart will use **contract-driven APIs and domain-aligned services** as the primary mechanism for synchronous interaction with enterprise capabilities.

The architecture will follow these principles:

1. APIs expose enterprise capabilities rather than database tables.
2. Services align primarily with domain responsibilities.
3. Business rules remain within the appropriate domain/service boundary.
4. Clients do not directly access enterprise databases.
5. AI agents interact with enterprise capabilities through authorised APIs and services.
6. APIs and events are complementary rather than competing mechanisms.
7. API contracts must be versionable and evolvable.
8. Authentication and authorisation must be enforced at appropriate boundaries.
9. Internal implementation details must not become accidental public contracts.
10. Services should remain independently understandable even when deployed together.
11. Service boundaries should be derived from business responsibility rather than arbitrary technical decomposition.
12. External integrations should use controlled integration boundaries.

The architecture will **not mandate immediate microservice deployment**.

A domain-aligned service may initially operate within a modular backend deployment and later become independently deployable if operational requirements justify the separation.

---

## 4. Rationale

APIs provide a stable contract between enterprise capabilities and their consumers.

For example:

```text id="w9h2js"
Flutter
   │
   ▼
Commerce API
   │
   ▼
Commerce Domain
   │
   └── Order
```

The Flutter application does not need to understand how the order is stored.

Likewise:

```text id="r2e6mx"
WhatsApp
   │
   ▼
Communication / AI Interface
   │
   ▼
Authorised Enterprise Capability
```

and:

```text id="p3z0ek"
AI Agent
   │
   ▼
Authorised API
   │
   ▼
Domain Service
```

This allows the same enterprise capability to be reused across channels.

It also prevents the Flutter application, WhatsApp integration, or AI Society from becoming alternative implementations of enterprise business logic.

---

## 5. Architectural Principles Affected

This decision establishes or reinforces:

* Domain ownership
* Contract-driven integration
* API-first architecture
* Separation of concerns
* Channel independence
* Security by design
* AI governance
* Service autonomy
* Evolvability
* Loose coupling
* Reusable enterprise capabilities

---

## 6. Alternatives Considered

### Alternative A — Direct Database Access

**Description:**
Allow clients and services to access shared database tables directly.

**Why not selected:**
This bypasses domain ownership, exposes implementation details, creates tight coupling, and makes database changes dangerous.

---

### Alternative B — Client-Specific APIs

**Description:**
Create separate business implementations for Flutter, WhatsApp, AI agents, and other clients.

**Why not selected:**
This duplicates business logic and creates inconsistent enterprise behaviour.

---

### Alternative C — Immediate Microservices

**Description:**
Create an independently deployable service for every domain from the beginning.

**Why not selected:**
This introduces operational complexity before the domain and workload boundaries have demonstrated a need for independent deployment.

---

### Alternative D — Domain-Aligned API and Service Architecture

**Description:**
Expose domain capabilities through controlled APIs and services while allowing deployment topology to evolve independently.

**Why selected:**
This preserves domain ownership while allowing Essentials Mart to begin with an appropriately manageable deployment model and evolve toward greater service independence when justified.

---

## 7. Consequences

### Positive

* Consistent enterprise interfaces.
* Reusable capabilities across clients.
* Reduced business-logic duplication.
* Stronger domain boundaries.
* Easier API evolution.
* Controlled AI access.
* Better security boundaries.
* Easier integration with WhatsApp and future channels.
* Clearer service ownership.
* Ability to evolve deployment topology independently.

### Negative

* API contracts require governance.
* Versioning introduces additional responsibility.
* Service boundaries require careful design.
* Distributed API calls can introduce latency.
* Authentication and authorisation become more complex.
* Poorly designed APIs can become long-term constraints.

### Neutral / Trade-offs

* Not every domain needs to become a separate deployable service.
* Internal service calls may remain local when appropriate.
* Some operations will use synchronous APIs while others use asynchronous events.

---

## 8. Domain Impact

| Domain           | Impact | Responsibility                               |
| ---------------- | ------ | -------------------------------------------- |
| Identity         | High   | Identity and access APIs                     |
| Customer         | High   | Customer capabilities                        |
| Household        | High   | Household capabilities                       |
| Product          | High   | Product information and product capabilities |
| Inventory        | High   | Availability and inventory capabilities      |
| Commerce         | High   | Cart, order and transaction capabilities     |
| Fulfilment       | High   | Fulfilment operations                        |
| Delivery         | High   | Delivery capabilities                        |
| Customer Support | Medium | Support capabilities                         |
| Communication    | High   | Notification and communication capabilities  |
| AI Society       | High   | Governed AI capability access                |
| Intelligence     | High   | Intelligence Engine interfaces               |
| Store Operations | High   | Store-related enterprise capabilities        |

Detailed service boundaries will be established as part of backend architecture.

---

## 9. Data Impact

APIs will expose **business capabilities and authorised views of data**, rather than exposing raw database structures.

For example, a product API may return:

```text id="glr7fo"
Product
├── id
├── name
├── description
├── price
├── availability
└── relevant attributes
```

rather than exposing internal database tables and relationships.

Domain ownership established in ADR-002 remains authoritative.

API consumers must not become independent owners of enterprise data.

**Data impact:** High.

---

## 10. Event Impact

APIs and events will have distinct responsibilities.

### API

Used when a consumer needs to:

* request an operation;
* submit a command;
* retrieve current information;
* receive an immediate response.

### Event

Used when:

* a meaningful state change has occurred;
* other systems need to react asynchronously;
* the producer should not need to know every consumer.

Example:

```text id="az3t2s"
POST /orders
      │
      ▼
Commerce Domain
      │
      ├── Response → API consumer
      │
      └── OrderCreated → Event Backbone
```

**Event impact:** Medium.

---

## 11. API / Integration Impact

This ADR establishes the following API principles.

### API Boundaries

APIs should correspond to meaningful enterprise capabilities.

### API Contracts

Contracts should define:

* Request structures
* Response structures
* Error behaviour
* Authentication requirements
* Authorisation requirements
* Validation rules
* Versioning
* Idempotency where required

### API Types

Essentials Mart may use different API mechanisms where appropriate, including:

* REST APIs
* Internal service interfaces
* Webhooks
* Real-time interfaces
* Future specialised protocols

The architecture does not require every capability to use one protocol.

### API Consumers

Consumers may include:

* Flutter
* Web or administrative clients
* WhatsApp
* AI agents
* Store systems
* Delivery systems
* External integrations

All consumers remain subject to the same enterprise domain ownership and security boundaries.

**Integration impact:** Foundational.

---

## 12. Security Impact

API boundaries will enforce appropriate security controls.

These include:

* Authentication
* Authorisation
* Role-based access
* Permission-based access
* Service identities
* AI-agent permissions
* Rate limiting
* Input validation
* Output filtering
* Abuse prevention
* Audit logging
* Secure transport
* Secret management

Sensitive capabilities must not be exposed merely because they exist within an internal service.

AI agents will receive only the API capabilities necessary for their authorised responsibilities.

Detailed identity and authorisation architecture will be established in ADR-006.

**Security impact:** High.

---

## 13. AI / Intelligence Impact

The API architecture becomes the controlled interface between AI and enterprise capabilities.

For example:

```text id="yrk4oa"
AI Agent
   │
   │ Authorised command
   ▼
Enterprise API
   │
   ▼
Domain Service
   │
   ▼
Enterprise State
```

An AI agent should not bypass the API/service boundary to directly manipulate databases.

This creates an important distinction:

> **AI may be intelligent, but it does not automatically possess enterprise authority.**

Authority will be determined through identity, permissions, governance, and potentially human approval.

This architecture also allows the same capability to be used by humans, applications, and AI without duplicating business logic.

**AI impact:** High.

---

## 14. Implementation Implications

The backend architecture must subsequently define:

* Domain services
* API boundaries
* API contracts
* Command interfaces
* Query interfaces
* Authentication middleware
* Authorisation mechanisms
* Error standards
* API versioning
* Idempotency
* Rate limiting
* Service-to-service communication
* Event integration
* Observability
* API documentation

The final API and service catalogue will be developed during Phase 3 — Backend Architecture.

---

## 15. Dependencies

This ADR depends upon:

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-003 — Event-Driven Architecture

It establishes the foundation for:

* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation
* ADR-007 — AI Society Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-011 — Notification & Communication Architecture
* ADR-012 — WhatsApp Integration Architecture
* ADR-013 — Flutter Client Architecture
* ADR-017 — Scalability & Multi-Store Architecture
* ADR-018 — Deployment & Environment Strategy

---

## 16. Related Architecture Documents

* `EDA-001-enterprise-data-architecture.md`
* `DOMAINS.md`
* `EVENT-ARCHITECTURE.md`
* `SECURITY-ARCHITECTURE.md`
* `DEPLOYMENT-ARCHITECTURE.md`
* `AI-001-ai-society.md`

---

## 17. Related ADRs

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-003 — Event-Driven Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation
* ADR-007 — AI Society Architecture
* ADR-009 — AI Agent Governance & Permissions

---

## 18. Decision Lifecycle

**Current Status:** Proposed

### Review Conditions

This ADR should be reviewed if:

* API requirements fundamentally change.
* Service boundaries prove unsuitable.
* A new communication protocol becomes necessary.
* Platform scale requires a different service topology.
* Regulatory requirements change API security requirements.
* AI capabilities require new enterprise interaction mechanisms.
* Independent service deployment becomes necessary for specific domains.

### Supersession

If this decision is replaced, the replacement ADR must reference ADR-004 and explain why the API and service architecture has changed.

---

## 19. Final Decision

> **Essentials Mart will expose enterprise capabilities through contract-driven, domain-aligned APIs and services. Clients, AI agents, and integrations will interact with enterprise capabilities through authorised interfaces rather than directly accessing enterprise databases or duplicating business logic. Service deployment boundaries may evolve independently from domain boundaries as operational requirements mature.**

**ADR-004 remains authoritative unless superseded by a subsequent ADR.**
