# EDA-001 Part 4 — Commit 001
# Defensive Engineering Foundation

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 001  
**Date:** 2026-08-14  
**Decision Type:** Defensive Architecture  
**Parent Architecture:** EDA-001  
**Predecessor:** EDA-001 Part 3 — Security Architecture

---

## 1. Purpose

This commit establishes the foundational defensive-engineering philosophy for Essentials Mart.

EDA-001 Part 3 defines the security architecture, trust boundaries, identity controls, security monitoring, incident response, infrastructure security, supply-chain security and security governance of the platform.

Part 4 extends that architecture by defining how Essentials Mart protects itself when those controls are targeted, bypassed, manipulated, degraded or defeated.

Part 4 therefore focuses on:

- platform protection;
- defensive engineering;
- attack resistance;
- abuse resistance;
- application resilience;
- intellectual-property protection;
- cyber-threat defence;
- active attack detection;
- automated containment;
- recovery;
- adversarial verification;
- operational resilience.

The objective is not to claim that Essentials Mart can become impossible to attack.

The objective is to make the platform:

1. difficult to compromise;
2. difficult to abuse;
3. difficult to reverse engineer;
4. difficult to economically exploit;
5. difficult to use for automated attacks;
6. difficult to extract proprietary intelligence from;
7. capable of detecting compromise;
8. capable of limiting attacker progress;
9. capable of containing failures;
10. capable of recovering from successful attacks.

---

# 2. Defensive Engineering Philosophy

Essentials Mart shall be designed under the assumption that security controls will eventually be tested by determined adversaries.

The architecture therefore shall not depend upon the assumption that:

> "The attacker will never get inside."

Instead, the platform shall assume that:

- clients can be inspected;
- client applications can be modified;
- requests can be replayed or automated;
- APIs can be probed;
- credentials can be compromised;
- accounts can be abused;
- dependencies can become compromised;
- third-party services can fail or become malicious;
- infrastructure can be attacked;
- employees or suppliers can become compromised;
- AI systems can be manipulated;
- security controls can themselves become attack targets.

Security therefore extends beyond prevention.

The platform must continuously operate across four defensive objectives:

```text
Prevent
   ↓
Detect
   ↓
Contain
   ↓
Recover
These objectives shall operate as a continuous defensive lifecycle.

3. Assume-Breach Principle

Essentials Mart shall operate under an assume-breach philosophy.

The architecture shall assume that one or more defensive boundaries may eventually be penetrated.

A successful compromise of one component must therefore not automatically provide unrestricted access to:

other services;
customer data;
household data;
payment-related systems;
inventory systems;
AI systems;
staff systems;
supplier systems;
infrastructure;
secrets;
proprietary algorithms;
Trust Engine intelligence;
Reward Intelligence;
business intelligence.

The platform shall therefore minimise blast radius.

A compromised component should provide the attacker with the smallest practical amount of additional capability.

4. Defence in Depth

No single defensive mechanism shall be considered sufficient for protecting critical assets.

Critical assets shall be protected through multiple independent or complementary controls.

For example:

Identity
   ↓
Authentication
   ↓
Authorisation
   ↓
Context Evaluation
   ↓
Rate / Abuse Controls
   ↓
Application Validation
   ↓
Business Rule Validation
   ↓
Audit
   ↓
Detection
   ↓
Containment

The failure of one control must not automatically result in unrestricted compromise.

This principle applies particularly to:

customer accounts;
staff accounts;
privileged accounts;
service identities;
AI agents;
APIs;
financial operations;
household information;
proprietary intelligence;
infrastructure.
5. Server-Side Authority

Essentials Mart shall treat the client as an untrusted execution environment.

The client may provide:

user input;
presentation;
navigation;
interaction;
locally required computation;
temporary state.

The client shall not be treated as the ultimate authority for:

permissions;
financial values;
reward eligibility;
Trust Engine decisions;
inventory authority;
order authority;
privileged operations;
security decisions;
critical business rules.

Authoritative validation shall occur on trusted backend systems.

The client must therefore never be able to establish its own authority merely by modifying:

JavaScript;
application binaries;
WebAssembly;
local storage;
network requests;
application state;
UI state.
6. Intellectual Property Protection Principle

Essentials Mart shall distinguish between functionality that must be delivered to the client and intellectual property that should remain server-side.

The architecture shall favour:

Sensitive Core Logic
        ↓
Server
        ↓
Authorised API
        ↓
Client

rather than:

Sensitive Core Logic
        ↓
Client

The following categories should preferentially remain server-side where technically practical:

proprietary algorithms;
Trust Engine logic;
Reward Intelligence logic;
proprietary optimisation;
sensitive business rules;
AI orchestration;
proprietary datasets;
confidential scoring mechanisms;
high-value decision logic;
security-sensitive rules.

Client-side resilience mechanisms may increase the difficulty of extraction, but they shall never replace server-side authority.

This aligns with current OWASP guidance: obfuscation, anti-debugging and anti-tampering are resilience measures that increase attack cost, but are not substitutes for proper security architecture or server-side validation.

7. Client Resilience Principle

Where functionality must execute on a customer device, Essentials Mart may employ additional resilience mechanisms appropriate to the threat model.

These may include:

code obfuscation;
WebAssembly;
binary hardening;
anti-tampering;
runtime integrity checks;
application signing;
platform integrity checks;
anti-debugging;
anti-static-analysis techniques;
anti-dynamic-analysis techniques;
device binding;
runtime protection.

These mechanisms are intended to increase attacker effort and reduce the practicality of client-side attacks.

They shall not be represented internally as providing absolute protection.

OWASP explicitly recognises that a determined attacker controlling the execution device can eventually bypass client-side protections; therefore the objective is resilience rather than perfect prevention.

8. Minimise Attacker Return on Investment

Defensive architecture shall consider not only whether an attack can technically occur, but also whether the attack remains economically worthwhile.

The platform should increase the cost of:

automated abuse;
large-scale scraping;
API enumeration;
AI probing;
model extraction;
reverse engineering;
credential attacks;
account farming;
reward farming;
inventory manipulation;
fraud;
infrastructure compromise.

This may be achieved through:

rate limiting;
quotas;
progressive friction;
anomaly detection;
capability restrictions;
dynamic controls;
response minimisation;
compartmentalisation;
monitoring;
automated containment.
9. Active Defence

Essentials Mart shall not rely solely upon static controls.

The platform shall continuously evaluate behaviour and respond proportionately to detected risk.

The preferred defensive progression is:

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

A suspicious event should not automatically result in permanent blocking when lower-risk interventions can safely protect the platform.

This allows Essentials Mart to distinguish between:

legitimate unusual behaviour;
accidental misuse;
automated activity;
malicious automation;
compromised identities;
coordinated attacks.
10. Progressive Defence

Security responses should be proportional to the assessed threat.

The architecture should support multiple defensive responses, including:

allow;
monitor;
warn;
challenge;
rate limit;
delay;
reduce capability;
require reauthentication;
require stronger authentication;
require human approval;
suspend operation;
revoke credentials;
isolate;
terminate;
block.

This prevents the platform from depending upon a binary:

ALLOW / BLOCK

security model.

11. Blast-Radius Reduction

Every critical service shall be designed so that compromise does not automatically propagate throughout the platform.

Controls should include, where appropriate:

service isolation;
least privilege;
scoped credentials;
separate secrets;
network segmentation;
identity boundaries;
tenant/household isolation;
data access boundaries;
workload isolation;
independent service permissions;
transaction boundaries.

A compromised service must not automatically become a platform-wide compromise.

12. Security of Security Controls

Security mechanisms themselves shall be treated as protected assets.

Attackers may attempt to manipulate:

rate limits;
trust scores;
fraud indicators;
bot classifications;
authentication decisions;
security telemetry;
reward eligibility;
anomaly scores;
detection thresholds;
AI security controls.

Therefore, critical security decisions must not depend upon untrusted client-provided values.

Security telemetry and security decisions should be generated and validated within trusted infrastructure.

13. AI Defensive Principle

The AI Society shall be treated as an active security boundary.

AI agents shall not automatically receive unrestricted access merely because they are trusted AI components.

Each agent shall operate within explicitly defined:

identity;
capabilities;
tools;
data access;
authority;
context;
approval requirements.

Autonomous actions shall be constrained according to their risk.

The architecture shall support:

agent isolation;
tool restrictions;
action approval thresholds;
agent auditability;
context protection;
kill switches;
containment;
monitoring.
14. Automation and Bot Defence Principle

Essentials Mart shall assume that attackers will automate interactions.

The platform shall therefore support defensive mechanisms including:

bot detection;
automation detection;
rate limiting;
quotas;
request velocity controls;
session controls;
identity-based limits;
device-based limits;
household-based limits;
endpoint-specific limits;
API/service limits;
scraping detection;
enumeration detection.

The platform shall avoid relying solely on IP-based controls because legitimate users may share networks and attackers may distribute traffic across many addresses.

15. Data Protection Through Minimisation

Defensive architecture shall reduce the amount of information available to an attacker.

APIs and client interfaces should expose only information necessary for the requested operation.

The platform should minimise:

unnecessary fields;
sensitive metadata;
internal identifiers;
security-sensitive responses;
debugging information;
infrastructure details;
model information;
proprietary decision explanations.

Reducing exposed information reduces opportunities for:

reconnaissance;
scraping;
reverse engineering;
model extraction;
targeted attacks.
16. Failure Shall Be Safe

When security mechanisms fail, the system shall fail according to the risk of the operation.

Critical operations should not silently continue when required security validation is unavailable.

Examples include:

privileged operations;
financial operations;
security configuration changes;
sensitive data access;
high-risk AI actions;
administrative actions.

Lower-risk functionality may be permitted to degrade gracefully where appropriate.

The architecture shall therefore distinguish between:

Fail Securely

and:

Fail Gracefully

depending on the operation and its consequences.

17. Defensive Telemetry

Security-relevant operations shall generate sufficient evidence to support:

detection;
investigation;
attribution;
containment;
recovery;
post-incident analysis.

Security telemetry should support questions such as:

Who?
What?
When?
Where?
Which identity?
Which device?
Which service?
Which authority?
Which security decision?
Which policy?
What changed?
What happened afterwards?

This builds upon the enterprise auditability established in EDA-001 Part 3.

18. Defensive Lifecycle

All major security controls shall follow a lifecycle:

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

Defensive engineering is therefore a continuous architectural process rather than a one-time implementation.

19. Scope of Part 4

Part 4 shall progressively address the following defensive domains:

Defensive Engineering Foundation
Threat & Attack Model
Three-Tier IP Protection
IP Exposure Classification
Client Application Resilience
Business Logic & API Protection
Active Abuse & Automation Defence
Cyber Threat Defence
Infrastructure & Network Defence
Supply-Chain & Dependency Defence
AI Defensive Architecture
AI Intelligence & Distillation Defence
Data & Intelligence Protection
Commerce & Economic Abuse Defence
Trust Engine Defensive Architecture
Platform Authenticity & Anti-Impersonation
Defensive Monitoring & Detection
Automated Defence & Containment
Incident Response Architecture
Platform Resilience & Continuity
Adversarial Testing & Defensive Verification
IP & Legal Protection Strategy
Global Defensive Scalability
Defensive Governance
Assurance, Traceability & Closure

These domains form the working structure of EDA-001 Part 4 and may be refined as subsequent commits expose architectural dependencies or gaps.

20. Relationship With EDA-001 Part 3

Part 3 and Part 4 are complementary.

Part 3 establishes:
security architecture;
trust boundaries;
identity security;
data security;
application security;
API security;
AI security;
fraud and abuse architecture;
infrastructure security;
supply-chain security;
monitoring;
incident response;
governance.
Part 4 establishes:
defensive hardening;
attack resistance;
IP isolation;
client resilience;
active abuse defence;
cyber-threat defence;
adversarial detection;
automated containment;
recovery;
resilience;
defensive verification;
IP protection strategy.

Part 4 must therefore build upon Part 3 rather than recreate it.

21. Architectural Principles Established

This commit establishes the following principles:

DE-001 — Assume Breach

The platform shall assume that individual components may eventually be compromised.

DE-002 — Server Authority

Critical authority shall remain on trusted backend systems.

DE-003 — Defence in Depth

Critical assets shall have multiple complementary protection layers.

DE-004 — Minimise Blast Radius

Compromise of one component shall not automatically compromise unrelated components.

DE-005 — Client Untrustedness

Client-side code shall never be treated as a trusted authority.

DE-006 — Resilience Over Illusion

Obfuscation and anti-reversing controls shall increase attack cost but shall not be treated as absolute protection.

DE-007 — Active Defence

The platform shall detect and respond to abnormal behaviour rather than relying solely on static controls.

DE-008 — Progressive Response

Defensive responses shall be proportionate to assessed risk.

DE-009 — Security Control Protection

Security mechanisms themselves shall be protected against manipulation.

DE-010 — Continuous Improvement

Security controls shall evolve through testing, monitoring and lessons learned.

22. Success Criteria

Commit 001 is successful when:

Part 4 has a clearly defined purpose;
Part 4 does not duplicate Part 3;
defensive engineering is established as a distinct architectural concern;
assume-breach is formally adopted;
client-side trust limitations are established;
server-side authority is established;
IP isolation is established as an architectural principle;
client hardening is positioned as resilience rather than absolute security;
active defence is established;
progressive response is established;
blast-radius reduction is established;
AI defensive boundaries are established;
automation and bot defence are recognised as first-class concerns;
security controls themselves are recognised as attack targets;
the 25-commit Part 4 workflow has a clear architectural foundation.
23. Next Commit

The next commit shall define the Platform Threat & Attack Model.

It will translate the principles established here into a structured model of:

assets;
actors;
attack surfaces;
trust boundaries;
attacker objectives;
attack paths;
impact;
likelihood;
defensive priorities.
