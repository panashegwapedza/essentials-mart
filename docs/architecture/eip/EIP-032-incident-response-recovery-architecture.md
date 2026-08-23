# EIP-032 — Incident Response & Recovery Architecture

**Status:** Proposed  
**Category:** Implementation Architecture  
**Depends On:** EIP-019, EIP-026, EIP-028, EIP-030, EIP-031  
**Related ADRs:** ADR-015, ADR-016, ADR-017, ADR-018  
**Related EDA:** EDA-001 Part 4 — Defensive Architecture Baseline

---

## 1. Purpose

EIP-032 defines the reusable implementation pattern for detecting, containing, investigating, recovering from, and learning from material operational incidents across Essentials Mart.

The pattern connects observability, security, deployment, verification and release controls so that an incident is treated as an enterprise engineering event rather than an isolated service failure.

```text
Detection → Triage → Containment → Investigation → Recovery → Verification → Controlled Restoration → Post-Incident Learning → Architecture / Tests / Controls / Release Updates
```

EIP-032 does not replace security, observability, deployment or release architectures. It composes them into a governed incident-response pattern.

---

## 2. Problem

Essentials Mart operates across commerce, fulfilment, inventory, AI Society, customer channels, Walk Mode, external partners and distributed infrastructure. A failure in one capability may therefore propagate into other domains.

Examples include payment degradation, event-processing failure, inventory synchronisation failure, notification failure, compromised credentials, AI capability malfunction, data-integrity failure, partner outage, regional infrastructure failure, deployment regression, excessive event backlog or loss of a critical dependency.

The architecture must support rapid containment without sacrificing evidence, auditability, safety or domain ownership.

---

## 3. Incident Definition

A material incident is an operational, security, integrity, availability, reliability or safety condition that requires coordinated response beyond normal automated recovery.

Not every error is an incident. Incident severity must be determined by business impact rather than technical drama alone.

---

## 4. Incident Classes

Initial classes include Availability, Integrity, Security, AI, Integration, Deployment and Data incidents. Multiple classes may apply to the same incident.

---

## 5. Severity

Incident severity should consider customer impact, financial impact, safety impact, security impact, data sensitivity, geographic scope, duration, affected stores, affected users, affected partners, regulatory exposure, recoverability and risk of further propagation.

```text
SEV-1  Critical enterprise impact
SEV-2  Major business impact
SEV-3  Significant local / bounded impact
SEV-4  Minor operational impact
```

Exact service-level thresholds belong to operational governance.

---

## 6. Detection

Incidents may be detected through telemetry, alerts, audit signals, security monitoring, customer reports, store reports, partner notifications, automated integrity checks, event-processing failures, deployment verification, AI safety controls or human observation.

EIP-028 provides the observability, auditability and trust foundation used by EIP-032.

---

## 7. Incident Record

Every material incident must receive a unique incident identifier. The incident record should capture detection/declaration times, severity, classification, affected capabilities and domains, affected regions/stores, customer impact, state, incident owner, responders, correlation identifiers, deployment/change identifiers, event identifiers, actions, decisions, evidence references, recovery state and closure information.

---

## 8. Triage

Triage determines whether the condition is an incident, its severity, likely scope, whether propagation is occurring, affected capabilities, required containment and authorities to engage. Triage should prefer evidence over speculation.

---

## 9. Incident Command

Material incidents require a clearly identified incident owner. The incident owner coordinates response but does not automatically become owner of the affected domain. Domain ownership remains authoritative.

---

## 10. Containment

Containment aims to stop further harm before complete root-cause understanding is available. Controls may include disabling a capability, isolating a consumer, stopping a deployment, revoking credentials, restricting an event stream, reducing traffic, disabling an AI capability, routing traffic to a healthy region, suspending an external integration or placing an operation into manual review.

Containment actions must be attributable and auditable.

---

## 11. Safe Degradation

Where full service cannot be maintained, Essentials Mart should prefer controlled degradation over uncontrolled failure. Critical commerce and safety boundaries must be protected from non-critical failures.

---

## 12. Rollback and Forward Fix

Incident recovery may use rollback to a known-good release, configuration rollback, feature disablement, infrastructure failover, data repair or a controlled forward fix.

The selected response must consider data compatibility, schema changes, event compatibility, migration state, active transactions, security exposure and customer impact.

EIP-031 governs the release and change controls surrounding these actions.

---

## 13. Recovery Verification

A service is not considered recovered merely because it starts successfully. Recovery must be verified using appropriate health checks, synthetic transactions, data-integrity checks, event-flow verification, contract tests, security checks, customer journey validation, AI capability checks and observability confirmation as applicable.

EIP-030 provides the testing and verification architecture.

---

## 14. Controlled Restoration

Restoration should be progressive where the risk warrants it.

```text
Recovered Build → Verification → Limited Exposure → Observe → Expand → Full Restoration
```

---

## 15. Data Integrity Recovery

Recovery must distinguish authoritative state, derived projections, cached state, event history, analytical records and external partner state. A projection may be rebuilt from authoritative information where appropriate.

Historical records must not be silently rewritten merely to make the system appear healthy. Correction must remain traceable.

---

## 16. Event-Driven Incident Recovery

Event infrastructure failures may require retry, quarantine/dead-letter handling, repair and controlled replay. Replay must not unintentionally repeat irreversible side effects. Idempotency remains mandatory where duplicate delivery is possible.

---

## 17. AI Incident Response

AI incidents include unsafe recommendation behaviour, unauthorised tool use, incorrect autonomous action, prompt/context manipulation, abnormal agent collaboration, policy violation, model degradation or unexpected cost escalation.

```text
AI Capability Anomaly → Contain Capability → Preserve Evidence → Disable / Restrict Agent → Human Review → Correct / Verify → Controlled Restoration
```

Disabling an AI capability must not automatically disable unrelated commerce capabilities.

---

## 18. Security Incident Boundary

Security incidents must integrate with the security architecture rather than create a parallel security model. Actions may include credential revocation, session invalidation, access restriction, network isolation, secret rotation, event-consumer suspension, evidence preservation or partner access restriction.

---

## 19. External Partner Incidents

An external provider outage must not automatically become an enterprise-wide failure. The architecture should support detection, adapter isolation and an alternative or deferred path where possible.

Partner-specific failures must not contaminate canonical internal contracts.

---

## 20. Regional Incident Handling

Incident response must support regional containment. A regional incident must not automatically require global shutdown.

Data residency and organisational boundaries must remain respected during recovery.

---

## 21. Dependency Failure

Material dependencies should have health signals, timeout behaviour, retry behaviour, fallback, circuit-breaking where appropriate, degraded mode, ownership, escalation path and recovery verification.

No dependency should be treated as infinitely reliable merely because it is external or managed.

---

## 22. Incident Communication

Material incidents require controlled communication to incident responders, engineering teams, store operations, affected customers, partners, executives and regulators where required.

Communication must distinguish confirmed facts, working hypotheses, customer impact, current mitigation and expected next update.

Sensitive security or investigation details must not be exposed unnecessarily.

---

## 23. Customer Protection

Incident response must prioritise customer safety and transaction integrity, including preventing duplicate charges or rewards, preserving basket and order state where possible, avoiding misleading availability information, preserving delivery commitments where feasible, clearly identifying degraded functionality and preventing AI from making unauthorised consequential decisions.

---

## 24. Evidence Preservation

Material incidents must preserve sufficient evidence for investigation and accountability, including logs, traces, event identifiers, deployment identifiers, configuration versions, audit records, access records, AI decision records, partner messages, test results and operator actions.

Evidence retention remains subject to security, privacy and retention policies.

---

## 25. Root Cause and Contributing Factors

Incident investigation should distinguish immediate trigger, technical root cause, contributing conditions, latent architectural weaknesses, process failures, monitoring gaps, verification gaps and organisational factors.

A root-cause statement should not stop at the first observable error.

---

## 26. Post-Incident Review

Material incidents should produce a post-incident review covering what happened, why detection occurred when it did, what worked, what failed, customer impact, decisions made, evidence available, missing controls and required changes.

The purpose is learning and system improvement, not merely blame assignment.

---

## 27. Corrective Actions

Corrective actions may result in changes to code, configuration, tests, infrastructure, observability, security controls, runbooks, contracts, event handling, AI guardrails or release controls.

Corrective actions must have owners and appropriate completion evidence.

---

## 28. Regression Protection

Where an incident exposes a reproducible defect, an appropriate verification or regression control should be added through EIP-030. The objective is to reduce recurrence rather than merely restore service.

---

## 29. Architecture Feedback

Material incidents may reveal weaknesses in ADRs, EDAs, EIPs, contracts, implementation boundaries or operational procedures. Architecture changes must follow the governed change process established by EIP-031.

---

## 30. Incident Closure

An incident is not closed merely because service has returned. Closure requires verified recovery, evidence preservation, customer-impact assessment, outstanding-action capture and appropriate post-incident review.

---

## 31. Incident State Model

```text
Detected → Triaged → Declared → Contained → Investigating → Recovering → Verifying → Restoring → Monitoring → Resolved → Reviewed → Closed
```

The implementation may add operational states without weakening the core lifecycle.

---

## 32. Incident Authority

Incident response actions must respect existing authority boundaries. An incident owner may coordinate response but may not silently expand domain, security or AI authority.

Consequential actions remain subject to applicable authorization and human-in-the-loop requirements.

---

## 33. Automation

Automation should accelerate detection, triage, containment and recovery where safely possible. Automated action must have bounded authority, observable outcomes, safe defaults and an auditable trail.

---

## 34. AI-Assisted Incident Operations

AI Society capabilities may assist with correlation, summarisation, diagnosis, recommendation and operational analysis where authorised. AI recommendations remain recommendations unless explicitly granted bounded operational authority.

---

## 35. Runbooks

Material incident classes should have maintained runbooks describing detection signals, initial triage, containment options, escalation, recovery, verification and closure. Runbooks must remain consistent with architecture.

---

## 36. Testing Incident Readiness

Incident controls should be exercised through appropriate simulations, failure testing, recovery testing and operational drills. Tests must not create uncontrolled production risk.

---

## 37. Recovery Objectives

Recovery planning should identify appropriate recovery-time and recovery-point expectations for material capabilities. Exact objectives belong to operational governance and domain risk assessment.

---

## 38. Backup and Restore

Where data recovery depends on backups, restoration procedures must be tested periodically. Backup existence alone is not evidence of recoverability.

---

## 39. Disaster Recovery

Disaster recovery must account for infrastructure loss, regional loss, dependency loss, data recovery and controlled restoration. Recovery plans must preserve security, data ownership, auditability and domain boundaries.

---

## 40. Final Architectural Rule

> **An incident is not complete when the system merely starts working again. It is complete when harm is contained, recovery is verified, evidence is preserved, affected customers and domains are accounted for, and the system has learned from the failure.**
