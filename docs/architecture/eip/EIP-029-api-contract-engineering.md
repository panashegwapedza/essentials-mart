# EIP-029 — API & Contract Engineering

**Status:** Proposed / Build Baseline  
**Date:** 2026-08-23  
**Decision Type:** Implementation Architecture  
**Parent Architecture:** ADR-004 — API & Service Architecture  
**Depends On:** EIP-019, EIP-020, EIP-021, EIP-022, EIP-023, EIP-024, EIP-025, EIP-027, EIP-028, ADR-003, ADR-004, ADR-005, ADR-007, ADR-008, ADR-009, ADR-010, ADR-011, ADR-012, ADR-014, ADR-016, ADR-017, ADR-018, EDA-001 Part 2, EDA-001 Part 4

## 1. Purpose

EIP-029 defines the engineering architecture for designing, publishing, validating, evolving and governing the contracts through which Essentials Mart components communicate.

It covers:

- synchronous APIs;
- asynchronous event contracts;
- data contracts;
- external integration contracts;
- client-facing contracts;
- internal service contracts;
- authentication and authorization requirements at contract boundaries;
- compatibility;
- versioning;
- validation;
- contract testing;
- documentation;
- deprecation;
- and implementation traceability.

EIP-029 does not replace ADR-004 or the event architecture. It establishes the reusable engineering patterns used to implement those decisions.

## 2. Constitutional Principle

> **Every material system boundary must have an explicit, owned, testable and evolvable contract.**

A contract is part of the architecture, not merely documentation generated after implementation.

Contracts must preserve the distinction between:

```text
Command
   ↓
Request for action

Query
   ↓
Request for information

Event
   ↓
Fact that something happened

Data Contract
   ↓
Defined representation and meaning of information
```

## 3. Contract Domains

Essentials Mart shall recognise several contract classes:

### API Contracts

Define synchronous request/response interactions between clients, services and approved external consumers.

### Event Contracts

Define the structure and semantics of events published through the enterprise event architecture.

### Data Contracts

Define governed representations exchanged between data-producing and data-consuming capabilities.

### Integration Contracts

Define the boundary between Essentials Mart and external systems such as payment, delivery, identity, WhatsApp and mapping providers.

### AI Tool Contracts

Define the structured interfaces through which AI agents invoke authorised capabilities.

### Client Contracts

Define the interfaces consumed by Flutter and other approved clients.

## 4. Contract Ownership

Every governed contract must have an owner.

The owner is responsible for:

- semantic correctness;
- schema definition;
- documentation;
- compatibility policy;
- version lifecycle;
- security classification;
- change approval;
- consumer communication;
- and retirement.

Consumers may depend on a contract but do not acquire ownership of it.

Contract ownership follows domain and capability ownership established by the enterprise architecture.

## 5. Contract-First Engineering

Material interfaces should be designed contract-first.

Conceptually:

```text
Business Capability
        ↓
Contract Definition
        ↓
Validation Rules
        ↓
Generated / Implemented Interface
        ↓
Contract Tests
        ↓
Runtime
```

Implementation details must not silently redefine the public meaning of a contract.

API-first and contract-first approaches improve independent development because consumers and producers can work against an agreed interface before implementation is complete. citeturn0search0turn0search3

## 6. API Boundary Model

The backend architecture should distinguish:

```text
Client / External Consumer
          ↓
Edge / API Gateway
          ↓
API Contract
          ↓
Application / Capability Boundary
          ↓
Domain
          ↓
Authoritative Data
```

The API layer must not become the owner of domain truth merely because it exposes that truth.

## 7. Resource and Capability Design

APIs should expose meaningful resources and capabilities rather than internal database tables.

Avoid exposing implementation structures such as:

```text
GET /internal_table_123
POST /database_row_update
```

Prefer business-oriented boundaries such as:

```text
GET /products/{productId}
POST /orders
POST /orders/{orderId}/cancel
GET /customers/{customerId}/rewards
```

The exact endpoint catalogue belongs to implementation design and must remain aligned with domain ownership.

## 8. Command and Query Separation

Where appropriate, APIs should preserve the distinction between commands and queries.

A command requests a state-changing operation.

A query retrieves information without requesting a business mutation.

Examples:

```text
POST /orders
       → PlaceOrder

GET /orders/{id}
       → GetOrder
```

A query must not secretly perform consequential business actions.

## 9. Synchronous Communication

Synchronous APIs should be used when the caller requires an immediate response or when business semantics require request-time validation.

Examples include:

- authentication;
- payment authorization;
- current product information;
- basket validation;
- immediate command acceptance;
- and permission evaluation.

Event-driven communication must not be forced into interactions that require immediate consistency or a direct response.

Mature event-driven systems commonly combine asynchronous event flows with synchronous request/response interfaces rather than replacing one with the other. citeturn0search2turn0search3

## 10. Asynchronous Contracts

Asynchronous contracts are governed through the event architecture established by EDA-001 Part 2 and EIP-023.

They must define:

- event name;
- event version;
- envelope;
- payload;
- ownership;
- classification;
- delivery expectations;
- ordering requirements;
- replay implications;
- and compatibility rules.

Event schemas and semantics are the primary coupling between producers and consumers, making their governance critical. citeturn0search4

## 11. Contract Schema

Every governed contract should define, where applicable:

```text
Contract
├── contractId
├── contractType
├── version
├── owner
├── purpose
├── classification
├── schema
├── validationRules
├── compatibilityPolicy
├── lifecycleState
└── documentationReference
```

Schema fields must have stable semantic meaning.

A field must not change meaning merely because its name and data type remain unchanged.

## 12. Semantic Stability

Contract compatibility is not limited to syntax.

The following can constitute a breaking change even when a schema remains technically valid:

- changing the meaning of an enum value;
- changing units;
- changing whether a value is authoritative;
- changing null semantics;
- changing timestamp interpretation;
- changing ordering assumptions;
- or changing whether an operation is reversible.

Contract governance must therefore evaluate semantic compatibility as well as structural compatibility.

## 13. API Versioning

Versioning should be deliberate and tied to meaningful contract evolution.

A version must not change merely because the implementation was refactored internally.

Preferred strategies may include:

```text
/v1/...
/v2/...
```

or equivalent media-type, header or contract-version mechanisms where justified.

The selected mechanism must remain consistent across the API governance model.

## 14. Event Versioning

Event versioning remains governed by EIP-023.

Breaking event changes require an explicit migration strategy.

Where possible, prefer additive evolution so independent consumers can continue operating.

Consumers must not be assumed to upgrade simultaneously with producers.

## 15. Backward Compatibility

Compatible changes should be preferred where practical.

Examples may include:

- adding optional fields;
- adding optional response metadata;
- introducing new endpoints without changing existing ones;
- adding new event types;
- and extending enumerations only where consumers are designed to tolerate unknown values.

Compatibility must be tested rather than assumed.

## 16. Breaking Changes

Breaking changes require:

- explicit identification;
- owner approval;
- impact analysis;
- affected-consumer identification;
- migration plan;
- deprecation period where practical;
- verification;
- and updated traceability.

A producer must not silently break independent consumers.

## 17. Deprecation

Contracts must have a controlled lifecycle.

```text
Proposed
   ↓
Approved
   ↓
Active
   ↓
Deprecated
   ↓
Retired
```

Deprecation should communicate:

- replacement contract;
- migration deadline;
- compatibility period;
- affected consumers;
- and retirement criteria.

## 18. Validation

Contract validation should occur at appropriate boundaries.

Validation may include:

- required fields;
- data types;
- formats;
- ranges;
- enumerations;
- business constraints;
- authorization context;
- classification;
- and semantic rules.

Validation should reject malformed or unauthorized requests before they reach sensitive domain operations where possible.

## 19. Error Contracts

Errors must be represented consistently enough for clients and services to distinguish meaningful failure categories.

Conceptually:

```text
Error
├── code
├── category
├── message
├── correlationId
├── traceId
├── retryable
├── details
└── documentationReference
```

Error messages must not leak secrets or sensitive implementation details.

The client must not infer success merely because a transport-level request completed.

## 20. Failure Semantics

Contracts should distinguish at least:

```text
Accepted
Completed
Rejected
Failed
Unknown
Cancelled
Expired
```

Not every contract requires every state, but consequential operations must not collapse materially different outcomes into a single generic response.

This aligns with EIP-028's requirement that unknown external or distributed outcomes remain explicitly unknown rather than being represented as success.

## 21. Idempotency

Consequential commands should support idempotency where duplicate delivery or client retries could create duplicate effects.

Examples include:

- placing orders;
- payment operations;
- reward granting;
- delivery creation;
- notification dispatch;
- and external provider requests.

Conceptually:

```text
Request
  ↓
Idempotency Key
  ↓
Operation Registry
  ↓
Execute once
  ↓
Return stable result
```

This is particularly important in distributed systems where retries and duplicate delivery are normal operating conditions. citeturn0search0turn0search4

## 22. Pagination

Collection APIs must use governed pagination for potentially large result sets.

The contract should define:

- page or cursor mechanism;
- page size limits;
- ordering;
- continuation behaviour;
- and consistency expectations.

Cursor-based pagination should be preferred for large or changing collections where stable traversal is required.

## 23. Filtering and Sorting

Filtering and sorting capabilities must be explicit.

A consumer must not rely on undocumented default ordering.

Where ordering affects business interpretation, the contract must define it explicitly.

## 24. Concurrency and Conditional Requests

Where concurrent modification is possible, contracts should provide appropriate concurrency controls.

Possible mechanisms include:

- version numbers;
- ETags;
- conditional requests;
- optimistic concurrency tokens;
- or domain-specific conflict detection.

The objective is to prevent silent overwrites of newer state.

## 25. Authentication and Authorization

Contracts must define the security boundary required to invoke them.

Authentication answers:

```text
Who is calling?
```

Authorization answers:

```text
What is this caller allowed to do?
```

A valid authentication token must not automatically grant access to every API capability.

Authorization remains governed by ADR-006, ADR-009, EIP-021 and the security architecture.

## 26. Tenant and Organisation Context

Where applicable, contracts must carry governed context such as:

- tenant;
- organisation;
- store;
- region;
- country;
- environment;
- and principal context.

The server must derive or verify security-sensitive context rather than trusting arbitrary client-provided identifiers.

## 27. Sensitive Data

Contracts must minimise sensitive information.

Do not expose:

- passwords;
- authentication secrets;
- payment credentials;
- private model reasoning;
- unnecessary personal data;
- security internals;
- or unrelated household information.

Where a reference is sufficient, prefer:

```text
Identifier
   ↓
Authorised retrieval
```

rather than broadcasting the full sensitive object.

This is consistent with the payload-minimisation approach established by EIP-023 and the observability controls in EIP-028.

## 28. External Provider Contracts

External provider contracts must be isolated behind integration boundaries.

Examples include:

- WhatsApp;
- payment providers;
- delivery providers;
- mapping services;
- identity providers;
- notification providers;
- AI model providers.

The internal domain must not become coupled directly to every provider-specific representation.

Conceptually:

```text
Essentials Mart Domain
        ↓
Internal Integration Contract
        ↓
Provider Adapter
        ↓
External Provider
```

Provider changes should therefore be absorbed by the adapter wherever practical.

## 29. Provider Outcome Handling

External integrations must represent uncertain outcomes explicitly.

For example:

```text
Request Sent
    ↓
Provider Accepted
    ↓
Processing
    ↓
Confirmed
```

or:

```text
Request Sent
    ↓
Timeout
    ↓
UNKNOWN
```

A timeout must not automatically become a failed business operation if the provider may have processed the request.

This prevents duplicate payments, deliveries, notifications and other irreversible side effects.

## 30. AI Tool Contracts

AI agents must interact with business capabilities through governed contracts.

An AI tool contract should define:

- capability identity;
- input schema;
- output schema;
- authorization requirements;
- allowed principal types;
- side-effect classification;
- confirmation requirements;
- rate limits;
- audit requirements;
- and failure semantics.

The AI Society must not receive unrestricted direct access to internal databases or arbitrary service methods.

## 31. Authority Boundary

A contract defines what can be requested; authorization determines what may actually be performed.

Therefore:

```text
Tool Contract
      ↓
Capability
      ↓
Permission
      ↓
Authority Check
      ↓
Execution
      ↓
Audit / Event
```

This preserves the authority model established by ADR-009, EIP-024 and EIP-028.

## 32. Client Contracts

Flutter clients should consume stable, purpose-oriented contracts rather than database-shaped responses.

Client contracts should support:

- offline-aware behaviour;
- pagination;
- retries;
- version compatibility;
- feature availability;
- permission state;
- and explicit error handling.

The client must not be treated as an authoritative source for security-sensitive state.

## 33. Offline and Limited Connectivity

Essentials Mart must account for limited-connectivity scenarios, including WhatsApp-based interactions and store-level resilience.

Contracts should define which operations are:

```text
Online Only
Offline Safe
Deferred
Retryable
Non-Retryable
```

Commands queued locally must include sufficient identity and idempotency information to prevent duplicate effects when connectivity returns.

## 34. Real-Time Client Updates

Where clients require live updates, event-driven or streaming mechanisms may be used rather than inefficient polling.

Possible patterns include:

- Server-Sent Events;
- WebSockets;
- managed pub/sub;
- push notifications;
- or application-specific event channels.

The selected mechanism must reflect the communication direction, latency requirement, connection characteristics and operational environment. Event-driven API designs commonly combine brokers with WebSockets, webhooks or server-sent mechanisms according to use case. citeturn0search3

## 35. Contract Documentation

Every governed contract must be discoverable through appropriate documentation.

Documentation should include:

- purpose;
- owner;
- authentication requirements;
- authorization requirements;
- request schema;
- response schema;
- errors;
- examples;
- version;
- compatibility policy;
- lifecycle status;
- and related architecture.

OpenAPI should be used for applicable HTTP API contracts, while event contracts should use a suitable event-contract specification such as AsyncAPI or an equivalent governed representation. AsyncAPI is widely used to document event-driven APIs. citeturn0search3

## 36. Contract Registry

Essentials Mart should maintain a discoverable registry for governed contracts.

Conceptually:

```text
Contract Registry
├── APIs
├── Events
├── Data Contracts
├── Integrations
├── AI Tools
└── Client Contracts
```

The registry should expose ownership, version, lifecycle and compatibility information.

The registry is an implementation governance mechanism and must not become a second source of architectural truth.

## 37. Contract Testing

Contract testing must verify producer and consumer assumptions independently.

Tests should cover:

- schema validity;
- required fields;
- response compatibility;
- event compatibility;
- authentication;
- authorization;
- idempotency;
- failure semantics;
- unknown outcomes;
- pagination;
- concurrency;
- external adapters;
- and version migration.

Contract tests should run as part of CI/CD where practical.

## 38. Consumer Compatibility

Consumers should be designed defensively.

They should:

- tolerate additive fields;
- avoid assuming undocumented fields;
- handle unknown enum values safely where appropriate;
- handle explicit failure states;
- respect version policy;
- and stop relying on deprecated contracts before retirement.

Producer compatibility alone is insufficient if consumers are brittle.

## 39. Schema Registry and Validation Pipeline

Where event or data volume justifies it, a schema registry should provide central validation and compatibility checks.

A conceptual pipeline is:

```text
Contract Change
      ↓
Schema Validation
      ↓
Compatibility Check
      ↓
Consumer Impact Check
      ↓
Contract Tests
      ↓
Approval
      ↓
Publication
```

The registry implementation remains a technology decision unless separately standardised.

## 40. Change Management

A contract change must follow a controlled process:

```text
Proposed Change
      ↓
Impact Analysis
      ↓
Compatibility Assessment
      ↓
Owner Review
      ↓
Consumer Verification
      ↓
Approval
      ↓
Release
      ↓
Monitoring
```

Breaking changes require stronger governance than additive changes.

## 41. Contract Observability

Material API and contract interactions must integrate with EIP-028 telemetry.

Requests should be traceable using appropriate:

- requestId;
- correlationId;
- causationId;
- traceId;
- eventId;
- commandId;
- and provider reference.

Telemetry must reference contract activity without leaking sensitive payloads.

## 42. Contract Security

Contract security must include:

- authentication;
- authorization;
- input validation;
- rate limiting;
- abuse detection;
- payload-size limits;
- schema validation;
- secret protection;
- transport security;
- and sensitive-data controls.

Security controls must be applied according to the risk of the capability rather than uniformly assuming every API has identical requirements.

## 43. Rate Limits and Resource Protection

Contracts must define appropriate resource protections where abuse or accidental overload is possible.

Potential controls include:

- per-principal limits;
- per-tenant limits;
- endpoint limits;
- burst limits;
- concurrency limits;
- payload limits;
- and adaptive throttling.

Rate limiting must not be used as a substitute for capacity planning.

## 44. Contract Resilience

Clients and services must handle transient failures explicitly.

Patterns may include:

- bounded retries;
- exponential backoff;
- circuit breaking;
- timeout budgets;
- fallback behaviour;
- queueing;
- and graceful degradation.

Retries must be safe only where the operation is idempotent or otherwise protected against duplicate effects.

## 45. Distributed Workflow Contracts

Long-running workflows should not be represented as one indefinitely open synchronous request.

Where appropriate:

```text
Start Command
     ↓
Accepted
     ↓
Workflow / Events
     ↓
Progress
     ↓
Completed / Failed / Cancelled
```

This model is appropriate for operations such as:

- delivery coordination;
- supplier fulfilment;
- human approval;
- long-running AI tasks;
- and complex replenishment workflows.

## 46. Contract Lineage

Material contracts should be traceable to their architectural source.

Conceptually:

```text
ADR
 ↓
EIP
 ↓
Capability
 ↓
Contract
 ↓
Implementation
 ↓
Tests
 ↓
Evidence
```

EIP-019 remains the authoritative traceability mechanism.

## 47. Relationship With EIP-020

EIP-020 establishes the domain and bounded-context implementation map.

EIP-029 translates those boundaries into explicit communication contracts.

```text
Domain Boundary
      ↓
Capability Boundary
      ↓
Contract Boundary
      ↓
Implementation
```

A contract must not silently erase a bounded-context boundary.

## 48. Relationship With EIP-021

EIP-021 defines backend service and API implementation architecture.

EIP-029 defines the engineering discipline governing the contracts exposed by those services.

Therefore:

```text
EIP-021
Backend Service
      ↓
EIP-029
Contract Engineering
      ↓
API / Event / Integration Interface
```

## 49. Relationship With EIP-023

EIP-023 governs event infrastructure and event delivery.

EIP-029 governs the contract discipline applied to the event schemas and consumers.

The broker remains infrastructure; the event contract remains an enterprise interface.

## 50. Relationship With EIP-024

EIP-024 governs the AI Society runtime.

EIP-029 governs the capability and tool contracts through which agents interact with authorised system capabilities.

This ensures AI agents operate through explicit interfaces rather than implementation-level access.

## 51. Relationship With EIP-025

EIP-025 defines Flutter client implementation architecture.

EIP-029 provides the stable API and real-time contracts consumed by the client.

The client must remain compatible with supported contract versions without embedding server-side business authority.

## 52. Relationship With EIP-028

EIP-028 provides observability, auditability and trust implementation architecture.

EIP-029 ensures contract interactions emit the identifiers and outcomes required for that architecture.

This creates a consistent chain from contract invocation to operational and accountability evidence.

## 53. Testing and Verification Requirements

The implementation must verify:

- contract schemas;
- semantic rules;
- authentication;
- authorization;
- compatibility;
- versioning;
- idempotency;
- failure states;
- concurrency behaviour;
- pagination;
- rate limits;
- external-provider outcomes;
- AI tool boundaries;
- offline/deferred operations;
- event contracts;
- and contract retirement.

Verification evidence should be traceable through EIP-019.

## 54. Engineering Rules

EIP-029 establishes the following implementation rules:

1. Every material boundary has an explicit contract.
2. Contract ownership follows domain or capability ownership.
3. Contracts describe business meaning, not database implementation.
4. Commands, queries and events remain distinct.
5. Synchronous APIs are used where immediate response or consistency is required.
6. Asynchronous contracts are governed through the event architecture.
7. Contract schemas are versioned deliberately.
8. Semantic compatibility matters as much as structural compatibility.
9. Breaking changes require impact analysis and migration planning.
10. Consequential commands should be idempotent where duplicate delivery is possible.
11. Error contracts must distinguish meaningful failure states.
12. Unknown outcomes must remain unknown until resolved.
13. Sensitive information must be minimised.
14. External providers must be isolated behind integration boundaries.
15. AI agents must use governed capability contracts.
16. Contract security must be enforced at the boundary.
17. Client contracts must not expose authoritative backend authority to the client.
18. Offline and deferred operations require explicit semantics.
19. Contract changes must be tested independently.
20. Contract lifecycle must include deprecation and retirement.
21. Material contracts must be observable and traceable.
22. Contract definitions must remain aligned with ADRs and EIPs.
23. Contract registries must support discovery without becoming a second source of truth.
24. Contract engineering must preserve domain boundaries rather than bypass them.

## 55. Architectural Outcome

EIP-029 establishes contract engineering as a governed implementation discipline across Essentials Mart.

The resulting model is:

```text
                    ARCHITECTURE
                         │
                         ▼
                  DOMAIN / CAPABILITY
                         │
                         ▼
                   CONTRACT OWNER
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
          APIs         Events      Integrations
            │            │            │
            └────────────┼────────────┘
                         ▼
                 Validation / Security
                         │
                         ▼
                Contract Implementation
                         │
                         ▼
                 Contract Verification
                         │
                         ▼
               Observability / Evidence
                         │
                         ▼
                  Controlled Evolution
```

This allows Essentials Mart to evolve independently across domains, services, clients, AI capabilities and external integrations without allowing undocumented interfaces to become hidden architectural dependencies.

## 56. Final Architectural Principle

> **Essentials Mart shall engineer contracts as first-class architectural assets: owned, explicit, secure, testable, observable and evolvable.**

Contracts are the controlled boundaries through which the enterprise communicates without surrendering domain ownership, security, resilience or future changeability.

---

# Commit 029

```text
docs(eip): add EIP-029 API and contract engineering

- Define API, event, data, integration and AI tool contract engineering
- Establish contract ownership and contract-first implementation
- Define synchronous and asynchronous interface boundaries
- Establish schema, semantic and compatibility governance
- Define API and event versioning and deprecation
- Establish validation and error contract requirements
- Require idempotency for consequential retryable operations
- Define concurrency, pagination and resource-protection patterns
- Establish external-provider adapter boundaries
- Define governed AI capability and tool contracts
- Establish client and limited-connectivity contract requirements
- Define contract documentation and registry requirements
- Establish contract testing and compatibility verification
- Integrate contracts with observability and audit traceability
- Define contract security and resilience requirements
- Establish distributed workflow contract patterns
- Define architectural relationships with EIP-019 through EIP-028
- Establish contract engineering rules for Essentials Mart
```
