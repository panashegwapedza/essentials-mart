# ADR-018 — Deployment & Environment Strategy

**Status:** Proposed  
**Date:** 2026-08-14  
**Decision Type:** Deployment & Environment Strategy

---

## 1. Context

Essentials Mart is an enterprise platform composed of interconnected applications, services, databases, event-driven workflows, AI agents, intelligence engines, external integrations, operational systems, and user-facing capabilities.

The platform must support development, testing, validation, deployment, operation, monitoring, and controlled evolution without allowing changes in one environment to compromise other environments.

The architecture must also support the long-term requirements of Essentials Mart, including:

- AI Society;
- Intelligence Engines;
- event-driven architecture;
- domain-oriented services;
- multi-store operation;
- Walk Mode;
- autonomous capabilities;
- household functionality;
- notifications;
- WhatsApp integration;
- payments;
- delivery coordination;
- staff interaction;
- security monitoring;
- observability;
- auditability;
- enterprise operations.

Deployment therefore cannot be treated as simply placing the application on a server.

It must provide controlled environments, repeatable deployments, configuration separation, secure secret management, service isolation, observability, rollback capability, controlled database changes, and a path toward scalable production infrastructure.

---

## 2. Problem

Without a defined deployment and environment architecture:

- Development changes may interfere with testing.
- Testing may accidentally affect production resources.
- Environment configuration may become inconsistent.
- Secrets may be exposed through source code or client applications.
- Database changes may be applied without sufficient control.
- AI models or agents may behave differently between environments without visibility.
- Event-driven workflows may become difficult to reproduce.
- External integrations may accidentally send real messages or execute real transactions during development.
- Failed deployments may be difficult to roll back.
- Infrastructure may become dependent on manual configuration.
- Scaling may become difficult as the platform grows.
- Observability may differ between environments.
- Security controls may be inconsistently applied.
- Production changes may become difficult to audit.

Essentials Mart therefore requires a controlled deployment and environment strategy from the architectural foundation onward.

---

## 3. Decision

Essentials Mart will use a controlled, environment-separated, repeatable deployment architecture.

The platform will distinguish between environments according to their purpose, risk, and level of production realism.

At minimum, the architecture will support:

- Local development;
- Development/integration;
- Testing;
- Staging/pre-production;
- Production.

Additional isolated environments may be introduced where justified by operational or security requirements.

Each environment must have clearly defined:

- Configuration;
- Secrets;
- Data boundaries;
- Infrastructure;
- Service endpoints;
- External integrations;
- Access controls;
- Observability;
- Deployment permissions.

Production will remain isolated from non-production environments.

Deployments should be automated and reproducible wherever practical.

---

## 4. Environment Principles

The following principles govern the environment architecture.

### 4.1 Environment Isolation

Environments must be logically and, where appropriate, physically isolated.

A development or testing failure must not directly compromise production.

### 4.2 Production Protection

Production resources must require stronger access controls and deployment protections than non-production environments.

### 4.3 Configuration Separation

Environment-specific configuration must not be hard-coded into application source code.

### 4.4 Secret Separation

Secrets must be stored and managed separately from source code and application bundles.

Production secrets must never be reused casually in non-production environments.

### 4.5 Reproducibility

A deployment should be reproducible from version-controlled source, infrastructure definitions, configuration references, and approved dependencies.

### 4.6 Automation

Manual deployment steps should be minimised.

### 4.7 Observability

Deployment and runtime behaviour must integrate with the observability architecture established by ADR-016.

### 4.8 Auditability

Material deployment and infrastructure changes must be attributable and auditable.

### 4.9 Controlled Change

Production changes must pass through an appropriate validation and approval process.

### 4.10 Rollback

The deployment architecture must support recovery from failed or unsafe releases.

---

## 5. Environment Model

Essentials Mart will use an environment progression:

```text
Local Development
        |
        v
Development / Integration
        |
        v
Testing
        |
        v
Staging / Pre-Production
        |
        v
Production

The environments serve different purposes and are not intended to be identical in scale.

They should, however, share sufficiently similar architectural characteristics to expose deployment and integration problems before production.

6. Local Development Environment
The local development environment is intended for individual engineering work.

It should allow developers to:

Run relevant application components;

Develop services;

Test APIs;

Test event flows;

Test AI integrations;

Test UI behaviour;

Run automated tests;

Work with representative development data.

Local development must not require unrestricted access to production resources.

Production credentials, production secrets, and unrestricted production data must not be required for normal development.

Where external integrations are required, development or sandbox environments should be preferred.

7. Development / Integration Environment
The development/integration environment will provide a shared environment for integrating independently developed components.

It should support:

Service integration;

API integration;

Event processing;

Database integration;

AI agent integration;

Intelligence Engine integration;

Notification integration;

WhatsApp integration through appropriate non-production mechanisms;

Authentication integration;

Delivery integration through appropriate test mechanisms.

This environment should identify integration problems before changes reach formal testing.

8. Testing Environment
The testing environment will support structured verification of platform behaviour.

Testing may include:

Unit tests;

Integration tests;

Contract tests;

API tests;

Event-driven workflow tests;

Security tests;

AI behaviour tests;

Permission tests;

Failure tests;

Performance tests;

End-to-end tests.

Testing environments should use controlled and non-production data unless an explicitly approved process permits otherwise.

9. Staging / Pre-Production Environment
The staging environment will provide the closest practical representation of production architecture before release.

It should be used for:

Release validation;

Deployment validation;

End-to-end testing;

Infrastructure validation;

Database migration validation;

External integration validation;

Security validation;

Observability validation;

AI workflow validation;

Operational readiness checks.

Staging should reflect production architecture sufficiently closely to expose material deployment risks.

It does not need to duplicate production scale unless required for a particular test.

10. Production Environment
Production is the live Essentials Mart environment.

Production contains:

Real users;

Real household information;

Real orders;

Real inventory;

Real financial activity;

Real communication activity;

Real operational data;

Real AI interactions;

Real delivery workflows;

Real store operations.

Production therefore receives the highest level of:

Access control;

Security;

Monitoring;

Auditability;

Change control;

Backup;

Recovery planning;

Incident response.

Production access must be restricted to authorised personnel and systems.

11. Environment Data Boundaries
Each environment must maintain appropriate data boundaries.

Production data must not automatically flow into lower environments.

Where production-derived data is required for testing, it must undergo appropriate:

Minimisation;

Anonymisation;

Masking;

Filtering;

Access control.

Non-production environments should preferentially use synthetic, generated, or specifically controlled test data.

12. Configuration Management
Environment-specific configuration will be separated from application code.

Configuration may include:

Service endpoints;

Feature configuration;

Environment identifiers;

Integration configuration;

Runtime settings;

Scaling parameters;

Observability configuration;

AI provider configuration;

Notification configuration.

Configuration must be versioned or otherwise controlled where appropriate.

Secrets must not be embedded in source-controlled configuration.

13. Secret Management
Secrets will be managed through dedicated secret-management mechanisms appropriate to the deployment environment.

Secrets may include:

API credentials;

Database credentials;

Signing keys;

Encryption keys;

OAuth credentials;

Service credentials;

External integration credentials;

AI provider credentials.

Secrets must not be committed to source control.

Production secrets must be isolated from development and testing credentials.

Access to secrets must follow least-privilege principles.

14. Infrastructure as Code
Infrastructure should be defined through version-controlled infrastructure-as-code mechanisms where practical.

Infrastructure definitions should cover relevant resources such as:

Networks;

Databases;

Compute resources;

Storage;

Queues;

Event infrastructure;

Secrets infrastructure;

Monitoring;

Service configuration;

Deployment infrastructure.

Infrastructure changes should be reviewable and attributable.

Manual infrastructure changes should be minimised and controlled.

15. Application Deployment
Application deployments should be automated through controlled deployment pipelines.

A deployment should identify:

Source revision;

Build version;

Dependencies;

Configuration version;

Deployment environment;

Deployment time;

Deployment actor or automation;

Result.

Deployment records should integrate with the observability and audit architecture.

16. Continuous Integration and Continuous Delivery
The platform should use automated CI/CD processes to validate and deliver changes.

A typical flow is:

Code Change
     |
     v
Build
     |
     v
Static Validation
     |
     v
Automated Tests
     |
     v
Security Checks
     |
     v
Artifact Creation
     |
     v
Development
     |
     v
Testing
     |
     v
Staging
     |
     v
Production Approval
     |
     v
Production Deployment
The exact tooling is deferred to implementation.

17. Release Management
Releases must be identifiable and traceable.

A release should have a unique version or equivalent immutable identifier.

Release records should associate:

Code revision;

Build artifact;

Database migration state;

Configuration;

Deployment environment;

Deployment time;

Deployment result.

This allows operators to determine what version is currently running.

18. Deployment Strategies
The architecture should support controlled deployment strategies appropriate to service criticality.

Possible strategies include:

Rolling deployment;

Blue-green deployment;

Canary deployment;

Feature-flagged release;

Phased deployment.

The appropriate strategy may differ between services.

Critical services should favour deployment strategies that reduce blast radius and allow rapid recovery.

19. Rollback and Recovery
The deployment architecture must support recovery from failed releases.

Rollback mechanisms should consider:

Application versions;

Configuration;

Infrastructure;

Database schema changes;

Event consumers;

AI agent versions;

Intelligence Engine versions.

Database changes require particular care because schema changes may not always be safely reversible.

Where rollback is not technically appropriate, forward-compatible migration and corrective deployment strategies must be used.

20. Database Deployment
Database schema changes must be controlled and versioned.

Database migrations should:

Be identifiable;

Be reviewed;

Be tested;

Be applied in a controlled sequence;

Be observable;

Be associated with the relevant release.

Database ownership and boundaries remain governed by ADR-005.

Deployment architecture must not bypass those ownership boundaries.

21. Event-Driven Deployment
Because Essentials Mart uses event-driven architecture, deployments must account for asynchronous workflows.

Changes to:

Event schemas;

Event producers;

Event consumers;

Queues;

Topics;

Event handlers;

must be deployed in a manner that avoids unnecessary disruption.

Where compatibility is required, producers and consumers should support controlled schema evolution.

Event processing failures must be observable through the architecture defined by ADR-016.

22. AI Deployment
AI agents, intelligence engines, models, prompts, policies, and supporting services must be deployed under controlled versioning.

A material AI deployment should be identifiable through:

Agent version;

Model identifier;

Intelligence Engine version where applicable;

Policy version where applicable;

Configuration version;

Deployment environment.

AI changes must not silently alter production behaviour without appropriate release visibility.

AI capability remains subject to the authority and governance architecture established by ADR-009.

23. AI Model and Agent Environment Separation
Development and testing of AI behaviour must not automatically affect production AI behaviour.

Non-production environments should support:

Experimental agents;

Model evaluation;

Prompt evaluation;

Tool testing;

Policy testing;

Safety testing;

Failure testing.

Production AI configurations should be explicitly promoted rather than implicitly shared.

24. External Integration Environments
External integrations must be environment-aware.

Integrations may include:

WhatsApp;

Payment providers;

Delivery providers;

Notification services;

Authentication providers;

AI model providers.

Where available, sandbox or test endpoints should be used outside production.

A non-production environment must not accidentally send real customer communications, execute real payments, or create real deliveries.

Production integration credentials must remain isolated.

25. Feature Flags and Controlled Activation
Feature flags may be used to separate deployment from activation.

This is particularly useful for:

New AI capabilities;

Walk Mode capabilities;

New payment functionality;

New communication channels;

Experimental features;

Gradual rollouts.

Feature flags must themselves be controlled and auditable where they affect security, authority, financial behaviour, or significant user functionality.

26. Multi-Store Deployment Considerations
The deployment architecture must support the future multi-store requirements established by ADR-017.

Deployment architecture must therefore allow the platform to distinguish between:

Global platform configuration;

Enterprise configuration;

Store-level configuration;

Environment configuration.

Store-specific behaviour must not require uncontrolled duplication of the entire platform.

Deployment mechanisms should support gradual expansion to additional stores without fundamentally changing the deployment architecture.

27. Security Controls
Deployment infrastructure must follow the security principles established by ADR-015.

Controls should include:

Least privilege;

Strong authentication;

Restricted production access;

Secret isolation;

Secure build processes;

Dependency validation;

Artifact integrity;

Network controls;

Audit logging;

Monitoring;

Controlled administrative access.

The deployment pipeline itself must be treated as a security-sensitive system.

28. Observability and Deployment
Deployment events must integrate with the observability architecture established by ADR-016.

The system should make it possible to correlate:

Deployment
    |
    v
Release
    |
    v
Service Version
    |
    v
Runtime Behaviour
    |
    v
Incident / Outcome
This allows operators to determine whether a deployment contributed to a failure or behavioural change.

29. Availability and Resilience
Deployment architecture should minimise unnecessary service interruption.

Critical services should support deployment approaches appropriate to their availability requirements.

Where practical, the architecture should support:

Redundant instances;

Health checks;

Graceful shutdown;

Restart mechanisms;

Traffic management;

Automated recovery;

Controlled failover.

Exact resilience requirements will be defined according to service criticality.

30. Disaster Recovery
Production deployment architecture must support disaster recovery planning.

Recovery considerations include:

Application artifacts;

Infrastructure definitions;

Database backups;

Configuration;

Secrets recovery;

Event infrastructure;

External integration configuration;

AI configuration;

Audit records.

Recovery procedures must be tested rather than assumed to work.

Recovery objectives will be defined during implementation based on business criticality.

31. Deployment Failure Handling
The platform must detect and record deployment failures.

Deployment failure handling should support:

Automatic detection;

Clear failure reporting;

Preservation of diagnostic information;

Rollback where appropriate;

Operator notification;

Audit records;

Incident investigation.

A deployment must not be considered successful solely because the deployment command completed.

The resulting service health must also be evaluated.

32. Environment Access
Access must be proportional to environment sensitivity.

For example:

Local
  |
  v
Development
  |
  v
Testing
  |
  v
Staging
  |
  v
Production
Access requirements should become progressively stricter toward production.

Production access must be explicitly authorised and should be auditable.

33. Testing Deployment Infrastructure
Deployment mechanisms themselves must be tested.

Testing should verify:

Builds are reproducible;

Deployments complete correctly;

Configuration is applied correctly;

Secrets are resolved securely;

Migrations execute correctly;

Services become healthy;

Events continue processing;

Observability remains functional;

Rollback mechanisms operate;

External integrations remain correctly isolated.

34. Development Workflow
The deployment architecture should support the engineering workflow without requiring every change to reach production.

A normal change should progress through an appropriate validation path:

Development
     |
     v
Review
     |
     v
Automated Validation
     |
     v
Integration Testing
     |
     v
Staging
     |
     v
Release Approval
     |
     v
Production
The exact workflow may vary according to change criticality.

Emergency changes must still preserve appropriate auditability.

35. Deployment Auditability
Material deployment actions must be attributable.

The platform should be able to determine:

What was deployed;

Where it was deployed;

When it was deployed;

Which version was deployed;

Who or what initiated the deployment;

Whether approval was required;

Whether approval occurred;

Whether deployment succeeded;

What happened afterwards.

Deployment records should integrate with ADR-016's audit and observability architecture.

36. Consequences
Positive
Stronger environment isolation;

Reduced risk of production contamination;

More repeatable deployments;

Better release traceability;

Improved rollback capability;

Better security;

Improved observability;

Safer AI deployment;

Safer external integration testing;

Better support for multi-store growth;

Reduced dependence on manual infrastructure configuration;

Improved incident investigation.

Negative
Additional infrastructure complexity;

Additional CI/CD engineering effort;

Increased environment management costs;

More complex secret management;

Additional testing requirements;

Production deployment requires stronger governance.

Trade-offs
Essentials Mart prioritises:

Controlled deployment over deployment convenience.

Production safety over unrestricted access.

Reproducibility over manual configuration.

Isolation over shared infrastructure convenience.

Recoverability over release speed.

37. Alternatives Considered
Alternative A — Single Environment
Use one shared environment for development, testing, and production.

Rejected because:

It creates unacceptable risk of development changes affecting real users, data, transactions, and integrations.

Alternative B — Manual Deployment
Deploy services manually when changes are ready.

Rejected because:

Manual processes increase configuration drift, deployment errors, inconsistent releases, and weak auditability.

Alternative C — Independent Environments Without Standardisation
Allow each team or service to define its own environment and deployment model.

Rejected because:

This creates inconsistent security, observability, configuration, deployment, and recovery practices.

Alternative D — Fully Automated Environment-Separated Deployment
Use controlled environments with automated validation, deployment, configuration management, observability, auditability, and controlled production promotion.

Selected because:

It provides the appropriate balance of safety, repeatability, scalability, operational visibility, and controlled change for Essentials Mart.

38. Implementation Implications
Implementation will eventually require:

Environment definitions;

CI/CD pipelines;

Artifact management;

Infrastructure as Code;

Secret management;

Configuration management;

Database migration tooling;

Deployment automation;

Release management;

Health checks;

Rollback mechanisms;

Monitoring;

Deployment auditing;

Disaster recovery procedures;

External integration sandboxing;

AI model and agent version management;

Feature-flag infrastructure where appropriate.

Specific technologies are deferred to the implementation phase.

39. Dependencies
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

ADR-015 — Security & Anti-Replication Architecture

ADR-016 — Observability, Auditability & Trust

ADR-017 — Scalability & Multi-Store Architecture

40. Related Architecture Documents
EDA-001-enterprise-data-architecture.md

DOMAINS.md

EVENT-ARCHITECTURE.md

SECURITY-ARCHITECTURE.md

AI-001-ai-society.md

DEPLOYMENT-ARCHITECTURE.md

41. Related ADRs
ADR-003 — Event-Driven Architecture

ADR-004 — API & Service Architecture

ADR-005 — Data Ownership & Database Boundaries

ADR-006 — Identity, Authentication & Authorisation

ADR-009 — AI Agent Governance & Permissions

ADR-015 — Security & Anti-Replication Architecture

ADR-016 — Observability, Auditability & Trust

ADR-017 — Scalability & Multi-Store Architecture

42. Decision Lifecycle
Current Status: Proposed

This ADR should be reviewed if:

The deployment architecture materially changes;

Environment isolation requirements materially change;

Production security requirements materially change;

The CI/CD architecture materially changes;

Infrastructure strategy materially changes;

Disaster recovery requirements materially change;

Multi-store deployment requirements materially change;

AI deployment requirements materially change;

External integration deployment requirements materially change.

Any replacement ADR must reference ADR-018 and explain the reason for changing the deployment and environment strategy.

ADR-018 remains authoritative unless superseded by a subsequent ADR.

43. Final Decision
Essentials Mart will implement a controlled, environment-separated, repeatable deployment architecture covering local development, development/integration, testing, staging/pre-production, and production. Production will remain isolated from non-production environments and will receive stronger access control, security, observability, auditability, and change-management protections. Deployments will be automated and traceable wherever practical, with controlled configuration and secret management, versioned releases, database migration controls, event-aware deployment practices, AI version management, external integration isolation, rollback and recovery mechanisms, and deployment auditability. The deployment architecture will support the future multi-store platform while preserving the domain, security, observability, AI governance, and trust boundaries established by the preceding ADRs.
