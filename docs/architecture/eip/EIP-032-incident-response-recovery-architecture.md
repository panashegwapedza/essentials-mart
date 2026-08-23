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

It establishes a controlled path:

```text
Detection
   ↓
Triage
   ↓
Containment
   ↓
Investigation
   ↓
Recovery
   ↓
Verification
   ↓
Controlled Restoration
   ↓
Post-Incident Learning
   ↓
Architecture / Tests / Controls / Release Updates
```

EIP-032 does not replace the security, observability, deployment or release architectures. It composes them into a governed incident-response pattern.

---

## 2. Problem

Essentials Mart operates across commerce, fulfilment, inventory, AI Society, customer channels, Walk Mode, external partners and distributed infrastructure.

A failure in one capability may therefore propagate into other domains.

Examples include:

- payment degradation;
- event-processing failure;
- inventory synchronisation failure;
- notification failure;
- compromised credentials;
- AI capability malfunction;
- data-integrity failure;
- partner outage;
- regional infrastructure failure;
- deployment regression;
- excessive event backlog;
- or loss of a critical dependency.

The architecture must support rapid containment without sacrificing evidence, auditability, safety or domain ownership.

---

## 3. Incident Definition

A material incident is an operational, security, integrity, availability, reliability or safety condition that requires coordinated response beyond normal automated recovery.

Not every error is an incident.

Examples of ordinary failures that may remain within normal resilience controls:

```text
Transient request timeout
        ↓
Retry
        ↓
Recovered
```

A material incident may look like:

```text
Repeated failures
        ↓
Service degradation
        ↓
Customer / business impact
        ↓
Incident declared
```

Incident severity must be determined by business impact rather than technical drama alone.

---

## 4. Incident Classes

Initial classes include:

### Availability Incident

A capability is unavailable or materially degraded.

### Integrity Incident

Data, state, events or projections may be incorrect, inconsistent or corrupted.

### Security Incident

Confidentiality, integrity, authentication, authorization or platform security may be compromised.

### AI Incident

An AI agent, Intelligence Engine or AI-mediated workflow behaves outside its authorised or verified operating envelope.

### Integration Incident

An external partner, channel or integration boundary fails or behaves unexpectedly.

### Deployment Incident

A release, configuration or infrastructure change causes material regression.

### Data Incident

Material data loss, leakage, corruption, privacy failure or unacceptable data-quality degradation occurs.

Multiple classes may apply to the same incident.

---

## 5. Severity

Incident severity should consider:

- customer impact;
- financial impact;
- safety impact;
- security impact;
- data sensitivity;
- geographic scope;
- duration;
- affected stores;
- affected users;
- affected partners;
- regulatory exposure;
- recoverability;
- and risk of further propagation.

A conceptual severity model is:

```text
SEV-1  Critical enterprise impact
SEV-2  Major business impact
SEV-3  Significant local / bounded impact
SEV-4  Minor operational impact
```

The exact service-level thresholds belong to operational governance and may evolve without changing this pattern.

---

## 6. Detection

Incidents may be detected through:

- telemetry;
- alerts;
- audit signals;
- security monitoring;
- customer reports;
- store reports;
- partner notifications;
- automated integrity checks;
- event-processing failures;
- deployment verification;
- AI safety controls;
- or human observation.

Detection must produce sufficient evidence to support triage.

EIP-028 provides the observability, auditability and trust foundation used by EIP-032.

---

## 7. Incident Record

Every material incident must receive a unique incident identifier.

The incident record should capture:

- incidentId;
- detectedAt;
- declaredAt;
- severity;
- classification;
- affected capabilities;
- affected domains;
- affected regions / stores;
- customer impact;
- current state;
- incident owner;
- responders;
- correlation identifiers;
- relevant deployment or change identifiers;
- relevant event identifiers;
- actions taken;
- decisions made;
- evidence references;
- recovery state;
- and closure information.

The incident record is not a substitute for underlying logs, traces, events or audit records. It provides the governed coordination record linking them.

---

## 8. Triage

Triage determines:

1. whether the condition is an incident;
2. its severity;
3. its likely scope;
4. whether propagation is occurring;
5. which capabilities are affected;
6. what immediate containment is required;
7. and which authorities must be engaged.

Triage should prefer evidence over speculation.

---

## 9. Incident Command

Material incidents require a clearly identified incident owner.

The incident owner coordinates response but does not automatically become owner of the affected domain.

For example:

```text
Incident Owner
      │
      ├── Commerce Domain Owner
      ├── Security Owner
      ├── Infrastructure Owner
      ├── AI Capability Owner
      └── Partner / Operations Owner
```

Domain ownership remains authoritative.

---

## 10. Containment

Containment aims to stop further harm before complete root-cause understanding is available.

Possible controls include:

- disabling a capability;
- isolating a consumer;
- stopping a deployment;
- revoking credentials;
- restricting an event stream;
- reducing traffic;
- disabling an AI capability;
- routing traffic to a healthy region;
- suspending an external integration;
- or placing an operation into manual review.

Containment actions must be attributable and auditable.

---

## 11. Safe Degradation

Where full service cannot be maintained, Essentials Mart should prefer controlled degradation over uncontrolled failure.

Examples:

```text
Recommendation Engine unavailable
        ↓
Commerce remains available
        ↓
Fallback recommendation behaviour
```

```text
Notification provider unavailable
        ↓
Notification persisted
        ↓
Deferred delivery
```

```text
AI capability degraded
        ↓
Capability disabled
        ↓
Authorised non-AI workflow continues
```

Critical commerce and safety boundaries must be protected from non-critical failures.

---

## 12. Rollback and Forward Fix

Incident recovery may use:

- rollback to a known-good release;
- configuration rollback;
- feature disablement;
- infrastructure failover;
- data repair;
- or a controlled forward fix.

Rollback is not automatically safer than a forward fix.

The selected response must consider:

- data compatibility;
- schema changes;
- event compatibility;
- migration state;
- active transactions;
- security exposure;
- and customer impact.

EIP-031 governs the release and change controls surrounding these actions.

---

## 13. Recovery Verification

A service is not considered recovered merely because it starts successfully.

Recovery must be verified against appropriate evidence.

Verification may include:

- health checks;
- synthetic transactions;
- data-integrity checks;
- event-flow verification;
- contract tests;
- security checks;
- customer journey validation;
- AI capability checks;
- and observability confirmation.

EIP-030 provides the testing and verification architecture.

---

## 14. Controlled Restoration

Restoration should be progressive where the risk warrants it.

Example:

```text
Recovered Build
      ↓
Verification
      ↓
Limited Exposure
      ↓
Observe
      ↓
Expand
      ↓
Full Restoration
```

This reduces the risk of turning an attempted recovery into a second incident.

---

## 15. Data Integrity Recovery

Where an incident may have produced incorrect state, recovery must distinguish:

- authoritative state;
- derived projections;
- cached state;
- event history;
- analytical records;
- and external partner state.

A projection may be rebuilt from authoritative information where appropriate.

Historical records must not be silently rewritten merely to make the system appear healthy.

Correction must remain traceable.

---

## 16. Event-Driven Incident Recovery

Event infrastructure failures require special handling.

The response may include:

```text
Consumer Failure
      ↓
Retry
      ↓
Quarantine / Dead Letter
      ↓
Repair
      ↓
Controlled Replay
      ↓
Verification
```

Replay must not unintentionally repeat irreversible side effects.

Idempotency remains mandatory where duplicate delivery is possible.

---

## 17. AI Incident Response

AI incidents require explicit authority controls.

Examples include:

- unsafe recommendation behaviour;
- unauthorised tool use;
- incorrect autonomous action;
- prompt or context manipulation;
- abnormal agent collaboration;
- policy violation;
- model degradation;
- or unexpected cost escalation.

The response may include:

```text
AI Capability Anomaly
        ↓
Contain Capability
        ↓
Preserve Evidence
        ↓
Disable / Restrict Agent
        ↓
Human Review
        ↓
Correct / Verify
        ↓
Controlled Restoration
```

Disabling an AI capability must not automatically disable unrelated commerce capabilities.

---

## 18. Security Incident Boundary

Security incidents must integrate with the security architecture rather than create a parallel security model.

Actions may include:

- credential revocation;
- session invalidation;
- access restriction;
- network isolation;
- secret rotation;
- event-consumer suspension;
- evidence preservation;
- or partner access restriction.

Security-specific investigation and legal or regulatory processes remain governed by the applicable security and compliance controls.

---

## 19. External Partner Incidents

An external provider outage must not automatically become an enterprise-wide failure.

The architecture should support:

```text
Partner Failure
      ↓
Detect
      ↓
Isolate Adapter
      ↓
Select Alternative / Deferred Path
      ↓
Continue Core Operations
```

EIP-017 remains the integration boundary for provider-specific behaviour.

Partner-specific failures must not contaminate canonical internal contracts.

---

## 20. Regional Incident Handling

At global scale, incident response must support regional containment.

For example:

```text
Region A Incident
      ↓
Regional Isolation
      ↓
Other Regions Continue
      ↓
Controlled Recovery
```

A regional incident must not automatically require global shutdown.

Data residency and organisational boundaries must remain respected during recovery.

---

## 21. Dependency Failure

Critical dependencies must be classified according to business impact.

For each material dependency, the implementation should identify:

- health signal;
- timeout behaviour;
- retry behaviour;
- fallback;
- circuit-breaking where appropriate;
- degraded mode;
- ownership;
- escalation path;
- and recovery verification.

No dependency should be treated as infinitely reliable merely because it is external or managed.

---

## 22. Incident Communication

Material incidents require controlled communication.

Possible audiences include:

- incident responders;
- engineering teams;
- store operations;
- affected customers;
- partners;
- executives;
- and regulators where required.

Communication must distinguish:

- confirmed facts;
- working hypotheses;
- customer impact;
- current mitigation;
- and expected next update.

Sensitive security or investigation details must not be exposed unnecessarily.

---

## 23. Customer Protection

Incident response must prioritise customer safety and transaction integrity.

Examples:

- prevent duplicate charges;
- prevent duplicate rewards;
- preserve basket and order state where possible;
- avoid misleading availability information;
- preserve delivery commitments where feasible;
- clearly identify degraded functionality;
- and prevent AI from making unauthorised consequential decisions.

Customer-facing recovery must be verified rather than inferred from backend health alone.

---

## 24. Evidence Preservation

Material incidents must preserve sufficient evidence for investigation and accountability.

Relevant evidence may include:

- logs;
- traces;
- event identifiers;
- deployment identifiers;
- configuration versions;
- audit records;
- access records;
- AI decision records;
- partner messages;
- test results;
- and operator actions.

Evidence retention remains subject to security, privacy and retention policies.

---

## 25. Root Cause and Contributing Factors

Incident investigation should distinguish:

- immediate trigger;
- technical root cause;
- contributing conditions;
- latent architectural weaknesses;
- process failures;
- monitoring gaps;
- verification gaps;
- and organisational factors.

A root-cause statement should not stop at the first observable error.

---

## 26. Post-Incident Review

Material incidents should produce a post-incident review covering:

- what happened;
- why detection occurred when it did;
- what worked;
- what failed;
- what customer impact occurred;
- what decisions were made;
- what evidence exists;
- what controls were missing;
- and what must change.

The purpose is learning and system improvement, not merely blame assignment.

---

## 27. Corrective Actions

Corrective actions may result in changes to:

- code;
- configuration;
- tests;
- infrastructure;
- observability;
- security controls;
- runbooks;
- contracts;
- event handling;
- AI guardrails;
- architecture;
- or operational procedures.

Material changes must return through the governed engineering and release path.

---

## 28. Verification After Corrective Change

Incident-driven fixes must not bypass normal verification merely because the incident was urgent.

Emergency changes may use an accelerated path, but must still provide proportionate evidence.

```text
Incident
   ↓
Emergency Change
   ↓
Verification
   ↓
Controlled Release
   ↓
Post-Release Observation
```

EIP-030 and EIP-031 remain applicable.

---

## 29. Runbooks

Material operational capabilities should have maintained runbooks describing:

- symptoms;
- detection signals;
- severity criteria;
- immediate containment;
- diagnostic commands or procedures;
- rollback or recovery paths;
- verification steps;
- escalation contacts;
- and closure requirements.

Runbooks must not contain uncontrolled secrets or sensitive credentials.

---

## 30. Incident Simulation

Essentials Mart should periodically test incident response through controlled exercises.

Exercises may include:

- service outage;
- event backlog;
- data corruption;
- compromised credentials;
- regional failure;
- partner outage;
- failed deployment;
- AI capability shutdown;
- and notification degradation.

Testing incident response validates both technical resilience and organisational readiness.

---

## 31. Recovery Objectives

Material capabilities should have explicit recovery expectations appropriate to their business criticality.

These may include:

- Recovery Time Objective (RTO);
- Recovery Point Objective (RPO);
- maximum tolerable outage;
- maximum acceptable data loss;
- and restoration priority.

The values are capability-specific and must not be assumed globally.

---

## 32. Observability Integration

EIP-028 provides the telemetry and traceability required to operate EIP-032.

The incident system should be able to move from:

```text
Alert
 ↓
Trace
 ↓
Event / Log
 ↓
Deployment / Change
 ↓
Affected Capability
```

This shortens investigation time and preserves causal evidence.

---

## 33. Release Integration

EIP-031 governs how incident-driven changes are promoted.

The incident system should therefore retain links to:

- change identifiers;
- release identifiers;
- build identifiers;
- configuration versions;
- migration versions;
- verification evidence;
- and rollback state.

This makes it possible to answer:

> What changed immediately before the incident?

and:

> What change restored the system?

---

## 34. Traceability Integration

EIP-019 must be used to connect incident findings to affected architecture and implementation evidence.

Example:

```text
Incident
   ↓
Finding
   ↓
Architecture / Control
   ↓
Implementation
   ↓
Test
   ↓
Release
```

This prevents incident learning from disappearing into an isolated ticket.

---

## 35. No Silent Recovery

Recovery must not hide material failures merely to restore superficial health indicators.

For example:

```text
Corrupted Projection
      ↓
Delete Evidence
      ✗
```

Instead:

```text
Corrupted Projection
      ↓
Record Incident
      ↓
Preserve Evidence
      ↓
Rebuild Projection
      ↓
Verify
      ↓
Record Recovery
```

Historical integrity remains part of the recovery architecture.

---

## 36. Incident Closure

An incident may be closed only when:

- immediate impact is contained;
- the affected capability is operating within its defined envelope;
- recovery evidence exists;
- customer impact is understood sufficiently;
- required communications are complete;
- remaining risks are accepted or transferred;
- and corrective actions are recorded.

Root-cause analysis may continue after operational closure where necessary.

---

## 37. Incident Lifecycle

The standard lifecycle is:

```text
Detected
   ↓
Triaged
   ↓
Declared
   ↓
Contained
   ↓
Investigated
   ↓
Recovered
   ↓
Verified
   ↓
Restored
   ↓
Reviewed
   ↓
Closed
   ↓
Learned
```

Not every incident requires every state to be operationally visible, but the underlying responsibilities must be satisfied for material incidents.

---

## 38. Constitutional Integration Rules

EIP-032 establishes these implementation rules:

1. Material incidents must have a unique incident identity.
2. Incident severity must be based on business impact.
3. Every material incident must have an accountable incident owner.
4. Incident ownership does not transfer domain ownership.
5. Detection must preserve sufficient evidence for triage.
6. Containment may precede complete root-cause understanding.
7. Containment actions must be attributable and auditable.
8. Critical capabilities must support appropriate degraded modes where feasible.
9. Rollback is a recovery option, not an automatic default.
10. Recovery must be verified before full restoration.
11. Data integrity recovery must preserve authoritative-state boundaries.
12. Event replay must not unintentionally repeat irreversible side effects.
13. AI capabilities may be restricted or disabled independently of unrelated commerce capabilities.
14. External partner failures must remain isolated behind explicit integration boundaries.
15. Regional incidents should be containable where the architecture permits.
16. Material incidents must preserve proportionate evidence.
17. Customer protection must remain a primary incident-response objective.
18. Emergency changes remain subject to proportionate verification.
19. Incident findings must feed back into architecture, implementation, tests and controls.
20. Incident response must remain observable and traceable.
21. Incident closure requires evidence of controlled recovery.
22. Incident learning must not be discarded after operational recovery.

---

## 39. Architectural Outcome

EIP-032 creates the enterprise incident-response pattern:

```text
                  DETECTION
                     │
                     ▼
                  TRIAGE
                     │
                     ▼
              INCIDENT COMMAND
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      CONTAIN      PROTECT    PRESERVE
          │          │          │
          └──────────┼──────────┘
                     ▼
                INVESTIGATE
                     │
                     ▼
                  RECOVER
                     │
                     ▼
                 VERIFY
                     │
                     ▼
                RESTORE
                     │
                     ▼
             POST-INCIDENT REVIEW
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      ARCHITECTURE  TESTS    CONTROLS
          │          │          │
          └──────────┼──────────┘
                     ▼
                EIP-031 RELEASE
                     │
                     ▼
              IMPROVED PLATFORM
```

The objective is not simply to recover from failure. It is to ensure that every material incident increases the resilience, observability, verification quality and operational maturity of Essentials Mart.

---

## 40. Final Principle

> **Essentials Mart shall treat material incidents as governed enterprise events requiring evidence-based containment, verified recovery and permanent learning.**

Incident response must preserve:

**customer protection → evidence → containment → recovery → verification → learning → improvement.**
