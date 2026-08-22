# Commit 018 — Automated Defence & Containment

**Document ID:** EDA-001-P4-018  
**Title:** Automated Defence & Containment  
**Parent Architecture:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Status:** Proposed / Commit Ready  
**Domain:** Automated Defence & Containment  
**Depends On:** Commits 006, 009, 010, 013, 014, 015, 016, 017; EDA-001 Part 3; ADR-015; ADR-016  
**Canonical Path:** `docs/architecture/EDA/part-4/commits/018-automated-defence-containment.md`

---

## 1. Purpose

Commit 018 establishes the defensive architecture governing how Essentials Mart may automatically contain, restrict, isolate, degrade, suspend, revoke, quarantine or otherwise limit hostile or unsafe activity after a sufficiently reliable security signal has been detected.

The objective is to reduce attacker dwell time and blast radius without allowing automated defence to become an uncontrolled source of customer harm, service disruption, financial loss or irreversible action.

The governing progression is:

```text
Detection
   ↓
Assessment
   ↓
Policy / Authority Check
   ↓
Authorised Defensive Action
   ↓
Containment
   ↓
Verification
   ↓
Reassessment
   ├── Release
   └── Escalate to Incident Response
```

Automation is a defensive capability, not an independent authority layer.

---

## 2. Boundary With Commit 017

Commit 017 establishes monitoring and detection.

Commit 018 establishes what the platform may do after detection.

```text
017 — Defensive Monitoring & Detection
        ↓
Security signal
        ↓
018 — Automated Defence & Containment
        ↓
Authorised defensive action
```

Commit 018 must not redefine detection logic belonging to Commit 017.

---

## 3. Constitutional Principle

> **Essentials Mart shall automate defensive containment only within explicitly authorised boundaries, with proportionality, reversibility, observability and escalation controls.**

A detection does not automatically justify every available defensive action.

The decision must consider:

- confidence;
- severity;
- affected asset;
- affected principal;
- potential harm;
- reversibility;
- business criticality;
- evidence quality;
- applicable policy;
- authority;
- and whether human approval is required.

---

## 4. Defensive Action Classes

Automated defensive actions may include:

### Observe

Increase monitoring without changing access.

### Challenge

Require additional verification or proof of control.

### Throttle

Reduce request rate, concurrency or resource consumption.

### Restrict

Reduce functionality while preserving legitimate operation where possible.

### Quarantine

Isolate an account, device, workload, file, model, event stream, integration or other asset.

### Suspend

Temporarily prevent activity pending verification or investigation.

### Revoke

Invalidate credentials, tokens, sessions, keys or delegated capabilities.

### Isolate

Separate an affected workload, network segment, service or integration from other resources.

### Block

Prevent a clearly unauthorised or malicious action.

### Kill / Disable

Stop a running process, agent, capability or workload where continued operation presents unacceptable risk and the authority to do so exists.

The selected action must be proportional to the evidence and impact.

---

## 5. Policy-Governed Defence

Automated containment must not depend solely on an arbitrary threshold embedded in application code.

The architecture requires:

```text
Signal
  ↓
Risk / Confidence Assessment
  ↓
Defensive Policy
  ↓
Permitted Action
  ↓
Execution
```

Policies must be reviewable, testable, auditable and independently governable.

---

## 6. Confidence and Severity

Automated response must distinguish confidence from severity.

A high-severity event with weak evidence may require challenge, observation or escalation.

A lower-severity event with extremely strong evidence may justify immediate containment.

Security decisions must not be reduced to one opaque score.

---

## 7. Proportionality

The defensive action should be the least disruptive action capable of controlling the identified risk.

```text
Observe
   ↓
Challenge
   ↓
Throttle
   ↓
Restrict
   ↓
Quarantine
   ↓
Suspend
   ↓
Revoke / Isolate
   ↓
Block / Disable
```

Not every incident progresses through every level.

---

## 8. Reversibility

Automated defensive actions should be reversible where technically and legally possible.

```text
Temporary Restriction
        ↓
Risk Cleared
        ↓
Restriction Removed
```

Irreversible actions require substantially stronger controls and, where appropriate, human authorisation.

Automated defence must not silently destroy evidence or rewrite historical records.

---

## 9. Evidence Preservation

Containment must preserve evidence required for investigation, audit, legal response and recovery.

Relevant evidence may include:

- security logs;
- event identifiers;
- trace identifiers;
- request metadata;
- detection signals;
- affected resource identifiers;
- configuration state;
- model or agent state where appropriate;
- and defensive action history.

Containment design must account for evidence preservation before destructive or irreversible actions.

---

## 10. Blast-Radius Control

Every automated action must have an explicit scope.

Possible scopes include:

- request;
- session;
- credential;
- device;
- account;
- household;
- store;
- tenant;
- partner;
- service;
- workload;
- region;
- event stream;
- AI agent;
- model;
- or platform-wide.

The system must avoid platform-wide containment when a narrower boundary is sufficient.

---

## 11. Customer Protection

Automated security controls must distinguish protecting the platform from unnecessarily harming legitimate customers.

Where risk permits:

```text
Suspicious Activity
      ↓
Challenge / Verify
      ↓
Continue if legitimate
```

High-impact customer actions require stronger evidence and appropriate escalation.

---

## 12. Financial and Commerce Containment

Automated controls may temporarily restrict:

- reward redemption;
- coupon application;
- referral claims;
- high-risk checkout activity;
- wallet operations;
- refund processing;
- suspicious payment attempts;
- inventory reservations;
- account creation;
- subscription changes;
- and other value-dispensing operations.

Automated defence must not invent financial liabilities or permanently confiscate customer value without authorised policy and an appropriate recovery path.

---

## 13. Account and Identity Containment

Where compromise is suspected, controls may:

- revoke sessions;
- require re-authentication;
- require step-up verification;
- rotate credentials;
- suspend sensitive operations;
- revoke delegated capabilities;
- isolate suspicious devices;
- or temporarily suspend the account.

Identity recovery remains governed by the Identity and Authorisation architecture.

---

## 14. API and Service Containment

Automated defence may:

- throttle clients;
- revoke API credentials;
- disable compromised integrations;
- isolate services;
- reject malformed traffic;
- block confirmed malicious sources;
- reduce concurrency;
- or place an endpoint into protective mode.

Service-level containment must avoid unnecessarily taking unrelated services offline.

---

## 15. Infrastructure Containment

Infrastructure controls may include:

- network isolation;
- workload quarantine;
- firewall rule changes;
- egress blocking;
- credential rotation;
- secret revocation;
- workload shutdown;
- service isolation;
- or traffic diversion.

Containment must account for service continuity and dependency relationships.

---

## 16. AI Society Containment

AI Society controls may include:

- tool revocation;
- capability restriction;
- agent quarantine;
- prompt/context isolation;
- memory isolation;
- model failover;
- model disablement;
- action approval requirements;
- transaction limits;
- communication restrictions;
- and agent kill switches.

An AI agent must never be permitted to override its own containment state.

AI containment authority remains outside the agent being contained.

---

## 17. Intelligence Protection Containment

When intelligence extraction is suspected, the platform may:

- reduce response detail;
- throttle queries;
- restrict high-value endpoints;
- rotate exposed intelligence surfaces;
- require stronger authentication;
- quarantine suspicious consumers;
- or disable affected capabilities.

The objective is to reduce intelligence leakage while preserving legitimate service where possible.

---

## 18. Trust Engine Integration

The Trust Engine may provide risk context but does not independently execute arbitrary containment.

```text
Trust Signal
     ↓
Trust / Risk Assessment
     ↓
Policy
     ↓
Defensive Action
```

This preserves separation between trust assessment, authorisation, policy and enforcement.

---

## 19. Automated Response Safety Rails

Every automated containment capability should define:

- trigger conditions;
- permitted actions;
- prohibited actions;
- maximum scope;
- maximum duration;
- escalation threshold;
- rollback method;
- evidence requirements;
- human-approval requirements;
- and failure behaviour.

A security automation rule without safety rails is itself an operational risk.

---

## 20. Duration and Expiry

Temporary defensive states should have explicit expiry where possible.

```text
Suspicious Session
      ↓
Temporary Restriction
      ↓
Re-evaluate
      ↓
Release / Extend / Escalate
```

Permanent states require explicit governance.

---

## 21. Human Escalation

Automated defence must escalate when:

- confidence is insufficient;
- impact is high;
- evidence conflicts;
- containment is irreversible;
- legal implications exist;
- customer harm may be substantial;
- financial value is material;
- a critical service may be interrupted;
- or the system cannot safely determine the correct action.

Human-in-the-loop requirements remain authoritative.

---

## 22. Fail-Safe and Fail-Secure Behaviour

The correct failure mode depends on the capability.

Security-sensitive access may fail closed.

Critical commerce functionality may require controlled degraded operation.

Emergency safety functions may require fail-safe behaviour.

Essentials Mart shall therefore not impose one universal fail-closed rule. The failure mode must be explicitly defined per capability.

---

## 23. Automated Defence Loops

Automated defence must not create recursive behaviour.

```text
Detection
   ↓
Containment
   ↓
Containment triggers detection
   ↓
Containment again
   ↓
...
```

Defensive actions must be distinguishable from hostile activity where appropriate and must carry traceable action identifiers.

---

## 24. Anti-Automation Abuse

Attackers may deliberately trigger defensive systems to cause:

- customer lockouts;
- service degradation;
- infrastructure scaling;
- unnecessary investigations;
- alert floods;
- expensive containment actions;
- or cascading failures.

Automated defence must itself be protected against abuse.

---

## 25. Cost-Aware Defence

Containment actions may have economic consequences, including:

- autoscaling;
- external security services;
- model inference;
- SMS/WhatsApp verification;
- traffic inspection;
- storage;
- forensic processing;
- and external API calls.

Defensive automation should therefore have cost ceilings and escalation controls where relevant.

---

## 26. Dependency-Aware Containment

Before disabling a resource, the platform should understand material dependencies.

```text
Compromised Service A
       │
       ├── Customer Checkout
       ├── Inventory
       └── Delivery
```

The system should prefer isolation or controlled degradation where those approaches contain the threat without unnecessarily disabling unrelated capabilities.

---

## 27. Event-Driven Defensive Actions

Security containment may be triggered by governed security events.

```text
SuspiciousLoginDetected
        ↓
RiskAssessmentCompleted
        ↓
ContainmentPolicyMatched
        ↓
SessionRestricted
        ↓
SecurityActionRecorded
```

The resulting defensive action must itself be observable and attributable.

---

## 28. Action Identity and Traceability

Every automated defensive action must have a unique action identifier.

Where applicable, the record should include:

- actionId;
- triggering eventId;
- correlationId;
- causationId;
- policyId;
- detectionId;
- actor/system identity;
- target;
- scope;
- reason;
- confidence;
- timestamp;
- duration;
- result;
- rollback status;
- and escalation status.

---

## 29. Containment Verification

The platform must verify that the defensive action achieved its intended effect.

```text
Credential Revoked
       ↓
Verify Token Rejected
       ↓
Verify No New Session
       ↓
Containment Confirmed
```

A command to contain is not equivalent to successful containment.

---

## 30. Re-Evaluation

Containment should trigger continued assessment.

```text
Contain
  ↓
Observe
  ↓
Reassess
  ↓
Release / Escalate / Expand
```

This prevents temporary conditions from becoming permanent restrictions without evidence.

---

## 31. Controlled Recovery Boundary

Once the threat is controlled, recovery may include:

- restoring access;
- restoring services;
- restoring credentials;
- re-enabling integrations;
- rebuilding workloads;
- reintroducing AI capabilities;
- removing temporary controls;
- or maintaining restrictions pending investigation.

Commit 018 does not own the full incident-response or business-continuity process. Those responsibilities belong to Commit 019 and Commit 020.

---

## 32. Security Automation Testing

Automated containment must be tested for:

- correct triggering;
- false positives;
- false negatives;
- race conditions;
- concurrent actions;
- rollback;
- expired restrictions;
- dependency failures;
- control-plane compromise;
- action-loop behaviour;
- customer-impact scenarios;
- and attacker attempts to weaponise the defence mechanism.

---

## 33. Defensive Control-Plane Protection

The automated defence control plane is itself a critical asset.

It must be protected against:

- unauthorised policy changes;
- forged defensive actions;
- privilege escalation;
- action replay;
- credential theft;
- malicious rule creation;
- disabling of safeguards;
- and tampering with audit records.

An attacker who controls the defensive control plane may convert security automation into an offensive tool against the platform.

---

## 34. Emergency Override

Emergency controls may permit authorised security personnel to:

- expand containment;
- disable compromised automation;
- revoke global credentials;
- isolate infrastructure;
- suspend selected capabilities;
- or activate emergency operating modes.

Emergency override actions must be strongly authenticated, separately authorised and fully audited.

---

## 35. Platform-Wide Kill Switches

Platform-wide kill switches may exist for catastrophic scenarios, but they must not be the normal response mechanism.

They should have:

- restricted authority;
- strong authentication;
- explicit scope;
- documented activation conditions;
- safety review;
- auditability;
- and controlled recovery.

A kill switch that can be triggered by an ordinary application event is an unacceptable blast-radius design.

---

## 36. Privacy

Automated containment must use only information necessary for the security purpose.

Sensitive customer or behavioural information must not be broadly exposed merely because it could improve automated detection or containment.

Privacy and data-governance controls remain applicable during security response.

---

## 37. Third-Party and Partner Containment

The platform may temporarily restrict or disable external integrations when compromise is suspected.

Examples include:

- payment providers;
- delivery providers;
- mapping providers;
- messaging providers;
- AI providers;
- analytics services;
- supplier integrations;
- transport partners;
- and managed services.

Partner-neutral adapter boundaries must allow the affected provider to be isolated without requiring unrelated application domains to be redesigned.

---

## 38. Store and Warehouse Containment

Containment may operate at physical-operational boundaries.

Examples include:

- isolating a store device;
- restricting a warehouse workstation;
- suspending a compromised scanner;
- disabling a compromised operational integration;
- restricting suspicious stock operations;
- or isolating affected local network segments.

Physical operations should continue through approved degraded modes where possible.

---

## 39. Delivery and Walk Mode Containment

Security controls may restrict:

- suspicious delivery accounts;
- compromised driver devices;
- abnormal delivery API activity;
- Walk Mode sessions;
- suspicious location signals;
- or compromised navigation integrations.

Containment must preserve legitimate delivery and safety functions where possible.

---

## 40. Abuse and Commerce Containment

Automated controls may respond to:

- card testing;
- coupon abuse;
- reward farming;
- referral abuse;
- inventory hoarding;
- automated purchasing;
- refund abuse;
- account farms;
- subscription abuse;
- and suspicious wallet activity.

The action should target abusive behaviour rather than automatically penalising unrelated legitimate activity.

---

## 41. Automated Defence Laws

1. Detection does not automatically authorise containment.
2. Automated defence must operate under explicit policy.
3. Defensive actions must be proportional to risk.
4. Defensive actions should be reversible where possible.
5. High-impact irreversible actions require stronger authority.
6. Automated containment must preserve material evidence.
7. Containment scope must be limited to the necessary blast radius.
8. Automated defence must not become an uncontrolled authority layer.
9. Trust signals do not independently authorise enforcement.
10. AI agents cannot override their own containment.
11. Defensive automation must itself be protected against attack.
12. Automated actions must be attributable and observable.
13. Containment success must be verified.
14. Temporary restrictions should expire or be re-evaluated.
15. Automated defence must avoid recursive action loops.
16. Defensive controls must not become an easy target for denial-of-service or customer-harm attacks.
17. Financially consequential containment requires economic safeguards.
18. Dependency-aware containment must minimise collateral outages.
19. Emergency controls require elevated authority.
20. Recovery remains distinct from automated containment.
21. Privacy requirements remain applicable during security response.
22. Partner integrations must be isolatable without unnecessary architectural coupling.
23. Platform-wide kill switches are exceptional controls, not routine mechanisms.
24. Automated defence must be continuously tested.

---

## 42. Relationship With Part 4

Commit 018 establishes the automated enforcement layer within Part 4:

```text
017 — Detect
       ↓
018 — Contain
       ↓
019 — Respond
       ↓
020 — Recover / Maintain Continuity
       ↓
021 — Verify Defences
```

This preserves the progression from detection to controlled action, incident response, resilience and verification.

---

## 43. Architectural Outcome

Essentials Mart gains a governed automated defence capability capable of responding quickly to hostile activity without turning security automation into an uncontrolled source of authority or customer harm.

```text
Security Signal
      ↓
Detection
      ↓
Risk / Confidence
      ↓
Policy
      ↓
Authorised Defensive Action
      ↓
Containment
      ↓
Verification
      ↓
Reassessment
   ┌──┴───────────────┐
   ▼                  ▼
Release            Escalate
   │                  │
   ▼                  ▼
Normal State       Incident Response
```

> **Essentials Mart shall respond automatically where automation is safe, bounded and authorised, while preserving human authority for consequential decisions.**

---

## 44. Commit Record

```text
docs(eda): add automated defence and containment architecture

- Establish governed automated defensive response
- Define containment action classes
- Separate detection from enforcement
- Establish proportionality and confidence requirements
- Define reversible and irreversible action controls
- Establish blast-radius limits
- Protect customers from unnecessary automated harm
- Define financial and commerce containment
- Define account and identity containment
- Define API and service containment
- Define infrastructure containment
- Define AI Society containment
- Define intelligence extraction containment
- Integrate Trust Engine risk context without transferring enforcement authority
- Establish automated response safety rails
- Define containment duration and expiry
- Establish human escalation thresholds
- Define fail-safe and fail-secure behaviour by capability
- Prevent automated defence loops
- Protect defensive automation from abuse
- Establish cost-aware defensive controls
- Define dependency-aware containment
- Integrate governed security events with defensive actions
- Establish action identity and traceability
- Require containment verification
- Establish re-evaluation and controlled recovery boundary
- Define security automation testing
- Protect the defensive control plane
- Establish emergency override governance
- Define platform-wide kill-switch safeguards
- Preserve privacy during automated defence
- Define third-party and partner containment
- Cover store, warehouse, delivery and Walk Mode containment
- Establish commerce and abuse containment
- Define constitutional automated defence laws
```
