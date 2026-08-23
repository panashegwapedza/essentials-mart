# EIP-031 — Release & Change Management Architecture

**Status:** Proposed / Build Baseline  
**Date:** 2026-08-23  
**Pattern Type:** Governance / Reliability / Deployment  
**Parent Architecture:** EIP-019 — Architecture-to-Implementation Traceability & Build Baseline  
**Depends On:** EIP-019, EIP-026, EIP-027, EIP-028, EIP-029, EIP-030, ADR-001, ADR-015, ADR-016, ADR-017, ADR-018, EDA-001 Part 4

---

## 1. Context

Essentials Mart is intended to evolve from an early implementation into a multi-domain, multi-store and eventually global platform.

The platform therefore cannot treat release activity as an informal sequence of code pushes.

Changes may affect:

- commerce;
- payments;
- inventory;
- fulfilment;
- delivery;
- AI Society capabilities;
- Walk Mode;
- customer data;
- event contracts;
- APIs;
- security controls;
- infrastructure;
- external partners;
- and operational continuity.

EIP-030 establishes how changes are verified. EIP-031 establishes how verified changes become controlled releases and how changes are introduced, observed, rolled back, retired or superseded.

---

## 2. Constitutional Release Principle

> **A release is a governed change to an identifiable platform state, not merely a successful deployment.**

A change is release-ready only when its implementation, verification, security, traceability and operational consequences are sufficiently understood for its risk level.

The release lifecycle is:

```text
Change
  ↓
Classification
  ↓
Impact Analysis
  ↓
Implementation
  ↓
Verification
  ↓
Release Decision
  ↓
Deployment
  ↓
Observation
  ↓
Acceptance / Rollback / Remediation
```

---

## 3. Change Classification

Every material change should be classified before release.

### Standard Change

A low-risk, repeatable change with an established verification and deployment procedure.

### Material Change

A change that may affect architecture, contracts, data, security, availability, financial behaviour or customer outcomes.

### High-Risk Change

A change with meaningful potential for irreversible, financial, security, regulatory, operational or safety impact.

### Emergency Change

A change required urgently to mitigate an active incident, security exposure, severe defect or material operational risk.

Emergency classification must not become a mechanism for bypassing accountability. Emergency changes receive retrospective review and evidence.

---

## 4. Change Ownership

Every material change must have an accountable owner.

The owner is responsible for:

- defining the change;
- identifying affected architecture;
- identifying dependencies;
- ensuring appropriate verification;
- identifying rollback or recovery behaviour;
- coordinating release readiness;
- and ensuring evidence is retained.

Release ownership does not transfer domain ownership.

---

## 5. Forward-Consistency Requirement

Before a material architecture change is released, its direct and secondary impacts must be assessed.

The review should identify:

- affected ADRs;
- affected EDAs;
- affected EIPs;
- affected contracts;
- affected domains;
- affected data boundaries;
- affected security controls;
- affected AI capabilities;
- affected client behaviour;
- and affected operational procedures.

The release must not knowingly introduce contradictions into the architecture corpus.

---

## 6. Traceability

Release evidence must remain connected to EIP-019.

Conceptually:

```text
Architecture
    ↓
EIP
    ↓
Requirement / Change
    ↓
Implementation Commit
    ↓
Verification Evidence
    ↓
Build Artifact
    ↓
Release
    ↓
Deployment
    ↓
Runtime Evidence
```

A release should be reconstructable from its source, configuration, verification evidence and deployment record.

---

## 7. Release Candidate

Material releases should produce an identifiable release candidate or equivalent immutable build state.

A release candidate should identify, where applicable:

- source revision;
- dependency state;
- configuration version;
- schema version;
- contract versions;
- generated artifacts;
- verification results;
- security results;
- and release classification.

The exact artifact technology remains an implementation concern unless separately established by architecture.

---

## 8. Immutable Release Identity

A released build must be uniquely identifiable.

The identity should allow the enterprise to answer:

- what was released;
- from which source;
- with which dependencies;
- under which configuration;
- when it was released;
- who or what authorized it;
- where it was deployed;
- and what verification evidence supported it.

Release identity must not be reused for materially different artifacts.

---

## 9. Verification Gate

EIP-030 defines the verification system. EIP-031 consumes its results as release evidence.

A material release should not proceed when required verification has failed or when required evidence is missing.

Conceptually:

```text
Build
 ↓
Tests
 ↓
Security Checks
 ↓
Contract Checks
 ↓
Architecture Checks
 ↓
Operational Checks
 ↓
Release Gate
```

A passing build is not sufficient evidence for every material release.

---

## 10. Release Gates

Release gates should be proportionate to risk.

Possible gates include:

- compilation/build success;
- unit and component verification;
- integration verification;
- contract compatibility;
- security verification;
- data migration verification;
- AI authority verification;
- resilience verification;
- performance verification;
- manual approval;
- operational readiness;
- and rollback readiness.

Low-risk changes should not be burdened with unnecessary ceremony, while high-risk changes must not be allowed to bypass appropriate controls.

---

## 11. Database and Data Changes

Data changes require explicit release coordination where they affect compatibility, retention, ownership or recovery.

Preferred migration flow:

```text
Schema Change
    ↓
Compatibility Review
    ↓
Migration Verification
    ↓
Deploy Compatible Application
    ↓
Migrate
    ↓
Verify
    ↓
Remove Legacy Path Later
```

Destructive migrations require heightened review and recovery evidence.

---

## 12. API and Contract Changes

EIP-029 governs contract engineering.

A release that changes an API, event, data, integration, AI-tool or client contract must verify compatibility before deployment.

Breaking changes require explicit version management and consumer migration planning.

The producer must not assume that all consumers can be upgraded simultaneously.

---

## 13. Event Changes

Event changes must respect EDA-013 and EIP-023.

Release planning must consider:

- schema evolution;
- consumer compatibility;
- ordering;
- replay;
- retention;
- duplicate handling;
- and historical events.

A new producer version must not silently make existing durable events uninterpretable.

---

## 14. AI Release Governance

AI-related releases require additional verification where model, prompt, policy, tool, routing or authority behaviour changes.

The release process must distinguish:

- model change;
- prompt change;
- policy change;
- tool change;
- capability change;
- data change;
- and orchestration change.

A model update must not silently expand an agent's authority.

Consequential AI capability changes require appropriate authority and human-in-the-loop verification.

---

## 15. Walk Mode Release Governance

Walk Mode changes must preserve the distinction between:

- Manual Mode;
- Autopilot Mode;
- AI Assisted Mode.

Release verification should consider:

- navigation behaviour;
- rerouting;
- product recognition;
- basket manipulation;
- unavailable-product handling;
- user takeover;
- offline behaviour;
- and auditability.

A client release must not silently increase AI control over real-world movement or commerce decisions.

---

## 16. Security Release Gate

Security-sensitive changes require security verification appropriate to their risk.

Examples include:

- authentication changes;
- authorization changes;
- privileged APIs;
- secret-handling changes;
- event access policies;
- data access changes;
- client hardening;
- anti-replication controls;
- and infrastructure security changes.

Security controls established by ADR-015 and EDA-001 Part 4 remain authoritative.

---

## 17. Deployment Strategies

The platform may use different deployment strategies according to risk and capability.

Possible strategies include:

- rolling deployment;
- staged deployment;
- canary deployment;
- blue/green deployment;
- regional rollout;
- store-cohort rollout;
- feature-flagged activation;
- and controlled emergency deployment.

The architecture does not mandate one universal deployment mechanism.

The chosen strategy must be appropriate to the failure radius and rollback characteristics of the change.

---

## 18. Feature Flags

Feature flags may separate deployment from activation.

```text
Code Deployed
     ↓
Capability Disabled
     ↓
Verification
     ↓
Controlled Activation
```

Feature flags must themselves be governed.

They require:

- owner;
- purpose;
- scope;
- expiry or retirement condition;
- auditability where material;
- and safe default behaviour.

A feature flag must not become permanent architectural debt.

---

## 19. Progressive Delivery

Material changes should be capable of progressive exposure where practical.

Examples include:

```text
Internal
  ↓
Test Cohort
  ↓
Single Store
  ↓
Store Cohort
  ↓
Region
  ↓
Global
```

Progressive delivery reduces failure radius and creates opportunities to observe real behaviour before broad activation.

---

## 20. Rollback

Rollback must be considered before release for material changes.

Rollback may mean:

- redeploying a previous artifact;
- disabling a feature;
- routing traffic to a previous version;
- reversing a compatible configuration change;
- restoring a prior operational state;
- or executing a compensating procedure.

Not every database or data transformation is safely reversible.

Where rollback is impossible, the release must provide an explicit recovery or forward-fix strategy.

---

## 21. Forward Fix

When rollback is unsafe or impossible, a controlled forward fix may be required.

```text
Defect
 ↓
Contain
 ↓
Diagnose
 ↓
Correct
 ↓
Verify
 ↓
Release Forward Fix
```

The absence of a traditional rollback path must not imply absence of recovery planning.

---

## 22. Release Observation

Deployment is not the end of the release process.

The system must be observed after release for signals such as:

- error rate;
- latency;
- throughput;
- event lag;
- queue depth;
- database health;
- AI failure or escalation rate;
- notification failures;
- customer-impact signals;
- security alerts;
- and infrastructure health.

EIP-028 provides the observability and trust implementation foundation.

---

## 23. Release Acceptance

A release should be considered accepted only after its defined post-release observation window and acceptance conditions have been satisfied.

Acceptance evidence may include:

- healthy runtime metrics;
- successful critical workflows;
- absence of material regressions;
- stable event processing;
- successful external integrations;
- and confirmation that expected business outcomes remain intact.

---

## 24. Failed Release Handling

A failed release must produce a traceable outcome.

```text
Release
  ↓
Failure
  ↓
Containment
  ↓
Rollback / Forward Fix
  ↓
Verification
  ↓
Incident / Change Review
  ↓
Corrective Action
```

Material failures should generate regression protection through EIP-030.

---

## 25. Emergency Changes

Emergency changes are permitted only where delay creates greater risk than controlled change.

Emergency changes must still record:

- reason;
- affected capability;
- risk;
- operator/owner;
- implementation;
- verification performed;
- deployment target;
- and post-change review.

Emergency status does not remove auditability.

---

## 26. Release Evidence

Release evidence should be durable and traceable.

Examples include:

- test results;
- security reports;
- contract verification;
- build identifiers;
- deployment records;
- approvals;
- migration evidence;
- runtime observations;
- rollback evidence;
- and release notes.

Evidence must be protected according to its classification.

---

## 27. Separation of Duties

High-risk releases should support appropriate separation between:

- implementation;
- verification;
- authorization;
- and production deployment.

The exact separation depends on risk and operating model.

A single individual or automated process should not gain unrestricted ability to modify, approve and conceal a consequential production change where governance requires separation.

---

## 28. Supply-Chain Integrity

Release processes must preserve software supply-chain integrity.

Verification should consider:

- dependency provenance;
- lockfile integrity;
- artifact integrity;
- build reproducibility where practical;
- secret exposure;
- third-party package risk;
- and unauthorized build modification.

Release infrastructure is itself a security boundary.

---

## 29. Environment Promotion

Changes should progress through controlled environments where appropriate.

Conceptually:

```text
Development
    ↓
Verification Environment
    ↓
Staging / Pre-Production
    ↓
Production
```

Promotion should preserve artifact identity where practical so that the artifact verified is the artifact deployed.

---

## 30. Configuration Management

Configuration changes must be governed as changes in their own right.

Configuration includes, where applicable:

- feature configuration;
- service endpoints;
- thresholds;
- routing rules;
- AI policies;
- event subscriptions;
- notification settings;
- security policy;
- and operational parameters.

A configuration change can materially alter system behaviour even when application code is unchanged.

---

## 31. Release and AI Society Coordination

AI Society agents may observe releases, recommend remediation or assist with operational analysis where authorised.

They must not acquire release authority merely because they can observe deployment events.

For consequential changes:

```text
Release Signal
   ↓
AI Analysis
   ↓
Recommendation
   ↓
Authorisation
   ↓
Action
```

The authority boundary remains explicit.

---

## 32. Multi-Store and Regional Rollout

Releases must support different rollout scopes where required.

Possible scopes include:

- one store;
- store cohort;
- city;
- region;
- country;
- global.

Regional rollout may be required for:

- data residency;
- infrastructure availability;
- regulatory differences;
- partner dependencies;
- operational readiness;
- or controlled experimentation.

A global release must not be assumed to be the only release shape.

---

## 33. Release Independence

Independent services and domains should be releasable independently where their contracts and operational boundaries permit.

However, independence does not justify uncontrolled compatibility risk.

The platform therefore favours:

```text
Independent Deployment
        +
Governed Contracts
        +
Verification
        +
Observability
```

rather than either extreme of a single monolithic release or completely uncontrolled independent change.

---

## 34. Deprecation and Retirement

Retirement is part of release governance.

A deprecated capability should have:

- owner;
- migration path;
- consumer inventory;
- sunset condition;
- communication plan;
- and removal verification.

Retirement of a contract or event must consider historical data, replay and external consumers.

---

## 35. Change Review

Material changes should be reviewed after release when their risk or novelty warrants it.

The review should consider:

- whether assumptions were correct;
- whether verification was sufficient;
- whether the rollout strategy worked;
- whether monitoring detected issues quickly;
- whether rollback/recovery worked;
- and whether architectural amendments are required.

Lessons should feed back into EIP-030 and the relevant architecture documents.

---

## 36. Release Lifecycle

The enterprise release lifecycle is:

```text
Proposed
   ↓
Classified
   ↓
Impact Assessed
   ↓
Implemented
   ↓
Verified
   ↓
Approved
   ↓
Released
   ↓
Observed
   ↓
Accepted
      ↘
       Rolled Back / Corrected
   ↓
Maintained
   ↓
Deprecated
   ↓
Retired
```

---

## 37. Constitutional Release Laws

EIP-031 establishes the following laws:

1. A release is a governed platform state transition.
2. Every material change has an accountable owner.
3. Material changes require impact analysis.
4. Release decisions must consume appropriate verification evidence.
5. Released artifacts must be uniquely identifiable.
6. The artifact verified should be the artifact deployed where practical.
7. Contract changes require compatibility governance.
8. Data changes require migration and recovery consideration.
9. AI capability changes must not silently expand authority.
10. Walk Mode releases must preserve Manual, Autopilot and AI Assisted authority distinctions.
11. Security-sensitive releases require appropriate security verification.
12. Deployment strategy must reflect failure radius and reversibility.
13. Feature flags must be governed and retired.
14. Progressive delivery should be used where it materially reduces release risk.
15. Rollback or an explicit recovery strategy must exist for material releases.
16. Deployment is not complete until post-release behaviour has been observed.
17. Failed releases must produce traceable corrective action.
18. Emergency changes remain auditable.
19. Release evidence must remain connected to EIP-019.
20. High-risk releases require appropriate separation of duties.
21. Release infrastructure is a security boundary.
22. Configuration changes are governed changes.
23. AI systems may assist release operations only within authorised capabilities.
24. Regional and store-level rollout must remain possible where required.
25. Independent deployment requires governed contracts and verification.
26. Deprecation and retirement require explicit lifecycle management.
27. Material release lessons must feed back into architecture and verification.

---

## 38. Relationship to EIP-030

EIP-030 answers:

> **How do we prove that the change works and satisfies its governing requirements?**

EIP-031 answers:

> **How do we safely move that verified change into an operational platform state?**

Together:

```text
EIP-030
Verification
   ↓
Evidence
   ↓
EIP-031
Release Governance
   ↓
Deployment
   ↓
Observation
   ↓
Operational State
```

---

## 39. Relationship to EIP-026

EIP-026 defines infrastructure and deployment implementation architecture.

EIP-031 defines the change and release governance applied to that infrastructure.

EIP-026 answers how deployment infrastructure is structured.

EIP-031 answers how changes are safely promoted through it.

---

## 40. Relationship to EIP-028

EIP-028 provides observability, auditability and trust implementation patterns.

EIP-031 depends on those capabilities to determine whether a release behaves as expected after deployment.

Observability therefore forms part of release control rather than merely operational convenience.

---

## 41. Final Decision

> **Essentials Mart shall use a governed release and change-management architecture in which material changes are classified, impact-assessed, verified, traceable, appropriately authorized, progressively deployed where practical, observed after release, and either accepted, rolled back, or corrected through a controlled recovery path. Release governance shall preserve domain ownership, contract compatibility, security, AI authority, operational resilience and auditable evidence without forcing every change through identical levels of ceremony.**

---

# Commit

```text
docs(eip): add EIP-031 release and change management architecture

- Establish governed release and change-management architecture
- Define change classification and accountable ownership
- Connect release decisions to EIP-019 traceability
- Connect release gates to EIP-030 verification evidence
- Establish immutable release identity and artifact traceability
- Define API, event, data and AI release governance
- Preserve Walk Mode authority distinctions across releases
- Establish security release gates
- Define progressive deployment and feature-flag governance
- Establish rollback and forward-fix requirements
- Define post-release observation and acceptance
- Establish emergency-change accountability
- Define release evidence and separation of duties
- Establish software supply-chain and environment promotion controls
- Define multi-store and regional rollout governance
- Establish deprecation and retirement lifecycle controls
- Define constitutional release laws
```
