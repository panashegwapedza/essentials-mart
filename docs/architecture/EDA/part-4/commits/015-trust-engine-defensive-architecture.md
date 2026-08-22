# Commit 015 — Trust Engine Defensive Architecture

**Document:** EDA-001 Part 4 — Defensive Engineering & Security Architecture  
**Commit:** 015  
**Title:** Trust Engine Defensive Architecture  
**Status:** Architecture Commit  
**Parent:** EDA-001 Part 4  

## 1. Purpose

Commit 015 establishes the defensive architecture for the Essentials Mart Trust Engine. The Trust Engine evaluates security, fraud, abuse and behavioural risk signals and produces governed trust assessments that may influence controls, review, escalation and access decisions.

The Trust Engine is a risk signal and decision-support capability. A trust assessment is not automatically a statement of truth about a person, account, device, supplier, partner, employee, AI agent or transaction.

## 2. Core Principle

> Trust must be continuously evaluated from evidence and context; it must never be granted permanently merely because an identity, device, network, partner or previous interaction was once trusted.

This follows the zero-trust principle that access should not be implicitly trusted based on network location, ownership or prior status, with access decisions evaluated using current context. citeturn0search1turn0search3

## 3. Trust Subjects

The Trust Engine may evaluate:

- customers;
- household accounts;
- employees;
- administrators;
- suppliers;
- delivery personnel;
- external partners;
- devices;
- sessions;
- service identities;
- AI agents;
- transactions;
- orders;
- payments;
- rewards;
- subscriptions;
- delivery jobs;
- API clients;
- external integrations.

Trust must be scoped to the subject and purpose. Trust in one context must not automatically transfer to another.

## 4. Evidence-Based Trust

Trust assessments may use governed signals such as:

- authentication results;
- device posture;
- session behaviour;
- transaction history;
- payment signals;
- account changes;
- reward activity;
- return behaviour;
- delivery behaviour;
- API behaviour;
- bot indicators;
- security events;
- fraud indicators;
- AI activity;
- partner behaviour;
- geographic and contextual signals where lawful and necessary.

Signals must have provenance and appropriate confidence information.

## 5. No Single-Signal Determination

The Trust Engine should avoid treating one weak or ambiguous signal as conclusive evidence of malicious behaviour.

Material decisions should consider multiple relevant signals, context, confidence and the consequences of action.

## 6. Continuous Reassessment

Trust is dynamic.

```text
Initial Assessment
       ↓
Observe
       ↓
Evaluate New Evidence
       ↓
Recalculate Risk / Trust
       ↓
Allow / Challenge / Restrict / Escalate
       ↓
Continue Monitoring
```

Post-deployment monitoring is important for trustworthy AI and security systems because real-world conditions can produce unexpected behaviour and consequences. citeturn0search2turn0search4

## 7. Trust Is Not Authority

A high trust assessment does not grant unrestricted authority.

A low trust assessment does not automatically prove wrongdoing.

Trust evaluation remains separate from:

- authentication;
- authorisation;
- business ownership;
- financial authority;
- AI capability authority;
- legal identity.

The final action must be determined by the relevant policy and authority boundary.

## 8. Risk-Based Access

Where Trust Engine output contributes to access control, it must be combined with:

- identity;
- role;
- resource sensitivity;
- device state;
- session context;
- policy;
- location where appropriate;
- current behavioural evidence.

Zero-trust architectures use contextual and risk-based assessment rather than relying on a static perimeter. citeturn0search5turn0search10

## 9. Trust Levels

The implementation may use a continuous score, categorical levels or another governed representation.

Conceptually:

```text
Trusted / Low Risk
       ↓
Normal Monitoring

Elevated Risk
       ↓
Additional Verification / Restrictions

High Risk
       ↓
Containment / Review / Restricted Capability

Critical Risk
       ↓
Immediate Protective Controls
```

The numerical representation must not be treated as a universal truth or exposed unnecessarily.

## 10. False Positives and False Negatives

The Trust Engine must explicitly account for:

- false positives;
- false negatives;
- incomplete evidence;
- stale evidence;
- conflicting signals;
- model uncertainty;
- behavioural changes;
- legitimate unusual activity.

High-impact actions should have proportionate safeguards and, where appropriate, human review.

## 11. Customer Protection

Trust controls must protect legitimate customers from:

- account takeover;
- payment fraud;
- reward abuse;
- subscription abuse;
- delivery fraud;
- impersonation;
- malicious automation.

Controls must also minimise unnecessary customer friction.

## 12. Human Review

Material adverse actions may require human review depending on policy and impact.

Examples include:

- account suspension;
- significant financial restriction;
- permanent reward restriction;
- supplier termination;
- employee investigation;
- consequential AI restriction.

The Trust Engine must provide sufficient evidence and provenance for authorised reviewers to understand why a decision was recommended.

## 13. Privacy

Trust signals must be:

- purpose-limited;
- minimised;
- access-controlled;
- retained according to policy;
- protected from unnecessary secondary use.

Sensitive behavioural information must not become an uncontrolled surveillance mechanism.

## 14. Explainability and Traceability

Material trust assessments should be traceable to:

- assessment identifier;
- subject;
- relevant evidence;
- signal provenance;
- assessment time;
- model/rule version;
- policy version;
- resulting recommendation;
- resulting action where applicable.

## 15. AI and Trust

AI may assist Trust Engine analysis, but AI output must remain subject to governance.

AI must not silently convert uncertain signals into facts.

AI-generated risk assessments must be attributable to:

- model/version;
- input context;
- applicable policy;
- confidence/uncertainty where supported;
- decision pathway.

NIST's AI risk-management guidance emphasises govern, map, measure and manage functions for trustworthy AI risk management. citeturn0search13turn0search15

## 16. Trust Engine Security

The Trust Engine itself is a high-value security target.

It must be protected against:

- signal poisoning;
- forged events;
- replayed evidence;
- manipulated behavioural history;
- model manipulation;
- rule tampering;
- insider abuse;
- privilege escalation;
- data exfiltration;
- denial of service;
- adversarial inputs.

## 17. Trust Signal Provenance

Signals must be attributable to trusted sources.

```text
Source Event
     ↓
Authenticated Producer
     ↓
Validated Signal
     ↓
Trust Assessment
```

Untrusted or unverifiable evidence must not be silently treated as authoritative.

## 18. Event Integration

The Trust Engine may consume governed events from:

- identity;
- commerce;
- payments;
- rewards;
- delivery;
- inventory;
- security;
- AI Society;
- API infrastructure;
- partner integrations.

Consumption does not transfer ownership of the underlying domain data.

## 19. Adaptive Controls

Trust outcomes may trigger controlled responses such as:

- additional authentication;
- step-up verification;
- rate reduction;
- capability restriction;
- transaction review;
- temporary quarantine;
- human escalation;
- session termination;
- account protection;
- partner isolation.

Controls must be proportionate to assessed risk.

## 20. AI Agent Trust

AI agents are distinct security subjects.

Each agent must have:

- an identity;
- defined capabilities;
- authorised tools;
- bounded resources;
- observable actions;
- trust context.

An agent must not inherit unrestricted trust from the user, another agent, a service or a network.

## 21. Trust and Walk Mode

Walk Mode may generate contextual signals, but location and behavioural signals must remain purpose-bound.

Trust controls must not silently turn Walk Mode into unrestricted surveillance.

## 22. Trust and External Partners

Partners must be assessed independently.

A trusted partner does not receive permanent unrestricted access.

Partner trust may depend on:

- authenticated identity;
- contractual scope;
- API behaviour;
- security posture;
- incident history;
- current behaviour;
- data-access requirements.

## 23. Trust Decay

Where appropriate, trust assertions should expire or decay over time.

Examples include:

- session trust;
- device posture;
- partner credentials;
- temporary elevated access;
- behavioural assessments.

This prevents stale evidence from becoming permanent authority.

## 24. Trust Overrides

Authorised human or policy-based overrides may exist for exceptional cases.

Overrides must be:

- explicitly authorised;
- time-bounded where possible;
- auditable;
- attributable;
- reviewable.

## 25. Trust Engine Availability

Failure of the Trust Engine must not automatically create an unsafe fail-open condition.

Critical capabilities should have defined fallback policies such as:

- deny;
- step-up verification;
- limited capability;
- queued review;
- controlled degraded operation.

The appropriate response depends on the business and security impact of the requested action.

## 26. Trust Engine Observability

The system should monitor:

- assessment volume;
- assessment latency;
- signal quality;
- score distributions;
- false-positive indicators;
- false-negative indicators;
- rule/model changes;
- override frequency;
- anomalous trust changes;
- suspicious signal sources;
- trust-engine availability.

## 27. Trust Manipulation Detection

The architecture must detect attempts to deliberately manipulate trust assessments.

Examples:

```text
Repeated benign activity
        ↓
Artificial trust inflation
```

```text
Forged events
        ↓
False risk reduction
```

```text
Distributed low-volume abuse
        ↓
Avoid detection thresholds
```

The Trust Engine should therefore evaluate patterns rather than relying exclusively on isolated thresholds.

## 28. Separation of Risk and Punishment

The Trust Engine identifies risk.

It does not independently determine punishment, legal guilt or moral character.

Where a consequence is required, the responsible policy or authority layer must determine the appropriate action.

## 29. Governance

Trust Engine governance must cover:

- signal definitions;
- scoring/risk models;
- thresholds;
- model versions;
- rule versions;
- data sources;
- retention;
- access;
- review procedures;
- override procedures;
- testing;
- monitoring;
- retirement.

## 30. Architectural Laws

1. Trust is contextual.
2. Trust is continuously reassessed where required.
3. Trust is evidence-based.
4. Trust is not identity.
5. Trust is not authorisation.
6. Trust is not ownership.
7. Trust is not proof of guilt.
8. Trust assessments must have provenance.
9. Weak signals must not automatically become facts.
10. High-impact decisions require proportionate safeguards.
11. Trust signals must be privacy-aware.
12. AI-generated trust assessments must remain governed.
13. AI agents require their own trust context.
14. External partners require independent trust assessment.
15. Trust assertions should expire or decay where appropriate.
16. Overrides must be attributable and auditable.
17. Trust Engine failure must not create uncontrolled fail-open behaviour.
18. The Trust Engine itself must be protected from manipulation.
19. Trust decisions must be observable and traceable.
20. Trust controls must remain proportionate to risk.

## 31. Architectural Outcome

Commit 015 establishes the Trust Engine as a **continuous, evidence-based, context-aware security capability** that informs protective controls without becoming an unquestionable authority.

The resulting model is:

```text
Evidence
   ↓
Validated Signals
   ↓
Trust Assessment
   ↓
Policy / Authority Evaluation
   ↓
Protective Response
   ↓
Continuous Monitoring
   ↓
New Evidence
```

This allows Essentials Mart to protect customers, staff, partners, AI agents, transactions and infrastructure while avoiding the dangerous assumption that trust is permanent or that a risk score is itself the final truth.
