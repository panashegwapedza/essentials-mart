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

Commit 002 — Platform Threat & Attack Model
Proposed path:

docs/architecture/EDA-001/part-4/commits/002-platform-threat-attack-model.md

# EDA-001 Part 4 — Commit 002
---

## 5.8 Reverse Engineers

Actors attempting to:

- inspect client applications;
- extract application logic;
- recover algorithms;
- analyse binaries;
- inspect APIs;
- reconstruct workflows;
- reproduce proprietary functionality.

---

## 5.9 AI Attackers

Actors attempting to:

- manipulate AI agents;
- extract prompts;
- extract model behaviour;
- poison context;
- poison data;
- abuse tools;
- escalate agent privileges;
- impersonate agents;
- cause excessive AI resource consumption.

---

## 5.10 High-Capability Attackers

Where appropriate, the threat model shall consider attackers with:

- significant technical expertise;
- financial resources;
- persistent access;
- specialised tooling;
- coordinated operations.

The architecture shall not assume that every attacker possesses the same capability.

---

# 6. Trust Boundaries

The following trust boundaries shall be explicitly modelled.

```text
Customer Device
        │
        ▼
Public Network
        │
        ▼
Edge / Gateway
        │
        ▼
Application Services
        │
        ▼
Domain Services
        │
        ▼
Data Systems
Additional boundaries include:

Customer ↔ Essentials Mart

Staff ↔ Staff Systems

Supplier ↔ Supplier Interfaces

Third Party ↔ Essentials Mart

AI Agent ↔ AI Society

AI Agent ↔ Tool

AI Agent ↔ Data

Service ↔ Service

Store ↔ Central Platform

Region ↔ Region

Development ↔ Staging

Staging ↔ Production
Every trust boundary shall have explicit assumptions regarding:

identity;

authentication;

authorisation;

data validation;

communication;

monitoring;

failure behaviour;

containment.

7. Attack Surface
The Essentials Mart attack surface shall include all meaningful paths through which data, commands, identities or capabilities can enter or leave the platform.

This includes:

mobile applications;

web applications;

APIs;

public endpoints;

authentication endpoints;

payment interfaces;

WhatsApp interfaces;

notification interfaces;

third-party APIs;

supplier interfaces;

staff interfaces;

administrative interfaces;

AI tools;

AI agent interfaces;

file uploads;

data imports;

event interfaces;

network services;

cloud services;

CI/CD systems;

dependencies;

customer devices.

Attack-surface analysis shall also include the valuable data and protective mechanisms associated with those paths.

8. External Attack Surface
External attack surfaces include:

internet-facing APIs;

authentication endpoints;

customer applications;

public websites;

WhatsApp interfaces;

payment integrations;

mapping integrations;

delivery integrations;

supplier interfaces;

external APIs;

public cloud endpoints.

These surfaces shall receive heightened defensive attention.

9. Internal Attack Surface
Internal attack surfaces include:

service-to-service communication;

staff systems;

administrative systems;

databases;

internal APIs;

event infrastructure;

AI tools;

privileged systems;

deployment infrastructure;

monitoring systems;

backup systems.

Internal access shall not automatically be treated as trusted.

10. Client Attack Surface
Customer and staff devices shall be treated as potentially compromised environments.

Potential attack paths include:

modified applications;

repackaged applications;

rooted/jailbroken devices;

malicious extensions;

malware;

spyware;

credential theft;

session theft;

local data extraction;

API manipulation;

request replay;

runtime instrumentation.

The client shall therefore not be treated as authoritative for critical security or business decisions.

11. API Attack Surface
API threats shall include:

unauthorised access;

broken authorisation;

enumeration;

scraping;

replay;

request manipulation;

parameter tampering;

excessive requests;

automated abuse;

resource exhaustion;

business-logic abuse;

data extraction;

credential abuse.

API security shall therefore operate across:

Identity
 ↓
Authentication
 ↓
Authorisation
 ↓
Validation
 ↓
Rate / Abuse Controls
 ↓
Business Rules
 ↓
Monitoring
12. AI Attack Surface
AI introduces additional attack paths.

These include:

user prompts;

external content;

retrieved data;

agent memory;

agent tools;

tool outputs;

inter-agent communication;

model interfaces;

AI APIs;

system instructions;

model configuration;

agent permissions.

Potential attacks include:

prompt injection;

context poisoning;

malicious instructions;

tool abuse;

privilege escalation;

agent impersonation;

model extraction;

excessive resource consumption;

malicious agent interaction.

13. Walk Mode Attack Surface
Walk Mode introduces a specialised physical and digital attack surface.

Potentially exposed information includes:

store maps;

navigation;

product locations;

live inventory;

shopper location;

device position;

proximity information;

real-time store events.

Threats include:

location manipulation;

map manipulation;

inventory inference;

unauthorised proximity information;

shopper tracking;

device spoofing;

navigation manipulation;

real-time event abuse.

A shopper must never be able to use Walk Mode to infer unauthorised information about another shopper.

14. WhatsApp Attack Surface
WhatsApp shall be treated as a communication channel rather than a source of truth.

Threats include:

account impersonation;

message spoofing;

social engineering;

unauthorised commands;

stolen accounts;

malicious links;

channel abuse;

automated message abuse;

authentication weaknesses.

WhatsApp-originated actions shall pass through the same authorised backend controls as actions originating from the application.

15. Supply-Chain Attack Surface
The supply-chain attack surface includes:

software libraries;

SDKs;

Flutter dependencies;

cloud providers;

AI models;

AI providers;

APIs;

payment providers;

WhatsApp;

mapping providers;

delivery providers;

analytics providers;

infrastructure providers;

development tools;

contractors;

managed services;

suppliers.

A compromise of an external dependency shall not automatically result in unrestricted platform compromise.

16. Attack Objectives
Attackers may seek to:

Gain Access
steal credentials;

compromise accounts;

bypass authentication;

escalate privileges.

Steal Information
customer data;

household data;

business intelligence;

inventory;

pricing;

AI information;

proprietary algorithms.

Manipulate Information
prices;

inventory;

rewards;

Trust Engine signals;

orders;

household data;

AI context.

Disrupt Operations
DDoS;

ransomware;

destructive attacks;

service exhaustion;

dependency disruption.

Commit Fraud
payment abuse;

reward farming;

referral abuse;

return abuse;

delivery abuse.

Extract Intellectual Property
reverse engineering;

API probing;

AI probing;

model extraction;

behavioural cloning;

data scraping.

17. Attack Path Model
The platform shall model attacks as chains rather than isolated events.

A generic attack path is:

Reconnaissance
      ↓
Entry
      ↓
Initial Access
      ↓
Execution
      ↓
Privilege Escalation
      ↓
Persistence
      ↓
Discovery
      ↓
Lateral Movement
      ↓
Collection
      ↓
Exfiltration / Manipulation / Disruption
Not every attack will follow every stage.

The model shall identify where an attack can be:

prevented;

detected;

slowed;

contained;

terminated.

18. Attack Path Example — Compromised Customer Account
Credential Theft
      ↓
Account Login
      ↓
Session Establishment
      ↓
Abnormal Behaviour
      ↓
Trust / Risk Evaluation
      ↓
Detection
      ↓
Additional Verification
      ↓
Capability Restriction
      ↓
Account Protection
The attacker should not automatically gain access to:

household data;

payment operations;

administrative functionality;

other households;

privileged APIs.

19. Attack Path Example — Malicious Automation
Automated Requests
      ↓
Endpoint Discovery
      ↓
High Request Velocity
      ↓
Behavioural Detection
      ↓
Rate / Quota Controls
      ↓
Progressive Friction
      ↓
Capability Restriction
      ↓
Containment
The platform should distinguish legitimate automation from malicious automation where practical.

20. Attack Path Example — Compromised Dependency
Third-Party Compromise
      ↓
Malicious Component
      ↓
Execution / Data Access Attempt
      ↓
Service Boundary
      ↓
Least Privilege
      ↓
Monitoring
      ↓
Anomaly Detection
      ↓
Isolation
      ↓
Credential Revocation
      ↓
Recovery
The architecture shall minimise the ability of a compromised dependency to propagate across the platform.

21. Attack Path Example — AI Tool Abuse
Malicious Input
      ↓
AI Agent
      ↓
Manipulated Context
      ↓
Tool Invocation Attempt
      ↓
Capability / Permission Check
      ↓
Risk Evaluation
      ↓
Human Approval or Denial
      ↓
Audit
AI agents shall not be permitted to bypass ordinary backend authority.

22. Threat Categories
The threat model shall classify threats into the following major categories:

Identity compromise

Authentication attacks

Authorisation attacks

Credential attacks

Account takeover

Malware

Spyware

Ransomware

Phishing

Social engineering

Bot abuse

Automation abuse

Scraping

API abuse

Network attacks

Application exploitation

Infrastructure compromise

Cloud compromise

Supply-chain compromise

Insider threats

Data theft

Data manipulation

Data destruction

Privacy attacks

Fraud

Reward abuse

Payment abuse

Delivery abuse

Inventory abuse

AI manipulation

AI resource abuse

AI/model extraction

IP extraction

Reverse engineering

Denial of service

Distributed denial of service

Privilege escalation

Lateral movement

Persistence

Business-logic abuse.

23. Threat Prioritisation
Threats shall be prioritised according to factors including:

likelihood;

impact;

exploitability;

exposure;

attacker capability;

detectability;

containment difficulty;

recovery difficulty;

potential blast radius;

economic incentive;

regulatory consequences;

reputational consequences;

IP consequences.

A threat shall receive higher defensive priority where it combines:

High Impact
+
High Exposure
+
High Exploitability
+
Large Blast Radius
24. Impact Categories
Threat impact shall be evaluated across:

Confidentiality
Unauthorised disclosure of information.

Integrity
Unauthorised modification of information or decisions.

Availability
Loss or degradation of service.

Financial
Direct or indirect financial loss.

Privacy
Unauthorised exposure or misuse of personal information.

Safety
Potential physical or operational harm.

Trust
Loss of customer or partner confidence.

Regulatory
Potential legal or compliance consequences.

Competitive
Loss of proprietary advantage.

Operational
Disruption to stores, fulfilment, delivery or enterprise operations.

25. Threat Response Categories
Each significant threat shall eventually be assigned an appropriate response:

eliminate;

prevent;

mitigate;

detect;

contain;

transfer;

accept;

recover.

Acceptance of a threat shall require appropriate risk authority.

26. Defensive Traceability
Every major threat shall be traceable through the defensive architecture.

The intended relationship is:

Threat
  ↓
Asset
  ↓
Attack Surface
  ↓
Attack Path
  ↓
Risk
  ↓
Preventive Control
  ↓
Detection
  ↓
Containment
  ↓
Recovery
  ↓
Evidence
This creates a direct line of sight between threats and the controls developed in subsequent Part 4 commits.

27. Threat Model Lifecycle
The threat model shall be updated when:

a new feature is introduced;

a new API is introduced;

a new integration is introduced;

infrastructure changes;

AI capabilities change;

Walk Mode changes;

WhatsApp capabilities change;

a new dependency is introduced;

a security incident occurs;

a vulnerability is discovered;

attacker behaviour changes;

the business expands into a new country or region;

a new store architecture is introduced.

This reflects the principle that threat modelling must evolve with the system rather than remain static. 

28. Threat Model Outputs
The threat-modelling process shall produce:

system decomposition;

attack-surface map;

asset inventory;

actor inventory;

trust-boundary map;

threat catalogue;

attack-path catalogue;

prioritised threat register;

defensive requirements;

mitigation requirements;

detection requirements;

containment requirements;

recovery requirements;

validation scenarios.

Where practical, structured threat-model representations may be maintained alongside human-readable documentation.

29. Relationship With Part 3
Part 3 establishes the security architecture and associated controls.

Part 4 Commit 002 establishes the adversarial model against which those controls and subsequent defensive mechanisms are evaluated.

Part 4 shall therefore not assume that the existence of a Part 3 control means the corresponding threat is eliminated.

Instead, the threat model shall ask:

Can the control be bypassed?

What happens if it fails?

Can it be manipulated?

Can an attacker operate around it?

Can an attacker exploit another path?

Can compromise propagate?

Can the attack be detected?

Can the attack be contained?

Can the system recover?

30. Relationship With Commit 001
Commit 001 established:

assume breach;

defence in depth;

server-side authority;

client untrustedness;

IP isolation;

active defence;

progressive response;

blast-radius reduction;

AI defensive boundaries;

continuous defensive improvement.

Commit 002 converts those principles into a structured threat model.

The subsequent Part 4 commits shall derive defensive architectures from this model.

31. Success Criteria
Commit 002 is successful when:

the major Essentials Mart assets have been identified;

major threat actors have been identified;

external and internal attack surfaces have been mapped;

major trust boundaries have been identified;

customer, staff, supplier and third-party attack paths have been considered;

AI attack surfaces have been considered;

Walk Mode attack surfaces have been considered;

WhatsApp attack surfaces have been considered;

supply-chain attack surfaces have been considered;

malware, spyware and ransomware threats have been considered;

bot and automation threats have been considered;

API and scraping threats have been considered;

fraud and business-logic abuse have been considered;

IP extraction and reverse engineering have been considered;

attack objectives have been identified;

representative attack paths have been defined;

threats can be prioritised;

threats can be traced to defensive controls;

the model can evolve as Essentials Mart evolves.

32. Next Commit
The next commit shall establish the:

Three-Tier IP Protection Architecture

This will translate the IP-related threats identified in this model into a formal architecture covering:

server-side IP isolation;

client exposure boundaries;

client hardening;

WebAssembly where justified;

obfuscation;

anti-tampering;

reverse-engineering resistance;

dynamic protection;

API exposure minimisation;

trade-secret boundaries;

legal/IP protection interfaces.

