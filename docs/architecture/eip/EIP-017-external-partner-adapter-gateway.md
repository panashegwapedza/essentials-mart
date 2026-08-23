# EIP-017 — External Partner Adapter / Gateway

**Status:** Proposed  
**Date:** 2026-08-20  
**Pattern Type:** Integration / Boundary / Adapter

## 1. Purpose

Define the reusable integration pattern through which Essentials Mart connects external commerce, distribution, financial, identity, fulfilment and other strategic partners without making any individual partner an architectural dependency.

The pattern establishes a stable Essentials Mart-facing contract while isolating partner-specific APIs, protocols, data models, credentials, capabilities and operational behaviour behind a partner adapter.

Mukuru is the first intended implementation of this pattern, but the pattern is explicitly provider-neutral.

## 2. Problem

External partners differ in:

- APIs and protocols;
- authentication mechanisms;
- customer identifiers;
- payment methods;
- settlement models;
- order models;
- notification mechanisms;
- geographic availability;
- transaction limits;
- failure behaviour;
- commercial arrangements;
- regulatory requirements.

Allowing these differences to enter core Essentials Mart domains would create tight coupling, increase security exposure and make partner replacement expensive.

## 3. Architectural Decision

Essentials Mart shall integrate external partners through a controlled **External Partner Integration Boundary**.

Each partner shall be represented by an adapter that translates partner-specific interactions into canonical Essentials Mart contracts.

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
Enterprise Capability / Domain
```

The core platform shall not contain partner-specific business logic merely to accommodate an external provider.

## 4. Canonical Boundary

The adapter boundary is responsible for translating between external and internal representations.

It may translate:

- identity assertions;
- customer references;
- product/catalogue references;
- discovery/referral events;
- payment requests;
- payment confirmations;
- order initiation;
- order status;
- settlement records;
- refund requests;
- delivery references;
- partner notifications;
- error codes;
- partner-specific status values.

The adapter shall not become the authoritative owner of Essentials Mart customer, household, cart, order, inventory, fulfilment or delivery state.

## 5. Partner-Neutral Capability Model

The integration boundary shall represent capabilities rather than hard-coded providers.

Potential capabilities include:

- discovery;
- app tile distribution;
- API-driven catalogue distribution;
- referral/deep-link distribution;
- identity assurance;
- customer/account linking;
- payment initiation;
- payment confirmation;
- settlement;
- refunds;
- order initiation;
- order status;
- notifications;
- fulfilment coordination;
- delivery coordination.

A partner may support only a subset of these capabilities.

## 6. Partner Capability Registry

Essentials Mart shall maintain a capability representation for participating partners.

The registry should be able to represent, where applicable:

- partner identity;
- supported countries/regions;
- currencies;
- supported capabilities;
- transaction limits;
- supported payment methods;
- settlement methods;
- operational status;
- security status;
- eligibility constraints;
- commercial model;
- effective dates;
- suspension/revocation state.

Partner capability data shall not itself grant authority. Authorisation remains governed by the identity and access architecture.

## 7. Partner Discovery

The pattern supports performance-linked distribution mechanisms including:

- app tiles;
- API-driven catalogues;
- referral/deep links.

These mechanisms may be compensated through arrangements such as:

- revenue sharing;
- transaction commission;
- referral commission;
- acquisition fees.

Paid promotional mechanisms shall remain commercially distinct and may include:

- sponsored placement;
- featured placement;
- advertising;
- campaign placement.

Commercial terms shall not be embedded into the technical adapter contract.

## 8. Identity and Trust

A partner may provide an authenticated identity or identity-assurance assertion.

Essentials Mart shall independently determine:

- whether the assertion is acceptable;
- what assurance level it represents;
- what customer attributes may be used;
- what consent is required;
- what actions the resulting identity may perform.

Partner KYC or authentication shall not automatically confer unrestricted Essentials Mart authority.

Partner trust is contextual and capability-specific.

## 9. Payment and Settlement

Payment integration shall use canonical Essentials Mart payment contracts while partner-specific payment mechanisms remain inside the adapter boundary.

The pattern supports, where available and contractually approved:

- wallet payments;
- card payments;
- mobile money;
- cash/payment-code flows;
- vouchers;
- account-based payment;
- other approved payment mechanisms.

Settlement, reconciliation, refunds and disputes shall be represented independently from the partner's proprietary implementation.

The current Mukuru implementation must therefore be treated as a capability mapping, not as the definition of the generic payment model. Mukuru's public merchant documentation currently describes MukuruPay online payment flows and cash collection, including payment-code based journeys. citeturn0search0turn0search1

## 10. Order and Commerce Integrity

External partners may initiate or facilitate an Essentials Mart transaction, but Essentials Mart remains authoritative for its own commerce state.

```text
Partner
   |
   | initiate/facilitate
   v
Partner Adapter
   |
   v
Essentials Mart Order Command
   |
   v
Order Domain
```

The partner shall not directly manipulate Essentials Mart domain storage.

## 11. Security Boundary

Partner integrations shall be treated as external trust boundaries.

Required controls include, as applicable:

- strong partner authentication;
- scoped credentials;
- least privilege;
- capability-based authorisation;
- request validation;
- replay protection;
- idempotency;
- rate limiting;
- abuse detection;
- partner-specific quotas;
- secret isolation;
- credential rotation;
- revocation;
- network/service isolation;
- audit logging;
- correlation identifiers;
- anomaly detection.

A compromised partner must not automatically compromise the wider Essentials Mart platform.

## 12. Resilience and Replaceability

No external partner shall become a single point of architectural failure.

Partner availability shall be represented independently from core platform availability.

Where multiple partners can perform a capability, partner selection may consider:

- geography;
- eligibility;
- capability;
- availability;
- reliability;
- transaction limits;
- risk;
- cost;
- settlement requirements;
- commercial rules.

Partner substitution shall occur through the integration boundary rather than through changes to core domain logic.

```text
Partner A unavailable
        |
        v
Partner Selection / Routing
        |
        v
Partner B
        |
        v
Essentials Mart
```

Automatic failover shall only occur where the transaction semantics, risk controls and commercial/regulatory requirements permit it.

## 13. Failure Handling

Partner failures shall be translated into canonical integration outcomes.

The pattern shall support:

- retryable failures;
- non-retryable failures;
- timeout handling;
- circuit breaking;
- dead-letter handling;
- reconciliation;
- duplicate detection;
- idempotent processing;
- compensation for distributed transactions where required.

Existing EIPs for retry, dead-letter handling, idempotent consumption, routing, saga orchestration, transactional outbox and distributed tracing should be composed rather than duplicated.

## 14. Observability and Auditability

Partner interactions shall produce sufficient evidence to reconstruct a transaction.

At minimum, sensitive partner-originated operations should be correlatable to:

- partner;
- partner identity;
- customer identity where applicable;
- capability invoked;
- request/correlation identifier;
- authorisation decision;
- transaction/order identifier;
- payment reference where applicable;
- timestamp;
- outcome;
- downstream actions.

Partner-specific logs must not replace enterprise audit records.

## 15. AI Society Integration

AI agents may request partner capabilities only through authorised tools or services exposed by the integration boundary.

An AI agent shall not directly invoke arbitrary partner APIs using unrestricted credentials.

The AI layer may assist with partner selection when authorised, considering contextual requirements such as geography, capability, eligibility, risk and availability.

The final action remains subject to the existing AI authority, human-approval and enterprise authorisation architecture.

## 16. Data Ownership

External partners may be processors, controllers, data sources or service providers depending on the contractual and regulatory arrangement.

Essentials Mart shall explicitly define:

- data exchanged;
- purpose;
- ownership/authority;
- retention;
- consent requirements;
- regional restrictions;
- deletion requirements;
- security requirements;
- breach responsibilities.

Partner data must not silently become part of an unrestricted internal data domain.

## 17. Commercial Separation

Technical integration and commercial participation shall remain separate concerns.

The adapter defines how systems communicate.

A separate partner-commercial capability may manage:

- revenue sharing;
- commissions;
- referral economics;
- acquisition fees;
- promotional fees;
- settlement terms;
- partner billing;
- campaign contracts.

Changing commercial terms must not require rewriting the partner adapter.

## 18. Provider-Specific Implementations

A provider-specific adapter may be implemented as:

```text
External Partner Integration Boundary
          |
   +------+------+
   |             |
   v             v
Mukuru Adapter  Partner B Adapter
```

The Mukuru adapter may map Mukuru-specific capabilities such as MukuruPay, subject to the final commercial and technical agreement with Mukuru. Mukuru currently exposes online merchant collection/payment services and multiple payment/collection capabilities in several markets, including Zimbabwe. citeturn0search0turn0search5

The generic architecture shall not assume that another partner provides the same capabilities.

## 19. Consequences

### Positive

- prevents partner lock-in;
- reduces coupling between external providers and core domains;
- makes partner replacement practical;
- enables multi-partner strategies;
- centralises security controls;
- improves auditability;
- supports geographic expansion;
- allows commercial models to evolve independently;
- provides a reusable pattern for future integrations.

### Costs

- additional adapter development;
- partner capability modelling;
- integration testing;
- contract/version management;
- operational monitoring;
- partner certification and onboarding;
- reconciliation complexity.

## 20. Related Architecture

This EIP composes with:

- EDA-002 — External Partner Commerce, Distribution & Financial Integration;
- EDA-001 Part 3 — Security Architecture;
- EDA-001 Part 4 — Defensive Engineering and Platform Protection;
- ADR-004 — API & Service Architecture;
- ADR-006 — Identity, Authentication & Authorisation;
- ADR-011 — Notification & Communication Architecture;
- ADR-012 — WhatsApp Integration Architecture;
- ADR-016 — Observability, Auditability & Trust Architecture;
- ADR-017 — Scalability & Multi-Store Architecture;
- EIP-001 — Event Notification;
- EIP-003 — Event Stream;
- EIP-004 — Command Message;
- EIP-005 — Request-Reply;
- EIP-006 — Message Router;
- EIP-007 — Content-Based Router;
- EIP-009 — Dead Letter Channel;
- EIP-010 — Retry & Redelivery;
- EIP-011 — Idempotent Consumer;
- EIP-013 — Saga Orchestration;
- EIP-014 — Transactional Outbox;
- EIP-015 — Correlation & Distributed Tracing.

## 21. Forward-Consistency Requirements

Before this EIP is considered final, the architecture must verify:

1. Direct impacts on existing EDA documents.
2. Direct impacts on existing ADRs.
3. Direct impacts on existing EIPs.
4. Secondary impacts caused by those amendments.
5. Identity and authorisation consistency.
6. Security-boundary consistency.
7. Data-ownership consistency.
8. Event and command consistency.
9. Audit and observability consistency.
10. Partner replacement and failure consistency.
11. AI authority and tool-access consistency.
12. Commercial/technical separation.

Any affected architecture documents must be amended before the overall architecture is considered internally consistent.
