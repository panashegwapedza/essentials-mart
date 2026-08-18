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

This prevents an architectural subject that must be addressed early from being forced into an artificial numerical order.

---

## 3. Part 3 / Part 4 Boundary

### Part 3 — Security Architecture

Part 3 answers:

> **What security architecture does the platform use?**

It establishes security boundaries, identities, permissions, trust, data protection, AI security, monitoring, incident response, supply-chain security, infrastructure security and governance.

### Part 4 — Defensive Engineering

Part 4 answers:

> **How does the platform resist, detect, contain and recover when those boundaries are attacked or bypassed?**

Part 4 therefore focuses on:

- hardening;
- attack resistance;
- adversarial modelling;
- IP isolation and replication resistance;
- client resilience;
- business-logic abuse resistance;
- bot and automation defence;
- cyber-threat defence;
- infrastructure resilience;
- defensive supply-chain measures;
- AI defensive engineering;
- intelligence protection;
- economic abuse resistance;
- containment;
- recovery;
- adversarial verification;
- defensive assurance.

A Part 4 document may reference a Part 3 control, but it must explain the **defensive/resilience problem being solved**, rather than reproduce the Part 3 control definition.

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

The current commits deliberately address subjects in dependency order rather than pretending that the subject index is itself a commit-number sequence.

---

## 6. Scope Reconciliation of Existing Commits

### Commit 003 — IP Protection

Commit 003 is the Part 4 defensive expansion of the anti-replication principles already established by ADR-015.

It does not replace ADR-015.

ADR-015 remains the architectural decision; Commit 003 addresses defensive implementation strategy and resilience against replication/reverse engineering.

The three tiers are:

- Tier 1 — IP Isolation
- Tier 2 — Client Hardening
- Tier 3 — Legal Protection

Within Tier 1/2, implementation classifications may be described as server-only, client-hardened or ordinary client code. These classifications must not be confused with the three protection tiers.

### Commit 004 — Supply Chain

Part 3 establishes the supply-chain security boundary and governance.

Commit 004 addresses the defensive engineering side:

- compromise resistance;
- dependency integrity;
- provenance;
- verification;
- isolation;
- containment;
- revocation;
- recovery.

It must not duplicate Part 3's supply-chain governance definition.

### Commit 005 — Client Hardening

Commit 005 operationalises the client-resilience side of Commit 003.

It does not treat obfuscation, WebAssembly or anti-debugging as a confidentiality or authorisation boundary. Critical authority remains server-side.

This is consistent with the security principle that client-side controls can be bypassed and server-side enforcement remains authoritative. citeturn1search0turn1search3

### Commit 006 — Runtime Defence

Commit 006 is the runtime defensive layer.

It must not recreate Part 3's monitoring architecture. It focuses on using runtime signals to actively resist and contain hostile behaviour, including:

- bots;
- scraping;
- credential attacks;
- account takeover;
- API abuse;
- business-logic abuse;
- fraud automation;
- AI resource abuse;
- DDoS/resource exhaustion;
- compromised clients;
- event/notification abuse;
- Walk Mode abuse;
- WhatsApp abuse.

The next commit is therefore **Commit 007 — Business Logic & API Protection**, not a duplicate Part 3 data-security document.

---

## 7. Forward Commit Sequence

The next dependency-aware sequence is:

- **007 — Business Logic & API Protection**
- **008 — Cyber Threat Defence**
- **009 — Infrastructure & Network Defence**
- **010 — AI Defensive Architecture**
- **011 — AI Intelligence & Distillation Defence**
- **012 — Data & Intelligence Protection**
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

Supply-chain defence and client resilience have already been brought forward as Commits 004 and 005 because they are dependency-critical. Their subjects will not be recreated later as duplicate commits.

The final closure pass will verify that all 25 subject domains are covered exactly once as primary subjects, while cross-cutting dependencies may legitimately appear in multiple commits.

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
- security governance.

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

EDA-001 Part 4 is complete only when:

- all 25 subject domains are covered;
- every domain has a clear primary owner document;
- Part 3 and Part 4 boundaries are explicit;
- no commit exists solely as an accidental duplicate of another commit;
- cross-cutting controls have clear ownership;
- all external dependencies are addressed where relevant;
- IP protection, reverse-engineering resistance and anti-replication strategy are covered;
- malware and cyber-threat defence are covered;
- bot detection, rate limiting and abuse controls are covered;
- AI-specific defensive controls are covered;
- infrastructure and network defence are covered;
- incident response and resilience are covered;
- adversarial verification is covered;
- governance and assurance are covered;
- forward-consistency checks pass.

---

## 11. Status

**Part 4 status:** In progress  
**Current commit:** 006  
**Next commit:** 007 — Business Logic & API Protection  
**Canonical Part 4 commit path:** `docs/architecture/EDA/part-4/commits/`
