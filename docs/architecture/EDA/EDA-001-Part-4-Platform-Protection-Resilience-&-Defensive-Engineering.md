# EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering

**Status:** Proposed  
**Part:** EDA-001 Part 4  
**Parent Architecture:** EDA-001  
**Purpose:** Master index and scope baseline  
**Canonical commit directory:** `docs/architecture/EDA/part-4/commits/`

---

## Current Commit Mapping Update

Commit 018 — **Automated Defence & Containment** — is now complete.

It establishes the governed automated enforcement boundary covering proportional containment, blast-radius control, reversible restrictions, quarantine, suspension, credential/session revocation, service and infrastructure isolation, AI containment, partner containment, emergency controls, action traceability, containment verification and re-evaluation.

The authoritative Part 4 sequence now continues:

- **013 — Commerce & Economic Abuse Defence** ✓
- **014 — API & Service Boundary Defence** ✓
- **015 — Trust Engine Defensive Architecture** ✓
- **016 — Platform Authenticity & Anti-Impersonation** ✓
- **017 — Defensive Monitoring & Detection** ✓
- **018 — Automated Defence & Containment** ✓
- **019 — Incident Response Architecture**
- **020 — Platform Resilience & Continuity**
- **021 — Adversarial Testing & Defensive Verification**
- **022 — IP & Legal Protection Strategy**
- **023 — Global Defensive Scalability**
- **024 — Defensive Governance**
- **025 — Assurance, Traceability & Closure**

Commit 018 does not replace Commit 017's monitoring and detection architecture. Commit 017 establishes the evidence and detection layer; Commit 018 establishes the governed defensive action layer after detection. Commit 018 also does not replace incident response or continuity, which remain the responsibilities of Commits 019 and 020.

## 018 Defensive Boundary

```text
Security Signal
      ↓
Detection
      ↓
Risk / Confidence
      ↓
Policy / Authority
      ↓
Automated Defensive Action
      ↓
Containment
      ↓
Verification
      ↓
Reassessment
   ┌──┴───────────────┐
   ▼                  ▼
Release            Escalate
                      ↓
               Incident Response
```

### Core Laws

1. Detection does not automatically authorise containment.
2. Automated defence operates under explicit policy.
3. Actions must be proportional to risk.
4. Actions should be reversible where possible.
5. High-impact irreversible actions require stronger authority.
6. Containment must preserve material evidence.
7. Scope must be limited to the necessary blast radius.
8. Automated defence must not become an uncontrolled authority layer.
9. Trust signals do not independently authorise enforcement.
10. AI agents cannot override their own containment.
11. Defensive automation must itself be protected against attack.
12. Automated actions must be attributable and observable.
13. Containment success must be verified.
14. Temporary restrictions should expire or be re-evaluated.
15. Automated defence must avoid recursive action loops.
16. Defensive controls must not become an easy target for denial-of-service or customer-harm attacks.
17. Financially consequential containment requires economic safeguards.
18. Dependency-aware containment must minimise collateral outages.
19. Emergency controls require elevated authority.
20. Recovery remains distinct from automated containment.
21. Privacy requirements remain applicable during security response.
22. Partner integrations must be isolatable without unnecessary coupling.
23. Platform-wide kill switches are exceptional controls, not routine mechanisms.
24. Automated defence must be continuously tested.

**Current commit:** 018  
**Next commit:** 019 — Incident Response Architecture  
**Canonical Part 4 commit path:** `docs/architecture/EDA/part-4/commits/`
