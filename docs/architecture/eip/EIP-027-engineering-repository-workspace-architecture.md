# EIP-027 — Engineering Repository & Workspace Architecture

**Status:** Proposed / Build Baseline
**Date:** 2026-08-22
**Decision Type:** Engineering Architecture
**Depends On:** EIP-019, EIP-020, EIP-021, EIP-022, EIP-023, EIP-024, EIP-025, EIP-026

## 1. Purpose

EIP-027 defines the repository and workspace structure through which Essentials Mart will be implemented while preserving the enterprise architecture established by the EDA, ADR and EIP layers.

The repository is treated as an engineering boundary, not merely a storage location for source code.

The structure must make architectural boundaries visible, enforceable and testable.

## 2. Constitutional Principle

> **The repository structure must reinforce the architecture rather than provide a mechanism for bypassing it.**

Code organisation must reflect ownership, dependency direction, deployment boundaries and security boundaries.

A developer must not need to infer architectural ownership from arbitrary folder placement.

## 3. Architecture-to-Repository Relationship

```text
EDA
 ↓
ADR
 ↓
EIP
 ↓
Implementation Architecture
 ↓
Repository Structure
 ↓
Packages / Modules / Services
 ↓
Code
 ↓
Tests
 ↓
Build Artifacts
```

EIP-019 remains the authoritative traceability bridge.

## 4. Repository Strategy

Essentials Mart should initially use a **modular monorepo** unless implementation evidence demonstrates that repository separation provides a material benefit.

The initial strategy favours:

- shared tooling;
- atomic cross-domain changes where legitimately required;
- central contract visibility;
- consistent dependency governance;
- unified CI policy;
- unified security scanning;
- simpler local development;
- and explicit architectural boundaries inside one repository.

Polyrepo separation may be introduced where required by:

- independent ownership;
- regulatory isolation;
- security isolation;
- deployment independence;
- external distribution;
- organisational boundaries;
- or materially different lifecycle requirements.

Repository separation must not be used merely to conceal poor module boundaries.

## 5. Canonical Workspace

The implementation workspace should follow a structure conceptually similar to:

```text
/
├── apps/
│   ├── customer-mobile/
│   ├── operations-mobile/
│   ├── admin-web/
│   └── partner-web/
│
├── services/
│   ├── identity/
│   ├── commerce/
│   ├── catalogue/
│   ├── inventory/
│   ├── pricing/
│   ├── payments/
│   ├── fulfilment/
│   ├── delivery/
│   ├── subscriptions/
│   ├── rewards/
│   ├── trust-risk/
│   ├── notifications/
│   ├── partner-integrations/
│   ├── ai-runtime/
│   └── platform-operations/
│
├── packages/
│   ├── api-contracts/
│   ├── event-contracts/
│   ├── domain-kernel/
│   ├── auth-client/
│   ├── observability/
│   ├── security/
│   └── test-support/
│
├── infrastructure/
│   ├── environments/
│   ├── modules/
│   ├── policies/
│   └── deployment/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── policies/
│
├── events/
│   ├── schemas/
│   └── compatibility/
│
├── docs/
│   ├── architecture/
│   ├── engineering/
│   └── operations/
│
├── scripts/
├── tests/
└── .github/
```

The exact technology-specific directory layout may evolve, but the architectural responsibilities must remain explicit.

## 6. Apps

`apps/` contains deployable user-facing or operational clients.

Examples include:

- customer Flutter application;
- store/operations client;
- administrative interfaces;
- partner-facing applications.

Applications must not contain authoritative enterprise business logic that belongs on governed backend capabilities.

Client applications may contain:

- presentation logic;
- local state;
- interaction orchestration;
- offline queues;
- local validation;
- rendering;
- client-side accessibility behaviour;
- and non-authoritative convenience logic.

## 7. Services

`services/` contains independently addressable backend capabilities where the implementation architecture determines that service deployment is justified.

A directory under `services/` does not automatically mean that every service must be independently deployed from day one.

A capability may begin as a modular backend component and later become a service according to EIP-021 extraction criteria.

## 8. Packages

Shared packages are permitted only where sharing creates genuine value without creating hidden coupling.

Appropriate shared packages include:

- API contracts;
- event schemas;
- observability primitives;
- security primitives;
- authentication clients;
- test utilities;
- narrowly defined technical libraries.

Domain business rules must not be placed into a generic shared package merely to make code reusable.

Shared packages must have explicit owners and dependency policies.

## 9. Dependency Direction

Dependencies should flow toward stable contracts and owned capabilities.

Conceptually:

```text
UI
 ↓
Application Capability
 ↓
Domain Module
 ↓
Owned Data / Capability
```

Cross-domain direct database access is prohibited unless explicitly authorised by the architecture.

Cross-domain business-rule imports are prohibited where they create ownership ambiguity.

Events and governed APIs should be preferred for cross-boundary interaction.

## 10. Domain Boundary Enforcement

Repository structure must make the following violations detectable:

- one domain importing another domain's private implementation;
- direct database access across ownership boundaries;
- bypassing an API through shared persistence;
- AI runtime directly modifying authoritative domain state;
- clients calling internal services without an authorised edge boundary;
- partner integrations accessing internal domain modules;
- security controls being bypassed through shared utilities.

Architecture tests should enforce material boundary rules automatically where feasible.

## 11. API Contracts

API contracts must have an explicit repository location and ownership model.

Contracts should be versioned and reviewed independently from implementation details.

Generated clients or server stubs should be derived from governed contracts where appropriate.

A generated artifact must never become the authoritative source of the contract.

## 12. Event Contracts

Event schemas belong in a governed contract location and must remain aligned with EIP-023.

Event producers and consumers must not privately redefine enterprise event schemas.

Compatibility tests should run in CI for material event contracts.

## 13. Database Changes

Database migrations must be version controlled.

Production schema changes must be:

- reviewable;
- traceable;
- repeatable;
- tested;
- reversible where practical;
- and associated with the owning data boundary.

Manual production database modification is not the normal deployment mechanism.

## 14. Infrastructure as Code

Infrastructure must be represented as version-controlled code wherever practical.

Infrastructure changes must pass the same traceability and review expectations as application changes.

Secrets must never be committed to the repository.

Environment-specific values must be supplied through governed configuration or secret-management mechanisms.

## 15. Configuration

Configuration must be separated from source code where appropriate.

Configuration categories should distinguish:

- public configuration;
- environment configuration;
- operational configuration;
- feature configuration;
- security configuration;
- secret material.

Secrets must not be embedded in source code, application bundles or committed configuration.

## 16. Dependency Governance

Third-party dependencies must be:

- explicitly declared;
- version controlled;
- vulnerability monitored;
- provenance-aware where practical;
- reviewed according to risk;
- and removable or replaceable where architectural portability requires it.

Dependency updates must not silently introduce incompatible architecture changes.

This aligns with NIST's software supply-chain guidance, which treats repositories, source artifacts, builds, packages, provenance and scanning as connected parts of the software supply chain. citeturn0search0turn0search12

## 17. Build Reproducibility

Builds should be deterministic or sufficiently reproducible to permit investigation and assurance.

The build system should record:

- source revision;
- dependency versions;
- build environment;
- build configuration;
- generated artifacts;
- test results;
- security scan results;
- and provenance information where supported.

## 18. Generated Code

Generated code must be clearly distinguishable from hand-maintained code.

Generated artifacts should be reproducible from their authoritative source.

Developers must not manually modify generated code unless the generation process explicitly permits it.

## 19. Testing Structure

Tests should be located according to the boundary they verify.

Conceptually:

```text
Unit Tests
 ↓
Module Tests
 ↓
Contract Tests
 ↓
Integration Tests
 ↓
System Tests
 ↓
Security Tests
 ↓
Resilience Tests
 ↓
End-to-End Tests
```

Critical architecture constraints must be testable independently of UI tests.

## 20. Architecture Tests

The engineering workspace should include automated architecture tests for material constraints such as:

- dependency direction;
- domain ownership;
- forbidden imports;
- service boundaries;
- API contract compatibility;
- event compatibility;
- data-access restrictions;
- security package usage;
- and prohibited client-side authority.

Architecture tests are implementation evidence for EIP-019.

## 21. CI Boundaries

CI should validate changes before they can progress toward deployment.

A conceptual pipeline is:

```text
Commit
 ↓
Formatting / Static Checks
 ↓
Unit Tests
 ↓
Architecture Tests
 ↓
Contract Tests
 ↓
Security / Dependency Scans
 ↓
Build
 ↓
Integration Tests
 ↓
Artifact Creation
 ↓
Attestation / Provenance
 ↓
Environment Promotion
```

NIST recommends integrating software supply-chain security controls into CI/CD pipelines rather than treating the pipeline as a neutral transport mechanism. citeturn0search0turn0search4

## 22. Branch and Review Governance

Changes affecting architecture, security, data ownership, AI authority, public APIs, event contracts or infrastructure must receive appropriate review before merge.

The repository should support protected branches and mandatory status checks for protected environments.

Emergency changes must be attributable and subsequently reviewed.

## 23. Commit Traceability

Material implementation changes should reference their architectural basis.

Where appropriate:

```text
Commit
 ↓
EIP / ADR reference
 ↓
Requirement
 ↓
Implementation
 ↓
Tests / Evidence
```

This prevents code from becoming disconnected from the architecture repository.

## 24. AI Society Repository Boundary

AI Society implementation must remain separated from ordinary domain authority.

The AI runtime may depend on:

- capability contracts;
- event contracts;
- tool interfaces;
- retrieval interfaces;
- policy interfaces;
- observability interfaces.

It must not obtain unrestricted access to domain databases merely because it is located in the same repository.

## 25. Client Repository Boundary

The Flutter client must consume governed APIs and events through approved interfaces.

It must not contain:

- authoritative pricing algorithms;
- authoritative reward calculations;
- authoritative trust decisions;
- authoritative inventory mutation rules;
- payment secrets;
- privileged AI credentials;
- or other proprietary backend decision logic.

This reinforces ADR-015, EIP-024 and EIP-025.

## 26. Infrastructure Boundary

Infrastructure code must be separated from application business logic.

Infrastructure modules should expose stable deployment capabilities while avoiding application-specific secrets and uncontrolled coupling.

## 27. Local Development

The workspace should provide a reproducible local development path.

Local development should support, as practical:

- service startup;
- database provisioning;
- event infrastructure simulation;
- test data;
- contract validation;
- AI provider mocks;
- external integration mocks;
- and observability tooling.

Production credentials and sensitive production data must never be required for ordinary local development.

## 28. Environment Separation

At minimum, the engineering lifecycle should distinguish:

```text
Local
 ↓
Development
 ↓
Test / Integration
 ↓
Staging
 ↓
Production
```

Environment promotion must be controlled and traceable.

Production configuration must not be copied casually into lower environments.

## 29. Release Artifacts

Every production release should be associated with identifiable artifacts and provenance.

Where appropriate, release evidence should include:

- source revision;
- artifact digest;
- dependency inventory;
- SBOM;
- test results;
- security results;
- approval evidence;
- deployment record.

NIST's SSDF includes protection of software from tampering, provenance collection, secure development environments and tracking security requirements, risks and design decisions. citeturn0search1turn0search3

## 30. Repository Security

Repository security must include:

- strong developer authentication;
- least-privilege access;
- protected branches;
- secret scanning;
- dependency scanning;
- code review;
- audit logging;
- signed or otherwise attributable releases where appropriate;
- controlled CI credentials;
- and administrative separation.

## 31. Software Supply Chain

The engineering repository is part of the enterprise software supply chain.

Therefore the system must account for:

- first-party source;
- open-source dependencies;
- commercial dependencies;
- build tools;
- CI runners;
- container images;
- generated artifacts;
- model dependencies;
- infrastructure modules;
- and deployment tooling.

A compromised development dependency must not automatically become a trusted production dependency.

## 32. Provider Portability

The repository must avoid unnecessary dependence on one provider where EIP-026 requires portability.

Provider-specific implementations should be isolated behind adapters or infrastructure modules where practical.

This applies to:

- cloud services;
- AI model providers;
- payment providers;
- mapping providers;
- messaging providers;
- delivery partners;
- identity providers;
- and other external services.

## 33. Partner Integrations

Partner-specific code must reside behind explicit integration boundaries.

A partner integration must not require core domains to understand partner-specific implementation details.

Conceptually:

```text
Core Capability
      ↓
Integration Contract
      ↓
Partner Adapter
      ↓
External Partner
```

This supports the partner-substitution principle established in the wider architecture.

## 34. Documentation

Engineering documentation must remain close enough to implementation to remain useful while architectural decisions remain in the architecture repository.

Code comments must explain implementation intent rather than reproduce architecture documents verbatim.

## 35. Ownership

Every major repository area must have an accountable owner.

Ownership must cover:

- source;
- dependencies;
- security;
- releases;
- operational support;
- documentation;
- and architectural compliance.

## 36. Repository Change Rules

Changes to the repository structure itself require architectural review when they affect:

- ownership;
- deployment boundaries;
- security boundaries;
- data boundaries;
- public contracts;
- AI authority;
- or dependency direction.

A folder rename must not be treated as harmless if it changes architectural meaning.

## 37. Migration Strategy

The repository does not need to be created perfectly on day one.

Migration should be incremental:

```text
Existing Structure
 ↓
Boundary Identification
 ↓
Module Introduction
 ↓
Architecture Tests
 ↓
Dependency Cleanup
 ↓
Extraction Where Justified
```

This preserves delivery velocity without abandoning architectural discipline.

## 38. Implementation Readiness Gate

A repository area is implementation-ready when:

- ownership is defined;
- architectural dependency is identified;
- API/event contracts are known where applicable;
- data ownership is known;
- security requirements are identified;
- tests are defined;
- observability is defined;
- deployment ownership is known;
- dependencies are governed;
- and EIP-019 traceability exists.

## 39. Completion Gate

A repository capability is considered architecturally implemented only when:

- code exists;
- tests exist;
- contracts pass;
- architecture tests pass;
- security checks pass;
- observability exists;
- deployment is reproducible;
- required evidence exists;
- and the implementation remains consistent with the governing EDA/ADR/EIP decisions.

## 40. Constitutional Engineering Laws

1. Repository structure must reflect architecture.
2. Repository structure must not bypass domain ownership.
3. A bounded context does not automatically require a microservice.
4. Shared packages require explicit justification.
5. Shared databases must not become hidden domain coupling.
6. Cross-domain access must use governed interfaces.
7. Client applications are not authoritative sources of enterprise truth.
8. AI runtime access must remain capability- and policy-governed.
9. Contracts must have explicit ownership.
10. Event contracts must remain governed.
11. Database changes must be version controlled.
12. Infrastructure must be version controlled where practical.
13. Secrets must not be committed.
14. Production credentials must not be required for ordinary local development.
15. Builds must be attributable.
16. Material artifacts should have provenance.
17. Dependencies must be governed.
18. Architecture constraints must be testable.
19. CI must enforce material engineering and security gates.
20. Production releases must be traceable to source and evidence.
21. Partner-specific logic must remain behind integration boundaries.
22. Provider-specific dependencies should be isolated where portability is required.
23. Emergency changes must remain attributable.
24. Repository structure must evolve through controlled change.
25. Implementation must remain traceable to architecture.
26. Code must not silently redefine an architectural decision.

## 41. Relationship to EIP-019

EIP-027 operationalises the repository portion of EIP-019.

```text
EIP-019
Traceability
   ↓
EIP-027
Repository / Workspace
   ↓
Implementation
   ↓
Tests
   ↓
Evidence
```

## 42. Relationship to EIP-026

EIP-026 defines infrastructure and deployment architecture.

EIP-027 defines how the source, contracts, infrastructure code and engineering artifacts are organised so that EIP-026 can be implemented and governed.

## 43. Relationship to Part 4

The repository must inherit the defensive requirements of EDA-001 Part 4.

Security architecture is therefore not an optional engineering overlay.

Security checks, provenance, dependency governance, protected development environments, access controls and assurance evidence must be incorporated into the engineering workflow.

NIST's SSDF describes secure development as an integrated lifecycle practice rather than a checklist applied after development. citeturn0search1turn0search3

## 44. Architectural Outcome

EIP-027 establishes the engineering workspace as a controlled implementation boundary connecting architecture to code.

The resulting relationship is:

```text
Enterprise Architecture
        ↓
Implementation Architecture
        ↓
Engineering Repository
        ↓
Modules / Services / Apps
        ↓
Contracts / Data / Events
        ↓
Code
        ↓
Tests
        ↓
Build Artifacts
        ↓
Deployment
        ↓
Evidence & Assurance
```

The repository therefore becomes part of the architecture's enforcement mechanism rather than merely a place where code happens to be stored.
