# ADR-020 — Forward-Consistency Check

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent:** ADR-020 — Essentials Subscription & Multimodal Delivery Optimisation Architecture

## 1. Purpose

This record verifies the direct and secondary architectural impacts of ADR-020 before the decision is treated as complete.

## 2. Directly Affected Decisions

### ADR-004 — API & Service Architecture

**Impact:** Delivery jobs, subscription services, fulfilment services and route/dispatch capabilities require clear service boundaries and API contracts.

**Required action:** Confirm that Delivery Job and orchestration interfaces are shared across demand sources rather than subscription-specific APIs.

### ADR-005 — Data Ownership & Database Boundaries

**Impact:** Subscription state, household replenishment state, delivery jobs, route plans and resource availability require distinct ownership boundaries.

**Required action:** Preserve authoritative ownership: subscription/household, order, inventory, fulfilment and delivery remain separate authorities.

### ADR-007 — AI Society Architecture

**Impact:** AI Society components may detect replenishment opportunities and assist subscription and delivery decisions.

**Required action:** AI recommendations remain distinct from customer authority and deterministic operational constraint enforcement.

### ADR-008 — Intelligence Engine Architecture

**Impact:** Delivery intelligence and demand/replenishment intelligence may become material intelligence capabilities.

**Required action:** Separate intelligence/recommendation from deterministic execution engines.

### ADR-010 — Human-in-the-Loop Architecture

**Impact:** Certain delivery exceptions, partner failures and consequential operational actions may require human authority.

**Required action:** EIP-016 remains the governing human-escalation pattern.

### ADR-014 — Walk Mode / Living Digital Supermarket Architecture

**Impact:** Walk Mode may create orders and delivery obligations that enter the shared delivery pipeline.

**Required action:** Walk Mode must not create a parallel delivery subsystem.

### ADR-016 — Observability, Auditability & Trust Architecture

**Impact:** Subscription decisions, AI recommendations, route plans, dispatch decisions, resource allocation and material re-optimisation require traceability.

**Required action:** Preserve decision and operational lineage.

### ADR-017 — Scalability & Multi-Store Architecture

**Impact:** Subscription demand and multimodal delivery must scale across stores, regions and countries.

**Required action:** Avoid centralised single-region assumptions and support regional resource and transport models.

### ADR-019 — External Partner Integration Architecture

**Impact:** Scheduled transport, courier, mapping and traffic providers become potential delivery capabilities.

**Required action:** Integrate them only through the existing provider-neutral boundary and replaceable adapter model.

## 3. Existing EIP Compatibility

ADR-020 and EDA-003 compose with, rather than replace:

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

## 4. Secondary Impacts

Potential secondary effects include:

- notification workflows for subscription and delivery status;
- WhatsApp delivery and replenishment notifications where authorised;
- analytics and learning based on subscription outcomes and delivery performance;
- privacy controls for household consumption data;
- pricing and commercial rules for delivery modes;
- multi-store inventory allocation;
- deployment and regional transport integrations.

These are extensions of existing boundaries rather than new ownership transfers.

## 5. Non-Supersession Verification

ADR-020 does not supersede:

- manual shopping;
- ordinary checkout;
- repeat purchase;
- AI Shopping Mode;
- existing fulfilment;
- existing delivery;
- Walk Mode;
- external partner integration.

It creates a shared convergence and optimisation layer.

## 6. Security Verification

Delivery orchestration must remain subject to existing authentication, authorisation, abuse prevention, partner security, rate limiting, auditability and defensive-engineering controls.

No new delivery capability creates authority merely by subscribing to an event or receiving operational data.

## 7. Completion Criteria

The forward-consistency check is considered complete when:

1. ADR-004, ADR-005, ADR-007, ADR-008, ADR-010, ADR-014, ADR-016, ADR-017 and ADR-019 have either been amended or explicitly verified as compatible.
2. EIP-018 is indexed.
3. EDA-003 is indexed.
4. Delivery and subscription ownership remains explicit.
5. Existing customer capabilities remain intact.
6. External transport providers remain replaceable.
7. No new architecture record creates an unnecessary duplicate delivery system.
