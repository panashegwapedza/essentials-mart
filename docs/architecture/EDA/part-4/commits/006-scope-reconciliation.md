# EDA-001 Part 4 — Commit 006 Scope Reconciliation

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Related Commit:** 006 — Runtime Threat Detection, Bot Defence & Adaptive Abuse Control  
**Purpose:** Corrective scope addendum

---

## 1. Purpose

This addendum resolves the sequencing inconsistency in the original Commit 006 document.

The original Commit 006 `Next Commit` section proposed a Data Protection, Secrets & Cryptographic Boundary Architecture.

That subject is not the next chronological Part 4 commit because Part 4 already distinguishes its data-protection subject from the broader Part 3 Data Security Architecture, and the dependency-aware sequence requires business-logic and API protection first.

The **Part 4 master index is authoritative for sequencing**.

---

## 2. Correct Next Commit

The next chronological commit is:

**Commit 007 — Business Logic & API Protection**

Canonical path:

`docs/architecture/EDA/part-4/commits/007-business-logic-api-protection.md`

---

## 3. Why Commit 007 Comes Next

Commit 006 establishes runtime detection and adaptive abuse controls.

The next dependency is to harden the actual business operations and API interfaces against manipulation.

Commit 007 will therefore address:

- server-side business-rule enforcement;
- business-logic abuse;
- price and total integrity;
- entitlement manipulation;
- workflow manipulation;
- object-level authorisation enforcement;
- API contract enforcement;
- request validation;
- replay resistance;
- idempotency;
- parameter tampering;
- enumeration resistance;
- API-level abuse boundaries;
- transaction integrity.

This builds directly on Commit 006's runtime detection layer rather than duplicating it.

---

## 4. Data Protection Boundary

Data & Intelligence Protection remains a dedicated Part 4 subject and will be addressed later in the frozen subject sequence.

Its Part 4 purpose will be defensive protection of sensitive data and intelligence against:

- exfiltration;
- compromise;
- unauthorised reconstruction;
- credential/secret compromise;
- backup compromise;
- cryptographic compromise;
- AI-context leakage;
- insider or supplier exposure.

It will not simply reproduce Part 3's Data Security Architecture.

---

## 5. Authority

Where this addendum conflicts with the original Commit 006 `Next Commit` paragraph, this addendum and the Part 4 master index take precedence for the **current proposed workflow**.

The original text is retained as historical drafting context rather than silently rewritten.
