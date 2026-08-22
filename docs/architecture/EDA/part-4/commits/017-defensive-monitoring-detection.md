# EDA-001 Part 4 — Commit 017

## Defensive Monitoring & Detection

**Status:** Proposed  
**Part:** EDA-001 Part 4  
**Parent Architecture:** EDA-001  
**Depends On:** Commits 001–016; EDA-001 Part 3 monitoring, observability, identity, AI, data, infrastructure and incident-response architecture  
**Primary Boundary:** Detect hostile, anomalous, degraded, manipulated or policy-violating behaviour across the Essentials Mart platform without confusing observation with response authority.

---

## 1. Purpose

Commit 017 establishes the defensive monitoring and detection architecture for Essentials Mart.

The objective is to ensure that the platform can continuously determine:

- what is happening;
- what is abnormal;
- what security controls are failing or being bypassed;
- whether an observed condition is likely malicious, accidental or operational;
- what evidence supports the assessment;
- what confidence exists in the detection;
- and which authorised response layer should receive the signal.

This commit does **not** redefine incident response or automated containment. Those capabilities are addressed by later commits.

The architectural progression is:

```text
Telemetry
   ↓
Collection
   ↓
Normalisation
   ↓
Correlation
   ↓
Detection
   ↓
Evidence / Signal
   ↓
Risk & Context
   ↓
Authorised Response Layer
```

Monitoring observes. Detection interprets. Response acts.

---

## 2. Continuous Defensive Visibility

Essentials Mart shall maintain monitoring sufficient to support risk-informed defensive decisions across:

- clients;
- APIs;
- services;
- identity systems;
- infrastructure;
- networks;
- databases;
- queues and event streams;
- AI systems;
- Trust Engine signals;
- commerce workflows;
- payments;
- rewards;
- subscriptions;
- delivery;
- external integrations;
- administrative activity;
- development and deployment systems.

Continuous monitoring does not mean every signal must be inspected at the same frequency. Monitoring frequency and depth shall reflect risk, value, sensitivity and operational impact. NIST describes continuous monitoring as maintaining ongoing awareness sufficient to support risk decisions and verify the effectiveness of security controls. citeturn0search0turn0search7

---

## 3. Monitoring Is Not Surveillance by Default

Monitoring must be proportionate to purpose.

The platform shall avoid collecting or retaining information merely because it is technically observable.

Monitoring design must consider:

- purpose limitation;
- data minimisation;
- privacy;
- retention;
- access control;
- sensitivity;
- legal requirements;
- customer expectations;
- employee protections;
- and regional requirements.

Security telemetry must not become an unrestricted behavioural surveillance system.

---

## 4. Detection Domains

The detection architecture shall cover multiple complementary domains.

### 4.1 Identity Detection

Detect:

- unusual authentication;
- impossible or implausible access patterns;
- credential abuse;
- MFA anomalies;
- session hijacking indicators;
- privilege escalation;
- dormant-account activity;
- suspicious administrative behaviour.

### 4.2 API and Service Detection

Detect:

- unusual request rates;
- enumeration;
- abnormal endpoint sequences;
- token misuse;
- excessive resource consumption;
- unusual error patterns;
- SSRF indicators;
- webhook abuse;
- service-to-service anomalies;
- unexpected dependency behaviour.

### 4.3 Application Detection

Detect:

- exploit attempts;
- malicious payloads;
- abnormal application states;
- tampering;
- suspicious client behaviour;
- unexpected code paths;
- integrity failures.

### 4.4 Infrastructure Detection

Detect:

- lateral movement;
- privilege escalation;
- unusual process execution;
- suspicious network traffic;
- unexpected administrative activity;
- configuration changes;
- persistence mechanisms;
- resource exhaustion;
- workload anomalies.

### 4.5 Data Detection

Detect:

- unusual data access;
- bulk extraction;
- abnormal exports;
- sensitive-data access anomalies;
- integrity violations;
- unexpected replication;
- suspicious data movement.

### 4.6 AI Detection

Detect:

- prompt injection patterns;
- tool misuse;
- anomalous agent behaviour;
- excessive tool calls;
- unexpected agent-to-agent activity;
- model abuse;
- extraction attempts;
- unusual output patterns;
- memory manipulation;
- AI authority boundary violations.

### 4.7 Commerce Detection

Detect:

- coupon abuse;
- reward farming;
- card testing;
- refund abuse;
- inventory hoarding;
- fake-account economics;
- subscription manipulation;
- payment anomalies;
- automated purchasing;
- suspicious value transfer.

### 4.8 Trust Detection

Detect:

- trust-signal manipulation;
- inconsistent evidence;
- forged signals;
- sudden trust changes;
- abnormal account relationships;
- attempts to influence Trust Engine inputs.

### 4.9 Supply-Chain Detection

Detect:

- dependency changes;
- unexpected build artefacts;
- compromised packages;
- signing anomalies;
- unusual CI/CD behaviour;
- suspicious developer activity;
- unexpected third-party traffic.

---

## 5. Telemetry Sources

Detection shall use multiple telemetry sources where appropriate.

Examples include:

- application logs;
- API access logs;
- authentication logs;
- authorisation decisions;
- network telemetry;
- DNS telemetry;
- endpoint telemetry;
- infrastructure events;
- cloud control-plane events;
- database audit records;
- event streams;
- payment events;
- commerce events;
- AI decision and tool records;
- Trust Engine signals;
- deployment events;
- configuration changes;
- security-control status;
- customer reports;
- staff reports;
- partner signals.

CISA guidance on detecting living-off-the-land activity similarly emphasises broad, detailed logging and centralised collection so defenders can correlate activity across sources rather than relying on isolated alerts. citeturn0search24

---

## 6. Centralised Security Telemetry

Security-relevant telemetry should be aggregated into appropriately protected monitoring infrastructure.

Centralisation supports:

- correlation;
- historical investigation;
- anomaly detection;
- threat hunting;
- incident reconstruction;
- detection tuning;
- control validation.

Security telemetry must itself be protected against:

- deletion;
- alteration;
- suppression;
- unauthorised access;
- flooding;
- poisoning;
- and premature retention expiry.

Where appropriate, logs shall be stored out-of-band from the systems being monitored so a compromised workload cannot simply erase the evidence needed to investigate it. CISA specifically recommends centralised, protected logging to support behaviour analytics, anomaly detection and proactive hunting. citeturn0search24

---

## 7. Event Normalisation

Telemetry from different systems must be normalised sufficiently for correlation.

Common fields should include, where applicable:

- timestamp;
- actor;
- subject;
- source;
- destination;
- action;
- outcome;
- resource;
- tenant;
- organisation;
- store;
- region;
- device;
- session;
- correlation ID;
- causation ID;
- trace ID;
- event ID;
- classification.

Normalisation must preserve original evidence rather than destroying source-specific information.

---

## 8. Correlation

Individual signals may be insufficient to determine an attack.

The platform shall therefore support correlation across:

```text
Identity
   +
Device
   +
Network
   +
API
   +
Application
   +
Commerce
   +
AI
   +
Infrastructure
   ↓
Correlated Detection
```

Example:

```text
Unusual login
      ↓
New device
      ↓
High API enumeration
      ↓
Coupon probing
      ↓
Rapid checkout attempts
      ↓
Elevated confidence of coordinated abuse
```

Correlation should increase context rather than automatically increase punishment.

---

## 9. Baselines

The platform may establish baselines for expected behaviour.

Baselines may include:

- normal request rates;
- normal login patterns;
- normal store traffic;
- normal API sequences;
- normal AI tool usage;
- normal delivery activity;
- normal employee administration;
- normal resource utilisation;
- normal partner activity.

Baselines must account for legitimate variability such as:

- promotions;
- holidays;
- store openings;
- outages;
- major campaigns;
- seasonal demand;
- new deployments;
- regional events.

A deviation from baseline is a signal, not proof of malicious behaviour.

---

## 10. Anomaly Detection

Detection systems may use:

- rules;
- statistical methods;
- behavioural analytics;
- machine learning;
- graph analysis;
- sequence analysis;
- threat intelligence;
- correlation engines;
- deterministic policy checks.

No single detection method shall be treated as universally authoritative.

AI-assisted detection must itself be monitored for:

- drift;
- false positives;
- false negatives;
- poisoning;
- evasion;
- bias;
- model degradation;
- and manipulation.

---

## 11. Detection Confidence

Each material detection should carry an indication of confidence or evidentiary strength where technically appropriate.

Conceptually:

```text
Observation
    ↓
Evidence
    ↓
Detection
    ↓
Confidence
    ↓
Context
    ↓
Risk Assessment
```

A low-confidence detection should not automatically trigger an irreversible action.

High-impact responses should require stronger evidence or appropriate human/policy authority.

---

## 12. False Positives

Detection architecture must actively manage false positives.

Excessive false positives can:

- inconvenience legitimate customers;
- block legitimate commerce;
- disrupt stores;
- interrupt deliveries;
- trigger unnecessary investigations;
- overwhelm security teams;
- and train operators to ignore alerts.

Detection quality must therefore be measured by more than alert volume.

---

## 13. False Negatives

False negatives must also be measured.

A detection system that produces very few alerts may simply be failing to detect attacks.

The platform should evaluate:

- missed attacks;
- detection latency;
- detection coverage;
- severity accuracy;
- confidence calibration;
- and control effectiveness.

CISA recommends testing defensive technologies against known adversary behaviours and tuning the security programme based on observed performance rather than assuming that deployed controls work perfectly. citeturn0search29

---

## 14. Detection Latency

The architecture shall measure the time between:

```text
Hostile Activity
      ↓
Telemetry
      ↓
Detection
      ↓
Notification
      ↓
Response
```

Important metrics include:

- mean time to detect;
- median detection latency;
- high-severity detection latency;
- telemetry delay;
- alert processing delay;
- correlation delay.

Detection latency should be evaluated against the business impact of the threat.

---

## 15. Alert Prioritisation

Alerts should be prioritised using contextual factors such as:

- asset criticality;
- customer impact;
- financial exposure;
- privilege level;
- sensitivity;
- confidence;
- attack stage;
- blast radius;
- persistence indicators;
- exploitability;
- operational consequences.

A high-volume low-impact signal should not automatically outrank a low-volume high-impact signal.

---

## 16. Security Signal Lifecycle

A security signal should follow a governed lifecycle:

```text
Observed
   ↓
Normalised
   ↓
Correlated
   ↓
Classified
   ↓
Scored
   ↓
Prioritised
   ↓
Routed
   ↓
Investigated / Responded
   ↓
Closed
   ↓
Learned From
```

The lifecycle must preserve provenance.

---

## 17. Threat Hunting

The security architecture shall support proactive threat hunting.

Threat hunting may investigate:

- known attacker techniques;
- emerging indicators;
- suspicious identity patterns;
- lateral movement;
- unusual API sequences;
- unusual data access;
- AI abuse;
- supply-chain anomalies;
- unusual infrastructure behaviour.

Threat hunting shall not depend exclusively on previously known indicators.

---

## 18. Detection Engineering

Detections must themselves be engineered, versioned and tested.

Each material detection should have:

- purpose;
- detection logic;
- data sources;
- assumptions;
- severity mapping;
- confidence model;
- owner;
- test cases;
- known limitations;
- false-positive considerations;
- response routing;
- lifecycle status.

Detection rules must not become undocumented production logic.

---

## 19. Detection-as-Code

Where practical, detection rules should be represented as controlled artefacts that can be:

- reviewed;
- versioned;
- tested;
- deployed;
- rolled back;
- compared;
- audited.

This supports reproducibility and reduces undocumented monitoring changes.

---

## 20. Security Control Monitoring

The monitoring system must detect when security controls themselves fail.

Examples:

- logging disabled;
- firewall rule unexpectedly changed;
- MFA control degraded;
- endpoint agent stopped;
- encryption configuration changed;
- DLP disabled;
- security policy bypassed;
- backup protection degraded;
- monitoring pipeline interrupted.

A security control that silently stops functioning is itself a security event.

---

## 21. Monitoring Pipeline Protection

The detection pipeline is a high-value target.

It must be protected against:

- telemetry suppression;
- log flooding;
- event injection;
- timestamp manipulation;
- alert suppression;
- detector tampering;
- monitoring credential theft;
- SIEM compromise;
- storage exhaustion;
- and configuration manipulation.

The platform should detect when monitoring coverage materially decreases.

---

## 22. Detection Blind Spots

The platform shall maintain visibility into known monitoring gaps.

Examples:

- unsupported device;
- offline store;
- third-party system without telemetry;
- encrypted traffic without appropriate metadata;
- temporarily unavailable logging source;
- new service not yet onboarded;
- regional monitoring outage.

Blind spots must be visible to security operators rather than appearing as normal operation.

---

## 23. Store and Warehouse Detection

Physical operations require dedicated monitoring.

Relevant signals may include:

- unusual terminal activity;
- inventory manipulation;
- abnormal stock adjustments;
- unusual warehouse access;
- device tampering;
- suspicious staff activity;
- unusual delivery dispatch behaviour;
- connectivity anomalies;
- local system compromise.

Offline operation must support deferred telemetry where required.

---

## 24. Delivery Detection

The delivery platform may monitor:

- abnormal route behaviour;
- repeated dispatch failures;
- suspicious driver/account activity;
- impossible delivery sequences;
- delivery manipulation;
- location anomalies where lawful and necessary;
- partner integration anomalies.

Monitoring must not assume that an unusual route is malicious; operational context is required.

---

## 25. AI Detection Telemetry

AI systems shall generate governed security telemetry covering, where appropriate:

- agent identity;
- model identity/version;
- capability invoked;
- tool invoked;
- target resource;
- input classification;
- output classification;
- authority context;
- policy decision;
- action outcome;
- token/resource consumption;
- anomaly signals.

This supports detection without requiring unrestricted retention of sensitive prompts or customer data.

---

## 26. Detection of AI Abuse

The platform should detect:

- excessive tool invocation;
- unusual agent loops;
- repeated failed actions;
- attempts to bypass authority;
- prompt injection campaigns;
- unusual model-query patterns;
- model extraction attempts;
- abnormal agent collaboration;
- suspicious external content influence.

AI detection should integrate with Commit 010 and Commit 011 rather than create a separate AI security silo.

---

## 27. Detection of Intelligence Extraction

The monitoring system should identify patterns associated with:

- high-volume probing;
- systematic query variation;
- repeated boundary testing;
- output harvesting;
- recommendation reconstruction;
- pricing-function probing;
- route-optimisation probing;
- AI behaviour cloning.

Detection should focus on patterns rather than attempting to infer malicious intent from a single legitimate request.

---

## 28. Commerce Detection Integration

Monitoring should correlate security signals with commerce signals.

Example:

```text
New Account
   ↓
Card Test
   ↓
Coupon Attempt
   ↓
Inventory Reservation
   ↓
Refund Request
```

The individual actions may be legitimate. Their combination may warrant investigation.

This integrates Commit 013 with Commit 017 without duplicating its economic-abuse controls.

---

## 29. Trust Engine Integration

The Trust Engine may consume authorised detection signals.

However:

> **A detection signal does not automatically become a trust verdict.**

Detection provides evidence.

The Trust Engine evaluates evidence within its authorised model and context.

---

## 30. Event-Driven Detection

Where appropriate, security events should flow through the enterprise event architecture.

```text
Security-Relevant Occurrence
          ↓
Governed Event
          ↓
Detection Consumers
          ↓
Correlation / Analysis
          ↓
Security Signal
```

The event architecture defined by EDA-013 remains the authoritative event-governance boundary.

---

## 31. Detection Data Retention

Detection telemetry shall follow purpose-driven retention.

Retention decisions must consider:

- security value;
- incident investigation;
- regulatory requirements;
- privacy;
- storage cost;
- sensitivity;
- replay requirements;
- legal holds.

Not all raw telemetry requires indefinite retention.

---

## 32. Regional and Global Detection

Global Essentials Mart deployment requires:

- regional telemetry collection;
- regional processing where required;
- controlled cross-region correlation;
- data-residency compliance;
- regional failure handling;
- central visibility where permitted.

A global detection system must not require every raw event to leave its originating jurisdiction.

---

## 33. Third-Party Detection

External providers should expose appropriate security signals where contractually and technically possible.

Relevant providers include:

- cloud providers;
- payment providers;
- WhatsApp or messaging providers;
- mapping providers;
- delivery providers;
- analytics providers;
- identity providers;
- AI providers;
- managed services.

External telemetry must be treated as evidence from a dependency rather than unquestionable truth.

---

## 34. Detection Integrity

Material detection decisions must be traceable to the evidence used.

The system should preserve:

- source;
- timestamp;
- detector version;
- rule/model version;
- evidence references;
- confidence;
- resulting signal;
- routing decision.

This supports investigation, audit and detection improvement.

---

## 35. Detection Explainability

For material automated detections, the platform should be able to explain at an appropriate level:

- what was observed;
- which detector fired;
- what evidence contributed;
- why the signal received its severity;
- what uncertainty exists.

Security detection should not become an opaque black box where operators cannot understand why an alert exists.

---

## 36. Automated Detection Does Not Equal Automated Punishment

A detection may trigger:

- logging;
- enrichment;
- investigation;
- notification;
- rate limiting;
- temporary restriction;
- Trust Engine evaluation;
- or authorised containment.

It must not automatically trigger irreversible punishment unless an explicitly authorised policy permits it.

---

## 37. Detection and Human Review

High-impact or ambiguous detections may require human review.

Examples:

- suspected insider abuse;
- high-value account restrictions;
- partner termination;
- significant financial intervention;
- AI authority suspension;
- customer account closure.

The detection system should provide the evidence needed for informed review.

---

## 38. Detection Degradation

When detection infrastructure is degraded, the platform should know:

- what visibility has been lost;
- which assets are affected;
- what compensating controls exist;
- whether risk has increased;
- whether operations should be restricted.

A monitoring outage must not silently create a security blind spot.

---

## 39. Alert Fatigue Management

The platform shall manage alert volume.

Controls may include:

- deduplication;
- aggregation;
- suppression with expiry;
- prioritisation;
- contextual enrichment;
- confidence thresholds;
- escalation rules.

Suppression must never become a mechanism for hiding persistent malicious behaviour.

---

## 40. Detection Feedback Loop

Detection performance shall continuously improve through feedback.

```text
Detection
   ↓
Investigation
   ↓
Outcome
   ↓
False Positive / True Positive / False Negative
   ↓
Detection Tuning
   ↓
New Detection Version
```

Changes to material detection logic must remain traceable.

---

## 41. Detection Metrics

The security programme should measure:

- coverage;
- detection latency;
- false-positive rate;
- false-negative rate where measurable;
- alert volume;
- alert severity accuracy;
- investigation time;
- telemetry availability;
- detector availability;
- detection drift;
- blind-spot duration;
- control-monitoring coverage.

Metrics should measure defensive effectiveness rather than merely activity.

---

## 42. Detection Testing

Detection must be tested through:

- simulated attacks;
- adversarial testing;
- replayed attack traces;
- synthetic telemetry;
- chaos testing;
- red-team exercises;
- purple-team exercises;
- known-attack datasets;
- regression tests.

The later Commit 021 establishes the broader adversarial verification architecture.

---

## 43. Safe Detection Failure

If a detector fails, the platform must fail according to the risk of the protected capability.

Examples:

```text
Low-risk analytics anomaly detector fails
        ↓
Continue operation + alert monitoring degradation
```

versus:

```text
Critical payment-fraud detection fails
        ↓
Apply appropriate compensating control
        ↓
Escalate
```

The architecture must avoid indiscriminate fail-open or fail-closed behaviour.

---

## 44. Detection Boundary With Commit 018

Commit 017 answers:

> **How do we know something is wrong?**

Commit 018 will answer:

> **What can the platform automatically do about it?**

Therefore:

```text
017 Detection
      ↓
Security Signal
      ↓
018 Automated Defence & Containment
```

The boundary must remain explicit.

---

## 45. Constitutional Detection Laws

1. Monitoring exists to support defensive awareness and risk decisions.
2. Monitoring must be purpose-driven and proportionate.
3. Detection is distinct from response.
4. A detection is not automatically proof of malicious intent.
5. Detection confidence must be distinguished from certainty.
6. Security telemetry must preserve provenance.
7. Material telemetry must be protected from tampering.
8. Detection must account for known blind spots.
9. Detection systems must themselves be monitored.
10. Detection logic must be versioned and governed.
11. False positives and false negatives must both be measured.
12. Detection latency must be measurable.
13. Detection should correlate multiple signals where appropriate.
14. Baseline deviation is a signal, not automatic guilt.
15. AI-assisted detection must itself be defended and evaluated.
16. External telemetry is evidence, not unquestionable truth.
17. Detection must respect privacy and data-minimisation requirements.
18. Automated detection does not automatically grant authority to punish.
19. High-impact decisions must follow the appropriate authority boundary.
20. Detection degradation must be visible.
21. Alert suppression must be governed.
22. Detection improvements must be traceable.
23. Security monitoring must not become an uncontrolled surveillance system.
24. Detection must integrate with the enterprise event architecture where appropriate.
25. Detection architecture must remain distinct from automated containment and incident response.

---

## 46. Architectural Outcome

Commit 017 establishes a platform-wide defensive nervous system:

```text
                   PLATFORM ACTIVITY
                          │
                          ▼
                    TELEMETRY
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
       Identity         Network          Application
          │               │                │
          ├───────────────┼────────────────┤
          ▼               ▼                ▼
       Commerce           AI            Infrastructure
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                     CORRELATION
                          │
                          ▼
                    DETECTION ENGINE
                          │
                  ┌───────┴────────┐
                  ▼                ▼
              Evidence         Confidence
                  │                │
                  └───────┬────────┘
                          ▼
                    SECURITY SIGNAL
                          │
             ┌────────────┼─────────────┐
             ▼            ▼             ▼
          Trust       Investigation   Response
          Engine                       Layer
```

The result is not simply more logging. It is an observable defensive system capable of recognising abnormal conditions, preserving evidence, measuring uncertainty, identifying blind spots and routing signals to the correct authority.

---

## 47. Commit

```text
docs(eda): add defensive monitoring and detection architecture

- Establish platform-wide defensive monitoring architecture
- Define telemetry collection and protected centralisation
- Establish identity, API, application and infrastructure detection
- Add commerce, AI, Trust Engine and supply-chain detection domains
- Define telemetry normalisation and correlation
- Establish behavioural baselines and anomaly detection
- Define detection confidence and evidence provenance
- Establish false-positive and false-negative management
- Define detection latency and alert prioritisation
- Establish threat hunting and detection engineering
- Define detection-as-code governance
- Monitor security controls and monitoring-pipeline health
- Establish detection blind-spot visibility
- Define AI abuse and intelligence-extraction detection
- Integrate security detection with event governance
- Establish privacy-aware retention and regional detection boundaries
- Define third-party telemetry handling
- Establish detection integrity and explainability
- Separate detection from automated punishment and response
- Define human review boundaries
- Establish detection degradation and alert-fatigue controls
- Define detection feedback and effectiveness metrics
- Establish detection testing requirements
- Define safe detection failure
- Establish the boundary between Commit 017 and Commit 018
- Establish constitutional defensive detection laws
```
