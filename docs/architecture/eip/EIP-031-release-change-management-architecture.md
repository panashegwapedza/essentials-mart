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

Changes may affect commerce, payments, inventory, fulfilment, delivery, AI Society capabilities, Walk Mode, customer data, event contracts, APIs, security controls, infrastructure, external partners and operational continuity.

EIP-030 establishes how changes are verified. EIP-031 establishes how verified changes become controlled releases and how changes are introduced, observed, rolled back, retired or superseded.

---

## 2. Constitutional Release Principle

> **A release is a governed change to an identifiable platform state, not merely a successful deployment.**

A change is release-ready only when its implementation, verification, security, traceability and operational consequences are sufficiently understood for its risk level.

The release lifecycle is:

```text
Change → Classification → Impact Analysis → Implementation → Verification → Release Decision → Deployment → Observation → Acceptance / Rollback / Remediation
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

Every material change must have an accountable owner responsible for defining the change, identifying affected architecture and dependencies, ensuring verification, identifying rollback or recovery behaviour, coordinating release readiness and retaining evidence.

Release ownership does not transfer domain ownership.

---

## 5. Forward-Consistency Requirement

Before a material architecture change is released, its direct and secondary impacts must be assessed, including affected ADRs, EDAs, EIPs, contracts, domains, data boundaries, security controls, AI capabilities, client behaviour and operational procedures.

The release must not knowingly introduce contradictions into the architecture corpus.

---

## 6. Traceability

Release evidence must remain connected to EIP-019.

```text
Architecture → EIP → Requirement / Change → Implementation Commit → Verification Evidence → Build Artifact → Release → Deployment → Runtime Evidence
```

A release should be reconstructable from its source, configuration, verification evidence and deployment record.

---

## 7. Release Candidate

Material releases should produce an identifiable release candidate or equivalent immutable build state identifying source revision, dependency state, configuration version, schema version, contract versions, generated artifacts, verification results, security results and release classification where applicable.

---

## 8. Immutable Release Identity

A released build must be uniquely identifiable. Release identity must not be reused for materially different artifacts.

---

## 9. Verification Gate

EIP-030 defines the verification system. EIP-031 consumes its results as release evidence.

A material release should not proceed when required verification has failed or when required evidence is missing.

```text
Build → Tests → Security Checks → Contract Checks → Architecture Checks → Operational Checks → Release Gate
```

---

## 10. Release Gates

Release gates should be proportionate to risk. Possible gates include build success, unit and component verification, integration verification, contract compatibility, security verification, data migration verification, AI authority verification, resilience verification, performance verification, manual approval, operational readiness and rollback readiness.

---

## 11. Database and Data Changes

Data changes require explicit release coordination where they affect compatibility, retention, ownership or recovery. Destructive migrations require heightened review and recovery evidence.

---

## 12. API and Contract Changes

EIP-029 governs contract engineering. Releases changing APIs, events, data, integrations, AI tools or client contracts must verify compatibility. Breaking changes require explicit version management and consumer migration planning.

---

## 13. Event Changes

Event changes must respect EDA-013 and EIP-023, including schema evolution, consumer compatibility, ordering, replay, retention, duplicate handling and historical events.

---

## 14. AI Release Governance

AI-related releases require additional verification where model, prompt, policy, tool, routing or authority behaviour changes. A model update must not silently expand an agent's authority. Consequential AI capability changes require appropriate authority and human-in-the-loop verification.

---

## 15. Walk Mode Release Governance

Walk Mode changes must preserve Manual Mode, Autopilot Mode and AI Assisted Mode. Verification should consider navigation, rerouting, product recognition, basket manipulation, unavailable-product handling, user takeover, offline behaviour and auditability.

A client release must not silently increase AI control over real-world movement or commerce decisions.

---

## 16. Security Release Gate

Security-sensitive changes require security verification appropriate to risk, including authentication, authorization, privileged APIs, secret handling, event access, data access, client hardening, anti-replication controls and infrastructure security.

ADR-015 and EDA-001 Part 4 remain authoritative.

---

## 17. Deployment Strategies

Possible strategies include rolling, staged, canary, blue/green, regional, store-cohort, feature-flagged and controlled emergency deployment. The selected strategy must match the failure radius and rollback characteristics of the change.

---

## 18. Feature Flags

Feature flags may separate deployment from activation. They require an owner, purpose, scope, expiry or retirement condition, auditability where material and safe default behaviour. A feature flag must not become permanent architectural debt.

---

## 19. Progressive Delivery

Material changes should support progressive exposure where practical, for example internal → test cohort → single store → store cohort → region → global.

Progressive delivery reduces failure radius.

---

## 20. Rollback

Rollback must be considered before release for material changes. Where rollback is impossible, the release must provide an explicit recovery or forward-fix strategy.

---

## 21. Forward Fix

When rollback is unsafe or impossible, a controlled forward fix may be required. The absence of a traditional rollback path must not imply absence of recovery planning.

---

## 22. Release Observation

Deployment is not the end of the release process. The system must be observed for error rate, latency, throughput, event lag, queue depth, database health, AI failure or escalation rate, notification failures, customer-impact signals, security alerts and infrastructure health.

EIP-028 provides the observability and trust implementation foundation.

---

## 23. Release Acceptance

A release should be considered accepted only after its defined post-release observation window and acceptance conditions have been satisfied.

---

## 24. Failed Release Handling

A failed release must produce a traceable outcome through containment, rollback or forward fix, verification, incident/change review and corrective action.

Material failures should generate regression protection through EIP-030.

---

## 25. Emergency Changes

Emergency changes are permitted only where delay creates greater risk than controlled change. They must still record reason, affected capability, risk, owner, implementation, verification, deployment target and post-change review.

Emergency status does not remove auditability.

---

## 26. Release Evidence

Release evidence should be durable and traceable, including test results, security reports, contract verification, build identifiers, deployment records, approvals, migration evidence, runtime observations, rollback evidence and release notes.

---

## 27. Separation of Duties

High-risk releases should support appropriate separation between implementation, verification, authorization and production deployment.

---

## 28. Supply-Chain Integrity

Release processes must preserve dependency provenance, lockfile integrity, artifact integrity, build reproducibility where practical, secret protection, third-party package risk controls and protection against unauthorized build modification.

---

## 29. Environment Promotion

Changes should progress through controlled environments where appropriate: development → verification → staging/pre-production → production.

Promotion should preserve artifact identity where practical.

---

## 30. Configuration Management

Configuration changes must be governed as changes in their own right. A configuration change can materially alter system behaviour even when application code is unchanged.

---

## 31. Release and AI Society Coordination

AI Society agents may observe releases, recommend remediation or assist with operational analysis where authorised. They must not acquire release authority merely because they can observe deployment events.

```text
Release Signal → AI Analysis → Recommendation → Authorisation → Action
```

The authority boundary remains explicit.

---

## 32. Multi-Store and Regional Rollout

Releases must support scopes including one store, store cohort, city, region, country and global. Regional rollout may be required for data residency, infrastructure availability, regulatory differences, partner dependencies, operational readiness or controlled experimentation.

---

## 33. Release Independence

Independent services and domains should be releasable independently where their contracts and operational boundaries permit. Independence does not justify uncontrolled compatibility risk.

```text
Independent Deployment + Governed Contracts + Verification + Observability
```

---

## 34. Deprecation and Retirement

A deprecated capability should have an owner, migration path, consumer inventory, sunset condition, communication plan and removal verification. Retirement of a contract or event must consider historical data, replay and external consumers.

---

## 35. Change Review

Material changes should be reviewed after release when risk or novelty warrants it. Lessons should feed back into EIP-030 and relevant architecture documents.

---

## 36. Release Lifecycle

```text
Proposed → Classified → Impact Assessed → Implemented → Verified → Approved → Released → Observed → Accepted → Maintained → Deprecated → Retired
```

Rollback or correction may occur after release where required.

---

## 37. Constitutional Release Laws

1. A release is a governed platform state transition.
2. Every material change has an accountable owner.
3. Material changes require impact analysis.
4. Verification evidence is part of release readiness.
5. Release identity must be immutable.
6. Security and AI authority boundaries must be preserved.
7. Deployment strategy must match change risk.
8. Rollback or recovery must be considered before material release.
9. Production changes must remain observable and auditable.
10. Emergency changes remain accountable.
11. Independent release does not remove contract obligations.
12. Retirement is part of lifecycle governance.

---

## 38. Implementation Contract

Implementations conforming to EIP-031 must provide, at an appropriate level for the change risk:

- identifiable release state;
- change classification;
- impact assessment;
- verification evidence;
- release gates;
- deployment strategy;
- rollback or recovery strategy;
- post-release observation;
- release evidence;
- and accountable ownership.

The exact tooling is an implementation concern unless established elsewhere by architecture.

---

## 39. Relationship to Other EIPs

EIP-019 provides traceability. EIP-026 provides architecture validation. EIP-027 provides implementation foundation. EIP-028 provides observability, auditability and trust. EIP-029 provides contract engineering. EIP-030 provides verification. EIP-032 provides incident response and recovery.

EIP-031 is the controlled transition between verified change and operational release.

---

## 40. Final Architectural Rule

> **No material change becomes production reality merely because it can be deployed. It becomes production reality when it has been classified, assessed, verified, authorised, released, observed and accepted under governed controls appropriate to its risk.**
