# EIP-025 — Flutter Client Implementation Architecture

**Document ID:** EIP-025  
**Title:** Flutter Client Implementation Architecture  
**Project:** Essentials Mart  
**Status:** Proposed / Implementation Baseline  
**Date:** 22 August 2026  
**Depends On:** EIP-019, EIP-020, EIP-021, EIP-022, EIP-023, EIP-024  
**Related ADRs:** ADR-006, ADR-007, ADR-009, ADR-010, ADR-011, ADR-013, ADR-014, ADR-015, ADR-016, ADR-017, ADR-018, ADR-019, ADR-020  
**Parent Architecture:** EDA-001

---

## 1. Purpose

EIP-025 defines the implementation architecture for the Essentials Mart Flutter client.

The client is the user-facing execution surface for customer, household, store, delivery and selected operational capabilities. It must consume the enterprise architecture through governed APIs, events and capabilities rather than becoming a second source of business truth.

The architecture must support:

- ordinary shopping;
- AI Shopping Mode;
- Walk Mode;
- household and pantry intelligence;
- Essentials Subscription;
- checkout and payments;
- delivery selection and tracking;
- notifications;
- receipts and repeat purchases;
- rewards;
- customer support;
- partner entry points;
- offline and limited-connectivity operation;
- accessibility;
- and future client capabilities.

The client must remain viable from a single-user deployment to the global scale established by the enterprise architecture.

---

## 2. Constitutional Client Principle

> **The Flutter client is an interaction and orchestration surface, not an authority boundary for enterprise truth.**

The client may:

- present information;
- capture user intent;
- maintain temporary local state;
- provide local UX behaviour;
- cache authorised data;
- queue permitted offline operations;
- render AI recommendations;
- and invoke governed capabilities.

The client must not become the authoritative source for:

- prices;
- inventory;
- payment state;
- reward entitlement;
- trust decisions;
- subscription pricing;
- delivery allocation;
- AI authority;
- or other material business truth.

---

## 3. Relationship With Backend Architecture

The client follows the service boundaries established by EIP-021.

```text
Flutter Client
      │
      ▼
API / Edge Boundary
      │
      ├── Identity
      ├── Commerce
      ├── Catalogue
      ├── Inventory
      ├── Payments
      ├── Fulfilment
      ├── Subscription
      ├── Rewards
      ├── Trust
      ├── Notifications
      ├── Support
      ├── Partner Integration
      └── AI Society
```

The client must not bypass the governed edge boundary to communicate directly with internal services.

---

## 4. Client Architecture Style

Essentials Mart shall use a modular Flutter architecture with clear separation between:

```text
Presentation
    ↓
Application / Feature Logic
    ↓
Domain Contracts
    ↓
Data / Repository Layer
    ↓
Remote / Local Infrastructure
```

The exact Flutter package and state-management choices remain implementation decisions, provided they preserve the architectural boundaries in this EIP.

---

## 5. Feature Modules

The client should be organised around business capabilities rather than technical widgets alone.

Initial feature areas include:

- authentication;
- home;
- catalogue;
- product discovery;
- search;
- basket;
- checkout;
- orders;
- receipts;
- repeat purchase;
- household;
- pantry;
- AI Shopping Mode;
- Walk Mode;
- subscriptions;
- delivery;
- rewards;
- notifications;
- support;
- profile;
- partner entry points;
- settings;
- and account/security controls.

Feature modules must not create independent versions of enterprise business rules without explicit architectural approval.

---

## 6. State Ownership

Client state shall be classified.

### Server-authoritative state

Examples:

- account state;
- product price;
- stock availability;
- order status;
- payment status;
- reward balance;
- subscription status;
- delivery allocation.

### Session state

Examples:

- current navigation;
- temporary checkout state;
- active AI conversation context;
- current Walk Mode session.

### Local preference state

Examples:

- language;
- display preferences;
- notification preferences;
- selected default store;
- accessibility preferences.

### Cached state

Examples:

- recently viewed products;
- catalogue data;
- previous receipts;
- non-sensitive reference information.

### Offline queue state

Represents authorised operations that may safely be deferred.

State ownership must prevent local state from being mistaken for authoritative enterprise state.

---

## 7. API Interaction

All material server interaction must use versioned, authenticated and authorised APIs defined under EIP-021.

The client must support:

- request correlation;
- idempotency keys where required;
- retries for safe operations;
- timeout handling;
- cancellation;
- pagination;
- cache validation;
- structured error handling;
- API version compatibility;
- and observability metadata where permitted.

The client must not implement blind retry loops.

---

## 8. Authentication and Session Security

Authentication follows the enterprise identity architecture.

The client must:

- use approved authentication flows;
- protect session credentials;
- avoid hard-coded secrets;
- use platform secure storage for sensitive credentials/tokens where appropriate;
- support session expiry and renewal;
- respond safely to revocation;
- avoid exposing tokens in logs;
- and protect authentication state during offline operation.

NIST's mobile security guidance identifies credential protection, server authentication, secure storage and application vetting as important mobile security concerns. citeturn0search1turn0search6

---

## 9. Secure Server Authentication

The client must strongly authenticate the backend endpoint before trusting sensitive communications.

It must not:

- disable certificate validation;
- accept arbitrary certificates;
- silently downgrade transport security;
- or expose sensitive traffic over insecure channels.

NIST's Mobile Threat Catalogue specifically identifies failure to authenticate the backend server as enabling man-in-the-middle attacks. citeturn0search8

---

## 10. Local Data Protection

Sensitive local data must be minimised.

Where sensitive data must exist locally, the implementation should use platform-provided secure storage and appropriate encryption.

The client must avoid placing secrets in:

- source code;
- configuration committed to the repository;
- logs;
- analytics payloads;
- crash reports;
- screenshots where avoidable;
- or unsecured local storage.

NIST recommends leveraging operating-system and hardware-backed secure storage where possible for cryptographic material and sensitive secrets. citeturn0search12

---

## 11. Offline and Limited-Connectivity Architecture

Offline capability is a first-class requirement for Essentials Mart.

The client must support selected operations when connectivity is unavailable or unreliable.

```text
User Action
    ↓
Connectivity Check
    ├── Online → API
    └── Offline → Local Queue
                    ↓
                 Reconnect
                    ↓
                 Sync
                    ↓
             Server Validation
```

Offline operation must never imply that an operation succeeded authoritatively before server confirmation.

Examples of potentially offline-safe functions include:

- viewing cached catalogue information;
- viewing previously synchronised receipts;
- viewing household information;
- preparing a shopping list;
- preparing a basket;
- drafting subscription changes;
- and queuing selected non-conflicting user actions.

Payment authorization, final inventory confirmation and other high-risk operations remain server-authoritative.

---

## 12. Synchronisation

Synchronisation must account for:

- duplicate requests;
- stale state;
- conflicting changes;
- expired sessions;
- deleted resources;
- changed prices;
- changed inventory;
- cancelled orders;
- and changed delivery availability.

The server remains authoritative when local and server state disagree.

---

## 13. AI Society Integration

The client does not host the enterprise AI Society as an unrestricted autonomous authority.

The client communicates with governed AI capabilities through the backend AI architecture established in EIP-024.

```text
Flutter
   ↓
AI Capability Gateway
   ↓
AI Society Runtime
   ↓
Agents / Intelligence Engines
   ↓
Authorised Enterprise Capabilities
```

The client must distinguish between:

- recommendation;
- explanation;
- request for approval;
- authorised action;
- completed action;
- and failed action.

An AI response displayed in the client is not itself proof that an enterprise action occurred.

---

## 14. AI Shopping Mode

AI Shopping Mode extends ordinary shopping rather than replacing it.

It may:

- interpret shopping intent;
- build or modify a basket;
- inspect authorised pantry information;
- identify low-stock essentials;
- recommend replenishment;
- use previous receipts;
- recommend substitutions;
- identify recurring purchases;
- and notify the user.

The final authority for consequential actions remains governed by backend capabilities and user permissions.

---

## 15. Walk Mode

Walk Mode is a client-intensive capability but remains dependent on enterprise services.

It may render:

- store maps;
- aisles;
- product locations;
- routes;
- product recognition results;
- shopping-list highlights;
- alternatives;
- and AI guidance.

Walk Mode modes remain:

1. Manual;
2. AI Assisted;
3. Autopilot.

The user retains decision authority according to the Walk Mode architecture.

The client must support graceful transition between modes and user takeover.

---

## 16. Subscription Integration

Essentials Subscription is an extension of normal shopping and delivery capabilities.

The client must allow users to:

- create a subscription;
- select products;
- set quantities;
- select frequencies;
- select delivery windows;
- choose shared or personalised delivery where available;
- view calculated subscription cost;
- modify the subscription;
- pause;
- resume;
- and cancel.

The client displays the backend-calculated subscription price and availability rather than independently determining authoritative cost.

AI Shopping Mode may assist with subscription replenishment, but subscription state remains governed by the Subscription domain.

---

## 17. Delivery Integration

The client must consume delivery options calculated by the backend.

Possible options include:

- scheduled delivery;
- shared delivery;
- personalised delivery;
- express/fast delivery;
- subscription route delivery;
- and partner/transport-assisted delivery.

The client displays:

- ETA;
- selected slot;
- delivery cost;
- route status where appropriate;
- and dispatch status.

It must not claim an ETA that the backend has not established.

---

## 18. Notifications

Notifications are delivered through the Notification Architecture.

The client may receive:

- order updates;
- delivery updates;
- subscription reminders;
- pantry/replenishment alerts;
- reward notifications;
- AI recommendations;
- security alerts;
- support updates;
- and operational messages.

The client must respect user notification preferences and server-side authorization.

WhatsApp remains an external communication channel and must not be treated as a second client authority.

---

## 19. Receipts and Repeat Purchase

The client must provide access to authorised historical receipts.

A user may use an earlier receipt to:

- inspect the previous purchase;
- repeat the purchase;
- modify the basket;
- substitute unavailable items;
- and proceed through the normal checkout flow.

Repeat purchase is not a separate commerce authority; it is a client experience built on existing commerce capabilities.

---

## 20. Payments

The client must treat payment systems as backend-controlled.

It may support:

- cards;
- approved wallets;
- partner payment methods;
- vouchers;
- and future payment instruments.

Sensitive payment credentials should not be stored in the application unless explicitly required by an approved payment architecture.

Payment authorization, settlement and final payment state remain server-authoritative.

---

## 21. Partner Entry Points

Partners may enter Essentials Mart through approved mechanisms including:

- app tile;
- referral/deep link;
- API-driven catalogue;
- embedded storefront where approved;
- and payment/integration adapters.

Partner entry must not bypass Essentials Mart identity, authorization, pricing, security or domain boundaries.

The client must be capable of identifying the originating partner context without treating the partner as an authority over Essentials Mart business truth.

---

## 22. Deep Links and Universal Links

External links into the application must be validated.

The client must prevent malicious or manipulated links from causing unauthorized actions.

Deep links should resolve to an intended state such as:

- product;
- basket;
- order;
- subscription;
- promotion;
- partner campaign;
- or support destination.

Sensitive actions require normal authentication and authorization checks.

---

## 23. State and Navigation Security

Navigation state must not be treated as authorization.

For example:

```text
User navigates to /admin
        ↓
Client displays route
        ✗
```

Authorization must still be enforced by the backend.

The client may hide unavailable functions for usability, but hiding UI is never the security control.

---

## 24. Error Handling

The client must distinguish:

- validation errors;
- authentication errors;
- authorization errors;
- network failures;
- service unavailability;
- stale state;
- conflict responses;
- payment failures;
- AI failures;
- and unexpected failures.

Errors should be translated into safe user-facing messages without exposing internal implementation details, credentials, stack traces or sensitive information.

---

## 25. Resilience

The client should degrade gracefully when individual backend capabilities are unavailable.

For example:

```text
AI unavailable
    ↓
Normal shopping remains available
```

```text
Recommendations unavailable
    ↓
Catalogue and checkout remain available
```

```text
Delivery tracking unavailable
    ↓
Last known state + safe status message
```

Critical commerce functionality must not unnecessarily depend on non-critical intelligence services.

---

## 26. Caching

Caching should improve performance and availability without creating false authority.

Cache policies must consider:

- freshness;
- sensitivity;
- invalidation;
- user identity;
- geographic/store context;
- product price changes;
- inventory changes;
- and legal retention requirements.

Highly volatile business state should use short-lived or server-validated caching.

---

## 27. Performance

The client architecture should support:

- lazy loading;
- pagination;
- image optimization;
- efficient local storage;
- background synchronization;
- bounded AI context;
- request deduplication;
- and progressive rendering.

Performance optimizations must not weaken authorization, validation or data integrity.

---

## 28. Accessibility

Accessibility must be a first-class client requirement.

The client should support:

- scalable text;
- screen readers;
- sufficient contrast;
- accessible controls;
- keyboard/external input where applicable;
- semantic labels;
- reduced motion;
- localization;
- and accessible error feedback.

---

## 29. Localization and Regionalisation

The client must support future geographic expansion.

Regionalisation may affect:

- language;
- currency;
- measurement units;
- tax display;
- product availability;
- delivery options;
- store selection;
- payment methods;
- partner availability;
- and legal disclosures.

These should be driven by governed backend configuration where they represent enterprise truth.

---

## 30. Privacy

The client must follow data minimisation principles.

It should collect only information necessary for the requested capability.

Analytics and telemetry must not automatically capture sensitive content simply because the client can observe it.

Particular care is required for:

- household information;
- pantry information;
- location;
- Walk Mode activity;
- behavioural information;
- AI conversations;
- payment information;
- and notification content.

---

## 31. Client Telemetry

Client telemetry should support:

- performance monitoring;
- crash diagnosis;
- availability measurement;
- security detection;
- feature reliability;
- and user-experience analysis.

Telemetry must be privacy-aware and governed.

Sensitive information must not be placed in telemetry merely for convenience.

---

## 32. Crash and Failure Reporting

Crash reports must be scrubbed of secrets and unnecessary personal information.

The system should support:

- crash grouping;
- release identification;
- device/platform metadata;
- reproducibility information;
- severity classification;
- and linkage to backend traces where appropriate.

---

## 33. Client Security Hardening

The application should use:

- code signing;
- secure update mechanisms;
- dependency scanning;
- build integrity controls;
- secret scanning;
- runtime integrity signals where appropriate;
- secure storage;
- anti-tampering measures where justified;
- and release-channel controls.

Client-side hardening raises the cost of extraction and abuse but does not create absolute secrecy because client code executes on user-controlled devices.

Critical proprietary algorithms remain backend-controlled under Part 4.

---

## 34. Dependency Governance

Flutter and third-party dependencies must be governed.

Dependencies must be evaluated for:

- security;
- licensing;
- maintenance;
- provenance;
- vulnerability exposure;
- update compatibility;
- and architectural fit.

Unnecessary dependencies should be avoided.

---

## 35. Build and Release Architecture

Client releases must be reproducible and traceable.

Every release should be associated with:

- source revision;
- build configuration;
- dependency lock state;
- environment configuration;
- signing identity;
- release version;
- and verification evidence.

Production secrets must not be embedded into source-controlled build configuration.

---

## 36. Environment Separation

The client must distinguish:

- development;
- test;
- staging;
- production;
- and other approved environments.

Environment-specific endpoints and configuration must be controlled rather than hard-coded throughout feature code.

---

## 37. Testing

Client testing must include:

- unit tests;
- widget tests;
- integration tests;
- API contract tests;
- offline/synchronization tests;
- authentication tests;
- authorization behaviour tests;
- deep-link tests;
- payment-flow tests;
- AI interaction tests;
- Walk Mode tests;
- accessibility tests;
- performance tests;
- security tests;
- and release verification.

NIST's mobile application vetting guidance emphasises security requirements, vulnerability testing and verification before deployment. citeturn0search1turn0search7

---

## 38. Client-to-Backend Traceability

Each material client capability must trace through EIP-019.

Example:

```text
Walk Mode Requirement
        ↓
ADR-014
        ↓
EIP-025
        ↓
Walk Mode Flutter Module
        ↓
API / Event Contracts
        ↓
Integration Tests
        ↓
Release Evidence
```

---

## 39. Implementation Readiness Gates

A client feature is implementation-ready only when:

1. its owning capability is identified;
2. its backend authority is identified;
3. its API/event contracts are defined;
4. its data requirements are defined;
5. its security requirements are defined;
6. its offline behaviour is defined where applicable;
7. its failure behaviour is defined;
8. its telemetry requirements are defined;
9. its accessibility requirements are defined;
10. its tests are identified;
11. its release dependencies are identified.

---

## 40. Client Constitutional Laws

1. The client is not an enterprise source of truth.
2. Backend authorization remains authoritative.
3. Client UI visibility is not authorization.
4. Sensitive secrets must not be embedded in the client.
5. Critical business logic remains server-controlled where required.
6. Offline state must not masquerade as confirmed server state.
7. Offline queues must be idempotent and safely reconciled.
8. Client retries must be bounded and context-aware.
9. AI recommendations must be distinguishable from completed actions.
10. AI capability access must remain governed by the backend.
11. Walk Mode must respect user authority and approved operating modes.
12. Subscription functionality extends existing commerce and delivery capabilities.
13. Repeat purchase uses existing commerce capabilities.
14. Client telemetry must respect privacy requirements.
15. Sensitive information must not be unnecessarily logged.
16. Partner entry points must not bypass enterprise controls.
17. Deep links must not bypass authorization.
18. Client releases must be traceable to source and verification evidence.
19. Third-party dependencies must be governed.
20. Client security controls must complement, not replace, backend security.
21. The client must degrade safely when non-critical services fail.
22. Client architecture must remain aligned with EIP-019 traceability.
23. Material deviations require architectural review.

---

## 41. Architectural Outcome

EIP-025 establishes Flutter as a secure, modular and resilient interaction layer over the Essentials Mart enterprise platform.

```text
                    FLUTTER CLIENT
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     Shopping          AI Society        Walk Mode
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                   API / Edge Layer
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
     Commerce          Services          Events
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                   Enterprise Data
                          │
                          ▼
                    Intelligence
                          │
                          ▼
                     Outcomes
```

The client therefore becomes the principal human interaction surface without becoming an uncontrolled copy of the enterprise backend.

---

## 42. Final Principle

> **Essentials Mart shall treat the Flutter client as a secure, accessible and resilient window into the enterprise—not as the enterprise itself.**

The client must preserve:

**user control → secure interaction → governed capability access → offline resilience → enterprise authority → traceability.**
