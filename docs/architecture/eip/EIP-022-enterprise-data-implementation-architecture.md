# EIP-022 — Enterprise Data Implementation Architecture

**Document ID:** EIP-022  
**Title:** Enterprise Data Implementation Architecture  
**Project:** Essentials Mart  
**Status:** Proposed / Implementation Baseline  
**Depends On:** EIP-019, EIP-020, EIP-021, ADR-005, ADR-016, ADR-015, EDA-001  
**Owner:** Essentials Mart Architecture Team  
**Date:** 22 August 2026

---

## 1. Purpose

EIP-022 defines how Essentials Mart implements the data architecture established by the EDA and ADR layers.

It translates:

```text
Domain Ownership
      ↓
Bounded Contexts
      ↓
Service Boundaries
      ↓
Authoritative Data
      ↓
Databases / Stores
      ↓
Projections / Read Models
      ↓
Events / APIs
```

into an implementation baseline.

The purpose is to prevent uncontrolled shared databases, ambiguous ownership, duplicated authoritative state, unnecessary data movement and unauthorised cross-domain access.

---

## 2. Constitutional Data Principle

> **Every authoritative business fact must have one clearly owned source of truth. Other representations are projections, caches, indexes, analytical copies or governed integrations unless explicitly designated otherwise.**

Data ownership follows domain ownership.

A service may consume another domain's data without becoming its owner.

---

## 3. Data Architecture Is Not One Database

Essentials Mart shall not assume that the entire enterprise must use one database or one database technology.

The implementation may use:

- relational databases;
- document stores;
- key-value stores;
- search indexes;
- object storage;
- analytical stores;
- event streams;
- vector stores where justified;
- caches;
- specialised operational stores.

Technology selection follows workload, consistency, security, scale and operational requirements.

---

## 4. Domain Data Ownership

Each bounded context owns the authoritative data required for its business responsibilities.

Conceptually:

```text
Customer
   ↓
Customer Domain

Order
   ↓
Commerce Domain

Inventory
   ↓
Inventory Domain

Supplier
   ↓
Supplier Domain

Reward
   ↓
Rewards Domain

Trust Assessment
   ↓
Trust Domain
```

Consumers must not directly mutate another domain's authoritative store.

---

## 5. Database Boundary Principle

Where a service is independently deployable, its authoritative persistence should normally be independently controlled.

A shared physical database may exist during early modular implementation where justified, but modules must retain logical ownership boundaries.

The architecture must not allow convenience access to become permanent architectural coupling.

This is consistent with distributed-service architecture guidance in which independently managed services may maintain separate repositories and communicate through explicit interfaces. citeturn0search22

---

## 6. Modular-First Data Architecture

Essentials Mart may begin with a modular persistence architecture rather than prematurely deploying a database for every service.

The progression may be:

```text
Logical Data Boundary
        ↓
Modular Persistence
        ↓
Measured Operational Need
        ↓
Independent Data Store
```

Extraction must preserve ownership and contracts.

---

## 7. Authoritative State

Authoritative state is data that represents the current business truth within an owned domain.

Examples:

- customer account state;
- order state;
- inventory quantity;
- subscription status;
- reward balance;
- supplier status;
- delivery state.

An authoritative state must have an explicit owner and mutation path.

---

## 8. Projections

A projection is a derived representation of authoritative data.

Examples:

```text
Order Domain
     ↓
OrderCompleted
     ↓
Analytics Projection
```

```text
Inventory Domain
     ↓
InventoryAdjusted
     ↓
Store Availability Projection
```

Projections may be rebuilt where their source events and source data permit.

---

## 9. Read Models

Read models may optimise queries without becoming authoritative.

Examples:

- customer dashboard view;
- product search index;
- store availability view;
- delivery tracking view;
- AI context view.

The read model must identify its source and freshness characteristics.

---

## 10. Caches

Caches are never authoritative merely because they contain recent data.

Every cache must have:

- owner;
- invalidation or expiry strategy;
- acceptable staleness;
- failure behaviour;
- security classification;
- and reconstruction strategy where practical.

---

## 11. Data Consistency

Consistency requirements are domain-specific.

Strong consistency should be used where business correctness requires it.

Examples may include:

- payment state;
- order mutation;
- inventory reservation;
- reward financial settlement.

Eventual consistency may be used for:

- analytics;
- recommendations;
- search indexes;
- learning projections;
- non-critical dashboards.

The system must not present stale derived data as authoritative current state.

---

## 12. Cross-Domain Data Access

A domain requiring another domain's information must use an approved mechanism:

```text
Domain A
   │
   ├── API / Query
   │
   └── Event / Projection
   │
   ▼
Domain B
```

Direct database reads across ownership boundaries are prohibited as an architectural default.

Exceptions require explicit approval and documented rationale.

---

## 13. Commands and Data Mutation

A consumer must not mutate another domain's authoritative state by editing its database.

Instead:

```text
Request
  ↓
Authorised API / Command
  ↓
Owning Domain
  ↓
State Change
  ↓
Event
```

This preserves ownership, authorization and auditability.

---

## 14. Data Contracts

Cross-domain data exchange must use governed contracts.

Contracts may be expressed through:

- API schemas;
- event schemas;
- integration schemas;
- approved analytical interfaces.

Internal database schemas are not enterprise integration contracts.

---

## 15. Data Classification

Enterprise data must carry an appropriate classification.

Initial classifications include:

- Public;
- Internal;
- Confidential;
- Restricted;
- Highly Restricted.

Classification determines handling, access, retention, movement, analytics and AI eligibility.

Data classification is particularly important at scale because it allows protection requirements to follow data across different repositories and environments. citeturn0search0turn0search5

---

## 16. Personal Data Minimisation

Essentials Mart shall collect and retain only personal information required for an identified purpose.

Where an attribute reference or derived answer is sufficient, the system should avoid unnecessarily distributing the full underlying attribute.

This follows the established data-minimisation principle that unnecessary PII increases exposure and privacy risk. citeturn0search4turn0search13

---

## 17. Sensitive Data Isolation

Sensitive data should be isolated from general-purpose data stores where justified by risk.

Examples:

- payment credentials;
- authentication secrets;
- identity-verification evidence;
- security investigations;
- highly sensitive customer information;
- privileged employee information.

Consumers should receive the minimum data required for their purpose.

---

## 18. Payment Data

Payment-sensitive information must not be unnecessarily replicated across the enterprise.

Where a payment provider or tokenization mechanism can represent the payment instrument safely, Essentials Mart should prefer governed references or tokens rather than storing raw payment credentials.

---

## 19. Identity Data

Identity data is authoritative within the Identity domain.

Other domains may maintain governed identifiers and relevant attributes, but must not independently redefine identity truth.

Identity attributes must be propagated according to authorization and privacy requirements.

---

## 20. Inventory Data

Inventory is authoritative within the Inventory domain.

Derived views may include:

- store availability;
- search availability;
- Walk Mode availability;
- replenishment projections;
- analytics.

These views must not become competing inventory truths.

---

## 21. Commerce Data

Commerce owns authoritative order and transaction lifecycle data.

Analytics, Rewards, Trust, Learning and Intelligence Engines consume governed representations rather than modifying commerce state directly.

---

## 22. Subscription Data

Essentials Subscription owns subscription configuration and lifecycle state.

It may reference:

- customer preferences;
- products;
- inventory;
- pricing;
- delivery resources;
- route schedules.

It does not own those underlying domains.

This preserves the architectural rule that Subscription extends existing shopping, checkout, fulfilment and delivery capabilities rather than replacing them.

---

## 23. Delivery Data

Delivery owns delivery execution state.

The Route Optimisation capability may calculate derived routes using:

- orders;
- subscription schedules;
- vehicle availability;
- vehicle capacity;
- warehouse staff capacity;
- driver/transport availability;
- scheduled transport;
- geography;
- traffic or estimated travel time where available.

Route calculations remain derived decisions until an authorised dispatch action changes delivery state.

---

## 24. Partner Data

Partner integrations must be isolated through integration boundaries.

A partner must not receive unrestricted access to internal databases.

Partner data should enter through:

```text
Partner
  ↓
Integration Adapter
  ↓
Validation / Authorization
  ↓
Domain Command or Event
```

This supports partner substitution without restructuring core data ownership.

---

## 25. Analytics Data

Analytics may consolidate governed copies of enterprise data.

Analytical stores are not automatically authoritative for operational state.

Every analytical dataset should preserve provenance to its source domain or event set where material.

---

## 26. Learning Data

The Learning Engine may consume historical outcomes and derived datasets.

Training and learning datasets must identify:

- source;
- purpose;
- classification;
- lineage;
- permitted use;
- retention;
- quality;
- and applicable privacy restrictions.

Sensitive data must not be used for learning merely because it is technically accessible.

---

## 27. AI Data Access

AI agents and Intelligence Engines receive governed data access according to capability and authorization.

```text
AI Agent
   ↓
Capability
   ↓
Authorization
   ↓
Approved Data Interface
   ↓
Minimum Required Data
```

AI access does not create ownership.

AI systems must not bypass domain APIs or data controls merely because they can technically reach a datastore.

---

## 28. AI Context Stores

AI systems may maintain context stores, embeddings or other derived representations.

These are not automatically authoritative business data.

Every AI-derived representation must identify:

- source;
- generation method;
- timestamp;
- applicable model or engine;
- classification;
- retention;
- and deletion/rebuild strategy.

---

## 29. Vector and Semantic Stores

Vector stores may be used for:

- semantic product search;
- knowledge retrieval;
- AI context;
- recommendation support;
- internal knowledge retrieval.

They must remain derived representations unless explicitly designated otherwise.

Source-of-truth data remains within the owning domain.

---

## 30. Data Lineage

Material data transformations must be traceable.

Conceptually:

```text
Source Domain
     ↓
Event / API
     ↓
Transformation
     ↓
Projection
     ↓
Analytics / AI / Decision
```

Lineage supports:

- audit;
- debugging;
- model governance;
- compliance;
- incident investigation;
- reproducibility.

---

## 31. Data Retention

Retention is purpose-driven.

Each governed dataset should define:

- purpose;
- retention period;
- archival behaviour;
- deletion behaviour;
- legal or regulatory constraints;
- replay requirements;
- security classification.

Indefinite retention must not be the default.

---

## 32. Deletion and Privacy

Data deletion requirements must be considered when designing append-only, event-driven and analytical architectures.

Where historical records cannot simply be deleted without compromising integrity, the architecture must provide an approved strategy such as:

- minimised event payloads;
- tokenization;
- separation of identifying information;
- controlled redaction where legally and architecturally appropriate;
- cryptographic protection strategies;
- retention expiration;
- derived-data rebuild.

Append-only architecture must not become an excuse to ignore privacy obligations.

---

## 33. Encryption

Sensitive data must be protected in transit and at rest according to classification and risk.

Key management must be separated from application data where appropriate.

Encryption must not be treated as a replacement for authorization.

---

## 34. Database Access Control

Database access must follow least privilege.

Applications should receive only the permissions required for their role.

Administrative access must be separately controlled, monitored and auditable.

No general application identity should possess unrestricted enterprise database access.

---

## 35. Multi-Tenant Data Isolation

Where multiple customers, organisations, stores or partners share infrastructure, data isolation must be explicit.

Isolation mechanisms may include:

- tenant identifiers;
- row-level security;
- separate schemas;
- separate databases;
- separate accounts;
- regional stores;
- policy enforcement.

The appropriate mechanism depends on risk and deployment model.

---

## 36. Geographic Data Boundaries

Global deployment must support regional and country-specific data requirements.

Data residency, replication, transfer and access policies must be enforceable by geography where required.

A globally distributed architecture must not assume that all data may freely cross every regional boundary.

---

## 37. Data Replication

Replication is permitted where justified by:

- availability;
- performance;
- disaster recovery;
- analytics;
- regional operation.

Replicated data must retain clear ownership and freshness semantics.

Replication does not create a second owner.

---

## 38. Distributed Transactions

Distributed database transactions across domain boundaries should be avoided where possible.

Preferred pattern:

```text
Domain A
  ↓
Local Transaction
  ↓
Event
  ↓
Domain B
  ↓
Local Transaction
```

Where business processes span multiple domains, workflow, saga or compensating-action patterns may be used.

Distributed transactions should be reserved for cases where their complexity is justified by business requirements.

---

## 39. Data Integrity

Each authoritative domain is responsible for enforcing its own invariants.

A consumer must not assume that a copied representation can enforce the producer's business rules.

Validation therefore occurs at the owning boundary.

---

## 40. Schema Evolution

Database schemas must evolve without unnecessarily breaking consumers.

Migration strategies should support:

- additive changes;
- compatibility periods;
- controlled backfills;
- versioned interfaces;
- safe migration sequencing;
- rollback where practical.

Database schema changes must not silently redefine domain meaning.

---

## 41. Data Quality

Critical datasets must have measurable quality characteristics.

These may include:

- completeness;
- accuracy;
- consistency;
- timeliness;
- uniqueness;
- validity;
- provenance.

Data-quality failures must be observable and attributable.

---

## 42. Operational Data and Telemetry

Operational telemetry may be stored separately from business data.

Telemetry should support:

- observability;
- security monitoring;
- performance analysis;
- incident response;
- capacity planning.

Telemetry retention must remain purpose-driven.

---

## 43. Event Data

Events are governed facts, not unrestricted database replicas.

Event payloads must contain sufficient information for their intended consumers while minimising unnecessary duplication.

Durable event storage must follow the classification, retention and privacy rules established by the owning domain.

---

## 44. Search Indexes

Search indexes are projections.

They may optimise:

- product discovery;
- store discovery;
- supplier search;
- customer-facing search;
- operational search.

Search results must respect source-of-truth authority, freshness and authorization.

---

## 45. Data Access Patterns

The implementation should explicitly document whether data is accessed through:

- command API;
- query API;
- event subscription;
- projection;
- cache;
- analytical interface;
- governed integration.

Undocumented direct access is prohibited for production architecture.

---

## 46. Backup and Recovery

Authoritative data must have recovery mechanisms appropriate to its criticality.

Backups must be:

- protected;
- access-controlled;
- tested;
- monitored;
- recoverable;
- geographically appropriate where required.

Recovery objectives must align with EDA-001 Part 4 and EIP-021 resilience requirements.

---

## 47. Data Recovery Validation

A backup is not considered reliable merely because it completed successfully.

Recovery must periodically be tested and validated.

Recovery tests should verify:

- integrity;
- completeness;
- application compatibility;
- access controls;
- lineage;
- operational usability.

---

## 48. Data Observability

Critical data pipelines must expose sufficient telemetry to identify:

- ingestion failures;
- replication lag;
- projection lag;
- schema failures;
- data-quality degradation;
- unauthorized access;
- unusual extraction;
- retention failures;
- deletion failures.

---

## 49. Data Security and Zero Trust

Data access must be authorized based on identity, capability, context and policy rather than network location alone.

Microservice data access may use mutual authentication and attribute-based authorization where appropriate. NIST's microservices guidance identifies mutual authentication and scalable authorization as core requirements for zero-trust service communication. citeturn0search16

---

## 50. Data Export

Exports must be governed.

The architecture must support:

- purpose limitation;
- authorization;
- classification checks;
- volume limits;
- audit logging;
- expiration;
- secure transfer;
- revocation where applicable.

Bulk export must not bypass ordinary access controls.

---

## 51. Data Sharing

Cross-organisational sharing must use explicitly governed interfaces.

The receiving party must receive only the information required for the approved purpose.

Federated and partner data sharing must preserve ownership, authorization and privacy. NIST research on federated data sharing similarly identifies differing database schemas and security/privacy concerns as key challenges. citeturn0search8

---

## 52. Data Access for Support Staff

Human staff must receive role-appropriate views rather than unrestricted database access.

Sensitive fields should be masked or omitted where not required.

Staff access must be attributable and auditable.

---

## 53. Data Access for AI Society

AI Society components must use capability-specific data interfaces.

For example:

```text
Inventory Intelligence
       ↓
Inventory Read Capability
       ↓
Approved Inventory Projection
```

rather than:

```text
AI Agent
   ↓
Direct Database Access
   ✗
```

---

## 54. Data Ownership During Service Extraction

When a modular component becomes an independently deployable service, its existing logical data ownership must move with the component.

The extraction process must define:

- source ownership;
- migration plan;
- dual-read/dual-write strategy where required;
- cutover;
- validation;
- rollback;
- contract continuity.

---

## 55. Data Architecture and Part 4

EIP-022 implements the defensive requirements established by EDA-001 Part 4.

Relevant controls include:

- data protection;
- API boundary protection;
- monitoring;
- incident response;
- resilience;
- adversarial verification;
- IP protection;
- global scalability;
- governance;
- assurance.

Data architecture must therefore remain observable, recoverable, classifiable and governed.

---

## 56. Data Architecture and EIP-021

EIP-021 defines backend service boundaries.

EIP-022 defines how data ownership follows those boundaries.

```text
EIP-020
Domain / Context
      ↓
EIP-021
Service Boundary
      ↓
EIP-022
Data Boundary
```

This prevents service decomposition from accidentally creating ambiguous data ownership.

---

## 57. Data Architecture and EDA

EDA establishes enterprise information ownership and event governance.

EIP-022 operationalises those rules through:

- authoritative stores;
- governed projections;
- data contracts;
- event-derived views;
- lineage;
- retention;
- access controls.

---

## 58. Data Architecture and ADR-005

ADR-005 remains the architectural decision governing data ownership and database boundaries.

EIP-022 is the implementation pattern derived from that decision.

It must not redefine ADR-005's architectural authority.

---

## 59. Implementation Rules

The following rules are mandatory unless explicitly excepted:

1. Every authoritative dataset has an owner.
2. Domain ownership defines authoritative data ownership.
3. Consumers do not directly mutate another domain's database.
4. Direct cross-domain database reads are not the default integration mechanism.
5. APIs, events and projections are governed interfaces.
6. Caches are not authoritative.
7. Read models are not authoritative unless explicitly designated.
8. Replicas do not create ownership.
9. Data classification follows the data.
10. Sensitive data is minimised.
11. Personal data is purpose-limited.
12. AI access does not create data ownership.
13. AI agents must not bypass governed data interfaces.
14. Data lineage must be retained for material transformations.
15. Retention must be purpose-driven.
16. Recovery mechanisms must be tested.
17. Data access must be attributable.
18. Multi-tenant isolation must be explicit.
19. Geographic data boundaries must be enforceable where required.
20. Distributed transactions must not be used casually.
21. Schema evolution must be governed.
22. Data quality must be measurable for critical datasets.
23. Bulk exports must be governed.
24. Partner data access must be mediated through integration boundaries.
25. Data architecture must remain traceable to EDA, ADR and EIP requirements.

---

## 60. Implementation Readiness Gate

EIP-022 is implementation-ready when each domain has:

- authoritative data identified;
- data owner identified;
- logical schema boundary identified;
- classification defined;
- retention defined;
- access model defined;
- integration paths defined;
- projection requirements identified;
- recovery requirements defined;
- lineage requirements defined;
- data-quality requirements defined.

No domain should proceed to production implementation without satisfying the applicable data-boundary requirements.

---

## 61. Final Principle

> **Essentials Mart shall treat data as an owned enterprise asset with explicit authority, controlled movement, observable lineage and purpose-driven retention.**

The architecture must make it possible to answer:

```text
What data is this?
Who owns it?
Where is the authoritative copy?
Who may access it?
Why may they access it?
Where did it come from?
Where has it travelled?
How long should it exist?
How is it recovered?
How is it deleted or de-identified where required?
How can we prove all of this?
```

Those answers form the data foundation on which Commerce, AI Society, Intelligence Engines, Walk Mode, Subscription, Delivery, Analytics, Learning and future capabilities can safely operate.