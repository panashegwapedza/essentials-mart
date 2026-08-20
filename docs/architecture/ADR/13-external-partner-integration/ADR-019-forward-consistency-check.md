# ADR-019 — Forward Consistency Check

**Status:** Complete
**Date:** 2026-08-20
**Scope:** External Partner Commerce, Distribution & Financial Integration
**Anchor Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This document records the forward-consistency review performed after introducing the External Partner Integration Architecture.

The objective is to ensure that the new partner-neutral architecture does not silently conflict with previously established Enterprise Architecture, EIP, or ADR decisions.

The review treats ADR-019 as an extension of existing architecture rather than a replacement for established domain, identity, API, security, event, data, AI, observability, or deployment decisions.

---

## 2. Consistency Result

**Overall result: CONSISTENT WITH CONTROLLED AMENDMENTS REQUIRED.**

No existing architectural decision was identified as fundamentally incompatible with ADR-019.

The existing architecture already provides the major foundations required by the partner model:

- domain-aligned APIs and services;
- explicit data ownership;
- policy-driven identity and authorisation;
- security and anti-replication controls;
- observability and auditability;
- event-driven integration;
- request/reply and command patterns;
- routing;
- retry and dead-letter handling;
- idempotency;
- saga orchestration;
- transactional outbox;
- distributed tracing.

The partner architecture therefore composes existing decisions rather than replacing them.

---

## 3. Affected ADRs

### ADR-004 — API & Service Architecture

**Impact: HIGH**

Required clarification:

- External Partner Integration Boundary becomes an explicit controlled integration boundary.
- Partner Adapters/Gateways translate provider-specific contracts into canonical enterprise contracts.
- Core domain services must not depend directly on partner-specific APIs or SDKs.
- Partner-originated commands and requests remain subject to the same API security and domain ownership rules.

**Consistency:** No conflict. Amendment required for explicit partner-boundary language.

### ADR-005 — Data Ownership & Database Boundaries

**Impact: HIGH**

Required clarification:

- Partner-owned identifiers remain external references and must not become authoritative enterprise identities.
- Partner integration services may maintain integration state, mappings, and operational records without becoming owners of customer, household, cart, order, inventory, fulfilment, or delivery entities owned by Essentials Mart domains.
- Partner data exchange must use controlled interfaces rather than direct database access.

**Consistency:** No conflict. Amendment required for explicit partner-data boundary language.

### ADR-006 — Identity, Authentication & Authorisation

**Impact: VERY HIGH**

Required clarification:

- External partners are explicit external principals.
- Partner credentials and delegated access must be capability-scoped and revocable.
- Partner-provided identity or KYC assertions are inputs to Essentials Mart authorisation, not automatic authority.
- Partner actions must preserve originating partner, subject, delegation, capability, scope, and correlation context.

**Consistency:** No conflict. Existing principal model already includes External Integration. Amendment required to define partner-specific authority semantics.

### ADR-015 — Security & Anti-Replication Architecture

**Impact: HIGH**

Required clarification:

- External partner boundaries are protected security boundaries.
- Partner compromise, credential theft, replay, abuse, malicious payloads, excessive requests, data leakage, and capability escalation must be contained at the integration boundary.
- Partner adapters must not expose proprietary internal logic or secrets.

**Consistency:** No conflict. Existing server-side enforcement, API protection, abuse detection, secret management, and supply-chain principles already support the model. Amendment/cross-reference required.

### ADR-016 — Observability, Auditability & Trust

**Impact: HIGH**

Required clarification:

Partner activity must be traceable through:

- partner identity;
- partner capability;
- partner transaction/reference;
- customer/delegation context where applicable;
- policy decision;
- canonical command/request;
- downstream services;
- external calls;
- payment/settlement state;
- retries/errors;
- final outcome.

**Consistency:** No conflict. Existing correlation, audit, security telemetry, and external-integration observability principles already support this. Amendment/cross-reference required.

### ADR-017 — Scalability & Multi-Store Architecture

**Impact: MEDIUM/HIGH**

Required clarification:

- Partner capabilities may vary by country, region, currency, store network, transaction type, and operational status.
- Partner routing must remain compatible with multi-region and multi-store operation.
- Partner replacement must not require domain redesign.

**Consistency:** No conflict. Amendment recommended when the scalability architecture is next revised.

### ADR-018 — Deployment & Environment Strategy

**Impact: MEDIUM**

Required clarification:

- Partner credentials, endpoints, certificates, signing keys, and environment configuration must remain environment-specific.
- Development, staging, and production partner integrations must remain isolated.
- Production partner access must not be reused in lower environments.

**Consistency:** No conflict. Amendment recommended when deployment architecture is next revised.

---

## 4. Affected EIPs

The following existing EIPs remain valid and are composed by EIP-017:

- EIP-004 — Command Message
- EIP-005 — Request Reply
- EIP-006 — Message Router
- EIP-007 — Content-Based Router
- EIP-009 — Dead Letter Channel
- EIP-010 — Retry and Redelivery
- EIP-011 — Idempotent Consumer
- EIP-013 — Saga Orchestration
- EIP-014 — Transactional Outbox
- EIP-015 — Correlation and Distributed Tracing
- EIP-016 — Human-in-the-Loop Routing where partner-originated actions require human approval

No existing EIP is superseded by EIP-017.

EIP-017 is the composition boundary that determines how provider-specific integration is translated into the established enterprise messaging and service patterns.

---

## 5. EDA Impact

### EDA-002 — External Partner Commerce, Distribution & Financial Integration

**Status:** Consistent.

EDA-002 provides the enterprise-level capability definition.

ADR-019 provides the architectural decision and governance rules.

EIP-017 provides the reusable integration pattern.

The three documents therefore form a coherent hierarchy:

```text
EDA-002
Enterprise capability and architecture
        |
        v
ADR-019
Architectural decision and governance
        |
        v
EIP-017
Reusable implementation pattern
```

---

## 6. Security Boundary Check

The partner architecture preserves the existing security model:

```text
External Partner
      |
      v
Partner Boundary
      |
      +-- Authentication
      +-- Authorisation
      +-- Capability Scope
      +-- Validation
      +-- Rate Limiting
      +-- Abuse Detection
      +-- Idempotency
      +-- Replay Protection
      +-- Audit
      |
      v
Canonical Enterprise Contract
      |
      v
Domain Authority
```

No partner receives direct authority over enterprise databases or unrestricted access to internal services.

---

## 7. Data Ownership Check

The partner architecture does not create a competing source of truth.

```text
Partner
  |
  +-- Partner-owned identity/reference
  +-- Partner transaction/reference
  |
  v
Adapter / Gateway
  |
  v
Essentials Mart canonical contract
  |
  v
Owning Domain
```

Essentials Mart remains authoritative for Essentials Mart-owned commerce state.

---

## 8. Identity and Trust Check

The partner architecture preserves the distinction between:

- identity;
- authentication;
- authorisation;
- delegation;
- trust;
- capability;
- authority.

A partner can authenticate successfully while still being denied a requested capability.

A partner can provide KYC evidence without automatically becoming authorised to access unrelated household or enterprise information.

---

## 9. AI Check

The partner architecture remains compatible with the AI Society model.

AI agents may select or invoke partner capabilities only through authorised tools and the Partner Integration Boundary.

The AI does not receive unrestricted partner credentials and does not bypass domain authorisation.

The architecture therefore preserves:

> **AI capability does not imply AI authority.**

---

## 10. Observability Check

The partner architecture preserves end-to-end causality.

A partner-originated operation should remain traceable through:

```text
Partner
  |
  v
Adapter
  |
  v
Canonical Request / Command
  |
  v
Domain
  |
  +-- Event
  +-- External Call
  +-- Payment / Settlement
  +-- Fulfilment
  +-- Delivery
  +-- Notification
  |
  v
Final Outcome
```

Correlation identifiers must survive the translation boundary.

---

## 11. Failure and Replacement Check

Partner failure does not invalidate the enterprise architecture.

The following states remain explicitly supported:

- unavailable;
- degraded;
- suspended;
- revoked;
- commercially terminated;
- replaced.

Alternative-partner routing is conditional and must never bypass capability, security, regulatory, customer, operational, or commercial requirements.

---

## 12. Commercial Separation Check

The architecture preserves the distinction between technical participation and commercial arrangements.

Performance-linked discovery mechanisms:

- app tile;
- API-driven catalogue;
- referral/deep link.

Paid promotional services:

- sponsored placement;
- featured placement;
- advertising;
- campaigns.

Commercial terms remain outside the technical adapter contract.

---

## 13. Required Follow-On Amendments

The forward-consistency review establishes the following amendment queue:

1. Amend ADR-004 to explicitly incorporate the External Partner Integration Boundary and Partner Adapter/Gateway.
2. Amend ADR-005 to explicitly define partner references and integration data boundaries.
3. Amend ADR-006 to explicitly define partner principals, partner-scoped authority, and partner-provided identity/KYC assertions.
4. Amend ADR-015 to explicitly include external partner compromise and integration-boundary containment.
5. Amend ADR-016 to explicitly define partner observability and audit evidence.
6. Amend ADR-017 when its next scalability revision is performed.
7. Amend ADR-018 when its next deployment/environment revision is performed.

These are **controlled amendments**, not architectural reversals.

---

## 14. Final Consistency Decision

> **The External Partner Integration Architecture is forward-consistent with the existing Essentials Mart architecture. It composes existing identity, API, data ownership, event, security, AI, observability, scalability, and deployment decisions without superseding them. The affected ADRs require explicit partner-boundary clarifications so that future implementation cannot accidentally bypass the established architecture.**

**Review status:** PASS — controlled amendments queued.
