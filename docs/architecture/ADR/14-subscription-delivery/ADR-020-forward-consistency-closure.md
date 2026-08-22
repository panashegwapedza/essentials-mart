# ADR-020 — Forward-Consistency Closure Record

**Parent Decision:** ADR-020 — Essentials Subscription & Multimodal Delivery Optimisation Architecture
**EDA:** EDA-003 — Household Subscription, Fulfilment & Multimodal Delivery Architecture
**EIP:** EIP-018 — Resource-Aware Multimodal Delivery Orchestration
**Status:** Closed
**Date:** 22 August 2026

## 1. Purpose

This record closes the forward-consistency review for ADR-020 after its supporting amendments were added to the affected architecture records.

The review confirms that the subscription and multimodal delivery capability extends existing Essentials Mart capabilities rather than replacing or creating parallel versions of them.

## 2. Capability Boundary

ADR-020 introduces two related capabilities:

1. customer-configurable Essentials Subscriptions; and
2. a shared resource-aware multimodal delivery optimisation capability.

Subscriptions are a source of delivery demand. They do not own the delivery platform.

The delivery optimisation capability is shared by:

- ordinary checkout;
- repeat purchase;
- AI-assisted replenishment;
- Essentials Subscriptions;
- and authorised partner-originated commerce.

## 3. Intent Separation

The architecture preserves the distinction between:

- one-time purchase;
- repeat purchase from historical receipts;
- AI replenishment recommendation; and
- recurring subscription instruction.

These capabilities may converge on the same order, fulfilment and delivery infrastructure, but they retain distinct customer intent and authority boundaries.

## 4. Delivery Boundary

All delivery demand converges on the governed delivery pipeline:

```text
Demand Source
    ↓
Order
    ↓
Fulfilment
    ↓
Delivery Job
    ↓
Delivery Orchestrator
    ↓
Resource / Transport Evaluation
    ↓
Route & Dispatch Plan
    ↓
Delivery
```

No parallel subscription-specific delivery system is created.

## 5. Resource-Aware Optimisation

The delivery optimisation capability may evaluate:

- warehouse readiness;
- available warehouse personnel;
- picking, packing and loading capacity;
- available vehicles;
- vehicle capacity and capability;
- driver availability;
- current vehicle location and load;
- delivery demand;
- customer delivery windows;
- traffic and network conditions;
- scheduled transport;
- authorised partner transport;
- transfer constraints;
- cost;
- reliability; and
- projected ETA.

A route is not considered optimal merely because it is geographically shortest. It must be operationally feasible against the resources and constraints available at the relevant time.

## 6. Multimodal Delivery

The architecture permits the delivery orchestrator to select among authorised transport capabilities, including:

- Essentials Mart fleet;
- contracted delivery fleets;
- scheduled transport services where legally and commercially permitted;
- shared delivery routes;
- personalised delivery;
- fast delivery; and
- express delivery.

Future transport capabilities may be added through governed partner or platform boundaries without changing the subscription model.

Provider-specific integrations remain behind the external partner boundary defined by ADR-019 and EIP-017.

## 7. Scheduled Transport

Scheduled transport is treated as a transport resource rather than as an assumed capability of every passenger service.

A scheduled service may be considered only when Essentials Mart has an authorised operational relationship or other valid contractual basis for using that service for deliveries.

Relevant information may include:

- route;
- timetable;
- departure and arrival estimates;
- capacity;
- accepted goods;
- restrictions;
- handoff points;
- cost;
- and reliability.

The system must not expose an unavailable or uncontracted scheduled service as a guaranteed delivery option.

## 8. AI Boundary

AI Shopping Mode and Intelligence Engines may observe household patterns, identify replenishment opportunities and recommend subscription changes.

They do not silently create, modify or cancel customer subscriptions or consequential delivery actions without the authority required by the existing AI and human-control architecture.

AI recommendation remains distinct from authorised execution.

## 9. Affected Architecture Records

The following amendments were reviewed as part of closure:

- ADR-004 Amendment 002 — Subscription & Multimodal Delivery Orchestration
- ADR-005 Amendment 002 — Subscription & Delivery Data Boundaries
- ADR-007 Amendment 001 — Subscription & Delivery AI Participation
- ADR-008 Amendment 001 — Resource-Aware Delivery Intelligence
- ADR-010 Amendment 001 — Subscription & Delivery Human Control
- ADR-014 Amendment 001 — Walk Mode Shared Delivery Pipeline
- ADR-016 Amendment 001 — Subscription & Delivery Observability
- ADR-017 Amendment 001 — Subscription & Multimodal Delivery Scalability
- ADR-019 Amendment 001 — Scheduled Transport & Delivery Capabilities

## 10. Secondary Impact Review

The review confirms that ADR-020 does not require a new domain-specific payment architecture, identity architecture, notification architecture or independent fulfilment architecture.

Existing governed capabilities remain authoritative and are reused.

The architecture therefore avoids unnecessary duplication while preserving the ability to introduce new delivery modes and transport partners.

## 11. EIP Consistency

EIP-018 remains the reusable orchestration pattern for converting delivery jobs into feasible resource- and transport-aware delivery plans.

EIP-018 composes existing patterns including:

- Message Router;
- Content-Based Router;
- Saga Orchestration;
- Retry and Redelivery;
- Idempotent Consumer;
- Correlation and Distributed Tracing;
- Human-in-the-Loop Routing; and
- External Partner Adapter / Gateway.

It does not replace those patterns.

## 12. EDA Consistency

EDA-003 remains an extension of the existing enterprise architecture.

It does not redefine:

- domain ownership;
- event semantics;
- information ownership;
- AI authority;
- external partner boundaries;
- or existing commerce and fulfilment responsibilities.

## 13. Closure Determination

The forward-consistency review is **CLOSED**.

No unresolved architectural contradiction was identified within the scope of ADR-020.

Future changes to subscription behaviour, transport capabilities, routing algorithms, partner contracts or customer delivery guarantees must undergo a new architectural impact review where they materially change these boundaries.

## 14. Architectural Principle Preserved

> New delivery capabilities extend shared Essentials Mart commerce, fulfilment and delivery infrastructure; they do not create competing parallel systems or silently replace existing customer capabilities.
