# EIP-030 — Testing & Verification Architecture

**Status:** Proposed / Build Baseline  
**Date:** 2026-08-23  
**Decision Type:** Implementation Architecture  
**Parent Architecture:** EIP-019 — Architecture-to-Implementation Traceability & Build Baseline  
**Depends On:** EIP-019, EIP-020, EIP-021, EIP-022, EIP-023, EIP-024, EIP-025, EIP-026, EIP-027, EIP-028, EIP-029, ADR-001, ADR-002, ADR-003, ADR-004, ADR-005, ADR-006, ADR-007, ADR-008, ADR-009, ADR-010, ADR-011, ADR-012, ADR-013, ADR-014, ADR-015, ADR-016, ADR-017, ADR-018, ADR-019, ADR-020, EDA-001 Part 4

## 1. Purpose

EIP-030 defines the implementation architecture for testing, verification, assurance and evidence across Essentials Mart.

It establishes how the platform proves that:

- architecture has been implemented as intended;
- contracts remain compatible;
- domain boundaries remain intact;
- security controls work in practice;
- AI capabilities remain within authority;
- event processing remains reliable;
- data ownership is preserved;
- clients behave correctly online and offline;
- infrastructure remains resilient;
- and material changes can be traced to objective verification evidence.

EIP-030 complements EIP-019. EIP-019 establishes traceability; EIP-030 establishes the verification system that produces the evidence used by that traceability.

## 2. Constitutional Verification Principle

> **No material architectural claim is considered implementation-complete until it has proportionate, reproducible and reviewable verification evidence.**

Testing is not limited to finding defects after implementation.

Verification must be designed into the engineering lifecycle.

```text
Architecture
    ↓
Requirement / Invariant
    ↓
Implementation
    ↓
Verification
    ↓
Evidence
    ↓
Traceability
    ↓
Release Decision
```

## 3. Verification Is Broader Than Testing

Essentials Mart shall distinguish:

### Testing

Executing software or systems to determine whether observed behaviour matches expected behaviour.

### Verification

Determining whether an implementation satisfies a specified requirement, invariant, contract or architectural constraint.

### Validation

Determining whether the implemented capability satisfies the intended business or user outcome.

### Assurance

Establishing justified confidence that material risks are controlled.

### Evidence

The durable artefact demonstrating what was verified, when, against which version, and with what result.

These concepts are related but must not be treated as interchangeable.

## 4. Verification Pyramid

Testing should be layered.

```text
                 End-to-End
              / Acceptance \
             /              \
          Integration / Contract
         /                    \
      Component / Service Tests
     /                        \
   Unit / Pure Logic Tests
  /____________________________\

        Static Analysis
        Security Analysis
        Architecture Checks
        Build Verification
```

The highest-cost tests should be reserved for behaviours that genuinely require system-level verification.

Fast lower-level verification should provide the majority of routine feedback.

## 5. Testability as an Architectural Requirement

Material components must be designed so that important behaviour can be verified.

A component that cannot be meaningfully tested because it hides all observable state, dependencies or outcomes is an architectural risk.

Testability should therefore influence:

- dependency boundaries;
- interfaces;
- event publication;
- data access;
- AI tool invocation;
- configuration;
- observability;
- and failure handling.

## 6. Verification Ownership

Every material architectural requirement should have an identifiable verification owner.

Ownership may belong to:

- the implementing domain team;
- platform engineering;
- security engineering;
- data engineering;
- AI engineering;
- QA;
- or an authorised independent reviewer.

The owner of a capability remains accountable for demonstrating that its implementation satisfies its governing requirements.

## 7. Traceability

Verification must remain traceable to architecture and implementation.

Conceptually:

```text
ADR / EDA
   ↓
EIP
   ↓
Requirement / Invariant
   ↓
Implementation
   ↓
Test / Verification
   ↓
Evidence
   ↓
Commit / Build / Release
```

EIP-019 provides the enterprise traceability layer.

EIP-030 provides the verification evidence that closes that chain.

## 8. Verification Levels

Essentials Mart shall use proportionate verification levels.

### Level 1 — Local Verification

Examples:

- unit tests;
- static analysis;
- formatting;
- type checking;
- linting;
- deterministic component tests.

### Level 2 — Component Verification

Examples:

- service tests;
- repository tests;
- adapter tests;
- AI tool boundary tests.

### Level 3 — Integration Verification

Examples:

- API integration tests;
- event broker tests;
- database integration tests;
- external adapter tests.

### Level 4 — System Verification

Examples:

- end-to-end workflows;
- cross-domain scenarios;
- resilience tests;
- security scenarios.

### Level 5 — Operational / Production Assurance

Examples:

- deployment verification;
- runtime health verification;
- controlled production checks;
- disaster-recovery exercises;
- operational readiness evidence.

## 9. Unit Testing

Pure business logic should be tested at unit level wherever practical.

Unit tests should verify:

- deterministic rules;
- calculations;
- validation logic;
- transformations;
- policy evaluation;
- state transitions;
- and pure decision functions.

Unit tests should remain fast and isolated.

They should not require live external providers unless the behaviour specifically belongs to an integration boundary.

## 10. Component Testing

Component tests verify a capability with its immediate dependencies represented by controlled implementations or test infrastructure.

They are appropriate for:

- service behaviour;
- repositories;
- adapters;
- notification handlers;
- AI tools;
- event consumers;
- projections;
- and application services.

## 11. Integration Testing

Integration tests verify that independently implemented components work together correctly.

Examples include:

```text
API
 ↓
Application Service
 ↓
Database
```

and:

```text
Producer
 ↓
Event Infrastructure
 ↓
Consumer
```

Integration tests must use realistic contract and infrastructure behaviour rather than excessive mocking of the very integration being verified.

## 12. Contract Verification

EIP-029 establishes contract engineering.

EIP-030 establishes verification of those contracts.

Contract verification should include:

- schema validation;
- compatibility checks;
- required-field validation;
- semantic compatibility;
- error contract behaviour;
- authentication and authorization expectations;
- idempotency behaviour;
- version compatibility;
- and consumer expectations.

A contract that is documented but not verified is not sufficiently governed.

## 13. Consumer-Driven Contract Testing

Where independent consumers depend materially on a provider contract, consumer-driven verification may be used.

The objective is to verify that:

```text
Consumer Expectation
        ↕
Provider Contract
```

remains compatible.

Consumer-driven testing must not allow a single consumer to redefine the enterprise contract without owner governance.

## 14. Event Verification

Event-driven components must be tested for:

- correct publication;
- correct schema;
- correct ownership metadata;
- correlation and causation;
- classification;
- duplicate delivery;
- ordering where required;
- replay;
- retry;
- dead-letter behaviour;
- and failure recovery.

Event verification must distinguish projection rebuilding from irreversible side effects.

## 15. Idempotency Verification

Consequential operations must be tested for duplicate requests and duplicate messages.

Example:

```text
Request A
   ↓
Effect occurs once

Request A again
   ↓
No unintended second effect
```

This applies to areas including:

- orders;
- payments;
- rewards;
- deliveries;
- notifications;
- external provider calls;
- and AI-triggered actions.

## 16. State Transition Testing

Material domain state machines should have explicit verification of valid and invalid transitions.

For example:

```text
Created
   ↓
Paid
   ↓
Dispatched
   ↓
Delivered
```

Tests should verify that invalid transitions are rejected.

```text
Delivered
   ↓
Paid
```

must not silently become valid because of an implementation shortcut.

## 17. Data Verification

EIP-022 establishes authoritative data ownership.

Verification must confirm that:

- authoritative data remains in its owning boundary;
- read models do not become accidental sources of truth;
- migrations preserve required invariants;
- data classification is respected;
- sensitive data is minimised;
- deletion and retention rules operate correctly;
- and cross-domain access is authorised.

Database tests alone are insufficient if ownership boundaries can be violated through application code.

## 18. Database Migration Verification

Every material schema migration should be verified for:

- forward migration;
- rollback or recovery strategy where supported;
- data preservation;
- constraint integrity;
- performance impact;
- compatibility with active application versions;
- and operational recovery.

Destructive migrations require explicit review and evidence.

## 19. API Verification

API verification should include:

- authentication;
- authorization;
- request validation;
- response correctness;
- error semantics;
- pagination;
- concurrency controls;
- idempotency;
- rate limits;
- classification;
- and backward compatibility.

A successful HTTP response must not by itself be treated as proof that the underlying business operation completed successfully.

## 20. AI Verification

AI systems require verification beyond conventional deterministic testing.

AI Society and Intelligence Engine verification should evaluate:

- capability boundaries;
- tool permissions;
- authority enforcement;
- policy compliance;
- structured output validity;
- refusal behaviour;
- escalation behaviour;
- uncertainty handling;
- auditability;
- prompt and model compatibility;
- and consequential side effects.

The system must verify that an AI agent cannot bypass an authority boundary by selecting a different tool, endpoint or data path.

## 21. AI Decision Verification

Material AI decisions should be evaluated against defined expectations rather than only whether the model returned a syntactically valid response.

Verification may include:

- policy tests;
- scenario suites;
- adversarial cases;
- regression datasets;
- outcome evaluation;
- human review;
- and authority-boundary tests.

AI evaluation must distinguish model quality from system safety.

A highly accurate model can still be unsafe if it has excessive authority.

## 22. AI Non-Determinism

Where AI output is non-deterministic, tests should not require identical text output unless exact determinism is an explicit requirement.

Verification should instead evaluate governed properties such as:

- schema validity;
- policy compliance;
- allowed tool use;
- factual constraints where testable;
- confidence or uncertainty requirements;
- and side-effect boundaries.

## 23. Human-in-the-Loop Verification

Where ADR-010 requires human authority, tests must verify that consequential actions cannot bypass the approval boundary.

Example:

```text
AI Recommendation
       ↓
Approval Required
       ↓
No Approval
       ✗ No Action

Approval Granted
       ↓
Authorised Action
       ✓
```

Tests must include attempts to bypass the approval mechanism.

## 24. Security Verification

Security verification must be continuous and layered.

It should include, as appropriate:

- dependency scanning;
- secret detection;
- static application security testing;
- dynamic application security testing;
- authorization testing;
- authentication testing;
- input validation;
- abuse-case testing;
- privilege escalation testing;
- API security testing;
- and infrastructure security verification.

Security verification must align with ADR-015 and EDA-001 Part 4.

## 25. Anti-Replication Verification

The platform's defensive architecture should be verified rather than merely documented.

Verification should test that valuable proprietary behaviour remains server-side where required and that client-side surfaces do not unintentionally expose protected algorithms, secrets or privileged capabilities.

The objective is not to claim that browser or client code is impossible to inspect.

The objective is to verify that inspection does not reveal unnecessary architectural value or authority.

## 26. Privacy Verification

Privacy controls must be tested through actual data flows.

Verification should include:

- access control;
- data minimisation;
- retention enforcement;
- deletion workflows;
- event replay restrictions;
- logging restrictions;
- export controls;
- and cross-tenant isolation.

Privacy verification must include historical data and derived projections where applicable.

## 27. Multi-Tenant Verification

Where multiple organisations, stores or tenants share infrastructure, tests must verify isolation.

Examples:

```text
Tenant A Data
      ↓
Tenant A Request
      ✓

Tenant A Request
      ↓
Tenant B Data
      ✗
```

Tenant identifiers supplied by clients must not be treated as authoritative without server-side verification.

## 28. Walk Mode Verification

Walk Mode requires dedicated verification because it combines client interaction, navigation, product state, AI assistance and potentially real-world movement.

Verification should cover:

- Manual Mode;
- Autopilot Mode;
- AI Assisted Mode;
- route generation;
- rerouting;
- product recognition;
- unavailable products;
- substitutions;
- basket changes;
- user takeover;
- offline or degraded connectivity;
- and auditability.

The three Walk Mode types must remain distinct in behaviour and authority.

## 29. Notification Verification

Notification delivery must be verified across supported channels.

Examples include:

- in-app notifications;
- push notifications;
- WhatsApp where authorised;
- operational notifications;
- AI-generated notifications;
- and delivery updates.

Verification must include:

- user consent;
- channel eligibility;
- duplicate suppression;
- retry behaviour;
- provider failure;
- and notification auditability.

## 30. External Integration Verification

External integrations must be tested behind their governed adapters.

Tests should cover:

- provider acceptance;
- provider rejection;
- timeout;
- unknown outcome;
- retry;
- duplicate request;
- malformed response;
- authentication failure;
- rate limiting;
- and provider outage.

Provider simulators or controlled test environments should be used where practical.

## 31. Resilience Verification

EIP-026 and EDA-001 Part 4 require resilience to failure.

Verification should intentionally exercise failures such as:

- database unavailability;
- broker unavailability;
- network partition;
- dependency timeout;
- service restart;
- deployment interruption;
- regional degradation;
- queue backlog;
- and partial provider failure.

The objective is to verify graceful degradation rather than merely successful operation under ideal conditions.

## 32. Disaster Recovery Verification

Disaster recovery must be exercised rather than assumed from configuration.

Verification should establish, where applicable:

- recovery point objectives;
- recovery time objectives;
- restoration correctness;
- event replay correctness;
- data integrity;
- dependency recovery order;
- and operational ownership.

A backup that cannot be restored is not sufficient recovery evidence.

## 33. Performance Verification

Performance verification should be tied to defined service objectives.

It should evaluate, where applicable:

- latency;
- throughput;
- concurrency;
- queue lag;
- database performance;
- API saturation;
- event processing rate;
- AI inference latency;
- and client responsiveness.

Performance tests must represent realistic workloads rather than only synthetic peak numbers.

## 34. Scalability Verification

ADR-017 requires scalability across:

**1 store → 10,000+ stores**

and:

**100 users → 100 million+ users**

Verification should therefore include representative scaling scenarios and identify where scaling assumptions cease to hold.

Scaling verification must consider:

- horizontal scaling;
- partitioning;
- event throughput;
- database growth;
- cache behaviour;
- AI workload growth;
- and regional distribution.

## 35. Chaos and Fault Injection

Controlled fault injection may be used to verify resilience.

Examples include:

```text
Kill Service
Drop Network
Delay Dependency
Corrupt Test Message
Exhaust Connection Pool
Pause Consumer
```

Fault injection must be controlled, observable and performed within authorised environments.

## 36. Regression Verification

Every material defect should result in a regression test where practical.

The objective is:

```text
Defect
  ↓
Fix
  ↓
Regression Test
  ↓
Permanent Protection
```

Regression suites should be categorised so teams understand which architectural guarantee each suite protects.

## 37. Property and Invariant Testing

Important architectural invariants should be tested as properties rather than only as individual examples.

Examples:

- a reward cannot be granted twice for the same idempotency identity;
- an unauthorised principal cannot access restricted data;
- an event cannot silently lose its correlation identity;
- an order cannot transition from Delivered back to Paid without an explicit compensating process;
- an AI agent cannot execute a capability outside its authority.

Property testing is particularly valuable for complex state and rule systems.

## 38. Static Verification

Not all verification requires executing the application.

Static checks should include, where appropriate:

- type checking;
- linting;
- formatting;
- dependency policy;
- architecture rules;
- forbidden-import checks;
- secret detection;
- schema validation;
- contract compatibility checks;
- and repository policy checks.

Static verification should run early in the engineering lifecycle.

## 39. Architecture Verification

Architecture itself must be testable.

Automated architecture checks may verify:

- forbidden dependency directions;
- domain boundary violations;
- direct database access outside owning domains;
- forbidden client-to-internal-service paths;
- AI bypass paths;
- external-provider leakage into domain code;
- and prohibited circular dependencies.

Architecture tests prevent gradual erosion of architectural intent.

## 40. Build Verification

Every release candidate must be verified against the build baseline.

Verification should establish:

- source revision;
- dependency state;
- configuration state;
- generated artefacts;
- build success;
- test results;
- security checks;
- and deployment artefacts.

A build is not release-ready merely because compilation succeeds.

## 41. CI Verification Gates

The CI pipeline should progressively verify:

```text
Commit
 ↓
Static Checks
 ↓
Unit Tests
 ↓
Component Tests
 ↓
Contract Tests
 ↓
Integration Tests
 ↓
Security Checks
 ↓
Build
 ↓
System Verification
 ↓
Release Decision
```

Expensive verification may be separated into appropriate pipeline stages while mandatory gates remain enforced for protected branches and releases.

## 42. Evidence Model

Verification evidence should identify at least:

```text
Evidence
├── evidenceId
├── requirement / invariant
├── test / verification method
├── source revision
├── build / environment
├── timestamp
├── executor
├── result
├── artefact reference
└── review status
```

Evidence must be sufficient for another authorised engineer to understand what was actually verified.

## 43. Reproducibility

Material verification should be reproducible where practical.

A test result should not depend on an undocumented local machine state.

Reproducibility requires control over relevant:

- source revision;
- dependencies;
- configuration;
- test data;
- environment;
- and execution procedure.

## 44. Test Data Governance

Test data must not become an uncontrolled copy of production personal or commercial information.

Preferred approaches include:

- synthetic data;
- sanitised datasets;
- generated fixtures;
- controlled test accounts;
- and explicitly authorised production-like data where unavoidable.

Sensitive test data must follow the same security principles as operational data.

## 45. Flaky Test Governance

A flaky test is not equivalent to a passing test.

Flaky tests must be:

- identified;
- quarantined only under controlled governance;
- investigated;
- repaired or removed;
- and prevented from silently weakening release assurance.

A quarantined test must remain visible as an assurance gap.

## 46. Verification of Unknown Outcomes

Distributed systems can produce states where the final outcome is temporarily unknown.

Verification must explicitly test these states.

Example:

```text
External Request
      ↓
Timeout
      ↓
UNKNOWN
      ↓
Reconciliation
      ↓
Confirmed / Failed
```

The test must verify that the system does not incorrectly convert UNKNOWN into success or failure without evidence.

## 47. Release Readiness

Release readiness should require proportionate evidence that:

- required tests passed;
- known exceptions are accepted;
- security gates passed;
- contracts remain compatible;
- migrations are verified;
- observability is available;
- rollback or recovery is understood;
- and material architectural requirements have evidence.

Release readiness is a governance decision supported by evidence, not a single green test result.

## 48. Defect Severity and Verification Response

Defects should be classified according to impact.

Material classes may include:

- Critical;
- High;
- Medium;
- Low.

Critical security, financial, data-integrity or authority-boundary defects should block release unless explicitly overridden by authorised governance.

## 49. Verification Exceptions

Exceptions may be necessary when a verification requirement cannot yet be satisfied.

Every exception should record:

- requirement affected;
- reason;
- risk;
- compensating control;
- owner;
- expiry or review date;
- and approval authority.

An exception must not silently convert an unverified requirement into an accepted requirement.

## 50. Auditability of Verification

Material verification decisions must themselves be auditable.

The enterprise should be able to determine:

- who approved a release;
- what evidence was considered;
- which tests were omitted;
- which exceptions existed;
- and which source revision was released.

This aligns verification with EIP-028's observability, auditability and trust architecture.

## 51. Verification and AI Society Governance

The AI Society must be verified as a governed system rather than a collection of model calls.

Verification must include:

```text
Agent Identity
     ↓
Capability Set
     ↓
Permission
     ↓
Tool Contract
     ↓
Authority Check
     ↓
Action
     ↓
Audit / Event
```

Tests must attempt prohibited actions as well as permitted ones.

## 52. Verification and Learning

Learning systems require verification of both data and outcome interpretation.

Tests should verify that:

- training or learning data has authorised provenance;
- feedback is attributed correctly;
- outcomes are not confused with recommendations;
- failed outcomes remain represented;
- and model updates do not silently alter authority boundaries.

Learning quality and system safety must be evaluated separately.

## 53. Verification Catalogue

The enterprise should maintain a Verification Catalogue containing, where applicable:

- verification ID;
- requirement or invariant;
- architecture reference;
- implementation reference;
- test suite;
- evidence location;
- owner;
- status;
- severity;
- environment;
- and lifecycle.

EIP-030 defines the architecture governing this catalogue.

The catalogue records verification inventory; it does not replace the architecture.

## 54. Verification Lifecycle

Verification assets follow:

```text
Proposed
   ↓
Designed
   ↓
Implemented
   ↓
Executed
   ↓
Reviewed
   ↓
Accepted
   ↓
Maintained
   ↓
Retired
```

A test that no longer verifies a meaningful requirement should be retired or replaced.

## 55. Forward-Consistency Rule

When an ADR, EDA, EIP or material implementation boundary changes, the verification system must be re-evaluated.

The review must identify:

1. directly affected verification assets;
2. indirectly affected test suites;
3. obsolete assumptions;
4. new failure modes;
5. required regression coverage;
6. evidence requiring regeneration;
7. and release-gate implications.

This prevents the architecture from evolving while its verification model remains frozen.

## 56. Verification Laws

EIP-030 establishes the following implementation laws:

1. Material architectural claims require proportionate verification evidence.
2. Verification must remain traceable to architecture and implementation.
3. Testing, verification, validation and assurance are distinct concerns.
4. Testability is an architectural requirement.
5. Verification must be layered from unit to system and operational levels.
6. Contracts must be verified, not merely documented.
7. Event consumers must be verified for duplicate, retry, replay and failure behaviour.
8. Consequential operations must be verified for idempotency where required.
9. Domain state transitions must be explicitly verified.
10. Data ownership boundaries must be tested.
11. AI authority boundaries must be tested, including prohibited actions.
12. Human approval boundaries must be tested for bypass attempts.
13. Security controls must be continuously verified.
14. Anti-replication controls must be verified at the appropriate architectural boundary.
15. Privacy controls must be tested across durable and derived data.
16. Walk Mode Manual, Autopilot and AI Assisted modes must be verified as distinct behaviours.
17. External provider uncertainty must be represented and tested explicitly.
18. Resilience claims require controlled failure verification.
19. Disaster recovery claims require restoration evidence.
20. Scalability claims require representative workload verification.
21. Static architecture constraints should be automatically checked where practical.
22. CI gates must protect material release requirements.
23. Verification evidence must identify the source and execution context.
24. Material verification should be reproducible.
25. Test data must remain governed.
26. Flaky tests must not silently weaken assurance.
27. Unknown outcomes must remain unknown until reconciled by evidence.
28. Release readiness is a governance decision supported by evidence.
29. Verification exceptions must be explicit, owned and time-bounded.
30. Verification itself must be auditable.
31. Verification assets must evolve when architecture evolves.
32. EIP-030 governs verification architecture but does not redefine the architecture it verifies.

## 57. Architectural Outcome

EIP-030 establishes a verification fabric around the Essentials Mart implementation.

```text
                  ARCHITECTURE
                       │
                       ▼
                REQUIREMENTS
                       │
                       ▼
              IMPLEMENTATION
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      STATIC         TESTING       SECURITY
   VERIFICATION    VERIFICATION   VERIFICATION
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                   EVIDENCE
                       │
                       ▼
                 TRACEABILITY
                       │
                       ▼
                RELEASE ASSURANCE
                       │
                       ▼
                  OPERATIONS
                       │
                       ▼
                 NEW EVIDENCE
```

The objective is not to create a culture of testing for its own sake.

The objective is to make the platform's architectural promises demonstrable.

## 58. Final Principle

> **Essentials Mart shall not rely on architecture that cannot be verified, software that cannot be observed, or security that cannot be demonstrated.**

Implementation confidence must come from traceable evidence rather than assumption.

---

# Commit 030

```text
docs(eip): add EIP-030 testing and verification architecture

- Establish enterprise testing and verification architecture
- Define distinction between testing, verification, validation, assurance and evidence
- Establish layered verification from unit through operational assurance
- Define testability as an architectural requirement
- Connect verification to EIP-019 traceability
- Establish contract and consumer-driven contract verification
- Define event, idempotency and state-transition verification
- Establish data ownership and migration verification
- Define API and external integration verification
- Establish AI Society authority and decision verification
- Define human-in-the-loop bypass verification
- Establish security, privacy and anti-replication verification
- Define Walk Mode verification across Manual, Autopilot and AI Assisted modes
- Establish resilience, disaster recovery, performance and scalability verification
- Define chaos and fault-injection controls
- Establish regression and invariant testing
- Define static architecture and build verification
- Establish CI verification gates
- Define durable verification evidence and reproducibility
- Establish test-data and flaky-test governance
- Define unknown-outcome verification
- Establish release-readiness and verification-exception governance
- Define verification catalogue and lifecycle
- Establish forward-consistency requirements for verification assets
- Establish constitutional verification laws
```