# EDA-001 Part 4 — Commit 001
# Defensive Engineering Foundation

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 001  
**Date:** 2026-08-17  
**Decision Type:** Defensive Architecture Foundation  
**Parent Architecture:** EDA-001

---

## 1. Purpose

This commit establishes the defensive engineering foundation for Essentials Mart Part 4.

Part 4 extends the security architecture established in EDA-001 Part 3 by addressing the additional problem of protecting the platform itself from exploitation, duplication, reverse engineering, automated abuse, malicious software, hostile infrastructure activity and evolving cyber threats.

The objective is not to claim that the platform can be made impossible to attack or reverse engineer.

The objective is to make Essentials Mart:

- difficult to compromise;
- difficult to analyse and replicate;
- difficult to abuse at scale;
- resistant to common and advanced attack paths;
- capable of detecting hostile activity;
- capable of limiting attacker capability;
- capable of containing compromise;
- capable of recovering from failure or attack;
- capable of continuously improving its defensive posture.

---

## 2. Core Principle

Essentials Mart shall operate under the assumption that attackers will eventually discover weaknesses.

Security therefore shall not depend on a single protective mechanism.

The architecture shall combine:

```text
Prevention
    ↓
Resistance
    ↓
Detection
    ↓
Deception / Friction where appropriate
    ↓
Containment
    ↓
Recovery
    ↓
Learning
```

A failed control must not automatically result in unrestricted compromise.

---

## 3. Assume Breach

The platform shall assume that:

- credentials may be stolen;
- customer devices may be compromised;
- staff devices may be compromised;
- APIs may be probed;
- applications may be inspected;
- dependencies may become compromised;
- third parties may be breached;
- AI agents may receive malicious input;
- internal services may be compromised;
- attackers may obtain partial access.

The architecture shall therefore minimise the value and reach of any single compromise.

---

## 4. Server-Side Authority

Critical business logic and security decisions shall remain authoritative on trusted backend infrastructure.

The client shall not be the final authority for:

- pricing;
- rewards;
- Trust Engine decisions;
- inventory authority;
- payment decisions;
- permissions;
- order state;
- fulfilment state;
- fraud decisions;
- AI permissions;
- privileged actions;
- proprietary algorithms.

Client applications may request actions, but authoritative services shall validate and execute them.

---

## 5. Intellectual Property Isolation

High-value intellectual property shall be classified and isolated according to its sensitivity.

The architecture shall prefer keeping highly valuable proprietary logic on trusted backend infrastructure where practical.

Examples include:

- recommendation algorithms;
- pricing intelligence;
- inventory optimisation;
- demand forecasting;
- Trust Engine logic;
- Reward Intelligence logic;
- fraud models;
- proprietary ranking systems;
- proprietary optimisation methods;
- sensitive business rules;
- proprietary datasets.

Client-side exposure shall be minimised where the logic does not need to execute locally.

The detailed three-tier IP protection architecture is established in Commit 003.

---

## 6. Client Untrustedness

Customer and staff applications shall be treated as potentially inspectable and modifiable environments.

The architecture shall assume that a technically capable attacker can:

- download client assets;
- inspect JavaScript;
- inspect network traffic;
- instrument application behaviour;
- modify client state;
- replay requests;
- analyse binaries;
- reverse engineer client-side logic.

Accordingly, client hardening shall raise attack cost but shall never be treated as a substitute for server-side authority.

---

## 7. Client Hardening

Where client-side protection provides meaningful value, the platform may employ measures including:

- minification;
- tree shaking;
- source-map protection;
- code obfuscation;
- runtime integrity checks;
- anti-tampering controls;
- application integrity verification;
- device integrity signals;
- WebAssembly where technically justified;
- binary hardening for applicable native components;
- removal of unnecessary client-side secrets.

These measures shall be selected according to risk and operational cost.

No hardening mechanism shall be represented as making client-side code impossible to recover.

---

## 8. API Exposure Control

Public APIs shall expose the minimum capability necessary for legitimate clients and integrations.

The platform shall apply:

- authentication;
- authorisation;
- request validation;
- schema validation;
- rate limiting;
- quotas;
- abuse detection;
- replay protection where appropriate;
- monitoring;
- anomaly detection;
- capability restriction.

Sensitive internal operations shall not be exposed directly merely because a client interface requires access to a business function.

---

## 9. Bot and Automation Defence

Essentials Mart shall explicitly defend against automated abuse.

Threats include:

- credential stuffing;
- scraping;
- account farming;
- API enumeration;
- automated purchasing;
- reward farming;
- referral abuse;
- promotion abuse;
- inventory probing;
- denial-of-service automation;
- malicious agent automation.

Controls may include:

- rate limits;
- adaptive quotas;
- request reputation;
- behavioural analysis;
- progressive friction;
- challenge mechanisms where appropriate;
- capability throttling;
- temporary restrictions;
- account protection;
- IP/device/network reputation signals.

Bot detection shall avoid unnecessarily blocking legitimate high-volume activity.

---

## 10. Malware and Hostile Software Defence

The architecture shall account for:

- malware;
- spyware;
- ransomware;
- malicious browser extensions;
- compromised devices;
- malicious dependencies;
- compromised build tools;
- malicious uploaded files;
- supply-chain malware.

Defence shall include appropriate combinations of:

- endpoint integrity signals;
- dependency scanning;
- vulnerability management;
- software composition analysis;
- malware scanning;
- sandboxing;
- file validation;
- isolation;
- least privilege;
- credential rotation;
- monitoring;
- containment.

The platform shall not assume that an apparently legitimate component is permanently trustworthy.

---

## 11. Active Defence

Essentials Mart shall be capable of responding dynamically to suspicious behaviour.

Responses may include:

```text
Normal
  ↓
Suspicious
  ↓
Restricted
  ↓
Challenged
  ↓
Contained
  ↓
Blocked
```

The response shall be proportional to the assessed risk.

Security controls should prefer reducing attacker capability before resorting to irreversible actions where operationally appropriate.

---

## 12. Blast-Radius Reduction

Every major system boundary shall be designed to limit the consequences of compromise.

Examples include:

- domain isolation;
- service isolation;
- database boundaries;
- credential scoping;
- short-lived credentials;
- separate deployment environments;
- restricted AI tools;
- segmented infrastructure;
- independent failure domains;
- regional isolation where appropriate.

The objective is:

> compromise one component without compromising the enterprise.

---

## 13. AI Defensive Boundary

AI agents shall be treated as capability-bearing entities rather than inherently trusted software components.

Agents shall operate through:

- explicit identities;
- defined permissions;
- authorised tools;
- constrained data access;
- monitored actions;
- auditable decisions;
- human approval thresholds where required;
- containment mechanisms.

An AI agent shall not gain authority merely because another agent instructed it to perform an action.

The detailed AI security architecture remains governed by Part 3 and related ADRs.

---

## 14. Defensive Treatment of Walk Mode

Walk Mode shall be treated as a high-value physical/digital interaction surface.

The architecture shall protect:

- location;
- store maps;
- live inventory;
- shopper presence;
- proximity signals;
- device signals;
- navigation state;
- real-time events.

Walk Mode shall not expose another shopper's private information merely because devices are physically close to one another.

The three Walk Mode operating modes remain:

- Manual;
- AI Assisted;
- Autopilot.

Autopilot shall remain subject to the same security, authority and audit boundaries as other AI-assisted actions.

---

## 15. Defensive Treatment of WhatsApp

WhatsApp shall remain a communication and interaction channel, not a source of truth.

Commands received through WhatsApp shall be processed through the same:

- identity controls;
- authorisation controls;
- backend APIs;
- action policies;
- audit mechanisms;
- rate limits;
- fraud controls.

A WhatsApp message shall never bypass backend security merely because it originated from a recognised communication channel.

---

## 16. Supply-Chain Defence

The defensive boundary shall include external dependencies such as:

- suppliers;
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
- managed services.

Dependencies shall be evaluated according to their access, sensitivity, criticality and potential blast radius.

A trusted supplier shall not be treated as permanently trusted.

---

## 17. Development and Deployment Protection

Development, staging and production shall be separated according to risk.

Sensitive production credentials shall not be embedded in source code or client applications.

Build and deployment systems shall be treated as privileged infrastructure.

The architecture shall protect:

- source code;
- build credentials;
- deployment credentials;
- signing keys;
- package registries;
- artefacts;
- CI/CD pipelines;
- production access.

Compromise of a development environment shall not automatically provide production access.

---

## 18. Security Through Layering

No individual security mechanism shall be considered sufficient.

The architecture shall combine:

```text
Identity
+
Authorisation
+
Isolation
+
Validation
+
Rate / Abuse Controls
+
Monitoring
+
Detection
+
Containment
+
Recovery
```

This layered model shall apply across customers, staff, services, AI agents, devices and external integrations.

---

## 19. Defensive Observability

Security-relevant behaviour shall produce sufficient evidence to support:

- detection;
- investigation;
- attribution;
- containment;
- recovery;
- learning.

This shall align with the auditability and observability architecture established elsewhere in EDA-001 and the ADR set.

---

## 20. Continuous Defensive Improvement

The defensive architecture shall evolve as:

- new threats emerge;
- new attack techniques appear;
- new features are introduced;
- new integrations are added;
- new countries are entered;
- new AI capabilities are deployed;
- incidents occur;
- vulnerabilities are discovered;
- attackers adapt.

Security shall therefore be treated as a continuous engineering discipline.

---

## 21. Relationship With Part 3

Part 3 defines the enterprise security architecture.

Part 4 builds upon that architecture by focusing on active protection, defensive engineering, resilience, IP protection, attack resistance and protection against replication and hostile activity.

Part 4 does not replace Part 3.

The two parts operate together:

```text
EDA-001 Part 3
Security Architecture
        ↓
Identity / Trust / Access / Detection / Response
        ↓
EDA-001 Part 4
Defensive Engineering
        ↓
Resistance / IP Protection / Anti-Tampering / Resilience
```

---

## 22. Success Criteria

The Defensive Engineering Foundation succeeds when:

- critical authority remains server-side;
- clients are treated as untrusted;
- proprietary logic is appropriately isolated;
- APIs expose controlled capabilities;
- automated abuse can be detected and restricted;
- malware and compromised components are considered;
- AI capabilities are bounded;
- Walk Mode has explicit defensive boundaries;
- WhatsApp cannot bypass backend security;
- third-party dependencies are treated as security boundaries;
- compromise blast radius is limited;
- development and production access are separated;
- security evidence exists for significant defensive decisions;
- the platform can continuously improve its defensive posture.

---

## 23. Next Commit

Commit 002 establishes the **Platform Threat & Attack Model**, translating these defensive principles into a structured model of assets, threat actors, attack surfaces, trust boundaries, attack paths and attacker objectives.

Commit 003 establishes the **Three-Tier IP Protection Architecture** derived from those threats.
