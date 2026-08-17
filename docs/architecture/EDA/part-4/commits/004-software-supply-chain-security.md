# EDA-001 Part 4 — Commit 004
# Software Supply-Chain Security Architecture

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 004  
**Date:** 2026-08-17  
**Decision Type:** Supply-Chain Security Architecture  
**Parent Architecture:** EDA-001  
**Predecessor:** EDA-001 Part 4 — Commit 003 — Three-Tier IP Protection Architecture

---

## 1. Purpose

This commit establishes the software and technology supply-chain security architecture for Essentials Mart.

Essentials Mart will depend on a large ecosystem of first-party and third-party components, including:

- software libraries;
- Flutter dependencies;
- JavaScript and TypeScript packages;
- backend frameworks;
- SDKs;
- cloud services;
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
- managed services;
- CI/CD tooling;
- container images;
- build systems;
- deployment systems.

The purpose of this architecture is to ensure that compromise of one dependency does not automatically become compromise of Essentials Mart.

Supply-chain security shall cover the complete lifecycle:

```text
Selection
   ↓
Evaluation
   ↓
Acquisition
   ↓
Development
   ↓
Build
   ↓
Verification
   ↓
Release
   ↓
Deployment
   ↓
Runtime Monitoring
   ↓
Revocation / Replacement
```

---

## 2. Core Principle

No external dependency shall be trusted merely because it is popular, established, previously approved or widely used.

Trust shall be based on:

- provenance;
- integrity;
- security posture;
- required permissions;
- exposure;
- dependency behaviour;
- contractual obligations;
- operational necessity;
- monitoring;
- replaceability;
- blast radius.

A dependency shall receive only the capabilities required for its legitimate purpose.

---

## 3. Supply-Chain Trust Model

The supply chain shall be treated as a sequence of trust boundaries rather than a single trusted ecosystem.

```text
Source
  ↓
Dependency
  ↓
Build
  ↓
Artifact
  ↓
Distribution
  ↓
Deployment
  ↓
Runtime
```

Each stage shall have appropriate verification and integrity controls.

This follows the general principle used by SLSA, which provides incrementally stronger guarantees for software supply-chain integrity and provenance. Essentials Mart may use SLSA as a reference framework rather than assuming that SLSA alone provides complete supply-chain security. citehttps://slsa.dev/spec/v1.2/

---

## 4. Dependency Classification

Dependencies shall be classified according to their security and operational significance.

### Tier A — Critical Dependencies

Dependencies whose compromise could materially affect:

- identity;
- payments;
- customer data;
- AI authority;
- security controls;
- production infrastructure;
- core commerce;
- proprietary intelligence.

These require the highest level of review and monitoring.

### Tier B — Important Dependencies

Dependencies whose compromise could materially affect a significant feature or service but whose blast radius is limited by architecture.

### Tier C — Standard Dependencies

Low-risk components with limited privileges, limited data access and limited operational impact.

### Tier D — Development-Only Dependencies

Dependencies restricted to development or testing environments and prevented from reaching production unless explicitly approved.

---

## 5. Dependency Inventory

Essentials Mart shall maintain an authoritative inventory of material dependencies.

The inventory shall identify, where applicable:

- dependency name;
- version;
- source;
- owner;
- purpose;
- environment;
- licence;
- permissions;
- data access;
- network access;
- security classification;
- known vulnerabilities;
- provenance;
- update status;
- support status;
- replacement options;
- business criticality.

A Software Bill of Materials (SBOM) should be generated for material release artifacts where technically and operationally appropriate.

SBOMs and build provenance serve different purposes and should not be treated as interchangeable: SBOMs describe component composition, while provenance provides evidence about how an artifact was produced. citehttps://slsa.dev/spec/v1.2/about

---

## 6. Dependency Selection

Before a dependency is introduced into production, the platform shall evaluate:

- security history;
- maintenance activity;
- ownership;
- release practices;
- vulnerability history;
- dependency chain;
- licence compatibility;
- support lifecycle;
- provenance;
- integrity mechanisms;
- access requirements;
- data requirements;
- network requirements;
- exit strategy.

Popularity alone shall not be considered sufficient evidence of trustworthiness.

---

## 7. Dependency Least Privilege

Dependencies shall receive the minimum permissions required for their purpose.

A library shall not receive access merely because its host application has access.

Where architecture permits, dependencies shall be isolated through:

- service boundaries;
- process boundaries;
- network boundaries;
- container boundaries;
- API permissions;
- data access policies;
- separate credentials.

---

## 8. Dependency Provenance

The platform should establish where production software originates and how it was transformed before deployment.

Important evidence includes:

- source repository;
- commit or immutable source reference;
- dependency versions;
- build environment;
- build configuration;
- artifact identity;
- build timestamp;
- release identity;
- signing information;
- deployment identity.

Provenance shall be treated as security evidence rather than merely build metadata.

SLSA specifically describes provenance as a mechanism for increasing confidence that an artifact corresponds to its intended source and build process. citehttps://slsa.dev/spec/v1.2/

---

## 9. Artifact Integrity

Production artifacts shall be protected against unauthorised modification.

Controls may include:

- cryptographic hashes;
- signatures;
- signed releases;
- immutable artifact references;
- provenance attestations;
- controlled artifact repositories;
- deployment-time verification.

A production system shall not silently accept an artifact that fails required integrity verification.

---

## 10. Build-System Security

The build system is a privileged security boundary.

It shall therefore be protected against:

- compromised runners;
- malicious build parameters;
- injected dependencies;
- credential theft;
- build-script manipulation;
- artifact substitution;
- unauthorised workflow changes;
- malicious plugins;
- compromised developer accounts.

Build credentials shall be short-lived and scoped to the minimum required capability where practical.

---

## 11. CI/CD Supply-Chain Protection

The CI/CD pipeline shall include controls for:

- source integrity;
- branch protection;
- review requirements;
- dependency verification;
- secret protection;
- build isolation;
- artifact integrity;
- provenance;
- deployment authorisation;
- production environment separation.

Production deployment shall not depend on unverified local artifacts.

---

## 12. Dependency Update Security

Dependency updates shall be treated as controlled security changes.

Automated updates may be used, but production adoption shall remain subject to appropriate verification.

Updates shall be evaluated for:

- vulnerability fixes;
- breaking changes;
- malicious behaviour;
- unexpected permissions;
- transitive dependency changes;
- licence changes;
- runtime changes;
- performance impact.

Emergency security updates shall have an expedited but auditable path.

---

## 13. Vulnerability Management

Dependencies shall be continuously evaluated for known vulnerabilities.

The vulnerability process shall include:

```text
Discover
  ↓
Assess
  ↓
Prioritise
  ↓
Patch / Mitigate
  ↓
Verify
  ↓
Monitor
```

Risk shall be assessed using more than severity alone.

Relevant factors include:

- exploitability;
- exposure;
- affected functionality;
- data access;
- privilege level;
- blast radius;
- availability of mitigations;
- active exploitation indicators.

---

## 14. Malicious Dependency Detection

The platform shall consider the possibility that a dependency itself is malicious rather than merely vulnerable.

Indicators may include:

- unexpected network calls;
- unexplained data collection;
- obfuscated behaviour;
- credential access;
- suspicious install scripts;
- unexpected binaries;
- sudden ownership changes;
- suspicious release patterns;
- dependency substitution;
- typosquatting;
- dependency confusion.

High-risk dependencies may require manual review or additional isolation.

---

## 15. Dependency Confusion & Typosquatting

Package acquisition shall minimise the risk of accidentally consuming a malicious package that imitates an intended dependency.

Controls should include:

- trusted registries;
- explicit package sources;
- package-locking;
- version pinning where appropriate;
- package namespace controls;
- verification of package ownership;
- internal package repositories where justified.

The dependency graph shall be treated as recursive: dependencies can introduce dependencies of their own, multiplying the potential attack surface. This recursive nature is explicitly recognised in modern software supply-chain threat models. citehttps://slsa.dev/spec/v1.1/threats

---

## 16. AI Supply Chain

AI dependencies shall receive specialised treatment.

This includes:

- foundation models;
- hosted AI providers;
- model APIs;
- embeddings;
- vector databases;
- model-serving infrastructure;
- agent frameworks;
- AI SDKs;
- model weights;
- evaluation datasets;
- training datasets.

Security evaluation shall include:

- model provenance;
- provider security;
- data handling;
- retention;
- model update behaviour;
- tool permissions;
- model isolation;
- prompt/context exposure;
- provider outage risk;
- provider lock-in;
- replacement capability.

---

## 17. AI Provider Boundaries

An external AI provider shall not automatically receive unrestricted access to Essentials Mart data.

Data sent to an external AI provider shall be governed by:

- data classification;
- purpose limitation;
- user permissions;
- agent permissions;
- provider agreement;
- retention policy;
- regional requirements;
- security requirements.

Sensitive business logic should remain within Essentials Mart-controlled systems where feasible.

---

## 18. Third-Party API Security

External APIs shall be treated as untrusted integration boundaries.

Controls shall include:

- authentication;
- authorisation;
- scoped credentials;
- request validation;
- response validation;
- rate limits;
- timeouts;
- circuit breakers;
- monitoring;
- retry controls;
- failure isolation.

The platform shall not assume that a valid third-party response is necessarily safe or correct.

---

## 19. Critical External Providers

The following providers shall receive explicit supply-chain treatment:

- payment providers;
- WhatsApp;
- mapping providers;
- delivery providers;
- cloud providers;
- analytics providers;
- AI providers;
- infrastructure providers.

Each critical provider shall have:

- defined trust boundary;
- defined data boundary;
- defined permissions;
- failure behaviour;
- monitoring;
- credential lifecycle;
- revocation mechanism;
- fallback strategy where practical;
- replacement or exit consideration.

---

## 20. WhatsApp Supply-Chain Boundary

WhatsApp shall remain a channel rather than a source of truth.

The architecture shall ensure:

```text
WhatsApp
   ↓
Channel Boundary
   ↓
Identity / Permission Verification
   ↓
AI Society / Action Layer
   ↓
Authorised Backend Operation
```

A compromise or misuse of the WhatsApp channel shall not grant direct database authority.

---

## 21. Payment Provider Boundary

Payment providers shall be isolated from unrelated Essentials Mart systems.

Payment integrations shall minimise:

- credential exposure;
- payment-data exposure;
- replay opportunities;
- transaction manipulation;
- dependency blast radius.

Payment provider failure shall not automatically compromise ordinary shopping functionality.

---

## 22. Mapping Provider Boundary

Mapping services shall receive only the location information necessary for their authorised function.

Walk Mode shall avoid exposing unnecessary customer or shopper information to external mapping systems.

Mapping-provider compromise shall not expose the broader household or commerce domain.

---

## 23. Delivery Provider Boundary

Delivery providers shall receive only the information required for fulfilment.

Delivery integration shall isolate:

- customer identity;
- address information;
- order information;
- delivery status;
- driver or courier information.

The provider shall not receive unrestricted access to household, financial or AI information.

---

## 24. Analytics Provider Boundary

Analytics systems shall be separated from operational source-of-truth systems.

Analytics providers shall receive only approved telemetry.

Sensitive information shall be minimised, anonymised or pseudonymised where appropriate.

Analytics compromise shall not provide a route into transactional systems.

---

## 25. Contractor & Managed-Service Security

Contractors and managed-service providers shall be treated as external privileged entities where they require access.

Controls shall include:

- individual identities;
- least privilege;
- time-limited access;
- approval requirements;
- activity logging;
- access review;
- credential revocation;
- separation of duties.

Shared credentials shall be prohibited wherever technically practical.

---

## 26. Third-Party Credential Security

External integration credentials shall be:

- centrally managed;
- encrypted;
- scoped;
- rotated;
- monitored;
- revocable;
- separated by environment.

Production credentials shall not be reused in development or staging.

---

## 27. Compromised Dependency Response

The platform shall maintain a defined response for a compromised dependency.

```text
Detection
   ↓
Risk Assessment
   ↓
Containment
   ↓
Credential Revocation
   ↓
Dependency Isolation
   ↓
Replacement / Rollback
   ↓
Integrity Verification
   ↓
Recovery
   ↓
Post-Incident Review
```

The ability to replace a dependency shall be considered an architectural resilience requirement.

---

## 28. Dependency Revocation

Critical dependencies shall have a defined mechanism for rapid removal, disabling or replacement.

Where practical, the architecture shall avoid irreversible coupling to a single provider.

Provider lock-in shall be considered a security and resilience risk where it prevents effective response to provider compromise or failure.

---

## 29. Environment Separation

Supply-chain risk shall be contained between:

```text
Development
     ↓
Testing
     ↓
Staging
     ↓
Production
```

Development dependencies shall not automatically become production dependencies.

Production systems shall use controlled, verified artifacts.

---

## 30. Secrets & Supply Chain

Secrets shall never be embedded in:

- source code;
- mobile applications;
- JavaScript bundles;
- WebAssembly artifacts;
- public repositories;
- client configuration.

Where a third-party service requires a credential, the credential shall normally be held server-side.

This directly supports the Tier 1 IP isolation established in Commit 003.

---

## 31. Open-Source Security

Open-source software shall be treated as a valuable and useful part of the ecosystem while recognising its security risks.

The platform shall consider:

- maintenance status;
- known vulnerabilities;
- maintainer changes;
- package ownership;
- release integrity;
- transitive dependencies;
- licence requirements;
- abandonment risk.

No assumption shall be made that open-source software is inherently safe or inherently unsafe.

---

## 32. Supply-Chain Monitoring

The platform shall monitor material supply-chain signals including:

- vulnerability disclosures;
- dependency changes;
- suspicious releases;
- provider incidents;
- certificate changes;
- package ownership changes;
- unexpected behaviour;
- provider availability;
- provider security events.

Critical dependencies shall have higher monitoring requirements.

---

## 33. Supply-Chain Attack Scenarios

The architecture shall consider at minimum:

### Compromised Package

A legitimate dependency is modified to contain malicious code.

### Dependency Confusion

A malicious package is substituted for an intended internal or external dependency.

### Compromised Build Runner

An attacker compromises the build environment and modifies artifacts.

### Compromised Developer Account

An attacker uses a legitimate developer identity to introduce malicious changes.

### Malicious AI Model

A model or model artifact contains behaviour that compromises confidentiality, integrity or safety.

### Provider Compromise

A trusted external provider is compromised.

### Credential Theft

Third-party credentials are stolen and used to access production resources.

### Malicious Contractor

A contractor abuses legitimate access to extract information or modify systems.

### Provider Outage

A critical provider becomes unavailable and disrupts platform functionality.

### Provider Termination

A provider becomes unavailable permanently or commercially unsuitable, requiring replacement.

---

## 34. Supply-Chain Resilience

Security shall not depend solely on preventing compromise.

Essentials Mart shall also be designed to survive compromise or failure through:

- isolation;
- redundancy;
- graceful degradation;
- provider substitution;
- credential revocation;
- rollback;
- backups;
- independent monitoring;
- controlled recovery.

---

## 35. Evidence & Auditability

Material supply-chain decisions shall be auditable.

Evidence should include:

- dependency approvals;
- security reviews;
- vulnerability assessments;
- SBOMs;
- provenance records;
- build records;
- artifact signatures;
- deployment records;
- provider assessments;
- access reviews;
- incident records.

This integrates supply-chain security with the auditability architecture established elsewhere in EDA-001 and the ADR system.

---

## 36. Relationship With Commit 002

Commit 002 established the threat model and identified supply-chain compromise as a major attack surface.

Commit 004 translates that threat category into architectural controls for:

- dependencies;
- build systems;
- providers;
- artifacts;
- integrations;
- AI supply chains;
- contractor access.

---

## 37. Relationship With Commit 003

Commit 003 established the Three-Tier IP Protection Architecture.

Commit 004 supports that architecture by protecting the software and infrastructure through which proprietary systems are built and delivered.

In particular:

```text
IP Isolation
      ↓
Secure Build
      ↓
Verified Artifact
      ↓
Controlled Deployment
      ↓
Protected Runtime
```

Protecting source code while allowing a compromised build pipeline to modify the resulting artifact would defeat the intended protection boundary.

---

## 38. Reference Frameworks

Essentials Mart may use established industry frameworks and specifications as reference points rather than treating any single framework as a complete security solution.

SLSA Version 1.2 is the current approved SLSA specification and provides incrementally adoptable supply-chain security guidance, including build and source tracks and provenance concepts. citehttps://slsa.dev/spec/v1.2/

SLSA explicitly notes that it does not by itself cover every aspect of supply-chain security, including code quality and producer trust, reinforcing the need for Essentials Mart to combine supply-chain controls with its wider security architecture. citehttps://slsa.dev/spec/v1.2/about

---

## 39. Success Criteria

Commit 004 succeeds when:

- material dependencies are inventoried;
- dependencies are classified by risk;
- critical dependencies receive stronger controls;
- dependency provenance is considered;
- production artifacts can be verified;
- build systems are treated as privileged boundaries;
- CI/CD supply-chain risk is controlled;
- SBOM generation is incorporated where appropriate;
- vulnerability monitoring exists;
- malicious dependency scenarios are considered;
- AI supply-chain risk is explicitly addressed;
- third-party APIs are isolated;
- WhatsApp, payment, mapping, delivery and analytics boundaries are defined;
- contractor and managed-service access is controlled;
- third-party credentials are protected;
- dependency compromise has a response path;
- critical dependencies can be revoked or replaced;
- development and production dependencies are separated;
- supply-chain evidence is auditable;
- the architecture remains consistent with Commit 002 and Commit 003.

---

## 40. Next Commit

The next commit shall establish the:

**Client Application Hardening & Anti-Tampering Architecture**

This will define how Essentials Mart protects the client-side attack surface through:

- application integrity;
- runtime tamper detection;
- secure configuration;
- WebAssembly where justified;
- JavaScript/TypeScript hardening;
- reverse-engineering resistance;
- API abuse resistance;
- device-risk signals;
- anti-debugging measures where appropriate;
- secure update mechanisms;
- client compromise containment.

The client shall remain an untrusted execution environment even after hardening.
