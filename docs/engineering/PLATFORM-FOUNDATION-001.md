# PLATFORM-FOUNDATION-001 — Platform Foundation Baseline

**Project:** Essentials Mart  
**Status:** Baseline / Build Ready  
**Scope:** Backend, data, events, AI runtime, client integration and platform operations

## 1. Purpose

Establish the minimum runtime platform required to begin implementing Essentials Mart without bypassing the approved EDA, ADR and EIP architecture.

## 2. Constitutional Principle

> The platform foundation provides shared runtime capabilities; it must not become a hidden owner of domain business truth.

Platform capabilities must remain reusable, observable, secure, replaceable and independently governable.

## 3. Foundation Layers

The platform is organised into these layers:

```text
Client / External Channels
        ↓
Edge / API Gateway
        ↓
Application Runtime
        ↓
Platform Services
        ↓
Data + Event Infrastructure
        ↓
Infrastructure / Compute
        ↓
Observability + Security
```

## 4. Initial Platform Capabilities

The foundation shall provide or establish integration points for:

- API ingress and routing;
- service identity;
- authentication and authorisation integration;
- configuration management;
- secrets management;
- database connectivity;
- migrations;
- event publication and consumption;
- background jobs;
- object/file storage;
- caching where justified;
- observability;
- audit integration;
- health checks;
- rate limiting;
- resilience controls;
- notification integration;
- AI/model gateway integration;
- external integration adapters;
- CI/CD deployment interfaces.

## 5. Modular-First Runtime

Essentials Mart shall initially prefer a modular runtime where practical.

A capability shall become an independently deployed service only when justified by factors such as:

- independent scaling;
- security isolation;
- deployment independence;
- ownership;
- resilience/failure isolation;
- materially different operational requirements;
- regulatory or data-boundary requirements.

## 6. Technology Neutrality

This baseline defines required capabilities rather than prematurely locking the project to a vendor or infrastructure provider.

Technology selection must satisfy the existing EIPs and pass the architecture traceability process.

## 7. Container and Runtime Strategy

Where containerisation is adopted, images must be reproducible, minimal, versioned and scanned. Runtime workloads must run with least privilege and explicit configuration.

Container orchestration, if introduced, must support the required scaling, scheduling, health management, security and resilience characteristics.

## 8. Service-to-Service Security

Internal communication must use authenticated service identity and authorised service-to-service access.

Network location alone must not establish trust.

The implementation should support:

- mutual authentication where appropriate;
- encrypted transport;
- policy-based authorisation;
- credential rotation;
- service identity lifecycle management;
- auditable access decisions.

## 9. API Edge

The edge layer shall provide controlled ingress for clients and approved external partners.

Responsibilities may include:

- routing;
- authentication integration;
- authorisation enforcement;
- rate limiting;
- request validation;
- abuse protection;
- API version routing;
- telemetry;
- correlation propagation.

Business domain logic must remain behind the appropriate domain/service boundary.

## 10. Data Foundation

The platform shall provide governed connectivity to domain-owned data stores.

The platform must not create an uncontrolled shared database merely for convenience.

Required capabilities include:

- migrations;
- connection management;
- backup integration;
- encryption;
- access control;
- health monitoring;
- recovery procedures;
- environment isolation.

## 11. Event Foundation

The platform shall provide the runtime interfaces required by EIP-023.

It must support:

- durable publication where required;
- consumer groups/subscriptions;
- idempotency;
- retry;
- dead-letter/quarantine;
- replay controls;
- schema validation;
- correlation and causation propagation;
- event observability.

## 12. Background Processing

Long-running or asynchronous work shall use governed workers/jobs rather than blocking customer-facing requests unnecessarily.

Examples include:

- notification dispatch;
- fulfilment processing;
- route optimisation;
- subscription scheduling;
- analytics processing;
- AI jobs;
- event consumers;
- reconciliation.

## 13. AI Runtime Integration

The platform shall expose controlled integration points for the AI Society runtime defined by EIP-024.

AI workloads must use governed gateways for:

- model access;
- tool access;
- retrieval;
- secrets;
- permissions;
- telemetry;
- cost controls.

The platform must not give AI workloads unrestricted infrastructure access.

## 14. Client Integration

The Flutter client defined by EIP-025 shall access enterprise capabilities through governed APIs and approved realtime/event mechanisms.

The client must not connect directly to authoritative domain databases.

Offline operation must use explicit synchronisation boundaries rather than silently creating competing sources of truth.

## 15. Configuration and Secrets

Configuration must be environment-specific and externalised from application code where appropriate.

Secrets must:

- never be committed to source control;
- be centrally managed;
- have controlled access;
- be rotatable;
- be auditable;
- be separated by environment.

## 16. Observability Foundation

Every production-capable workload must expose sufficient telemetry for:

- health;
- latency;
- errors;
- throughput;
- dependency failures;
- resource utilisation;
- security events;
- event processing;
- distributed tracing.

Correlation identifiers established by the event and API architecture must propagate across meaningful operations.

## 17. Resilience

The platform shall provide appropriate mechanisms for:

- timeouts;
- retries with bounded policy;
- circuit breaking where justified;
- graceful degradation;
- health checks;
- backpressure;
- load balancing;
- queueing;
- recovery;
- regional failure handling.

Resilience mechanisms must not create uncontrolled duplicate business effects.

## 18. Environment Model

At minimum, the engineering lifecycle shall distinguish:

```text
Local
  ↓
CI / Validation
  ↓
Development
  ↓
Staging
  ↓
Production
```

Production credentials, data and infrastructure must remain isolated from lower environments.

## 19. Platform as Code

Infrastructure, runtime policy and deployment configuration should be represented declaratively where practical.

Changes must be reviewable, reproducible and traceable to the relevant architecture and engineering requirement.

## 20. Provider Portability

Provider-specific implementations should be isolated behind defined interfaces where portability has meaningful strategic value.

Portability must not introduce unnecessary abstraction complexity.

The platform must be capable of replacing a major external provider without forcing redesign of domain ownership.

## 21. Security Baseline

Platform components must satisfy least privilege, secure configuration, vulnerability management, logging, access control, encryption and dependency governance requirements.

Security controls are complementary to ADR-015 and EIP-026 and must not redefine them.

## 22. Developer Experience

Local development must allow engineers to run the minimum required platform dependencies without requiring production infrastructure access.

Where practical, local substitutes or development instances may be used for:

- databases;
- event infrastructure;
- object storage;
- caches;
- service dependencies.

Behavioural differences between local substitutes and production infrastructure must be documented and tested.

## 23. Platform Readiness Gate

The platform foundation is ready for the first vertical slice when:

- the approved workspace can be built;
- CI can validate the workspace;
- configuration is environment-safe;
- secrets are not stored in source;
- application workloads have defined runtime interfaces;
- database migration capability exists;
- event infrastructure integration is defined;
- health and telemetry interfaces exist;
- service identity/access boundaries are defined;
- failure handling is testable;
- deployment to a non-production environment is reproducible.

## 24. First Vertical Slice Constraint

The platform foundation shall not attempt to implement every enterprise capability before the first vertical slice.

Only capabilities required to support the first complete business flow should be implemented initially.

This prevents platform engineering from becoming a substitute for product development.

## 25. Traceability

Every platform component must be traceable through:

```text
Business / Architecture Requirement
        ↓
EDA / ADR / EIP
        ↓
Platform Capability
        ↓
Implementation
        ↓
Test
        ↓
Evidence
```

## 26. External Basis

The platform design is informed by established cloud-native guidance concerning container orchestration, service identity, service discovery, resilience, observability, service-to-service security and policy enforcement. NIST guidance identifies these as important concerns in secure microservices and cloud-native platforms.

## 27. Constitutional Platform Laws

1. The platform does not own domain business truth.
2. Platform capabilities must have explicit ownership.
3. Shared infrastructure must not create hidden domain coupling.
4. Service identity must be distinct from network location.
5. Production secrets must never be committed to source control.
6. Platform access must follow least privilege.
7. Platform failures must be observable.
8. Platform retries must be bounded.
9. Platform infrastructure must not silently duplicate irreversible business effects.
10. Platform technology choices must remain traceable to requirements.
11. Platform abstractions must be justified by real architectural needs.
12. The platform must support incremental scaling rather than requiring premature hyperscale complexity.
13. The first vertical slice must prove the platform rather than wait for the entire platform to be complete.
