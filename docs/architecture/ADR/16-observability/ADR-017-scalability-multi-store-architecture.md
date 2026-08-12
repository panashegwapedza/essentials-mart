# ADR-017 — Scalability & Multi-Store Architecture

**Status:** Proposed  
**Date:** 2026-08-12  
**Decision Type:** Scalability & Multi-Store Architecture

---

## 1. Context

Essentials Mart is intended to operate as an enterprise retail platform rather than as a single-store application.

The architecture must therefore support growth from an initial store or deployment into a platform capable of serving:

- Multiple physical stores;
- Multiple store locations;
- Multiple geographic regions;
- Multiple operational environments;
- Large numbers of users;
- Large product catalogues;
- Large transaction volumes;
- Distributed inventory;
- Store-specific operations;
- Shared enterprise capabilities;
- AI services operating across multiple stores;
- Walk Mode operating within individual store environments.

The architecture must support this growth without requiring the platform to be fundamentally redesigned when additional stores are introduced.

Scalability must therefore be considered a foundational architectural concern.

---

## 2. Problem

A single-store architecture can create assumptions that become difficult to remove later.

Examples include:

- Treating a store as a global singleton;
- Storing inventory without store context;
- Treating pricing as universally applicable;
- Assuming one fulfilment location;
- Assuming one operational staff structure;
- Assuming one delivery area;
- Assuming one store layout;
- Assuming one set of business rules;
- Allowing AI agents to operate without store context;
- Allowing Walk Mode to operate without identifying the active store;
- Coupling user activity directly to one physical location.

These assumptions could create significant migration and scaling problems as Essentials Mart expands.

The platform therefore requires explicit multi-store and scalability boundaries from the beginning.

---

## 3. Decision

Essentials Mart will use a scalable, multi-store enterprise architecture in which store context is an explicit architectural concept.

The architecture will distinguish between:

- Enterprise-wide capabilities;
- Regional capabilities;
- Store-level capabilities;
- User-level capabilities;
- Household-level capabilities;
- Transaction-level context;
- AI and intelligence context.

The platform will support horizontal scaling of services where appropriate and will avoid architectural assumptions that restrict the platform to a single store.

A store will be treated as an identifiable operational context rather than as a hard-coded application instance.

---

## 4. Architectural Principles

The architecture adopts the following principles.

### 4.1 Store Context Must Be Explicit

Where a business operation depends on a physical store, the relevant store context must be explicitly represented.

### 4.2 Enterprise Capabilities Must Not Be Duplicated Unnecessarily

Capabilities that logically belong to the enterprise should not be recreated independently for every store without a valid domain reason.

### 4.3 Store-Specific Behaviour Must Remain Isolated

Store-specific data, configuration, inventory, operations, and permissions must not unintentionally leak across stores.

### 4.4 Horizontal Scaling Should Be Preferred Where Appropriate

Services should be capable of scaling horizontally where workload characteristics support it.

### 4.5 Scaling Must Preserve Domain Boundaries

Scaling the platform must not require abandoning domain ownership or creating uncontrolled shared data dependencies.

### 4.6 AI Must Respect Store Context

AI agents and intelligence engines must receive the appropriate store context when their task depends on physical-store information.

### 4.7 Walk Mode Must Be Store-Bound

A Walk Mode session must operate against the active store environment and its associated layout, inventory, routes, and operational context.

---

## 5. Multi-Store Model

Essentials Mart will conceptually support:

```text
Enterprise
   |
   +---- Region
   |      |
   |      +---- Store
   |      |      |
   |      |      +---- Inventory
   |      |      +---- Layout
   |      |      +---- Operations
   |      |      +---- Staff
   |      |      +---- Fulfilment
   |      |      +---- Local Configuration
   |      |
   |      +---- Store
   |
   +---- Region
          |
          +---- Store
```

The exact organisational hierarchy may evolve as the enterprise expands.

The architecture must nevertheless preserve explicit boundaries between enterprise, regional, and store concerns.

---

## 6. Store Identity

Every physical store participating in the platform must have a unique and stable store identity.

Store identity should be available wherever required for:

- Inventory;
- Pricing;
- Product availability;
- Store layout;
- Walk Mode;
- Orders;
- Fulfilment;
- Delivery;
- Staff operations;
- Notifications;
- Analytics;
- AI context;
- Customer support.

Store identifiers must not be inferred solely from mutable names or addresses.

---

## 7. Store Context

A request or workflow may require one or more contextual dimensions, including:

- User;
- Household;
- Store;
- Region;
- Order;
- Session;
- Walk Mode session;
- AI execution.

The platform must preserve the relevant context throughout the lifecycle of a workflow.

Where store context is required, downstream services must not silently substitute another store.

---

## 8. Store Isolation

Store-specific information must be logically isolated.

This includes:

- Inventory;
- Store layouts;
- Local pricing where applicable;
- Local promotions;
- Store-specific operational configuration;
- Staff assignments;
- Store-specific fulfilment;
- Store-specific availability.

The architecture must prevent accidental cross-store access.

Authorisation must be evaluated alongside store context.

---

## 9. Enterprise-Level Data

Some information is naturally enterprise-wide.

Examples may include:

- Product master information;
- Brand information;
- Enterprise policies;
- AI governance policies;
- Platform configuration;
- Global user identity;
- Enterprise-level analytics;
- Security policies.

Enterprise-wide information must not be duplicated across stores unless there is a domain-specific reason.

---

## 10. Store-Level Data

Other information is inherently store-specific.

Examples include:

- Store inventory;
- Store stock levels;
- Store aisle positions;
- Store layout;
- Store-specific availability;
- Local operational status;
- Store staff;
- Store fulfilment capacity;
- Local delivery capability.

The system of record for such information must remain within the appropriate domain.

---

## 11. Store Selection

When a user interacts with a physical store, the platform must establish the relevant store context.

Store selection may be determined through appropriate mechanisms such as:

- User selection;
- Saved preference;
- Order context;
- Delivery destination;
- Walk Mode activation;
- Physical store identification;
- QR or other store identification mechanisms;
- Authorised operational context.

The architecture must not assume that the user's current physical location alone is sufficient to determine the intended store.

---

## 12. User and Household Relationships

Users may interact with multiple stores.

Households may also have preferences, purchasing behaviour, permissions, and orders spanning multiple stores.

Therefore:

- User identity must remain enterprise-level;
- Household identity must remain enterprise-level;
- Store relationships must be contextual;
- Orders must identify their relevant store or fulfilment context;
- Preferences must distinguish global preferences from store-specific preferences where necessary.

---

## 13. Inventory Scalability

Inventory must be designed as a distributed store-aware capability.

The architecture must support:

- Multiple stores;
- Store-specific stock;
- Stock updates;
- Inventory reservations;
- Availability checks;
- Synchronisation;
- Reconciliation;
- High-volume inventory events.

Inventory queries must not require scanning the complete enterprise inventory when only one store's inventory is relevant.

---

## 14. Product Catalogue and Store Availability

The product catalogue and physical availability are distinct concepts.

A product may exist in the enterprise catalogue while being unavailable at a particular store.

The architecture must therefore distinguish between:

```text
Product Exists
      |
      v
Store Carries Product
      |
      v
Store Has Stock
      |
      v
Product Available for Requested Operation
```

AI recommendations and shopping workflows must use the appropriate availability context.

---

## 15. Pricing and Commercial Context

Pricing may vary according to:

- Store;
- Region;
- Promotion;
- Customer context;
- Time;
- Commercial rules.

The architecture must therefore avoid assuming that one universal price exists for every product.

Commercial rules must remain governed by the appropriate business domain.

AI agents must not independently invent or override commercial pricing.

---

## 16. Store Layout and Walk Mode

Walk Mode depends upon the physical characteristics of the active store.

Store-specific information may include:

- Aisles;
- Sections;
- Product locations;
- Routes;
- Restricted areas;
- Temporary closures;
- Operational changes;
- Accessibility information.

Walk Mode must use the layout and operational state of the active store.

A route generated for one store must not be treated as valid for another store without appropriate validation.

---

## 17. AI Context

AI agents operating within Essentials Mart may operate at different scopes.

Examples include:

- Enterprise-level agents;
- Store-level agents;
- User-level agents;
- Household-level agents;
- Session-level agents;
- Walk Mode agents.

The AI Society architecture must preserve the relevant scope and authority.

An AI agent must not gain additional authority merely because it has access to information from another store.

---

## 18. Autonomous Operations

Autonomous operations must remain subject to:

- Identity;
- Store context;
- Permissions;
- Policies;
- AI governance;
- Human approval where required;
- Auditability.

Examples include:

- Product substitutions;
- Basket modifications;
- Route changes;
- Inventory-related actions;
- Notifications;
- Fulfilment actions.

The system must be able to establish which store and operational context applied when an autonomous action occurred.

---

## 19. Service Scalability

Services should be designed so that increasing workload does not require proportional increases in architectural complexity.

Where appropriate, services should support:

- Horizontal scaling;
- Stateless processing;
- Asynchronous processing;
- Queue-based workload distribution;
- Independent scaling of high-volume capabilities;
- Caching;
- Read optimisation;
- Partitioning.

Stateful components must be scaled according to their specific workload characteristics.

---

## 20. Event-Driven Scaling

The event-driven architecture provides an important mechanism for scaling distributed workflows.

High-volume workloads may be processed asynchronously where immediate synchronous execution is not required.

Examples include:

- Inventory events;
- Notifications;
- Analytics;
- AI background tasks;
- Search indexing;
- Recommendation processing;
- Operational telemetry.

Event consumers should be independently scalable where appropriate.

---

## 21. Partitioning

Large datasets may require partitioning according to appropriate domain characteristics.

Potential partition dimensions include:

- Store;
- Region;
- Time;
- Tenant or organisational boundary where applicable;
- Domain-specific identifiers.

Partitioning decisions must be made according to actual access patterns rather than introduced indiscriminately.

Partitioning must not undermine domain ownership or transactional correctness.

---

## 22. Database Scalability

Database architecture must support growth in:

- Users;
- Products;
- Stores;
- Orders;
- Inventory records;
- Events;
- Audit records;
- AI decision records;
- Operational telemetry.

The database architecture must preserve clear ownership boundaries while allowing appropriate scaling mechanisms.

The platform must avoid creating a single uncontrolled database dependency across unrelated domains.

---

## 23. Caching

Caching may be used to reduce unnecessary load on high-read workloads.

Potential candidates include:

- Product catalogue data;
- Store configuration;
- Store layout;
- Frequently accessed availability information;
- Non-sensitive reference information.

Cached information must have appropriate invalidation and freshness rules.

Caching must not become the authoritative source for transactional state.

---

## 24. Search Scalability

Search capabilities must be capable of scaling independently from transactional systems where necessary.

Search indexes may support:

- Product discovery;
- Store-specific availability;
- Recommendations;
- Store navigation;
- Catalogue search.

Search results must respect:

- User permissions;
- Store context;
- Product availability;
- Commercial rules;
- Data visibility.

Search indexes must not become an uncontrolled alternative source of truth.

---

## 25. Geographic Scaling

As Essentials Mart expands geographically, the architecture must support:

- Multiple regions;
- Different stores;
- Regional configuration;
- Local operational requirements;
- Regional delivery networks;
- Regional integrations;
- Potential regulatory differences.

Geographic expansion must not require rewriting core enterprise domains.

---

## 26. Resilience

The platform must be designed to tolerate failures within individual components without unnecessarily causing enterprise-wide failure.

Resilience mechanisms may include:

- Redundancy;
- Timeouts;
- Retries;
- Circuit breakers;
- Queues;
- Idempotency;
- Graceful degradation;
- Health checks;
- Failover mechanisms.

Failure behaviour must remain consistent with domain requirements.

---

## 27. Store Failure Isolation

A failure affecting one store should not automatically make unrelated stores unavailable.

Examples include:

- Store-specific inventory failure;
- Store network failure;
- Store layout service failure;
- Store operational-system failure;
- Store-specific integration failure.

The architecture should isolate failures wherever practical.

Enterprise-wide dependencies must nevertheless be identified and protected appropriately.

---

## 28. Regional Failure Isolation

Where the platform operates across multiple geographic regions, regional failures should be contained where practical.

The architecture should allow critical enterprise services to determine appropriate fallback or degraded behaviour.

The exact regional deployment model will be defined during the deployment architecture phase.

---

## 29. Graceful Degradation

When a dependency becomes unavailable, the platform should degrade predictably rather than fabricate information.

Examples include:

- Showing cached non-critical information;
- Temporarily disabling a non-essential AI capability;
- Allowing manual operation when automation is unavailable;
- Indicating inventory uncertainty;
- Indicating that an external integration has an unknown outcome.

The system must not represent stale or unavailable information as confirmed current information.

---

## 30. Capacity Management

Capacity must be monitored against expected growth.

Important dimensions include:

- User traffic;
- Concurrent sessions;
- Orders;
- Inventory updates;
- Event volume;
- AI workloads;
- Notification volume;
- WhatsApp interactions;
- Search volume;
- Walk Mode sessions.

Capacity planning should consider both normal and peak demand.

---

## 31. Peak Demand

The platform must account for demand spikes caused by:

- Promotions;
- Seasonal events;
- Holidays;
- Marketing campaigns;
- Product launches;
- Unexpected demand;
- Large-scale notifications.

Critical services should be capable of scaling without compromising transactional integrity.

---

## 32. Operational Isolation

Operational tooling must distinguish between:

- Enterprise;
- Region;
- Store;
- Service;
- Domain.

Operators should be able to determine whether an incident affects:

- One user;
- One household;
- One store;
- Multiple stores;
- One region;
- The entire platform.

This is important for efficient incident response.

---

## 33. Security and Authorisation

Multi-store scalability must not weaken security boundaries.

Authorisation decisions must consider the scope of the requested operation.

Examples include:

- Enterprise administrator;
- Regional operator;
- Store manager;
- Store staff member;
- Support staff;
- User;
- Household member;
- AI agent.

Access to one store must not automatically imply access to another store.

---

## 34. Observability and Auditability

Multi-store activity must integrate with ADR-016.

Observability must allow authorised operators to distinguish:

- Store;
- Region;
- Service;
- User;
- Workflow;
- AI execution;
- Transaction;
- Outcome.

Audit records for significant actions must preserve the relevant store and organisational context.

This enables investigation of incidents without requiring uncontrolled global data access.

---

## 35. Notifications and Communications

Notifications, WhatsApp communication, and other communication channels may operate at different scopes.

A communication may relate to:

- A user;
- A household;
- An order;
- A store;
- A delivery;
- A Walk Mode session;
- An operational incident.

Communication systems must preserve the relevant context and permissions.

Store-specific staff communication must not accidentally expose information belonging to another store.

---

## 36. Data Migration and Expansion

Adding a new store should not require restructuring the entire enterprise data model.

The architecture should support controlled onboarding of:

- Store identity;
- Store configuration;
- Inventory;
- Product availability;
- Layout;
- Staff;
- Fulfilment;
- Delivery;
- Local policies;
- Operational integrations.

Store onboarding must be governed and auditable.

---

## 37. Testing and Validation

The architecture must be tested against realistic scaling scenarios.

Testing should include:

- Multiple-store operation;
- Concurrent store activity;
- High inventory-event volume;
- High order volume;
- AI workload growth;
- Walk Mode concurrency;
- Notification spikes;
- Store isolation;
- Failure isolation;
- Regional failure scenarios;
- Permission boundary testing.

Performance testing must not focus only on single-store scenarios.

---

## 38. Implementation Implications

Implementation will eventually require appropriate mechanisms for:

- Store identity;
- Store-aware domain models;
- Store-aware APIs;
- Store-aware authorisation;
- Horizontal service scaling;
- Event processing;
- Database scaling;
- Caching;
- Search scaling;
- Capacity monitoring;
- Failure isolation;
- Multi-store observability;
- Store onboarding.

Specific technologies and infrastructure choices are deferred to implementation and deployment architecture decisions.

---

## 39. Consequences

### Positive

- Supports growth from one store to many stores.
- Reduces architectural migration risk.
- Provides clear store boundaries.
- Supports enterprise-wide capabilities.
- Enables independent scaling of high-volume services.
- Improves failure isolation.
- Supports geographically distributed operations.
- Preserves AI and Walk Mode context.
- Strengthens security boundaries.
- Improves operational investigation.
- Supports future enterprise expansion.

### Negative

- Increased architectural complexity.
- Additional store-context requirements.
- More complex data modelling.
- Greater operational requirements.
- More complex testing.
- Additional infrastructure requirements as scale increases.

### Trade-offs

Essentials Mart prioritises:

**Scalable architecture over single-store simplicity.**

**Explicit context over hidden assumptions.**

**Store isolation over uncontrolled data sharing.**

**Independent scaling over tightly coupled services.**

**Resilience over architectural minimalism.**

---

## 40. Alternatives Considered

### Alternative A — Single-Store Architecture

Design the platform around one physical store and introduce multi-store support later.

**Rejected because:**

This would create architectural assumptions that become expensive and risky to remove during expansion.

### Alternative B — Independent Application Per Store

Deploy a completely separate application and backend for every store.

**Rejected because:**

This would unnecessarily duplicate enterprise capabilities and increase operational complexity.

### Alternative C — Fully Shared Store Data

Treat all stores as one undifferentiated operational environment.

**Rejected because:**

This would weaken store isolation, complicate authorisation, and create incorrect assumptions around inventory, layout, fulfilment, and operations.

### Alternative D — Shared Enterprise Platform With Explicit Store Context

Use shared enterprise capabilities while explicitly modelling store-specific context and isolation.

**Selected because:**

It provides a balance between enterprise-wide capabilities, operational isolation, scalability, and future geographic expansion.

---

## 41. Dependencies

This ADR depends upon:

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

---

## 42. Related Architecture Documents

- EDA-001-enterprise-data-architecture.md
- DOMAINS.md
- EVENT-ARCHITECTURE.md
- SECURITY-ARCHITECTURE.md
- AI-001-ai-society.md

---

## 43. Decision Lifecycle

**Current Status:** Proposed

This ADR should be reviewed if:

- The enterprise materially changes its multi-store strategy;
- The platform expands into substantially different geographic or organisational models;
- Store isolation requirements materially change;
- Scalability requirements materially change;
- The deployment architecture introduces a different scaling model;
- AI or Walk Mode introduces materially different store-context requirements;
- Database architecture materially changes;
- Enterprise resilience requirements materially change.

Any replacement ADR must reference ADR-017 and explain the reason for changing the scalability or multi-store architecture.

---

## Final Decision

> **Essentials Mart will use a scalable, multi-store enterprise architecture in which store identity and store context are explicit architectural concepts. Enterprise-wide capabilities will be shared where appropriate, while store-specific inventory, layout, operations, fulfilment, configuration, permissions, and other contextual information will remain appropriately isolated. Services and infrastructure will be designed to scale independently where practical, with event-driven processing, resilience, failure isolation, and capacity management supporting future growth. AI agents and Walk Mode must operate with the appropriate store context and authority. The architecture is intended to allow Essentials Mart to grow from an initial deployment into a geographically distributed multi-store platform without requiring fundamental architectural redesign.**

**ADR-017 remains authoritative unless superseded by a subsequent ADR.**
