# EIP-021 — Backend Service & API Implementation Architecture

**Status:** Proposed / Implementation Baseline
**Version:** 1.0
**Parent:** EIP-019 Architecture-to-Implementation Traceability & Build Baseline
**Depends On:** EDA-001, EDA-003, ADR-002, ADR-003, ADR-004, ADR-005, ADR-006, ADR-015, ADR-016, EIP-020

## 1. Purpose

EIP-021 defines the implementation architecture for Essentials Mart backend capabilities and API boundaries. It translates the enterprise domain and bounded-context map into deployable backend modules, services, workers, and API interfaces without prematurely forcing every bounded context into a separate microservice.

The architecture must support the progression from one store to 10,000+ stores, from early modular deployment to independently scalable services where justified, and from a single region to global operation.

## 2. Constitutional Implementation Principle

> Backend boundaries must follow business ownership and capability boundaries, not technical fashion.

A bounded context is an ownership boundary. It is not automatically a network service.

The initial implementation may use a modular monolith or a small number of deployable services. A capability should be extracted when independent scaling, deployment, security isolation, failure isolation, organisational ownership, or operational requirements justify the additional distributed-system complexity.

## 3. Backend Layering

The implementation should distinguish:

```text
Client / External Partner
        ↓
API Gateway / Edge
        ↓
Application API
        ↓
Domain Modules / Services
        ↓
Domain-Owned Data
        ↓
Events / Jobs / Integrations
        ↓
Infrastructure Services
```

Cross-cutting infrastructure must not become an alternative owner of business truth.

## 4. Core Backend Domains

The initial implementation map includes:

- Identity & Access
- Customer & Household
- Commerce / Orders
- Product & Catalogue
- Inventory
- Supplier & Procurement
- Pricing & Promotions
- Payments
- Fulfilment & Delivery
- Essentials Subscription
- Rewards
- Trust & Risk
- Customer Support
- Notifications & Communications
- Partner Integrations
- Store Operations
- AI Society
- Intelligence Engines
- Analytics & Learning
- Platform Operations

These domains remain aligned with EIP-020.

## 5. Service Extraction Rule

The default implementation unit is a **domain module**.

A module may later become a service when one or more of the following apply:

- materially different scaling requirements;
- independent release cadence;
- strong security boundary;
- separate availability requirement;
- independent data ownership;
- operational isolation requirement;
- separate team ownership;
- external integration boundary;
- compute characteristics requiring independent infrastructure;
- or failure isolation that materially benefits the enterprise.

Service extraction must be documented and traceable through EIP-019.

## 6. API Gateway / Edge

The edge layer provides the controlled boundary between clients, partners and internal capabilities.

Responsibilities may include:

- TLS termination;
- authentication integration;
- request validation;
- routing;
- rate limiting;
- abuse controls;
- request size limits;
- API version routing;
- tenant and organisation boundary enforcement;
- observability;
- and defensive policy enforcement.

It must not become the owner of domain state.

## 7. API Design

APIs should be:

- capability-oriented;
- domain-aligned;
- explicit about authorization;
- versioned where contract evolution requires it;
- observable;
- idempotent where operations can be retried;
- bounded in payload size;
- and designed for failure.

APIs must not expose internal database structure merely because it is convenient.

## 8. Synchronous Communication

Synchronous APIs are preferred when the caller requires an immediate result or strong transactional validation.

Examples include:

- authentication;
- checkout validation;
- payment authorization;
- current product retrieval;
- basket operations;
- subscription configuration validation;
- authorised administrative actions.

Synchronous communication must not be used merely to create artificial coupling between domains.

## 9. Asynchronous Communication

Events and asynchronous jobs should be used where the business fact can propagate independently.

Examples:

```text
OrderPlaced
    ↓
Inventory
Rewards
Analytics
Learning
Notifications
```

Event semantics and governance remain defined by EDA-013 and the Part 4 defensive architecture.

## 10. Internal Service-to-Service Security

Internal communication must not rely solely on network location.

Where service extraction occurs, service identity, authentication, authorization, encrypted communication, monitoring and policy enforcement must apply according to the security architecture.

This is consistent with NIST guidance for microservices, which identifies authentication, access management, secure communication, service discovery, monitoring, resilience, load balancing and throttling as core concerns. citeturn0search2turn0search1

## 11. Authorization

Authorization remains capability- and policy-driven.

A service may only perform operations granted to its service identity and execution context.

Consuming an event does not grant authority to execute a consequential command.

AI agents remain subject to the AI Society authority model.

## 12. Domain Data Ownership

Each domain owns its authoritative business state.

Other domains must access that state through governed APIs, events, projections or explicitly authorised retrieval mechanisms.

Shared databases must not be used as a shortcut around ownership boundaries.

## 13. Read Models and Projections

A domain may expose read-optimised projections for consumers that require efficient access.

Examples include:

- catalogue search indexes;
- inventory availability projections;
- customer dashboards;
- analytics projections;
- delivery route views.

A projection is not automatically authoritative merely because it is convenient to query.

## 14. Transactions

Transactions should remain within the smallest practical ownership boundary.

Cross-domain workflows should normally use:

- explicit commands;
- domain events;
- orchestration;
- compensation;
- or durable workflow state.

Distributed transactions must not become the default mechanism for ordinary business workflows.

## 15. Idempotency

Externally retried operations and event consumers must support idempotency where duplicate execution could create an unintended business effect.

Examples:

- payment initiation;
- reward granting;
- order submission;
- delivery creation;
- partner callbacks.

Idempotency keys and event IDs should be preserved where appropriate.

## 16. Long-Running Workflows

Long-running processes should be implemented through durable workflow state rather than keeping synchronous requests open indefinitely.

Examples:

- fulfilment;
- delivery orchestration;
- partner settlement;
- subscription scheduling;
- AI workflows requiring human approval.

## 17. Background Workers

Workers should handle asynchronous workloads such as:

- event processing;
- notifications;
- route optimisation;
- inventory reconciliation;
- analytics processing;
- AI jobs;
- document generation;
- partner synchronisation;
- scheduled subscription fulfilment.

Workers must have explicit retry, timeout, dead-letter and observability policies.

## 18. Essentials Subscription

Essentials Subscription remains an extension of ordinary commerce and fulfilment.

It does not replace:

- normal checkout;
- repeat purchase;
- AI Shopping Mode;
- pantry intelligence;
- ordinary delivery;
- or receipt history.

Its backend may include:

```text
Subscription Service
      ↓
Demand / Basket Planner
      ↓
Fulfilment
      ↓
Resource-Aware Route Optimiser
      ↓
Dispatch
      ↓
Delivery
```

The route optimiser must consider vehicle availability, capacity, warehouse staffing, scheduled transport, delivery windows, geography, existing routes and service commitments.

## 19. Delivery Architecture

Delivery should support multiple fulfilment modes:

- scheduled shared delivery;
- personalised scheduled delivery;
- express / fast delivery;
- subscription route delivery;
- partner-assisted delivery;
- and future governed modes.

Existing delivery capabilities remain the foundation. Subscription delivery extends them rather than creating a parallel fulfilment system.

## 20. Partner Integrations

Partners must connect through explicit integration boundaries.

Supported patterns may include:

- APIs;
- webhooks;
- deep links;
- app tiles / storefront entry points;
- catalogue APIs;
- payment adapters;
- referral attribution.

Partner integrations must remain replaceable through adapters where practical.

No single partner should become an architectural prerequisite for the core commerce platform.

## 21. Payments

Payment integrations must be abstracted behind governed payment capabilities.

The architecture must support multiple providers without exposing provider-specific assumptions throughout core commerce logic.

Payment state must be authoritative within the payment domain and reconciled against provider events and settlement records.

## 22. Notifications

Notifications should be mediated through a communication capability supporting channels such as:

- in-app notifications;
- email where enabled;
- WhatsApp where permitted;
- SMS where appropriate;
- and future channels.

Business domains should request governed notifications rather than implementing channel-specific delivery logic themselves.

## 23. AI Society Integration

AI agents and Intelligence Engines must consume backend capabilities through governed interfaces.

The AI Society must not bypass domain services to modify authoritative data directly.

The pattern is:

```text
AI Agent
   ↓
Authorised Capability
   ↓
Domain Service
   ↓
Authoritative State
   ↓
Event / Evidence
```

AI recommendations remain distinct from authorised actions.

## 24. Walk Mode

Walk Mode should consume existing backend capabilities for:

- product information;
- inventory availability;
- basket operations;
- route/navigation information;
- recommendations;
- substitutions;
- customer context;
- and notifications.

Walk Mode must not create duplicate product, inventory or commerce ownership.

## 25. Trust & Risk

Trust and risk services provide governed assessments and signals.

They may influence authorization, review or defensive controls, but must not silently redefine domain truth.

High-impact actions must remain subject to the applicable authorization and human-governance rules.

## 26. Observability

Every deployable service should expose sufficient telemetry for:

- health;
- latency;
- throughput;
- errors;
- dependency failures;
- queue depth;
- saturation;
- authorization failures;
- security signals;
- and business-critical outcomes.

NIST's microservices guidance specifically identifies continuous monitoring and resilience mechanisms such as load balancing, circuit breaking and throttling as important operational concerns. citeturn0search0

## 27. Resilience

Service implementations should support appropriate:

- timeouts;
- retries with bounded backoff;
- circuit breakers;
- load balancing;
- bulkheads;
- queue buffering;
- graceful degradation;
- failover;
- and recovery procedures.

These mechanisms must be applied according to service criticality rather than indiscriminately.

## 28. API Failure Behaviour

APIs must define behaviour for:

- validation failures;
- authentication failure;
- authorization failure;
- dependency timeout;
- dependency outage;
- rate limiting;
- overload;
- partial completion;
- duplicate requests;
- and maintenance.

Error responses must not leak sensitive implementation details.

## 29. Service Discovery

Where independent services exist, service discovery must be governed and authenticated.

Service identity must remain stable enough to support authorization and observability while allowing infrastructure instances to scale dynamically.

## 30. Deployment Units

The implementation should distinguish:

- application modules;
- API services;
- background workers;
- scheduled jobs;
- event consumers;
- AI agents;
- Intelligence Engines;
- infrastructure services;
- and data services.

Not every unit requires independent deployment.

## 31. DevSecOps

Backend implementation must integrate security into build and deployment pipelines.

The architecture should support:

- source validation;
- dependency scanning;
- secret detection;
- static analysis;
- API contract tests;
- integration tests;
- security tests;
- container/image verification where applicable;
- infrastructure-as-code validation;
- policy-as-code;
- observability-as-code;
- and deployment verification.

NIST's microservices DevSecOps guidance explicitly distinguishes application code, application-services code, infrastructure-as-code, policy-as-code and observability-as-code. citeturn0search7

## 32. Service Mesh

A service mesh may be introduced when the number and distribution of services justify its operational value.

It is not mandatory at initial deployment.

Where adopted, it may provide:

- service discovery;
- secure service communication;
- authentication;
- authorization policy enforcement;
- traffic routing;
- telemetry;
- load balancing;
- and resilience controls.

NIST identifies service mesh as a dedicated infrastructure layer for service-to-service discovery, routing, encryption, authentication, authorization and monitoring. citeturn0search21

## 33. Scaling Strategy

Each service or module must have an explicit scaling characteristic:

- scale vertically;
- scale horizontally;
- queue-based scaling;
- scheduled scaling;
- geographic scaling;
- or remain embedded in a larger deployment unit.

Scaling must be driven by workload characteristics.

## 34. Criticality Classes

Backend capabilities should be classified by business criticality.

Conceptually:

```text
Critical
High
Normal
Deferred
Analytical / Non-critical
```

Critical commerce, identity, payment and safety functions must receive stronger availability and recovery guarantees than non-critical analytics workloads.

## 35. API Contract Governance

Each governed API must have:

- owner;
- purpose;
- consumers;
- authentication requirements;
- authorization requirements;
- request/response contract;
- version;
- error model;
- rate limits;
- classification;
- observability requirements;
- lifecycle status;
- and deprecation policy.

## 36. API Versioning

Prefer compatible additive evolution where possible.

Breaking changes require explicit version management and migration planning.

Independent consumers must not be expected to upgrade synchronously with producers.

## 37. Backend Security Boundary

The backend is the authoritative enforcement environment for proprietary business logic that should not be exposed to the client.

This includes, where applicable:

- pricing logic;
- recommendation logic;
- inventory optimisation;
- trust evaluation;
- fraud detection;
- ranking;
- reward rules;
- route optimisation;
- partner decisioning;
- and AI authority enforcement.

Client applications must not be treated as trusted enforcement environments.

## 38. Privacy

Backend services must minimise personal data exposure.

Service contracts should expose only the information required for the authorised operation.

Sensitive information should not be copied into unrelated service databases merely for convenience.

## 39. Auditability

Material actions must generate sufficient evidence to establish:

- who or what acted;
- what capability was invoked;
- what authorization applied;
- what data was affected;
- when it occurred;
- what outcome resulted;
- and what upstream event or request caused it.

This supports EDA-001 Part 4 assurance requirements.

## 40. Backend Implementation Readiness Gate

A service or module is implementation-ready only when:

- domain ownership is established;
- data ownership is established;
- API/event boundaries are defined;
- authorization is defined;
- failure behaviour is defined;
- observability is defined;
- security classification is defined;
- resilience requirements are defined;
- tests are defined;
- and EIP-019 traceability is complete.

## 41. Service Extraction Readiness Gate

A module must not be extracted into a service solely because microservices are considered desirable.

Extraction requires an explicit justification covering:

- benefit;
- operational cost;
- network latency;
- data boundary;
- deployment complexity;
- observability;
- resilience;
- security;
- team ownership;
- and migration strategy.

## 42. Constitutional Backend Laws

1. Domain ownership defines backend responsibility.
2. A bounded context is not automatically a microservice.
3. Shared databases must not bypass ownership boundaries.
4. APIs must expose capabilities, not implementation details.
5. Events remain facts and do not become hidden commands.
6. AI agents cannot bypass domain authorization.
7. Client applications are not trusted enforcement environments.
8. Cross-domain transactions must remain deliberate and bounded.
9. Distributed transactions are not the default workflow mechanism.
10. External operations must be idempotent where duplicate execution is possible.
11. Long-running work must use durable workflow mechanisms.
12. Service extraction requires architectural justification.
13. Security controls must apply to service-to-service communication.
14. Backend services must be observable.
15. Critical services must have explicit resilience requirements.
16. API contracts must be governed.
17. API evolution must preserve independent consumers where possible.
18. Partner integrations must remain replaceable where practical.
19. Payment providers must not own core commerce logic.
20. Subscription delivery extends existing fulfilment rather than replacing it.
21. Walk Mode consumes existing domain capabilities rather than creating shadow ownership.
22. AI recommendations and AI actions remain distinct.
23. Proprietary business logic must remain server-side where appropriate.
24. Personal data must be minimised across service boundaries.
25. Material backend actions must be auditable.
26. Implementation must remain traceable to EDA, ADR and EIP decisions.

## 43. Relationship to EIP-019

EIP-019 remains the authoritative traceability mechanism.

Every implementation component defined through this EIP must be traceable to:

```text
Business Requirement
        ↓
EDA
        ↓
ADR
        ↓
EIP
        ↓
Backend Component
        ↓
Code
        ↓
Test
        ↓
Evidence
```

## 44. Architectural Outcome

EIP-021 provides the implementation boundary between the domain map and the eventual backend codebase.

It deliberately permits a modular starting architecture while preserving a controlled path toward independently deployable services as Essentials Mart scales.

The resulting implementation principle is:

> **Start modular, extract deliberately, secure every boundary, preserve domain ownership, and make every implementation decision traceable.**
