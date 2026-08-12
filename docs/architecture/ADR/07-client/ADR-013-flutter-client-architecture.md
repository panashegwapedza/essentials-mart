# ADR-013 — Flutter Client Architecture

**Status:** Proposed  
**Date:** 2026-08-12  
**Decision Type:** Client Architecture

---

## 1. Context

Essentials Mart will provide a primary cross-platform client application built with Flutter.

The Flutter application will provide the primary user-facing interface to the Essentials Mart platform and may expose capabilities including:

- Product discovery
- Search
- Shopping lists
- Cart management
- Orders
- Payments
- Deliveries
- Household management
- Notifications
- AI assistance
- Account management
- Service desk interactions
- Returns
- Parcel collection
- Walk Mode
- Living Digital Supermarket experiences

The enterprise architecture established by the preceding ADRs requires clear separation between the client and the backend.

The Flutter application must therefore act as an authorised client of the platform rather than becoming a second implementation of the enterprise architecture.

---

## 2. Problem

Without a defined client architecture:

- Business logic may become duplicated between Flutter and backend services.
- The client may become tightly coupled to database structures.
- Security-sensitive decisions may be incorrectly delegated to the client.
- AI agents may be implemented as isolated client-side features.
- Different screens may implement inconsistent data access patterns.
- Offline and synchronisation behaviour may become unpredictable.
- Navigation may become tightly coupled to individual backend services.
- Walk Mode may require a separate application architecture.
- Future client platforms may become difficult to introduce.
- Changes to backend domains may require unnecessary client rewrites.

Essentials Mart therefore requires a client architecture that provides a rich user experience while preserving enterprise domain ownership and backend authority.

---

## 3. Decision

Essentials Mart will use **Flutter as the primary cross-platform client framework**.

The Flutter client will be structured around clear separation between:

- Presentation
- Application state
- Client-side application logic
- API and service communication
- Local persistence
- Authentication state
- Event handling
- Domain-facing client models

The Flutter application will communicate with the enterprise backend through authorised APIs and supported communication mechanisms.

The Flutter client will not directly own authoritative enterprise data or business rules.

---

## 4. Client Responsibility

The Flutter client is responsible for:

- User interface;
- User interaction;
- Navigation;
- Local presentation state;
- Temporary client state;
- Form validation;
- Client-side usability logic;
- Rendering domain data;
- Managing authenticated sessions;
- Initiating authorised API requests;
- Displaying notifications;
- Presenting AI interactions;
- Managing supported offline experiences.

The Flutter client is not responsible for authoritative:

- Pricing;
- Inventory;
- Order state;
- Payment decisions;
- Delivery state;
- User permissions;
- Household authority;
- AI agent authority;
- Enterprise policy;
- Security policy.

These remain owned by the appropriate backend services and domains.

---

## 5. Architectural Model

The conceptual client architecture is:

Flutter Application
        |
        v
Presentation Layer
        |
        v
Application / State Layer
        |
        v
Client Service Layer
        |
        v
API / Integration Layer
        |
        v
Essentials Mart Backend
        |
        v
Enterprise Domains

The client must not bypass the API and service boundaries to access authoritative enterprise data directly.

---

## 6. Presentation Layer

The presentation layer will contain:

- Screens;
- Widgets;
- UI components;
- Layouts;
- Navigation presentation;
- Accessibility behaviour;
- User interaction handling;
- Visual states;
- Loading states;
- Empty states;
- Error states.

Presentation components should not contain substantial enterprise business logic.

The UI should consume state and actions exposed by the appropriate application layer.

---

## 7. Application State

The client will maintain state required to provide a responsive user experience.

State may include:

- Current user session;
- Navigation state;
- Current cart presentation;
- Active shopping list;
- Current AI conversation;
- Current Walk Mode session;
- Temporary form state;
- Cached information;
- Loading state;
- Error state;
- Connectivity state.

Client state must be distinguished from authoritative server state.

Where client state conflicts with authoritative server state, the applicable server authority takes precedence.

---

## 8. Server Authority

The backend remains authoritative for enterprise state.

For example:

Client
   |
   v
Request: Add Product to Cart
   |
   v
Backend
   |
   +---- Validate
   |
   +---- Apply Business Rules
   |
   +---- Update Authoritative State
   |
   v
Response
   |
   v
Flutter State

The client may provide immediate UI feedback where appropriate, but optimistic behaviour must not be interpreted as authoritative confirmation.

---

## 9. API Interaction

The Flutter client will communicate with backend capabilities through defined APIs.

The client must not:

- Directly manipulate enterprise database tables;
- Depend on undocumented database structures;
- Reimplement backend authorisation;
- Circumvent domain services;
- Invoke internal services that are not intended for client consumption.

API contracts must remain the primary interface between the client and enterprise services.

---

## 10. Authentication

The Flutter client will integrate with the identity architecture established by ADR-006.

The client may manage:

- Authentication flows;
- Session state;
- Credential lifecycle interactions;
- Authentication challenges;
- Secure local session information.

The client must not independently determine whether a user is authorised to perform a protected enterprise action.

Authorisation remains enforced by the backend.

---

## 11. Secure Local Storage

Sensitive client-side information must use appropriate secure storage mechanisms.

The application must minimise storage of:

- Credentials;
- Authentication secrets;
- Sensitive personal information;
- Payment information;
- Sensitive household information;
- AI conversational information.

The exact storage mechanism will be determined during implementation according to the security architecture.

---

## 12. Domain-Oriented Client Structure

The Flutter application should organise client functionality around meaningful enterprise capabilities rather than purely technical screen groupings.

Examples may include:

- Identity
- Household
- Product
- Search
- Shopping
- Cart
- Order
- Payment
- Delivery
- AI
- Notifications
- Service
- Returns
- Parcel Collection
- Walk Mode

This allows the client structure to remain aligned with the enterprise domain architecture.

Client modules do not become independent backend domains merely because they have corresponding Flutter modules.

---

## 13. AI Integration

The Flutter application will provide an interface to the AI Society rather than implementing the AI Society itself.

Conceptually:

Flutter
   |
   v
AI Interface
   |
   v
AI Orchestration
   |
   v
AI Society
   |
   v
Agents / Intelligence Engines
   |
   v
Enterprise Domains

The client may display:

- AI recommendations;
- AI conversations;
- Shopping suggestions;
- Explanations;
- Alerts;
- Action confirmations;
- Human approval requests.

AI authority remains governed by ADR-007 through ADR-010.

---

## 14. Notifications

The Flutter application will participate in the communication architecture established by ADR-011.

It may receive:

- Push notifications;
- In-app notifications;
- AI communications;
- Order updates;
- Delivery updates;
- Approval requests;
- Security notifications;
- Operational messages where applicable.

Notifications must be treated as communication representations rather than independent sources of business truth.

---

## 15. WhatsApp Relationship

WhatsApp remains an external communication and interaction channel as defined by ADR-012.

The Flutter application and WhatsApp should provide access to compatible platform capabilities where appropriate without creating separate business logic.

For example:

Flutter
   |
   +---- AI Interaction
   |
   +---- Shopping
   |
   +---- Orders

WhatsApp
   |
   +---- AI Interaction
   |
   +---- Shopping
   |
   +---- Orders

Both ultimately communicate with the same authoritative backend capabilities.

---

## 16. Offline Capability

The Flutter application may support offline functionality where it improves usability.

Offline behaviour must be explicitly classified.

Examples include:

### Safe Offline Operations

- Viewing previously cached information;
- Browsing cached content;
- Preparing a shopping list locally;
- Drafting user input.

### Restricted Offline Operations

Actions requiring authoritative server validation must not be represented as completed merely because the client accepted them locally.

Examples include:

- Payment;
- Final order submission;
- Inventory-sensitive actions;
- Account permission changes;
- Security-sensitive actions.

Offline requests may be queued where supported.

---

## 17. Synchronisation

Where local state is cached or temporarily modified, the application must provide controlled synchronisation with authoritative backend state.

The synchronisation architecture must account for:

- Connectivity loss;
- Reconnection;
- Conflicting changes;
- Duplicate requests;
- Expired sessions;
- Server-side state changes;
- Failed operations.

The backend remains authoritative when conflicts cannot safely be resolved locally.

---

## 18. Error Handling

The Flutter application must provide structured handling for:

- Validation errors;
- Authentication errors;
- Authorisation failures;
- Network failures;
- Service failures;
- Timeout conditions;
- Unexpected responses;
- Synchronisation conflicts;
- Offline conditions.

Errors should be translated into appropriate user-facing states without exposing unnecessary internal implementation details.

The client should distinguish between:

- Recoverable errors;
- User-actionable errors;
- Temporary service failures;
- Security-related failures;
- Unknown failures.

---

## 19. Loading and Empty States

Every major client workflow should account for:

- Initial loading;
- Partial loading;
- Empty results;
- Retry;
- Failure;
- Offline state;
- Successful completion.

The application should not assume that data is always immediately available.

This is particularly important for AI responses, product search, inventory, delivery tracking, and Walk Mode.

---

## 20. Navigation

Navigation will be designed around user journeys and platform capabilities rather than backend service boundaries.

The application should support coherent journeys such as:

Discover
   |
   v
Select
   |
   v
Cart
   |
   v
Checkout
   |
   v
Delivery
   |
   v
Order Completion

AI may participate across these journeys without forcing the user into a separate application experience.

---

## 21. Walk Mode

Walk Mode will be implemented as a client capability within the Flutter application.

It will consume the backend services and data required to provide the Living Digital Supermarket experience.

Walk Mode must not create a separate source of truth for:

- Products;
- Inventory;
- Store layouts;
- Pricing;
- Orders;
- Users;
- Household information.

Its detailed architecture will be established by ADR-014.

---

## 22. Accessibility

The Flutter client will be designed with accessibility as an architectural concern.

The application should support:

- Appropriate text scaling;
- Semantic UI;
- Accessible navigation;
- Screen-reader compatibility;
- Sufficient interaction targets;
- Clear status communication;
- Appropriate contrast;
- Non-visual interaction where applicable.

Accessibility requirements should be incorporated into shared UI components rather than implemented inconsistently screen by screen.

---

## 23. Design System

Essentials Mart will use a shared client design system.

The design system should provide reusable:

- Typography;
- Spacing;
- Components;
- Buttons;
- Forms;
- Cards;
- Navigation elements;
- Status indicators;
- Dialogues;
- Accessibility behaviour;
- Interaction patterns.

This will reduce visual inconsistency and allow the client to evolve as a unified product.

---

## 24. Performance

The Flutter application must be designed for responsive operation across supported devices.

Performance considerations include:

- Efficient rendering;
- Controlled network requests;
- Caching;
- Image optimisation;
- Lazy loading;
- Background processing where appropriate;
- Battery usage;
- Memory usage;
- Offline behaviour.

Performance optimisation must not compromise enterprise security or data integrity.

---

## 25. Observability

The client will provide appropriate telemetry to support:

- Application health;
- Crash detection;
- Performance monitoring;
- Network failures;
- User-flow failures;
- Synchronisation problems;
- Notification failures;
- AI interaction failures.

Telemetry must respect privacy and security requirements.

Client telemetry must not become a mechanism for collecting unnecessary personal information.

---

## 26. Testing

The Flutter architecture will support multiple levels of testing, including:

- Unit testing;
- Widget testing;
- Integration testing;
- API integration testing;
- Authentication testing;
- Offline testing;
- Synchronisation testing;
- Accessibility testing;
- Performance testing;
- End-to-end testing.

Critical business behaviour must also be validated against backend services rather than relying solely on client-side tests.

---

## 27. Versioning and Compatibility

The client must be designed to tolerate appropriate backend evolution.

Where possible:

- APIs should evolve compatibly;
- Deprecated capabilities should have migration paths;
- Client releases should not depend unnecessarily on simultaneous backend deployment;
- Feature availability should be determined safely.

Breaking changes must be deliberately managed across the client and backend release lifecycle.

---

## 28. Security Boundary

The Flutter client is considered an untrusted execution environment.

Any information or logic delivered to the client may potentially be inspected or manipulated.

Therefore:

- Security-sensitive rules must be enforced server-side;
- Authorisation must be enforced server-side;
- Sensitive secrets must not be embedded in the client;
- Client-side validation must not be treated as security enforcement;
- Enterprise business logic must not depend exclusively on client behaviour.

This principle is foundational to ADR-015.

---

## 29. Consequences

### Positive

- Provides a unified cross-platform client.
- Maintains clear separation between presentation and enterprise authority.
- Aligns the client with the domain architecture.
- Supports AI Society interaction.
- Supports WhatsApp parity where appropriate.
- Provides a foundation for Walk Mode.
- Enables controlled offline experiences.
- Improves maintainability through shared architecture and design systems.
- Reduces duplication of backend business logic.

### Negative

- Requires disciplined API boundaries.
- Requires additional client state-management infrastructure.
- Offline and synchronisation support increase complexity.
- Maintaining a comprehensive design system requires ongoing effort.
- Client releases must be coordinated with backend evolution.

### Trade-offs

Essentials Mart prioritises **client experience without sacrificing enterprise authority**.

The Flutter application will remain rich and capable while deliberately treating the backend as the authority for protected business behaviour and enterprise state.

---

## 30. Alternatives Considered

### Alternative A — Server-Rendered Web Application

Use a web application as the primary client.

**Rejected because:**
Essentials Mart requires strong cross-platform mobile capabilities, offline support, device integration, notifications, and Walk Mode functionality.

### Alternative B — Native Separate Applications

Build independent Android and iOS applications.

**Rejected because:**
Maintaining separate client implementations would increase development and maintenance complexity without providing sufficient architectural benefit for the initial platform.

### Alternative C — Flutter with Direct Database Access

Allow the Flutter client to communicate directly with the enterprise database.

**Rejected because:**
This would expose internal data structures, weaken domain boundaries, increase security risk, and couple the client to the database architecture.

### Alternative D — Flutter as an API Consumer

Use Flutter as the primary cross-platform client communicating with authorised enterprise services through defined APIs.

**Selected because:**
It provides cross-platform capability while preserving enterprise domain ownership, security boundaries, service abstraction, and long-term architectural flexibility.

---

## 31. Implementation Implications

The implementation will eventually require:

- Flutter application structure;
- Shared design system;
- State-management strategy;
- API client layer;
- Authentication integration;
- Secure local storage;
- Local caching;
- Synchronisation mechanisms;
- Notification integration;
- AI interaction layer;
- Error-handling framework;
- Analytics and observability;
- Automated testing;
- Accessibility tooling;
- Release management.

Specific implementation technologies and package selections are intentionally deferred to the implementation phase.

---

## 32. Dependencies

This ADR depends upon:

- ADR-001 — Enterprise Architecture Principles
- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture

It establishes requirements for:

- ADR-014 — Walk Mode / Living Digital Supermarket Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 33. Related Architecture Documents

- EDA-001-enterprise-data-architecture.md
- DOMAINS.md
- EVENT-ARCHITECTURE.md
- SECURITY-ARCHITECTURE.md
- AI-001-ai-society.md

---

## 34. Related ADRs

- ADR-001 — Enterprise Architecture Principles
- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-014 — Walk Mode / Living Digital Supermarket Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 35. Decision Lifecycle

**Current Status:** Proposed

This ADR should be reviewed if:

- Flutter ceases to be the primary client framework;
- The client architecture materially changes;
- A new primary client platform is introduced;
- Offline requirements materially change;
- Walk Mode requires a fundamentally different client architecture;
- Backend and client boundaries materially change;
- Security requirements require architectural revision.

Any replacement ADR must reference ADR-013 and explain the reason for changing the Flutter client architecture.

---

## 36. Final Decision

> **Essentials Mart will use Flutter as its primary cross-platform client framework. The Flutter application will provide the user-facing experience while remaining an authorised client of the enterprise backend. It will not own authoritative enterprise data, security-sensitive business rules, domain authority, or AI governance. The client will communicate through defined APIs and supported integration mechanisms, maintain appropriate local state and offline capabilities, integrate with the AI Society and communication architecture, and provide the foundation for Walk Mode while preserving the backend as the authoritative source of enterprise state.**

**ADR-013 remains authoritative unless superseded by a subsequent ADR.**
