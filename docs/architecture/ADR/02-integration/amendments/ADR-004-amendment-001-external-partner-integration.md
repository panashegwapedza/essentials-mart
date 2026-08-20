# ADR-004 Amendment 001 — External Partner Integration

**Status:** Proposed
**Date:** 2026-08-20
**Parent ADR:** ADR-004 — API & Service Architecture
**Related Architecture:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Related Pattern:** EIP-017 — External Partner Adapter / Gateway
**Related Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This amendment extends ADR-004 to explicitly define how external commerce, distribution, financial, and other strategic partners interact with Essentials Mart.

The amendment does not replace the domain-aligned API and service architecture established by ADR-004. It makes the existing principle of controlled integration boundaries concrete for external partners.

## 2. Amendment

External partners must interact with Essentials Mart through a controlled **Partner Integration Boundary**.

Provider-specific protocols, schemas, credentials, error models, and operational behaviour must be isolated behind a **Partner Adapter / Gateway** conforming to EIP-017.

The internal enterprise domains must consume canonical Essentials Mart contracts rather than provider-specific contracts.

```text
External Partner
      |
      v
Partner Adapter / Gateway
      |
      v
Canonical Essentials Mart Contract
      |
      v
Domain Service / Enterprise Capability
```

A partner must not receive direct database access or bypass the enterprise API/service boundary.

## 3. Partner Capabilities

The Partner Integration Boundary may expose controlled capabilities including:

- discovery and distribution;
- catalogue access;
- referral/deep-link initiation;
- identity or identity assurance;
- payment initiation;
- settlement status;
- order initiation;
- refund or dispute workflows where authorised;
- notifications;
- delivery or fulfilment coordination where authorised.

Capabilities are independently permissioned. A partner authorised to initiate an order is not thereby authorised to read unrelated household, customer, operational, or financial information.

## 4. Partner-Neutrality

Mukuru, or any other named provider, is an implementation of the partner boundary rather than a foundational dependency of the API architecture.

The API/service architecture must permit multiple partner adapters and partner replacement without redesigning the underlying domain contracts.

## 5. Commercial Separation

Technical integration must remain separate from commercial arrangements.

Performance-linked discovery mechanisms may include:

- app tiles;
- API-driven catalogues;
- referral/deep links.

Paid promotional mechanisms may include sponsored placement, featured placement, advertising, or campaigns.

Commercial terms must not become hidden technical dependencies within domain APIs.

## 6. Security

Partner APIs and webhooks are untrusted integration surfaces and must enforce authentication, authorisation, validation, rate limiting, replay protection where applicable, abuse controls, and auditability.

Partner-originated requests remain subject to the same domain ownership and security controls as other enterprise consumers.

## 7. Consequences

This amendment preserves channel independence, provider replaceability, canonical domain contracts, and server-side business authority while allowing Essentials Mart to participate in external ecosystems.

## 8. Consistency Requirement

ADR-004 implementations must conform to EIP-017 and ADR-019 when integrating an external partner.

**ADR-004 remains authoritative together with this amendment unless superseded by a later ADR.**
