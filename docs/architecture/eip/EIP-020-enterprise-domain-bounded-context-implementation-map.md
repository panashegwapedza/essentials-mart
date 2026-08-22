# EIP-020 — Enterprise Domain & Bounded Context Implementation Map

**Status:** Proposed  
**Date:** 2026-08-22  
**Decision Type:** Implementation Architecture / Domain Boundaries  
**Parent Architecture:** EDA-001  
**Depends On:** EDA-001, EDA-001 Part 4, ADR-001, ADR-002, ADR-003, ADR-004, ADR-005, ADR-006, ADR-007, ADR-008, ADR-009, ADR-010, ADR-013, ADR-014, ADR-016, ADR-017, ADR-019, ADR-020, EIP-019  

## 1. Purpose

EIP-020 establishes the implementation map from Essentials Mart enterprise domains and bounded contexts to concrete application capabilities, services, modules, data ownership and communication boundaries.

The purpose is to prevent implementation from becoming an undifferentiated collection of features or services with overlapping authority.

The implementation baseline follows:

```text
Enterprise Capability
        ↓
Domain
        ↓
Bounded Context
        ↓
Application Capability
        ↓
Service / Module
        ↓
API / Event Boundary
        ↓
Authoritative Data Ownership
```

A bounded context is an implementation boundary around a coherent model, responsibility and vocabulary. It does not automatically require one deployable microservice. Service decomposition remains an implementation decision governed by operational, scaling, security and ownership requirements.

NIST guidance on microservices similarly emphasises distinct responsibility, bounded context, independent management and failure/recovery characteristics while recognising API and asynchronous communication between components. citeturn0search12turn0search4

## 2. Constitutional Principle

> **Every authoritative business capability must have an identifiable domain owner, bounded-context boundary and source of truth.**

No implementation component may become an accidental owner merely because it is convenient to place a function or database there.

## 3. Domain Architecture

The initial enterprise domain map is:

```text
Essentials Mart
│
├── Customer & Household
├── Identity & Access
├── Commerce
├── Product & Catalogue
├── Inventory
├── Supplier & Procurement
├── Pricing & Promotions
├── Fulfilment & Delivery
├── Subscription & Recurring Essentials
├── Payments & Financial Operations
├── Rewards
├── Trust, Risk & Abuse
├── Customer Support & Service
├── Notifications & Communications
├── AI Society
├── Intelligence Engines
├── Walk Mode / Living Digital Supermarket
├── Partner & External Integrations
├── Store Operations
├── Analytics & Learning
└── Platform Operations
```

These are implementation-oriented domain boundaries, not a requirement that every item become an independently deployed service.

## 4. Domain Ownership

Each domain owns the business truth within its defined authority.

Examples:

```text
Commerce
   → orders, checkout state, commercial transactions

Inventory
   → stock state and inventory movements

Product & Catalogue
   → product identity and catalogue information

Customer & Household
   → customer and household relationships

Fulfilment & Delivery
   → fulfilment execution and delivery state

Subscription
   → subscription plans, schedules and recurring commitments

Trust / Risk
   → risk signals, trust assessments and governed risk decisions
```

Ownership must not be duplicated across domains.

## 5. Bounded Context Principle

A bounded context defines:

- vocabulary;
- business rules;
- authoritative state;
- invariants;
- interfaces;
- events;
- access rules;
- and ownership.

The same business term may have different meanings in different contexts.

For example, “customer” in Identity may represent an authenticated principal, while Customer & Household may represent the business relationship and household structure.

The implementation must not force unrelated contexts into one shared model merely because they use similar words.

## 6. Domain-to-Capability Map

### Customer & Household

Capabilities include:

- customer profile;
- household management;
- household preferences;
- pantry representation;
- shopping history;
- saved lists;
- receipt history;
- repeat purchase initiation;
- household AI context.

### Identity & Access

Capabilities include:

- registration;
- authentication;
- session management;
- identity verification integration;
- authorisation;
- roles;
- permissions;
- device/session security;
- account recovery.

Identity does not own commerce, inventory or household business state.

### Commerce

Capabilities include:

- basket;
- checkout;
- order creation;
- order lifecycle;
- cancellation;
- returns;
- refunds;
- commercial transaction state.

### Product & Catalogue

Capabilities include:

- product catalogue;
- product identity;
- categories;
- attributes;
- media references;
- product discovery metadata;
- product availability projections where appropriate.

### Inventory

Capabilities include:

- stock state;
- stock movements;
- reservations;
- adjustments;
- warehouse inventory;
- store inventory;
- replenishment state.

### Supplier & Procurement

Capabilities include:

- suppliers;
- supplier relationships;
- purchase orders;
- inbound shipments;
- supplier fulfilment;
- procurement state.

### Pricing & Promotions

Capabilities include:

- price rules;
- promotions;
- discounts;
- eligibility;
- campaign configuration;
- pricing intelligence inputs.

Pricing logic intended to remain proprietary must not be unnecessarily exposed to clients.

### Fulfilment & Delivery

Capabilities include:

- fulfilment planning;
- picking;
- packing;
- dispatch;
- delivery execution;
- route assignment;
- ETA calculation;
- delivery status;
- transport-provider adapters.

### Subscription & Recurring Essentials

Capabilities include:

- subscription configuration;
- recurring item selection;
- schedule;
- quantity and frequency;
- subscription price calculation;
- subscription lifecycle;
- replenishment intent;
- route schedule participation.

Subscription extends ordinary commerce and fulfilment; it does not replace checkout, repeat purchase or AI Shopping Mode.

### Payments & Financial Operations

Capabilities include:

- payment orchestration;
- payment status;
- refunds;
- settlement references;
- payment-provider integration;
- financial reconciliation.

Payment credentials and sensitive payment information remain governed by the appropriate payment boundary.

### Rewards

Capabilities include:

- reward eligibility;
- reward issuance;
- reward redemption;
- reward lifecycle;
- reward accounting references.

Reward Intelligence may recommend or evaluate, but authority to grant rewards remains governed by the Rewards domain and authorised capabilities.

### Trust, Risk & Abuse

Capabilities include:

- risk signals;
- trust assessments;
- abuse indicators;
- fraud analysis;
- defensive decisions;
- risk evidence.

Trust assessments are not automatically final factual judgments about a person.

### Customer Support & Service

Capabilities include:

- support cases;
- human staff interactions;
- service workflows;
- escalation;
- customer feedback;
- staff interaction ratings.

Customer feedback about human staff is retained for internal service-quality and valuation purposes subject to privacy and governance controls.

### Notifications & Communications

Capabilities include:

- in-app notifications;
- email where enabled;
- WhatsApp where authorised;
- notification preferences;
- delivery of approved communications.

Communication channels do not become owners of the underlying business event.

### AI Society

Capabilities include:

- agent registry;
- agent coordination;
- capability discovery;
- permission enforcement;
- task orchestration;
- agent communication;
- human approval routing;
- AI action attribution.

AI Society coordinates authorised capabilities; it does not become a replacement for domain ownership.

### Intelligence Engines

Capabilities include:

- Customer Intelligence;
- Inventory Intelligence;
- Pricing Intelligence;
- Reward Intelligence;
- Trust Intelligence;
- Demand Forecasting;
- Enterprise Intelligence;
- Learning Engine.

Intelligence engines generally produce analysis, predictions, recommendations or governed decisions rather than owning the underlying domain state.

### Walk Mode / Living Digital Supermarket

Capabilities include:

- manual mode;
- AI-assisted mode;
- autopilot mode;
- route planning;
- store navigation;
- product recognition;
- shelf/zone representation;
- shopping-list awareness;
- dynamic rerouting;
- user takeover;
- interaction telemetry.

Walk Mode consumes governed domain capabilities and must not create an alternative source of truth for products, inventory or orders.

### Partner & External Integrations

Capabilities include:

- partner discovery;
- app-tile integration;
- API catalogue exposure;
- referral/deep links;
- payment-provider adapters;
- external identity/KYC integration;
- transport integration;
- logistics integrations.

Partner integrations must remain provider-neutral where substitution is an architectural requirement.

### Store Operations

Capabilities include:

- store configuration;
- staff operations;
- picking operations;
- shelf operations;
- store tasks;
- operational capacity;
- store availability.

### Analytics & Learning

Capabilities include:

- analytical projections;
- event-derived datasets;
- learning datasets;
- outcome analysis;
- performance analytics;
- model feedback.

Analytics must not silently become authoritative operational state.

### Platform Operations

Capabilities include:

- deployment;
- configuration;
- service health;
- observability;
- security telemetry;
- infrastructure operations;
- resilience controls.

## 7. Service Boundary Principle

A bounded context may initially be implemented as:

- a module;
- a package;
- a service;
- a worker;
- a function;
- or another deployment unit.

Service boundaries should be extracted where justified by:

- independent scaling;
- independent deployment;
- security isolation;
- ownership;
- reliability;
- performance;
- failure containment;
- or materially different operational requirements.

Microservices must not be created merely to increase the service count.

NIST guidance highlights independent scaling, deployment, bounded responsibility and failure/recovery as important microservice design drivers. citeturn0search12

## 8. Modular Monolith Compatibility

The architecture permits a modular monolith during early implementation where appropriate.

The module boundaries must still respect the bounded contexts and ownership rules defined here.

Conceptually:

```text
One Deployment
│
├── Commerce Module
├── Inventory Module
├── Customer Module
├── Fulfilment Module
├── Trust Module
└── ...
```

Later, selected modules may become independently deployable services without changing their domain ownership.

## 9. Database Ownership

Each bounded context must have clear authoritative data ownership.

The implementation may use:

- separate databases;
- separate schemas;
- separate tables within an intentionally shared database;
- or other storage boundaries.

The physical storage choice does not change logical ownership.

Direct cross-domain writes to another domain's authoritative data are prohibited unless explicitly governed as an approved architectural mechanism.

## 10. API Boundaries

Cross-context synchronous interactions should occur through governed APIs or equivalent capabilities.

Examples:

```text
Checkout
   ↓ API
Pricing

Checkout
   ↓ API
Payment

Fulfilment
   ↓ API
Inventory
```

APIs must identify:

- owner;
- consumer;
- authorisation;
- contract;
- failure semantics;
- rate limits;
- observability;
- and security controls.

ADR-004 remains authoritative for the API/service architecture.

## 11. Event Boundaries

Events are preferred where a meaningful fact can propagate independently without requiring synchronous coupling.

Examples:

```text
OrderPlaced
    ↓
Inventory
Rewards
Analytics
Trust
Learning
Notifications
```

The producer remains the owner of the underlying fact.

Part 4 event-defence requirements apply to all governed event implementations.

## 12. Domain Commands

Commands must be directed to the domain that owns the action.

Examples:

```text
CreateOrder → Commerce
ReserveInventory → Inventory
ApproveReward → Rewards
DispatchOrder → Fulfilment
SuspendAccount → Identity / authorised security capability
```

An intelligence engine or AI agent may propose or request an action but does not become the owner merely by initiating the command.

## 13. Cross-Domain Queries

Read access should use:

- APIs;
- governed projections;
- search indexes;
- analytics datasets;
- or explicitly shared read models.

Consumers must not obtain unrestricted database access merely to avoid designing an interface.

## 14. Shared Kernel Policy

Shared libraries are permitted for technical concerns such as:

- logging;
- telemetry;
- authentication primitives;
- schema tooling;
- error handling;
- common SDKs.

Shared business state and business rules should not be placed into a common kernel merely to avoid domain boundaries.

## 15. Customer Journey Mapping

A single customer journey may cross multiple bounded contexts.

Example:

```text
Customer
  ↓
Identity
  ↓
Catalogue
  ↓
Basket
  ↓
Pricing
  ↓
Payment
  ↓
Commerce
  ↓
Inventory
  ↓
Fulfilment
  ↓
Delivery
  ↓
Rewards
  ↓
Learning
```

This does not mean one domain owns the entire journey.

Each domain owns its portion of the business truth.

## 16. AI Shopping Mode Mapping

AI Shopping Mode must coordinate existing capabilities rather than create shadow versions of them.

Conceptually:

```text
AI Shopping Mode
       ↓
AI Society / authorised agent
       ├── Catalogue
       ├── Customer / Household
       ├── Inventory
       ├── Pricing
       ├── Commerce
       ├── Rewards
       └── Fulfilment
```

The agent coordinates the journey while domain services remain authoritative.

## 17. Subscription Mapping

Essentials Subscription participates across multiple contexts:

```text
Subscription
     ↓
Customer / Household
     ↓
Catalogue
     ↓
Pricing
     ↓
Commerce
     ↓
Inventory
     ↓
Fulfilment
     ↓
Delivery
```

This is an orchestration relationship, not shared ownership.

## 18. Resource-Aware Delivery Mapping

Delivery optimisation must consider current resource availability.

Inputs may include:

- vehicle count;
- vehicle capacity;
- driver availability;
- warehouse staff;
- picking capacity;
- packing capacity;
- dispatch windows;
- scheduled transport;
- traffic/travel estimates;
- customer time windows;
- subscription routes;
- express demand.

The resulting route is a fulfilment/delivery decision, while source resources remain owned by their respective contexts.

## 19. Scheduled Transport Integration

Existing transport networks may be used through governed adapters.

Examples include:

- scheduled commuter services;
- shared delivery windows;
- partner transport;
- personalised delivery;
- express delivery.

The transport provider does not become a domain owner of Essentials Mart orders or subscriptions.

## 20. Partner Neutrality

The partner architecture must support replacement of a provider without redesigning the core commerce domain.

Conceptually:

```text
Partner Capability
       ↓
Integration Contract
       ↓
Adapter
   ┌───┼────┐
   ↓   ↓    ↓
Provider A B C
```

This applies to payment, identity, transport, logistics and customer-acquisition partners.

## 21. Domain Events and Learning

Learning consumes outcomes from multiple domains.

For example:

```text
RecommendationGenerated
        ↓
CustomerAccepted
        ↓
PurchaseCompleted
        ↓
DeliveryCompleted
        ↓
OutcomeRecorded
        ↓
Learning Engine
```

Learning must not rewrite the authoritative source domains.

## 22. Security Boundary Mapping

Every bounded context must identify:

- identities that may access it;
- capabilities exposed;
- sensitive data;
- event permissions;
- API permissions;
- administrative actions;
- security telemetry;
- containment actions;
- and recovery dependencies.

Part 4 establishes additional defensive constraints across these boundaries.

NIST guidance for secure microservices emphasises authentication, authorisation, secure service communication, service discovery, resilience, throttling and monitoring as architectural concerns rather than isolated application features. citeturn0search4turn0search1

## 23. AI Authority Boundary

AI components must interact with domains through authorised interfaces.

```text
AI Agent
   ↓
Capability Permission
   ↓
Domain API / Command
   ↓
Domain Validation
   ↓
Authorised Action
```

Event consumption does not bypass domain authorisation.

## 24. Observability Boundary

Each implementation boundary must expose appropriate:

- health;
- metrics;
- logs;
- traces;
- security telemetry;
- business outcome telemetry.

The observability layer must preserve domain provenance and correlation identifiers.

## 25. Failure Boundary

A failure in one context should not automatically become a platform-wide failure.

Examples:

```text
Recommendation Engine Failure
        ↓
Commerce continues

Analytics Failure
        ↓
Checkout continues

Partner Provider Failure
        ↓
Alternative provider / fallback

Delivery Optimiser Failure
        ↓
Governed fallback route calculation
```

Critical dependencies must have explicit failure semantics.

## 26. Implementation Sequence

The domain map should be implemented in an order that reduces unnecessary coupling.

Recommended sequence:

```text
1. Identity & Access
2. Customer & Household
3. Product & Catalogue
4. Commerce
5. Inventory
6. Pricing & Promotions
7. Payments
8. Fulfilment & Delivery
9. Supplier & Procurement
10. Notifications
11. Rewards
12. Trust / Risk
13. Subscription
14. Store Operations
15. Partner Integrations
16. AI Society
17. Intelligence Engines
18. Walk Mode
19. Analytics & Learning
20. Platform Operations
```

The exact delivery sequence may change based on implementation dependencies, but the domain ownership model remains stable.

## 27. Domain Extraction Criteria

A module should become a separately deployed service only when one or more of the following justify the boundary:

- independent scaling requirement;
- independent release cadence;
- strong security boundary;
- high failure isolation value;
- separate team ownership;
- materially different availability requirement;
- materially different data lifecycle;
- computational isolation;
- or external integration isolation.

## 28. Anti-Pattern Controls

The implementation must avoid:

- giant shared database ownership;
- arbitrary service splitting;
- circular synchronous dependencies;
- domain-to-domain database writes;
- shared mutable business state;
- duplicated authoritative rules;
- AI bypassing domain boundaries;
- event consumers becoming hidden owners;
- integration providers leaking into core domain logic;
- and client applications becoming authoritative for protected business state.

## 29. Traceability

Each domain and bounded context must be traceable through EIP-019.

At minimum:

```text
Domain
  ↓
ADR / EDA Source
  ↓
EIP
  ↓
Capability
  ↓
Implementation Component
  ↓
Data / API / Event Boundary
  ↓
Test
  ↓
Evidence
```

## 30. Implementation Readiness Gate

A bounded context is implementation-ready when:

1. ownership is defined;
2. business responsibility is bounded;
3. authoritative data is identified;
4. APIs/events are identified where required;
5. dependencies are known;
6. security boundaries are defined;
7. failure behaviour is understood;
8. observability is defined;
9. relevant ADR/EIP references exist;
10. and unresolved conflicts are recorded.

## 31. Constitutional Domain Laws

1. Every authoritative capability has an identifiable owner.
2. Every bounded context has a defined responsibility.
3. Domain ownership must not be duplicated.
4. Logical ownership is independent of physical database layout.
5. Cross-domain writes require explicit governance.
6. APIs and events must respect domain boundaries.
7. Intelligence does not automatically own operational state.
8. AI agents do not bypass domain authority.
9. Partner providers do not become core domain owners.
10. Subscription extends existing commerce and fulfilment capabilities.
11. Walk Mode consumes governed capabilities rather than creating shadow domains.
12. Service decomposition must be justified by operational need.
13. A bounded context does not automatically require a separate microservice.
14. Failure boundaries must be explicit.
15. Security boundaries must be explicit.
16. Every material domain implementation must remain traceable through EIP-019.
17. Material boundary changes require forward-consistency review.

## 32. Architectural Outcome

EIP-020 establishes the implementation domain map for Essentials Mart.

```text
Enterprise
   ↓
Domains
   ↓
Bounded Contexts
   ↓
Capabilities
   ↓
Modules / Services
   ↓
APIs / Events
   ↓
Authoritative Data
   ↓
Verification
   ↓
Assurance
```

The objective is a system whose implementation boundaries reflect business ownership, security requirements and operational realities rather than arbitrary technical decomposition.

## Commit Message

```text
docs(eip): establish enterprise domain and bounded context implementation map
```

## Extended Commit Message

```text
Establish the enterprise domain and bounded context implementation map for Essentials Mart.

- Define implementation-oriented enterprise domains
- Establish bounded context ownership principles
- Map domains to capabilities and implementation boundaries
- Define API and event boundary rules
- Establish authoritative data ownership requirements
- Define AI Society and intelligence-engine boundary rules
- Map subscription and delivery orchestration across domains
- Establish provider-neutral partner integration boundaries
- Define service extraction and modular-monolith compatibility
- Establish security, observability and failure boundaries
- Define domain implementation readiness criteria
- Connect domain implementation to EIP-019 traceability
- Establish constitutional domain and bounded-context laws
```