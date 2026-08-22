# ADR-020 — Essentials Subscription & Multimodal Delivery Optimisation Architecture

**Status:** Proposed  
**Date:** 2026-08-22  
**Decision Type:** Commerce, Fulfilment & Delivery Architecture  
**Parent Architecture:** EDA-003  
**Depends On:** ADR-002, ADR-003, ADR-004, ADR-005, ADR-007, ADR-008, ADR-010, ADR-014, ADR-016, ADR-017, ADR-019

## 1. Context

Essentials Mart requires a recurring household replenishment capability while preserving existing manual shopping, ordinary checkout, repeat purchase, AI Shopping Mode, fulfilment and delivery capabilities.

The capability must also support increasingly sophisticated delivery execution using Essentials Mart resources and authorised external transport resources, including shared routes, scheduled transport, personalised windows and express delivery.

The system therefore needs one architectural boundary that connects recurring demand to the existing commerce and delivery ecosystem without creating a parallel delivery platform.

## 2. Decision

Essentials Mart shall implement **Essentials Subscription & Multimodal Delivery Optimisation** as an extension of the existing commerce, household, fulfilment and delivery architecture.

The architecture establishes:

1. customer-configurable recurring subscriptions;
2. distinct handling of repeat purchase, AI replenishment and subscription intent;
3. convergence of all eligible demand sources on shared commerce and fulfilment services;
4. a shared Delivery Job abstraction;
5. a Delivery Orchestrator that evaluates operational resources and transport options;
6. resource-aware route and dispatch optimisation;
7. support for shared, scheduled, flexible, personalised, fast and express delivery modes;
8. authorised multimodal and scheduled-transport integration;
9. continuous but controlled re-optimisation;
10. customer authority over consequential subscription changes;
11. provider-neutral mapping and transport integration through the external partner boundary.

## 3. Non-Supersession Rule

This decision does not supersede or replace existing shopping, checkout, repeat purchase, AI Shopping Mode, fulfilment or delivery capabilities.

It extends them.

The architecture must preserve the distinction between:

- a customer choosing to repeat an historical purchase;
- an AI recommending replenishment;
- a customer creating a recurring subscription;
- and an ordinary one-time purchase.

These mechanisms may converge on the same order and fulfilment pipeline after their respective intent and authority have been established.

## 4. Subscription Authority

A subscription is an authorised recurring customer preference, not an AI-owned instruction.

AI may recommend creation or modification of a subscription. The required customer authority must be obtained before a consequential change is committed.

Operational optimisation may change the execution plan within the customer's agreed constraints, but it must not silently redefine the customer's commercial subscription.

## 5. Shared Delivery Architecture

All eligible delivery obligations shall converge on a common delivery pipeline:

```text
Demand Source
    ↓
Commerce / Subscription
    ↓
Fulfilment
    ↓
Delivery Job
    ↓
Delivery Orchestrator
    ↓
Resource + Transport Evaluation
    ↓
Route / Dispatch Plan
    ↓
Delivery
```

Subscription-specific delivery infrastructure is rejected.

## 6. Resource-Aware Optimisation

The Delivery Orchestrator shall evaluate operational feasibility using available resources, including where applicable:

- vehicle count;
- vehicle capacity and type;
- drivers;
- warehouse staff;
- picking and packing capacity;
- loading capacity;
- fulfilment readiness;
- transport partner capacity;
- delivery windows;
- traffic and network conditions;
- cost;
- reliability;
- and expected ETA.

The optimisation objective is the best feasible delivery plan, not merely the shortest geographical route.

## 7. Multimodal Transport

The delivery architecture shall support authorised combinations of:

- Essentials Mart fleet;
- contracted fleet;
- courier services;
- scheduled transport services;
- and other approved transport capabilities.

A delivery may use multiple transport stages where the necessary capacity, handoff, contractual and operational controls exist.

## 8. Scheduled Transport

Scheduled transport may be treated as a governed delivery resource when Essentials Mart has a valid integration and sufficient operational certainty.

A timetable alone does not establish usable delivery capacity.

The system must account for:

- schedule;
- capacity;
- route and stops;
- accepted goods;
- handoff points;
- restrictions;
- availability;
- reliability;
- cost;
- and contractual status.

## 9. ETA and Customer Commitments

ETA shall be calculated from the complete feasible delivery chain rather than road distance alone.

Where operational data permits, ETA confidence should be incorporated into transport selection and customer communication.

Customer delivery windows remain constraints. Optimisation must occur within the applicable promise unless an explicit exception workflow changes the promise.

## 10. Delivery Modes

The architecture shall support configurable delivery modes including:

- shared;
- scheduled;
- flexible;
- personalised;
- fast;
- express.

These are service expressions over the same underlying delivery capability and do not require independent delivery systems.

## 11. AI and Intelligence Boundaries

AI Society and Intelligence Engines may:

- detect replenishment opportunities;
- recommend subscriptions;
- recommend subscription changes;
- predict demand;
- evaluate delivery conditions;
- identify optimisation opportunities;
- and assist operational decisions.

They do not automatically gain authority to alter customer subscriptions or execute consequential actions merely because they can observe relevant events.

Deterministic operational engines remain responsible for enforcing hard constraints such as capacity, eligibility, time windows and authorised execution.

## 12. External Provider Boundary

Mapping, traffic, scheduled transport, courier and logistics providers shall be integrated through EDA-002 and ADR-019's provider-neutral external integration boundary.

No provider becomes an architectural source of truth merely because its data or service is consumed.

Provider replacement must not require redesign of the core subscription or delivery domains.

## 13. Event Integration

The architecture shall use the existing event-driven architecture and integration patterns for material state changes and asynchronous propagation.

Relevant events may include:

- SubscriptionCreated;
- SubscriptionUpdated;
- SubscriptionPaused;
- SubscriptionResumed;
- SubscriptionCancelled;
- DeliveryJobCreated;
- DeliveryPlanCreated;
- DeliveryPlanChanged;
- DeliveryDispatched;
- DeliveryCompleted;
- DeliveryExceptionRaised.

Events remain facts, commands remain requests for action, and queries remain requests for information.

## 14. Consequences

### Positive

- recurring demand can be introduced without replacing existing commerce;
- AI Shopping Mode and household intelligence can feed customer-controlled replenishment;
- one delivery system can serve multiple demand sources;
- route planning can account for real operational resources;
- external transport capacity can be incorporated where appropriate;
- recurring demand can improve route and inventory predictability;
- delivery products can evolve without creating separate backends;
- provider replacement remains possible.

### Trade-offs

- resource-aware optimisation is substantially more complex than simple shortest-path routing;
- multimodal delivery introduces transfer and handoff failure modes;
- subscription state requires careful lifecycle management;
- ETA becomes dependent on multiple operational systems;
- partner and scheduled-transport integrations require strong governance;
- continuous optimisation requires route-stability controls.

## 15. Rejected Alternatives

### Subscription-specific delivery platform

Rejected because it duplicates existing delivery capabilities and prevents efficient aggregation of ordinary and recurring demand.

### AI-controlled subscriptions

Rejected because recommendation and customer authority must remain distinct.

### Mapping-provider-controlled routing

Rejected because Essentials Mart must own its operational optimisation model and remain provider-neutral.

### Shortest-distance-only routing

Rejected because distance does not capture warehouse readiness, vehicle capacity, staff constraints, delivery windows, traffic, transfers or service commitments.

## 16. Dependencies

### EDA

- EDA-001 — Enterprise Data Architecture
- EDA-002 — External Partner Commerce, Distribution & Financial Integration
- EDA-003 — Household Subscription, Fulfilment & Multimodal Delivery Architecture

### ADR

- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-007 — AI Society Architecture
- ADR-008 — Intelligence Engine Architecture
- ADR-010 — Human-in-the-Loop Architecture
- ADR-014 — Walk Mode / Living Digital Supermarket Architecture
- ADR-016 — Observability, Auditability & Trust Architecture
- ADR-017 — Scalability & Multi-Store Architecture
- ADR-019 — External Partner Integration Architecture

### EIP

- EIP-013 — Saga Orchestration
- EIP-016 — Human-in-the-Loop Routing
- EIP-017 — External Partner Adapter / Gateway
- EIP-018 — Resource-Aware Multimodal Delivery Orchestration

## 17. Forward-Consistency Requirement

The following architecture records require review for compatibility with ADR-020:

- ADR-004 — delivery, scheduling and service boundaries;
- ADR-005 — subscription, household, order and delivery ownership;
- ADR-007 — AI Society participation in replenishment and delivery intelligence;
- ADR-008 — intelligence engines and optimisation responsibilities;
- ADR-010 — human approval and operational exception boundaries;
- ADR-014 — Walk Mode ordering and delivery interaction;
- ADR-016 — delivery and AI decision traceability;
- ADR-017 — multi-store and regional delivery scalability;
- ADR-019 — external transport and mapping provider boundary.

No parent decision is silently rewritten by this ADR. Controlled amendments or explicit compatibility records must be created where required.

## 18. Final Principle

> Essentials Mart shall treat subscription demand as an extension of household commerce and delivery as a shared, resource-aware, provider-neutral capability capable of selecting the best feasible fulfilment and transport plan for each delivery obligation.
