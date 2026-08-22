# Commit 014 — API & Service Boundary Defence

**Document:** EDA-001 Part 4 — Infrastructure, Network & Defensive Architecture  
**Commit:** 014  
**Title:** API & Service Boundary Defence  
**Status:** Commit Ready  
**Classification:** Defensive Architecture  
**Date:** 22 August 2026

---

## 1. Purpose

Commit-014 establishes the security architecture for protecting APIs and service boundaries across Essentials Mart.

APIs are treated as security boundaries, not merely transport mechanisms.

The architecture applies to:

- public APIs;
- mobile and web APIs;
- internal service APIs;
- AI and Intelligence Engine APIs;
- partner APIs;
- payment APIs;
- WhatsApp integrations;
- delivery-provider APIs;
- mapping APIs;
- scheduled-transport integrations;
- administrative APIs;
- webhook endpoints;
- background service interfaces;
- and future API technologies.

The architecture must protect both external and internal APIs. NIST's current API guidance explicitly treats API protection as a lifecycle concern spanning development and runtime, while zero-trust guidance requires authentication and authorisation for API communications rather than trusting network location. 

---

## 2. Constitutional API Principle

> **Every API request must be treated as an untrusted request until the identity, authority, context, resource access and intended operation have been independently validated.**

Network location, possession of a valid token, membership of a trusted organisation, or successful authentication alone must not establish permission to perform a particular action.

---

## 3. API Security Is Layered

Essentials Mart shall not depend on a single API gateway or perimeter control.

Conceptually:

```text
Client / Partner / Service / Agent
            ↓
        Edge Defence
            ↓
       API Gateway
            ↓
     Authentication
            ↓
       Authorisation
            ↓
   Request / Schema Validation
            ↓
    Business-Flow Controls
            ↓
       Service Boundary
            ↓
       Resource Access
            ↓
        Audit / Trace
```

Internal APIs must receive equivalent architectural protection appropriate to their risk.

---

## 4. Identity Before Authority

Authentication establishes who or what is making a request.

Authorisation establishes what that identity may do.

These must remain separate.

```text
Authenticated
     ≠
Authorised
```

A valid customer session must not automatically provide access to another customer's resources, administrative functions, supplier information, store operations or intelligence capabilities.

---

## 5. User Context

Where a service acts on behalf of a user, the API must preserve the relationship between:

- user identity;
- session or credential;
- calling application;
- device where relevant;
- tenant or organisation;
- store or geographic scope;
- requested resource;
- requested action;
- and applicable policy.

A service must not rely solely on a caller-controlled user identifier supplied in a request body or URL.

---

## 6. Service Identity

Internal services must have independently verifiable identities.

Service-to-service communication should use authenticated service identities and, where appropriate, mutual authentication.

A service must not gain additional authority merely because it is operating inside the internal network.

This follows the zero-trust principle that resource protection should be based on identity and policy rather than implicit network trust. 

---

## 7. Object-Level Authorisation

Every resource access must verify that the caller is permitted to access the specific object.

Example:

```text
GET /orders/123
        ↓
Is caller allowed to access Order 123?
        ↓
Yes / No
```

The existence of a valid session or predictable object identifier must never establish access.

This directly addresses broken object-level authorisation, one of the principal API risks identified by OWASP. 

---

## 8. Property-Level Authorisation

Access to an object does not automatically grant access to every property of that object.

For example, a customer may access an order but must not receive:

- internal fraud scores;
- payment-provider secrets;
- internal fulfilment metadata;
- privileged operational notes;
- internal supplier information;
- security telemetry;
- or hidden administrative fields.

API responses must contain only information necessary for the authorised use case.

---

## 9. Function-Level Authorisation

Administrative and privileged functions must have explicit authorisation checks.

A customer endpoint must not become an administrative endpoint merely because the caller manipulates:

- URL paths;
- HTTP methods;
- role values;
- request headers;
- object identifiers;
- or client-side state.

Administrative capabilities must be independently protected.

---

## 10. Capability-Specific Authority

Essentials Mart shall prefer narrowly scoped capabilities over broad credentials.

For example:

```text
Delivery Service
    ↓
May update delivery state

NOT

Delivery Service
    ↓
May modify customer account
```

This limits blast radius when a service, credential or integration is compromised.

---

## 11. API Credential Protection

API credentials must be:

- securely generated;
- narrowly scoped;
- stored securely;
- rotated;
- revocable;
- monitored;
- and attributable.

Long-lived shared credentials should be avoided where practical.

Credentials must never be embedded in public client code, source repositories or event payloads unnecessarily.

---

## 12. Token Lifecycle

Authentication tokens must have controlled lifecycles.

The architecture must support:

- expiration;
- revocation where required;
- rotation;
- audience restrictions;
- issuer validation;
- scope validation;
- replay protection where required;
- and secure storage.

A token must not become a permanent substitute for authorisation.

---

## 13. Request Validation

Every API must validate incoming requests before business processing.

Validation should include:

- schema;
- type;
- length;
- range;
- format;
- allowed values;
- object relationships;
- content constraints;
- and security-sensitive fields.

Client-side validation is not sufficient.

The server remains authoritative.

---

## 14. Schema Enforcement

Governed APIs should have explicit contracts.

The contract should define:

- request schema;
- response schema;
- authentication requirements;
- authorisation requirements;
- error behaviour;
- rate limits;
- version;
- classification;
- and lifecycle status.

Schema validation must occur at appropriate service boundaries.

---

## 15. Input Injection Defence

API inputs must be treated as hostile data.

The architecture must defend against relevant injection classes, including:

- SQL injection;
- NoSQL injection;
- command injection;
- template injection;
- expression injection;
- header injection;
- path manipulation;
- and other context-specific injection attacks.

Parameterized queries and safe APIs should be preferred over string concatenation.

---

## 16. Server-Side Request Forgery

APIs that retrieve remote resources must explicitly control where requests may be sent.

This includes:

- webhooks;
- image or document retrieval;
- URL previews;
- integration callbacks;
- mapping resources;
- partner endpoints;
- and AI tools capable of network access.

Private network ranges, metadata services and administrative endpoints must not be reachable through uncontrolled user-supplied URLs.

SSRF is explicitly identified in the OWASP API Security Top 10. 

---

## 17. Rate Limiting

API rate limiting must be risk-aware.

Limits may be applied according to:

- user;
- account;
- device;
- IP/network;
- API key;
- service identity;
- tenant;
- endpoint;
- resource;
- cost;
- and business action.

A single global request-per-second limit is insufficient.

Expensive operations should have stricter controls than inexpensive operations.

---

## 18. Quotas and Resource Consumption

The platform must protect compute, storage, database, network and third-party costs.

Controls may include:

- request quotas;
- payload limits;
- concurrency limits;
- pagination limits;
- query complexity limits;
- upload limits;
- execution time limits;
- AI token budgets;
- and partner API quotas.

Unrestricted resource consumption is a recognised API security risk. 

---

## 19. Sensitive Business Flows

High-value API workflows require additional protection.

Examples include:

- login;
- account recovery;
- payment;
- checkout;
- reward redemption;
- coupon redemption;
- referral creation;
- subscription creation;
- subscription cancellation;
- wallet operations;
- delivery address changes;
- supplier actions;
- administrative operations;
- AI action approval;
- and bulk data access.

These flows may require:

- step-up authentication;
- bot controls;
- transaction limits;
- behavioural analysis;
- confirmation;
- idempotency;
- or human approval.

OWASP specifically identifies unrestricted access to sensitive business flows as an API risk because automated access can enable scalping, fake-account creation and other abuse. 

---

## 20. Idempotency

State-changing APIs must support idempotency where duplicate requests could create duplicate effects.

Examples:

```text
POST Payment
     ↓
Request repeated
     ↓
Same idempotency key
     ↓
No second charge
```

This is particularly important for:

- payments;
- orders;
- reward grants;
- wallet operations;
- subscription changes;
- delivery dispatch;
- and external partner calls.

---

## 21. Concurrency Protection

APIs must protect state transitions from race conditions.

Examples include:

```text
Two reward redemptions
at the same time
        ↓
Only one valid redemption
```

and:

```text
Two checkout requests
        ↓
Inventory cannot be reserved twice
when only one unit exists
```

Atomic operations, transactional constraints and server-side state validation must be used where appropriate.

---

## 22. Webhook Security

Incoming webhooks must be treated as untrusted external input.

Controls should include:

- signature verification;
- timestamp validation;
- replay protection;
- source validation where appropriate;
- schema validation;
- idempotency;
- rate limiting;
- event-type allowlists;
- and isolated processing.

Webhook payloads must not directly execute privileged operations without validation and authorisation.

---

## 23. External API Consumption

External APIs must not automatically become trusted because Essentials Mart has a commercial relationship with the provider.

Responses must be validated for:

- schema;
- authenticity;
- expected values;
- malicious content;
- unexpected redirects;
- excessive payloads;
- and failure conditions.

This applies to:

- payment providers;
- WhatsApp;
- mapping providers;
- delivery providers;
- cloud APIs;
- AI providers;
- analytics services;
- suppliers;
- and partner platforms.

OWASP identifies unsafe consumption of APIs as a distinct API security risk. 

---

## 24. API Inventory

Essentials Mart must maintain an authoritative API inventory.

The inventory should identify:

- API;
- owner;
- consumers;
- environment;
- version;
- authentication;
- classification;
- sensitivity;
- lifecycle status;
- dependencies;
- and exposure.

Shadow, forgotten and deprecated endpoints must be discoverable and retired.

Improper API inventory management is an identified OWASP API risk. 

---

## 25. API Versioning

Breaking API changes require controlled versioning or an equivalent compatibility mechanism.

Old versions must not remain exposed indefinitely.

Deprecation must include:

- consumer identification;
- migration guidance;
- security review;
- deadline;
- monitoring;
- and controlled retirement.

---

## 26. Error Handling

API errors must not disclose unnecessary internal information.

Responses must avoid exposing:

- stack traces;
- secrets;
- internal network details;
- database structures;
- credentials;
- proprietary algorithms;
- or unnecessary personal information.

Detailed diagnostics belong in controlled internal telemetry.

---

## 27. Response Minimisation

APIs must return only what the caller is authorised and expected to receive.

The client must never be trusted to hide sensitive fields after receiving them.

This is especially important because raw API responses can expose fields that the UI intentionally does not display. 

---

## 28. CORS and Browser Security

Browser-accessible APIs must enforce controlled cross-origin policies.

The architecture must avoid:

- wildcard credentialed access;
- unnecessary origins;
- unsafe methods;
- unrestricted headers;
- and accidental exposure of privileged endpoints.

CORS is an access-control mechanism, not an authentication mechanism.

---

## 29. Internal API Security

Internal APIs must not assume that internal network access implies trust.

Internal service requests should be protected through appropriate combinations of:

- service identity;
- mutual authentication;
- authorisation;
- encryption;
- policy enforcement;
- telemetry;
- and segmentation.

NIST's current cloud-native API guidance explicitly recommends applying API security controls to both external and internal APIs. 

---

## 30. AI API Boundaries

AI APIs require additional controls because they may expose powerful capabilities.

AI endpoints must govern:

- model access;
- prompt size;
- tool availability;
- token budgets;
- context limits;
- agent identity;
- action permissions;
- output handling;
- external network access;
- and sensitive-data access.

An authenticated AI agent must not automatically gain unrestricted access to every internal API.

---

## 31. API Authority for AI Agents

The AI Society must interact with backend capabilities through explicitly governed interfaces.

```text
AI Agent
   ↓
Capability Request
   ↓
Policy Evaluation
   ↓
Authorised API
   ↓
Business Service
   ↓
Resource
```

The API layer must therefore remain an enforcement boundary even when the caller is an internal AI agent.

---

## 32. API Observability

Every material API operation should support sufficient telemetry to determine:

- caller identity;
- service identity;
- endpoint;
- action;
- resource;
- outcome;
- latency;
- response class;
- policy decision;
- correlation ID;
- trace ID;
- and security-relevant anomalies.

Sensitive payloads must not be indiscriminately logged.

---

## 33. Abuse Detection

Rate limiting alone is insufficient.

The platform should identify behavioural patterns such as:

- credential stuffing;
- enumeration;
- scraping;
- abnormal checkout activity;
- reward farming;
- API probing;
- endpoint discovery;
- unusual geographic behaviour;
- impossible sequences;
- excessive failures;
- and coordinated automation.

Signals may feed the Trust Engine and security response systems.

---

## 34. Progressive Enforcement

Where appropriate, API protection may escalate progressively:

```text
Normal
  ↓
Observe
  ↓
Rate Limit
  ↓
Challenge
  ↓
Step-Up Authentication
  ↓
Restrict Capability
  ↓
Quarantine
  ↓
Block
```

The response must be proportional to risk and must avoid unnecessarily harming legitimate customers.

---

## 35. Dependency Isolation

A compromised or unavailable external API must not automatically compromise the Essentials Mart platform.

The architecture should support:

- timeouts;
- circuit breakers;
- retries with bounds;
- fallback providers;
- queues;
- bulkheads;
- cached non-sensitive data where appropriate;
- and controlled degradation.

---

## 36. Fail-Safe and Fail-Closed Decisions

Security-sensitive operations should fail closed when the system cannot establish sufficient authority.

For low-risk informational capabilities, controlled degradation may be preferable.

Example:

```text
Payment authorization unavailable
        ↓
Do not mark payment as successful
```

while:

```text
Recommendation API unavailable
        ↓
Continue basic shopping
```

Security and business continuity requirements must be balanced explicitly.

---

## 37. API Gateway Role

The API gateway may provide:

- ingress control;
- authentication integration;
- rate limiting;
- routing;
- request-size controls;
- threat filtering;
- observability;
- and policy enforcement.

However:

> **The API gateway must not become the only security boundary.**

Business authorisation must remain enforced by the services that own the protected resources.

---

## 38. Service Boundary Role

Each service must enforce the authority required to protect its resources.

This prevents a compromised gateway, internal caller or misconfigured route from bypassing business security.

```text
Gateway Policy
      +
Service Policy
      +
Resource Policy
      =
Layered Protection
```

---

## 39. API Security Testing

APIs must be tested throughout their lifecycle.

Testing should include:

- authentication testing;
- cross-user authorisation testing;
- property-level access testing;
- privilege escalation;
- rate-limit testing;
- sensitive-flow abuse;
- SSRF testing;
- injection testing;
- webhook testing;
- API inventory testing;
- deprecated endpoint discovery;
- external API validation;
- fuzzing;
- negative testing;
- concurrency testing;
- and failure testing.

Automated testing should be incorporated into CI/CD where appropriate.

OWASP's API Security Testing Framework demonstrates coverage across the API Top 10 as well as additional API-specific attack classes. 

---

## 40. API Supply-Chain Boundary

API clients and SDKs are dependencies and therefore part of the software supply-chain risk boundary.

The architecture must account for:

- SDK vulnerabilities;
- dependency compromise;
- malicious packages;
- provider changes;
- API contract changes;
- certificate changes;
- and unexpected provider behaviour.

External API integrations must be governed through the dependency architecture established elsewhere in Part 4.

---

## 41. Partner APIs

Partner integrations must use explicitly scoped interfaces.

A partner should receive only the capabilities required for its contractual function.

For example:

```text
Delivery Partner
     ↓
Delivery capability
     ↓
Not
     ↓
Full customer platform access
```

This principle applies to commercial partners, transport providers, payment providers and integration platforms.

---

## 42. Store and Warehouse APIs

Store and warehouse systems must have constrained interfaces.

A compromised store terminal or warehouse device must not automatically gain enterprise-wide privileges.

Access should be constrained by:

- store;
- role;
- device;
- service identity;
- operation;
- and environment.

---

## 43. API Data Classification

API contracts must identify the sensitivity of the data exchanged.

Sensitive endpoints may require stronger:

- authentication;
- authorisation;
- encryption;
- logging controls;
- retention controls;
- and monitoring.

Classification must propagate into integration design.

---

## 44. API Security and Anti-Replication

APIs must not expose proprietary decision machinery merely because a client requires a result.

Preferred pattern:

```text
Client
  ↓
Request
  ↓
Protected Backend
  ↓
Proprietary Intelligence
  ↓
Minimal Result
  ↓
Client
```

This supports the anti-replication architecture established in earlier Part 4 commits.

---

## 45. API Security and Commerce

Commerce APIs must apply the economic-abuse controls established in Commit-013.

Examples:

- order creation;
- checkout;
- payment;
- discount redemption;
- reward redemption;
- subscription management;
- wallet operations;
- and inventory reservation.

API security and economic security therefore operate together rather than as independent controls.

---

## 46. API Security and Events

Event-producing APIs must preserve event governance.

An API must not permit arbitrary callers to manufacture trusted enterprise events.

Where an API causes an event:

```text
Authorised API action
       ↓
Authoritative state change
       ↓
Governed event
```

The event remains owned by the authoritative domain.

---

## 47. API Security and Delivery

Delivery APIs must protect:

- addresses;
- delivery state;
- driver identity;
- vehicle information;
- route information;
- partner credentials;
- ETA data;
- and dispatch authority.

A customer must not be able to modify delivery state merely by manipulating client requests.

---

## 48. API Security and Privacy

APIs must minimise personal information exposure.

A successful request must not automatically expose more data than required for the authorised purpose.

Bulk APIs require additional controls because a legitimate credential can otherwise become a mechanism for mass extraction.

---

## 49. API Security and Geographic Boundaries

API authorisation may need to consider:

- country;
- region;
- store;
- organisation;
- tenant;
- data residency;
- and regulatory boundary.

A globally authenticated identity does not automatically have global resource access.

---

## 50. API Security Laws

Commit-014 establishes the following laws:

1. APIs are security boundaries.
2. Authentication does not imply authorisation.
3. Internal APIs must not receive implicit trust.
4. Resource access must be explicitly authorised.
5. Object-level authorisation is mandatory where applicable.
6. Property-level access must be controlled.
7. Function-level privilege must be explicit.
8. Service identities must be independently verifiable.
9. Credentials must be scoped and managed.
10. Tokens must have controlled lifecycles.
11. Requests must be server-side validated.
12. API schemas must be governed.
13. API inputs must be treated as untrusted.
14. SSRF must be explicitly defended against.
15. Resource consumption must be bounded.
16. Sensitive business flows require additional controls.
17. State-changing operations must support idempotency where required.
18. Race conditions must be explicitly addressed.
19. Webhooks must be authenticated and validated.
20. External API responses must not be blindly trusted.
21. API inventory must remain authoritative.
22. Deprecated APIs must be retired.
23. Error responses must minimise information disclosure.
24. Responses must contain only authorised information.
25. AI agents must operate through governed capabilities.
26. API gateways must not be the sole security boundary.
27. Services must protect their own resources.
28. API behaviour must be observable.
29. API abuse must be detectable.
30. Security responses should be progressive where appropriate.
31. External API failures must be isolated.
32. Security-sensitive failures must fail closed where required.
33. API contracts must support testing and compatibility.
34. Partner APIs must be capability-scoped.
35. API data classification must influence security controls.
36. APIs must not unnecessarily expose proprietary intelligence.
37. Commerce APIs must inherit economic-abuse protections.
38. APIs must not permit unauthorised event fabrication.
39. API access must respect privacy and geographic boundaries.
40. API security must be governed throughout the API lifecycle.

---

## 51. Architectural Outcome

Commit-014 establishes APIs and service interfaces as **active defensive boundaries** across Essentials Mart.

The resulting model is:

```text
                    REQUEST
                       │
                       ▼
                 EDGE DEFENCE
                       │
                       ▼
                 API GATEWAY
                       │
                       ▼
               CALLER IDENTITY
                       │
                       ▼
                 AUTHORISATION
                       │
                       ▼
              REQUEST VALIDATION
                       │
                       ▼
             BUSINESS-FLOW POLICY
                       │
                       ▼
               SERVICE BOUNDARY
                       │
                       ▼
                RESOURCE POLICY
                       │
                       ▼
                AUTHORITATIVE STATE
                       │
              ┌────────┴────────┐
              ▼                 ▼
            EVENT             RESULT
              │                 │
              ▼                 ▼
          OBSERVABILITY       CLIENT
```

The objective is not simply to make APIs difficult to attack.

The objective is to ensure that **every API request reaches only the capability, data and business authority that the caller is legitimately entitled to exercise.**

---

## Commit 014

```text
docs(eda): add API and service boundary defence

- Establish APIs as active security boundaries
- Define authentication and authorisation separation
- Establish object, property and function-level authorization
- Define service identity and zero-trust internal API security
- Establish credential and token lifecycle controls
- Define request and schema validation
- Establish injection and SSRF protection
- Define rate limiting, quotas and resource controls
- Protect sensitive business flows
- Establish idempotency and concurrency safeguards
- Define webhook security
- Establish external API consumption controls
- Define API inventory and lifecycle governance
- Establish AI API authority boundaries
- Define API observability and abuse detection
- Establish dependency isolation and controlled degradation
- Define gateway and service-layer security responsibilities
- Establish API security testing requirements
- Protect partner, store and warehouse API boundaries
- Connect API security to commerce, events, delivery, privacy and anti-replication architecture
- Establish constitutional API security laws
```