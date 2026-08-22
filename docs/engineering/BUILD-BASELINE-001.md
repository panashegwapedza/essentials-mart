# BUILD-BASELINE-001 — Engineering Build Baseline

**Status:** Active Build Baseline
**Date:** 2026-08-22
**Project:** Essentials Mart
**Authority:** EIP-019 through EIP-027
**Purpose:** Transition Essentials Mart from architecture definition into controlled engineering execution.

## 1. Purpose

This document establishes the first engineering build baseline for Essentials Mart.

The architecture and implementation architecture have reached a sufficiently coherent state to begin implementation. Engineering work must now proceed from the approved EDA, ADR and EIP layers rather than creating an independent implementation architecture.

The baseline establishes the rules for translating architecture into code, infrastructure, tests and evidence.

## 2. Architectural Authority

The implementation hierarchy is:

```text
Enterprise Intent
      ↓
EDA
      ↓
ADR
      ↓
EIP
      ↓
Implementation Architecture
      ↓
Engineering Build Baseline
      ↓
Code / Infrastructure / Contracts
      ↓
Tests
      ↓
Evidence
```

EIP-019 remains the traceability bridge.

Engineering code must not silently redefine an architectural decision.

If implementation evidence demonstrates that an architectural decision is materially unsuitable, the architecture must be amended through the established forward-consistency process.

## 3. Baseline Scope

The current implementation architecture baseline includes:

- EIP-019 — Architecture-to-Implementation Traceability;
- EIP-020 — Enterprise Domain & Bounded Context Implementation Map;
- EIP-021 — Backend Service & API Implementation Architecture;
- EIP-022 — Enterprise Data Implementation Architecture;
- EIP-023 — Event Infrastructure Implementation Architecture;
- EIP-024 — AI Society Runtime Implementation Architecture;
- EIP-025 — Flutter Client Implementation Architecture;
- EIP-026 — Infrastructure & Deployment Implementation Architecture;
- EIP-027 — Engineering Repository & Workspace Architecture.

EDA, ADR and EIP documents remain authoritative for their respective architectural decisions.

## 4. Build Principle

> **Build vertical capability slices against stable architectural boundaries rather than constructing isolated technical components with no end-to-end value.**

The first implementation should prove that the architecture works across real boundaries.

## 5. Initial Build Strategy

Implementation proceeds in controlled layers:

```text
Repository Foundation
        ↓
Developer Tooling
        ↓
Platform Foundation
        ↓
Identity
        ↓
Catalogue / Product
        ↓
Basket / Commerce
        ↓
Checkout / Payment Boundary
        ↓
Order
        ↓
Inventory
        ↓
Fulfilment
        ↓
Delivery
        ↓
Notification
        ↓
Receipt / History
        ↓
AI / Subscription / Walk Mode Extensions
```

The sequence is not a requirement to deploy every capability as a separate service.

## 6. First Vertical Slice

The first meaningful vertical slice should establish:

```text
Customer
  ↓
Identity
  ↓
Catalogue
  ↓
Basket
  ↓
Checkout
  ↓
Payment Boundary
  ↓
Order
  ↓
Inventory Reservation / Update
  ↓
Fulfilment
  ↓
Delivery Request
  ↓
Notification
  ↓
Receipt / Order History
```

The purpose is architectural validation, not feature completeness.

## 7. Foundation Before Feature Expansion

The following platform capabilities must be established before broad feature development:

- configuration management;
- environment separation;
- identity and authentication foundation;
- authorization foundation;
- API edge;
- database migration mechanism;
- event infrastructure abstraction;
- observability foundation;
- audit foundation;
- error handling;
- testing framework;
- CI validation;
- dependency scanning;
- secret management;
- local development tooling;
- and deployment foundation.

Security is part of the build lifecycle rather than a final stage. This is consistent with NIST SSDF, which recommends integrating secure-development practices into each SDLC implementation and treating them as a basis for continuous improvement. citeturn0search0turn0search1

## 8. Repository Baseline

The implementation workspace shall progressively conform to EIP-027.

Target structure:

```text
apps/
services/
packages/
infrastructure/
database/
events/
docs/
scripts/
tests/
.github/
```

Existing repository content must be migrated deliberately rather than deleted merely to obtain the target structure.

## 9. Domain Implementation Order

Initial domain implementation priority:

1. Identity & Access
2. Product & Catalogue
3. Commerce / Basket
4. Payments boundary
5. Orders
6. Inventory
7. Fulfilment
8. Delivery
9. Notifications
10. Customer / Household
11. Receipts & Purchase History
12. Subscription
13. Rewards
14. Trust & Risk
15. Partner Integrations
16. AI Society
17. Walk Mode
18. Advanced Intelligence Engines

This ordering may change when implementation evidence demonstrates a dependency that requires otherwise.

## 10. Contract-First Rule

Where a capability crosses an architectural boundary, the contract must be defined before the implementation is considered complete.

This applies to:

- APIs;
- events;
- integration adapters;
- AI tools;
- capability interfaces;
- and material data exchanges.

Implementation details must remain subordinate to the governed contract.

## 11. Data Rule

Each authoritative business fact must have an identifiable owning data boundary.

Engineering must not create convenience tables that become accidental sources of truth.

Cross-domain reads and writes must follow EIP-022.

## 12. Event Rule

Events represent facts that have occurred.

Engineering must not use events as hidden commands.

Consumers must be idempotent and must tolerate delivery duplication where applicable.

Event infrastructure must follow EIP-023.

## 13. AI Rule

The AI Society is implemented as a governed capability layer.

AI agents may:

- reason;
- retrieve authorised information;
- make recommendations;
- invoke authorised tools;
- coordinate through governed interfaces.

AI agents may not silently become authoritative owners of:

- prices;
- inventory truth;
- payment truth;
- rewards truth;
- trust decisions;
- orders;
- or other domain state.

AI implementation must follow EIP-024.

## 14. Client Rule

The Flutter client is an interaction layer.

It may perform local validation, presentation logic, local state management and offline coordination, but authoritative business decisions remain backend-controlled.

Client implementation must follow EIP-025.

## 15. Infrastructure Rule

Infrastructure must be reproducible and traceable.

Manual production configuration should not become the normal architecture.

Infrastructure changes require the same traceability discipline as application changes.

## 16. Security Build Gates

Material changes must pass applicable security gates before promotion.

These may include:

- secret scanning;
- dependency vulnerability scanning;
- static analysis;
- authentication tests;
- authorization tests;
- API security tests;
- contract validation;
- architecture tests;
- container/image scanning where applicable;
- infrastructure policy checks;
- and security regression tests.

## 17. Testing Pyramid

Testing proceeds from narrow to broad:

```text
Unit
 ↓
Module
 ↓
Contract
 ↓
Integration
 ↓
System
 ↓
Security / Resilience
 ↓
End-to-End
```

A passing end-to-end test does not replace lower-level architectural tests.

## 18. Architecture Tests

Architecture tests must enforce material rules including:

- forbidden imports;
- dependency direction;
- domain ownership;
- cross-domain database restrictions;
- API contract compatibility;
- event compatibility;
- client authority restrictions;
- AI capability restrictions;
- and security-boundary usage.

## 19. Observability Requirement

Every implemented capability must define appropriate:

- logs;
- metrics;
- traces;
- business events;
- audit records where required;
- health indicators;
- failure signals;
- and operational ownership.

A feature is not operationally complete merely because its code works locally.

## 20. Evidence Requirement

Every material implementation must produce evidence linked to EIP-019.

Evidence may include:

- source revision;
- tests;
- contract results;
- architecture-test results;
- security scans;
- deployment records;
- artifact digests;
- migration records;
- observability evidence;
- and approval records.

## 21. Development Workflow

The normal workflow is:

```text
Select Capability
      ↓
Identify Governing EDA / ADR / EIP
      ↓
Confirm Traceability
      ↓
Define Contract / Data / Security Requirements
      ↓
Implement
      ↓
Test
      ↓
Architecture Validation
      ↓
Security Validation
      ↓
Build Artifact
      ↓
Deploy to Non-Production
      ↓
Integration Validation
      ↓
Evidence Capture
      ↓
Promotion
```

## 22. Change Control

A developer must stop and initiate architectural review when implementation reveals:

- contradictory architectural requirements;
- an ownership conflict;
- an unavoidable new cross-domain dependency;
- a new security boundary;
- a new authoritative data source;
- a new AI authority requirement;
- a new event semantics requirement;
- a material deployment-model change;
- or a requirement that cannot be satisfied by the current architecture.

The solution is not to silently bypass the architecture.

## 23. First Engineering Milestones

### Milestone 1 — Workspace Foundation

- establish target workspace structure;
- establish package/service conventions;
- establish formatting and linting;
- establish test runner;
- establish local configuration;
- establish CI skeleton;
- establish secret handling;
- establish dependency governance.

### Milestone 2 — Platform Foundation

- identity;
- authorization;
- API edge;
- database foundation;
- event abstraction;
- observability;
- error handling;
- audit foundation.

### Milestone 3 — Commerce Vertical Slice

- catalogue;
- basket;
- checkout;
- payment boundary;
- order;
- inventory;
- fulfilment;
- delivery;
- notification;
- receipt/history.

### Milestone 4 — Intelligence Extensions

- AI Society integration;
- recommendation capability;
- household intelligence;
- subscription intelligence;
- trust/risk;
- rewards.

### Milestone 5 — Experience Extensions

- Walk Mode;
- offline/limited-connectivity workflows;
- partner entry points;
- advanced delivery orchestration;
- scheduled/shared/express delivery modes.

## 24. Current Build State

This baseline does not claim that the implementation exists.

It establishes the conditions under which implementation begins.

The architecture is considered **Build-Ready**, while individual capabilities remain **Not Yet Implemented** until their implementation gates are satisfied.

## 25. Definition of Build-Ready

The project is Build-Ready when:

- governing architecture is identified;
- repository boundaries are defined;
- implementation architecture is available;
- required contracts are identifiable;
- security requirements are known;
- testing expectations are known;
- deployment expectations are known;
- traceability exists;
- and no unresolved high-severity architectural contradiction blocks the capability.

## 26. Definition of Implemented

A capability is Implemented only when:

- production-intended code exists;
- required contracts are implemented;
- data ownership is enforced;
- tests pass;
- architecture tests pass;
- security gates pass;
- observability exists;
- deployment is reproducible;
- evidence is captured;
- and the implementation remains consistent with its governing architecture.

## 27. Constitutional Build Laws

1. Architecture precedes implementation.
2. Implementation does not silently redefine architecture.
3. Every material capability has traceability.
4. Every authoritative business fact has an owner.
5. Cross-domain boundaries are explicit.
6. Contracts are governed.
7. Events remain facts, not hidden commands.
8. Clients are not authoritative enterprise systems.
9. AI does not gain authority merely through implementation proximity.
10. Security is built into the development lifecycle.
11. Tests are implementation evidence.
12. Architecture tests enforce material boundaries.
13. Infrastructure is treated as code.
14. Production changes are attributable.
15. Secrets do not enter source control.
16. Evidence is required for material implementation.
17. Vertical capability value is preferred over isolated technical output.
18. Architectural amendments remain explicit.
19. Existing functionality is extended rather than silently replaced.
20. The system is built incrementally without abandoning the enterprise architecture.

## 28. Immediate Next Action

Begin **Milestone 1 — Workspace Foundation** under EIP-027.

The first engineering work should establish the repository/workspace conventions and validation tooling before broad application feature development.

After the workspace foundation is validated, proceed to the platform foundation and first commerce vertical slice.
