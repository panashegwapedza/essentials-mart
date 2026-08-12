# ADR-012 — WhatsApp Integration Architecture

**Status:** Proposed  
**Date:** 2026-08-12  
**Decision Type:** Communication Integration Architecture

---

## 1. Context

ADR-011 establishes the Essentials Mart Notification & Communication Architecture as a central communication layer that separates business events from communication delivery.

Essentials Mart is intended to communicate with users through multiple channels, including the Flutter application and WhatsApp.

WhatsApp is particularly important because it can provide a conversational interface through which users may:

- Receive notifications;
- Communicate with the Essentials Mart AI assistant;
- Request information;
- Receive shopping recommendations;
- Review orders;
- Receive delivery updates;
- Respond to Human-in-the-Loop requests;
- Interact with authorised Essentials Mart services;
- Perform supported actions through conversational workflows.

WhatsApp therefore represents more than a notification channel. It may become an external interaction surface for the Essentials Mart platform.

However, WhatsApp must not become a second backend or an alternative authority system.

The integration must remain subordinate to the same domain, identity, security, AI governance, communication, and authorisation architecture used by the primary Essentials Mart application.

---

## 2. Problem

A poorly designed WhatsApp integration could:

- Duplicate backend business logic;
- Create a separate identity system;
- Allow AI agents to bypass normal authorisation;
- Allow users to perform actions that are unavailable through the primary application without appropriate policy;
- Expose sensitive information through an inappropriate channel;
- Create inconsistent user state between WhatsApp and the application;
- Couple the enterprise architecture directly to a WhatsApp provider;
- Make communication failures affect core business transactions;
- Make conversational messages indistinguishable from authoritative commands;
- Create security risks through account or phone-number impersonation;
- Bypass Human-in-the-Loop requirements.

Essentials Mart therefore requires a WhatsApp architecture that provides conversational access to the platform while keeping business logic, authority, identity, and data ownership within the enterprise architecture.

---

## 3. Decision

Essentials Mart will implement WhatsApp as a **channel and interaction adapter within the central communication architecture**.

WhatsApp will not contain independent business logic or become an independent source of truth.

The architecture will follow this model:

WhatsApp
    |
    v
WhatsApp Integration Layer
    |
    v
Communication / Conversation Services
    |
    v
Authentication & Authorisation
    |
    v
AI Society / Application Services
    |
    v
Enterprise Domains
    |
    v
Authoritative Data

All actions initiated through WhatsApp must pass through the same applicable identity, authorisation, policy, AI governance, and domain controls as actions initiated through other authorised interfaces.

---

## 4. WhatsApp Integration Boundary

The WhatsApp integration layer will be responsible for translating between WhatsApp communication protocols and the internal Essentials Mart communication model.

Its responsibilities include:

- Receiving inbound WhatsApp messages;
- Validating inbound messages;
- Associating messages with communication sessions;
- Resolving the relevant user identity;
- Passing authorised requests into the platform;
- Formatting outbound communications for WhatsApp;
- Handling channel-specific delivery states;
- Managing provider-specific integration concerns.

The integration layer must not own:

- Orders;
- Products;
- Inventory;
- Households;
- Payments;
- Deliveries;
- AI authority;
- User permissions;
- Enterprise business rules.

Those remain owned by the appropriate domains and services.

---

## 5. Identity Association

A WhatsApp identity must not automatically be treated as an authenticated Essentials Mart identity.

The platform must establish an appropriate relationship between:

- WhatsApp account or identifier;
- Essentials Mart user identity;
- Applicable household;
- Authorised communication relationship.

The association must be established through an approved identity-linking mechanism.

Possession of a phone number alone must not grant unrestricted access to an Essentials Mart account.

---

## 6. Authentication

WhatsApp interactions that request protected information or consequential actions must use appropriate authentication and authorisation controls.

Authentication requirements may vary according to:

- Action sensitivity;
- Information sensitivity;
- User context;
- Existing authenticated session;
- Channel security;
- Applicable policy.

The WhatsApp channel must not weaken the identity and authentication requirements established by ADR-006.

---

## 7. Authorisation

Authentication establishes who is interacting with Essentials Mart.

Authorisation determines what that user or session may do.

Every consequential WhatsApp action must therefore be evaluated against applicable permissions and policies.

The following is prohibited:

WhatsApp User
    |
    v
WhatsApp Integration
    |
    v
Direct Restricted Database Access

Instead:

WhatsApp User
    |
    v
WhatsApp Integration
    |
    v
Identity & Authorisation
    |
    v
Authorised Application Service
    |
    v
Domain Capability

---

## 8. Conversational AI

The Essentials Mart AI assistant may operate through WhatsApp where authorised.

The AI assistant may:

- Understand user requests;
- Provide information;
- Make recommendations;
- Generate shopping lists;
- Explain orders;
- Provide delivery information;
- Request approval;
- Initiate authorised workflows;
- Communicate the results of completed actions.

The AI assistant must not use WhatsApp as a mechanism to bypass AI agent governance established by ADR-009.

---

## 9. AI Society Integration

WhatsApp will act as an interaction surface for the AI Society rather than becoming a separate AI system.

The conceptual flow is:

WhatsApp User
      |
      v
Conversation Interface
      |
      v
AI Orchestration
      |
      v
Relevant AI Agent
      |
      v
Intelligence Engine / Domain Service
      |
      v
Authorised Result
      |
      v
WhatsApp Response

The AI Society remains responsible for determining which specialised agent or capability should handle the request.

---

## 10. Action Execution

A conversational request must be distinguished from an executable command.

The system must determine:

- What the user intends;
- Whether the request is sufficiently understood;
- Whether the user is authorised;
- Whether the requested capability is permitted;
- Whether additional confirmation is required;
- Whether Human-in-the-Loop intervention is required;
- Whether the action can be safely executed.

Natural-language input must never automatically imply unrestricted authority.

---

## 11. Confirmation

Where an action is consequential but does not require a separate human approval workflow, the system may request explicit confirmation.

For example:

User Request
    |
    v
AI Interpretation
    |
    v
Action Preview
    |
    v
User Confirmation
    |
    v
Authorised Execution

The confirmation must correspond to the action presented to the user.

Material changes to the action should require renewed confirmation.

---

## 12. Human-in-the-Loop

WhatsApp may participate in Human-in-the-Loop workflows established by ADR-010.

For example:

AI Agent
    |
    v
Restricted Action
    |
    v
Human Approval Required
    |
    v
WhatsApp Approval Request
    |
    v
Authenticated Human
    |
    v
Approval / Rejection
    |
    v
Policy Re-evaluation
    |
    v
Execution

WhatsApp delivers the approval interaction but does not determine whether the action is authorised.

---

## 13. Conversation State

WhatsApp conversations may require state to support multi-step interactions.

Conversation state may include:

- Conversation identity;
- User identity;
- Current workflow;
- Pending action;
- Confirmation state;
- Approval state;
- Relevant context;
- Expiration;
- Conversation status.

Conversation state must not become the authoritative source of business state.

Business state remains owned by the appropriate enterprise domain.

---

## 14. Session Expiration

Conversational sessions must have appropriate expiration and security controls.

A stale conversational context must not automatically retain authority indefinitely.

Where necessary, the system must require:

- Re-authentication;
- Re-confirmation;
- Re-authorisation;
- Restarting the workflow.

The appropriate behaviour will depend on the sensitivity of the action.

---

## 15. Sensitive Information

WhatsApp communications must follow the applicable information-security and privacy policies.

The system should minimise sensitive information exposed through conversational messages.

Where appropriate, WhatsApp may provide:

- A limited summary;
- A notification;
- A secure link to the application;
- A request to authenticate through a stronger channel.

The communication channel must not expose information merely because it is technically possible to send it.

---

## 16. Outbound Communications

Outbound WhatsApp communications will originate from the central communication architecture established by ADR-011.

Examples include:

- Order updates;
- Delivery updates;
- Shopping reminders;
- AI recommendations;
- Human approval requests;
- Service communications;
- Security notifications;
- Operational messages.

WhatsApp-specific delivery logic must remain within the WhatsApp integration boundary.

---

## 17. Inbound Communications

Inbound WhatsApp messages must pass through the WhatsApp integration boundary before reaching internal services.

The system should:

- Validate the message;
- Identify the communication context;
- Resolve the user;
- Determine whether authentication is sufficient;
- Interpret the request;
- Apply applicable policies;
- Route the request;
- Record relevant events.

Inbound messages must not directly invoke privileged enterprise capabilities.

---

## 18. Provider Abstraction

The architecture will isolate provider-specific implementation from the rest of Essentials Mart.

Conceptually:

Essentials Mart Communication Layer
            |
            v
      WhatsApp Adapter
            |
            v
     WhatsApp Provider

This allows the enterprise to change providers or communication infrastructure without redesigning domain services.

Provider-specific APIs, credentials, webhooks, delivery states, and limitations remain contained within the integration boundary.

---

## 19. Webhooks and Event Processing

Inbound WhatsApp events will be processed through controlled integration endpoints.

The integration must account for:

- Duplicate events;
- Retries;
- Out-of-order events;
- Invalid events;
- Provider failures;
- Delivery status updates;
- Message acknowledgement;
- Security validation.

Event processing must be idempotent where required.

---

## 20. Reliability

Failure of WhatsApp must not automatically cause failure of the underlying Essentials Mart business operation.

For example:

Order Created
    |
    +---- WhatsApp Delivered
    |
    +---- WhatsApp Failed

The order remains authoritative according to the Order domain.

The communication layer may retry or use an authorised fallback channel according to policy.

---

## 21. Rate Limits and Provider Constraints

The integration must account for provider-specific constraints, including:

- Rate limits;
- Message limits;
- Template requirements where applicable;
- Delivery restrictions;
- API availability;
- Provider outages;
- Message formatting limitations.

These constraints must be isolated within the WhatsApp integration layer wherever possible.

---

## 22. Security

The WhatsApp integration must protect against:

- Identity spoofing;
- Unauthorised account linking;
- Message replay;
- Webhook spoofing;
- Session hijacking;
- Privilege escalation;
- Cross-user access;
- Cross-household access;
- Unauthorised action execution;
- Sensitive-information disclosure.

Security controls remain governed by ADR-006 and ADR-015.

---

## 23. Privacy

WhatsApp interaction data must be handled according to applicable privacy requirements.

The system should minimise retention and exposure of:

- Message contents;
- Personal information;
- Household information;
- Order information;
- Payment-related information;
- Sensitive conversational context.

The architecture should retain only the information required for legitimate operational, security, audit, and legal purposes.

---

## 24. Auditability

Relevant WhatsApp interactions must be attributable and auditable.

Where appropriate, the system should be able to determine:

- WhatsApp interaction identity;
- Associated Essentials Mart user;
- Conversation;
- Originating message;
- AI agent involved;
- Requested action;
- Policy decision;
- Confirmation;
- Approval;
- Execution;
- Result;
- Delivery status.

This contributes to the audit architecture established by ADR-016.

---

## 25. Communication Preferences

Users must be able to control WhatsApp communication where applicable.

The system must respect:

- WhatsApp consent;
- Communication preferences;
- Notification categories;
- Opt-out requirements;
- Applicable quiet periods;
- Security and transactional communication policies.

User preference management remains part of the broader communication architecture established by ADR-011.

---

## 26. Failure Handling

When WhatsApp is unavailable:

- Core business services must continue where possible.
- Messages may be queued for later delivery.
- Approved fallback channels may be used.
- Conversational workflows may be paused.
- Approval-required actions must remain pending where approval has not been obtained.

WhatsApp failure must never be interpreted as user approval.

---

## 27. Consequences

### Positive

- Provides users with a familiar conversational interface.
- Extends Essentials Mart functionality beyond the application.
- Enables AI-assisted interaction through WhatsApp.
- Supports Human-in-the-Loop workflows.
- Maintains centralised business logic.
- Preserves enterprise identity and authorisation.
- Allows future provider changes.
- Enables notifications and conversational workflows through the same channel.
- Creates a foundation for household and delivery interactions through WhatsApp.

### Negative

- Introduces dependency on external communication infrastructure.
- Adds authentication and identity-linking complexity.
- Requires additional security controls.
- Provider constraints may affect message delivery and functionality.
- Conversational interfaces require careful handling of ambiguity.

### Trade-offs

Essentials Mart prioritises **architectural control and security over direct integration simplicity**.

WhatsApp will be treated as a powerful external interface while the enterprise remains the authoritative system.

---

## 28. Alternatives Considered

### Alternative A — Direct WhatsApp-to-Backend Integration

Allow WhatsApp to directly invoke backend business services.

**Rejected because:**  
This would tightly couple the enterprise to the communication channel and create opportunities to bypass central authorisation and domain boundaries.

### Alternative B — Separate WhatsApp Backend

Create an independent backend specifically for WhatsApp.

**Rejected because:**  
This would duplicate business logic and create the possibility of inconsistent system state.

### Alternative C — WhatsApp as Notification-Only Channel

Restrict WhatsApp to outbound notifications.

**Rejected because:**  
This would prevent Essentials Mart from providing the intended conversational AI and user-service capabilities through WhatsApp.

### Alternative D — WhatsApp Integration Layer

Use WhatsApp as an external channel connected through a controlled integration layer to the existing communication, identity, AI, and domain architecture.

**Selected because:**  
It provides conversational capability while preserving enterprise authority, security, domain ownership, and provider independence.

---

## 29. Implementation Implications

The implementation will eventually require:

- WhatsApp integration service;
- Provider adapter;
- Webhook endpoints;
- Message validation;
- Identity linking;
- Authentication;
- Authorisation;
- Conversation management;
- Session management;
- Message routing;
- AI orchestration integration;
- Confirmation workflows;
- Human approval workflows;
- Delivery tracking;
- Retry mechanisms;
- Idempotency;
- Audit records;
- Security monitoring.

Provider-specific implementation details are intentionally deferred to the implementation phase.

---

## 30. Dependencies

This ADR depends upon:

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-011 — Notification & Communication Architecture

It establishes requirements for:

- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 31. Related Architecture Documents

- EVENT-ARCHITECTURE.md
- SECURITY-ARCHITECTURE.md
- AI-001-ai-society.md

---

## 32. Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-011 — Notification & Communication Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 33. Decision Lifecycle

**Current Status:** Proposed

This ADR should be reviewed if:

- WhatsApp becomes unsuitable as a communication channel;
- The provider integration model materially changes;
- Authentication or identity-linking requirements change;
- WhatsApp becomes subject to materially different regulatory requirements;
- The conversational architecture changes;
- A different integration boundary becomes necessary.

Any replacement ADR must reference ADR-012 and explain the reason for changing the WhatsApp integration architecture.

---

## 34. Final Decision

> **Essentials Mart will integrate WhatsApp as an external communication and conversational interaction channel through a controlled integration layer. WhatsApp will not contain independent business logic, authoritative enterprise data, or independent authority. All WhatsApp-initiated actions will remain subject to the same identity, authentication, authorisation, AI governance, Human-in-the-Loop, security, and domain controls that govern other authorised Essentials Mart interfaces. Provider-specific concerns will remain isolated within the WhatsApp integration boundary.**

**ADR-012 remains authoritative unless superseded by a subsequent ADR.**
