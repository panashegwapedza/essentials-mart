# EDA-001 Part 4 — Commit 005
# Client Application Hardening & Anti-Tampering Architecture

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 005  
**Date:** 2026-08-18  
**Decision Type:** Client Security & Resilience Architecture  
**Parent Architecture:** EDA-001  
**Predecessors:** Commit 001 — Defensive Engineering Foundation; Commit 002 — Platform Threat & Attack Model; Commit 003 — Three-Tier IP Protection Architecture; Commit 004 — Software Supply-Chain Security Architecture

---

## 1. Purpose

This commit establishes the client-side hardening architecture for Essentials Mart applications.

The purpose is to make customer, staff and administrative client applications more resistant to:

- reverse engineering;
- repackaging;
- code modification;
- runtime tampering;
- debugging;
- dynamic instrumentation;
- credential and session abuse;
- automated abuse;
- extraction of sensitive implementation details;
- malicious or compromised client environments.

Client hardening is a **resilience layer**, not the primary security boundary.

The client is ultimately controlled by the user and must therefore be treated as untrusted.

OWASP's current mobile security guidance similarly treats anti-tampering, anti-static-analysis and anti-dynamic-analysis controls as defence-in-depth measures rather than substitutes for server-side security. citeturn0search0turn0search15

---

## 2. Core Principle

Essentials Mart shall follow the rule:

> **Never depend on the client to enforce authority that must be enforced by the backend.**

The client may:

- present information;
- collect input;
- perform authorised local processing;
- provide navigation;
- render Walk Mode;
- maintain temporary state;
- provide limited offline functionality;
- execute selected performance-sensitive computations.

The client shall not be the final authority for:

- identity;
- permissions;
- pricing;
- rewards;
- Trust Engine decisions;
- inventory authority;
- payment authority;
- order authority;
- household ownership;
- AI tool authority;
- privileged operations;
- security policy.

---

## 3. Client Security Model

The architecture shall follow:

```text
Client Device
     │
     ▼
Client Application
     │
     ├── Presentation
     ├── Local State
     ├── Secure Storage
     ├── Device Signals
     ├── Runtime Integrity Signals
     └── Limited Client Logic
     │
     ▼
Secure API Boundary
     │
     ▼
Authoritative Backend
     │
     ├── Identity
     ├── Authorisation
     ├── Business Rules
     ├── AI Authority
     ├── Commerce
     └── Security Decisions
```

Compromise of the client must not automatically compromise the backend.

---

## 4. Client Trust Assumptions

The architecture shall assume that an attacker may obtain:

- the application package;
- JavaScript or compiled client assets;
- WebAssembly modules;
- mobile binaries;
- source maps if accidentally released;
- network traffic visible from the device;
- locally cached data;
- runtime memory;
- client configuration;
- public API metadata;
- application resources.

The architecture shall also assume that a sufficiently capable attacker may:

- patch binaries;
- attach debuggers;
- instrument runtime execution;
- hook functions;
- modify local storage;
- replay requests;
- automate requests;
- run modified clients;
- execute the application in emulators or virtualised environments.

No client hardening control shall be described as permanently unbypassable.

OWASP explicitly notes that determined attackers with sufficient time and resources can eventually bypass client-side anti-debugging and similar controls. citeturn0search15

---

## 5. Client Application Classes

The architecture shall apply appropriate controls to:

### 5.1 Customer Applications

Including:

- Flutter mobile applications;
- web applications;
- future platform clients.

### 5.2 Staff Applications

Staff applications require stronger protection because they may expose:

- operational functionality;
- store information;
- inventory operations;
- customer-support capabilities;
- fulfilment operations;
- privileged workflows.

### 5.3 Administrative Applications

Administrative applications shall receive the highest client-hardening requirements because they may expose sensitive enterprise operations.

Administrative authority must nevertheless remain backend-enforced.

---

## 6. Release Build Security

Production builds shall be generated through controlled CI/CD processes.

Production builds shall:

- disable debug functionality;
- remove development diagnostics;
- minimise verbose logging;
- minimise exposed symbols;
- avoid shipping source maps unless required and separately protected;
- apply approved compiler optimisations;
- apply approved obfuscation where justified;
- enforce release signing;
- use controlled build artefacts;
- support reproducibility or provenance where practical;
- undergo security validation before release.

Debug builds shall never be distributed as production builds.

---

## 7. Code Obfuscation

Where client-side code contains security-relevant or commercially sensitive implementation details that cannot reasonably be moved server-side, obfuscation may be applied.

Potential techniques include:

- name obfuscation;
- control-flow transformation;
- instruction substitution;
- string protection;
- selective code splitting;
- dead-code insertion where justified;
- packing where justified;
- native-code hardening.

OWASP documents these techniques as ways to increase the effort required to understand application internals, while explicitly noting that they do not make reverse engineering impossible. citeturn0search7

Obfuscation shall therefore be treated as an **economic deterrence and resilience mechanism** rather than a confidentiality boundary.

---

## 8. WebAssembly Boundary

WebAssembly may be used for client-side functionality where there is a legitimate technical reason, including:

- high-performance computation;
- graphics-related processing;
- selected offline computation;
- specialised client-side algorithms.

WebAssembly shall not be used merely on the assumption that compiled code is impossible to reverse engineer.

Sensitive proprietary logic should remain server-side whenever practical.

Where WebAssembly is used, the architecture may apply:

- symbol reduction;
- controlled compilation;
- binary hardening;
- obfuscation where appropriate;
- integrity verification;
- runtime checks;
- minimal exposure of proprietary algorithms.

The authoritative implementation of high-value business logic shall remain server-side whenever feasible.

---

## 9. Flutter Client Hardening

The Flutter client shall follow secure release practices appropriate to its deployment platforms.

Controls may include:

- release-mode builds;
- symbol stripping;
- secure native configuration;
- protected secrets handling;
- platform integrity signals;
- application signing;
- runtime integrity checks;
- secure local storage;
- certificate/network protections where appropriate;
- controlled native libraries.

Flutter client code shall not contain permanent secrets whose disclosure would compromise the platform.

---

## 10. Web Client Hardening

The web application shall be treated as fully inspectable by the user.

The architecture shall therefore prioritise:

- server-side business logic;
- server-side authorisation;
- minimal client secrets;
- secure session management;
- Content Security Policy where appropriate;
- dependency integrity;
- build-time hardening;
- source-map protection;
- controlled API exposure;
- abuse detection.

JavaScript obfuscation may be used selectively to increase reverse-engineering cost, but it shall never be relied upon for security authority.

---

## 11. Application Integrity

Production applications shall be capable of validating relevant integrity signals.

Potential signals include:

- application signature;
- package identity;
- binary integrity;
- runtime modification indicators;
- platform integrity signals;
- installation source where available;
- device security posture where appropriate.

OWASP MASVS-RESILIENCE explicitly identifies application and platform integrity validation as resilience controls. citeturn0search1

Integrity signals shall be treated as **risk signals**, not unquestionable proof of trust.

---

## 12. Anti-Tampering

The application may detect attempts to modify:

- binaries;
- application resources;
- configuration;
- executable modules;
- runtime functions;
- security-relevant state.

Possible responses include:

- telemetry;
- capability restriction;
- re-authentication;
- session invalidation;
- forced update;
- temporary suspension;
- backend risk escalation.

Critical operations shall remain protected by backend controls even when tampering is not detected.

OWASP identifies anti-tampering as a dedicated resilience control because modified client applications can otherwise be used to alter intended functionality. citeturn0search2

---

## 13. Anti-Debugging

Where justified by the threat model, applications may detect or resist:

- attached debuggers;
- debug builds;
- runtime debugging;
- suspicious instrumentation.

Anti-debugging shall not be treated as a guaranteed prevention mechanism.

A detected debugging condition should normally feed the risk and response system rather than cause arbitrary destructive behaviour.

---

## 14. Anti-Dynamic Analysis

The application may detect indicators of:

- runtime instrumentation;
- hooking frameworks;
- modified execution paths;
- injected libraries;
- suspicious runtime environments.

OWASP MASVS-RESILIENCE includes anti-dynamic-analysis mechanisms as a specific resilience category. citeturn0search6

The implementation shall avoid unnecessary false positives that could lock legitimate users out of the platform.

---

## 15. Rooted, Jailbroken and Compromised Devices

Where technically and commercially appropriate, the application may evaluate device integrity signals such as:

- rooted Android devices;
- jailbroken iOS devices;
- compromised platform security;
- emulator environments;
- suspicious runtime environments.

The system shall distinguish between:

**Detection**

and

**Authorisation**.

A device-integrity signal may influence risk decisions but shall not automatically substitute for backend authorisation.

OWASP notes that platform-integrity controls can also introduce platform lock-in and false positives, so deployment must consider legitimate-user impact. citeturn0search0

---

## 16. Runtime Application Self-Protection

Where justified, selected client components may implement Runtime Application Self-Protection (RASP)-style controls.

Potential signals include:

- runtime tampering;
- unexpected code modification;
- debugger attachment;
- hooking;
- compromised execution environments;
- modified resources.

Potential responses include:

```text
Detect
  ↓
Classify
  ↓
Record Signal
  ↓
Re-evaluate Risk
  ↓
Restrict Sensitive Capability
  ↓
Notify Backend
  ↓
Require Recovery / Update if Necessary
```

RASP shall be implemented selectively because it adds application complexity and can affect performance and compatibility. OWASP describes RASP as an embedded runtime defence mechanism for detecting and responding to attacks from within the application environment. citeturn0search12

---

## 17. Secure Local Storage

Client applications shall minimise sensitive local persistence.

Where sensitive data must be stored locally, appropriate platform security mechanisms shall be used.

The client shall avoid storing unnecessary:

- authentication credentials;
- long-lived tokens;
- payment secrets;
- privileged credentials;
- AI system instructions;
- proprietary algorithms;
- sensitive household data.

Local storage shall be treated as potentially recoverable by an attacker controlling the device.

---

## 18. Session & Token Protection

Client applications shall:

- minimise token lifetime where appropriate;
- protect refresh mechanisms;
- avoid exposing tokens to unnecessary application components;
- securely clear invalidated credentials;
- detect suspicious session conditions where possible;
- rely on backend session validation.

Tokens shall not be treated as proof that the client itself is trustworthy.

---

## 19. Certificate and Network Protections

Client applications shall use secure transport for backend communication.

Where justified by the threat model, additional protections may include:

- certificate validation;
- certificate pinning or equivalent mechanisms where operationally appropriate;
- secure DNS/network configuration;
- replay-resistant protocols;
- request signing for selected high-risk operations.

Network protections shall be designed with rotation and incident-response requirements in mind so that legitimate users are not unnecessarily locked out after certificate or infrastructure changes.

---

## 20. API Trust Boundary

The client shall interact with the backend through controlled APIs.

The backend shall independently validate:

- identity;
- authorisation;
- object ownership;
- request validity;
- business rules;
- transaction state;
- risk conditions;
- rate limits;
- capability permissions.

A modified client shall therefore be unable to simply unlock privileged functionality by changing local UI state.

---

## 21. Client-Side Business Logic Boundary

The following should generally remain server-authoritative:

- pricing;
- promotion eligibility;
- reward calculations;
- Trust Engine decisions;
- fraud decisions;
- inventory authority;
- order state;
- payment decisions;
- household permissions;
- AI agent authority;
- sensitive recommendation logic;
- proprietary scoring.

Client-side implementations may render or assist these processes, but the final result must be validated by the backend.

---

## 22. AI Client Boundary

AI-related client components shall receive only the information and capabilities necessary for the user experience.

The client shall not contain:

- master AI credentials;
- unrestricted agent credentials;
- unrestricted tool credentials;
- privileged system prompts where avoidable;
- proprietary model weights;
- security-critical agent policies as the sole enforcement mechanism.

AI tool permissions shall be enforced server-side.

A modified client must not be able to grant itself additional AI capabilities.

---

## 23. Walk Mode Client Boundary

Walk Mode requires additional protection because the client may display:

- store maps;
- navigation information;
- product locations;
- live inventory signals;
- shopper-contextual information.

The client shall receive only the information authorised for the current shopper, store, session and context.

Walk Mode must not rely on client-side filtering as the sole mechanism preventing access to sensitive store or shopper information.

---

## 24. Offline Functionality Boundary

Where offline functionality is provided, the system shall explicitly define:

- what data may be cached;
- what actions may be performed offline;
- what actions require online verification;
- how offline actions are queued;
- how conflicts are resolved;
- how replay is prevented;
- how stale permissions are handled.

High-risk operations shall require authoritative backend validation before completion.

---

## 25. Bot and Automation Resistance

Client hardening shall operate together with server-side bot and abuse controls.

The client may provide signals such as:

- application integrity;
- device integrity;
- abnormal runtime conditions;
- interaction anomalies.

The backend shall provide authoritative controls including:

- rate limiting;
- quotas;
- behavioural detection;
- risk scoring;
- challenge mechanisms;
- session restrictions;
- account controls;
- IP/network controls where appropriate.

A modified client must not bypass server-side rate limits.

---

## 26. Anti-Scraping Boundary

Client hardening shall not be considered a complete anti-scraping mechanism.

The platform shall instead reduce scrape value through:

- authenticated access;
- object-level authorisation;
- pagination controls;
- rate limits;
- quotas;
- behavioural detection;
- response minimisation;
- dynamic abuse controls;
- anomaly monitoring.

High-value proprietary data shall not be unnecessarily exposed through public client endpoints.

---

## 27. Update and Forced-Upgrade Strategy

The platform shall maintain the ability to retire vulnerable client versions.

The backend may identify:

- unsupported versions;
- vulnerable versions;
- revoked builds;
- compromised builds;
- expired versions.

Responses may include:

- warning;
- restricted functionality;
- mandatory update;
- session invalidation;
- build revocation.

Emergency update mechanisms shall be designed before production deployment.

---

## 28. Build and Signing Integrity

Client release artefacts shall be:

- built through controlled pipelines;
- signed using protected credentials;
- traceable to a source revision;
- associated with release metadata;
- validated before publication.

Signing keys shall not be embedded in source repositories or developer workstations without appropriate protection.

This requirement connects directly to Commit 004's software supply-chain architecture.

---

## 29. Telemetry and Detection

Client resilience signals shall be useful to the wider security architecture.

Relevant telemetry may include:

- unexpected application integrity failures;
- suspicious runtime conditions;
- repeated modified-client use;
- abnormal API patterns;
- unusual device/session combinations;
- repeated failed integrity checks;
- suspicious automation.

Telemetry shall avoid unnecessary collection of personal information.

Security telemetry shall be governed by the privacy and security architectures established elsewhere in EDA-001.

---

## 30. Progressive Response

A detected client anomaly shall not automatically trigger the most severe response.

The system should support progressive responses such as:

```text
Low Risk
  ↓
Monitor
  ↓
Moderate Risk
  ↓
Increase Verification
  ↓
High Risk
  ↓
Restrict Sensitive Actions
  ↓
Critical Risk
  ↓
Suspend / Revoke / Contain
```

This reduces false positives and limits unnecessary disruption.

---

## 31. Client Security vs IP Protection

Client hardening protects two related but distinct objectives.

### Security Objective

Reduce the ability to:

- modify application behaviour;
- bypass intended controls;
- steal sessions;
- automate abuse;
- exploit client-side weaknesses.

### IP Objective

Increase the effort required to:

- understand proprietary client logic;
- extract algorithms;
- reproduce implementation details;
- reconstruct workflows.

These objectives shall not be confused.

A client-hardening control that increases reverse-engineering effort does not make the underlying code secret.

---

## 32. Legal and Commercial Boundary

Technical hardening shall operate alongside legal protection.

Potential protections include:

- copyright;
- trade secrets;
- contractual restrictions;
- confidentiality agreements;
- patents where legally appropriate;
- licensing controls;
- proprietary service terms.

Legal protection shall not be represented as a technical security mechanism, and technical hardening shall not be represented as legal protection.

---

## 33. Testing Requirements

Client resilience shall be tested against realistic attack scenarios including:

- application repackaging;
- binary modification;
- runtime hooking;
- debugging;
- instrumentation;
- modified clients;
- insecure storage extraction;
- token theft;
- API replay;
- API tampering;
- bot automation;
- scraping;
- compromised devices;
- emulator execution;
- reverse engineering;
- WebAssembly analysis where applicable.

OWASP MASVS provides dedicated resilience controls for platform integrity, anti-tampering, anti-static-analysis and anti-dynamic-analysis. citeturn0search0turn0search4turn0search6

---

## 34. False-Positive and Accessibility Considerations

Client-hardening controls shall not unnecessarily exclude legitimate users.

The architecture shall consider:

- alternative Android distributions;
- accessibility tools;
- legitimate debugging environments;
- device diversity;
- older devices;
- connectivity limitations;
- regional platform differences.

OWASP specifically warns that platform-specific integrity mechanisms can create platform lock-in and exclude legitimate users. citeturn0search0

Controls shall therefore be proportionate to risk.

---

## 35. What Must Never Be Done

Essentials Mart shall not:

- place master secrets in the client;
- place unrestricted backend credentials in the client;
- trust client-calculated prices as authoritative;
- trust client-calculated reward eligibility;
- trust client-calculated permissions;
- rely exclusively on obfuscation;
- rely exclusively on WebAssembly;
- assume native code cannot be reverse engineered;
- assume anti-debugging is undefeatable;
- store unnecessary sensitive data locally;
- use client hardening as a substitute for server-side security.

---

## 36. Relationship With Previous Part 4 Commits

### Commit 001 — Defensive Engineering Foundation

Provides the principles of:

- assume breach;
- client untrustedness;
- defence in depth;
- progressive response;
- blast-radius reduction.

### Commit 002 — Platform Threat & Attack Model

Defines the threats addressed by this architecture, including:

- reverse engineering;
- malware;
- spyware;
- bots;
- API abuse;
- compromised devices;
- IP extraction.

### Commit 003 — Three-Tier IP Protection Architecture

Defines client hardening as **Tier 2** of the IP protection model while maintaining server-side isolation as Tier 1.

### Commit 004 — Software Supply-Chain Security

Defines the controlled build and dependency environment from which trusted client artefacts must originate.

---

## 37. Relationship With EDA-001 Part 3

Part 3 establishes the enterprise security architecture.

This commit operationalises the client-facing portion of those security principles.

Part 3 remains authoritative for:

- identity;
- authorisation;
- network security;
- data security;
- API security;
- AI security;
- security monitoring;
- incident response.

Part 4 adds resilience against attackers operating from the client environment.

---

## 38. Success Criteria

Commit 005 succeeds when:

- the client is explicitly treated as untrusted;
- sensitive authority remains server-side;
- production builds are hardened;
- application integrity can be evaluated;
- tampering can be detected;
- static analysis resistance is applied where justified;
- dynamic-analysis resistance is applied where justified;
- appropriate runtime protection can be used;
- WebAssembly is treated as hardening rather than secrecy;
- obfuscation is treated as resilience rather than confidentiality;
- Flutter applications follow controlled release practices;
- web applications minimise exposed proprietary logic;
- sensitive local storage is minimised;
- AI authority remains backend-controlled;
- Walk Mode data remains server-authorised;
- offline functionality has explicit security boundaries;
- bot and scraping controls remain server-enforced;
- vulnerable client versions can be retired;
- build and signing integrity are protected;
- client security telemetry feeds the wider security architecture;
- false positives and legitimate-user access are considered;
- the architecture remains consistent with the Three-Tier IP Protection Model.

---

## 39. Next Commit

The next commit shall establish the:

**Runtime Threat Detection, Bot Defence & Adaptive Abuse-Control Architecture**

This will define how Essentials Mart detects and responds to:

- bots;
- scraping;
- credential stuffing;
- automated fraud;
- abnormal sessions;
- API abuse;
- malware-related behaviour;
- account takeover indicators;
- distributed attacks;
- behavioural anomalies;
- coordinated abuse.

Client signals from Commit 005 will become one input into that broader defensive system, while backend telemetry remains authoritative.
