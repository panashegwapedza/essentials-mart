# EDA-001 Part 4 — Commit 003
# Three-Tier Intellectual Property Protection Architecture

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 003  
**Date:** 2026-08-17  
**Decision Type:** Intellectual Property Protection Architecture  
**Parent Architecture:** EDA-001  
**Predecessor:** EDA-001 Part 4 — Commit 002 — Platform Threat & Attack Model

---

## 1. Purpose

This commit establishes the three-tier intellectual property protection architecture for Essentials Mart.

The architecture protects proprietary technology through three complementary layers:

```text
                    ESSENTIALS MART IP
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   TIER 1: IP         TIER 2: CLIENT    TIER 3: LEGAL
     ISOLATION          HARDENING        PROTECTION
          │                │                │
      Server-side       Wasm /          Trade Secrets /
      authority         Obfuscation      Copyright /
      APIs              Integrity        Patents
```

The central architectural principle is:

> **The strongest protection for highly valuable proprietary logic is to avoid distributing that logic to an untrusted client in the first place.**

Client hardening shall therefore supplement server-side IP isolation rather than replace it.

Legal protection shall supplement technical protection rather than replace it.

No single protection mechanism shall be treated as sufficient on its own.

---

## 2. Threats Addressed

This architecture directly addresses threats identified in Commit 002, including:

- reverse engineering;
- source-code extraction;
- client application inspection;
- binary analysis;
- API probing;
- automated scraping;
- behavioural cloning;
- proprietary algorithm extraction;
- model and prompt extraction;
- business-rule extraction;
- IP theft;
- unauthorised redistribution;
- application tampering;
- client modification;
- credential and token abuse;
- competitive intelligence extraction.

The architecture also reduces the impact of a successful client compromise because critical authority remains on trusted backend systems.

---

## 3. IP Classification

Before implementation, Essentials Mart shall classify intellectual property into protection classes.

### 3.1 Tier A — Server-Only Proprietary IP

This category contains the highest-value logic and data.

Examples include:

- Trust Engine algorithms;
- Reward Intelligence logic;
- pricing intelligence;
- recommendation algorithms;
- inventory optimisation;
- demand forecasting;
- fraud intelligence;
- proprietary ranking logic;
- sensitive business rules;
- proprietary optimisation algorithms;
- proprietary data-processing pipelines;
- high-value AI orchestration logic;
- sensitive model prompts and policies;
- secret scoring formulas;
- proprietary datasets;
- internal risk models.

Tier A assets shall not be shipped to the client merely for convenience.

Where technically feasible, they shall execute only within controlled server-side or otherwise trusted execution environments.

### 3.2 Tier B — Client-Hardened IP

This category contains logic that genuinely needs client-side execution but still has meaningful proprietary value.

Examples may include:

- performance-sensitive calculations;
- graphics processing;
- specialised local processing;
- selected Walk Mode computations;
- offline-capable functionality;
- non-authoritative client-side algorithms.

Where justified, suitable components may be compiled to WebAssembly or otherwise hardened.

However, client-side execution shall never be assumed to provide confidentiality against a determined user.

### 3.3 Tier C — Presentation and Ordinary Client Code

This category contains functionality that does not require strong secrecy.

Examples include:

- presentation logic;
- routing;
- ordinary state management;
- accessibility behaviour;
- UI composition;
- non-sensitive client orchestration;
- visual components.

These components may be minified and optimised but shall not contain secrets or high-value proprietary algorithms.

---

## 4. Tier 1 — IP Isolation

Tier 1 is the primary protection layer.

Its objective is to minimise the amount of valuable intellectual property that ever reaches an untrusted device.

The architecture shall follow:

```text
Client
  │
  │ authorised request
  ▼
API / Gateway
  │
  ▼
Authorised Service
  │
  ▼
Proprietary Engine
  │
  ▼
Controlled Result
  │
  ▼
Client
```

The client receives the result required to perform the authorised user experience rather than the proprietary implementation that produced it.

---

## 5. Server-Side Authority

The backend shall remain authoritative for security-sensitive and commercially sensitive decisions.

Examples include:

- pricing decisions;
- reward eligibility;
- Trust Engine decisions;
- fraud decisions;
- inventory intelligence;
- recommendation ranking;
- entitlement decisions;
- high-value AI actions;
- account authority;
- household permissions;
- financial operations.

A client shall not be able to establish authority simply by modifying local code.

---

## 6. API-Only Exposure

Where proprietary logic is server-side, the client shall interact through controlled interfaces.

The API boundary shall expose:

- required inputs;
- authorised operations;
- necessary outputs;
- appropriate status information.

It shall not expose unnecessarily detailed implementation information.

The API shall not become a remote oracle that allows an attacker to reconstruct proprietary algorithms through unlimited queries.

Therefore, sensitive APIs shall incorporate appropriate:

- authentication;
- authorisation;
- rate limiting;
- quotas;
- abuse detection;
- request validation;
- output minimisation;
- anomaly detection;
- behavioural controls;
- logging;
- progressive restrictions.

---

## 7. Query-Resistance and Behavioural Protection

A proprietary algorithm can sometimes be inferred even when its source code is never exposed.

The platform shall therefore consider attacks based on repeated observations of:

- inputs;
- outputs;
- rankings;
- recommendations;
- pricing responses;
- reward responses;
- trust decisions;
- inventory responses.

Controls may include:

- response minimisation;
- rate limits;
- query quotas;
- behavioural detection;
- output precision reduction where appropriate;
- aggregation;
- randomisation where business-safe;
- access restrictions;
- anomaly detection;
- account reputation;
- progressive friction.

Security controls shall not be designed in a way that materially damages legitimate customer functionality without justification.

---

## 8. Service Boundary Protection

Proprietary engines shall be separated from public-facing components wherever practical.

The intended architecture is:

```text
Internet
   │
   ▼
Edge / Gateway
   │
   ▼
Application Services
   │
   ▼
Authorised Internal Interfaces
   │
   ▼
Protected Intelligence Services
   │
   ▼
Protected Data
```

The proprietary engine shall not be directly reachable from the public internet unless there is a compelling architectural requirement and compensating controls.

---

## 9. Secrets and Keys

Secrets shall never be embedded in:

- JavaScript bundles;
- WebAssembly modules;
- mobile application binaries;
- source repositories;
- public configuration;
- client-side environment variables intended to be secret.

Sensitive credentials and keys shall remain within appropriate server-side or managed secret systems.

Client-side cryptographic material shall not be treated as secret merely because it is obfuscated.

---

## 10. Tier 2 — Client Hardening

Tier 2 exists because some code must execute on the client.

Its purpose is to increase the cost of:

- inspection;
- modification;
- automated extraction;
- casual copying;
- behavioural analysis;
- tampering.

Tier 2 shall never be described as making client-side code impossible to reverse engineer.

Anything delivered to a user-controlled environment should be considered recoverable by a sufficiently capable adversary.

---

## 11. WebAssembly Use

WebAssembly may be used selectively for suitable client-side workloads.

Potential uses include:

- performance-sensitive computation;
- selected graphics processing;
- specialised local processing;
- offline-capable computation where appropriate;
- non-authoritative client-side algorithms.

WebAssembly shall not be used merely as a claim that proprietary logic is protected.

Wasm remains analysable and can be disassembled or reverse engineered. Current security research and practical analysis tooling demonstrate that Wasm is not a confidentiality boundary. citeturn0search1turn0search4

Therefore:

> **Wasm is a hardening mechanism, not a vault.**

---

## 12. WebAssembly Hardening

Where WebAssembly is used, appropriate hardening may include:

- release builds;
- removal of debug information;
- symbol stripping;
- minimisation of exported functions;
- minimisation of meaningful metadata;
- source-level obfuscation where justified;
- binary-level transformations where justified;
- integrity verification;
- controlled loading;
- runtime integrity checks;
- separation of sensitive and non-sensitive modules.

The security benefit shall be evaluated against performance, maintainability and operational complexity.

---

## 13. Client Code Obfuscation

Ordinary JavaScript/TypeScript client code may be subjected to appropriate obfuscation where its value justifies the cost.

Potential techniques include:

- identifier transformation;
- string protection;
- control-flow transformations;
- dead-code transformations;
- code splitting;
- runtime integrity checks;
- anti-tampering measures.

Obfuscation shall not be used to conceal secrets that should never have been shipped to the client.

---

## 14. Anti-Tampering

Client applications may implement integrity and tamper-detection mechanisms appropriate to their platform.

Potential signals include:

- unexpected application modifications;
- invalid build signatures;
- modified assets;
- unexpected runtime behaviour;
- unsupported execution environments;
- instrumentation indicators.

Detection shall feed into risk-based response rather than relying exclusively on immediate application termination.

---

## 15. Anti-Debugging

Where justified, client components may detect indicators of debugging or instrumentation.

However, anti-debugging shall be considered a friction mechanism rather than a security boundary.

Attackers with sufficient control of the execution environment can often bypass client-side anti-debugging controls.

Therefore the architecture shall never rely on anti-debugging to protect a secret that should instead remain server-side.

---

## 16. Dynamic Protection

Where appropriate, the client may receive dynamically generated or short-lived configuration, capability information or session-bound material.

This may reduce the usefulness of static extraction.

Examples include:

- short-lived capability tokens;
- signed configuration;
- server-provided feature configuration;
- session-bound authorisation;
- rotating identifiers;
- runtime integrity metadata.

Dynamic protection shall not be confused with secure storage of secrets on an untrusted client.

---

## 17. Split Execution

High-value operations may be divided between client and server.

```text
Client
  │
  ├── local computation
  │
  ▼
Authorised request
  │
  ▼
Server-side proprietary computation
  │
  ▼
Minimal result
  │
  ▼
Client presentation
```

This approach allows the client to remain responsive while keeping the most valuable logic outside the user's control.

---

## 18. Tier 3 — Legal Protection

Technical controls shall be complemented by legal and intellectual-property protections.

Potential protection mechanisms include:

- copyright;
- trade secrets;
- patents where appropriate;
- trademarks;
- contractual confidentiality;
- supplier agreements;
- employment agreements;
- contractor agreements;
- licensing terms;
- access agreements;
- confidentiality obligations.

The exact legal strategy shall be determined with qualified legal counsel in the relevant jurisdictions.

---

## 19. Trade Secret Protection

Trade-secret treatment shall be considered for proprietary information whose value depends on remaining confidential.

Potential trade secrets include:

- backend source code;
- algorithms;
- scoring systems;
- model prompts;
- proprietary datasets;
- optimisation techniques;
- internal business rules;
- security detection logic;
- Trust Engine logic;
- Reward Intelligence logic.

Technical architecture shall support trade-secret protection by restricting unnecessary access and distribution.

---

## 20. Patent Strategy Interface

Potentially patentable inventions shall be evaluated independently rather than assuming that all software functionality is patentable.

Candidate inventions may include genuinely novel technical methods or architectures where applicable.

Before public disclosure of potentially patentable inventions, Essentials Mart shall obtain appropriate professional intellectual-property advice regarding:

- novelty;
- inventive step/non-obviousness;
- patent eligibility;
- disclosure timing;
- jurisdiction;
- filing strategy;
- ownership.

A patent application may be strategically preferable where public disclosure is acceptable in exchange for enforceable rights.

A trade secret may be preferable where confidentiality can realistically be maintained.

This commit does not make a legal determination that any particular Essentials Mart invention is patentable.

---

## 21. Copyright Protection

Copyright protection shall apply to eligible original works, including where applicable:

- source code;
- documentation;
- visual assets;
- original graphics;
- written content;
- certain database structures or compilations where legally applicable.

Copyright shall complement, rather than replace, architectural protection.

---

## 22. Contractor and Supplier IP Controls

Third-party personnel and providers shall operate under explicit contractual and technical boundaries appropriate to the sensitivity of the work.

Controls may include:

- confidentiality agreements;
- IP assignment provisions;
- restricted repository access;
- least-privilege permissions;
- environment isolation;
- access logging;
- credential expiration;
- offboarding procedures;
- source-code access restrictions;
- separation of duties.

A contractor shall receive access to the minimum information required to perform the contracted function.

---

## 23. Development Environment Protection

The development environment is itself an IP boundary.

Protection shall include:

- repository access controls;
- branch protection;
- secret scanning;
- dependency controls;
- privileged-access restrictions;
- developer identity protection;
- environment separation;
- build integrity;
- audit logging;
- controlled production access.

Production credentials shall not be casually available to development environments.

---

## 24. Build and Release Integrity

The build pipeline shall protect proprietary code from unauthorised modification or extraction.

The architecture shall consider:

- authenticated source changes;
- protected branches;
- reproducible or verifiable builds where practical;
- dependency verification;
- artefact integrity;
- signed releases where appropriate;
- restricted release permissions;
- deployment audit trails.

A compromised build pipeline can undermine both server-side and client-side IP protection.

---

## 25. API Reverse-Engineering Resistance

The platform shall recognise that attackers may attempt to reconstruct functionality without obtaining source code.

Potential techniques include:

- systematic API probing;
- input/output mapping;
- endpoint enumeration;
- response timing analysis;
- response-difference analysis;
- automated account creation;
- scraping;
- behavioural modelling.

Controls shall therefore include appropriate combinations of:

- authentication;
- authorisation;
- rate limiting;
- quotas;
- bot detection;
- anomaly detection;
- output minimisation;
- abuse monitoring;
- account reputation;
- capability restrictions.

---

## 26. Bot and Scraping Protection

Public and semi-public interfaces shall be protected against automated extraction.

The defensive architecture may use:

- request-rate analysis;
- behavioural analysis;
- reputation signals;
- challenge mechanisms where appropriate;
- session integrity;
- quotas;
- endpoint-specific limits;
- progressive throttling;
- temporary restrictions;
- automated blocking.

Controls shall distinguish legitimate automation from abusive automation where practical.

---

## 27. Protection of AI Intellectual Property

AI-related proprietary assets shall include:

- system prompts;
- agent policies;
- tool definitions;
- orchestration rules;
- routing logic;
- evaluation methods;
- proprietary context;
- memory structures;
- proprietary datasets;
- agent permissions;
- Intelligence Engine logic.

Sensitive AI assets shall remain server-side wherever practical.

Client applications shall not receive unnecessary system prompts, privileged tool definitions or proprietary orchestration logic.

---

## 28. Protection of the AI Society

The AI Society shall be treated as proprietary architecture.

The client shall interact with authorised AI capabilities rather than receiving the complete internal architecture of:

- agents;
- permissions;
- coordination logic;
- tool routing;
- internal decision processes;
- privileged context.

The backend shall remain authoritative for AI capabilities and actions.

---

## 29. Protection of Trust and Reward Intelligence

The following shall remain protected server-side wherever practical:

- Trust Engine algorithms;
- reward eligibility logic;
- anti-fraud scoring;
- milestone validation;
- abuse detection;
- behavioural scoring;
- reputation calculations.

The client may display the result of a decision without receiving the complete logic used to derive that decision.

---

## 30. Walk Mode IP Protection

Walk Mode includes potentially valuable proprietary components such as:

- route optimisation;
- store navigation logic;
- product recognition;
- AI-guided movement;
- autonomous shopping logic;
- shelf interpretation;
- substitution intelligence;
- dynamic rerouting;
- interaction logic.

Where these capabilities contain proprietary intelligence, high-value decision logic shall remain server-side where latency and product requirements permit.

Client-side rendering and interaction logic may be hardened where justified.

---

## 31. WhatsApp Channel Protection

WhatsApp shall expose the same authorised capabilities as the core platform without becoming a separate copy of the AI architecture.

The channel shall communicate through controlled backend interfaces.

Sensitive AI logic shall remain within the same protected intelligence layer used by the application.

This prevents an attacker from treating WhatsApp as an easier path to proprietary backend functionality.

---

## 32. Protection Against IP Extraction Through Compromise

If a client device is compromised, the architecture shall assume that all client-delivered code may be copied.

The objective is therefore to ensure that compromise of the client does not expose:

- server-side source code;
- proprietary algorithms;
- master credentials;
- privileged service identities;
- backend secrets;
- internal architecture beyond what is operationally necessary.

If a development or production server is compromised, separate containment and incident-response controls from Part 3 and later Part 4 commits shall apply.

---

## 33. No Security-by-Obscurity Principle

Essentials Mart shall not rely solely on:

- minification;
- obfuscation;
- Wasm;
- hidden endpoints;
- undocumented APIs;
- client-side secrets;
- anti-debugging.

These measures may increase attacker effort but do not establish a fundamental confidentiality boundary.

The primary confidentiality boundary shall remain architectural isolation.

---

## 34. Protection-in-Depth Model

The complete model is:

```text
                    PROPRIETARY IP
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
        ISOLATION      HARDENING     LEGAL
             │            │            │
        Server-side     Wasm /       Trade Secret
        authority       Obfuscation   Copyright
             │            │            │
        API controls    Integrity     Patent
             │            │            │
        Rate limits     Anti-tamper   Contracts
             │            │            │
        Bot controls    Dynamic       Enforcement
             │           protection
             │            │
             └────────────┼────────────┘
                          │
                   DEFENCE IN DEPTH
```

---

## 35. Protection Priority

When deciding where a proprietary component should execute, the following priority shall apply:

```text
Can it remain server-side?
        │
       YES ──► Keep it server-side
        │
       NO
        │
        ▼
Can the client receive only a non-sensitive derivative?
        │
       YES ──► Send derivative / result
        │
       NO
        │
        ▼
Does client execution provide material product value?
        │
       YES ──► Harden client implementation
        │
       NO ──► Reconsider distribution
```

This prevents security concerns from becoming an excuse to distribute proprietary logic unnecessarily.

---

## 36. Security vs Performance Trade-Off

IP protection shall be balanced against:

- latency;
- offline capability;
- battery consumption;
- device compatibility;
- accessibility;
- reliability;
- development complexity;
- operational cost;
- user experience.

The most secure architecture is not automatically the best product architecture if it creates unacceptable customer experience.

Security decisions shall therefore be risk-based and documented.

---

## 37. Validation and Testing

The IP protection architecture shall be periodically tested through controlled exercises including:

- client bundle inspection;
- API enumeration testing;
- automated scraping simulation;
- bot simulation;
- reverse-engineering assessment;
- Wasm analysis;
- binary inspection;
- credential exposure testing;
- secret scanning;
- privilege-boundary testing;
- source-access review;
- dependency compromise simulation.

The objective is to measure how much proprietary information an attacker can realistically recover.

---

## 38. Success Criteria

Commit 003 is successful when:

- high-value IP has been classified;
- server-side IP isolation is the default for critical proprietary logic;
- client-side code is treated as recoverable;
- WebAssembly is treated as hardening rather than a confidentiality boundary;
- client obfuscation is used selectively;
- secrets are excluded from client applications;
- APIs are protected against extraction and abuse;
- bot and scraping resistance is incorporated;
- AI intellectual property is protected;
- Trust Engine and Reward Intelligence remain authoritative server-side;
- Walk Mode proprietary logic is appropriately protected;
- WhatsApp uses the same protected backend intelligence layer;
- development and build systems are recognised as IP boundaries;
- legal protection is integrated with technical protection;
- trade secrets and patent candidates can be evaluated deliberately;
- contractors and suppliers are included in the IP boundary;
- protection is layered rather than dependent on a single mechanism.

---

## 39. Relationship With Previous Architecture

Commit 002 identified reverse engineering, IP extraction, API probing, automated scraping, client compromise and supply-chain compromise as material threats.

Commit 003 converts those threats into an IP protection architecture.

Part 3 provides the security foundations, identity controls, auditability, supply-chain controls and infrastructure security required to support these boundaries.

The architecture therefore remains cross-linked rather than operating as an isolated anti-copying mechanism.

---

## 40. Next Commit

The next commit shall establish the:

**Client Application Hardening & Anti-Tampering Architecture**

It will define the concrete defensive boundary for:

- Flutter/mobile clients;
- web clients;
- JavaScript/TypeScript bundles;
- WebAssembly modules;
- application integrity;
- runtime integrity;
- tamper detection;
- device trust signals;
- client-side abuse resistance;
- secure update mechanisms;
- client compromise response.
