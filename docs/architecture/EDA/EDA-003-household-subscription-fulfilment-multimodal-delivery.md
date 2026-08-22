# EDA-003 — Household Subscription, Fulfilment & Multimodal Delivery Architecture

**Status:** Proposed  
**Date:** 2026-08-22  
**Decision Scope:** Household commerce, recurring demand, fulfilment and delivery orchestration

## 1. Purpose

EDA-003 defines the enterprise architecture for customer-configurable Essentials Subscriptions and the shared fulfilment and multimodal delivery capability that serves subscription demand and ordinary commerce demand.

This architecture is an extension of existing Essentials Mart capabilities. It does not replace manual shopping, normal checkout, repeat purchase, AI Shopping Mode, existing fulfilment, or existing delivery services.

## 2. Core Principle

> Subscription defines recurring customer demand; checkout defines an individual purchase; fulfilment creates delivery obligations; the shared delivery orchestration capability determines how those obligations are executed.

## 3. Distinct Demand Mechanisms

Essentials Mart shall preserve the distinction between:

- ordinary shopping and checkout;
- repeat purchase from historical receipts;
- AI replenishment recommendations based on household/pantry intelligence;
- customer-created subscriptions;
- partner-originated commerce journeys.

These mechanisms may converge on common commerce and fulfilment services, but their customer intent and authority remain distinct.

## 4. Essentials Subscription

Customers may create recurring supply arrangements from eligible products and tailor:

- products;
- quantities;
- recurrence;
- selected days;
- delivery windows;
- pauses;
- skips;
- modifications;
- cancellations;
- and other governed preferences.

The application calculates the expected subscription cost from the selected configuration and applicable pricing rules.

Subscriptions must not silently change because AI, inventory, routing or operational conditions change. Material changes require the appropriate customer decision or governed exception workflow.

## 5. AI Shopping Integration

AI Shopping Mode may use household state, pantry information, purchase history and receipts to identify potential replenishment needs.

AI may recommend a subscription where recurring consumption is evident, but recommendation does not create or modify a subscription without the required customer authority.

The system may also recommend changes to an existing subscription, subject to customer control and applicable governance.

## 6. Shared Commerce Convergence

The architecture converges distinct demand sources only after preserving their semantics:

```text
Manual Shopping ──────┐
Repeat Purchase ──────┤
AI Recommendation ────┤
Subscription ─────────┤
Partner Order ────────┤
                      ▼
                   CHECKOUT
                      │
                      ▼
                  FULFILMENT
                      │
                      ▼
                 DELIVERY JOB
```

No demand mechanism owns the downstream delivery system by itself.

## 7. Delivery Orchestration

All eligible delivery jobs enter a shared Delivery Orchestrator.

The orchestrator evaluates available operational resources and feasible transport options rather than creating subscription-specific delivery infrastructure.

Potential delivery modes include:

- shared delivery;
- scheduled delivery;
- flexible delivery;
- personalised delivery windows;
- fast delivery;
- express delivery.

The exact customer-facing names may evolve without changing the architectural boundary.

## 8. Resource-Aware Optimisation

Delivery planning shall consider, where applicable:

- number of available vehicles;
- vehicle capacity;
- vehicle type and capability;
- driver availability;
- warehouse staff availability;
- picking capacity;
- packing capacity;
- loading capacity;
- fulfilment readiness;
- delivery demand;
- customer delivery windows;
- traffic and travel conditions;
- route constraints;
- operational cost;
- reliability;
- and expected ETA.

A geographically shortest route is not necessarily the optimal route. A delivery plan is optimal only when it is operationally feasible within the resources and commitments applicable at the time.

## 9. ETA

Customer ETA must account for the complete operational chain where relevant:

```text
Fulfilment readiness
      + dispatch delay
      + transport waiting time
      + travel time
      + transfer time
      + last-mile time
      + expected operational delay
      = customer ETA
```

ETA confidence and operational reliability should be considered where sufficient data exists.

## 10. Multimodal Delivery

The delivery architecture shall permit authorised use of multiple transport resources, including:

- Essentials Mart-owned vehicles;
- contracted delivery fleets;
- courier partners;
- scheduled transport services;
- other approved logistics or transport capabilities.

A delivery may use more than one mode when supported by the relevant contracts, capacity, handoff controls and operational constraints.

Example:

```text
Warehouse
   ↓
Essentials Vehicle
   ↓
Transfer Hub
   ↓
Scheduled Transport
   ↓
Neighbourhood Handoff
   ↓
Local Delivery
   ↓
Customer
```

## 11. Scheduled Transport Integration

Scheduled transport may be represented as a governed transport resource with attributes such as:

- route;
- departure schedule;
- stops or handoff points;
- available capacity;
- accepted goods;
- restrictions;
- cost;
- expected travel time;
- reliability;
- and operational availability.

A scheduled service must not be treated as available merely because a timetable exists. Capacity, contractual availability, legal restrictions, handoff capability and current operational status must be validated.

No external transport provider becomes an architectural dependency merely by being integrated.

## 12. Shared Delivery

Compatible delivery jobs may be consolidated where this improves cost, utilisation or network efficiency without violating customer commitments, product constraints or service guarantees.

Recurring subscriptions may create predictable demand density that improves route planning, inventory preparation and resource utilisation.

## 13. Continuous Re-optimisation

Delivery plans may be recalculated when material conditions change, including:

- vehicle failure;
- staff shortage;
- traffic disruption;
- new delivery demand;
- cancellation;
- inventory failure;
- partner transport unavailability;
- or material ETA degradation.

Re-optimisation must be controlled so that operational stability is not sacrificed through unnecessary route churn.

## 14. Customer Authority

AI and optimisation engines may recommend, calculate and optimise, but they must not silently override customer commitments or create consequential subscription changes without appropriate authority.

The system must preserve the distinction between:

```text
Recommendation → Customer decision → Authorised change
```

and:

```text
Optimisation → Operational execution
```

## 15. External Provider Independence

Mapping, traffic, scheduled transport, courier and logistics providers must be integrated through the external partner architecture established by EDA-002 and ADR-019.

Provider-specific contracts and APIs must remain behind replaceable adapters.

The routing and delivery intelligence owned by Essentials Mart must not become synonymous with any individual mapping or transport provider.

## 16. Event Integration

Material lifecycle changes should integrate with the enterprise event architecture, including events such as:

- SubscriptionCreated;
- SubscriptionUpdated;
- SubscriptionPaused;
- SubscriptionResumed;
- SubscriptionCancelled;
- ReplenishmentRecommended;
- ReplenishmentAccepted;
- DeliveryJobCreated;
- DeliveryPlanCreated;
- DeliveryPlanChanged;
- DeliveryDispatched;
- DeliveryCompleted;
- DeliveryExceptionRaised.

Events communicate facts. Commands request actions. Queries request information.

## 17. Source of Truth

Customer subscription state remains authoritative within the responsible commerce/household domain.

Order state remains authoritative within commerce.

Inventory remains authoritative within inventory domains.

Fulfilment state remains authoritative within fulfilment.

Delivery state remains authoritative within delivery operations.

Route plans are operational plans and do not replace order, inventory or fulfilment truth.

## 18. Resilience and Exceptions

The architecture shall support governed handling of:

- unavailable products;
- failed payment;
- failed fulfilment;
- vehicle failure;
- driver unavailability;
- warehouse capacity constraints;
- partner outage;
- missed delivery;
- route disruption;
- scheduled transport cancellation;
- and customer unavailability.

Exceptions must not silently corrupt subscription state or historical order truth.

## 19. Architectural Dependencies

Primary dependencies include:

- EDA-001 — Enterprise Data Architecture;
- EDA-002 — External Partner Commerce, Distribution & Financial Integration;
- ADR-002 — Domain-Driven Enterprise Architecture;
- ADR-003 — Event-Driven Architecture;
- ADR-004 — API & Service Architecture;
- ADR-005 — Data Ownership & Database Boundaries;
- ADR-007 — AI Society Architecture;
- ADR-008 — Intelligence Engine Architecture;
- ADR-010 — Human-in-the-Loop Architecture;
- ADR-014 — Walk Mode / Living Digital Supermarket Architecture;
- ADR-016 — Observability, Auditability & Trust;
- ADR-017 — Scalability & Multi-Store Architecture;
- ADR-019 — External Partner Integration Architecture;
- EIP-013 — Saga Orchestration;
- EIP-016 — Human-in-the-Loop Routing;
- EIP-017 — External Partner Adapter / Gateway;
- EIP-018 — Resource-Aware Multimodal Delivery Orchestration.

## 20. Architectural Outcome

EDA-003 establishes a shared delivery capability in which subscription demand, ordinary orders, repeat purchases, AI-assisted replenishment and partner-originated orders can converge on a common fulfilment and delivery pipeline without losing their distinct semantics.

The resulting model is:

```text
Customer / AI / Partner Demand
            ↓
        Commerce
            ↓
        Fulfilment
            ↓
       Delivery Job
            ↓
 Delivery Orchestrator
            ↓
Resource + Transport Evaluation
            ↓
Route / Dispatch Optimisation
            ↓
         Delivery
            ↓
     Receipt / Outcome
            ↓
   Household Intelligence
```

The architecture therefore extends the existing Essentials Mart ecosystem rather than creating a parallel commerce or delivery platform.
