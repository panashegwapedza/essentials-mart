# EDA-001 Part 4 — Commit 021
# Adversarial Testing & Defensive Verification

**Document ID:** EDA-001-P4-C021  
**Title:** Adversarial Testing & Defensive Verification  
**Parent Architecture:** EDA-001 Part 4  
**Status:** Proposed  
**Commit:** 021  
**Canonical Path:** `docs/architecture/EDA/part-4/commits/021-adversarial-testing-defensive-verification.md`

---

## 1. Purpose

Commit 021 establishes the architecture by which the defensive controls established throughout EDA-001 Part 4 are continuously verified against realistic failure, misuse and adversarial conditions.

The principle is:

> **A defensive control is not considered effective merely because it exists. It must be demonstrated to work under controlled adverse conditions.**

Verification covers people, processes, applications, APIs, infrastructure, AI systems, data, external dependencies, operational controls and business workflows.

The objective is to discover weaknesses before hostile actors do, validate that existing controls operate as designed, measure the effectiveness of detection and response, and feed material findings back into architecture and implementation.

---

## 2. Verification Is a Continuous Capability

Adversarial testing is not a one-time penetration test.

Essentials Mart shall maintain a layered verification programme including:

- automated security testing;
- static analysis;
- dependency analysis;
- dynamic testing;
- fuzzing;
- vulnerability assessment;
- penetration testing;
- red-team exercises;
- purple-team exercises;
- adversary emulation;
- AI red teaming;
- business-logic abuse testing;
- resilience and recovery exercises;
- configuration validation;
- control effectiveness testing;
- and post-incident verification.

NIST identifies threat modelling, automated testing, static analysis, black-box testing, fuzzing, web application scanning and third-party component verification among useful software-verification techniques. citeturn0search2turn0search3

---

## 3. Testing Hierarchy

Testing should progress from lower-cost continuous checks to higher-cost adversarial exercises.

```text
Developer / CI Checks
        ↓
Automated Security Tests
        ↓
Dependency / Supply-Chain Checks
        ↓
Dynamic Application Testing
        ↓
Infrastructure Testing
        ↓
Business-Logic Testing
        ↓
AI Security Testing
        ↓
Penetration Testing
        ↓
Red / Purple Team Exercises
        ↓
Full Adversary Emulation
```

Higher-level exercises must be informed by findings from lower-level testing.

---

## 4. Threat-Informed Testing

Testing must be derived from the actual Essentials Mart threat model.

Testing should consider:

- external attackers;
- compromised accounts;
- malicious insiders;
- compromised suppliers;
- compromised software dependencies;
- compromised cloud services;
- compromised AI providers;
- malicious or manipulated AI inputs;
- abusive customers;
- fraudulent merchants or partners;
- automated bots;
- credential theft;
- supply-chain compromise;
- platform impersonation;
- intelligence extraction;
- economic abuse;
- and destructive attacks.

Testing must not become a checklist exercise disconnected from realistic attack paths.

---

## 5. Rules of Engagement

Every adversarial exercise must have defined rules of engagement.

The rules must establish:

- authorised scope;
- systems and environments in scope;
- prohibited systems;
- permitted techniques;
- prohibited techniques;
- testing windows;
- emergency contacts;
- stop conditions;
- data-handling requirements;
- evidence-handling requirements;
- production safeguards;
- customer-impact restrictions;
- and escalation procedures.

Red-team activity must be explicitly authorised.

NIST defines a red team as an authorised group organised to emulate an adversary in order to demonstrate impacts and improve defensive capability. citeturn0search4

---

## 6. Production Safety

Testing must not unnecessarily damage production systems or customer data.

Where production testing is justified, it must use:

- controlled scope;
- rate limits;
- synthetic accounts where possible;
- test payment instruments where possible;
- reversible actions;
- transaction ceilings;
- isolated test data;
- monitoring;
- and explicit abort conditions.

The existence of an adversarial test does not authorise uncontrolled damage.

---

## 7. Environment Strategy

Testing should occur across multiple environments.

### Development

Used for rapid automated verification and security regression testing.

### Staging

Used for integrated security testing, realistic workflows and controlled adversarial exercises.

### Production

Used only when the value of production verification justifies the risk and the exercise has explicit approval and safeguards.

### Isolated Adversarial Environment

Used for high-risk tests, destructive simulations, exploit research and AI attack experimentation.

---

## 8. Application Security Verification

Applications must be tested for:

- authentication bypass;
- authorisation bypass;
- session abuse;
- injection;
- insecure deserialisation;
- SSRF;
- client-side trust violations;
- unsafe file handling;
- information disclosure;
- business-logic abuse;
- race conditions;
- concurrency failures;
- insecure defaults;
- dependency vulnerabilities;
- and configuration weaknesses.

Testing must verify both individual vulnerabilities and chained attack paths.

---

## 9. API Security Verification

APIs must be tested for:

- object-level authorisation failures;
- function-level authorisation failures;
- excessive data exposure;
- rate-limit bypass;
- quota bypass;
- resource exhaustion;
- token abuse;
- replay;
- webhook forgery;
- schema manipulation;
- endpoint discovery;
- deprecated endpoint exposure;
- and unsafe third-party API behaviour.

API testing must include authenticated and unauthenticated attack paths.

---

## 10. Business-Logic Verification

Technical security controls cannot guarantee protection if business workflows can be manipulated.

Testing must therefore attempt to:

- redeem rewards repeatedly;
- bypass eligibility rules;
- exploit concurrent checkout;
- manipulate discounts;
- abuse subscriptions;
- hoard inventory;
- bypass delivery constraints;
- create fraudulent referrals;
- exploit refunds;
- manipulate payment state;
- exploit race conditions;
- and create unintended economic outcomes.

The goal is to test whether the platform preserves business truth under hostile sequencing.

---

## 11. Bot and Automation Verification

The anti-automation architecture must be tested against:

- credential stuffing;
- account creation farms;
- scraping;
- inventory hoarding;
- automated checkout;
- coupon farming;
- reward farming;
- API enumeration;
- distributed low-and-slow automation;
- and attempts to evade bot detection.

Testing must measure both detection effectiveness and false-positive impact on legitimate users.

---

## 12. Identity and Trust Verification

Testing must attempt to bypass:

- authentication;
- session controls;
- device trust;
- identity verification;
- privilege boundaries;
- step-up authentication;
- trust scoring;
- account recovery;
- and impersonation protections.

Tests must include compromised but otherwise valid identities.

A valid credential must not be treated as proof that every action performed with it is legitimate.

---

## 13. AI Security Verification

AI systems require specialised adversarial testing.

Testing must include:

- prompt injection;
- indirect prompt injection;
- malicious retrieved content;
- tool misuse;
- excessive agency;
- privilege escalation;
- data exfiltration;
- model extraction;
- system-prompt extraction;
- memory poisoning;
- RAG poisoning;
- agent-to-agent manipulation;
- unsafe recommendations;
- malicious tool outputs;
- model/provider substitution;
- and attempts to bypass AI authority boundaries.

NIST's adversarial-machine-learning taxonomy recognises red teaming as a mechanism for evaluating model and system behaviour under adversarial conditions. citeturn0search26

AI testing must extend beyond prompts and evaluate the AI system as embedded within the larger application and operational environment.

---

## 14. AI Society Verification

The AI Society must be tested as a coordinated system.

Testing must examine whether one agent can:

- impersonate another agent;
- escalate authority;
- bypass approval;
- inject false information;
- create circular action chains;
- manipulate another agent;
- trigger excessive downstream actions;
- exfiltrate restricted information;
- or cause an economic side effect beyond its authority.

Agent-to-agent trust must therefore be explicitly tested rather than assumed.

---

## 15. Intelligence Extraction Verification

Testing must attempt to extract or reconstruct proprietary intelligence through:

- repeated API queries;
- output sampling;
- differential probing;
- ranking observation;
- recommendation probing;
- pricing probing;
- route optimisation probing;
- behavioural inference;
- model distillation attempts;
- and high-volume automated interaction.

The objective is to verify that the intelligence-protection controls in Commit 011 actually increase the cost and reduce the feasibility of extraction.

---

## 16. Data Security Verification

Testing must attempt to access or manipulate:

- customer data;
- payment-related data;
- supplier information;
- employee information;
- AI memory;
- vector stores;
- analytics data;
- event histories;
- backups;
- logs;
- secrets;
- and restricted intelligence.

Verification must include attempts to cross tenant, store, regional and organisational boundaries.

---

## 17. Infrastructure Verification

Infrastructure testing must include:

- network segmentation bypass;
- lateral movement;
- privilege escalation;
- exposed management interfaces;
- credential compromise;
- container escape where relevant;
- cloud control-plane abuse;
- storage exposure;
- database exposure;
- broker compromise;
- DNS manipulation;
- egress bypass;
- and denial-of-service conditions.

CISA red-team assessments demonstrate the value of testing not only perimeter controls but also lateral movement, persistence and the ability of defenders to detect and respond to realistic adversarial activity. citeturn0search25

---

## 18. Supply-Chain Verification

Third-party dependencies must be tested through:

- dependency scanning;
- software composition analysis;
- package integrity checks;
- artifact provenance verification;
- dependency substitution tests;
- compromised-provider scenarios;
- malicious update scenarios;
- credential compromise scenarios;
- and provider outage simulations.

The architecture must verify that the compromise of one supplier, library, cloud service, AI provider, API provider or managed service does not automatically compromise the entire platform.

---

## 19. External Partner Verification

Partner integrations must be tested for:

- forged callbacks;
- fake payment confirmations;
- replayed delivery updates;
- malicious catalogue data;
- partner credential theft;
- excessive partner privileges;
- malicious deep links;
- impersonated partner services;
- and partner-originated data poisoning.

Testing must confirm that partner trust is scoped and revocable.

---

## 20. Payment and Economic Verification

Payment and economic flows must be tested using controlled test instruments and synthetic accounts where possible.

Tests include:

- duplicate payment attempts;
- replayed payment confirmations;
- refund abuse;
- coupon stacking;
- reward duplication;
- wallet manipulation;
- subscription abuse;
- chargeback scenarios;
- and inconsistent payment/order state.

No adversarial exercise should create uncontrolled real financial liability.

---

## 21. Delivery and Operational Verification

Testing must include:

- route manipulation;
- false delivery completion;
- driver/operator impersonation;
- dispatch abuse;
- vehicle/resource exhaustion;
- scheduled transport disruption;
- provider substitution;
- warehouse outage;
- and stale inventory/delivery state.

Subscription delivery, normal checkout delivery, express delivery and shared/scheduled delivery must all remain independently testable while using the shared defensive architecture.

---

## 22. Walk Mode Verification

Walk Mode must be tested for:

- location spoofing;
- route manipulation;
- product recognition manipulation;
- malicious store data;
- unsafe autonomous recommendations;
- AI authority escalation;
- basket manipulation;
- navigation abuse;
- and takeover failures.

Manual, AI Assisted and Autopilot modes must each be tested according to their different authority levels.

---

## 23. Resilience Verification

Adversarial testing must deliberately trigger controlled failures such as:

- service outages;
- database failure;
- broker failure;
- provider failure;
- regional failure;
- network partition;
- AI provider outage;
- payment provider outage;
- delivery provider outage;
- observability degradation;
- and partial infrastructure compromise.

The objective is to verify Commit 020 rather than merely confirm that failover exists on paper.

---

## 24. Detection Verification

Every material adversarial exercise should answer:

- Was the attack detected?
- How quickly?
- Which control detected it?
- Was the detection accurate?
- Was the alert actionable?
- Did automated containment trigger correctly?
- Did the incident-response process activate correctly?
- Was evidence preserved?
- Could the attacker evade detection?

CISA recommends recurring testing and exercises to verify that monitoring, hardening and response processes remain effective. citeturn0search25

---

## 25. Containment Verification

Tests must verify that Commit 018 can contain an attack without creating disproportionate collateral damage.

For each automated defensive action, testing should establish:

- trigger conditions;
- scope;
- action;
- expiry;
- reversibility;
- evidence captured;
- escalation path;
- and recovery behaviour.

---

## 26. Incident-Response Verification

Adversarial exercises must validate Commit 019.

Testing must determine whether the organisation can:

1. recognise an incident;
2. declare it correctly;
3. assign ownership;
4. investigate;
5. preserve evidence;
6. contain it;
7. eradicate the cause;
8. recover safely;
9. communicate appropriately;
10. and learn from the event.

A technically successful attack can therefore be valuable even when no permanent compromise occurs because it may expose process weaknesses.

---

## 27. Purple-Team Verification

Purple-team exercises should connect attackers and defenders during controlled exercises.

The objective is to improve:

- detection rules;
- telemetry;
- response playbooks;
- containment controls;
- investigation procedures;
- and defensive understanding.

Red-team findings must become defensive engineering inputs rather than merely reports.

---

## 28. Security Regression Testing

Every material security defect must produce a regression test where practical.

```text
Finding
  ↓
Fix
  ↓
Regression Test
  ↓
CI / Security Suite
  ↓
Future Protection
```

This prevents the same vulnerability class from silently returning.

NIST recommends historical test cases and automated verification as part of software verification. citeturn0search2

---

## 29. Verification of Defensive Assumptions

Testing must challenge architectural assumptions.

Examples:

```text
"This API cannot be called without authentication."
        ↓
Test it.
```

```text
"This agent cannot access payment authority."
        ↓
Test it.
```

```text
"This region can operate independently."
        ↓
Simulate regional isolation.
```

```text
"This provider can be replaced."
        ↓
Exercise provider failover.
```

Architecture statements become requirements for verification.

---

## 30. Finding Classification

Findings must be classified according to:

- severity;
- exploitability;
- business impact;
- affected users;
- affected stores/regions;
- data exposure;
- economic exposure;
- intelligence exposure;
- detectability;
- persistence;
- and recovery complexity.

Critical findings must have explicit remediation ownership.

---

## 31. Findings Must Not Disappear

Every material finding must have a lifecycle:

```text
Discovered
   ↓
Recorded
   ↓
Triaged
   ↓
Assigned
   ↓
Remediated
   ↓
Retested
   ↓
Verified
   ↓
Closed
```

A finding must not be considered resolved merely because a developer reports that code was changed.

---

## 32. Exception Governance

If a finding cannot immediately be fixed, the exception must document:

- reason;
- affected capability;
- risk;
- compensating controls;
- owner;
- expiry date;
- review date;
- and acceptance authority.

Exceptions must not become permanent undocumented weaknesses.

---

## 33. Independent Verification

Material security areas should periodically receive independent review.

Independent testing may include:

- external penetration testing;
- specialist AI red teaming;
- cloud-security assessment;
- supply-chain assessment;
- privacy/security assessment;
- and independent architecture review.

Independence should increase where the potential impact of failure increases.

---

## 34. Adversarial Test Frequency

Testing frequency must be risk-based.

High-risk systems should receive continuous automated verification and recurring adversarial exercises.

Material architectural changes should trigger targeted security verification rather than waiting for a scheduled test.

CISA guidance for critical infrastructure recommends recurring adversary-emulation exercises and confirmation that identified vulnerabilities are remediated through subsequent testing. citeturn0search24

---

## 35. Change-Triggered Testing

Testing must be triggered by material changes including:

- new payment providers;
- new AI models;
- new AI providers;
- new APIs;
- new cloud providers;
- new delivery providers;
- new mapping providers;
- new authentication mechanisms;
- new data stores;
- new event infrastructure;
- new Walk Mode capabilities;
- major subscription changes;
- major routing changes;
- and new externally exposed services.

This ensures architectural change does not silently invalidate previous security assumptions.

---

## 36. Security Verification of Development Tools

Development environments and tools must also be tested.

This includes:

- CI/CD systems;
- source repositories;
- build runners;
- package managers;
- artifact registries;
- deployment systems;
- developer credentials;
- secrets management;
- and developer workstations where material access exists.

A secure production system can still be compromised through an insecure build pipeline.

---

## 37. Verification Metrics

The programme should measure:

- vulnerabilities discovered;
- critical findings;
- mean time to remediate;
- mean time to verify remediation;
- attack-path coverage;
- detection rate;
- detection latency;
- containment success;
- false-positive rate;
- false-negative discoveries;
- regression rate;
- red-team objectives achieved;
- recovery success;
- and unresolved risk.

Metrics must measure defensive capability rather than merely the number of tests performed.

---

## 38. Coverage Model

Essentials Mart should maintain a coverage map connecting:

```text
Threat
  ↓
Attack Path
  ↓
Preventive Control
  ↓
Detection
  ↓
Containment
  ↓
Incident Response
  ↓
Recovery
  ↓
Verification Test
```

A material threat without a corresponding verification method represents a coverage gap.

---

## 39. Security Control Verification

Controls from Commit 001 through Commit 020 must be testable.

Examples:

- Commit 009 → network isolation test;
- Commit 010 → AI security test;
- Commit 011 → intelligence extraction test;
- Commit 012 → data-access/exfiltration test;
- Commit 013 → economic-abuse test;
- Commit 014 → API boundary test;
- Commit 015 → trust manipulation test;
- Commit 016 → impersonation test;
- Commit 017 → detection exercise;
- Commit 018 → containment exercise;
- Commit 019 → incident-response exercise;
- Commit 020 → resilience/recovery exercise.

This turns Part 4 into a verifiable architecture rather than a collection of statements.

---

## 40. Safe Testing of Irreversible Actions

Testing must never use real irreversible customer consequences where a safe simulation can validate the same control.

Examples:

```text
Real payment
   ✗
Synthetic payment
   ✓
```

```text
Real customer suspension
   ✗
Test account suspension
   ✓
```

```text
Real destructive deletion
   ✗
Controlled test dataset
   ✓
```

Where production verification is necessary, safeguards must be explicit.

---

## 41. Adversarial Verification of External Dependencies

Every material external dependency should have a failure and compromise scenario.

This includes:

- software libraries;
- cloud providers;
- AI models;
- AI providers;
- APIs;
- payment providers;
- WhatsApp;
- mapping providers;
- delivery providers;
- analytics services;
- infrastructure providers;
- development tools;
- contractors;
- and managed services.

Testing must verify both substitution and containment where technically and commercially feasible.

---

## 42. Verification of Provider-Neutrality

Where the architecture claims provider neutrality, testing must verify that the abstraction is real.

For example:

```text
Provider A
   ↓
Standard Capability Contract
   ↓
Essentials Mart
   ↓
Provider B
```

A provider-neutral design that cannot actually switch providers under controlled conditions is not considered fully verified.

---

## 43. Security Testing of Offline and Limited-Connectivity Modes

Limited-connectivity workflows must be tested for:

- stale authorization;
- replay;
- delayed events;
- duplicate operations;
- local data exposure;
- synchronisation conflicts;
- malicious queued actions;
- and privilege persistence during disconnection.

WhatsApp and other externally mediated workflows must also be tested against message replay, identity confusion and malicious content.

---

## 44. Test Evidence

Material tests must produce sufficient evidence to establish:

- what was tested;
- when it was tested;
- who or what performed the test;
- scope;
- methodology;
- result;
- evidence;
- affected controls;
- findings;
- remediation;
- and retest outcome.

Evidence must itself be protected from unauthorised alteration.

---

## 45. Confidentiality of Adversarial Findings

Security findings may reveal exploitable weaknesses and therefore require appropriate classification.

Access must be limited according to:

- sensitivity;
- exploitation risk;
- business impact;
- and need-to-know.

Public disclosure must be governed.

---

## 46. No Security Through Test Secrecy

The architecture must not rely on attackers being unaware that a control exists.

The objective is to demonstrate that controls remain effective even when adversaries understand the general defensive model.

Testing therefore emphasises bypass resistance rather than obscurity alone.

---

## 47. Adversarial Learning Loop

The defensive system must learn from tests.

```text
Adversarial Test
      ↓
Finding
      ↓
Remediation
      ↓
Detection / Containment Improvement
      ↓
Regression Test
      ↓
Architecture Update
      ↓
Future Adversarial Test
```

This creates a measurable security-improvement loop.

---

## 48. Relationship With Incident Response

Adversarial testing must not be treated as an isolated security exercise.

Exercises should validate whether the incident-response architecture can operate when an attack is simulated.

The test should therefore measure:

```text
Attack
 ↓
Detection
 ↓
Containment
 ↓
Incident Command
 ↓
Investigation
 ↓
Recovery
```

This directly verifies Commit 019.

---

## 49. Relationship With Resilience

Adversarial exercises should sometimes continue after initial compromise to test whether resilience controls prevent catastrophic impact.

Examples include:

- simulated regional compromise;
- compromised service provider;
- unavailable AI provider;
- unavailable payment provider;
- compromised store infrastructure;
- event-broker disruption;
- and degraded observability.

This directly verifies Commit 020.

---

## 50. Constitutional Testing Laws

EDA-001 Part 4 Commit 021 establishes the following laws:

1. Security controls must be verified rather than assumed.
2. Adversarial testing must be authorised and governed.
3. Testing must be threat-informed.
4. Testing must protect production and customer interests.
5. Testing must include technical and business-logic attack paths.
6. APIs must be tested as externally and internally exposed boundaries.
7. AI must be tested as both a model and an integrated system.
8. AI Society interactions must be adversarially tested.
9. Intelligence extraction must be tested.
10. Economic abuse must be tested.
11. Identity and trust assumptions must be challenged.
12. External dependencies must be tested for compromise and failure.
13. Provider neutrality must be verified where claimed.
14. Detection must be measured during adversarial exercises.
15. Automated containment must be exercised.
16. Incident-response procedures must be exercised.
17. Resilience and recovery must be exercised.
18. Material findings must have owners and remediation paths.
19. Remediation must be independently verified where appropriate.
20. Security findings must not disappear without disposition.
21. Exceptions must be time-bounded and governed.
22. Security regressions must produce durable tests where practical.
23. Material architectural changes must trigger targeted verification.
24. Test evidence must be protected.
25. Testing must continuously improve the defensive architecture.

---

## 51. Architectural Outcome

Commit 021 converts the defensive architecture from a static set of controls into a continuously challenged and verified system.

The resulting model is:

```text
                    THREAT MODEL
                         │
                         ▼
                 DEFENSIVE CONTROLS
                         │
                         ▼
                  CONTINUOUS TESTING
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       ATTACK         FAILURE        MISUSE
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                     DETECTION
                         │
                         ▼
                    CONTAINMENT
                         │
                         ▼
                  INCIDENT RESPONSE
                         │
                         ▼
                     RECOVERY
                         │
                         ▼
                  VERIFICATION
                         │
                         ▼
                ARCHITECTURE IMPROVES
```

The objective is not to claim that Essentials Mart can never be compromised.

The objective is to ensure that the platform continuously demonstrates that its preventive, detective, containment, response and resilience controls work, exposes weaknesses before hostile actors can exploit them, and turns material findings into permanent improvements.

---

## Commit 021

```text
docs(eda): add adversarial testing and defensive verification architecture

- Establish continuous adversarial security verification
- Define layered security testing and verification hierarchy
- Establish threat-informed testing requirements
- Define rules of engagement and production safety
- Establish application and API security verification
- Define business-logic abuse testing
- Establish bot and automation verification
- Define identity and trust verification
- Establish AI and AI Society adversarial testing
- Define intelligence extraction verification
- Establish data and infrastructure security testing
- Define supply-chain and external dependency verification
- Establish payment, commerce and delivery testing
- Define Walk Mode adversarial verification
- Establish detection, containment and incident-response exercises
- Define resilience and recovery verification
- Establish red-team and purple-team requirements
- Define security regression testing
- Establish change-triggered security verification
- Define findings, exceptions and remediation verification
- Establish provider-neutrality verification
- Define test evidence and confidentiality requirements
- Establish continuous adversarial learning loops
- Establish constitutional testing laws
