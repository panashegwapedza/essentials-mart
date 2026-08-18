# EDA-001 Part 4 — Commit 006
# Runtime Threat Detection, Bot Defence & Adaptive Abuse Control Architecture

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 006  
**Date:** 2026-08-18  
**Decision Type:** Runtime Security & Abuse Defence Architecture  
**Parent Architecture:** EDA-001  
**Predecessors:** Commit 001 — Defensive Engineering Foundation; Commit 002 — Platform Threat & Attack Model; Commit 003 — Three-Tier IP Protection Architecture; Commit 004 — Software Supply-Chain Security; Commit 005 — Client Application Hardening & Anti-Tampering

---

## 1. Purpose

This commit establishes the runtime defensive architecture used to identify, assess, slow, contain and respond to malicious or abnormal activity while Essentials Mart is operating.

The architecture covers both conventional cybersecurity threats and automated abuse, including:

- bots;
- scraping;
- credential attacks;
- account takeover;
- API abuse;
- resource exhaustion;
- fraud automation;
- reward farming;
- promotion abuse;
- malicious automation;
- suspicious staff behaviour;
- suspicious supplier behaviour;
- AI abuse;
- client tampering;
- anomalous application behaviour;
- coordinated attacks.

Runtime defence is not intended to replace preventive security controls established elsewhere in Part 3 or Part 4. It provides a continuously operating defensive layer around them.

---

## 2. Architectural Principle

Essentials Mart shall not rely on a single binary decision such as:

```text
Allowed / Blocked
```

Instead, runtime defence shall evaluate activity using contextual signals and progressively apply the least disruptive effective response.

The intended model is:

```text
Observe
   ↓
Analyse
   ↓
Risk / Abuse Assessment
   ↓
Allow / Challenge / Restrict / Contain / Block
   ↓
Monitor Outcome
   ↓
Adapt
```

A legitimate user should not be treated as malicious solely because one signal appears unusual.

Likewise, an attacker should not be trusted simply because a request originates from a valid account, device or session.

---

## 3. Runtime Security Boundary

Runtime defence shall operate across the platform rather than at a single gateway.

```text
                    Internet / External Channels
                               │
                               ▼
                         Edge Protection
                               │
                     ┌─────────┴─────────┐
                     │                   │
                Bot / Abuse          Network Signals
                 Detection               │
                     │                   │
                     └─────────┬─────────┘
                               ▼
                         API Gateway
                               │
                  Authentication / Session
                               │
                               ▼
                     Authorisation Layer
                               │
                               ▼
                    Runtime Risk Engine
                               │
              ┌────────────────┼────────────────┐
              │                │                │
          Fraud Signals   Trust Signals    Behaviour
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    Domain / Business Logic
                               │
                               ▼
                          Data Systems
                               │
                               ▼
                         Audit / Evidence
```

The architecture shall support controls at multiple layers so that bypassing one defensive mechanism does not automatically defeat the entire security model.

---

## 4. Runtime Signals

Runtime decisions may use signals including:

- request frequency;
- request patterns;
- endpoint sequence;
- session behaviour;
- authentication history;
- failed authentication attempts;
- account age;
- device signals;
- device integrity signals;
- IP reputation;
- network characteristics;
- geographic anomalies;
- impossible travel indicators;
- behavioural anomalies;
- transaction patterns;
- shopping patterns;
- reward activity;
- referral activity;
- promotion activity;
- return activity;
- delivery activity;
- API consumption;
- scraping indicators;
- automation indicators;
- AI tool usage;
- privilege usage;
- staff activity;
- supplier activity;
- security telemetry.

Signals shall be evaluated according to their reliability and context.

No single weak signal should automatically determine a high-impact security action unless specifically justified by the threat model.

---

## 5. Bot Detection Architecture

Essentials Mart shall distinguish, where practical, between:

- normal human activity;
- permitted automation;
- internal system automation;
- partner automation;
- suspicious automation;
- malicious bots.

Bot detection may use combinations of:

- request velocity;
- request regularity;
- endpoint traversal;
- session characteristics;
- device integrity;
- behavioural consistency;
- challenge results;
- API credentials;
- known automation signatures;
- reputation signals;
- resource consumption;
- interaction timing.

Bot detection shall avoid relying exclusively on easily spoofed client identifiers.

---

## 6. Rate Limiting

Rate limiting shall be implemented as a layered control.

Potential dimensions include:

- IP address;
- authenticated identity;
- device;
- session;
- API key;
- service identity;
- endpoint;
- household;
- supplier;
- partner;
- region;
- resource type.

The architecture shall support different limits for different operations.

For example:

```text
Login attempts       → strict
Password reset       → strict
Product browsing     → higher allowance
Search               → high allowance
Checkout             → controlled
Reward redemption    → highly controlled
Administrative APIs  → highly controlled
AI tool execution    → capability-specific
```

Rate limits shall account for legitimate high-volume activity where required.

---

## 7. Quotas and Resource Controls

Rate limiting alone is insufficient where expensive operations are involved.

The platform shall support quotas and resource controls for:

- AI inference;
- AI tool execution;
- database-heavy operations;
- report generation;
- bulk exports;
- file processing;
- image processing;
- inventory operations;
- notification generation;
- messaging;
- delivery coordination;
- administrative jobs.

Expensive operations shall be protected against intentional or accidental resource exhaustion.

---

## 8. Progressive Response Model

Runtime defence shall favour progressive responses where appropriate.

```text
Normal
  ↓
Monitor
  ↓
Rate Limit
  ↓
Friction / Challenge
  ↓
Capability Restriction
  ↓
Temporary Suspension
  ↓
Containment
  ↓
Block / Revoke
```

The exact response shall depend on:

- confidence;
- severity;
- affected asset;
- user context;
- historical behaviour;
- blast radius;
- reversibility;
- legal and operational requirements.

---

## 9. Adaptive Friction

The platform may introduce additional verification when risk increases.

Examples include:

- re-authentication;
- MFA;
- step-up authentication;
- challenge mechanisms;
- confirmation of sensitive actions;
- reduced transaction limits;
- delayed execution;
- human review.

Friction should be proportional to risk.

The objective is to make malicious automation expensive while minimising unnecessary disruption to legitimate customers.

---

## 10. Credential Attack Defence

Runtime controls shall monitor for:

- credential stuffing;
- password spraying;
- brute-force attacks;
- repeated failed authentication;
- unusual login locations;
- unusual devices;
- suspicious session creation;
- token abuse;
- session hijacking indicators.

Responses may include:

- rate limiting;
- temporary lockout;
- step-up authentication;
- session revocation;
- credential reset;
- device re-verification;
- account protection workflows.

---

## 11. Account Takeover Detection

Account takeover detection shall correlate signals across the account lifecycle.

Potential indicators include:

- sudden device changes;
- impossible travel;
- unusual purchasing behaviour;
- unusual household changes;
- unusual payment behaviour;
- unusual delivery changes;
- unusual communication changes;
- abnormal reward activity;
- rapid changes to security settings;
- simultaneous sessions with unusual characteristics.

A high-confidence account takeover event may trigger:

```text
Session Revocation
        ↓
Capability Restriction
        ↓
Identity Verification
        ↓
Account Recovery
        ↓
Investigation
```

---

## 12. Scraping Defence

Essentials Mart shall protect commercially sensitive and operationally valuable data against automated extraction.

Protected information may include:

- pricing;
- inventory;
- product intelligence;
- promotions;
- recommendations;
- store information;
- demand information;
- supplier information;
- proprietary AI outputs.

Defences may include:

- authenticated access;
- rate limits;
- pagination limits;
- query complexity limits;
- anomaly detection;
- adaptive throttling;
- response minimisation;
- access controls;
- behavioural analysis.

The objective is not merely to prevent high request volume, but to detect systematic extraction behaviour.

---

## 13. API Abuse Defence

API protection shall monitor for:

- endpoint enumeration;
- parameter probing;
- excessive requests;
- unusual endpoint sequences;
- object enumeration;
- authorisation probing;
- replay attempts;
- malformed requests;
- expensive-query abuse;
- business-logic abuse.

Sensitive APIs shall have stricter controls than ordinary read operations.

---

## 14. Business-Logic Abuse

Runtime security shall not focus exclusively on technical attacks.

Attackers may abuse legitimate functionality without exploiting a software vulnerability.

Examples include:

- repeated promotional redemption;
- reward farming;
- referral manipulation;
- return abuse;
- delivery manipulation;
- inventory reservation abuse;
- household manipulation;
- payment timing abuse;
- coupon abuse;
- synthetic transactions.

Business-logic abuse shall therefore be observable by the appropriate intelligence systems.

---

## 15. Fraud Intelligence Integration

Runtime security shall integrate with Fraud Intelligence rather than duplicate it.

The relationship shall be:

```text
Runtime Signals
      ↓
Fraud Intelligence
      ↓
Risk Assessment
      ↓
Security / Business Response
```

Fraud systems may recommend actions, while authoritative security and domain controls enforce them according to their respective responsibilities.

---

## 16. Trust Engine Integration

The Trust Engine shall provide contextual trust information where appropriate.

However:

> Trust shall never become an unconditional bypass around security controls.

An established customer may still trigger runtime controls if behaviour becomes anomalous.

Likewise, a new customer shall not automatically be considered malicious solely because their trust history is limited.

Trust signals shall therefore be one input into runtime risk evaluation rather than the sole authority.

---

## 17. Reward Intelligence Integration

Reward Intelligence shall remain responsible for reward-specific eligibility and guardrails.

Runtime security shall detect suspicious patterns such as:

- high-frequency reward activity;
- account farms;
- coordinated referrals;
- synthetic transactions;
- repeated exploitation of reward workflows.

The systems shall collaborate without collapsing their responsibilities.

---

## 18. Staff and Privileged Activity Monitoring

Runtime monitoring shall apply to privileged users as well as customers.

Potential signals include:

- unusual administrative actions;
- unusual data access;
- privilege escalation;
- bulk exports;
- unusual working patterns;
- unusual store access;
- repeated failed privileged operations;
- access outside expected scope.

Monitoring shall respect applicable privacy and employment requirements while maintaining appropriate security evidence.

---

## 19. Supplier and Partner Monitoring

External organisations may receive controlled access to Essentials Mart systems.

Runtime controls shall monitor:

- API usage;
- authentication;
- credential behaviour;
- data access;
- transaction patterns;
- request volume;
- anomalous activity;
- integration health.

Partner credentials and capabilities shall be revocable without requiring a complete platform shutdown.

---

## 20. AI Runtime Defence

AI runtime security shall monitor:

- unusual agent behaviour;
- abnormal tool invocation;
- excessive tool usage;
- repeated failed actions;
- suspicious prompts;
- context manipulation;
- unexpected data access;
- privilege escalation attempts;
- agent-to-agent anomalies;
- excessive inference consumption;
- unusual autonomous actions.

AI actions shall remain constrained by the permissions and tool boundaries established in Part 3 and Part 4.

---

## 21. AI Resource Abuse

AI capabilities create a potentially expensive attack surface.

Controls shall protect against:

- inference flooding;
- tool-call flooding;
- recursive agent behaviour;
- prompt amplification;
- context inflation;
- automated account farms;
- expensive workflow abuse.

Controls may include:

- per-user quotas;
- per-household quotas;
- per-agent quotas;
- per-tool limits;
- cost ceilings;
- execution time limits;
- concurrency limits;
- circuit breakers.

---

## 22. Malware and Compromised Client Signals

Runtime systems shall support detection of potentially compromised clients using available signals.

Indicators may include:

- application integrity failures;
- unexpected client versions;
- suspicious runtime behaviour;
- unusual API patterns;
- impossible application states;
- repeated protocol violations;
- abnormal device characteristics.

The system shall not assume that detection of a compromised client provides proof of malware.

Responses should therefore be risk-based and proportionate.

---

## 23. DDoS and Resource Exhaustion

Distributed denial-of-service protection shall exist at appropriate infrastructure layers.

Controls may include:

- edge filtering;
- traffic distribution;
- request throttling;
- caching;
- connection limits;
- workload isolation;
- autoscaling with safeguards;
- circuit breakers;
- upstream protection services.

Autoscaling shall not become an attacker-controlled mechanism for unlimited cost generation.

---

## 24. Event and Message Abuse

Event-driven architecture introduces additional abuse surfaces.

Controls shall address:

- event flooding;
- duplicate events;
- malformed events;
- replay;
- unauthorised producers;
- consumer exhaustion;
- poison messages;
- abnormal event rates.

Event consumers shall validate events and enforce appropriate resource controls.

---

## 25. Notification and Messaging Abuse

The notification layer shall be protected against:

- message flooding;
- notification loops;
- WhatsApp abuse;
- SMS abuse where applicable;
- email abuse;
- malicious links;
- automated message generation;
- notification amplification.

Notification permissions and user preferences shall be enforced independently of the AI's decision to communicate.

---

## 26. Walk Mode Runtime Defence

Walk Mode shall receive specialised runtime monitoring for:

- abnormal movement patterns;
- impossible location changes;
- repeated map requests;
- unusual inventory queries;
- proximity manipulation;
- navigation abuse;
- device spoofing;
- excessive real-time event consumption.

Runtime controls shall protect other shoppers and store operations from information leakage or deliberate disruption.

---

## 27. WhatsApp Runtime Defence

WhatsApp-originated commands shall be subject to the same underlying security and authorisation model as application-originated commands.

The runtime layer shall monitor:

- command frequency;
- unusual command sequences;
- account changes;
- suspicious action patterns;
- authentication state;
- high-risk operations.

WhatsApp shall not bypass rate limits, permissions, fraud controls or audit requirements.

---

## 28. Detection Confidence

Runtime detections shall carry confidence and severity where practical.

Conceptually:

```text
Signal
  ↓
Evidence Quality
  ↓
Confidence
  ↓
Severity
  ↓
Recommended Response
```

This reduces unnecessary hard blocks caused by weak or ambiguous indicators.

---

## 29. False Positive Management

Security systems can themselves cause harm when they incorrectly classify legitimate behaviour.

The architecture shall therefore support:

- detection tuning;
- review workflows;
- appeal mechanisms where appropriate;
- allowlists for trusted automation;
- partner-specific controls;
- customer recovery paths;
- false-positive telemetry;
- rule evaluation.

Security effectiveness shall include both attack prevention and legitimate-user preservation.

---

## 30. Security Telemetry

Runtime defence shall generate evidence sufficient to support investigation.

Relevant telemetry may include:

- identity;
- device;
- session;
- source;
- endpoint;
- action;
- timestamp;
- request characteristics;
- risk signals;
- response;
- policy decision;
- resulting state change.

Security telemetry shall integrate with the auditability architecture established in Part 3.

---

## 31. Privacy Boundaries

Runtime monitoring shall follow the principle of collecting only information necessary for legitimate security, fraud, reliability and operational purposes.

Sensitive behavioural signals shall have defined:

- purpose;
- access controls;
- retention;
- handling requirements;
- governance.

Security monitoring shall not become an unrestricted behavioural-surveillance system.

---

## 32. Containment Architecture

When runtime activity is determined to be sufficiently dangerous, the platform shall support containment at appropriate scopes.

Potential containment scopes include:

- request;
- session;
- device;
- account;
- household;
- API credential;
- agent;
- service;
- supplier integration;
- region;
- workload.

Containment should be as narrow as possible while still stopping the threat.

---

## 33. Credential and Token Revocation

Runtime defence shall be able to trigger or request revocation of compromised credentials, sessions and tokens.

Examples include:

- customer sessions;
- staff sessions;
- API keys;
- service credentials;
- supplier credentials;
- agent credentials;
- device registrations.

Revocation mechanisms shall themselves be protected against abuse.

---

## 34. Circuit Breakers

Critical services shall support circuit breakers where appropriate.

Circuit breakers may be triggered by:

- abnormal error rates;
- attack traffic;
- resource exhaustion;
- downstream compromise;
- runaway automation;
- AI execution anomalies.

Circuit breakers shall fail in a controlled manner and preserve essential functions where possible.

---

## 35. Security Response Automation

Routine defensive responses may be automated where the consequences are understood and reversible.

Examples include:

- throttling;
- temporary session restriction;
- temporary API blocking;
- token revocation;
- challenge activation;
- workload isolation.

High-impact or irreversible actions may require additional authority or human review depending on risk.

---

## 36. Kill-Switch Boundaries

Critical automated systems shall have mechanisms to stop dangerous behaviour.

Potential kill-switch targets include:

- AI agents;
- tools;
- integrations;
- API credentials;
- deployment components;
- notification workflows;
- automated reward processes.

Kill switches shall be protected against unauthorised activation and unauthorised disabling.

---

## 37. Adaptive Defence

Runtime controls shall evolve as attack behaviour changes.

The system shall support:

- rule updates;
- threshold adjustments;
- threat intelligence updates;
- model updates;
- new detection signals;
- new abuse patterns;
- incident-derived controls.

Changes to high-impact detection or blocking logic shall be governed and auditable.

---

## 38. Detection-to-Response Traceability

Every significant automated security response should be explainable through evidence.

```text
Observed Activity
      ↓
Signals
      ↓
Risk Assessment
      ↓
Policy / Rule
      ↓
Decision
      ↓
Action
      ↓
Outcome
```

This supports the trust and auditability requirements established in Part 3.

---

## 39. Security Boundaries for External Providers

Runtime controls shall remain effective even when external services are involved.

For example:

```text
WhatsApp
   ↓
Channel Adapter
   ↓
Essentials Mart Identity
   ↓
Authorisation
   ↓
Runtime Abuse Controls
   ↓
Backend Action
```

The same pattern shall apply to payment, mapping, delivery, analytics, AI and other external integrations.

---

## 40. Global Scale

Runtime defence shall remain viable as Essentials Mart scales toward:

- 100M+ users;
- 10,000+ stores;
- multiple countries;
- multiple regions;
- millions of daily transactions;
- large AI workloads.

The architecture shall therefore favour:

- distributed enforcement;
- regional controls;
- horizontally scalable telemetry;
- asynchronous analysis where immediate decisions are unnecessary;
- central policy governance with local enforcement;
- cost-aware monitoring;
- automated response for high-volume threats.

Security must scale with the platform rather than becoming a single central bottleneck.

---

## 41. Relationship With Part 3

Part 3 defines the enterprise security architecture, including:

- Trust Engine;
- Identity and Access;
- staff clearance;
- AI security;
- Walk Mode security;
- security evidence;
- monitoring;
- incident response;
- supply-chain security;
- infrastructure security.

Commit 006 provides the runtime defensive mechanisms that operationalise those architectural boundaries.

---

## 42. Relationship With Commit 001

Commit 001 established the principle of active defence and progressive response.

Commit 006 operationalises those principles through:

- runtime monitoring;
- risk assessment;
- adaptive friction;
- rate limiting;
- quotas;
- containment;
- revocation;
- circuit breakers;
- automated defensive responses.

---

## 43. Relationship With Commit 002

Commit 002 identified the relevant threat actors, attack surfaces and attack paths.

Commit 006 provides runtime controls for detecting and disrupting those paths.

Examples include:

```text
Bot Attack
→ Detection
→ Rate Limit
→ Friction
→ Containment
```

```text
Account Takeover
→ Behavioural Anomaly
→ Step-Up Authentication
→ Session Revocation
```

```text
API Scraping
→ Request Pattern Detection
→ Throttling
→ Capability Restriction
```

```text
AI Abuse
→ Tool Monitoring
→ Risk Evaluation
→ Capability Restriction
→ Kill Switch
```

---

## 44. Relationship With Commit 003

Commit 003 protects proprietary IP through isolation and client hardening.

Commit 006 protects those boundaries at runtime by detecting:

- API probing;
- scraping;
- abnormal client behaviour;
- automated extraction;
- excessive requests;
- unusual AI usage;
- attempts to reconstruct proprietary behaviour through repeated interaction.

Runtime abuse controls therefore complement, rather than replace, IP isolation.

---

## 45. Relationship With Commit 004

Commit 004 establishes supply-chain security.

Commit 006 provides runtime containment if a dependency or external provider becomes compromised.

The architecture shall support rapid restriction or revocation of affected:

- credentials;
- integrations;
- services;
- workloads;
- providers.

---

## 46. Relationship With Commit 005

Commit 005 establishes client application hardening.

Commit 006 provides server-side runtime detection when client hardening is bypassed.

The server shall therefore remain authoritative for critical decisions.

A compromised client shall not be able to convert successful client-side tampering into unrestricted backend authority.

---

## 47. Success Criteria

Commit 006 is successful when:

- bot activity can be detected and controlled;
- rate limiting exists at multiple relevant dimensions;
- expensive operations have quotas;
- credential attacks can trigger adaptive controls;
- account takeover indicators can be detected;
- scraping can be identified and constrained;
- API abuse can be detected;
- business-logic abuse can be observed;
- Fraud Intelligence can collaborate with runtime security;
- Trust Engine signals can inform risk without bypassing security;
- Reward Intelligence can collaborate with abuse detection;
- staff and supplier activity can be monitored appropriately;
- AI runtime abuse can be detected;
- AI resource consumption can be controlled;
- compromised clients can be constrained;
- DDoS/resource exhaustion controls exist;
- event and notification abuse are addressed;
- Walk Mode receives runtime protection;
- WhatsApp does not bypass security controls;
- containment can occur at narrow scopes;
- credentials and sessions can be revoked;
- critical automation can be stopped;
- detection and response are auditable;
- privacy boundaries are maintained;
- controls can scale globally.

---

## 48. Next Commit

The next commit shall establish the:

**Data Protection, Secrets & Cryptographic Boundary Architecture**

It will translate the protected assets and attack paths identified in Commit 002 into explicit controls for:

- data classification;
- encryption;
- key management;
- secrets management;
- token protection;
- database protection;
- storage protection;
- data minimisation;
- retention;
- deletion;
- backup protection;
- cryptographic separation;
- sensitive AI context;
- regional data boundaries.
