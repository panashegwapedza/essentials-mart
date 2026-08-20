# EDA-002 — External Partner Commerce, Distribution & Financial Integration

**Status:** Proposed

**Date:** 2026-08-20

**Decision Scope:** Enterprise integration architecture

## 1. Purpose

This document defines the enterprise architecture for integrating Essentials Mart with external commerce, financial, remittance, distribution, marketplace, telecommunications, fintech, banking, and other strategic partners.

The architecture is intentionally partner-neutral. Mukuru is an initial candidate implementation, but Essentials Mart must not become architecturally dependent on Mukuru or any single external provider.

The objective is to allow external partners to provide discovery, distribution, identity assurance, payment, settlement, order initiation, and related capabilities through controlled integration boundaries while Essentials Mart remains authoritative for its own customer, household, commerce, fulfilment, delivery, and operational state.

## 2. Architectural Principle

> External partners are replaceable capabilities, not foundational dependencies.

Essentials Mart integrates with a stable internal partner boundary and translates partner-specific capabilities through partner adapters.

```text
External Partner
       |
       v
Partner Adapter
       |
       v
Canonical Partner Contract
       |
       v
Essentials Mart Integration Boundary
       |
       +---- Identity / Trust
       +---- Discovery / Distribution
       +---- Payment
       +---- Settlement
       +---- Order Initiation
       +---- Notifications
       +---- Other authorised capabilities
       |
       v
Essentials Mart Domains
```

## 3. Partner Categories

The architecture may support:

- remittance providers;
- banks;
- fintech providers;
- mobile-money providers;
- marketplaces;
- super-apps;
- telecommunications providers;
- loyalty platforms;
- employer platforms;
- insurance platforms;
- delivery providers;
- logistics providers;
- mapping providers;
- other approved strategic partners.

No partner category is inherently authoritative over Essentials Mart domains.

## 4. Partner Discovery & Distribution

Partners may expose Essentials Mart through performance-linked distribution mechanisms including:

- app tile;
- API-driven catalogue;
- referral or deep link.

These mechanisms may support commercial arrangements such as:

- revenue sharing;
- transaction commission;
- referral commission;
- conversion-based acquisition fees.

### Paid Promotion

Advertising-like exposure is treated separately from performance-linked distribution and may include:

- featured placement;
- sponsored placement;
- marketplace promotion;
- campaign placement;
- promotional messaging;
- advertising inventory.

Paid promotion is governed by separate commercial agreements and must not be assumed to be covered by transaction revenue sharing.

## 5. Identity & Trust

An external partner may provide an authenticated customer identity, identity assurance, KYC status, customer attributes, consent signals, or account-linking information where contractually and technically supported.

Partner identity assurance does not automatically grant unrestricted Essentials Mart trust or authority.

Essentials Mart independently determines:

- what identity assurance level is accepted;
- what data may be consumed;
- what customer context may be delegated;
- what actions the partner may initiate;
- what additional verification is required;
- when partner trust must be reduced or revoked.

## 6. Payment & Financial Services

The partner boundary may expose financial capabilities including:

- payment initiation;
- wallet payment;
- card payment;
- mobile-money payment;
- cash collection;
- voucher or payment-code flows;
- settlement;
- reconciliation;
- refunds;
- disputes;
- payment-status notification.

The internal architecture must not assume a specific partner payment mechanism.

A partner's payment capability is represented through a canonical Essentials Mart contract and implemented through a provider-specific adapter.

## 7. Commerce Initiation

An authorised partner may initiate an Essentials Mart commerce journey, including:

- grocery purchases;
- hampers;
- household purchases;
- gifts;
- subscriptions where supported;
- recipient-directed purchases.

The partner may facilitate or initiate a transaction but does not become the source of truth for the resulting Essentials Mart order.

## 8. System of Record

Essentials Mart remains authoritative for:

- Essentials Mart customers;
- households;
- carts;
- orders;
- products and catalogue state;
- inventory state;
- fulfilment state;
- delivery state;
- household state;
- AI decisions and authorised actions;
- platform audit records.

Partners remain authoritative only for their own systems and capabilities.

Partner-originated transactions must be represented as Essentials Mart transactions once accepted by the platform.

## 9. Partner Capability Registry

Essentials Mart should maintain a capability-aware representation of each approved partner.

A partner capability profile may include:

- supported countries;
- supported currencies;
- discovery capabilities;
- catalogue capabilities;
- referral capabilities;
- identity assurance capabilities;
- payment capabilities;
- settlement capabilities;
- refund capabilities;
- order-initiation capabilities;
- notification capabilities;
- delivery capabilities;
- transaction limits;
- commercial model;
- operational status;
- security status;
- regulatory constraints.

The registry allows the platform to determine which partner can provide a required capability under a specific context.

## 10. Partner Selection

Partner selection must be capability- and context-driven rather than hard-coded to a provider.

Relevant factors may include:

- geography;
- customer eligibility;
- payment method;
- transaction limits;
- availability;
- reliability;
- settlement capability;
- cost;
- risk;
- regulatory constraints;
- commercial terms;
- operational status.

AI Society components may assist with partner selection where authorised, but final execution remains subject to platform policies, permissions, risk controls, and applicable human-approval requirements.

## 11. Partner Replaceability

No external partner should constitute a single point of architectural failure.

Partner replacement must be possible through the integration boundary without requiring changes to core domain models merely because one provider has exited the ecosystem.

```text
Partner A
   |
   X  unavailable
   |
Partner Selection / Routing
   |
   v
Partner B
   |
   v
Essentials Mart
```

Automatic failover is not mandatory. Partner routing must respect eligibility, geography, capability, risk, commercial, regulatory, and operational constraints.

## 12. Commercial Separation

Technical partner integration and commercial partner management are separate concerns.

The integration architecture exposes capabilities.

A separate commercial capability governs:

- revenue sharing;
- referral commissions;
- transaction commissions;
- acquisition fees;
- promotional fees;
- campaign agreements;
- settlement terms;
- partner contracts.

Commercial terms must not be embedded directly into partner-specific adapters.

## 13. Security Boundary

Every partner is an external principal and must be treated as an explicit security boundary.

Controls must include, where applicable:

- partner identity;
- scoped credentials;
- capability-based authorisation;
- request authentication;
- request integrity;
- replay protection;
- rate limiting;
- abuse controls;
- partner-specific trust evaluation;
- data minimisation;
- partner isolation;
- credential rotation;
- revocation;
- auditability;
- incident containment.

A compromised partner must not automatically compromise unrelated Essentials Mart domains.

## 14. Event & Transaction Integration

External partner interactions should compose with existing enterprise integration patterns rather than creating parallel messaging mechanisms.

Relevant patterns include:

- event notification;
- publish-subscribe;
- command messages;
- request-reply;
- message routing;
- content-based routing;
- dead-letter handling;
- retry and redelivery;
- idempotent consumption;
- saga orchestration;
- transactional outbox;
- correlation and distributed tracing;
- human-in-the-loop routing.

The External Partner Adapter EIP will define how these existing patterns are composed at the partner boundary.

## 15. Observability & Auditability

Partner-originated activity must remain traceable across the full transaction lifecycle.

The platform must be able to determine:

- which partner acted;
- which partner identity acted;
- which customer context was used;
- which capability was invoked;
- which authorisation allowed the action;
- which transaction was affected;
- which payment or settlement reference was involved;
- what downstream actions occurred;
- what outcome resulted.

Correlation identifiers must survive the partner-to-platform boundary.

## 16. Failure & Resilience

The architecture must account for:

- partner API failure;
- partner timeout;
- partner outage;
- partner rate limits;
- malformed partner responses;
- partial transaction completion;
- settlement mismatch;
- duplicate requests;
- delayed notifications;
- partner withdrawal;
- credential compromise;
- partner security incidents.

Failure handling must preserve Essentials Mart's own transaction integrity and must not require the partner to remain available for the platform to preserve historical records.

## 17. Mukuru as Initial Implementation

Mukuru may be integrated as an initial external partner implementation because its current public merchant material describes online merchant collection capabilities, including online shopping/payment flows, marketplace payments, and availability in Zimbabwe. citeturn0search0turn0search1

Mukuru-specific capabilities, commercial terms, API contracts, and operational assumptions must remain implementation-specific and must not redefine the partner-neutral architecture.

The architecture must remain valid if Mukuru is replaced, supplemented, or removed.

## 18. Cross-Architecture Dependencies

This architecture interacts with:

- enterprise data architecture;
- domain-driven architecture;
- event-driven architecture;
- API and service architecture;
- data ownership and database boundaries;
- identity, authentication and authorisation;
- AI Society architecture;
- notification and communication architecture;
- WhatsApp integration architecture;
- observability, auditability and trust;
- scalability and multi-store architecture;
- deployment and environment strategy;
- Part 3 security architecture;
- Part 4 defensive engineering.

## 19. EIP Dependency

A reusable implementation pattern is required:

**EIP — External Partner Adapter / Gateway**

The EIP will define:

- canonical partner contracts;
- adapter responsibilities;
- capability translation;
- authentication boundary;
- partner routing;
- error mapping;
- idempotency;
- correlation;
- retry behaviour;
- settlement/event integration;
- partner replacement.

## 20. ADR Dependency

A corresponding architectural decision is required:

**ADR — External Partner Commerce, Distribution & Financial Integration Architecture**

The ADR will establish the durable decision to adopt the partner-neutral integration boundary and replaceable-adapter model.

## 21. Success Criteria

The architecture succeeds when:

- a partner can expose Essentials Mart without gaining unrestricted platform authority;
- partner-specific APIs remain isolated behind adapters;
- a partner can be replaced without redesigning core domains;
- multiple partners can provide overlapping capabilities;
- commercial terms remain separate from technical integration;
- partner-originated transactions remain auditable;
- security boundaries remain enforceable;
- existing EIPs can be reused rather than duplicated;
- Mukuru can be implemented without becoming a permanent architectural dependency.
