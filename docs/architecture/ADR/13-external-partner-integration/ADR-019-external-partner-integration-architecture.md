# ADR-019 — External Partner Integration Architecture

- **Status:** Proposed
- **Date:** 2026-08-20
- **Decision Type:** Enterprise Integration Architecture

## 1. Context

Essentials Mart is intended to integrate with external organisations that may provide customer distribution, identity assurance, payment, settlement, commerce initiation, delivery, communication, or other capabilities.

Mukuru is a potential initial partner implementation, particularly for cross-border commerce and merchant payment/collection journeys. However, Essentials Mart must not make Mukuru, or any other individual provider, an architectural dependency.

The architecture must allow partners to be added, replaced, suspended, or removed without requiring redesign of the core commerce domains or enterprise architecture.

External partner capabilities may include:

- app-based discovery and entry points;
- API-driven catalogue exposure;
- referral and deep-link journeys;
- identity and KYC assertions;
- payment initiation;
- settlement;
- refunds and disputes;
- order initiation;
- delivery or fulfilment services;
- notifications and communication;
- customer acquisition and distribution.

Commercial arrangements must also be separated from technical integration. App tiles, API catalogues, and referral/deep-link journeys may operate through performance-linked commercial models such as revenue share or referral commission. Sponsored placement, advertising, featured placement, and campaign activity are treated as paid promotional services and must not be assumed to be included in transaction revenue sharing.

## 2. Decision

Essentials Mart will establish an **External Partner Integration Boundary** through which external partners interact with the platform.

Partners will integrate through a standardised **Partner Adapter / Gateway** pattern. Each adapter translates partner-specific protocols, data models, authentication mechanisms, and capabilities into canonical Essentials Mart contracts.

The core enterprise domains must not depend directly on a partner-specific API, data model, SDK, credential format, or commercial mechanism.

Mukuru, where implemented, will therefore be treated as:

> **An external partner adapter implementation, not an architectural dependency.**

The architecture will support multiple concurrent partners and partner replacement.

## 3. Architectural Principles

### 3.1 Partner Neutrality

The core platform must remain independent of any particular external partner.

### 3.2 Capability-Based Integration

Partners expose capabilities through controlled interfaces. A partner's ability to perform one capability does not imply authority over unrelated capabilities.

### 3.3 Canonical Contracts

Partner-specific representations must be translated into canonical Essentials Mart commands, queries, events, and responses before entering the relevant enterprise capability boundary.

### 3.4 Essentials Mart Remains Authoritative

External partners may initiate or facilitate transactions, but Essentials Mart remains authoritative for Essentials Mart-owned customer, household, cart, order, fulfilment, inventory, and commerce state.

### 3.5 Explicit Trust and Authorisation

Partner authentication is not sufficient for authorisation. Partner actions must be evaluated against identity, capability, scope, customer context, geography, transaction type, risk, and applicable policy.

### 3.6 Least Privilege

A partner receives only the minimum permissions required for the capabilities explicitly contracted and enabled for that partner.

### 3.7 Replaceability

A partner must be capable of being disabled or replaced without requiring changes to core domain contracts.

### 3.8 Observable Integration

Partner-originated activity must remain traceable through correlation identifiers, audit records, security evidence, transaction records, and operational telemetry.

### 3.9 Failure Isolation

External partner failure must not automatically propagate into uncontrolled failure of the core platform.

### 3.10 Commercial Separation

Technical integration capabilities and commercial agreements must be represented separately so that technical participation does not imply a particular pricing, advertising, or revenue-sharing arrangement.

## 4. Partner Integration Boundary

The logical structure is:

```text
                    ESSENTIALS MART
                           │
                           ▼
             EXTERNAL PARTNER BOUNDARY
                           │
              ┌────────────┼────────────┐
              │            │            │
        Partner Adapter  Partner     Partner
              A          Adapter B   Adapter C
              │            │            │
              ▼            ▼            ▼
          Provider A    Provider B   Provider C
```

The boundary owns the integration concerns required to safely translate external interactions into Essentials Mart capabilities.

It does not become a substitute for domain services or business ownership.

## 5. Partner Capability Model

A partner may be registered with one or more capabilities, including:

- discovery;
- API catalogue;
- referral/deep link;
- identity assurance;
- KYC assurance;
- payment;
- settlement;
- refund;
- dispute handling;
- order initiation;
- delivery;
- notification;
- customer acquisition.

Capabilities must be independently enabled, scoped, monitored, and revocable.

## 6. Partner Capability Registry

Essentials Mart will maintain a capability registry describing, subject to implementation design:

- partner identity;
- enabled capabilities;
- supported countries and regions;
- supported currencies;
- supported transaction types;
- identity-assurance level;
- payment methods;
- settlement methods;
- transaction limits;
- commercial model references;
- operational status;
- security status;
- integration version;
- availability status.

The registry is a control and routing mechanism. It is not the source of truth for partner-owned customer or financial records.

## 7. Partner Identity and Trust

Partners are treated as external principals.

A partner may provide an authenticated customer identity or KYC assertion, but Essentials Mart must determine what that assertion permits within its own security and authorisation model.

A partner identity must not automatically inherit:

- customer authority;
- household authority;
- staff authority;
- administrative authority;
- AI-agent authority;
- unrestricted data access.

Partner credentials and delegated access must be revocable independently of the partner's customer account system.

## 8. Customer Context and Delegation

Where a partner initiates a customer journey, the integration must preserve sufficient context to establish:

- originating partner;
- partner transaction/reference;
- authenticated subject, where available;
- consent and delegation context;
- requested capability;
- transaction scope;
- correlation identifier.

Essentials Mart must not rely solely on a partner-supplied customer identifier when making security-sensitive decisions.

## 9. Discovery and Distribution

The architecture distinguishes performance-linked distribution from paid promotion.

### Performance-linked distribution

The following may operate under transaction-based, referral, revenue-share, or similar performance-linked commercial arrangements:

- app tile;
- API-driven catalogue;
- referral/deep link.

### Paid promotion

The following are treated as separate commercial services and may require upfront or separately contracted fees:

- sponsored placement;
- featured placement;
- advertising;
- promotional campaigns;
- other paid visibility arrangements.

Commercial terms must not be hard-coded into the technical partner adapter.

## 10. Payment and Settlement

Payment providers and financial partners must be accessed through provider-specific adapters and canonical payment contracts.

The architecture must support, where applicable:

- payment initiation;
- payment authorisation;
- payment confirmation;
- payment failure;
- settlement;
- reconciliation;
- refunds;
- disputes;
- transaction status.

Essentials Mart must not assume that every partner supports the same payment or settlement model.

## 11. Commerce Initiation

A partner may initiate a commerce journey, but the resulting Essentials Mart transaction must enter the normal commerce lifecycle.

For example:

```text
Partner
   │
   ▼
Partner Adapter
   │
   ▼
Canonical Order Command
   │
   ▼
Essentials Mart Commerce Domain
   │
   ├── Fulfilment
   ├── Inventory
   ├── Delivery
   └── Notifications
```

Partner-originated commerce must therefore not create a parallel order system.

## 12. Security Requirements

Partner integrations must inherit the enterprise security architecture and must additionally address partner-specific risks, including:

- credential compromise;
- partner impersonation;
- replay attacks;
- malicious payloads;
- excessive requests;
- API abuse;
- fraudulent transactions;
- partner-side compromise;
- data leakage;
- partner misconfiguration;
- compromised integration software;
- supply-chain risk;
- unauthorised capability escalation.

Controls include authentication, authorisation, scoped credentials, rate limiting, request validation, idempotency, replay protection, monitoring, anomaly detection, revocation, and auditability.

## 13. AI and Partner Integrations

AI agents may interact with partner capabilities only through authorised tools and the External Partner Integration Boundary.

An AI agent must not receive unrestricted partner credentials or bypass the partner gateway.

Where partner selection is delegated to AI or intelligence engines, selection must consider applicable policy, customer eligibility, geography, capability availability, operational status, risk, transaction limits, and commercial constraints.

The AI must not treat partner preference as equivalent to partner authority.

## 14. Failure and Replacement

Partner failure must be isolated from the core platform.

Partners may be:

- unavailable;
- degraded;
- suspended;
- revoked;
- commercially terminated;
- replaced.

Where alternative partners exist, routing may select another partner only when the alternative satisfies the required capability, security, regulatory, customer, operational, and commercial conditions.

The architecture must never silently route a transaction to an unsuitable provider merely because the preferred provider is unavailable.

## 15. Observability and Auditability

Partner-originated transactions must be traceable across the complete lifecycle.

Evidence should allow the enterprise to determine:

- which partner initiated the interaction;
- which partner identity was used;
- which capability was requested;
- which customer context was supplied;
- which policy allowed the action;
- which canonical command or request was generated;
- which domain processed it;
- which external calls occurred;
- what payment or settlement state resulted;
- what errors or retries occurred;
- what final outcome occurred.

Correlation identifiers must propagate across partner adapters and internal services.

## 16. Integration Patterns

The External Partner Adapter / Gateway composes existing enterprise integration patterns rather than replacing them.

Relevant patterns include:

- request/reply;
- command messaging;
- message routing;
- content-based routing;
- retry and redelivery;
- dead-letter handling;
- idempotent consumption;
- saga orchestration;
- transactional outbox;
- correlation and distributed tracing.

The Partner Adapter / Gateway itself is defined by the associated EIP.

## 17. Data Boundary

Partner integrations must minimise exchanged data and must only receive data required for the authorised capability.

Partner-owned identifiers should be mapped to internal identifiers without allowing partner identifiers to become the primary enterprise identity model.

Sensitive payment information must remain within the appropriate payment/security boundary and must not be unnecessarily replicated into partner integration services.

## 18. Governance

Every production partner must have:

- an identified owner;
- an approved capability set;
- security assessment;
- integration contract;
- operational expectations;
- failure and revocation procedure;
- commercial agreement where applicable;
- data-processing responsibilities where applicable;
- monitoring requirements;
- versioning expectations.

Changes to a partner's capabilities or trust level must be subject to controlled change management.

## 19. Decision Consequences

### Positive consequences

- Partners become replaceable rather than foundational dependencies.
- Multiple partners can coexist.
- Core domains remain provider-neutral.
- New markets can use locally appropriate partners.
- Payment and distribution options can expand without redesigning the commerce core.
- Partner compromise can be contained at the integration boundary.
- AI can consume partner capabilities through controlled tools.
- Commercial models remain flexible.
- Partner transactions remain observable and auditable.

### Negative consequences

- Additional adapter and gateway engineering is required.
- Canonical contracts must be designed and maintained.
- Partner capability differences must be modelled explicitly.
- Partner onboarding requires security and governance processes.
- Routing and fallback decisions become more complex.
- Reconciliation and settlement introduce additional operational requirements.

## 20. Dependencies and Related Decisions

This ADR depends upon and/or interacts with:

- ADR-001 — Enterprise Architecture Principles;
- ADR-002 — Domain-Driven Enterprise Architecture;
- ADR-003 — Event-Driven Architecture;
- ADR-004 — API & Service Architecture;
- ADR-005 — Data Ownership & Database Boundaries;
- ADR-006 — Identity, Authentication & Authorisation;
- ADR-009 — AI Agent Governance & Permissions;
- ADR-011 — Notification & Communication Architecture;
- ADR-012 — WhatsApp Integration Architecture;
- ADR-015 — Security & Anti-Replication Architecture;
- ADR-016 — Observability, Auditability & Trust Architecture;
- ADR-017 — Scalability & Multi-Store Architecture;
- ADR-018 — Deployment & Environment Strategy.

Related EIPs include the established request/reply, command, routing, retry, dead-letter, idempotency, saga, transactional-outbox, and distributed-tracing patterns, plus the External Partner Adapter / Gateway EIP.

The EDA-002 External Partner Commerce, Distribution & Financial Integration architecture provides the enterprise-level context for this decision.

## 21. Forward-Consistency Requirements

This ADR must remain consistent with the surrounding architecture.

Any future partner integration must:

1. use the External Partner Integration Boundary;
2. use the Partner Adapter / Gateway pattern;
3. register explicit capabilities;
4. obtain explicit identity and authorisation scopes;
5. preserve Essentials Mart domain ownership;
6. use canonical contracts;
7. maintain security and audit evidence;
8. support failure isolation and controlled revocation;
9. preserve partner replaceability;
10. keep commercial arrangements separate from technical capability definitions.

If a future partner requirement conflicts with this decision, the conflict must be resolved through a new or amended ADR rather than by silently bypassing the established boundary.

## 22. Initial Partner Implementation

Mukuru may be implemented as an initial partner adapter where commercially and technically approved.

Its current public merchant material demonstrates online merchant collection/payment capabilities and availability in Zimbabwe, but those provider-specific capabilities must remain encapsulated within the Mukuru adapter. The generic architecture must not infer that future partners provide identical capabilities.

## 23. Status

**Proposed.**

Implementation-specific partner contracts, credentials, API mappings, and commercial terms must be documented separately from this architectural decision.