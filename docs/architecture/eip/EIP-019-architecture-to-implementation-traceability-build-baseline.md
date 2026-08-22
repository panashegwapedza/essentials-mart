# EIP-019 — Architecture-to-Implementation Traceability & Build Baseline

**Status:** Proposed  
**Date:** 2026-08-22  
**Decision Type:** Implementation Architecture / Traceability  
**Parent Architecture:** EDA-001  
**Depends On:** EDA-001, EDA-001 Part 4, ADR-001 through ADR-020, applicable EIPs  

## 1. Purpose

EIP-019 establishes the bridge between the Essentials Mart architectural baseline and implementation work.

The purpose is to ensure that implementation does not become a parallel architecture disconnected from the EDA, ADR and EIP corpus.

Every material implementation capability must be traceable backwards to the architectural requirement, decision or pattern that authorises it, and forwards to implementation components, tests and assurance evidence.

The implementation baseline therefore follows:

```text
Architecture
    ↓
Requirement
    ↓
ADR / EDA Decision
    ↓
EIP Pattern
    ↓
Implementation Component
    ↓
Code / Configuration
    ↓
Test
    ↓
Evidence
```

NIST defines traceability as a discernible association among logical entities such as requirements, system elements, verifications and tasks. EIP-019 applies that principle to the Essentials Mart architecture-to-build lifecycle. citeturn0search4

## 2. Constitutional Principle

> **No material implementation decision may silently redefine the approved architecture.**

Implementation may refine architecture-approved decisions, but a material architectural deviation must be recorded through the appropriate EDA, ADR or EIP amendment process.

## 3. Architecture Baseline

The current implementation baseline is derived from:

- EDA-001 enterprise architecture;
- EDA-001 Part 4 defensive architecture;
- approved and active ADRs;
- applicable EIPs;
- reconciled architecture amendments;
- security, privacy and trust requirements;
- and approved product capabilities.

The post-Part 4 reconciliation record is part of this baseline.

## 4. Traceability Chain

Each material capability should maintain the following relationships:

```text
Business Need
    ↓
Architecture Requirement
    ↓
Architecture Decision
    ↓
Implementation Pattern
    ↓
System Element
    ↓
Verification Method
    ↓
Evidence
```

The chain may be many-to-one or one-to-many. A single ADR may constrain multiple implementation components, while a single component may satisfy multiple requirements.

## 5. Traceability Identifiers

Material implementation items should carry stable references to their architectural sources.

Examples:

```text
ADR-007
EIP-024
EDA-001-P4-018
REQ-AI-001
TEST-AI-001
```

Identifiers must remain stable even if implementation filenames, classes or deployment units change.

## 6. Requirements Traceability

Requirements must be traceable to:

- originating business need;
- architectural requirement;
- security requirement where applicable;
- privacy requirement where applicable;
- relevant ADR;
- relevant EIP;
- implementation component;
- verification method;
- verification result;
- and residual risk where applicable.

## 7. ADR Traceability

Every material ADR should identify the implementation consequences of its decision.

For example:

```text
ADR-007
AI Society Architecture
        ↓
Agent coordination requirement
        ↓
Agent Runtime
        ↓
Capability Registry
        ↓
Permission Engine
        ↓
Tests / Assurance
```

An ADR remains the authority for the architectural decision unless formally superseded.

## 8. EIP Traceability

EIPs translate architecture into reusable implementation patterns.

An EIP should identify:

- architectural source;
- applicable ADRs;
- implementation boundary;
- required interfaces;
- security implications;
- data implications;
- event implications;
- operational implications;
- verification requirements;
- and known limitations.

## 9. Domain-to-Implementation Mapping

Each bounded context must map to implementation ownership.

Conceptually:

```text
Domain
  ↓
Bounded Context
  ↓
Application Capability
  ↓
Service / Module
  ↓
Data Ownership
  ↓
API / Event Boundary
```

Implementation must not create shared ownership of authoritative domain data merely for convenience.

## 10. API Traceability

Every material API must be traceable to:

- owning domain;
- capability;
- ADR or EIP requirement;
- identity and authorisation rules;
- validation requirements;
- rate-limiting requirements;
- abuse controls;
- observability requirements;
- and verification tests.

ADR-004 remains the architectural authority for the API and service architecture. Part 4 defensive requirements constrain its security implementation without replacing it.

## 11. Event Traceability

Every governed event implementation must be traceable to:

- event owner;
- event definition;
- event schema;
- producing capability;
- consumers;
- security classification;
- retention policy;
- replay policy;
- and verification evidence.

Commit-013 and the Event Catalogue remain the governing sources for enterprise event architecture and inventory respectively.

## 12. Data Traceability

Every authoritative data store must identify:

- owning domain;
- authoritative entities;
- consumers;
- access boundaries;
- retention requirements;
- privacy classification;
- audit requirements;
- backup/recovery requirements;
- and migration ownership.

Implementation databases must not silently become competing sources of truth.

## 13. AI Society Traceability

Every AI agent or intelligence capability must be traceable to:

- capability definition;
- authorised purpose;
- data permissions;
- tool permissions;
- authority level;
- human-approval requirements;
- model/provider dependencies;
- event subscriptions;
- action outputs;
- audit records;
- and verification evidence.

Consuming an event must not be interpreted as authority to act.

## 14. Security Traceability

Security requirements must remain traceable from architecture through implementation and verification.

This includes:

- identity;
- authentication;
- authorisation;
- secrets;
- encryption;
- API protection;
- bot detection;
- rate limiting;
- malware and malicious-input handling;
- monitoring;
- automated containment;
- incident response;
- resilience;
- anti-replication controls;
- and assurance.

The Part 4 defensive baseline is therefore an implementation constraint rather than a separate implementation stack.

## 15. Client Traceability

Client capabilities must map to:

- product requirement;
- ADR-013 Flutter architecture where applicable;
- API capability;
- domain ownership;
- state ownership;
- offline behaviour;
- security requirements;
- and client verification.

Client code must not become the authoritative location for proprietary business rules where those rules are intended to remain protected server-side.

## 16. External Integration Traceability

Each external integration must identify:

- partner or provider;
- integration purpose;
- capability boundary;
- authentication mechanism;
- data exchanged;
- authority granted;
- failure behaviour;
- fallback provider where applicable;
- observability;
- contractual dependency;
- and verification requirements.

Partner integration must remain provider-neutral where the architecture intentionally supports substitution.

## 17. Delivery and Subscription Traceability

The Essentials Subscription & Delivery Route Optimisation capability must remain traceable through:

```text
EDA-003
    ↓
ADR-020
    ↓
EIP-018
    ↓
Subscription Service
    ↓
Fulfilment
    ↓
Resource Scheduler
    ↓
Route Optimiser
    ↓
Dispatch / Transport Adapters
    ↓
Delivery
```

The subscription extension must not replace ordinary checkout, repeat purchase, AI Shopping Mode or other existing fulfilment capabilities.

## 18. Verification Traceability

Every material architectural requirement must have an identified verification method.

Verification may include:

- unit testing;
- integration testing;
- contract testing;
- end-to-end testing;
- security testing;
- adversarial testing;
- resilience testing;
- performance testing;
- privacy testing;
- operational exercises;
- or human review.

NIST's systems-security engineering guidance treats verification as a means of producing objective evidence that a system or artifact fulfils specified requirements and establishing traceability of verified system elements. citeturn0search12

## 19. Evidence

Material implementation claims must be supported by evidence appropriate to their risk.

Evidence may include:

- test results;
- deployment records;
- configuration evidence;
- audit records;
- security assessment results;
- performance measurements;
- incident exercises;
- architecture reviews;
- or production observations.

Evidence must identify the implementation version or environment to which it applies.

## 20. Architectural Deviations

Implementation teams may identify cases where the approved architecture cannot be implemented as written.

A deviation must not be silently encoded in implementation.

The process is:

```text
Implementation Constraint
        ↓
Deviation Identified
        ↓
Impact Analysis
        ↓
Architecture Review
        ↓
Accept / Amend / Reject
        ↓
Record Decision
        ↓
Update Traceability
```

## 21. Architecture Drift

Architecture drift occurs when implementation gradually diverges from approved architecture without an explicit decision.

Indicators include:

- duplicated authoritative data;
- undocumented service dependencies;
- bypassed API boundaries;
- uncontrolled event consumers;
- undocumented AI permissions;
- security controls implemented inconsistently;
- direct database access across domains;
- undocumented external dependencies;
- and client-side replication of protected business logic.

Architecture drift must be detected through reviews, automated checks and implementation assurance.

## 22. Build Baseline

The implementation baseline must define, at minimum:

- repository structure;
- source-of-truth documents;
- architectural references;
- domain boundaries;
- service boundaries;
- data ownership;
- API boundaries;
- event boundaries;
- identity boundaries;
- AI authority boundaries;
- security controls;
- observability requirements;
- deployment environments;
- and verification requirements.

## 23. Baseline Change Control

A baseline change must identify:

- affected architectural documents;
- implementation components;
- tests;
- operational impact;
- security impact;
- data impact;
- and rollback or recovery implications where applicable.

The forward-consistency process remains mandatory.

## 24. Implementation Readiness Gate

A material capability should not enter implementation readiness until:

1. its architectural owner is known;
2. applicable ADRs are identified;
3. applicable EIPs are identified;
4. domain ownership is clear;
5. data ownership is clear;
6. API/event boundaries are defined where applicable;
7. security requirements are identified;
8. verification methods are defined;
9. external dependencies are identified;
10. and unresolved architectural conflicts are recorded.

## 25. Implementation Completion Gate

A material capability is not architecturally complete merely because code exists.

Completion requires:

```text
Implementation
    +
Tests
    +
Security Verification
    +
Operational Evidence
    +
Traceability
    +
Approved Deviations
    =
Architecturally Assured Capability
```

## 26. Traceability Matrix

The project should maintain a machine-readable or structured traceability matrix containing, at minimum:

| Source | Requirement / Decision | EIP | Implementation | Verification | Evidence | Status |
|---|---|---|---|---|---|---|
| EDA | Architecture requirement | EIP | Component | Test | Evidence | Status |
| ADR | Decision | EIP | Component | Test | Evidence | Status |
| Part 4 | Defensive requirement | EIP / Control | Control / Component | Security test | Evidence | Status |

The matrix is a control mechanism, not a substitute for the source architecture documents.

## 27. Relationship With Existing Architecture

EIP-019 does not replace:

- EDA documents;
- ADRs;
- EIPs;
- Event Catalogue;
- domain models;
- security architecture;
- or implementation repositories.

It establishes the traceability relationship between them.

## 28. Relationship With Part 4

Part 4 establishes the defensive baseline.

EIP-019 ensures that implementation can demonstrate where each material defensive requirement is realised and how it is verified.

Therefore:

```text
Part 4
  ↓
Defensive Requirement
  ↓
Implementation Control
  ↓
Security Verification
  ↓
Assurance Evidence
```

## 29. Constitutional Implementation Laws

1. Architecture precedes implementation for material capabilities.
2. Material implementation decisions must be traceable.
3. Implementation must not silently redefine architecture.
4. ADRs remain authoritative for architectural decisions unless superseded.
5. EIPs translate approved architecture into reusable implementation patterns.
6. Domain ownership must remain explicit.
7. Authoritative data ownership must remain explicit.
8. API boundaries must remain governed.
9. Event contracts must remain governed.
10. AI authority must remain explicit.
11. Security requirements must remain traceable.
12. Verification must produce objective evidence appropriate to risk.
13. Architectural deviations must be recorded.
14. Architecture drift must be detectable.
15. Implementation completion requires assurance, not merely code completion.
16. The traceability matrix must not become a substitute for architecture.
17. Future implementation changes must perform forward-consistency checks where material.

## 30. Architectural Outcome

EIP-019 establishes a controlled digital thread from the Essentials Mart architectural intent to the realised system.

```text
Business Intent
      ↓
EDA
      ↓
ADR
      ↓
EIP
      ↓
Implementation Architecture
      ↓
Code / Infrastructure
      ↓
Tests
      ↓
Evidence
      ↓
Assurance
      ↺
Architecture Improvement
```

The objective is not bureaucracy. The objective is to ensure that Essentials Mart can evolve rapidly without losing architectural integrity, security, ownership, traceability or trustworthiness.

## Commit Message

```text
docs(eip): establish architecture to implementation traceability baseline
```

## Extended Commit Message

```text
Establish the architecture-to-implementation traceability baseline for Essentials Mart.

- Connect EDA, ADR and EIP decisions to implementation components
- Establish requirements and security traceability
- Define domain, API, event and data implementation mappings
- Define AI Society capability and authority traceability
- Establish delivery and subscription implementation traceability
- Define verification and evidence requirements
- Establish architectural deviation controls
- Define architecture drift detection requirements
- Establish implementation readiness and completion gates
- Define the implementation traceability matrix
- Preserve the authority of EDA, ADR and EIP source documents
- Integrate EDA-001 Part 4 defensive requirements into implementation assurance
- Establish the architecture-to-code-to-test-to-evidence digital thread
```