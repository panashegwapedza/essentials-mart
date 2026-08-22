# EIP-023 — Event Infrastructure Implementation Architecture

**Document ID:** EIP-023  
**Title:** Event Infrastructure Implementation Architecture  
**Status:** Proposed / Build Baseline  
**Parent:** EIP-019, EIP-020, EIP-021, EIP-022  
**Related:** EDA-001 Part 2, EDA-001 Part 4, ADR-003, ADR-016  
**Date:** 22 August 2026

## 1. Purpose

EIP-023 defines the implementation architecture for the governed event infrastructure of Essentials Mart.

It translates the enterprise event principles established by the architecture into concrete infrastructure responsibilities without prescribing a single vendor or forcing every interaction into asynchronous messaging.

The implementation must support the progression from a small deployment to a globally distributed enterprise while preserving event ownership, security, observability, resilience, replay safety and independent consumer evolution.

## 2. Constitutional Rule

> Events communicate governed facts that have occurred. They do not silently become commands, permissions or ownership transfers.

Synchronous APIs, commands, queries and asynchronous events remain distinct communication mechanisms.

NIST identifies publish-subscribe and event-bus patterns as appropriate for loosely coupled microservices collaboration and notes the need for authentication, secure communication, monitoring, resilience and throttling around distributed service communication. citeturn0search16turn0search0

## 3. Implementation Model

The event platform consists conceptually of:

```text
Domain / Service
      │
      ▼
Event Publisher
      │
      ▼
Publication Reliability Layer
      │
      ▼
Event Broker / Stream Platform
      │
 ┌────┼───────────────┐
 ▼    ▼               ▼
Bus  Streams       Integration
 │      │               │
 ▼      ▼               ▼
Consumers / Projections / External Adapters
```

The platform may be implemented using different technologies in different environments, provided the architectural guarantees remain intact.

## 4. Event Publication

A producer publishes an event only when the business occurrence represented by the event has reached the required valid state.

The implementation must prevent the following inconsistent states:

```text
Database committed
        ↓
Event lost
```

and:

```text
Event published
        ↓
Business transaction rolled back
```

Reliable publication may use a transactional outbox, durable event log, transactionally integrated broker or equivalent mechanism.

The exact mechanism is an implementation choice governed by the reliability requirements of the domain.

## 5. Event Broker and Stream Separation

Essentials Mart shall distinguish between:

### Event Bus

Used primarily for asynchronous propagation of meaningful business events to interested consumers.

### Event Stream

Used where ordered, durable, high-volume event histories are required for independent consumers, telemetry, analytical processing or replay.

### Integration Channel

Used to expose intentionally governed events to external organisations or partners.

These may share underlying infrastructure where appropriate, but their contracts, permissions, retention and operational characteristics remain distinct.

## 6. Event Envelope

The platform shall support the enterprise event envelope defined by EDA-001 Part 2 / Part 4.

Minimum conceptual fields include:

```text
eventId
eventType
eventVersion
occurredAt
publishedAt
producer
subject
tenant / organisation context
correlationId
causationId
traceId
schemaReference
classification
payload
```

Infrastructure may add transport metadata without changing the business meaning of the event.

## 7. Event Identity and Deduplication

Every event must have a globally unique event identifier.

Consumers must be capable of detecting duplicates using event identity and, where necessary, additional domain-specific idempotency keys.

The platform must not assume exactly-once delivery as a universal architectural guarantee.

The preferred baseline is reliable delivery combined with idempotent consumers.

## 8. Ordering

Global ordering must not be assumed.

Ordering shall be established only where business semantics require it.

Typical ordering scope may be:

```text
Customer ID
Order ID
Inventory Item / Location
Subscription ID
Delivery Run ID
```

Partitioning should favour the smallest useful business key that preserves required ordering while allowing horizontal scale.

## 9. Consumer Model

Consumers should be independently deployable and independently scalable where practical.

A producer must not depend on knowledge of the number, location or implementation of consumers.

Consumers must declare or otherwise be governed by:

- event subscriptions;
- required versions;
- classification permissions;
- processing guarantees;
- retry policy;
- replay behaviour;
- and ownership.

## 10. Consumer Idempotency

At-least-once delivery is an accepted operational model.

Consumers must therefore implement idempotent processing.

Example:

```text
RewardGranted
     ↓
Consumer
     ↓
Reward recorded

Same event again
     ↓
Duplicate detected
     ↓
No second reward
```

Irreversible side effects must have explicit idempotency protection.

## 11. Retry and Dead-Letter Architecture

Failed processing shall follow governed retry policies.

```text
Event
 ↓
Consumer
 ↓
Failure Classification
 ├── transient → retry
 ├── permanent → quarantine
 └── unknown → controlled investigation
                  ↓
             Dead Letter
                  ↓
             Correction
                  ↓
             Controlled Replay
```

Retries must be bounded and use appropriate backoff.

The infrastructure must expose retry and dead-letter metrics.

## 12. Replay Architecture

Where durable retention permits replay, replay must be explicit and authorised.

Replay is primarily intended to support:

- projection rebuilding;
- consumer recovery;
- historical analysis;
- controlled correction;
- onboarding of new consumers;
- investigation.

Replay must not automatically repeat irreversible effects such as:

- charging a customer;
- granting money;
- dispatching a duplicate order;
- sending uncontrolled external notifications;
- or executing an AI-authorised action again.

Side-effecting consumers must distinguish reconstruction from execution.

## 13. Schema Registry

The event platform should provide a governed schema registry or equivalent contract repository.

The registry should support:

- schema discovery;
- versioning;
- compatibility checks;
- ownership;
- classification;
- documentation;
- deprecation;
- validation.

Schema governance remains an enterprise architecture responsibility rather than merely a broker configuration.

## 14. Schema Evolution

Preferred changes are additive and backward-compatible.

Breaking changes require:

- explicit versioning;
- migration planning;
- compatibility testing;
- consumer communication;
- deprecation period;
- retirement controls.

Internal producer implementation changes do not automatically constitute event-version changes.

## 15. Event Security

The event platform shall enforce:

- authenticated producers;
- authenticated consumers;
- authorisation by event/topic/stream;
- encrypted transport;
- protected credentials;
- classification-aware routing;
- administrative access controls;
- replay authorisation;
- audit logging.

Service-to-service security must remain consistent with the API and service security architecture. NIST's microservices guidance identifies authentication, access management, secure communication, monitoring and resilience as core distributed-system security concerns. citeturn0search0turn0search1

## 16. Sensitive Event Handling

Sensitive information must not be broadcast unnecessarily.

Where possible:

```text
Event
 ↓
Stable identifier / governed reference
 ↓
Authorised retrieval
```

rather than distributing sensitive records to every consumer.

Event routing must respect tenant, organisation, store, region, country and environment boundaries.

## 17. AI Society Integration

AI agents and Intelligence Engines may consume governed events only through authorised subscriptions.

Event consumption does not grant action authority.

The pattern remains:

```text
Event
 ↓
Intelligence
 ↓
Recommendation
 ↓
Authorisation
 ↓
Action
```

AI-generated events must remain attributable to the originating agent, capability and execution context.

## 18. Analytics and Learning

The event platform shall support independent analytical and learning consumers without making analytics authoritative over transactional domains.

Examples include:

```text
PurchaseCompleted
      ↓
Analytics
      ↓
Learning
      ↓
Outcome / model insight
```

The authoritative business state remains with its owning domain.

## 19. Walk Mode

Walk Mode events may include high-volume behavioural and navigation signals.

The infrastructure must support differentiated retention and processing policies so that live navigation does not require indefinite storage of every telemetry signal.

Privacy, identity and consent controls remain mandatory.

## 20. Subscription and Delivery Events

The Essentials Subscription and delivery architecture may consume and publish events including:

- SubscriptionCreated;
- SubscriptionUpdated;
- SubscriptionPaused;
- SubscriptionCancelled;
- DeliveryRunPlanned;
- DeliveryRunDispatched;
- DeliveryCompleted;
- DeliveryFailed;
- ResourceAvailabilityChanged;
- VehicleCapacityChanged;
- RouteReplanned.

These events extend existing commerce and fulfilment capabilities rather than replacing them.

## 21. Partner Integration Events

External partners may access only explicitly approved integration events.

Internal events must not become externally visible merely because a partner integration exists.

Partner adapters should isolate:

- external schemas;
- credentials;
- retries;
- rate limits;
- provider-specific failures;
- and partner-specific semantics.

This preserves the provider-neutral integration architecture established elsewhere in Essentials Mart.

## 22. Notification Events

Notification consumers may subscribe to appropriate business events, but event publication does not automatically imply customer notification.

Notification policy determines:

- whether a notification is required;
- channel;
- consent;
- urgency;
- localisation;
- deduplication;
- and timing.

This prevents an event from accidentally becoming an uncontrolled notification trigger.

## 23. Backpressure

The platform must protect producers and critical consumers during load spikes.

Mechanisms may include:

- buffering;
- queueing;
- consumer scaling;
- partition scaling;
- priority handling;
- rate limiting;
- load shedding for non-critical telemetry.

Critical commerce events must not be starved by low-priority telemetry.

## 24. Event Priority

Priority may be assigned where operationally justified.

Conceptual levels:

```text
Critical
High
Normal
Low
Telemetry
```

Priority must not be used to bypass security, governance or schema controls.

## 25. Observability

The event platform shall expose sufficient telemetry to determine:

- publication rate;
- consumer lag;
- processing latency;
- retry volume;
- duplicate rate;
- dead-letter volume;
- schema failures;
- broker health;
- partition health;
- replay activity;
- dropped or rejected events;
- authentication failures;
- authorisation failures.

Distributed observability must connect event telemetry to the enterprise trace, correlation and causation identifiers.

## 26. Event Lineage

A material business outcome must be traceable through its event lineage where required.

```text
Action
 ↓
Event A
 ↓
Event B
 ↓
Projection
 ↓
Outcome
```

The implementation should allow operators and authorised investigators to reconstruct this chain without requiring access to unrelated domains.

## 27. Resilience

The event platform must avoid becoming an unnecessary single point of failure.

It should support, according to deployment requirements:

- replication;
- durable storage;
- broker failover;
- regional resilience;
- partition recovery;
- consumer recovery;
- deferred publication;
- controlled replay.

NIST identifies availability and resilience mechanisms such as load balancing, circuit breaking and throttling as important concerns in distributed microservice architectures. citeturn0search0

## 28. Store and Edge Resilience

Where store operations require continuity during temporary central infrastructure disruption, the implementation may support local or deferred event handling.

```text
Central Event Infrastructure unavailable
             ↓
Store operation continues where authorised
             ↓
Local / Deferred records
             ↓
Reconnection
             ↓
Controlled synchronisation
```

Conflict resolution must preserve domain authority and must not silently overwrite authoritative state.

## 29. Global Event Architecture

Global deployment shall support:

- regional brokers or processing domains where required;
- data residency constraints;
- controlled cross-region replication;
- regional failure isolation;
- global event routing only where justified;
- local autonomy for appropriate operations.

A single global event infrastructure component must not automatically become a global failure domain.

## 30. Event Processing Security

Event processing code is part of the enterprise attack surface.

Consumers and processors must be protected against:

- malicious payloads;
- schema abuse;
- event injection;
- replay abuse;
- oversized messages;
- malformed events;
- subscription abuse;
- privilege escalation;
- event-chain manipulation.

The controls must integrate with the Part 4 defensive architecture.

## 31. Event Storm Prevention

Circular event chains must be prevented or explicitly governed.

```text
A → B → C → A
```

The platform should support detection of abnormal event amplification, excessive fan-out and unexpected recursive publication.

## 32. Delivery Guarantees

Delivery guarantees must be defined per event class rather than globally assumed.

Possible requirements include:

- best effort;
- at least once;
- durable delivery;
- ordered delivery within a partition;
- replayable delivery.

Exactly-once processing must not be treated as a substitute for consumer idempotency.

## 33. Retention

Event retention must be purpose-driven.

Retention decisions consider:

- replay requirements;
- analytics value;
- operational recovery;
- legal requirements;
- privacy;
- classification;
- storage cost.

High-volume telemetry may have shorter retention than critical business events.

## 34. Infrastructure as Code and Policy as Code

Event infrastructure should be provisioned and governed through controlled infrastructure and policy definitions where practical.

This includes:

- topics / streams;
- access policies;
- retention policies;
- routing rules;
- schema compatibility rules;
- encryption configuration;
- monitoring;
- alerting.

NIST's DevSecOps guidance identifies infrastructure-as-code, policy-as-code and observability-as-code as distinct implementation concerns in cloud-native systems. citeturn0search6

## 35. Deployment and Change Management

Changes to event infrastructure must pass:

- architecture traceability;
- schema compatibility checks;
- security validation;
- resilience testing;
- capacity evaluation;
- rollback planning.

Infrastructure changes must not silently change the semantic meaning of enterprise events.

## 36. Testing

The event infrastructure shall support testing for:

- publication reliability;
- duplicate delivery;
- ordering;
- schema compatibility;
- replay;
- retry;
- dead-letter handling;
- malformed events;
- event injection;
- access control;
- broker failure;
- consumer failure;
- regional failure;
- backpressure;
- event storms;
- recovery.

## 37. Implementation Readiness

Implementation of an event contract is not considered ready until:

- owner is known;
- event semantics are documented;
- schema exists;
- classification is defined;
- producer is known;
- consumers are known or intentionally open;
- delivery guarantee is defined;
- ordering requirement is defined;
- retry policy is defined;
- replay policy is defined;
- retention is defined;
- security policy is defined;
- observability is defined;
- contract tests exist.

## 38. Relationship With EIP-019

EIP-023 implements the event infrastructure portion of the architecture-to-implementation traceability baseline.

Every infrastructure component and event contract must trace back to:

```text
Business Requirement
 ↓
EDA / ADR
 ↓
EIP
 ↓
Event Contract
 ↓
Infrastructure
 ↓
Tests
 ↓
Evidence
```

## 39. Relationship With EIP-020

EIP-020 defines domain and bounded-context ownership.

EIP-023 ensures events preserve that ownership.

Publishing an event does not transfer ownership of the underlying entity or business fact.

## 40. Relationship With EIP-021

EIP-021 defines backend service boundaries and communication patterns.

EIP-023 provides the implementation infrastructure for asynchronous communication where events are appropriate.

It does not replace synchronous APIs where immediate responses or strong consistency are required.

## 41. Relationship With EIP-022

EIP-022 defines data ownership and persistence boundaries.

Events provide controlled propagation of business facts without creating shared-database coupling.

Consumers may build projections or read models, but projections do not become authoritative merely because they consume an event.

## 42. Relationship With Part 4 Defensive Architecture

EIP-023 inherits the defensive requirements established by EDA-001 Part 4, including:

- authenticated producers and consumers;
- event abuse detection;
- resilience;
- incident response;
- adversarial testing;
- IP protection;
- governance;
- assurance;
- traceability.

Event infrastructure therefore forms part of the enterprise defensive boundary.

## 43. Vendor Neutrality

No specific broker, stream platform, schema registry or cloud provider is constitutionally mandated by this EIP.

Technology selection must be evaluated against:

- throughput;
- latency;
- durability;
- ordering;
- replay;
- availability;
- regional deployment;
- operational complexity;
- security;
- cost;
- ecosystem compatibility;
- portability.

## 44. Architectural Laws

1. Events represent governed facts.
2. Event infrastructure does not replace synchronous communication where synchronous interaction is required.
3. Event ownership follows domain ownership.
4. Events do not transfer domain ownership.
5. Every governed event has a unique identity.
6. Consumers must be idempotent.
7. Global ordering must not be assumed.
8. Ordering must be scoped to business requirements.
9. Event publication must be reliable where business state and event truth must remain consistent.
10. Failed events must not disappear silently.
11. Retries must be bounded.
12. Replay must not unintentionally repeat irreversible side effects.
13. Sensitive information must not be unnecessarily broadcast.
14. Event subscriptions require authorization.
15. Consuming an event does not grant authority to act.
16. Event schemas must be governed.
17. Schema evolution must be controlled.
18. Event infrastructure must be observable.
19. Event lineage must be traceable where material.
20. Event infrastructure must be resilient.
21. Circular event chains must be prevented or governed.
22. Event retention must be purpose-driven.
23. External partners receive only governed integration events.
24. AI agents consume only authorised event streams.
25. Event infrastructure must remain vendor-neutral at the architectural level.
26. Event infrastructure implementation must remain traceable to the enterprise architecture.

## 45. Final Principle

> Essentials Mart shall use event infrastructure as a governed, resilient and observable connective layer that allows domains, intelligence, analytics, learning and integrations to react independently to meaningful enterprise occurrences without creating hidden ownership, security or data-coupling dependencies.
