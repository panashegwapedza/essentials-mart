# ADR-015 — Security & Anti-Replication Architecture

**Status:** Proposed  
**Date:** 2026-08-14  
**Decision Type:** Security & Anti-Replication Architecture

---

## 1. Context

Essentials Mart is intended to operate as an enterprise platform containing interconnected domains, services, APIs, data systems, intelligence engines, AI agents, communication channels, autonomous capabilities, user applications, and operational infrastructure.

The platform therefore contains valuable assets that extend beyond the visible user interface.

These assets include:

- Domain models;
- Business rules;
- Enterprise workflows;
- Intelligence engines;
- AI agent behaviour;
- AI governance policies;
- Trust and decision policies;
- Proprietary algorithms;
- Recommendation logic;
- Store and inventory intelligence;
- Walk Mode intelligence;
- Autonomous decision mechanisms;
- Internal APIs;
- Data models;
- Security policies;
- Operational processes;
- Integration logic;
- Configuration;
- Cryptographic material;
- Authentication mechanisms;
- Authorisation policies;
- Proprietary datasets;
- System architecture;
- Product and platform knowledge.

Essentials Mart must therefore protect not only against conventional attacks, but also against unauthorised replication of the platform's architecture, business logic, intelligence, AI behaviour, proprietary workflows, and accumulated operational knowledge.

At the same time, the architecture must recognise an important technical limitation:

> Anything delivered to and executed by a user's device can potentially be inspected, copied, analysed, modified, or reverse-engineered.

This is particularly relevant to browser-based applications and other client applications.

Security therefore cannot depend on making client-side code secret.

Instead, the architecture must protect the assets that matter most through layered controls including:

- Server-side enforcement;
- Strong authentication;
- Authorisation;
- API protection;
- Data isolation;
- Secret management;
- Runtime controls;
- Rate limiting;
- Abuse detection;
- AI governance;
- Model and intelligence protection;
- Secure deployment;
- Monitoring;
- Auditability;
- Architectural separation;
- Controlled information exposure.

The objective is not to claim that Essentials Mart can become impossible to copy.

The objective is to make unauthorised replication materially more difficult, reduce the information available to an attacker, protect the platform's highest-value assets, and ensure that copying the visible application does not reproduce the underlying enterprise system.

---

## 2. Problem

A conventional application-security model is insufficient for Essentials Mart because the platform contains both conventional digital assets and proprietary intelligence.

Potential threats include:

- Source-code inspection;
- Client-side reverse engineering;
- API discovery;
- API abuse;
- Automated scraping;
- Credential theft;
- Token theft;
- Secret exposure;
- Business-rule extraction;
- AI behaviour extraction;
- Model extraction;
- Prompt extraction;
- Intelligence-engine replication;
- Automated interaction analysis;
- Data harvesting;
- Workflow replication;
- Architecture discovery;
- Dependency exploitation;
- Supply-chain compromise;
- Privilege escalation;
- Account takeover;
- Insider misuse;
- Unauthorised administrative access;
- Distributed denial-of-service activity;
- Automated abuse;
- Fraudulent transactions;
- Manipulation of autonomous capabilities.

A successful attacker may not need to compromise the entire platform.

For example, obtaining the client application may reveal:

- API routes;
- UI behaviour;
- Validation logic;
- Feature flags;
- Public configuration;
- Workflow structure;
- Client-side business rules.

Similarly, repeated interaction with an AI system may reveal behavioural patterns even when the underlying model is not directly accessible.

The architecture must therefore assume that some information will be observable and concentrate protection around:

1. Authority;
2. Secrets;
3. Data;
4. Business-critical decisions;
5. Proprietary intelligence;
6. AI capabilities;
7. Security controls;
8. Enterprise infrastructure;
9. Operational systems.

---

## 3. Decision

Essentials Mart will implement a layered security and anti-replication architecture.

The architecture will not attempt to make client-side software impossible to reverse-engineer.

Instead, it will:

- Minimise sensitive logic exposed to clients;
- Keep authoritative business rules server-side;
- Keep consequential decisions server-side;
- Keep secrets outside client applications;
- Enforce permissions server-side;
- Protect internal APIs;
- Separate capabilities from authority;
- Protect proprietary intelligence engines;
- Protect AI agents and their governance mechanisms;
- Limit model and intelligence exposure;
- Detect automated extraction and abuse;
- Protect data and operational context;
- Harden deployment infrastructure;
- Monitor security-sensitive activity;
- Preserve auditability;
- Reduce the value of copying the client application;
- Increase the cost of reconstructing the platform from observable behaviour.

The security architecture will therefore treat **replication resistance as a consequence of architectural separation, information minimisation, access control, runtime protection, and protected proprietary services**, rather than as a single anti-copying mechanism.

---

## 4. Architectural Principles

The architecture adopts the following principles.

### 4.1 Security Is Layered

No individual security mechanism should be treated as sufficient.

Security must be provided through multiple complementary controls.

### 4.2 Client-Side Code Is Observable

The architecture assumes that code delivered to a client may eventually be inspected or reverse-engineered.

Security must not depend on client code remaining secret.

### 4.3 Authoritative Logic Must Be Protected

Business rules that determine consequential outcomes must be enforced by trusted server-side systems.

### 4.4 Secrets Must Never Be Client-Side Assets

Credentials, private keys, privileged API tokens, signing secrets, database credentials, and other sensitive secrets must never be embedded in client applications.

### 4.5 Capability Does Not Equal Authority

A component may possess the technical capability to request an operation without being authorised to perform that operation.

### 4.6 Least Privilege

Every actor, service, AI agent, integration, and environment should receive only the permissions necessary for its responsibilities.

### 4.7 Minimise Valuable Exposure

The platform should not disclose more architecture, data, business logic, intelligence, or security information than necessary.

### 4.8 Security Must Be Enforced at Trusted Boundaries

Security decisions must be enforced at boundaries that an untrusted client cannot bypass.

### 4.9 Replication Resistance Is Architectural

The platform should not rely on obfuscation alone.

The most valuable protection comes from keeping proprietary capabilities behind controlled interfaces.

### 4.10 Detection Complements Prevention

The platform should assume that some attacks will bypass preventive controls.

Monitoring, detection, response, and auditability are therefore required.

### 4.11 Security Must Preserve User Control

Security controls must not unnecessarily remove legitimate user control or obscure important actions.

### 4.12 Security Must Not Become Surveillance

Security telemetry must remain subject to privacy, minimisation, retention, and access-control requirements established by the wider architecture.

---

## 5. Threat Model

The security architecture considers multiple threat categories.

### 5.1 External Attackers

External attackers may attempt to:

- Discover APIs;
- Exploit vulnerabilities;
- Steal credentials;
- Enumerate resources;
- Extract data;
- Abuse AI services;
- Reverse-engineer client applications;
- Replicate workflows;
- Disrupt services.

### 5.2 Automated Attackers

Automated systems may attempt:

- High-volume requests;
- Credential stuffing;
- Scraping;
- API enumeration;
- Behavioural probing;
- AI model extraction;
- Automated account creation;
- Automated transaction abuse.

### 5.3 Malicious or Compromised Accounts

A legitimate account may be:

- Stolen;
- Shared improperly;
- Compromised;
- Abused by its owner;
- Used to obtain information beyond its intended authority.

Authentication alone must therefore not be treated as sufficient security.

### 5.4 Insider Threats

Privileged users may attempt to access information or systems beyond their legitimate responsibilities.

The architecture must therefore combine:

- Least privilege;
- Access controls;
- Separation of duties;
- Monitoring;
- Auditability.

### 5.5 Supply-Chain Threats

Compromised dependencies, build systems, packages, integrations, or infrastructure may introduce malicious behaviour.

Security must therefore extend into:

- Dependencies;
- Build pipelines;
- Deployment;
- Infrastructure;
- External integrations.

### 5.6 Replication Threats

An attacker may attempt to reproduce Essentials Mart by studying:

- Client applications;
- Public APIs;
- User workflows;
- AI responses;
- Recommendations;
- Navigation;
- Store behaviour;
- Product substitutions;
- Autonomous decisions;
- Public documentation;
- Observable system responses.

The architecture must reduce the amount of proprietary information that can be reconstructed from these surfaces.

---

## 6. Security Boundary Model

Essentials Mart will distinguish between trusted and untrusted execution environments.

Conceptually:

```text
User / Client Device
        |
        | Untrusted Boundary
        v
Public API / Gateway
        |
        | Authenticated + Authorised Boundary
        v
Application Services
        |
        +---- Domain Logic
        +---- Business Rules
        +---- Intelligence
        +---- AI Society
        +---- Data Access
        |
        v
Protected Enterprise Systems
        |
        +---- Databases
        +---- Secrets
        +---- Internal Services
        +---- AI Providers
        +---- Operational Systems
The client must not be treated as a trusted authority.

7. Client Application Security
Client applications may contain:

Presentation logic;

Interaction logic;

Local state;

Non-sensitive configuration;

Cached information;

User preferences;

Client-side validation.

However, clients must not be treated as authoritative for consequential security decisions.

The client must not be trusted to determine independently:

Whether a user is authorised;

Whether a transaction is valid;

Whether a payment is valid;

Whether an AI agent may perform an action;

Whether an autonomous action is permitted;

Whether a user may access another user's information;

Whether a user may access another household's protected information;

Whether an operation may bypass business rules.

These decisions must be enforced by trusted backend systems.

8. Client-Side Reverse Engineering
Essentials Mart explicitly acknowledges that client-side software cannot be made completely resistant to reverse engineering.

An attacker may potentially:

Download application assets;

Inspect executable code;

Inspect JavaScript;

Inspect network requests;

Inspect client-side state;

Analyse application behaviour;

Modify local code;

Observe public interfaces.

The architecture therefore does not rely on secrecy of client-side implementation.

Client-side protections may include appropriate:

Minification;

Bundling;

Obfuscation where justified;

Integrity checks;

Runtime hardening;

Platform security features;

Anti-tampering measures.

However, these controls are treated as cost-increasing measures, not as absolute protection.

The authoritative security boundary remains server-side.

9. Server-Side Business Logic Protection
Business logic that materially affects platform behaviour should be enforced server-side.

Examples include:

Pricing rules;

Transaction validation;

Eligibility decisions;

Inventory authority;

Order state transitions;

Refund authority;

Household permissions;

AI authority;

Autonomous action permissions;

Sensitive recommendation logic;

Trust decisions;

Security decisions.

The client may request an operation, but the trusted backend determines whether the operation is valid and authorised.

10. API Security
Public APIs must be treated as security boundaries.

API protection should include appropriate mechanisms such as:

Authentication;

Authorisation;

Input validation;

Schema validation;

Rate limiting;

Abuse detection;

Request-size limits;

Resource limits;

Replay protection where appropriate;

Secure error handling;

Version control;

Monitoring.

Internal APIs must not automatically be exposed as public APIs.

Internal service interfaces should use stronger trust assumptions and access controls appropriate to their environment.

11. Information Exposure
The platform should expose only the information necessary for a legitimate operation.

Responses should avoid unnecessarily revealing:

Internal service names;

Internal architecture;

Database structures;

Credentials;

Security controls;

Privileged identifiers;

Hidden business rules;

Sensitive operational information;

Internal AI configuration;

Protected prompts;

Model credentials.

Error responses should provide enough information for legitimate users and operators without unnecessarily assisting attackers.

12. Secrets Management
Secrets must be managed outside application source code and client applications.

Secrets may include:

Database credentials;

API keys;

Signing keys;

Encryption keys;

OAuth credentials;

Payment credentials;

WhatsApp credentials;

Notification credentials;

AI provider credentials;

Administrative credentials;

Internal service credentials.

Secrets must not be:

Committed to Git;

Embedded in source code;

Exposed through client applications;

Printed into logs;

Included in publicly accessible configuration;

Shared unnecessarily between environments.

Production secrets must be isolated from development and test credentials.

Secret rotation should be supported where appropriate.

13. Authentication
Authentication establishes identity but does not by itself establish authority.

Authentication architecture should support appropriate mechanisms for:

Customers;

Household members;

Staff;

Administrators;

Service identities;

AI agents;

External integrations.

Authentication mechanisms must protect against:

Credential theft;

Token theft;

Session abuse;

Brute-force attacks;

Credential stuffing;

Account takeover.

High-risk actions should receive stronger authentication or verification where appropriate.

14. Authorisation
Authorisation must be enforced independently of client behaviour.

The platform must determine:

Who is acting;

What they are attempting to do;

Which resource they are accessing;

Which scope applies;

Which authority they possess;

Which policy governs the action.

Authorisation may depend on:

User;

Household;

Role;

Store;

Region;

Resource;

Action;

AI agent;

Session;

Transaction;

Context.

A valid identity must not automatically imply unrestricted access.

15. AI Security
AI systems represent a high-value security and intellectual-property surface.

The architecture must protect:

AI agents;

Agent instructions;

Agent policies;

Agent permissions;

Tool access;

Intelligence engines;

Proprietary datasets;

Internal system prompts where applicable;

Model credentials;

AI provider credentials;

Decision policies;

Agent coordination mechanisms.

AI agents must not be trusted simply because they are internal software components.

AI execution must remain subject to:

Authentication;

Authorisation;

Policy enforcement;

Tool restrictions;

Context boundaries;

Human oversight where required;

Observability;

Auditability.

16. AI Model and Intelligence Protection
Where proprietary intelligence is used, the platform should minimise direct exposure of the underlying implementation.

Users and clients should generally interact with controlled capabilities rather than receiving direct access to:

Model credentials;

Internal model endpoints;

Proprietary model weights;

Internal agent infrastructure;

Hidden tool interfaces;

Internal policy representations.

Where third-party AI providers are used, provider access must be mediated through controlled service boundaries.

17. AI Distillation and Behavioural Extraction
Essentials Mart recognises that repeated interaction with an AI system may allow an attacker to infer aspects of its behaviour.

Potential extraction techniques include:

Repeated querying;

Systematic prompt probing;

Boundary testing;

Automated response collection;

Behavioural comparison;

Prompt-injection attempts;

Tool enumeration;

Output harvesting.

The platform should therefore use appropriate controls such as:

Rate limiting;

Abuse detection;

Request quotas;

Anomaly detection;

Sensitive-output filtering;

Tool access restrictions;

Context minimisation;

Controlled error responses;

Monitoring of unusual interaction patterns.

The objective is to make large-scale behavioural extraction more difficult while preserving legitimate platform use.

18. Proprietary Intelligence Protection
Proprietary intelligence should remain behind controlled service boundaries.

Examples include:

Recommendation engines;

Trust decisions;

Personalisation logic;

Inventory intelligence;

Navigation intelligence;

Product substitution logic;

Demand intelligence;

Autonomous shopping logic;

Operational optimisation.

Clients should receive the result necessary to perform the intended user experience rather than unnecessary access to the underlying algorithm.

19. Data Protection
Sensitive enterprise and user data must be protected through:

Access control;

Encryption where appropriate;

Data minimisation;

Data classification;

Retention policies;

Secure transmission;

Secure storage;

Auditability.

The platform must distinguish between:

Public information;

User information;

Household information;

Store information;

Operational information;

Confidential enterprise information;

Security-sensitive information;

Secret material.

Data ownership remains with the originating domain.

Security controls must not create uncontrolled cross-domain access.

20. Data Extraction Resistance
The platform should reduce opportunities for unauthorised bulk extraction.

Controls may include:

Pagination limits;

Query limits;

Rate limiting;

Access scopes;

Resource-level authorisation;

Anomaly detection;

Export controls;

Bulk-operation controls;

Audit logging.

Legitimate enterprise and user export requirements must remain supported through authorised mechanisms.

21. Scraping and Automated Abuse
Public and authenticated interfaces may be targeted by automated scraping.

The platform should detect and mitigate suspicious behaviour through appropriate mechanisms including:

Rate limits;

Request quotas;

Behavioural analysis;

Account reputation;

IP or network controls where appropriate;

Device or session signals where appropriate;

Progressive restrictions;

Abuse monitoring.

Security controls must avoid unnecessarily blocking legitimate users.

22. Runtime Protection
The platform should protect important runtime services against:

Unexpected inputs;

Resource exhaustion;

Malformed requests;

Abuse;

Privilege escalation;

Dependency failures;

Service compromise.

Runtime controls should include appropriate:

Validation;

Timeouts;

Resource limits;

Circuit breakers;

Isolation;

Dependency controls;

Health checks.

23. Application Integrity
The platform should maintain confidence that production application components have not been unexpectedly modified.

Appropriate controls may include:

Versioned builds;

Integrity verification;

Controlled deployment;

Signed artifacts where appropriate;

Protected build pipelines;

Deployment audit records;

Dependency verification.

The exact mechanisms will be defined during implementation.

24. Dependency and Supply-Chain Security
Third-party dependencies create additional attack surfaces.

The platform should maintain controls for:

Dependency inventory;

Version management;

Vulnerability monitoring;

Integrity verification;

Dependency review;

Removal of unnecessary dependencies;

Build reproducibility where practical.

Critical dependencies should receive appropriate security scrutiny.

25. Build and Deployment Security
The software delivery pipeline is part of the security boundary.

Build and deployment systems must protect:

Source code;

Build credentials;

Signing credentials;

Deployment credentials;

Secrets;

Artifacts;

Infrastructure configuration.

Production deployment authority must be restricted.

A compromised build pipeline must be treated as a potentially enterprise-wide security incident.

26. Infrastructure Security
Infrastructure must follow security principles including:

Least privilege;

Network segmentation where appropriate;

Protected management interfaces;

Secure service identities;

Secure secrets;

Controlled administrative access;

Monitoring;

Patch management;

Vulnerability management.

Infrastructure architecture must avoid unnecessary exposure of internal services to public networks.

27. Security of Autonomous Capabilities
Autonomous capabilities introduce additional security requirements.

The platform must distinguish between:

Capability
    |
    v
Availability
    |
    v
Authorisation
    |
    v
Policy Check
    |
    v
Human Approval if Required
    |
    v
Execution
Deployment of an autonomous capability must not automatically grant permission to use it.

This principle applies to:

AI agents;

Walk Mode;

Autopilot;

Purchases;

Product substitutions;

External communications;

Delivery actions;

Other consequential operations.

28. Walk Mode Security
Walk Mode is a particularly important security boundary because it combines:

User identity;

Store context;

Location context;

Product information;

Basket state;

Navigation;

AI recommendations;

Potential autonomous behaviour;

Purchase-related actions.

Walk Mode must therefore enforce:

Current store context;

User authority;

Household authority where applicable;

AI permissions;

Purchase authority;

Session security;

Autonomous-action controls.

A compromised client must not be able to bypass these controls.

29. Emergency Controls
The platform must provide mechanisms for rapidly disabling compromised or dangerous capabilities.

Emergency controls should be capable of restricting affected functionality without necessarily taking unrelated platform services offline.

Potential emergency actions include:

Disable an AI agent;

Disable an intelligence capability;

Disable a tool;

Disable Walk Mode autopilot;

Disable a compromised integration;

Revoke credentials;

Restrict an API;

Disable a feature flag;

Restrict affected stores or regions.

Emergency actions must be observable and auditable.

30. Security Observability
Security-relevant activity must integrate with the observability architecture established by ADR-016.

Examples include:

Authentication failures;

Suspicious access;

Permission escalation;

Unusual API activity;

Token misuse;

Automated extraction attempts;

Repeated failed operations;

Administrative changes;

Security policy violations;

AI abuse;

Autonomous-system anomalies.

Security telemetry must itself be protected against unauthorised modification.

31. Auditability
Security-sensitive actions must be auditable.

Audit records should establish, where applicable:

Actor;

Action;

Resource;

Authority;

Policy;

Timestamp;

Result;

Correlation information.

Important security events should be connected to the broader audit architecture established by ADR-016.

Security audit records must not expose secrets unnecessarily.

32. Incident Response
The platform must support investigation and response to security incidents.

Incident response should be capable of establishing:

What happened;

When it happened;

Which systems were affected;

Which identities were involved;

Which resources were accessed;

Which permissions were used;

Which actions were executed;

Whether data was affected;

Whether autonomous systems were involved;

Whether containment was successful.

The architecture must support rapid containment where appropriate.

33. Security Testing
Security testing must be integrated throughout development.

Testing should include appropriate forms of:

Authentication testing;

Authorisation testing;

API security testing;

Input validation testing;

Dependency testing;

Secrets scanning;

Configuration testing;

Penetration testing;

Abuse testing;

AI security testing;

Prompt-injection testing;

Model-extraction resistance testing;

Client tampering testing;

Autonomous-system safety testing.

Security testing must verify server-side enforcement rather than merely testing the client interface.

34. Anti-Replication Strategy
Essentials Mart will use multiple layers to increase the cost of unauthorised replication.

These layers include:

Layer 1 — Client Exposure Reduction
Minimise sensitive logic and secrets exposed to clients.

Layer 2 — Server-Side Authority
Keep authoritative business rules and consequential decisions behind trusted services.

Layer 3 — Protected Intelligence
Keep proprietary algorithms and intelligence engines behind controlled interfaces.

Layer 4 — AI Governance
Keep AI capabilities subject to controlled policies, permissions, tools, and authority boundaries.

Layer 5 — Data Protection
Protect proprietary datasets and operational information.

Layer 6 — API Protection
Restrict automated extraction and unauthorised use.

Layer 7 — Runtime Detection
Detect unusual behaviour and extraction attempts.

Layer 8 — Infrastructure Protection
Protect the systems required to operate the platform.

Layer 9 — Observability and Auditability
Maintain evidence necessary to investigate misuse and compromise.

Layer 10 — Continuous Evolution
Recognise that static anti-replication mechanisms eventually become understood and therefore require continuous security improvement.

35. What the Architecture Does Not Promise
The architecture does not claim that Essentials Mart can make:

Client code impossible to inspect;

Public behaviour impossible to observe;

APIs impossible to analyse;

AI outputs impossible to study;

Screenshots impossible to reproduce;

User interfaces impossible to imitate.

Instead, the architecture aims to ensure that copying observable surfaces does not reproduce the complete enterprise capability.

A replica should still lack access to protected:

Data;

Intelligence;

Business rules;

AI governance;

Internal services;

Credentials;

Operational systems;

Enterprise workflows;

Authoritative decision systems.

36. Security and Intellectual Property
Security architecture contributes to protection of Essentials Mart intellectual property.

Important intellectual property may exist in:

Software;

Algorithms;

Architecture;

AI behaviour;

Data;

Business rules;

Workflows;

Product strategy;

Operational knowledge.

Technical security controls should therefore be complemented by appropriate:

Access policies;

Confidentiality controls;

Documentation controls;

Employee access governance;

Legal protections;

Licensing;

Contractual protections.

Technical architecture alone cannot provide complete intellectual-property protection.

37. Privacy and Security Balance
Security controls must remain consistent with the privacy architecture.

Security monitoring should use the minimum information necessary to:

Detect attacks;

Investigate incidents;

Protect users;

Protect enterprise systems;

Enforce security policies.

Sensitive user information must not be collected merely because it could theoretically improve security.

Security telemetry remains subject to:

Access control;

Retention;

Purpose limitation;

Data minimisation;

Auditability.

38. Implementation Implications
Implementation will eventually require appropriate mechanisms for:

Secure authentication;

Authorisation;

API protection;

Rate limiting;

Abuse detection;

Secret management;

Encryption;

Secure service communication;

Security monitoring;

Audit records;

Vulnerability management;

Dependency management;

Secure build pipelines;

Artifact integrity;

Runtime protection;

AI security controls;

Model and intelligence protection;

Client hardening;

Incident response;

Emergency controls;

Security testing;

Security documentation.

Specific technologies are deferred to implementation and engineering standards.

39. Consequences
Positive
Stronger protection of enterprise systems;

Reduced exposure of proprietary business logic;

Greater resistance to unauthorised replication;

Stronger AI and intelligence protection;

Improved API security;

Reduced risk from stolen credentials;

Better protection of sensitive data;

Stronger autonomous-system controls;

Better incident investigation;

Improved security visibility;

Stronger separation between capability and authority;

Reduced value of copying the client application alone.

Negative
Increased architectural complexity;

Additional infrastructure requirements;

Additional security engineering effort;

Additional monitoring costs;

More complex access-control models;

Increased testing requirements;

Potential usability friction from security controls;

Ongoing maintenance requirements.

Trade-offs
Essentials Mart prioritises:

Protection over unnecessary exposure.

Server-side authority over client-side trust.

Layered security over single-point protection.

Replication resistance over implementation convenience.

Detection and accountability over invisible security controls.

Privacy over unnecessary surveillance.

Capability separation over unrestricted automation.

40. Alternatives Considered
Alternative A — Trust the Client Application
Allow the client to enforce most business and security rules.

Rejected because:

Client applications operate in environments controlled by users and therefore cannot be treated as authoritative security boundaries.

Alternative B — Obfuscate Everything
Rely primarily on client-side obfuscation to prevent reverse engineering.

Rejected because:

Obfuscation can increase analysis cost but cannot guarantee secrecy of software delivered to a client.

Alternative C — Keep the Entire Application Secret
Attempt to prevent users from observing application behaviour.

Rejected because:

A functioning application must necessarily expose some behaviour to its users and client devices.

Alternative D — Store Everything Behind a Single Backend
Place all functionality behind one large service and rely on the backend as the primary security boundary.

Rejected because:

This creates excessive coupling, expands the blast radius of compromise, and conflicts with the domain and service boundaries established by the enterprise architecture.

Alternative E — Security Through Obscurity
Rely primarily on undisclosed implementation details to prevent attacks or replication.

Rejected because:

Security must remain effective even when attackers understand the publicly observable architecture.

Alternative F — Layered Security and Anti-Replication Architecture
Combine trusted server-side authority, protected intelligence, strong authentication, authorisation, API controls, secret protection, runtime controls, AI governance, monitoring, auditability, and client exposure reduction.

Selected because:

It provides the strongest practical protection while recognising the technical limitations of client-side software and preserving legitimate platform functionality.

41. Dependencies
This ADR depends upon:

ADR-001 — Enterprise Architecture Principles

ADR-002 — Domain-Driven Enterprise Architecture

ADR-003 — Event-Driven Architecture

ADR-004 — API & Service Architecture

ADR-005 — Data Ownership & Database Boundaries

ADR-006 — Identity, Authentication & Authorisation

ADR-007 — AI Society Architecture

ADR-008 — Intelligence Engine Architecture

ADR-009 — AI Agent Governance & Permissions

ADR-010 — Human-in-the-Loop Architecture

ADR-011 — Notification & Communication Architecture

ADR-012 — WhatsApp Integration Architecture

ADR-013 — Flutter Client Architecture

ADR-014 — Walk Mode / Living Digital Supermarket Architecture

Later architecture decisions that depend upon this ADR include:

ADR-016 — Observability, Auditability & Trust Architecture

ADR-017 — Scalability & Multi-Store Architecture

ADR-018 — Deployment & Environment Strategy

42. Related Architecture Documents
EDA-001-enterprise-data-architecture.md

DOMAINS.md

EVENT-ARCHITECTURE.md

SECURITY-ARCHITECTURE.md

AI-001-ai-society.md

DEPLOYMENT-ARCHITECTURE.md

43. Related ADRs
ADR-003 — Event-Driven Architecture

ADR-004 — API & Service Architecture

ADR-005 — Data Ownership & Database Boundaries

ADR-006 — Identity, Authentication & Authorisation

ADR-007 — AI Society Architecture

ADR-008 — Intelligence Engine Architecture

ADR-009 — AI Agent Governance & Permissions

ADR-010 — Human-in-the-Loop Architecture

ADR-011 — Notification & Communication Architecture

ADR-012 — WhatsApp Integration Architecture

ADR-013 — Flutter Client Architecture

ADR-014 — Walk Mode / Living Digital Supermarket Architecture

ADR-016 — Observability, Auditability & Trust Architecture

ADR-017 — Scalability & Multi-Store Architecture

ADR-018 — Deployment & Environment Strategy

44. Decision Lifecycle
Current Status: Proposed

This ADR should be reviewed if:

The enterprise materially changes its security architecture;

Client architecture materially changes;

API architecture materially changes;

AI architecture materially changes;

AI model or intelligence exposure materially changes;

Autonomous capabilities materially expand;

New high-value intellectual property is introduced;

Replication or model-extraction threats materially evolve;

Authentication or authorisation architecture materially changes;

Deployment architecture introduces new security boundaries;

A significant security incident reveals a material architectural weakness;

Regulatory or legal requirements materially change security obligations.

Once accepted, this ADR is intended to remain immutable.

Any replacement ADR must reference ADR-015 and explain the reason for changing the security or anti-replication architecture.

45. Final Decision
Essentials Mart will use a layered security and anti-replication architecture designed to protect the platform's highest-value assets while recognising that client-side software cannot be made impossible to reverse-engineer. Client applications will therefore be treated as untrusted execution environments, while authoritative business rules, consequential decisions, sensitive data, secrets, proprietary intelligence, AI governance, and security controls will remain behind trusted server-side boundaries. Authentication, authorisation, API protection, secret management, runtime controls, AI security, data protection, infrastructure security, monitoring, auditability, incident response, and client hardening will operate as complementary layers. The architecture will increase the cost and difficulty of unauthorised replication, behavioural extraction, model extraction, and abuse without relying on security through obscurity or making unrealistic claims of perfect anti-reverse-engineering protection. Capability will remain distinct from authority, autonomous functionality will require explicit authorisation, and security controls will remain subject to privacy and data-minimisation principles.

ADR-015 remains authoritative unless superseded by a subsequent ADR.
