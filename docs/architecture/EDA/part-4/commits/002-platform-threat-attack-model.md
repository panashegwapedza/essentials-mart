# EDA-001 Part 4 — Commit 002
# Platform Threat & Attack Model

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 002  
**Date:** 2026-08-17  
**Decision Type:** Threat & Attack Architecture  
**Parent Architecture:** EDA-001  
**Predecessor:** EDA-001 Part 4 — Commit 001 — Defensive Engineering Foundation

---

## 1. Purpose

This commit establishes the threat and attack model for Essentials Mart.

The purpose of this model is to provide a structured representation of:

- assets;
- actors;
- attack surfaces;
- entry points;
- trust boundaries;
- attack paths;
- attacker objectives;
- vulnerabilities;
- impacts;
- defensive priorities;
- mitigation requirements.

The model provides the foundation from which subsequent Part 4 defensive architectures will be derived.

No major defensive control should be designed in isolation from the threats it is intended to address.

---

## 2. Threat Modelling Principle

Essentials Mart shall continuously evaluate the platform from an adversarial perspective.

The threat model shall ask:

1. What are we protecting?
2. Who or what could attack it?
3. Where can an attacker interact with it?
4. What could go wrong?
5. How could an attack progress?
6. What would the impact be?
7. What controls should prevent or limit the attack?
8. How would the platform detect the attack?
9. How would the platform contain it?
10. How would the platform recover?
11. How will the model be validated and updated?

Threat modelling shall be treated as a continuous architectural activity rather than a one-time document.

Changes to architecture, technology, infrastructure, features, integrations or threat conditions shall be capable of triggering threat-model review.

---

## 3. Threat Model Scope

The threat model covers the complete Essentials Mart ecosystem.

This includes:

- customer applications;
- staff applications;
- administrative interfaces;
- web interfaces;
- Flutter applications;
- backend services;
- APIs;
- databases;
- event infrastructure;
- cloud infrastructure;
- network infrastructure;
- identity systems;
- authentication systems;
- authorisation systems;
- AI Society;
- Intelligence Engines;
- AI agents;
- Trust Engine;
- Reward Intelligence;
- Commerce;
- Household;
- Inventory;
- Product Intelligence;
- Customer Intelligence;
- Delivery;
- Notifications;
- Walk Mode;
- WhatsApp;
- payment integrations;
- mapping integrations;
- analytics;
- suppliers;
- software dependencies;
- CI/CD systems;
- development environments;
- production environments;
- physical stores;
- staff operations;
- customer devices;
- supplier systems.

---

## 4. Protected Assets

Essentials Mart shall classify assets according to their value and the consequences of compromise.

### 4.1 Customer Assets

Including:

- identity information;
- authentication credentials;
- sessions;
- personal information;
- household information;
- preferences;
- shopping history;
- order history;
- addresses;
- communication preferences;
- location information;
- loyalty information;
- payment-related information.

### 4.2 Household Assets

Including:

- household membership;
- household roles;
- household permissions;
- Household Wallet;
- budgets;
- shopping lists;
- Smart Pantry information;
- household goals;
- household activity;
- household preferences;
- household AI context.

Household data shall be treated as belonging to the appropriate household security boundary and shall not be exposed to unauthorised members or unrelated customers.

### 4.3 Commerce Assets

Including:

- orders;
- carts;
- transactions;
- pricing;
- promotions;
- discounts;
- returns;
- refunds;
- fulfilment information;
- delivery information.

### 4.4 Retail Assets

Including:

- inventory;
- stock levels;
- store information;
- product catalogue;
- product availability;
- store maps;
- shelf information;
- pricing;
- supplier information;
- fulfilment information.

### 4.5 AI Assets

Including:

- AI Society architecture;
- AI agents;
- agent identities;
- agent permissions;
- Intelligence Engines;
- models;
- prompts;
- system instructions;
- context;
- memory;
- tools;
- tool permissions;
- agent-to-agent communication;
- AI decision logic;
- AI telemetry;
- AI training or evaluation data.

### 4.6 Proprietary Intelligence

Including:

- Trust Engine logic;
- Reward Intelligence;
- recommendation logic;
- pricing intelligence;
- inventory intelligence;
- demand forecasting;
- fraud intelligence;
- personalisation logic;
- proprietary algorithms;
- proprietary datasets;
- business rules;
- optimisation methods;
- internal scoring systems.

These assets are particularly important to the Part 4 IP protection architecture.

### 4.7 Security Assets

Including:

- credentials;
- tokens;
- secrets;
- cryptographic keys;
- service identities;
- AI identities;
- device identities;
- certificates;
- security policies;
- trust signals;
- fraud indicators;
- detection rules;
- security telemetry;
- privileged access mechanisms.

### 4.8 Infrastructure Assets

Including:

- servers;
- containers;
- databases;
- storage;
- networks;
- cloud resources;
- CI/CD infrastructure;
- build systems;
- deployment systems;
- monitoring systems;
- backup systems.

---

## 5. Threat Actors

The threat model shall consider multiple classes of attackers.

### 5.1 Opportunistic Attackers

Attackers seeking:

- exposed services;
- weak credentials;
- vulnerable applications;
- misconfigured infrastructure;
- publicly accessible data.

### 5.2 Cybercriminals

Attackers seeking:

- financial gain;
- customer accounts;
- payment information;
- fraud opportunities;
- resaleable data;
- ransomware opportunities.

### 5.3 Automated Attackers

Including:

- bots;
- scrapers;
- credential-stuffing systems;
- vulnerability scanners;
- automated fraud systems;
- automated account farms;
- automated API clients.

### 5.4 Fraud Actors

Including individuals or coordinated groups seeking to exploit:

- promotions;
- rewards;
- referrals;
- payments;
- returns;
- deliveries;
- loyalty systems;
- household relationships;
- marketplace processes.

### 5.5 Malicious or Compromised Insiders

Including:

- staff;
- administrators;
- developers;
- contractors;
- support personnel;
- privileged operators.

The model shall distinguish malicious insiders from legitimate users whose credentials or devices have been compromised.

### 5.6 Compromised Third Parties

Potentially including:

- suppliers;
- software providers;
- cloud providers;
- AI providers;
- payment providers;
- WhatsApp;
- mapping providers;
- delivery providers;
- analytics providers;
- managed service providers;
- contractors.

### 5.7 Competitors and Intelligence Extractors

Actors attempting to obtain:

- proprietary algorithms;
- product intelligence;
- pricing intelligence;
- inventory intelligence;
- AI behaviour;
- recommendation logic;
- business intelligence;
- customer behaviour;
- model behaviour.

### 5.8 Reverse Engineers

Actors attempting to:

- inspect client applications;
- extract application logic;
- recover algorithms;
- analyse binaries;
- inspect APIs;
- reconstruct workflows;
- reproduce proprietary functionality.

### 5.9 AI Attackers

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

### 5.10 High-Capability Attackers

Where appropriate, the threat model shall consider attackers with:

- significant technical expertise;
- financial resources;
- persistent access;
- specialised tooling;
- coordinated operations.

The architecture shall not assume that every attacker possesses the same capability.

---

## 6. Trust Boundaries

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
```

Additional boundaries include:

```text
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
```

Every trust boundary shall have explicit assumptions regarding:

- identity;
- authentication;
- authorisation;
- data validation;
- communication;
- monitoring;
- failure behaviour;
- containment.

---

## 7. Attack Surface

The Essentials Mart attack surface shall include all meaningful paths through which data, commands, identities or capabilities can enter or leave the platform.

This includes:

- mobile applications;
- web applications;
- APIs;
- public endpoints;
- authentication endpoints;
- payment interfaces;
- WhatsApp interfaces;
- notification interfaces;
- third-party APIs;
- supplier interfaces;
- staff interfaces;
- administrative interfaces;
- AI tools;
- AI agent interfaces;
- file uploads;
- data imports;
- event interfaces;
- network services;
- cloud services;
- CI/CD systems;
- dependencies;
- customer devices.

Attack-surface analysis shall also include the valuable data and protective mechanisms associated with those paths.

---

## 8. External Attack Surface

External attack surfaces include:

- internet-facing APIs;
- authentication endpoints;
- customer applications;
- public websites;
- WhatsApp interfaces;
- payment integrations;
- mapping integrations;
- delivery integrations;
- supplier interfaces;
- external APIs;
- public cloud endpoints.

These surfaces shall receive heightened defensive attention.

---

## 9. Internal Attack Surface

Internal attack surfaces include:

- service-to-service communication;
- staff systems;
- administrative systems;
- databases;
- internal APIs;
- event infrastructure;
- AI tools;
- privileged systems;
- deployment infrastructure;
- monitoring systems;
- backup systems.

Internal access shall not automatically be treated as trusted.

---

## 10. Client Attack Surface

Customer and staff devices shall be treated as potentially compromised environments.

Potential attack paths include:

- modified applications;
- repackaged applications;
- rooted/jailbroken devices;
- malicious extensions;
- malware;
- spyware;
- credential theft;
- session theft;
- local data extraction;
- API manipulation;
- request replay;
- runtime instrumentation.

The client shall therefore not be treated as authoritative for critical security or business decisions.

---

## 11. API Attack Surface

API threats shall include:

- unauthorised access;
- broken authorisation;
- enumeration;
- scraping;
- replay;
- request manipulation;
- parameter tampering;
- excessive requests;
- automated abuse;
- resource exhaustion;
- business-logic abuse;
- data extraction;
- credential abuse.

API security shall therefore operate across:

```text
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
```

---

## 12. AI Attack Surface

AI introduces additional attack paths.

These include:

- user prompts;
- external content;
- retrieved data;
- agent memory;
- agent tools;
- tool outputs;
- inter-agent communication;
- model interfaces;
- AI APIs;
- system instructions;
- model configuration;
- agent permissions.

Potential attacks include:

- prompt injection;
- context poisoning;
- malicious instructions;
- tool abuse;
- privilege escalation;
- agent impersonation;
- model extraction;
- excessive resource consumption;
- malicious agent interaction.

---

## 13. Walk Mode Attack Surface

Walk Mode introduces a specialised physical and digital attack surface.

Potentially exposed information includes:

- store maps;
- navigation;
- product locations;
- live inventory;
- shopper location;
- device position;
- proximity information;
- real-time store events.

Threats include:

- location manipulation;
- map manipulation;
- inventory inference;
- unauthorised proximity information;
- shopper tracking;
- device spoofing;
- navigation manipulation;
- real-time event abuse.

A shopper must never be able to use Walk Mode to infer unauthorised information about another shopper.

---

## 14. WhatsApp Attack Surface

WhatsApp shall be treated as a communication channel rather than a source of truth.

Threats include:

- account impersonation;
- message spoofing;
- social engineering;
- unauthorised commands;
- stolen accounts;
- malicious links;
- channel abuse;
- automated message abuse;
- authentication weaknesses.

WhatsApp-originated actions shall pass through the same authorised backend controls as actions originating from the application.

---

## 15. Supply-Chain Attack Surface

The supply-chain attack surface includes:

- software libraries;
- SDKs;
- Flutter dependencies;
- cloud providers;
- AI models;
- AI providers;
- APIs;
- payment providers;
- WhatsApp;
- mapping providers;
- delivery providers;
- analytics providers;
- infrastructure providers;
- development tools;
- contractors;
- managed services;
- suppliers.

A compromise of an external dependency shall not automatically result in unrestricted platform compromise.

---

## 16. Attack Objectives

Attackers may seek to:

### Gain Access

- steal credentials;
- compromise accounts;
- bypass authentication;
- escalate privileges.

### Steal Information

- customer data;
- household data;
- business intelligence;
- inventory;
- pricing;
- AI information;
- proprietary algorithms.

### Manipulate Information

- prices;
- inventory;
- rewards;
- Trust Engine signals;
- orders;
- household data;
- AI context.

### Disrupt Operations

- DDoS;
- ransomware;
- destructive attacks;
- service exhaustion;
- dependency disruption.

### Commit Fraud

- payment abuse;
- reward farming;
- referral abuse;
- return abuse;
- delivery abuse.

### Extract Intellectual Property

- reverse engineering;
- API probing;
- AI probing;
- model extraction;
- behavioural cloning;
- data scraping.

---

## 17. Attack Path Model

The platform shall model attacks as chains rather than isolated events.

A generic attack path is:

```text
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
```

Not every attack will follow every stage.

The model shall identify where an attack can be:

- prevented;
- detected;
- slowed;
- contained;
- terminated.

---

## 18. Attack Path Example — Compromised Customer Account

```text
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
```

The attacker should not automatically gain access to:

- household data;
- payment operations;
- administrative functionality;
- other households;
- privileged APIs.

---

## 19. Attack Path Example — Malicious Automation

```text
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
```

The platform should distinguish legitimate automation from malicious automation where practical.

---

## 20. Attack Path Example — Compromised Dependency

```text
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
```

The architecture shall minimise the ability of a compromised dependency to propagate across the platform.

---

## 21. Attack Path Example — AI Tool Abuse

```text
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
```

AI agents shall not be permitted to bypass ordinary backend authority.

---

## 22. Threat Categories

The threat model shall classify threats into the following major categories:

1. Identity compromise
2. Authentication attacks
3. Authorisation attacks
4. Credential attacks
5. Account takeover
6. Malware
7. Spyware
8. Ransomware
9. Phishing
10. Social engineering
11. Bot abuse
12. Automation abuse
13. Scraping
14. API abuse
15. Network attacks
16. Application exploitation
17. Infrastructure compromise
18. Cloud compromise
19. Supply-chain compromise
20. Insider threats
21. Data theft
22. Data manipulation
23. Data destruction
24. Privacy attacks
25. Fraud
26. Reward abuse
27. Payment abuse
28. Delivery abuse
29. Inventory abuse
30. AI manipulation
31. AI resource abuse
32. AI/model extraction
33. IP extraction
34. Reverse engineering
35. Denial of service
36. Distributed denial of service
37. Privilege escalation
38. Lateral movement
39. Persistence
40. Business-logic abuse.

---

## 23. Threat Prioritisation

Threats shall be prioritised according to factors including:

- likelihood;
- impact;
- exploitability;
- exposure;
- attacker capability;
- detectability;
- containment difficulty;
- recovery difficulty;
- potential blast radius;
- economic incentive;
- regulatory consequences;
- reputational consequences;
- IP consequences.

A threat shall receive higher defensive priority where it combines:

```text
High Impact
+
High Exposure
+
High Exploitability
+
Large Blast Radius
```

---

## 24. Impact Categories

Threat impact shall be evaluated across:

### Confidentiality

Unauthorised disclosure of information.

### Integrity

Unauthorised modification of information or decisions.

### Availability

Loss or degradation of service.

### Financial

Direct or indirect financial loss.

### Privacy

Unauthorised exposure or misuse of personal information.

### Safety

Potential physical or operational harm.

### Trust

Loss of customer or partner confidence.

### Regulatory

Potential legal or compliance consequences.

### Competitive

Loss of proprietary advantage.

### Operational

Disruption to stores, fulfilment, delivery or enterprise operations.

---

## 25. Threat Response Categories

Each significant threat shall eventually be assigned an appropriate response:

- eliminate;
- prevent;
- mitigate;
- detect;
- contain;
- transfer;
- accept;
- recover.

Acceptance of a threat shall require appropriate risk authority.

---

## 26. Defensive Traceability

Every major threat shall be traceable through the defensive architecture.

The intended relationship is:

```text
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
```

This creates a direct line of sight between threats and the controls developed in subsequent Part 4 commits.

---

## 27. Threat Model Lifecycle

The threat model shall be updated when:

- a new feature is introduced;
- a new API is introduced;
- a new integration is introduced;
- infrastructure changes;
- AI capabilities change;
- Walk Mode changes;
- WhatsApp capabilities change;
- a new dependency is introduced;
- a security incident occurs;
- a vulnerability is discovered;
- attacker behaviour changes;
- the business expands into a new country or region;
- a new store architecture is introduced.

Threat modelling shall evolve with the system rather than remain static.

---

## 28. Threat Model Outputs

The threat-modelling process shall produce:

- system decomposition;
- attack-surface map;
- asset inventory;
- actor inventory;
- trust-boundary map;
- threat catalogue;
- attack-path catalogue;
- prioritised threat register;
- defensive requirements;
- mitigation requirements;
- detection requirements;
- containment requirements;
- recovery requirements;
- validation scenarios.

Where practical, structured threat-model representations may be maintained alongside human-readable documentation.

---

## 29. Relationship With Part 3

Part 3 establishes the security architecture and associated controls.

Part 4 Commit 002 establishes the adversarial model against which those controls and subsequent defensive mechanisms are evaluated.

Part 4 shall therefore not assume that the existence of a Part 3 control means the corresponding threat is eliminated.

Instead, the threat model shall ask:

- Can the control be bypassed?
- What happens if it fails?
- Can it be manipulated?
- Can an attacker operate around it?
- Can an attacker exploit another path?
- Can compromise propagate?
- Can the attack be detected?
- Can the attack be contained?
- Can the system recover?

---

## 30. Relationship With Commit 001

Commit 001 established:

- assume breach;
- defence in depth;
- server-side authority;
- client untrustedness;
- IP isolation;
- active defence;
- progressive response;
- blast-radius reduction;
- AI defensive boundaries;
- continuous defensive improvement.

Commit 002 converts those principles into a structured threat model.

The subsequent Part 4 commits shall derive defensive architectures from this model.

---

## 31. Success Criteria

Commit 002 is successful when:

- the major Essentials Mart assets have been identified;
- major threat actors have been identified;
- external and internal attack surfaces have been mapped;
- major trust boundaries have been identified;
- customer, staff, supplier and third-party attack paths have been considered;
- AI attack surfaces have been considered;
- Walk Mode attack surfaces have been considered;
- WhatsApp attack surfaces have been considered;
- supply-chain attack surfaces have been considered;
- malware, spyware and ransomware threats have been considered;
- bot and automation threats have been considered;
- API and scraping threats have been considered;
- fraud and business-logic abuse have been considered;
- IP extraction and reverse engineering have been considered;
- attack objectives have been identified;
- representative attack paths have been defined;
- threats can be prioritised;
- threats can be traced to defensive controls;
- the model can evolve as Essentials Mart evolves.

---

## 32. Next Commit

The next commit shall establish the:

**Three-Tier IP Protection Architecture**

This will translate the IP-related threats identified in this model into a formal architecture covering:

- server-side IP isolation;
- client exposure boundaries;
- client hardening;
- WebAssembly where justified;
- obfuscation;
- anti-tampering;
- reverse-engineering resistance;
- dynamic protection;
- API exposure minimisation;
- trade-secret boundaries;
- legal/IP protection interfaces.
