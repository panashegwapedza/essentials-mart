# EIP-028 — Observability, Auditability & Trust Implementation Architecture

**Status:** Proposed / Build Baseline  
**Date:** 2026-08-23  
**Decision Type:** Implementation Architecture  
**Parent Architecture:** ADR-016 — Observability, Auditability & Trust  
**Depends On:** EIP-019, EIP-021, EIP-022, EIP-023, EIP-024, EIP-025, EIP-026, EIP-027, ADR-003, ADR-007, ADR-008, ADR-009, ADR-010, ADR-011, ADR-012, ADR-014, ADR-015, ADR-016, ADR-017, ADR-019, ADR-020, EDA-001 Part 4

## 1. Purpose

EIP-028 defines the implementation architecture through which Essentials Mart realises the observability, auditability and trust requirements established by ADR-016.

It translates the architectural decision into implementation boundaries for:

- metrics;
- structured logs;
- distributed traces;
- domain-event correlation;
- audit records;
- AI decision records;
- security telemetry;
- user-facing explanations;
- operational alerts;
- trust signals;
- investigation workflows;
- retention;
- access control;
- and assurance evidence.

EIP-028 does not replace ADR-016. ADR-016 remains authoritative for the architectural decision. EIP-028 defines the reusable implementation approach.

## 2. Constitutional Principle

> **Observability must make material system behaviour discoverable; auditability must make material authority and outcomes reconstructable; trust must be supported by evidence rather than assertion.**

The implementation must preserve the distinction between operational telemetry, enterprise events, audit records and AI decision records.

## 3. Implementation Relationship

The implementation chain is:

```text
ADR-016
   ↓
Observability / Audit / Trust Requirements
   ↓
EIP-028
   ↓
Telemetry / Audit / Decision Interfaces
   ↓
Services / Events / AI Runtime / Clients
   ↓
Stored Records + Operational Signals
   ↓
Investigation / Assurance / User Explanation
```

EIP-019 remains the authoritative architecture-to-implementation traceability bridge.

## 4. Implementation Domains

The implementation shall treat the following as related but distinct capabilities:

```text
Operational Observability
        │
        ├── Metrics
        ├── Logs
        └── Traces

Enterprise Occurrence
        │
        └── Domain Events

Accountability
        │
        └── Audit Records

AI Accountability
        │
        └── AI Decision Records

Security Assurance
        │
        └── Security Telemetry

User Trust
        │
        └── Explanations / Trust Signals
```

A single material action may generate more than one record type.

## 5. Source-of-Truth Rules

The implementation must preserve ownership boundaries.

- Domain state remains authoritative in the owning domain.
- Domain events remain governed by EIP-023 and the Event Catalogue.
- Audit records do not become replacement domain state.
- Logs do not become authoritative business records.
- Metrics do not become authoritative historical state.
- AI decision records do not become substitutes for domain decisions.
- Trust signals do not automatically become facts about a user.

Observability must describe the system without silently becoming a second system of record.

## 6. Standard Telemetry Context

Material requests and processing activities should carry a common telemetry context where applicable.

Conceptually:

```text
TelemetryContext
├── requestId
├── correlationId
├── causationId
├── traceId
├── spanId
├── eventId
├── commandId
├── actorId
├── tenantId
├── organisationId
├── serviceId
├── capabilityId
└── environment
```

Identifiers must be propagated across approved API, event and AI boundaries.

Sensitive identifiers must be minimised and protected according to the security architecture.

## 7. Metrics Implementation

Services and critical clients should expose metrics for material operational behaviour.

Metric categories should include, where applicable:

- availability;
- latency;
- throughput;
- error rate;
- saturation;
- queue depth;
- event-processing latency;
- consumer lag;
- database performance;
- external-provider performance;
- AI execution latency;
- AI task success rate;
- notification delivery rate;
- WhatsApp processing rate;
- inventory synchronisation latency;
- Walk Mode performance;
- and authentication failures.

Metrics should answer operational questions rather than create indiscriminate telemetry volume.

## 8. Structured Logging

Services should emit structured logs using a governed schema.

A material log entry should be capable of carrying:

- timestamp;
- severity;
- service;
- environment;
- trace context;
- request or event identifier;
- operation;
- outcome;
- error classification;
- and safe diagnostic context.

Logs must not contain secrets, authentication credentials or unnecessary sensitive personal information.

## 9. Distributed Tracing

Distributed traces should be used for material cross-boundary workflows.

A trace may span:

```text
Client
 ↓
Edge / API
 ↓
Domain Capability
 ↓
Database
 ↓
Event Publication
 ↓
Consumer
 ↓
AI Agent
 ↓
Intelligence Engine
 ↓
Notification
```

Tracing must remain useful across asynchronous boundaries by propagating approved correlation and causation context.

## 10. Event-to-Telemetry Correlation

EIP-023 event processing must integrate with the telemetry context.

Where applicable:

```text
Command
 ↓
Domain Change
 ↓
Event
 ↓
Consumer
 ↓
Derived Action
```

must remain traceable through event identifiers, correlation identifiers and causation identifiers.

Event identity remains governed by the event architecture; telemetry must reference rather than redefine event identity.

## 11. Audit Record Boundary

Audit records are durable accountability records for materially significant actions.

They should be generated for activities such as:

- authentication and authorisation changes;
- permission changes;
- AI authority changes;
- financial actions;
- purchases and refunds;
- household authority changes;
- autonomous actions;
- administrative actions;
- security-sensitive configuration changes;
- consent changes;
- communication permissions;
- and other governed material actions.

Not every application log or event should become an audit record.

## 12. Audit Record Contract

A governed audit record should establish, where applicable:

```text
AuditRecord
├── auditId
├── occurredAt
├── actor
├── action
├── resource
├── authority
├── policy
├── previousStateReference
├── resultingStateReference
├── executionComponent
├── humanApproval
├── outcome
├── correlationId
└── traceId
```

The contract must contain sufficient information for accountability without unnecessarily duplicating sensitive data.

## 13. Audit Immutability

Once an audit record has been accepted as historical evidence, it must not be silently rewritten.

Corrections must preserve historical integrity through controlled correction or supersession mechanisms.

Where technically appropriate, audit storage should support append-oriented or integrity-protected storage.

## 14. AI Decision Record

Material AI activity must be attributable without requiring unrestricted storage of private model reasoning.

A governed AI decision record may contain:

- agent identity;
- agent version;
- model/provider identifier;
- task;
- context references;
- policies evaluated;
- permissions available;
- tools invoked;
- recommendation or action class;
- execution result;
- confidence or uncertainty where meaningful;
- human approval;
- and correlation identifiers.

The record must establish accountability rather than expose private chain-of-thought.

## 15. AI Authority Traceability

The implementation must make it possible to distinguish:

```text
Capability
   ↓
Permission
   ↓
Authority
   ↓
Attempted Action
   ↓
Executed Action
   ↓
Outcome
```

An agent's ability to call a tool must not be interpreted as unrestricted authority over the underlying domain.

This reinforces EIP-024 and the AI governance architecture.

## 16. Human-in-the-Loop Evidence

Where human approval is required, the implementation should record:

- the action requiring approval;
- the authority requirement;
- the information presented;
- the approving or rejecting actor;
- the decision;
- timestamp;
- expiry or timeout where applicable;
- and resulting action.

The implementation must distinguish explicit approval, rejection, timeout, delegated authority and policy-based execution.

## 17. Walk Mode Observability and Auditability

Walk Mode must participate in the common observability and audit architecture.

Material actions may include:

- Manual Mode activation;
- AI Assisted Mode activation;
- Autopilot activation;
- Autopilot pause;
- user takeover;
- Autopilot resume;
- route changes;
- product recognition;
- recommendations;
- substitutions;
- basket changes;
- authority changes;
- and purchase-related actions.

The implementation must support reconstruction of significant autonomous behaviour without turning Walk Mode telemetry into unnecessary permanent location surveillance.

## 18. Security Telemetry

Security-relevant activity must be integrated with security monitoring.

Examples include:

- authentication failures;
- suspicious access;
- privilege changes;
- token misuse;
- abnormal API activity;
- repeated failed operations;
- administrative changes;
- policy violations;
- and automated containment actions.

Security telemetry must have stronger integrity and access controls than ordinary diagnostic logs where required by risk.

## 19. External Integration Observability

External integrations must expose enough state to distinguish:

```text
Requested
   ↓
Accepted
   ↓
Delivered / Executed
   ↓
Failed
   ↓
Unknown Outcome
```

This applies to, where relevant:

- WhatsApp;
- payment providers;
- delivery providers;
- notification providers;
- authentication providers;
- AI model providers;
- mapping providers;
- and partner integrations.

The system must not represent an unconfirmed external outcome as successful.

## 20. Failure-State Model

Material operations should use an explicit outcome model.

```text
SUCCESS
PARTIAL_SUCCESS
FAILED
UNKNOWN
CANCELLED
EXPIRED
```

The exact set may be refined by domain contracts, but implementations must not collapse an unknown outcome into success.

This is particularly important for payments, orders, inventory, notifications, WhatsApp messages, deliveries and AI actions.

## 21. Trust Signal Architecture

Trust signals may be derived from governed operational, behavioural and outcome data.

Examples include:

- reliability indicators;
- successful-action history;
- policy compliance;
- verification status;
- anomaly indicators;
- and confidence or uncertainty indicators.

Trust signals are contextual evidence, not universal truth about a person or organisation.

## 22. User-Facing Explanations

Where a user reasonably needs to understand automated behaviour, the platform should expose a concise explanation derived from governed decision metadata.

Examples:

- why a product was recommended;
- why a substitution was proposed;
- why a Walk Mode route changed;
- why a notification was sent;
- why an automated action was paused;
- and why human approval was requested.

Explanations must not expose secrets, private model reasoning or security-sensitive implementation details.

## 23. Consent and Permission History

Material permission changes must be reconstructable.

Examples include:

- location permission;
- notification permission;
- WhatsApp communication permission;
- AI autonomy settings;
- marketing preferences;
- household permissions;
- and data-sharing preferences.

The implementation should be able to determine the effective permission state relevant to a material action.

## 24. Privacy and Data Minimisation

Observability data must be governed as enterprise information.

The implementation shall apply:

- data minimisation;
- purpose limitation;
- least privilege;
- retention limits;
- sensitive-field filtering;
- access control;
- and appropriate regional restrictions.

Personal, financial, household, location, communication and AI-interaction data require particular care.

## 25. Retention Architecture

Retention shall be defined by record category and business purpose.

Potential categories include:

- metrics;
- diagnostic logs;
- traces;
- security telemetry;
- domain events;
- audit records;
- AI decision records;
- and trust signals.

Retention must consider operational value, replay requirements, security, legal obligations, privacy, data residency and storage cost.

Not every telemetry record requires indefinite retention.

## 26. Access Control

Observability and audit data must use governed access control.

Visibility should be role- and purpose-aware.

Possible roles include:

- end users;
- support personnel;
- developers;
- operations/SRE;
- security personnel;
- administrators;
- auditors;
- and authorised investigators.

Access to sensitive audit information should itself be auditable.

## 27. Investigation Workflow

The implementation should support a controlled investigation path:

```text
Incident / Question
        ↓
Trace
        ↓
Logs / Metrics
        ↓
Events
        ↓
Audit Records
        ↓
AI Decision Records
        ↓
Affected Resource
        ↓
Outcome
```

Investigation tooling must respect current authorization and privacy rules.

Historical access must not become a mechanism for bypassing current security controls.

## 28. Observability Platform Boundary

The observability platform should consume telemetry through governed interfaces rather than requiring every domain to understand the internal storage implementation.

Conceptually:

```text
Applications / Services / Agents
          ↓
Telemetry Interfaces
          ↓
Collection Layer
          ↓
Processing / Enrichment
          ↓
Storage
          ↓
Query / Investigation
          ↓
Dashboards / Alerts / Assurance
```

The exact vendor or technology remains an implementation choice unless established by a separate architectural decision.

## 29. Alerting

Alerts should be based on actionable conditions rather than raw telemetry volume.

Critical alerts should prioritise conditions affecting:

- customer transactions;
- payments;
- inventory correctness;
- fulfilment;
- delivery;
- identity;
- security;
- AI authority;
- event processing;
- and platform availability.

Alert fatigue must be treated as an operational risk.

## 30. SLO and Service Health Evidence

Critical capabilities should expose measurable service-health objectives where appropriate.

Health evidence may include:

- availability;
- latency;
- error rate;
- queue or event lag;
- dependency health;
- recovery performance;
- and customer-impact indicators.

SLOs are operational controls and must not be confused with business guarantees unless explicitly defined as such.

## 31. Evidence and EIP-019 Traceability

Every material observability, audit or trust control should be traceable through EIP-019.

Conceptually:

```text
ADR-016 Requirement
       ↓
EIP-028 Pattern
       ↓
Implementation Component
       ↓
Configuration / Code
       ↓
Verification
       ↓
Evidence
```

Evidence should identify the relevant source revision, environment and verification context.

## 32. Testing Requirements

Implementations should test:

- telemetry emission;
- trace propagation;
- correlation and causation;
- audit-record creation;
- audit integrity;
- AI decision attribution;
- permission-state reconstruction;
- failure-state reporting;
- external-provider outcome handling;
- retention controls;
- access controls;
- privacy filtering;
- alert conditions;
- and investigation workflows.

Security and privacy testing must be included for sensitive observability paths.

## 33. Resilience Requirements

Observability infrastructure must not become a critical single point of failure for ordinary business operations.

Where telemetry infrastructure is unavailable:

- critical business operations should fail according to their own domain requirements;
- telemetry should be buffered or degraded where safe;
- audit-critical records must use stronger durability guarantees where required;
- and telemetry failure must itself be observable.

Observability failure must not silently become business-data corruption.

## 34. Global and Regional Architecture

At global scale, observability and audit implementation must support:

- regional processing;
- data residency requirements;
- regional access controls;
- cross-region investigation where authorised;
- disaster recovery;
- regional failure;
- and controlled global aggregation.

A single global telemetry store must not automatically become the only viable architecture.

## 35. Implementation Boundaries

EIP-028 interacts with the implementation layers as follows:

```text
EIP-021  Backend Services / APIs
   ↓
Telemetry + Audit Interfaces

EIP-022  Enterprise Data
   ↓
Audit / Telemetry Storage Boundaries

EIP-023  Event Infrastructure
   ↓
Event Correlation + Processing Evidence

EIP-024  AI Runtime
   ↓
AI Decision Records + Authority Traceability

EIP-025  Flutter Client
   ↓
Client Telemetry + User Explanations

EIP-026  Infrastructure / Deployment
   ↓
Platform Telemetry + Release Evidence

EIP-027  Repository / Workspace
   ↓
Architecture Tests + CI Evidence
```

EIP-028 does not create parallel implementations of these capabilities. It establishes their observability and accountability integration.

## 36. Technology Neutrality

EIP-028 intentionally does not mandate a specific:

- metrics vendor;
- log platform;
- tracing vendor;
- audit database;
- SIEM;
- AI observability product;
- dashboard system;
- or alerting platform.

Technology selection must satisfy the architectural requirements and remain traceable to the implementation baseline.

## 37. Implementation Readiness Gate

An observability, auditability or trust capability is implementation-ready when:

1. the owning requirement is identified;
2. the record or telemetry category is defined;
3. the data classification is known;
4. ownership is defined;
5. retention is defined;
6. access control is defined;
7. privacy requirements are identified;
8. correlation requirements are defined;
9. verification is defined;
10. operational ownership is known;
11. and EIP-019 traceability exists.

## 38. Completion Gate

A material capability is not considered observably and accountably implemented merely because telemetry exists.

Completion requires:

```text
Correct Telemetry
      +
Correct Audit Records
      +
Correct AI Attribution
      +
Security / Privacy Controls
      +
Operational Alerts
      +
Investigation Capability
      +
Verification Evidence
      +
Traceability
      =
Architecturally Assured Observability
```

## 39. Forward-Consistency Requirements

EIP-028 must remain consistent with the existing implementation architecture.

Future changes affecting observability, auditability or trust must assess impacts on:

- EIP-019 traceability;
- EIP-021 backend services;
- EIP-022 data architecture;
- EIP-023 event infrastructure;
- EIP-024 AI runtime;
- EIP-025 Flutter client;
- EIP-026 infrastructure and deployment;
- EIP-027 repository/workspace architecture;
- ADR-016;
- Part 4 defensive controls;
- and applicable security, identity, communication and human-control decisions.

Material changes must update affected architecture documents through the established forward-consistency process.

## 40. Constitutional Implementation Laws

1. Material system behaviour must be observable.
2. Material actions must be auditable where accountability requires it.
3. Operational telemetry and audit records are distinct concerns.
4. Domain events and audit records are distinct concerns.
5. Logs and metrics must not silently become authoritative business state.
6. AI decision records must establish accountability without requiring unrestricted private model reasoning.
7. AI capability does not imply AI authority.
8. Human approval must be reconstructable where required.
9. Unknown outcomes must not be represented as successful outcomes.
10. Sensitive telemetry must be minimised and protected.
11. Observability access must be governed.
12. Historical audit evidence must not be silently rewritten.
13. Trust signals are contextual evidence, not universal truth.
14. User-facing explanations must provide meaningful transparency without exposing protected internals.
15. Consent and permission changes must be reconstructable where materially relevant.
16. External integration outcomes must remain distinguishable from requests.
17. Observability infrastructure must not become an unnecessary business single point of failure.
18. Material observability controls must be testable.
19. Material implementation evidence must remain traceable through EIP-019.
20. Technology selection must not silently redefine the architecture.
21. Future material changes must undergo forward-consistency review.

## 41. Architectural Outcome

EIP-028 establishes the implementation layer through which Essentials Mart can observe itself, reconstruct material behaviour, attribute AI activity, investigate failures, protect user trust and produce objective assurance evidence.

The resulting model is:

```text
Enterprise Architecture
        ↓
Governed Implementation
        ↓
Telemetry + Events + Audit + AI Records
        ↓
Operational Visibility
        ↓
Investigation / Security / Trust
        ↓
Evidence
        ↓
Architecture Assurance
```

The objective is not to record everything. The objective is to record enough of the right things to make material behaviour observable, accountable, explainable and trustworthy.

## Commit Message

```text
docs(eip): add EIP-028 observability auditability and trust implementation architecture
```

## Extended Commit Message

```text
Establish the implementation architecture for enterprise observability, auditability and trust.

- Translate ADR-016 into reusable implementation patterns
- Define common telemetry context and distributed correlation
- Define metrics, structured logging and distributed tracing boundaries
- Establish audit-record contracts and integrity requirements
- Establish AI decision records and authority traceability
- Define human-in-the-loop evidence requirements
- Define Walk Mode observability and auditability
- Establish security telemetry integration
- Define external integration outcome observability
- Establish explicit failure and unknown-outcome handling
- Define trust signals and user-facing explanations
- Establish consent and permission history requirements
- Define privacy, retention and access-control requirements
- Establish investigation and alerting workflows
- Define SLO and service-health evidence
- Integrate observability with EIP-019 traceability
- Define testing and resilience requirements
- Establish global and regional observability considerations
- Preserve technology neutrality
- Establish implementation readiness and completion gates
- Establish forward-consistency requirements
