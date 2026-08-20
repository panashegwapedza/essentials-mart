# ADR-015 Amendment 001 — External Partner Security

**Status:** Proposed
**Date:** 2026-08-20
**Parent ADR:** ADR-015 — Security & Anti-Replication Architecture
**Related Architecture:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Related Pattern:** EIP-017 — External Partner Adapter / Gateway
**Related Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This amendment extends the security and anti-replication architecture to explicitly protect the external partner boundary.

## 2. Amendment

External partner integrations are treated as untrusted external attack surfaces until authenticated, authorised, validated, and policy-approved.

The partner boundary must protect against:

- partner credential compromise;
- partner impersonation;
- malicious or malformed payloads;
- replayed requests;
- excessive request volume;
- automated abuse;
- API enumeration;
- webhook spoofing;
- data exfiltration;
- partner-side compromise;
- settlement manipulation;
- fraudulent order initiation.

## 3. Required Controls

Partner interfaces must use appropriate controls including:

- strong partner authentication;
- capability-scoped authorisation;
- request and schema validation;
- rate limiting;
- bot and abuse detection;
- replay protection where applicable;
- idempotency for repeatable commands;
- secure secret storage and rotation;
- network and service isolation;
- monitoring;
- audit logging;
- controlled error responses;
- partner suspension and revocation.

## 4. Blast Radius

A compromised partner must not automatically compromise the wider enterprise.

Partner credentials and service identities must be constrained to the minimum capabilities required for that partner's registered functions.

The Partner Adapter must prevent provider-specific trust assumptions from propagating into internal domain authority.

## 5. Anti-Replication

Partner APIs must not expose internal architecture, database structure, proprietary algorithms, hidden AI configuration, internal prompts, or unnecessary operational information.

Partner-facing contracts should expose only the information necessary for the agreed capability.

## 6. AI and Autonomous Actions

Partner-originated requests that trigger AI or autonomous actions remain subject to the same AI identity, tool permission, policy, approval, and audit requirements that apply to other external inputs.

## 7. Consequences

This amendment extends ADR-015's defence-in-depth and information-minimisation principles to the external partner ecosystem without treating partners as inherently trusted internal components.

**ADR-015 remains authoritative together with this amendment unless superseded by a later ADR.**
