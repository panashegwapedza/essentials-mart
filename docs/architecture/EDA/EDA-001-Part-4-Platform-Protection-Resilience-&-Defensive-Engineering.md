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
| 013 | Commerce & Economic Abuse Defence | Protect commerce, payments, discounts, rewards, subscriptions, wallets, inventory and other value-dispensing workflows from economic abuse | Commits 006–012; Part 3 fraud, abuse and commerce controls |
| 014 | API & Service Boundary Defence | Deepen the defensive API boundary established by Commit 007, covering zero-trust service identity, object/property/function authorisation, resource controls, sensitive business flows, SSRF, webhooks, API inventory, external API consumption and API lifecycle security | Commit 007; Commits 009, 010, 013; Part 3 API/security architecture |
| 015 | Trust Engine Defensive Architecture | Defend continuous trust assessment, trust signals, risk-based controls, trust provenance, adaptive access, AI-agent trust, partner trust, trust manipulation resistance and safe failure of the Trust Engine | Commits 006, 010, 012, 014; Part 3 Trust Engine / Identity & Access / Fraud architecture |

**Important:** Commit 014 does not recreate Commit 007. Commit 007 established the defensive business-logic/API surface; Commit 014 hardens the API and service boundary as an explicit zero-trust runtime boundary and closes implementation-level API security gaps identified during the Part 4 progression.

**Important:** Commit 015 does not make the Trust Engine the owner of identity, authorisation, fraud policy or punishment. It establishes the defensive engineering boundary around continuous trust assessment and the evidence used by authorised policy and control layers.

---

## 6. Scope Reconciliation of Existing Commits

### Commit 007 — Business Logic & API Protection

Commit 007 establishes defensive protection around high-value business workflows and API surfaces. It complements Commit 006's runtime detection and Commit 008's application attack resistance.

Commit 014 subsequently deepens this boundary at the API/service-runtime level rather than redefining the business-logic decision.

### Commit 013 — Commerce & Economic Abuse Defence

Commit 013 establishes the economic-abuse defensive boundary for high-value commerce and value-dispensing workflows. It covers payment, checkout, discounts, rewards, referrals, subscriptions, wallet operations, inventory hoarding, refunds, fake accounts, card testing, automated commerce and economic recovery.

### Commit 014 — API & Service Boundary Defence

Commit 014 establishes the API and service boundary as an explicit defensive runtime layer. It deepens, rather than replaces, the API protection introduced by Commit 007.

The distinction is:

```text
Commit 007
Business Logic & API Protection
        ↓
Protect the business workflows exposed through APIs

Commit 014
API & Service Boundary Defence
        ↓
Protect the API/service runtime boundary itself
```

Commit 014 therefore covers zero-trust service identity, object/property/function authorisation, credential and token lifecycle, request/schema validation, SSRF, resource consumption, sensitive business-flow protection, idempotency, concurrency, webhook security, external API consumption, API inventory, AI API authority, API observability, dependency isolation and API security testing.

### Commit 015 — Trust Engine Defensive Architecture

Commit 015 establishes the defensive boundary around the Trust Engine rather than redefining the Trust Engine's business architecture.

The distinction is:

```text
Trust Engine Architecture
        ↓
Defines trust capability, ownership and decision responsibilities

Commit 015
Trust Engine Defensive Architecture
        ↓
Protects trust evidence, assessment integrity,
adaptive controls and continuous evaluation
```

Trust remains contextual and evidence-based. A trust assessment is not automatically identity, authorisation, ownership, proof of wrongdoing or punishment. High-impact actions remain subject to the relevant policy and authority layer.

---

## 7. Forward Commit Sequence

The dependency-aware sequence is now:

- **013 — Commerce & Economic Abuse Defence** ✓
- **014 — API & Service Boundary Defence** ✓
- **015 — Trust Engine Defensive Architecture** ✓
- **016 — Platform Authenticity & Anti-Impersonation**
- **017 — Defensive Monitoring & Detection**
- **018 — Automated Defence & Containment**
- **019 — Incident Response Architecture**
- **020 — Platform Resilience & Continuity**
- **021 — Adversarial Testing & Defensive Verification**
- **022 — IP & Legal Protection Strategy**
- **023 — Global Defensive Scalability**
- **024 — Defensive Governance**
- **025 — Assurance, Traceability & Closure**

Supply-chain defence and client resilience were brought forward as Commits 004 and 005 because they are dependency-critical. Their subjects will not be recreated later as duplicate commits.

---

## 8. Cross-Cutting Security Dependencies

Part 4 shall reference, but not duplicate, the relevant Part 3 architecture for Identity & Access, AI Society, Trust Engine, Fraud Intelligence, Reward Intelligence, Walk Mode, WhatsApp integration, auditability, monitoring, supply chain, infrastructure, incident response, security governance, data ownership, privacy and event governance.

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
**Current commit:** 015  
**Next commit:** 016 — Platform Authenticity & Anti-Impersonation  
**Canonical Part 4 commit path:** `docs/architecture/EDA/part-4/commits/`
