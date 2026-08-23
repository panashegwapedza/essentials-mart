# EIP-018 — Resource-Aware Multimodal Delivery Orchestration

**Status:** Proposed  
**Date:** 2026-08-22  
**Pattern Type:** Message Routing / Orchestration / Resource-Aware Delivery

## 1. Purpose

EIP-018 defines the reusable integration pattern used to transform delivery jobs into an operationally feasible delivery plan using current resources, constraints and available transport capabilities.

The pattern is shared by ordinary orders, repeat purchases, AI-assisted replenishment, subscriptions and authorised partner-originated orders.

## 2. Problem

A simple route calculation does not determine whether Essentials Mart can actually fulfil a delivery plan.

The delivery system must account for:

- warehouse readiness;
- staff availability;
- vehicle availability;
- vehicle capacity;
- driver availability;
- transport partner capacity;
- delivery windows;
- traffic;
- scheduled departures;
- transfer constraints;
- cost;
- reliability;
- and ETA.

## 3. Pattern

```text
Delivery Jobs
     ↓
Resource / Capability Registry
     ↓
Constraint Evaluation
     ↓
Transport Candidate Generation
     ↓
Route / Dispatch Optimisation
     ↓
Feasible Delivery Plan
     ↓
Dispatch
```

The pattern separates **delivery demand** from **transport execution**.

## 4. Delivery Job

A delivery job represents an operational obligation to deliver an accepted fulfilment outcome.

It may contain or reference:

- order identity;
- fulfilment state;
- destination;
- delivery window;
- package characteristics;
- service level;
- customer constraints;
- priority;
- and required capabilities.

The delivery job does not itself prescribe a specific vehicle or route unless a higher-level policy explicitly requires one.

## 5. Resource Registry

The orchestration layer evaluates resources such as:

- owned vehicles;
- contracted vehicles;
- drivers;
- warehouse teams;
- loading capacity;
- courier services;
- scheduled transport services;
- transfer hubs;
- and other approved delivery capabilities.

Resource state must be time-aware because availability and capacity change during operations.

## 6. Transport Candidate Generation

For each delivery job, the system may generate feasible candidates such as:

- dedicated own-fleet delivery;
- shared own-fleet route;
- partner courier;
- scheduled transport;
- multimodal combination;
- express resource.

Infeasible candidates must be eliminated before optimisation.

## 7. Optimisation Objective

The optimiser should select the best feasible plan according to applicable business policy.

Possible objectives include:

- lowest feasible ETA;
- on-time delivery probability;
- lowest operational cost;
- vehicle utilisation;
- route efficiency;
- resource balancing;
- and customer service level.

Shortest geographic distance alone is not the optimisation objective.

## 8. Scheduled Transport

Scheduled transport is represented as a time-dependent transport capability.

The capability may expose:

- route;
- departure time;
- arrival estimate;
- stops;
- capacity;
- accepted goods;
- handoff points;
- cost;
- reliability;
- and operational availability.

A scheduled service can only be selected when its capacity and contractual/operational status are valid.

## 9. Multimodal Handoffs

The pattern permits multiple transport stages:

```text
Stage 1 → Transfer → Stage 2 → Transfer → Stage 3
```

Each handoff must have an explicit owner, location, timing constraint and failure strategy.

## 10. ETA Calculation

ETA should incorporate all material stages:

```text
Preparation
+ queue / dispatch delay
+ scheduled waiting
+ travel
+ transfer
+ last mile
+ expected delay
```

ETA must be recalculated when material operational conditions change.

## 11. Re-optimisation

The orchestrator may recalculate a plan when material changes occur, including:

- vehicle failure;
- capacity change;
- driver unavailability;
- warehouse delay;
- traffic disruption;
- scheduled transport cancellation;
- new urgent demand;
- cancellation;
- inventory failure;
- or ETA degradation.

Re-optimisation must use route-stability controls to prevent unnecessary operational churn.

## 12. Shared Delivery

Multiple compatible delivery jobs may be consolidated into one route or transport plan where this improves the applicable objective without violating customer or product constraints.

## 13. Integration Patterns

EIP-018 composes with existing patterns rather than replacing them:

- EIP-006 — Message Router;
- EIP-007 — Content-Based Router;
- EIP-008 — Recipient List;
- EIP-009 — Dead Letter Channel;
- EIP-010 — Retry and Redelivery;
- EIP-011 — Idempotent Consumer;
- EIP-013 — Saga Orchestration;
- EIP-015 — Correlation and Distributed Tracing;
- EIP-016 — Human-in-the-Loop Routing;
- EIP-017 — External Partner Adapter / Gateway.

## 14. Human Authority

The orchestration engine may recommend or calculate plans automatically.

Human approval remains required where policy classifies a delivery action as consequential and outside pre-authorised operational autonomy.

EIP-018 therefore complements EIP-016 rather than replacing it.

## 15. External Provider Isolation

Mapping, traffic and transport providers are integrated through canonical capabilities and provider adapters.

Provider-specific schemas, authentication, route APIs and terminology must not leak into the core delivery job contract.

## 16. Failure Handling

The pattern must support controlled failure states including:

- no feasible route;
- insufficient capacity;
- unavailable transport resource;
- missed scheduled departure;
- failed handoff;
- degraded ETA;
- partner outage;
- and delivery exception.

Failure must produce an observable state and invoke the applicable retry, rerouting, escalation or customer-communication workflow.

## 17. Idempotency and Correlation

Delivery-plan creation, dispatch and re-optimisation must support correlation identifiers and idempotent handling where duplicate messages or retries are possible.

A plan identifier should allow the system to distinguish a new operational plan from a repeated delivery of the same command or event.

## 18. Observability

The pattern should expose sufficient information to reconstruct:

- why a delivery mode was selected;
- which resources were considered;
- which constraints excluded alternatives;
- which route was selected;
- which ETA was calculated;
- what changed during re-optimisation;
- and what ultimately happened.

## 19. Architectural Boundaries

EIP-018 does not own:

- product catalogue truth;
- inventory truth;
- order truth;
- customer identity;
- subscription truth;
- payment truth;
- or partner commercial contracts.

It orchestrates execution against authoritative capabilities owned elsewhere.

## 20. Relationship to EDA-003 and ADR-020

EDA-003 defines the enterprise capability and boundaries.

ADR-020 records the architectural decision to adopt subscription extension and shared multimodal delivery optimisation.

EIP-018 defines the reusable integration mechanism used to operationalise those decisions.

The three records therefore remain distinct:

```text
EDA-003
What the enterprise capability is
        ↓
ADR-020
Why the architecture adopts it
        ↓
EIP-018
How the integration pattern coordinates it
```
