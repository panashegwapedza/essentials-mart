# ADR-006 — Identity, Authentication & Authorisation

**Status:** Proposed
**Date:** 2026-08-11
**Decision Type:** Security & Identity

---

## 1. Context

Essentials Mart is a multi-channel enterprise platform that will be accessed by different types of actors.

These include:

* Customers
* Household members
* Household administrators
* Store staff
* Store managers
* Delivery personnel
* Customer support personnel
* Enterprise administrators
* AI agents
* Intelligence Engines
* Internal services
* External integrations
* WhatsApp users
* Flutter application users
* Future applications and systems

These actors do not have the same identity, privileges, or authority.

For example:

A customer should be able to manage their own shopping activity.

A household administrator may manage shared household information.

A store employee may access operational information relevant to their store.

A delivery operator may access information necessary to complete an assigned delivery.

An AI agent may be permitted to recommend products but not approve certain transactions.

An internal service may communicate with another service without representing a human user.

Therefore, authentication alone is insufficient.

Essentials Mart requires a unified architecture for determining:

> **Who is acting?**

and:

> **What is that actor allowed to do?**

---

## 2. Problem

Without a central identity and authorisation model, different parts of the platform could implement access control independently.

This could result in:

* inconsistent permissions;
* privilege escalation;
* duplicated identity systems;
* uncontrolled AI authority;
* insecure service-to-service communication;
* unclear household ownership;
* excessive access to sensitive data;
* inconsistent authentication between channels;
* and difficulty auditing actions.

The architecture must distinguish between:

* Identity
* Authentication
* Authorisation
* Roles
* Permissions
* Delegation
* Service identities
* AI-agent identities
* Human approval
* Auditability

---

## 3. Decision

Essentials Mart will adopt a **centralised identity and policy-driven authorisation architecture**.

The identity architecture will establish a common identity model across supported channels while allowing each channel to use appropriate authentication mechanisms.

Authorisation will be determined independently from authentication.

The platform will distinguish between:

### Identity

Represents an actor or principal.

### Authentication

Establishes that the actor controls or represents the claimed identity.

### Authorisation

Determines what the authenticated actor is permitted to do.

### Delegation

Allows an authorised actor or system to act on behalf of another actor under explicitly defined constraints.

### Service Identity

Represents a trusted machine-to-machine actor.

### AI-Agent Identity

Represents an AI agent as an identifiable and governable actor rather than an anonymous software process.

---

## 4. Rationale

A unified identity model allows the same enterprise capability to apply consistent authority rules regardless of the channel through which the request originates.

For example:

```text
Flutter ─────────┐
                 │
WhatsApp ────────┤
                 │
AI Agent ────────► Identity & Authorisation
                 │
Admin Portal ────┤
                 │
Internal Service ┘
                        │
                        ▼
                 Enterprise Domain
```

The domain should not need to implement completely different identity models for every channel.

At the same time, authentication methods may differ.

For example:

* Flutter may use application authentication.
* WhatsApp may use verified channel identity plus account linking.
* Internal services may use service credentials.
* AI agents may use dedicated service/agent identities.

The resulting authority must still be evaluated through the same enterprise security model.

---

## 5. Architectural Principles Affected

This decision establishes or reinforces:

* Centralised identity
* Policy-driven authorisation
* Least privilege
* Zero-trust principles
* Explicit delegation
* Service identity
* AI identity
* Human authority
* Auditability
* Channel independence
* Security by design

---

## 6. Alternatives Considered

### Alternative A — Authentication Only

**Description:**
Authenticate users and allow authenticated users broad access to the platform.

**Why not selected:**
Authentication establishes identity but does not determine what the actor is authorised to do.

---

### Alternative B — Independent Authorisation Per Application

**Description:**
Allow Flutter, WhatsApp, administration systems, and AI agents to implement their own permission systems.

**Why not selected:**
This creates inconsistent security policies and makes enterprise-wide governance difficult.

---

### Alternative C — Role-Only Authorisation

**Description:**
Use broad roles such as customer, staff, administrator, or AI agent.

**Why not selected:**
Roles alone are insufficient for contextual access requirements.

A customer may have access to one household but not another.

A store manager may have access to one store but not every store.

An AI agent may have permission to perform one operation but not another.

---

### Alternative D — Identity + Policy-Driven Authorisation

**Description:**
Authenticate actors centrally and evaluate permissions using identity, roles, permissions, resource ownership, context, and policy.

**Why selected:**
This provides the flexibility required for customers, households, staff, services, AI agents, and future enterprise actors.

---

## 7. Consequences

### Positive

* Consistent identity across channels.
* Stronger security.
* Explicit AI authority.
* Clear household access control.
* Better service-to-service security.
* Centralised policy management.
* Improved auditability.
* Reduced permission duplication.
* Easier integration of future clients.
* Better support for delegated actions.

### Negative

* Identity architecture becomes a critical platform dependency.
* Permission policies require governance.
* More complex authorisation rules require careful testing.
* Delegation introduces additional security considerations.
* Identity outages can affect dependent services.

### Neutral / Trade-offs

* Authentication mechanisms may vary by channel.
* Authorisation policies may be implemented at multiple enforcement points.
* Some permissions will depend on resource ownership and context.

---

## 8. Principal Model

Essentials Mart will recognise multiple principal types.

```text
Principal
│
├── Human
│   ├── Customer
│   ├── Household Member
│   ├── Staff
│   ├── Manager
│   ├── Delivery Operator
│   └── Administrator
│
├── AI Agent
│
├── Service
│
└── External Integration
```

A principal may have one or more roles and permissions.

The exact role catalogue will be established separately.

---

## 9. Household Identity Model

Households are a core part of the Essentials Mart platform.

The architecture therefore distinguishes between:

**Person identity**

and

**Household membership.**

A person may belong to one or more households where permitted by the business model.

Household membership does not automatically grant unrestricted access to every resource associated with that household.

Permissions may depend upon:

* Household role
* Resource ownership
* Explicit delegation
* Resource type
* Operation
* Context

For example:

```text
Household
│
├── Owner
├── Administrator
├── Member
└── Child / Restricted Member
```

The exact household role model will be established during Information Architecture and product design.

---

## 10. AI Identity Model

AI agents will be treated as identifiable principals.

An AI agent must have:

* Unique identity
* Defined purpose
* Assigned permissions
* Defined domain access
* Action constraints
* Audit identity
* Lifecycle status
* Owner/governance authority

For example:

```text
AI Agent
│
├── Agent ID
├── Purpose
├── Permissions
├── Accessible Domains
├── Allowed Actions
├── Restrictions
└── Audit Identity
```

An AI agent will never receive unrestricted enterprise access merely because it is an internal system component.

This establishes the foundation for ADR-007 and ADR-009.

---

## 11. Delegation

Essentials Mart will support controlled delegation where business requirements require an actor to act on behalf of another actor.

Examples may include:

* A household member placing an order for the household.
* A customer allowing an AI assistant to manage shopping activity.
* A customer authorising delivery-related actions.
* An administrator granting staff access to specific operational functions.

Delegation must be:

* Explicit
* Scoped
* Time-bound where appropriate
* Revocable
* Auditable

The system must record both:

**The actor performing the action**

and

**The authority under which the action was performed.**

---

## 12. Authorisation Model

Authorisation will not depend solely on role.

The policy decision may consider:

```text
Principal
   +
Role
   +
Permission
   +
Resource
   +
Ownership
   +
Action
   +
Context
   +
Delegation
   =
Authorisation Decision
```

For example:

```text
Can this AI agent cancel this order?
```

The answer may depend on:

* Which agent?
* Which user delegated authority?
* Which order?
* Who owns the order?
* What stage is the order in?
* Is cancellation still allowed?
* Does the action require human approval?

---

## 13. Authentication

Authentication mechanisms will be selected according to actor and channel.

Potential mechanisms include:

* Secure application authentication
* Session/token-based authentication
* OAuth/OIDC-compatible identity flows
* Service credentials
* Signed requests
* Channel identity verification
* Account linking
* Future biometric or device-based authentication where appropriate

The architecture does not require every actor to authenticate identically.

However, every protected operation must have an identifiable principal.

---

## 14. Service-to-Service Identity

Internal services must not rely solely on network location for trust.

Services should authenticate themselves using dedicated service identities.

For example:

```text
Commerce Service
      │
      │ authenticated request
      ▼
Inventory Service
```

The Inventory service must be able to determine:

* Which service made the request.
* What capability the service is requesting.
* Whether the service is authorised.
* Which user or process initiated the operation where applicable.

---

## 15. Audit Identity

Significant actions must be attributable to an identifiable principal.

For delegated actions, the audit record should distinguish between:

```text
Initiating Principal
        +
Acting Principal
        +
Authority / Delegation
        +
Action
        +
Resource
        +
Timestamp
```

For AI actions:

```text
User
  │
  └── delegated authority
          │
          ▼
       AI Agent
          │
          ▼
        Action
```

This ensures that AI actions remain attributable and reviewable.

Detailed observability and audit architecture will be established in ADR-016.

---

## 16. Security Impact

This ADR establishes identity and authorisation as foundational security controls.

The architecture must support:

* Least privilege
* Secure credential handling
* Token/session security
* Service identity
* Permission enforcement
* Delegation controls
* Revocation
* Account recovery
* Session management
* Rate limiting
* Abuse detection
* Auditability
* Sensitive-data protection

Authentication and authorisation must be enforced server-side.

Client-side checks may improve user experience but must never be considered sufficient security controls.

**Security impact:** Foundational.

---

## 17. AI / Intelligence Impact

This ADR establishes the identity foundation for the AI Society.

AI agents will be treated as governed principals rather than anonymous automation.

This allows the platform to answer:

* Which agent acted?
* On whose behalf?
* With what authority?
* Against which resource?
* Using which capability?
* At what time?
* Under which policy?
* Was human approval required?

This becomes essential for trustworthy AI operations.

**AI impact:** Foundational.

---

## 18. Implementation Implications

The platform will require:

* Identity provider integration
* User identity model
* Household membership model
* Role model
* Permission model
* Policy evaluation
* Service identities
* AI-agent identities
* Delegation model
* Token/session management
* Credential lifecycle
* Revocation
* Audit identity
* Security event generation

The exact technology and Supabase implementation will be determined during backend architecture.

---

## 19. Dependencies

This ADR depends upon:

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries

It establishes the foundation for:

* ADR-007 — AI Society Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-010 — Human-in-the-Loop Architecture
* ADR-012 — WhatsApp Integration Architecture
* ADR-015 — Security & Anti-Replication Architecture
* ADR-016 — Observability, Auditability & Trust

---

## 20. Related Architecture Documents

* `SECURITY-ARCHITECTURE.md`
* `DOMAINS.md`
* `EDA-001-enterprise-data-architecture.md`
* `AI-001-ai-society.md`

Future identity documentation should define:

* Principal catalogue
* Role catalogue
* Permission catalogue
* Delegation model
* Authentication flows
* Authorisation policies

---

## 21. Related ADRs

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-007 — AI Society Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-010 — Human-in-the-Loop Architecture
* ADR-015 — Security & Anti-Replication Architecture
* ADR-016 — Observability, Auditability & Trust

---

## 22. Decision Lifecycle

**Current Status:** Proposed

### Review Conditions

This ADR should be reviewed if:

* The identity model changes substantially.
* New principal types are introduced.
* Household authority requirements change.
* AI-agent authority requires a different security model.
* Regulatory requirements introduce new identity obligations.
* A new authentication channel is introduced.
* Delegation requirements change substantially.

### Supersession

If this decision is replaced, the replacement ADR must reference ADR-006 and explain why the identity and authorisation architecture has changed.

---

## 23. Final Decision

> **Essentials Mart will use a unified identity architecture with policy-driven authorisation across human users, households, AI agents, internal services, and external integrations. Authentication establishes identity; authorisation determines authority. AI agents and services will have explicit identities and permissions, while delegated actions will remain scoped, revocable, and auditable.**

**ADR-006 remains authoritative unless superseded by a subsequent ADR.**
