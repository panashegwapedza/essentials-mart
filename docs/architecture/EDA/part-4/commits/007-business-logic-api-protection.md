# EDA-001 Part 4 — Commit 007
# Business Logic & API Protection Architecture

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 007  
**Date:** 2026-08-18  
**Decision Type:** Business Logic & API Defensive Architecture  
**Parent Architecture:** EDA-001  
**Predecessor:** EDA-001 Part 4 — Commit 006: Runtime Threat Detection, Bot Defence & Adaptive Abuse Control

---

## 1. Purpose

This commit establishes the defensive architecture for protecting Essentials Mart's APIs and business workflows against abuse, manipulation, bypass, replay, enumeration, state corruption and unauthorised execution.

Part 3 establishes the platform's security architecture, identity, authorisation, service boundaries and security controls.

Part 4 Commit 007 addresses what happens when an attacker attempts to exploit the **logic and interfaces exposed by those controls**.

The objective is to ensure that:

- valid authentication does not imply unlimited authority;
- valid API access does not imply unrestricted business-flow access;
- client input cannot directly determine protected server state;
- workflows cannot be skipped or reordered without validation;
- sensitive operations cannot be replayed indefinitely;
- concurrent requests cannot bypass business constraints;
- APIs expose only the minimum required information;
- hidden or deprecated functionality cannot become an alternate attack path;
- external API consumption cannot create an uncontrolled trust boundary;
- business invariants remain authoritative on trusted backend systems.

OWASP's API Security Top 10 identifies broken object-level authorisation, broken authentication, broken object-property authorisation, unrestricted resource consumption, broken function-level authorisation and unrestricted access to sensitive business flows among the principal API risks. citeturn0search1turn0search0

---

## 2. Architectural Boundary

The protected boundary is:

```text
Client / External Channel
        ↓
API / Channel Adapter
        ↓
Authentication
        ↓
Identity Resolution
        ↓
Authorisation
        ↓
Runtime Risk / Abuse Controls
        ↓
Business Policy
        ↓
Workflow / State Validation
        ↓
Domain Operation
        ↓
Transaction / Persistence
        ↓
Audit / Evidence
```

Every layer has a distinct responsibility.

A successful request must satisfy the controls required at each relevant layer before the protected state transition occurs.

---

## 3. Server-Side Business Authority

The server shall remain authoritative for protected business decisions.

The client shall not be trusted to determine:

- price;
- discount;
- tax;
- reward eligibility;
- wallet balance;
- order state;
- payment state;
- inventory authority;
- delivery status;
- household permissions;
- staff clearance;
- Trust Engine decisions;
- AI authority;
- promotion eligibility;
- transaction completion;
- security state.

Client-provided values may be treated as requests or observations, but protected values shall be derived or validated by trusted backend systems.

---

## 4. Business Invariants

Critical business rules shall be expressed as explicit invariants.

Examples include:

```text
An order cannot be delivered before it is fulfilled.

A cancelled order cannot later become delivered without an authorised recovery process.

A reward cannot be redeemed more times than its eligibility permits.

A household member cannot grant themselves higher authority.

A wallet cannot spend funds that do not exist.

A product cannot be sold from inventory that is not available for sale.

A staff member cannot perform an action outside their effective clearance.

An AI agent cannot execute a tool outside its granted capability.
```

For every critical invariant, the architecture shall identify the trusted component that enforces it.

An invariant shall never depend solely on the UI or on the expectation that users will follow the intended sequence. OWASP similarly recommends enforcing business-logic invariants at the business-logic layer rather than relying on client behaviour. citeturn0search11

---

## 5. Contextual Authorisation

Authorisation shall evaluate not only whether an actor may perform an operation, but whether the actor may perform that operation:

- on this resource;
- in this household;
- in this store;
- in this region;
- in this workflow state;
- at this point in time;
- using this channel;
- with this device or session;
- under this authority;
- for this purpose.

Conceptually:

```text
Can actor X
   ↓
perform action Y
   ↓
on resource Z
   ↓
in state S
   ↓
under context C?
```

A general role must never substitute for contextual authorisation.

---

## 6. Object-Level Authorisation

Every API operation involving a protected object shall establish that the caller has authority over that specific object.

This protects against object identifier manipulation and cross-user access.

Examples include:

- accessing another customer's order;
- modifying another household's shopping list;
- accessing another household's pantry;
- changing another user's preferences;
- viewing another supplier's information;
- accessing another store's inventory;
- modifying another staff member's records.

Object identifiers supplied by clients shall not be treated as proof of ownership or authority.

---

## 7. Property-Level Authorisation

APIs shall distinguish between fields that an actor may read and fields that an actor may modify.

For example, a customer may be permitted to update a household preference but not:

- household role;
- security clearance;
- wallet balance;
- internal risk score;
- reward eligibility;
- fraud status;
- internal identifiers.

Request payloads shall use explicit allow-lists for writable properties where appropriate.

This prevents mass-assignment and object-state manipulation vulnerabilities. OWASP's 2025 Business Logic Abuse work specifically identifies object-state manipulation as a risk where unfiltered user input can override protected internal properties. citeturn0search7

---

## 8. Function-Level Authorisation

Every privileged function shall enforce its own authority requirements.

Hidden UI elements are not security controls.

An endpoint shall not become authorised merely because a client application normally hides the button that invokes it.

Privileged functions include:

- staff operations;
- administrative operations;
- supplier operations;
- financial operations;
- reward administration;
- security administration;
- AI governance operations;
- system configuration;
- bulk data operations.

---

## 9. Sensitive Business Flows

Sensitive business flows shall be explicitly identified and protected.

Examples include:

- account creation;
- authentication;
- password reset;
- payment;
- checkout;
- promotion redemption;
- reward redemption;
- referral creation;
- returns;
- wallet operations;
- delivery address changes;
- household membership changes;
- staff privilege changes;
- supplier onboarding;
- AI tool execution.

Protection may include:

- rate limits;
- quotas;
- step-up authentication;
- transaction limits;
- velocity controls;
- anomaly detection;
- confirmation;
- human approval;
- temporary holds.

OWASP specifically identifies unrestricted access to sensitive business flows as an API risk because bots and other automation can exploit legitimate workflows without necessarily exploiting a conventional software vulnerability. citeturn0search0

---

## 10. Workflow State Protection

Multi-step workflows shall use explicit state validation.

For example:

```text
Created
  ↓
Confirmed
  ↓
Paid
  ↓
Fulfilled
  ↓
Dispatched
  ↓
Delivered
```

The API shall prevent callers from directly forcing a later state.

Invalid transitions shall be rejected.

The permitted transition graph shall be enforced server-side.

---

## 11. Transition Validation

Every sensitive state transition shall validate:

- current state;
- requested transition;
- actor authority;
- required prerequisites;
- time constraints;
- associated objects;
- relevant business rules;
- security conditions.

This protects against workflow skipping and state-machine manipulation.

---

## 12. Race-Condition Protection

Business operations that must occur once or atomically shall be protected against concurrent execution.

Examples include:

- single-use promotions;
- reward redemption;
- wallet debits;
- inventory reservation;
- order cancellation;
- refunds;
- one-time claims.

Controls may include:

- transactions;
- unique constraints;
- idempotency keys;
- optimistic concurrency controls;
- pessimistic locking where justified;
- compare-and-set operations;
- atomic state transitions.

The objective is to prevent time-of-check/time-of-use gaps in which concurrent requests bypass a single-use or limited-use rule.

OWASP's Business Logic Abuse taxonomy identifies action-limit overruns and concurrent workflow-order bypass as distinct business-logic attack classes. citeturn0search2

---

## 13. Idempotency

Operations that may be retried shall define whether they are idempotent.

Particularly sensitive operations shall use idempotency mechanisms where appropriate.

Examples include:

- payments;
- order submission;
- refunds;
- reward redemption;
- wallet operations;
- delivery booking;
- external-provider commands.

Repeated delivery of the same authorised request shall not unintentionally create multiple financial or business effects.

---

## 14. Replay Protection

Short-lived or single-use security artefacts shall have explicit lifecycles.

Controls may include:

- expiry;
- nonce validation;
- sequence numbers;
- one-time tokens;
- idempotency keys;
- state binding;
- session binding;
- transaction binding.

Expired or already-consumed artefacts shall not remain usable for sensitive operations.

---

## 15. Request Validation

API requests shall be validated before reaching protected business logic.

Validation shall cover:

- type;
- format;
- length;
- range;
- allowed values;
- object relationships;
- required fields;
- prohibited fields;
- encoding;
- structural constraints.

Validation shall be performed on the server even when equivalent validation exists in the client.

---

## 16. Mass Assignment Protection

API implementations shall not blindly map arbitrary client fields into internal domain objects.

Protected fields shall require explicit authority and controlled mutation paths.

For example, a generic update request shall not allow a customer to submit:

```json
{
  "name": "Customer",
  "role": "ADMIN",
  "walletBalance": 1000000,
  "riskLevel": "trusted"
}
```

and have those fields automatically applied to internal state.

The domain layer shall expose controlled operations rather than unrestricted object mutation.

---

## 17. Response Minimisation

API responses shall contain only information required by the requesting context.

The server shall not rely on the UI to hide sensitive response fields.

Potentially sensitive information includes:

- internal identifiers;
- security metadata;
- fraud indicators;
- Trust Engine signals;
- staff information;
- supplier information;
- payment-related data;
- infrastructure details;
- internal pricing logic;
- model metadata;
- proprietary decision data.

OWASP notes that excessive API responses can expose sensitive information even when the UI deliberately hides those fields. citeturn0search5

---

## 18. Enumeration Resistance

The platform shall reduce opportunities to enumerate:

- users;
- households;
- orders;
- products;
- inventory;
- suppliers;
- staff;
- API endpoints;
- identifiers;
- rewards;
- promotions.

Controls may include:

- opaque identifiers;
- access checks;
- pagination limits;
- rate limits;
- response normalisation;
- query restrictions;
- monitoring.

Enumeration resistance shall complement, not replace, object-level authorisation.

---

## 19. API Inventory and Lifecycle

All production APIs shall have an accountable owner and lifecycle state.

Possible states include:

```text
Proposed
   ↓
Active
   ↓
Deprecated
   ↓
Retired
```

Deprecated endpoints shall have a defined removal plan.

Retired endpoints shall not remain silently accessible.

This reduces the risk of forgotten or undocumented functionality becoming an alternate attack surface. OWASP identifies improper API inventory management as one of its API Security Top 10 risks. citeturn0search1

---

## 20. Shadow Function Defence

Internal, administrative, test and diagnostic functions shall not remain unintentionally exposed in production.

Examples include:

- undocumented endpoints;
- debug routes;
- test utilities;
- alternate authentication paths;
- internal WebSocket routes;
- maintenance functions;
- emergency operations.

Production functionality shall be inventoried and governed.

OWASP's Business Logic Abuse taxonomy identifies shadow-function abuse as a class in which hidden or forgotten functionality can become an alternate route around normal safeguards. citeturn0search9

---

## 21. API Versioning

API changes shall preserve security guarantees across versions.

A new API version shall not accidentally:

- weaken authorisation;
- expose additional fields;
- bypass workflow checks;
- remove rate limits;
- alter transaction semantics;
- reintroduce retired vulnerabilities.

Security controls shall therefore be part of API contract testing and version review.

---

## 22. API Gateway Controls

The API gateway shall provide perimeter controls such as:

- authentication integration;
- rate limiting;
- request-size limits;
- protocol validation;
- routing restrictions;
- abuse detection;
- request tracing;
- TLS enforcement;
- policy enforcement.

The gateway shall not be the only security boundary.

Domain services must continue to enforce their own business authority.

---

## 23. Service-to-Service Protection

Internal APIs shall be treated as protected interfaces rather than inherently trusted connections.

Service requests shall establish:

- service identity;
- intended capability;
- authorised target;
- request integrity;
- appropriate context.

A compromised service shall not automatically gain unrestricted access to unrelated services.

---

## 24. External API Consumption

External APIs shall be treated as untrusted dependencies even when supplied by established providers.

Controls shall include:

- schema validation;
- response validation;
- timeout controls;
- retry limits;
- circuit breakers;
- authentication validation;
- response-size limits;
- error handling;
- provider isolation.

Essentials Mart shall not blindly trust external API responses as authoritative domain state.

---

## 25. SSRF Protection

Where Essentials Mart accepts URLs, webhooks, remote resources or provider-defined destinations, server-side request forgery risks shall be addressed.

Controls may include:

- destination allow-lists;
- URL validation;
- scheme restrictions;
- private-network blocking;
- DNS resolution controls;
- redirect validation;
- egress restrictions;
- metadata-service protection.

OWASP includes SSRF among the API Security Top 10 because server-side integrations can create paths into internal infrastructure. citeturn0search1

---

## 26. Resource Consumption Controls

API endpoints shall have resource expectations.

Controls shall address:

- request size;
- query complexity;
- pagination;
- concurrency;
- execution time;
- database cost;
- AI inference cost;
- external-provider cost;
- memory consumption;
- file-processing cost.

These controls complement Commit 006's runtime rate limiting and quota architecture.

The distinction is:

**Commit 006:** detects and controls abusive runtime behaviour.

**Commit 007:** ensures individual API and business operations are intrinsically bounded and cannot violate business constraints.

---

## 27. Business Logic and Fraud Integration

Business-logic protection shall integrate with Fraud Intelligence.

```text
API Request
    ↓
Business Validation
    ↓
Fraud / Risk Signals
    ↓
Policy Decision
    ↓
Execute / Challenge / Hold / Reject
```

Fraud Intelligence may identify suspicious behaviour, but domain services remain responsible for enforcing their business invariants.

---

## 28. Trust Engine Integration

The Trust Engine may provide contextual risk information.

However, a positive trust score shall never override a mandatory business invariant or security control.

For example:

```text
Trusted Customer
       ↓
Valid identity
       ↓
Still cannot bypass:
       ↓
Payment rules
Inventory rules
Reward rules
Household authority
Order state
Security policy
```

Trust informs decisions; it does not replace authority.

---

## 29. Reward and Promotion Protection

Reward and promotion APIs shall protect against:

- repeated redemption;
- concurrent redemption;
- referral manipulation;
- household manipulation;
- synthetic transactions;
- coupon replay;
- eligibility bypass;
- parameter tampering;
- reward-state manipulation.

Reward eligibility shall be recomputed or validated server-side at the point of sensitive execution.

---

## 30. Commerce Protection

Commerce workflows shall enforce state and financial invariants across:

- cart;
- checkout;
- payment;
- order creation;
- cancellation;
- fulfilment;
- dispatch;
- delivery;
- returns;
- refunds.

The API shall not allow a client to manufacture a favourable state transition by directly supplying a desired status.

---

## 31. Household Protection

Household APIs shall protect:

- membership;
- invitations;
- roles;
- permissions;
- household wallet;
- shopping lists;
- pantry state;
- household goals;
- shared data.

A household member shall not be able to modify another member's authority merely by manipulating identifiers or role fields.

---

## 32. AI API and Tool Protection

AI-facing APIs and tools shall apply the same business-logic protections as ordinary APIs.

An AI agent shall not be permitted to:

- invoke tools outside its capability;
- bypass workflow state;
- modify protected properties;
- exceed resource quotas;
- impersonate a higher-authority actor;
- perform actions outside its delegated authority.

Tool calls shall be validated at the backend even when initiated by a trusted AI component.

---

## 33. Walk Mode API Protection

Walk Mode APIs shall protect real-time operations involving:

- navigation;
- store maps;
- product recognition;
- inventory visibility;
- shopping-list updates;
- basket changes;
- proximity interactions;
- autonomous movement commands.

The system shall verify that requested information and actions are authorised for the current shopper, store and session context.

Walk Mode must not become a privileged API path merely because it is real-time or AI-assisted.

---

## 34. WhatsApp API Protection

WhatsApp-originated commands shall enter the same authorised action layer as application-originated commands.

```text
WhatsApp
   ↓
Channel Adapter
   ↓
Identity
   ↓
Authorisation
   ↓
Runtime Abuse Controls
   ↓
Business Validation
   ↓
Authorised Action
```

WhatsApp shall not receive a privileged security bypass.

Commands such as:

- add item;
- modify household state;
- inspect pantry;
- request order information;
- initiate sensitive actions;

shall be subject to the same underlying authority model as the app.

---

## 35. Auditability

Security-sensitive business operations shall produce auditable evidence containing, where appropriate:

- actor;
- identity;
- resource;
- requested action;
- decision;
- authority;
- relevant policy;
- workflow state;
- result;
- timestamp;
- correlation identifier.

The audit record shall describe the actual decision path without unnecessarily exposing sensitive internal security information to ordinary users.

---

## 36. Error Handling

API errors shall avoid exposing unnecessary implementation details.

Responses should not reveal:

- database structure;
- internal service topology;
- secrets;
- stack traces;
- privileged identifiers;
- security-sensitive decision internals.

At the same time, errors shall remain sufficiently structured for legitimate clients and operators to handle them correctly.

---

## 37. Fail Securely

If required authorisation, workflow or business validation cannot be established, sensitive operations shall not proceed.

Examples include:

```text
Cannot verify authority → reject
Cannot verify payment state → do not fulfil
Cannot verify reward eligibility → do not redeem
Cannot verify workflow state → do not transition
Cannot verify AI capability → do not execute tool
```

---

## 38. Testing and Verification

API and business-logic security shall be continuously tested.

Testing shall include:

- unit tests for invariants;
- integration tests;
- authorisation tests;
- cross-user access tests;
- workflow-transition tests;
- concurrency tests;
- replay tests;
- fuzzing;
- API security testing;
- abuse-case testing;
- penetration testing;
- regression testing.

OWASP's API Security Testing Framework explicitly supports testing across the API Security Top 10 and cross-user authorisation scenarios. citeturn0search8

---

## 39. Adversarial Testing

Security testing shall include deliberate attempts to:

- skip workflow steps;
- reorder requests;
- modify object identifiers;
- modify protected properties;
- replay requests;
- race concurrent operations;
- enumerate resources;
- bypass rate limits;
- invoke hidden endpoints;
- abuse sensitive flows;
- exploit trust assumptions;
- manipulate AI tool requests.

The objective is to test the business logic as an attacker would, not merely to confirm that normal user journeys work.

---

## 40. Relationship With Commit 006

Commit 006 establishes runtime detection and adaptive abuse controls.

Commit 007 establishes the defensive properties of the API and business logic themselves.

Therefore:

```text
Commit 006
Runtime Detection / Response
        ↓
Commit 007
Intrinsic API / Business Protection
```

Commit 007 shall not duplicate Commit 006's bot-detection or rate-limiting architecture.

Instead, it defines the business and API constraints that runtime controls protect and enforce.

---

## 41. Relationship With Part 3

Part 3 remains authoritative for:

- identity architecture;
- authorisation architecture;
- staff clearance architecture;
- AI security architecture;
- Trust Engine security;
- security monitoring;
- security governance;
- auditability;
- privacy architecture.

Commit 007 operationalises those decisions at the API and business-workflow boundary.

It does not redefine Part 3's security model.

---

## 42. Relationship With ADRs

This commit shall remain consistent with, at minimum:

- ADR-003 — Event-Driven Architecture;
- ADR-004 — API & Service Architecture;
- ADR-005 — Data Ownership & Database Boundaries;
- ADR-006 — Identity, Authentication & Authorisation;
- ADR-007 — AI Society Architecture;
- ADR-008 — Intelligence Engine Architecture;
- ADR-009 — AI Agent Governance & Permissions;
- ADR-010 — Human-in-the-Loop Architecture;
- ADR-011 — Notification & Communication Architecture;
- ADR-012 — WhatsApp Integration Architecture;
- ADR-014 — Walk Mode / Living Digital Supermarket Architecture;
- ADR-015 — Security & Anti-Replication Architecture;
- ADR-016 — Observability, Auditability & Trust Architecture;
- ADR-017 — Scalability & Multi-Store Architecture;
- ADR-018 — Deployment & Environment Strategy.

Where a conflict is discovered, the conflict shall be recorded and resolved through the established architecture decision process rather than silently overridden in implementation.

---

## 43. Architectural Principles Established

**BL-001 — Server-Enforced Invariants**  
Critical business rules shall be enforced by trusted backend systems.

**BL-002 — Contextual Authorisation**  
Authority depends on actor, resource, state and context.

**BL-003 — Explicit State Transitions**  
Sensitive workflows shall validate state transitions explicitly.

**BL-004 — Protected Properties**  
Clients shall not directly control protected domain properties.

**BL-005 — Bounded Operations**  
API operations shall have explicit resource and business limits.

**BL-006 — Replay Resistance**  
Sensitive one-time or stateful operations shall resist replay.

**BL-007 — Concurrency Safety**  
Limited or single-use operations shall remain safe under concurrent execution.

**BL-008 — API Lifecycle Governance**  
Production APIs shall be inventoried, owned, versioned, deprecated and retired deliberately.

**BL-009 — No Hidden Authority**  
Undocumented or hidden functionality shall not provide an alternate privileged path.

**BL-010 — Channel Independence**  
App, WhatsApp and other channels shall enter the same authoritative action model.

**BL-011 — Trust Is Not Authority**  
Trust signals may inform decisions but shall not override mandatory controls.

**BL-012 — AI Is Not Exempt**  
AI-initiated actions shall obey the same authoritative business and security boundaries.

---

## 44. Success Criteria

Commit 007 succeeds when:

- critical business invariants are explicitly identified;
- server-side enforcement is authoritative;
- object-level authorisation is enforced;
- property-level authorisation is enforced;
- function-level authorisation is enforced;
- sensitive business flows are identified and protected;
- workflow transitions cannot be skipped;
- concurrency cannot bypass single-use constraints;
- sensitive operations resist replay;
- request payloads cannot arbitrarily mutate protected state;
- API responses are minimised;
- enumeration is constrained;
- API inventory is governed;
- shadow functions are controlled;
- API versions preserve security guarantees;
- service-to-service APIs remain protected;
- external API responses are treated as untrusted input;
- SSRF risks are addressed where applicable;
- resource consumption is bounded;
- Fraud Intelligence and Trust Engine remain properly separated from domain authority;
- reward and commerce workflows are protected;
- Household workflows are protected;
- AI tools remain capability-bound;
- Walk Mode APIs remain context-bound;
- WhatsApp does not bypass security;
- sensitive actions are auditable;
- errors do not unnecessarily disclose internal information;
- adversarial API and business-logic testing is part of the security lifecycle.

---

## 45. Next Commit

The next chronological commit shall be governed by the Part 4 master index.

**Commit 008 — Cyber Threat Defence & Application Attack Resistance**

It will address defensive engineering against direct technical attacks against the application and supporting services, including injection, malicious input, session and protocol abuse, application-layer exploitation, denial-of-service techniques, malware-related threats and attack-chain disruption.

Commit 008 shall build on the business/API boundaries established here rather than redefining them.
