# EDA-001 Part 4 — Commit 022
# IP & Legal Protection Strategy

**Document ID:** EDA-001-P4-C022  
**Title:** IP & Legal Protection Strategy  
**Parent Architecture:** EDA-001 Part 4  
**Status:** Proposed  
**Commit:** 022  
**Canonical Path:** `docs/architecture/EDA/part-4/commits/022-ip-legal-protection-strategy.md`

---

## 1. Purpose

Commit 022 establishes the defensive architecture for protecting Essentials Mart's intellectual property, confidential information, proprietary technology, software, algorithms, intelligence, brands, designs, business methods, data assets and commercially sensitive know-how.

The architecture combines technical, contractual, operational and legal protections.

It does not assume that any single legal right or security control can prevent replication. The objective is to make valuable assets difficult to obtain, difficult to misuse, attributable when misused, and legally defensible where protection is available.

---

## 2. IP Protection Is Layered

Essentials Mart shall treat intellectual property protection as a layered system:

```text
Asset Identification
       ↓
Classification
       ↓
Technical Isolation
       ↓
Access Control
       ↓
Confidentiality / Contractual Controls
       ↓
IP Registration Where Appropriate
       ↓
Monitoring / Detection
       ↓
Evidence / Attribution
       ↓
Enforcement / Recovery
```

No layer substitutes for another.

---

## 3. IP Asset Inventory

The enterprise shall maintain an IP inventory covering, where applicable:

- source code;
- object code;
- algorithms;
- proprietary business rules;
- intelligence engines;
- AI Society coordination mechanisms;
- model configurations;
- prompts and system instructions;
- training and evaluation assets;
- recommendation logic;
- pricing intelligence;
- inventory intelligence;
- route optimisation logic;
- trust and fraud logic;
- datasets and derived datasets;
- product and service designs;
- UI and visual assets;
- trademarks and brand assets;
- documentation;
- architecture;
- customer and supplier network information;
- operational know-how;
- contracts;
- and commercially sensitive strategies.

Each material asset should have an identified owner and protection classification.

---

## 4. Protection Classification

IP assets should be classified according to exposure and commercial importance.

Conceptually:

```text
Public
Internal
Confidential
Restricted
Trade Secret / Strategic IP
```

The classification determines access, storage, transmission, disclosure and monitoring requirements.

---

## 5. Server-Side IP Isolation

Proprietary logic that does not need to execute on a customer device should remain server-side.

Examples include:

- recommendation algorithms;
- pricing algorithms;
- fraud/risk rules;
- inventory optimisation;
- route optimisation;
- intelligence-engine logic;
- proprietary ranking;
- matching logic;
- AI orchestration policy;
- economic decision rules;
- and sensitive data-processing pipelines.

The client should receive governed results rather than unnecessary proprietary implementation details.

---

## 6. Client-Side Hardening

Client-side code cannot be made completely secret because code delivered to a user's device can be inspected.

Where code must execute on the client, protection may include:

- minimisation;
- bundling;
- tree-shaking;
- obfuscation where justified;
- source-map protection;
- WebAssembly where technically appropriate;
- integrity verification;
- runtime tamper detection;
- and server-side authority enforcement.

Client hardening is a cost-increasing control, not an absolute confidentiality mechanism.

---

## 7. WebAssembly Boundary

WebAssembly may be used for performance-sensitive client functionality where appropriate.

It must not be treated as an unbreakable IP boundary.

Sensitive authority and proprietary decision-making should remain server-side even when a client component uses WebAssembly.

The use of WebAssembly must be justified by performance, execution or platform requirements rather than solely by the assumption that binary code cannot be reverse engineered.

---

## 8. Copyright Protection

Original software, documentation, graphics and other qualifying creative works may receive copyright protection according to applicable law.

WIPO notes that computer programs are generally protected by copyright, while copyright protects expression rather than underlying ideas, procedures or methods as such. citeturn0search0turn0search4

Copyright strategy should therefore cover appropriate:

- source code;
- object code;
- documentation;
- UI assets;
- illustrations;
- audiovisual material;
- written content;
- and other original works.

Registration or recordation strategies may be considered where useful in relevant jurisdictions.

---

## 9. Patent Strategy

Patent protection should be considered for genuinely novel technical inventions where the applicable jurisdiction permits protection and the invention satisfies the relevant patentability requirements.

Potential candidates may include technical mechanisms involving:

- novel distributed processing;
- technical data synchronisation;
- novel infrastructure mechanisms;
- technical AI system architecture;
- novel optimisation mechanisms with a technical effect;
- or other demonstrably novel technical solutions.

A feature should not be labelled patentable merely because it is implemented in software.

WIPO notes that software-related patentability varies by jurisdiction and that patentability generally requires criteria such as novelty and inventive step/non-obviousness. citeturn0search4turn0search10

Patent decisions must therefore be made with qualified IP counsel before public disclosure where patent rights may be relevant.

---

## 10. Trade Secret Strategy

Trade secrets should protect valuable information whose competitive value depends on remaining confidential.

Potential trade secrets include:

- source code;
- proprietary algorithms;
- model configurations;
- intelligence-engine implementation;
- internal thresholds;
- optimisation parameters;
- proprietary datasets;
- supplier economics;
- commercial strategies;
- internal operating procedures;
- and combinations of otherwise ordinary components whose secret combination creates competitive value.

WIPO identifies commercial value from secrecy, limited access and reasonable measures to maintain secrecy as core trade-secret characteristics. citeturn0search2turn0search6

---

## 11. Reasonable Secrecy Measures

Trade-secret protection requires actual confidentiality practices.

Essentials Mart shall therefore consider:

- least-privilege access;
- need-to-know restrictions;
- confidentiality markings;
- NDAs;
- employee confidentiality obligations;
- contractor confidentiality obligations;
- supplier confidentiality obligations;
- access logging;
- repository permissions;
- secret management;
- controlled documentation;
- secure development environments;
- and periodic access review.

WIPO specifically identifies access restrictions, confidentiality agreements and technological controls as measures supporting trade-secret protection. citeturn0search5

---

## 12. Contractor and Employee IP Ownership

Employment and contractor agreements should clearly address:

- ownership of work product;
- assignment of applicable IP rights;
- confidentiality;
- permitted use;
- return/destruction of confidential material;
- access termination;
- and post-engagement obligations permitted by applicable law.

The enterprise must avoid ambiguity regarding ownership of code, designs, inventions and documentation created for Essentials Mart.

---

## 13. Supplier and Partner IP

Third-party relationships must establish ownership and permitted use of:

- integrations;
- custom development;
- jointly created assets;
- data;
- models;
- configurations;
- documentation;
- and derivative works.

Contracts should distinguish:

```text
Essentials Mart IP
Third-Party IP
Licensed IP
Jointly Created IP
Customer-Owned Data
```

No contract should silently transfer strategic IP through ordinary integration or implementation work.

---

## 14. Open-Source Governance

Open-source software must be inventoried and governed.

The enterprise shall track, where material:

- package identity;
- version;
- licence;
- transitive dependencies;
- security status;
- modification status;
- attribution requirements;
- redistribution obligations;
- and compatibility with proprietary licensing strategy.

Open-source use must not accidentally impose incompatible obligations on proprietary Essentials Mart assets.

---

## 15. AI IP Protection

AI-related IP requires additional classification.

Protected assets may include:

- proprietary prompts;
- agent policies;
- orchestration logic;
- model-routing logic;
- evaluation frameworks;
- proprietary datasets;
- learned behavioural patterns;
- reward/ranking logic;
- intelligence-engine implementations;
- model configurations;
- and AI Society coordination mechanisms.

The AI defensive architecture in Commit 010 and intelligence-distillation protections in Commit 011 remain authoritative for technical AI extraction defence.

Commit 022 establishes the corresponding IP and legal protection layer.

---

## 16. Intelligence as IP

Commercially valuable intelligence may constitute protectable confidential know-how even when no single algorithm is independently novel.

Examples include combinations of:

- behavioural signals;
- optimisation rules;
- learned patterns;
- operational thresholds;
- supplier data;
- customer demand patterns;
- route data;
- pricing relationships;
- and domain-specific decision processes.

The combination itself may provide competitive value and therefore requires appropriate protection.

---

## 17. Brand and Trademark Protection

The enterprise should protect distinctive identifiers including, where appropriate:

- Essentials Mart name;
- logos;
- product/service marks;
- programme names;
- AI Society names;
- major feature names;
- and other distinctive commercial identifiers.

Trademark strategy must be jurisdiction-aware and coordinated with expansion plans.

---

## 18. Design Protection

Where legally appropriate, industrial/design protection may be considered for distinctive visual designs, interfaces or physical designs.

Design protection must be evaluated separately from copyright and trademark protection because the applicable requirements differ by jurisdiction.

---

## 19. Prior-Art and Freedom-to-Operate Review

Before filing patents or commercialising material inventions, Essentials Mart should consider:

- prior-art searches;
- competitor patent landscapes;
- freedom-to-operate analysis;
- open-source licence analysis;
- third-party licence obligations;
- and existing contractual restrictions.

Owning an IP right does not necessarily mean that implementation is free from third-party rights.

---

## 20. Public Disclosure Control

Potentially patentable inventions must be identified before public disclosure.

Public disclosure may affect patent rights in some jurisdictions.

Therefore:

```text
New Invention
      ↓
IP Review
      ↓
Patent / Trade Secret / Copyright / Other
      ↓
Disclosure Decision
      ↓
Publication / Filing / Confidential Retention
```

The enterprise should not publish technical details first and investigate patentability afterwards.

---

## 21. Repository and Source-Control Protection

Source repositories are strategic IP stores.

Controls should include:

- least-privilege repository access;
- branch protection;
- strong authentication;
- protected secrets;
- signed commits where appropriate;
- audit logs;
- access review;
- dependency controls;
- and controlled release processes.

Public repositories must contain only material intentionally designated for public release.

---

## 22. Build and Artifact Protection

Build outputs may contain valuable IP even when source code is unavailable.

Protect:

- CI/CD credentials;
- build configurations;
- signing keys;
- release artifacts;
- container images;
- package registries;
- mobile binaries;
- WebAssembly modules;
- and deployment manifests.

Artifact provenance should allow the enterprise to establish what was built, from which source and through which trusted process.

---

## 23. IP Extraction Detection

Technical monitoring should detect attempts to obtain protected IP through:

- bulk repository access;
- unusual source retrieval;
- API harvesting;
- repeated intelligence probing;
- unusual model queries;
- large-scale output collection;
- credential abuse;
- insider access anomalies;
- partner extraction;
- and suspicious downloads.

Commit 017 establishes the monitoring layer and Commit 011 establishes intelligence-extraction defence.

---

## 24. Evidence and Attribution

Where material IP misuse is suspected, the enterprise should preserve evidence sufficient to establish:

- what asset was accessed;
- by whom or what identity;
- when;
- through which mechanism;
- what was obtained or altered;
- what controls were bypassed;
- and what contractual or legal obligations applied.

Evidence handling must preserve integrity and comply with applicable law.

---

## 25. Anti-Replication Strategy

Essentials Mart shall use layered anti-replication controls:

```text
Proprietary Logic
      ↓
Server-Side Isolation
      ↓
API Boundary
      ↓
Client Hardening
      ↓
Intelligence Extraction Defence
      ↓
Monitoring
      ↓
Attribution
      ↓
Legal Protection
```

The goal is not to claim that replication is impossible.

The goal is to increase the cost, time, risk and legal exposure associated with unauthorised replication while preserving legitimate interoperability and customer access.

---

## 26. Legal Protection Does Not Replace Security

A patent, trademark, copyright or trade-secret claim does not prevent an attacker from accessing systems.

Security controls must therefore continue to protect the underlying asset.

Likewise, security controls do not replace legal protection where legal enforcement is appropriate.

---

## 27. Jurisdictional Strategy

IP rights and contractual protections vary across jurisdictions.

Essentials Mart shall therefore maintain jurisdiction-specific advice for material markets.

Potential markets may include:

- Zimbabwe;
- Southern Africa;
- India;
- United Kingdom;
- European Union;
- United States;
- and other future markets.

The architecture does not assume that a protection available in one jurisdiction automatically applies everywhere.

---

## 28. Legal Review Gate

Material decisions involving:

- patent filing;
- trademark registration;
- major licensing;
- trade-secret classification;
- IP assignment;
- open-source exceptions;
- major partner IP terms;
- litigation;
- or public disclosure of potentially protectable inventions

must receive appropriate qualified legal/IP review.

This document establishes architecture and governance requirements, not legal advice.

---

## 29. IP Lifecycle

Protected assets should follow a lifecycle:

```text
Created
  ↓
Identified
  ↓
Classified
  ↓
Ownership Established
  ↓
Protection Selected
  ↓
Protected
  ↓
Monitored
  ↓
Reviewed
  ↓
Licensed / Commercialised / Retained
  ↓
Retired or Reclassified
```

---

## 30. IP Protection Laws

1. Material IP must be identified and owned.
2. IP classification must reflect commercial importance and exposure.
3. Proprietary logic should remain server-side where practical.
4. Client hardening must not be treated as absolute confidentiality.
5. WebAssembly must not be treated as an unbreakable IP boundary.
6. Copyright, patent, trademark, design and trade-secret protections must be considered separately.
7. Patentability must be evaluated before material public disclosure.
8. Trade secrets require actual confidentiality measures.
9. Access to strategic IP must follow least privilege and need to know.
10. Employee and contractor IP ownership must be contractually addressed.
11. Supplier and partner IP rights must be explicit.
12. Open-source licences must be governed.
13. AI-related IP must be explicitly classified.
14. Proprietary intelligence must receive appropriate technical and legal protection.
15. Source repositories and build systems are strategic IP stores.
16. IP extraction attempts must be observable where technically feasible.
17. Material suspected misuse must preserve appropriate evidence.
18. Anti-replication controls must increase cost and attribution rather than claim impossibility.
19. Legal protection must complement, not replace, cybersecurity.
20. Jurisdiction-specific requirements must be respected.
21. Material IP decisions require qualified legal review where appropriate.
22. IP protection must be continuously reviewed as the platform evolves.

---

## 31. Architectural Relationship

Commit 022 integrates with the existing Part 4 defensive architecture:

```text
010 AI Defence
      ↓
011 Intelligence Protection
      ↓
017 Monitoring
      ↓
021 Adversarial Verification
      ↓
022 IP & Legal Protection
      ↓
Attribution / Enforcement
```

Commit 022 therefore does not replace the technical controls established earlier. It gives the protected assets an explicit **ownership, confidentiality, legal and enforcement boundary**.

---

## 32. Outcome

Essentials Mart shall treat intellectual property as a protected enterprise asset rather than an incidental by-product of software development.

The platform's competitive advantage may reside not only in source code, but in the combination of:

**technology + architecture + data + intelligence + algorithms + operational know-how + brand + network + learned behaviour.**

The protection strategy must therefore protect the whole competitive system.
