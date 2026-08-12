# ADR-011 — Notification & Communication Architecture

**Status:** Proposed  
**Date:** 2026-08-12  
**Decision Type:** Communication Architecture

---

## 1. Context

Essentials Mart requires a unified communication architecture capable of delivering information to users, households, staff, AI agents, and other authorised system participants.

The platform will operate across multiple communication channels, including the Essentials Mart Flutter application, push notifications, WhatsApp, email where appropriate, and internal operational interfaces.

The AI Society will also generate communications as part of its operation.

These communications may include:

- Order updates
- Delivery updates
- Payment notifications
- Shopping reminders
- Household notifications
- AI recommendations
- Alerts
- Human approval requests
- Service desk communications
- Return and support communications
- Security notifications
- System notifications
- Operational alerts

Without a common communication architecture, each domain or AI agent could implement its own notification mechanisms, resulting in duplicated infrastructure, inconsistent user experiences, unreliable delivery, and weak observability.

Essentials Mart therefore requires a central communication architecture while preserving domain ownership of the events and information that generate communications.

---

## 2. Problem

Without a unified communication architecture:

- Different services may implement incompatible notification systems.
- AI agents may communicate directly with users without consistent governance.
- Users may receive duplicate or conflicting notifications.
- Important messages may be delivered through inappropriate channels.
- Notification preferences may not be respected consistently.
- Critical communications may become indistinguishable from ordinary notifications.
- Communication failures may go undetected.
- The system may become tightly coupled to a specific communication provider.
- Human approval workflows may not reliably reach the authorised person.
- WhatsApp, push notifications, email, and future channels may evolve independently.

Essentials Mart therefore needs a common communication architecture that separates **what needs to be communicated** from **how and where it is delivered**.

---

## 3. Decision

Essentials Mart will implement a **centralised, event-driven notification and communication architecture**.

Domains and services remain responsible for generating authoritative business events.

A dedicated communication layer will determine:

- whether a communication is required;
- who should receive it;
- which channel should be used;
- the priority;
- the delivery policy;
- the appropriate message representation;
- whether fallback channels are required;
- and whether the communication requires acknowledgement or human action.

Communication channels will therefore act as delivery mechanisms rather than owners of business logic.

The architecture will support multiple communication channels without requiring domain services to implement channel-specific behaviour.

---

## 4. Communication Flow

The conceptual communication flow is:

Domain Service
    |
    v
Authoritative Business Event
    |
    v
Communication Policy
    |
    v
Recipient Resolution
    |
    v
Channel Selection
    |
    v
Message Generation
    |
    v
Delivery
    |
    v
Delivery Status
    |
    v
Audit / Observability

This separates business events from communication delivery.

---

## 5. Domain Ownership

Domains remain the authoritative owners of the business events that trigger communications.

For example:

- Order domain owns order events.
- Delivery domain owns delivery events.
- Inventory domain owns inventory events.
- Household domain owns household events.
- Payment domain owns payment events.

The communication layer does not become the owner of those business concepts.

Its responsibility is to interpret authorised events and determine how those events should be communicated.

---

## 6. Communication Types

The architecture will support different communication categories, including:

### Informational

Used to provide relevant information to the recipient.

Examples:

- Order confirmation
- Delivery progress
- Product availability
- Household updates

### Action Required

Used when the recipient must perform an action.

Examples:

- Human approval
- Payment confirmation
- Account verification

### Alert

Used when an event requires elevated attention.

Examples:

- Delivery problem
- Security event
- Significant inventory issue

### Reminder

Used to prompt an action or inform the recipient of an upcoming event.

Examples:

- Shopping reminders
- Scheduled deliveries
- Expiring items

### Operational

Used for internal staff and enterprise operations.

Examples:

- Service desk requests
- Failed delivery workflows
- System operational alerts

---

## 7. Channel Abstraction

Communication delivery will be abstracted from the underlying channel.

Conceptually:

Communication Request
        |
        v
Channel Selection
        |
        +---- Push Notification
        |
        +---- WhatsApp
        |
        +---- Email
        |
        +---- In-App
        |
        +---- Internal Operational Channel
        |
        +---- Future Channel

A domain must not need to know which provider or technical mechanism ultimately delivers the communication.

---

## 8. Channel Selection

Channel selection will be determined by applicable communication policy.

Factors may include:

- User preferences
- Household preferences
- Message priority
- Message type
- Channel availability
- User consent
- Channel capability
- Delivery history
- Security requirements
- Time and context
- Whether acknowledgement is required

The system must not assume that every message should be delivered through every channel.

---

## 9. User Preferences and Consent

Users must have control over applicable communication preferences.

The architecture must support preferences for:

- Channel
- Communication category
- Frequency
- Priority
- Quiet periods where applicable
- Optional communications
- Marketing communications
- AI-generated communications

Mandatory security, transactional, or legally required communications may be subject to different rules.

Preferences must not override security or enterprise policy where doing so would create unacceptable risk.

---

## 10. Multi-Channel Delivery

The architecture will support sending the same logical communication through more than one authorised channel where policy requires it.

For example:

User
   |
   +---- App Notification
   |
   +---- WhatsApp

The system must avoid treating each delivery as a separate business event.

There should be one logical communication with multiple delivery attempts or channel representations.

---

## 11. Fallback and Escalation

The communication system may use fallback channels when an important communication cannot be delivered through the preferred channel.

For example:

Preferred Channel
        |
        v
Delivery Failure
        |
        v
Policy Evaluation
        |
        v
Fallback Channel

Fallback behaviour must be governed by communication policy.

The system must not automatically escalate every failed notification to every available channel.

---

## 12. Priority

Communications will support priority classification.

Priority may influence:

- Delivery urgency
- Retry behaviour
- Channel selection
- Escalation
- Notification presentation
- Operational monitoring

The exact priority levels will be defined by the communication implementation and applicable domain policies.

---

## 13. Delivery Reliability

The communication architecture will support reliable delivery patterns where appropriate.

This may include:

- Queuing
- Retry
- Backoff
- Dead-letter handling
- Delivery confirmation
- Failure tracking
- Idempotency
- Duplicate prevention

Communication failure must not corrupt the underlying business transaction.

For example, failure to send an order notification must not cause the order itself to be considered unsuccessful.

---

## 14. Idempotency and Duplicate Prevention

The communication layer must prevent accidental duplicate communications where the same logical communication is processed multiple times.

A communication should have an identifiable logical identity allowing the system to distinguish:

- New communication
- Retry
- Duplicate delivery attempt
- Fallback delivery
- Updated communication

This is particularly important for event-driven workflows.

---

## 15. Message Generation

The communication architecture will separate message generation from delivery.

Messages may be generated from:

- Structured templates
- Domain data
- AI-generated content
- Policy-defined content
- Localised content

AI-generated communication must remain subject to applicable AI governance, safety, privacy, and communication policies.

AI agents must not use the communication system to bypass authority boundaries established by ADR-009 and ADR-010.

---

## 16. AI Society Communications

AI agents may generate communications on behalf of Essentials Mart where authorised.

The communication must remain attributable to the originating AI agent or service where such attribution is relevant.

The communication architecture must therefore support metadata identifying:

- Originating service
- AI agent where applicable
- Communication type
- Triggering event
- Recipient
- Delivery channel
- Policy decision

AI-generated communication must not be treated as an independent authority.

---

## 17. Human-in-the-Loop Communications

The communication layer will support Human-in-the-Loop workflows established by ADR-010.

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
Communication Request
   |
   v
Authorised Human
   |
   v
Approval / Rejection

The notification system is responsible for delivering the request.

It does not determine whether the underlying action is authorised.

---

## 18. WhatsApp

WhatsApp will be treated as one communication channel within the broader communication architecture.

Detailed WhatsApp architecture, authentication, session handling, message processing, provider integration, and channel-specific security will be defined in ADR-012.

ADR-011 therefore establishes the communication abstraction while ADR-012 defines the WhatsApp implementation.

---

## 19. Security

Communication mechanisms must protect:

- Recipient identity
- Message confidentiality
- Message integrity
- Authentication
- Authorisation
- Sensitive information
- Approval requests
- Household information
- Account information

Sensitive communications must only be delivered through channels and mechanisms authorised for the relevant information classification.

Security architecture remains governed by ADR-006 and ADR-015.

---

## 20. Privacy

The communication architecture must respect applicable privacy requirements.

The system should minimise the information included in notifications where full information is unnecessary.

For example, a notification may indicate that an action requires attention without exposing sensitive details on a potentially visible notification surface.

The level of information disclosed must depend on:

- Recipient identity
- Channel
- Information sensitivity
- User preferences
- Security policy
- Context

---

## 21. Communication State

Communications should have a lifecycle that allows the system to track their state.

A conceptual lifecycle is:

Created
   |
   v
Queued
   |
   v
Dispatched
   |
   v
Delivered
   |
   v
Acknowledged

Alternative states may include:

- Failed
- Retrying
- Expired
- Cancelled
- Suppressed

The exact implementation will be defined by the communication service.

---

## 22. Observability

Communication activity must be observable.

The system should be able to determine:

- What communication was generated
- Why it was generated
- Who it was intended for
- Which service or agent generated it
- Which channel was selected
- Whether delivery was attempted
- Whether delivery succeeded
- Whether acknowledgement occurred
- Whether fallback was triggered
- Why delivery failed

This provides a foundation for ADR-016.

---

## 23. Failure Handling

Failure of the communication layer must not automatically cause failure of the underlying business operation.

For example:

Order Created
    |
    +---- Communication Delivered
    |
    +---- Communication Failed

The order remains authoritative according to the Order domain.

The communication system may retry or escalate the notification independently.

Where communication itself is a required part of an operation, the relevant domain policy must explicitly define that dependency.

---

## 24. Consequences

### Positive

- Provides a consistent communication architecture.
- Separates business logic from communication delivery.
- Supports multiple communication channels.
- Enables WhatsApp without coupling the enterprise to WhatsApp.
- Supports AI Society communications.
- Supports Human-in-the-Loop workflows.
- Improves notification reliability and observability.
- Reduces duplicated communication infrastructure.
- Makes future communication channels easier to introduce.
- Allows communication preferences to be centrally governed.

### Negative

- Introduces an additional communication layer.
- Requires message routing and policy infrastructure.
- Multi-channel delivery increases operational complexity.
- Reliable delivery requires queueing, retry, monitoring, and failure handling.

### Trade-offs

Essentials Mart prioritises **communication consistency, reliability, and user control over implementation simplicity**.

The communication layer will remain independent from specific communication providers so that the enterprise can evolve its channels without restructuring domain services.

---

## 25. Alternatives Considered

### Alternative A — Domain-Owned Notifications

Allow every domain to implement its own notification system.

**Rejected because:**  
This would create duplicated infrastructure, inconsistent policies, and tightly coupled communication behaviour.

### Alternative B — AI-Agent-Owned Communication

Allow individual AI agents to communicate directly through channels.

**Rejected because:**  
This would weaken communication governance and make consistent auditing, preference management, security, and channel control difficult.

### Alternative C — Single Communication Channel

Use one primary communication channel for all Essentials Mart communication.

**Rejected because:**  
Different users, message types, urgency levels, and workflows require different communication channels.

### Alternative D — Centralised Communication Layer

Use a common communication layer that receives authorised events and determines delivery according to policy.

**Selected because:**  
It provides consistent governance, channel abstraction, reliability, observability, and flexibility while preserving domain ownership.

---

## 26. Implementation Implications

The implementation will eventually require:

- Communication service
- Notification policies
- Recipient resolution
- Channel adapters
- Message templates
- Message localisation
- Queueing
- Retry mechanisms
- Idempotency
- Delivery tracking
- Preference management
- Consent management
- Communication state management
- Audit records
- Channel-specific integrations

Specific channel implementations will be defined by their respective architectures.

---

## 27. Dependencies

This ADR depends upon:

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture

It establishes requirements for:

- ADR-012 — WhatsApp Integration Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 28. Related Architecture Documents

- EVENT-ARCHITECTURE.md
- SECURITY-ARCHITECTURE.md
- AI-001-ai-society.md

---

## 29. Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 30. Decision Lifecycle

**Current Status:** Proposed

This ADR should be reviewed if:

- The enterprise communication model changes.
- New communication channels become strategically important.
- Communication governance requirements materially change.
- Notification reliability requirements change.
- Privacy or security requirements materially change.
- The communication abstraction becomes insufficient.

Any replacement ADR must reference ADR-011 and explain the reason for changing the communication architecture.

---

## 31. Final Decision

> **Essentials Mart will implement a centralised, event-driven notification and communication architecture that separates authoritative business events from communication delivery. Domains will remain responsible for their business events, while the communication layer will determine recipients, channels, message representation, delivery policy, fallback behaviour, and communication state according to applicable policy. The architecture will support multiple channels, including the Essentials Mart application and WhatsApp, without coupling domain services to any specific communication provider.**

**ADR-011 remains authoritative unless superseded by a subsequent ADR.**
