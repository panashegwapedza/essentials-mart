# EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering

**Status:** Proposed  
**Part:** EDA-001 Part 4  
**Parent Architecture:** EDA-001  
**Purpose:** Master index and scope baseline  
**Canonical commit directory:** `docs/architecture/EDA/part-4/commits/`

---

## 1. Purpose

EDA-001 Part 4 extends EDA-001 Part 3 — Security Architecture.

Part 3 defines the enterprise security architecture: trust, identity, access, data security, application security, API security, AI security, fraud and abuse architecture, monitoring, incident response, supply-chain security, infrastructure security and governance.

Part 4 does **not** recreate those controls.

Part 4 defines how Essentials Mart is hardened, defended, contained and recovered when adversaries deliberately attempt to bypass, manipulate, degrade or defeat the security architecture.

The distinction is:

```text
PART 3
Security Architecture
        ↓
Defines the security boundaries and controls
        ↓
PART 4
Defensive Engineering
        ↓
Makes those boundaries harder to defeat,
monitors hostile behaviour, contains compromise,
and verifies defensive resilience.
```

---

## 2. Canonical Documentation Rule

All Part 4 commit documents shall live under:

`docs/architecture/EDA/part-4/commits/`

The older path form:

`docs/architecture/EDA-001/part-4/commits/`

is **not canonical** and shall not be used for new Part 4 documents.

Individual commit numbers are chronological commit identifiers. They are **not required to equal the domain number/order** in the Part 4 subject index. Commit order may be dependency-driven.

---

## 3. Part 3 / Part 4 Boundary

### Part 3 — Security Architecture

Part 3 answers:

> **What security architecture does the platform use?**

It establishes security boundaries, identities, permissions, trust, data protection, AI security, monitoring, incident response, supply-chain security, infrastructure security and governance.

### Part 4 — Defensive Engineering

Part 4 answers:

> **How does the platform resist, detect, contain and recover when those boundaries are attacked or bypassed?**

Part 4 therefore focuses on hardening, attack resistance, adversarial modelling, IP isolation, client resilience, business-logic abuse resistance, bot and automation defence, cyber-threat defence, infrastructure resilience, defensive supply-chain measures, AI defensive engineering, intelligence protection, economic abuse resistance, containment, recovery, adversarial verification and defensive assurance.

---

## 4. Frozen Part 4 Subject Index

The Part 4 programme contains 25 subject domains:

1. Defensive Engineering Foundation
2. Threat & Attack Model
3. Three-Tier IP Protection
4. IP Exposure Classification
5. Client Application Resilience
6. Business Logic & API Protection
7. Active Abuse & Automation Defence
8. Cyber Threat Defence
9. Infrastructure & Network Defence
10. Supply-Chain & Dependency Defence
11. AI Defensive Architecture
12. AI Intelligence & Distillation Defence
13. Data & Intelligence Protection
14. Commerce & Economic Abuse Defence
15. Trust Engine Defensive Architecture
16. Platform Authenticity & Anti-Impersonation
17. Defensive Monitoring & Detection
18. Automated Defence & Containment
19. Incident Response Architecture
20. Platform Resilience & Continuity
21. Adversarial Testing & Defensive Verification
22. IP & Legal Protection Strategy
23. Global Defensive Scalability
24. Defensive Governance
25. Assurance, Traceability & Closure

This is the **subject index**, not a mandatory numerical sequence for commit IDs.

---

## 5. Current Commit Mapping

| Commit | Current subject | Part 4 purpose | Primary dependency / boundary |
|---|---|---|---|
| 001 | Defensive Engineering Foundation | Establish defensive philosophy, assume-breach, server authority, defence in depth, blast-radius reduction and progressive defence | Part 3 Security Architecture |
| 002 | Platform Threat & Attack Model | Model assets, actors, attack surfaces, trust boundaries, objectives, attack paths and impacts | Commit 001 |
| 003 | Three-Tier IP Protection Architecture | Establish server-side IP isolation, client hardening and legal protection as complementary layers | ADR-015; Commit 002 |
| 004 | Software Supply-Chain Security Architecture | Defend the software/technology supply chain against compromise, tampering and dependency abuse | Part 3 Supply-Chain Security; Commit 002 |
| 005 | Client Application Hardening & Anti-Tampering | Increase resistance to client inspection, modification, instrumentation and repackaging | Commit 003; ADR-013/015 |
| 006 | Runtime Threat Detection, Bot Defence & Adaptive Abuse Control | Detect and constrain hostile runtime behaviour, automation, scraping, account abuse, API abuse and resource exhaustion | Part 3 monitoring/abuse controls; Commits 002–005 |
| 007 | Business Logic & API Protection | Defend high-value business workflows and API surfaces against manipulation, enumeration, abuse and automated exploitation | Commit 006; Part 3 API/security architecture |
| 008 | Cyber Threat Defence & Application Attack Resistance | Defend application surfaces against hostile payloads, exploit attempts, malicious content and compromised clients | Commits 006–007 |
| 009 | Infrastructure & Network Defence | Harden network, workload, infrastructure, egress, administrative, operational and recovery boundaries; constrain lateral movement and infrastructure compromise | Commits 004, 006, 008; Part 3 infrastructure security |
| 010 | AI Defensive Architecture | Defend AI Society agents, models, tools, prompts, memory, agent communication and AI authority against runtime attacks and unsafe behaviour | Commits 006–009; ADR-007/008/009 |
| 011 | AI Intelligence & Distillation Defence | Protect proprietary intelligence, learned behaviour, model surfaces and intelligence engines against extraction, harvesting, distillation and functional replication | Commit 010; ADR-015; EDA-012 |
| 012 | Data & Intelligence Protection | Protect source data, derived intelligence, provenance, integrity, AI/RAG data, memory, training assets, backups and controlled data movement | Commit 011; ADR-005/015/016; Part 3 data security |

---

## 6. Scope Reconciliation of Existing Commits

### Commit 003 — IP Protection

Commit 003 is the Part 4 defensive expansion of the anti-replication principles already established by ADR-015.

It does not replace ADR-015.

The three tiers are:

- Tier 1 — IP Isolation
- Tier 2 — Client Hardening
- Tier 3 — Legal Protection

### Commit 004 — Supply Chain

Part 3 establishes the supply-chain security boundary and governance.

Commit 004 addresses the defensive engineering side: compromise resistance, dependency integrity, provenance, verification, isolation, containment, revocation and recovery.

### Commit 005 — Client Hardening

Commit 005 operationalises the client-resilience side of Commit 003. It does not treat obfuscation, WebAssembly or anti-debugging as a confidentiality or authorisation boundary. Critical authority remains server-side.

### Commit 006 — Runtime Defence

Commit 006 is the runtime defensive layer for bots, scraping, credential attacks, account takeover, API abuse, business-logic abuse, fraud automation, AI resource abuse, DDoS/resource exhaustion, compromised clients, event/notification abuse, Walk Mode abuse and WhatsApp abuse.

### Commit 007 — Business Logic & API Protection

Commit 007 establishes defensive protection around high-value business workflows and API surfaces. It complements Commit 006's runtime detection and Commit 008's application attack resistance.

### Commit 008 — Cyber Threat Defence

Commit 008 establishes application-layer resistance to hostile payloads, exploit attempts, malicious uploads, SSRF, injection, unsafe external responses and AI-related application attack paths.

### Commit 009 — Infrastructure & Network Defence

Commit 009 moves the defensive boundary below the application layer into infrastructure, network, workload and service-connectivity protection. It addresses segmentation, egress control, administrative isolation, workload isolation, infrastructure hardening, service credentials, database/broker exposure, DDoS/resource exhaustion, failure isolation, third-party connectivity, store/warehouse networks, deployment infrastructure, backup protection, telemetry, containment, safe degradation and recovery.

### Commit 010 — AI Defensive Architecture

Commit 010 establishes the defensive runtime boundary for the AI Society and Intelligence Engines. It addresses agent identity, model/provider boundaries, prompt and tool security, prompt injection, excessive agency, memory, RAG, AI communications, kill/quarantine controls, AI-specific monitoring and adversarial testing.

### Commit 011 — AI Intelligence & Distillation Defence

Commit 011 protects the intelligence advantage rather than the AI runtime itself. It addresses model/API extraction, behavioural harvesting, distillation, functional replication, query-based intelligence theft, intelligence-surface minimisation, proprietary engine protection, extraction detection and adaptive restriction.

### Commit 012 — Data & Intelligence Protection

Commit 012 protects the data foundation and intelligence lifecycle on which Commit 011 depends. It addresses classification, minimisation, encryption, integrity, provenance, poisoning, analytics integrity, AI data boundaries, RAG/vector stores, memory, training/evaluation data, secrets, backups, exfiltration, privileged access, multi-tenant isolation, privacy, regional boundaries, competitive intelligence and data reconstruction/recovery.

Commit 012 complements Commit 011 rather than duplicating it.

---

## 7. Forward Commit Sequence

The next dependency-aware sequence is:

- **013 — Commerce & Economic Abuse Defence**
- **014 — Trust Engine Defensive Architecture**
- **015 — Platform Authenticity & Anti-Impersonation**
- **016 — Defensive Monitoring & Detection**
- **017 — Automated Defence & Containment**
- **018 — Incident Response Architecture**
- **019 — Platform Resilience & Continuity**
- **020 — Adversarial Testing & Defensive Verification**
- **021 — IP & Legal Protection Strategy**
- **022 — Global Defensive Scalability**
- **023 — Defensive Governance**
- **024 — Assurance, Traceability & Closure**

Supply-chain defence and client resilience were brought forward as Commits 004 and 005 because they are dependency-critical. Their subjects will not be recreated later as duplicate commits.

---

## 8. Cross-Cutting Security Dependencies

Part 4 shall reference, but not duplicate, the relevant Part 3 architecture for:

- Identity & Access;
- AI Society;
- Trust Engine;
- Fraud Intelligence;
- Reward Intelligence;
- Walk Mode;
- WhatsApp integration;
- auditability;
- monitoring;
- supply chain;
- infrastructure;
- incident response;
- security governance;
- data ownership;
- privacy;
- event governance.

A Part 4 commit may implement defensive controls around these systems without redefining their underlying architectural ownership.

---

## 9. Forward-Consistency Rule

Before each new Part 4 commit is written, it shall be checked for:

1. direct dependencies;
2. affected Part 3 architecture;
3. affected ADRs;
4. overlap with existing Part 4 commits;
5. secondary impacts;
6. ownership boundaries;
7. terminology consistency;
8. security-control versus defensive-engineering distinction;
9. implementation sequencing;
10. remaining subject-index coverage.

No new commit shall knowingly create a contradiction with an earlier Part 4 commit.

---

## 10. Closure Requirement

EDA-001 Part 4 is complete only when all 25 subject domains are covered, every domain has a clear primary owner document, Part 3 and Part 4 boundaries are explicit, no commit exists solely as an accidental duplicate, cross-cutting controls have clear ownership, external dependencies are addressed where relevant, IP protection and anti-replication are covered, malware and cyber-threat defence are covered, bot/rate-limit/abuse controls are covered, AI-specific defensive controls are covered, infrastructure/network defence is covered, incident response and resilience are covered, adversarial verification is covered, governance and assurance are covered, and forward-consistency checks pass.

---

## 11. Status

**Part 4 status:** In progress  
**Current commit:** 012  
**Next commit:** 013 — Commerce & Economic Abuse Defence  
**Canonical Part 4 commit path:** `docs/architecture/EDA/part-4/commits/`
