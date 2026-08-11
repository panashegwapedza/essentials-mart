# ADR-005 — Data Ownership & Database Boundaries

**Status:** Proposed
**Date:** 2026-08-11
**Decision Type:** Data

---

## 1. Context

ADR-002 established that Essentials Mart will be organised around explicit enterprise domains with defined responsibilities and ownership.

ADR-003 established event-driven communication between domains.

ADR-004 established domain-aligned APIs and services as the controlled mechanism through which applications, AI agents, and integrations interact with enterprise capabilities.

The next architectural requirement is to determine how enterprise data is owned and accessed.

Essentials Mart will contain significant amounts of interconnected information, including:

* Customers
* Households
* Products
* Inventory
* Shopping carts
* Orders
* Payments
* Fulfilment
* Deliveries
* Store information
* Notifications
* AI interactions
* Intelligence outputs
* Preferences
* Audit records
* Operational information

Because these entities interact across domains, it is possible for multiple systems to attempt to maintain copies of the same information.

Without explicit ownership, the platform could develop:

* conflicting sources of truth;
* duplicated business rules;
* uncontrolled database access;
* tightly coupled schemas;
* inconsistent data;
* difficult migrations;
* security vulnerabilities;
* and unclear responsibility when data becomes incorrect.

---

## 2. Problem

Essentials Mart needs a definitive architectural model for:

* determining which domain owns an entity;
* determining which system is authoritative for a piece of information;
* controlling access to domain data;
* preventing direct cross-domain database manipulation;
* managing derived and replicated data;
* supporting eventual consistency;
* and allowing the database architecture to evolve without destroying domain boundaries.

The database must therefore reflect the enterprise architecture rather than become the architecture itself.

---

## 3. Decision

Essentials Mart will adopt **explicit domain-based data ownership and database boundaries**.

The following principles will apply:

1. Every authoritative enterprise entity must have a clearly defined owning domain.
2. The owning domain is responsible for the lifecycle and integrity of its authoritative data.
3. Other domains may consume authorised data but do not become owners merely because they store a copy.
4. Direct cross-domain database writes are prohibited as a normal integration mechanism.
5. Domain data will be accessed through authorised domain capabilities, APIs, commands, queries, or approved integration mechanisms.
6. Derived data may exist outside the owning domain when required for performance, analytics, search, AI, or operational purposes.
7. Derived copies must never silently become competing sources of truth.
8. Events may be used to propagate changes to authorised consumers.
9. Sensitive data must have explicit access controls.
10. Database schemas must reflect domain ownership and architectural boundaries.
11. Aggregate boundaries and transactional boundaries will be defined as part of the Information Architecture.
12. The physical database deployment model may evolve independently from logical domain ownership.

Essentials Mart will therefore distinguish between:

**Logical ownership**

and

**Physical storage.**

A single physical database may initially contain multiple domains while still maintaining logical ownership and access boundaries.

---

## 4. Rationale

A domain-driven data ownership model prevents the database from becoming a shared workspace where every component can modify everything.

For example:

```text
Commerce Domain
      │
      └── owns Order
             │
             ├── Fulfilment → consumes order information
             ├── Delivery   → consumes relevant order state
             ├── Notification → reacts to order events
             └── Intelligence → analyses authorised data
```

Fulfilment does not become the owner of the order merely because it stores information about fulfilment activity associated with that order.

Likewise, an AI system may maintain analytical or contextual representations of an order without becoming the authoritative owner of the order itself.

This creates a clear distinction between:

> **Authoritative enterprise state**

and

> **Derived, contextual, cached, analytical, or intelligence data.**

That distinction becomes increasingly important as Essentials Mart grows into an AI-enabled enterprise platform.

---

## 5. Architectural Principles Affected

This decision establishes or reinforces:

* Single source of truth
* Domain ownership
* Data sovereignty
* Separation of concerns
* Least-privilege data access
* API-first integration
* Event-driven propagation
* Security by design
* Auditability
* Data integrity
* Independent evolution
* Logical/physical architecture separation

---

## 6. Alternatives Considered

### Alternative A — Fully Shared Database

**Description:**
Allow every domain and service to directly access and modify all relevant tables.

**Why not selected:**
This creates strong coupling, unclear ownership, security risks, and makes schema changes difficult.

---

### Alternative B — Separate Database for Every Domain Immediately

**Description:**
Create a physically independent database for every domain from the beginning.

**Why not selected:**
Physical separation may eventually be appropriate for some domains, but enforcing it everywhere from the beginning introduces unnecessary operational complexity.

Logical ownership should be established first.

---

### Alternative C — Application-Owned Data

**Description:**
Allow each application, such as Flutter or WhatsApp, to maintain its own authoritative business data.

**Why not selected:**
Applications are channels rather than enterprise domains. This would create multiple competing sources of truth.

---

### Alternative D — Domain-Owned Data with Controlled Physical Deployment

**Description:**
Establish authoritative ownership at the domain level while allowing physical database topology to evolve.

**Why selected:**
This preserves domain integrity while allowing Essentials Mart to choose an appropriate physical architecture as requirements mature.

---

## 7. Consequences

### Positive

* Clear ownership of enterprise data.
* Reduced data conflicts.
* Stronger security boundaries.
* Easier domain evolution.
* Better auditability.
* Controlled database access.
* Supports AI-derived data without compromising authoritative state.
* Supports caching and analytics safely.
* Enables future database decomposition.
* Provides a strong foundation for Information Architecture.

### Negative

* Cross-domain workflows require deliberate integration.
* Some queries may require aggregation across domains.
* Eventual consistency may occur.
* Data ownership must be actively governed.
* Developers cannot take shortcuts through direct database access.

### Neutral / Trade-offs

* Multiple domains may initially share one physical database.
* Domain isolation can increase gradually as the platform matures.
* Some read models may intentionally duplicate data for performance.

---

## 8. Domain Impact

| Domain           | Example Authoritative Data                                     | Ownership Responsibility  |
| ---------------- | -------------------------------------------------------------- | ------------------------- |
| Identity         | Identity records, credentials references, access relationships | Identity lifecycle        |
| Customer         | Customer profile and customer-specific information             | Customer lifecycle        |
| Household        | Household membership and household context                     | Household lifecycle       |
| Product          | Product identity and canonical product information             | Product lifecycle         |
| Inventory        | Stock state and inventory movements                            | Inventory lifecycle       |
| Commerce         | Carts, orders and commercial state                             | Commerce lifecycle        |
| Fulfilment       | Picking, packing and fulfilment state                          | Fulfilment lifecycle      |
| Delivery         | Delivery assignments and delivery state                        | Delivery lifecycle        |
| Communication    | Communication and notification state                           | Communication lifecycle   |
| Store Operations | Store operational state                                        | Store lifecycle           |
| AI Society       | Agent coordination state                                       | AI coordination lifecycle |
| Intelligence     | Intelligence outputs and derived models                        | Intelligence lifecycle    |

The definitive ownership catalogue will be established during Information Architecture.

---

## 9. Data Impact

This ADR establishes that each authoritative entity must have:

* An owning domain.
* A defined lifecycle.
* A defined identifier.
* A defined access policy.
* A defined authoritative storage location.
* Defined relationships with other domains.

The future enterprise data model will define:

* Entities
* Value objects
* Aggregates
* Aggregate roots
* Relationships
* Identifiers
* Ownership
* Lifecycle
* Data classification

The database must implement this logical model rather than independently redefining it.

**Data impact:** Foundational.

---

## 10. Event Impact

Events become an important mechanism for propagating authorised changes without transferring ownership.

For example:

```text
Inventory Domain
      │
      │ InventoryAvailabilityChanged
      ▼
Event Backbone
      │
      ├── Commerce
      ├── Intelligence
      └── Store Operations
```

Consumers may maintain appropriate derived representations, but the Inventory domain remains authoritative for inventory state.

Events therefore communicate changes without creating shared ownership.

**Event impact:** High.

---

## 11. API / Integration Impact

Cross-domain data access should occur through controlled mechanisms.

These may include:

* Domain APIs
* Queries
* Commands
* Events
* Authorised service interfaces
* Approved read models

The following pattern is prohibited as a normal integration mechanism:

```text
Domain A
   │
   └── Direct SQL
          │
          ▼
Domain B's authoritative tables
```

Instead:

```text
Domain A
   │
   ▼
Domain B API / Event / Approved Interface
   │
   ▼
Domain B
```

**Integration impact:** High.

---

## 12. Security Impact

Data ownership establishes an important security boundary.

Access to data must consider:

* User identity
* Service identity
* Domain ownership
* Role
* Permission
* Data classification
* AI-agent authority
* Operational context

Sensitive information must not become broadly accessible simply because it exists within a shared physical database.

Database credentials and service permissions should therefore follow least-privilege principles.

Auditability must be maintained for significant data access and mutation.

**Security impact:** High.

---

## 13. AI / Intelligence Impact

AI introduces additional requirements for data ownership.

AI agents and Intelligence Engines may:

* Read authorised information.
* Generate recommendations.
* Produce derived intelligence.
* Maintain contextual representations.
* Request authorised enterprise actions.

They must not silently become authoritative owners of enterprise entities.

For example:

```text
Product Domain
      │
      │ Authoritative Product Data
      ▼
Intelligence Engine
      │
      │ Derived Intelligence
      ▼
Recommendation
```

The Intelligence Engine owns its **derived intelligence**, not the underlying Product entity.

Similarly:

```text
Commerce Domain
      │
      │ Order
      ▼
AI Agent
      │
      └── Recommendation / Action Request
```

The AI agent does not become the owner of the order.

**AI impact:** High.

---

## 14. Implementation Implications

The Information Architecture phase must establish:

* Enterprise entity catalogue
* Entity ownership
* Aggregate boundaries
* Aggregate roots
* Identifiers
* Relationships
* Data lifecycle
* Data classification
* Access policies
* Cross-domain references
* Derived data
* Read models
* Event propagation requirements

The database architecture will then map these decisions into physical structures.

The Supabase implementation must therefore follow the enterprise data model rather than becoming the source of architectural decisions.

---

## 15. Dependencies

This ADR depends upon:

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture

It establishes the foundation for:

* Phase 2 — Information Architecture
* Database design
* Entity catalogue
* Relationship catalogue
* Aggregate boundaries
* Naming conventions
* Security policies
* AI data access
* Analytics and intelligence architecture

---

## 16. Related Architecture Documents

* `EDA-001-enterprise-data-architecture.md`
* `DOMAINS.md`
* `EVENT-ARCHITECTURE.md`
* `SECURITY-ARCHITECTURE.md`

Future database documentation:

* `enterprise-data-model.md`
* `entity-catalog.md`
* `relationship-catalog.md`
* `naming-conventions.md`

---

## 17. Related ADRs

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture
* ADR-006 — Identity, Authentication & Authorisation
* ADR-007 — AI Society Architecture
* ADR-008 — Intelligence Engine Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-016 — Observability, Auditability & Trust

---

## 18. Decision Lifecycle

**Current Status:** Proposed

### Review Conditions

This ADR should be reviewed if:

* Domain ownership changes.
* A major entity cannot be cleanly assigned to one domain.
* Physical database requirements require a fundamentally different topology.
* Regulatory requirements introduce new data sovereignty requirements.
* AI capabilities require new categories of data ownership.
* Multi-store expansion introduces new ownership requirements.

### Supersession

If this decision is replaced, the replacement ADR must reference ADR-005 and explain why the data ownership model has changed.

---

## 19. Final Decision

> **Essentials Mart will establish authoritative data ownership at the enterprise-domain level. Domains will own the lifecycle and integrity of their authoritative data, while other domains, applications, AI agents, and Intelligence Engines will access or derive information through controlled interfaces. Logical data ownership will remain independent of physical database deployment, allowing the database architecture to evolve without compromising domain boundaries.**

**ADR-005 remains authoritative unless superseded by a subsequent ADR.**
