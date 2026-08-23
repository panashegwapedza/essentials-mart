# Essentials Mart — Enterprise Integration Patterns

## Purpose

This directory documents the Enterprise Integration Patterns (EIPs) used by Essentials Mart to implement reliable, governed communication between enterprise domains, services, AI agents, Intelligence Engines, channels, and external systems.

EIPs describe **how integration is implemented**. They complement the architectural decisions recorded in the ADRs.

## Relationship to Other Architecture Documentation

- **ADR** — records why an architectural decision was made.
- **EDA** — defines the enterprise architectural structure and event-driven style.
- **EIP** — defines a reusable integration mechanism used to implement that architecture.
- **API contracts** — define synchronous interfaces and capability boundaries.
- **Event contracts** — define the structure and semantics of asynchronous messages.

ADR-003 establishes that events represent facts, commands request actions, and queries request information. The EIPs in this directory must preserve that distinction.

## EIP Catalogue

| ID | Pattern | Primary Purpose | Status |
| --- | --- | --- | --- |
| EIP-001 | Event Notification | Notify interested consumers that a state change occurred | Proposed |
| EIP-002 | Publish-Subscribe Channel | Distribute events to multiple authorised consumers | Proposed |
| EIP-003 | Event Stream | Provide an ordered, durable stream of events where required | Proposed |
| EIP-004 | Command Message | Represent an explicit request to perform an action | Proposed |
| EIP-005 | Request-Reply | Support synchronous request/response interactions | Proposed |
| EIP-006 | Message Router | Route messages between integration participants | Proposed |
| EIP-007 | Content-Based Router | Route messages according to message content | Proposed |
| EIP-008 | Recipient List | Deliver one message to a dynamically determined set of recipients | Proposed |
| EIP-009 | Dead Letter Channel | Isolate messages that cannot be successfully processed | Proposed |
| EIP-010 | Retry and Redelivery | Recover from transient processing failures | Proposed |
| EIP-011 | Idempotent Consumer | Prevent duplicate delivery from producing duplicate effects | Proposed |
| EIP-012 | Message Filter | Prevent irrelevant messages from reaching consumers | Proposed |
| EIP-013 | Saga Orchestration | Coordinate long-running distributed business workflows | Proposed |
| EIP-014 | Transactional Outbox | Reliably publish integration messages with domain state changes | Proposed |
| EIP-015 | Correlation and Distributed Tracing | Maintain workflow identity across distributed processing | Proposed |
| EIP-016 | Human-in-the-Loop Routing | Escalate actions requiring human authority | Proposed |
| EIP-017 | External Partner Adapter / Gateway | Isolate provider-specific external integrations behind canonical Essentials Mart contracts | Proposed |
| EIP-018 | Resource-Aware Multimodal Delivery Orchestration | Convert delivery jobs into feasible resource- and transport-aware delivery plans | Proposed |
| EIP-019 | Architecture-to-Implementation Traceability & Build Baseline | Connect architecture decisions to implementation, verification and evidence | Proposed |
| EIP-020 | Enterprise Domain & Bounded Context Implementation Map | Map enterprise domains and bounded contexts to implementation ownership | Proposed |
| EIP-021 | Backend Service & API Implementation Architecture | Define backend capability, service and API implementation boundaries | Proposed |
| EIP-022 | Enterprise Data Implementation Architecture | Define implementation boundaries for authoritative data ownership and access | Proposed |
| EIP-023 | Event Infrastructure Implementation Architecture | Define the implementation architecture for governed event transport and processing | Proposed |
| EIP-024 | AI Society Runtime Implementation Architecture | Define the implementation architecture for coordinated AI agents and intelligence | Proposed |
| EIP-025 | Flutter Client Implementation Architecture | Define the implementation architecture for the Flutter client | Proposed |
| EIP-026 | Infrastructure & Deployment Implementation Architecture | Define implementation boundaries for infrastructure, environments and deployment | Proposed |
| EIP-027 | Engineering Repository & Workspace Architecture | Define the repository and engineering workspace boundaries | Proposed |
| EIP-028 | Observability, Auditability & Trust Implementation Architecture | Translate ADR-016 into implementation patterns for telemetry, accountability and trust | Proposed |
| EIP-029 | API & Contract Engineering | Define engineering patterns for governed API, event, data, integration, AI-tool and client contracts | Proposed |
| EIP-030 | Testing & Verification Architecture | Define implementation architecture for testing, verification, assurance and evidence | Proposed |
| EIP-031 | Release & Change Management Architecture | Govern how verified changes are promoted into controlled operational states | Proposed |
| EIP-032 | Incident Response & Recovery Architecture | Govern detection, containment, investigation, recovery and learning from material incidents | Proposed |
| EIP-033 | Business Continuity & Platform Resilience Implementation Architecture | Implement continuity, graceful degradation, failover, recovery integrity and resilient operations | Proposed |

## EIP-018 Integration Boundary

EIP-018 is the reusable pattern for resource-aware delivery orchestration. It composes existing routing, retry, idempotency, saga, tracing, human-escalation and external-partner patterns rather than replacing them.

It supports delivery jobs originating from:

- ordinary checkout;
- repeat purchase;
- AI-assisted replenishment;
- Essentials Subscriptions;
- and authorised partner-originated commerce.

It may evaluate:

- warehouse readiness;
- staff capacity;
- vehicle availability and capacity;
- driver availability;
- delivery windows;
- scheduled transport;
- partner transport;
- traffic;
- transfer constraints;
- cost;
- reliability;
- and ETA.

Provider-specific mapping and transport APIs remain behind EIP-017 where they cross an external boundary.

## EIP-019–EIP-033 Implementation Architecture Layer

EIP-019 through EIP-033 form the current implementation-architecture layer of the EIP corpus.

They establish the controlled progression from architectural intent to implementation, verification, release, incident response and resilient operational continuity:

```text
EDA / ADR
   ↓
EIP-019 Traceability
   ↓
EIP-020 Domain Map
   ↓
EIP-021 Backend / API
   ↓
EIP-022 Data
   ↓
EIP-023 Event Infrastructure
   ↓
EIP-024 AI Runtime
   ↓
EIP-025 Flutter Client
   ↓
EIP-026 Infrastructure / Deployment
   ↓
EIP-027 Repository / Workspace
   ↓
EIP-028 Observability / Audit / Trust
   ↓
EIP-029 API / Contract Engineering
   ↓
EIP-030 Testing / Verification
   ↓
EIP-031 Release / Change Management
   ↓
EIP-032 Incident Response / Recovery
   ↓
EIP-033 Business Continuity / Platform Resilience
   ↓
Code / Configuration / Tests / Evidence / Release / Recovery / Continuity
```

These EIPs do not replace the governing EDA or ADR decisions. They translate those decisions into implementation boundaries, reusable implementation architecture, verification evidence, controlled release practices, governed operational recovery and resilient continuity mechanisms.

## Governing Principles

1. Domain ownership remains authoritative. EIPs must not create shared-state ownership outside the responsible domain.
2. Events communicate facts; commands request actions; queries request information.
3. Receiving a message does not automatically grant authority to act.
4. Every integration path must have an identifiable producer, consumer, purpose, and security boundary.
5. Messages must support correlation, traceability, versioning, and safe evolution where applicable.
6. Consumers must tolerate duplicate delivery where the transport does not guarantee exactly-once processing.
7. Failure handling must be explicit rather than hidden inside application code.
8. Sensitive information must be minimised in messages and protected according to the security architecture.
9. External partners must integrate through explicit boundaries and capability-scoped contracts.
10. No individual external provider may become an architectural source of truth or unavoidable single point of failure.
11. EIPs must remain consistent with the ADR tree and undergo forward-consistency review when architectural decisions change.
12. Integration patterns should be used deliberately; not every interaction should be converted into asynchronous messaging.
13. New delivery capabilities must extend shared commerce and fulfilment infrastructure rather than create parallel delivery systems.
14. Implementation EIPs must not silently redefine the architecture they implement.
15. Material implementation controls must remain traceable through EIP-019.
16. Observability, auditability and trust controls must remain distinct but interconnected concerns.
17. Material architectural claims must have proportionate verification evidence through EIP-030.
18. Material verified changes must pass through governed release and change management through EIP-031.
19. Material incidents must pass through governed incident response and recovery through EIP-032.
20. Critical business capabilities must have proportionate continuity and resilience controls through EIP-033.

## EIP Lifecycle

Each EIP follows:

`Proposed → Accepted → Implemented → Deprecated → Superseded`

An EIP may remain Proposed while implementation decisions are still being validated. When implementation begins, its concrete technology must remain an implementation detail unless a separate ADR establishes that technology as an architectural decision.

## Related Architecture

Primary dependencies include:

- EDA-001 — Enterprise Data Architecture
- EDA-002 — External Partner Commerce, Distribution & Financial Integration
- EDA-003 — Household Subscription, Fulfilment & Multimodal Delivery Architecture
- EDA-001 Part 4 — Defensive Architecture Baseline
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-007 — AI Society Architecture
- ADR-008 — Intelligence Engine Architecture
- ADR-010 — Human-in-the-Loop Architecture
- ADR-013 — Flutter Client Architecture
- ADR-014 — Walk Mode / Living Digital Supermarket Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-018 — Deployment & Environment Strategy
- ADR-019 — External Partner Integration Architecture
- ADR-020 — Essentials Subscription & Multimodal Delivery Optimisation Architecture
