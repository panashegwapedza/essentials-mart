# EDA-001 Part 4 — Commit 001
# Defensive Engineering Foundation

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 001  
**Date:** 2026-08-18  
**Decision Type:** Defensive Architecture Foundation  
**Parent Architecture:** EDA-001  
**Predecessor:** EDA-001 Part 3 — Security Architecture

---

## 1. Purpose

This commit establishes the defensive-engineering foundation for Essentials Mart Part 4.

Part 3 defines the platform's security architecture. Part 4 extends that architecture by addressing what happens when security boundaries are attacked, bypassed, manipulated, degraded or defeated.

Part 4 therefore focuses on defensive hardening, attack resistance, abuse resistance, intellectual-property protection, cyber-threat defence, active detection, containment, recovery, resilience and adversarial verification.

Part 4 does not replace or duplicate Part 3's security architecture.

---

## 2. Assume-Breach Principle

Essentials Mart shall assume that individual components, identities, devices, dependencies or services may eventually be compromised.

Compromise of one component shall not automatically provide unrestricted access to unrelated services, customer or household data, payment-related systems, inventory systems, AI systems, staff systems, supplier systems, infrastructure, secrets or proprietary intelligence.

The platform shall minimise blast radius and compartmentalise authority.

---

## 3. Defence in Depth

Critical assets shall be protected by multiple complementary controls.

```text
Identity
   ↓
Authentication
   ↓
Authorisation
   ↓
Context Evaluation
   ↓
Abuse Controls
   ↓
Application Validation
   ↓
Business Validation
   ↓
Audit
   ↓
Detection
   ↓
Containment
```

Failure of one control must not automatically produce unrestricted compromise.

---

## 4. Server-Side Authority

The client is an untrusted execution environment. It may provide presentation, interaction and locally required computation, but it shall not be the ultimate authority for permissions, financial values, reward eligibility, Trust Engine decisions, inventory authority, order authority, privileged operations, security decisions or critical business rules.

Authoritative validation shall occur on trusted backend systems.

This is consistent with current OWASP guidance that client-side validation and authorization cannot be relied upon as security boundaries. citeturn1search0turn1search3

---

## 5. Intellectual Property Protection Principle

High-value proprietary logic shall remain server-side wherever technically practical.

Examples include proprietary algorithms, Trust Engine logic, Reward Intelligence logic, proprietary optimisation, sensitive business rules, AI orchestration, proprietary datasets, confidential scoring mechanisms, high-value decision logic and security-sensitive rules.

Client-side hardening may increase attacker cost but shall never replace server-side authority.

---

## 6. Client Resilience Principle

Where functionality must execute on the client, appropriate resilience mechanisms may be used, including code obfuscation, WebAssembly, binary hardening, anti-tampering, runtime integrity checks, application signing, platform integrity checks, anti-debugging, device binding and runtime protection.

These controls are hardening measures, not absolute protection or confidentiality boundaries.

---

## 7. Minimise Attacker Return on Investment

The architecture shall increase the cost of automated abuse, scraping, API enumeration, AI probing, model extraction, reverse engineering, credential attacks, account farming, reward farming, inventory manipulation, fraud and infrastructure compromise.

Controls may include rate limiting, quotas, progressive friction, anomaly detection, capability restrictions, response minimisation, compartmentalisation and automated containment.

---

## 8. Active and Progressive Defence

Essentials Mart shall continuously evaluate behaviour and respond proportionately to assessed risk.

```text
Normal
  ↓
Observe
  ↓
Suspicious
  ↓
Increase Monitoring
  ↓
Increase Friction
  ↓
Restrict Capability
  ↓
Contain
  ↓
Block / Revoke
  ↓
Investigate
```

The platform shall support responses including allow, monitor, warn, challenge, rate limit, delay, reduce capability, reauthenticate, require stronger authentication, require human approval, suspend, revoke credentials, isolate, terminate and block.

Responses shall be proportional to risk rather than relying exclusively on an ALLOW/BLOCK model.

---

## 9. Blast-Radius Reduction

Critical services shall be designed so compromise does not automatically propagate.

Controls may include service isolation, least privilege, scoped credentials, separate secrets, network segmentation, identity boundaries, household/tenant isolation, data-access boundaries, workload isolation, independent service permissions and transaction boundaries.

---

## 10. Security of Security Controls

Security mechanisms themselves are protected assets.

Attackers may attempt to manipulate rate limits, trust scores, fraud indicators, bot classifications, authentication decisions, security telemetry, reward eligibility, anomaly scores, detection thresholds and AI security controls.

Critical security decisions must therefore not depend on untrusted client-provided values.

---

## 11. AI Defensive Principle

The AI Society shall be treated as an active security boundary.

Each agent shall operate within explicitly defined identity, capabilities, tools, data access, authority, context and approval requirements.

The architecture shall support agent isolation, tool restrictions, action approval thresholds, agent auditability, context protection, kill switches, containment and monitoring.

---

## 12. Automation and Bot Defence Principle

Essentials Mart shall assume attackers will automate interactions.

Defensive mechanisms may include bot detection, automation detection, rate limiting, quotas, request-velocity controls, session controls, identity-based limits, device-based limits, household-based limits, endpoint-specific limits, API/service limits, scraping detection and enumeration detection.

IP-based controls alone shall not be treated as sufficient.

---

## 13. Data Exposure Minimisation

Client interfaces and APIs shall expose only information necessary for the requested operation.

The platform should minimise unnecessary fields, sensitive metadata, internal identifiers, security-sensitive responses, debugging information, infrastructure details, model information and proprietary decision explanations.

---

## 14. Safe Failure

Security-sensitive operations shall fail securely when required security validation is unavailable. Lower-risk functions may degrade gracefully where appropriate.

The architecture shall therefore distinguish between **Fail Securely** and **Fail Gracefully** according to the consequences of the operation.

---

## 15. Defensive Telemetry

Security-relevant operations shall generate evidence sufficient for detection, investigation, attribution, containment, recovery and post-incident analysis.

Telemetry should support:

```text
Who?
What?
When?
Where?
Which identity?
Which device?
Which service?
Which authority?
Which policy?
What changed?
What happened afterwards?
```

This builds upon the auditability architecture established in Part 3.

---

## 16. Defensive Lifecycle

Major defensive controls shall follow:

```text
Threat Identification
        ↓
Risk Assessment
        ↓
Control Design
        ↓
Implementation
        ↓
Verification
        ↓
Monitoring
        ↓
Attack Simulation
        ↓
Incident Learning
        ↓
Control Improvement
```

Defensive engineering is therefore continuous rather than a one-time implementation.

---

## 17. Relationship With Part 3

Part 3 establishes the security architecture. Part 4 establishes defensive engineering around that architecture.

Part 4 shall reference Part 3 controls without redefining them. When a Part 4 commit addresses an existing Part 3 concern, it shall focus on hardening, attack resistance, detection, containment, recovery or verification.

---

## 18. Architectural Principles Established

**DE-001 — Assume Breach**  
Individual components may eventually be compromised.

**DE-002 — Server Authority**  
Critical authority remains on trusted backend systems.

**DE-003 — Defence in Depth**  
Critical assets receive multiple complementary protection layers.

**DE-004 — Minimise Blast Radius**  
Compromise of one component shall not automatically compromise unrelated components.

**DE-005 — Client Untrustedness**  
Client-side code is never the final security authority.

**DE-006 — Resilience Over Illusion**  
Obfuscation and anti-reversing controls increase attack cost but do not provide absolute protection.

**DE-007 — Active Defence**  
The platform detects and responds to abnormal behaviour.

**DE-008 — Progressive Response**  
Responses are proportionate to assessed risk.

**DE-009 — Security Control Protection**  
Security mechanisms themselves require protection.

**DE-010 — Continuous Improvement**  
Defensive controls evolve through testing, monitoring and lessons learned.

---

## 19. Success Criteria

Commit 001 succeeds when Part 4 has a distinct defensive-engineering purpose, does not recreate Part 3, establishes assume-breach and server-side authority, positions client hardening as resilience, establishes active/progressive defence and blast-radius reduction, recognises AI and automation as defensive concerns, and is governed by the Part 4 master index.

---

## 20. Next Commit

**Commit 002 — Platform Threat & Attack Model**

Canonical path:

`docs/architecture/EDA/part-4/commits/002-platform-threat-attack-model.md`

The previously used path form `docs/architecture/EDA-001/part-4/commits/` is obsolete and shall not be used.
