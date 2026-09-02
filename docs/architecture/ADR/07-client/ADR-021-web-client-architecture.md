# ADR-021 — Web Client Architecture

**Status:** Proposed
**Date:** 2026-09-02
**Decision Type:** Client Architecture
**Parent Architecture:** EDA-001
**Related ADRs:** ADR-001, ADR-004, ADR-005, ADR-006, ADR-015, ADR-016
**Related EIPs:** EIP-019, EIP-021, EIP-022, EIP-025, EIP-027

## 1. Context

Essentials Mart is being implemented as a modular enterprise platform with multiple client surfaces. The existing Flutter client remains an important future client surface, but implementation will proceed web-first so that the broader Essentials Mart platform can be built and validated from an accessible browser experience before returning to advanced client experiences.

The web client must not become a second enterprise architecture. It is an interaction layer over governed backend capabilities.

## 2. Decision

Essentials Mart will establish a dedicated customer web client within the modular monorepo using a TypeScript-based web application architecture.

The initial implementation technology is React with TypeScript and Vite.

The web client will consume governed backend APIs through an explicit client API boundary. It will not own authoritative product, pricing, inventory, basket, payment, order, fulfilment, trust or AI decisions.

## 3. Architectural Boundary

```text
Customer Web UI
      ↓
Web Application State
      ↓
Web API Client
      ↓
Governed API Edge
      ↓
Owned Backend Capability
      ↓
Authoritative Data
```

The web client may contain presentation state, interaction state, local validation and temporary UI coordination. Authoritative enterprise state remains backend-owned.

## 4. Scope

The customer web client will progressively provide access to the platform's customer-facing capabilities, beginning with the commerce journey.

Initial scope:

- application shell;
- product catalogue presentation;
- product discovery interaction;
- basket presentation and commands;
- authenticated customer context;
- error and loading states;
- responsive and accessible presentation;
- API contract integration;
- client-side telemetry hooks where appropriate.

Later capabilities enter through their governing architecture, including checkout, orders, fulfilment, delivery, notifications, household, subscription, AI Society and advanced shopping experiences.

## 5. Non-Goals

This decision does not:

- replace ADR-013 Flutter Client Architecture;
- move authoritative business rules into the browser;
- introduce a second source of truth for commerce state;
- define Walk Mode;
- define AI authority;
- define payment-provider implementation;
- or require every backend capability to be exposed immediately.

## 6. Security and Trust

The browser is an untrusted execution environment.

The client must not contain:

- payment secrets;
- privileged service credentials;
- authoritative pricing algorithms;
- authoritative inventory mutation rules;
- authoritative trust decisions;
- unrestricted AI credentials;
- or proprietary server-side decision logic intended to remain protected.

Authentication and authorisation remain governed by ADR-006 and the API/service boundary.

## 7. State Ownership

### Backend authoritative state

- product identity;
- product price;
- availability;
- basket contents;
- customer identity;
- orders;
- fulfilment state;
- delivery state;
- and other domain-owned facts.

### Web presentation state

- loading state;
- error state;
- current view;
- filters and search input;
- transient interaction state;
- and derived presentation data.

The web client must not treat optimistic local mutations as authoritative confirmation.

## 8. API Boundary

The web client will communicate through a dedicated typed API client boundary.

Raw HTTP calls must not be distributed through UI components.

API DTOs must be mapped into client-facing models where the separation provides meaningful protection against backend contract leakage.

## 9. Offline and Limited Connectivity

The web client may progressively support limited-connectivity behaviour, but offline functionality must be introduced deliberately through governed client architecture.

Offline state must never silently become authoritative enterprise state.

## 10. Accessibility

Accessibility is a first-class client requirement. Interactive commerce functionality must remain usable through keyboard navigation, semantic structure, visible focus, appropriate labels and responsive layouts.

## 11. Observability

Material client operations should provide sufficient telemetry context to correlate user-visible failures with backend requests without exposing sensitive information.

Client telemetry must remain subordinate to the enterprise observability and audit architecture.

## 12. Relationship With Flutter

The web and Flutter clients are separate interaction surfaces over shared enterprise capabilities.

They may share governed contracts and narrowly scoped technical packages, but they must not share client-specific presentation state or create cross-client authoritative state.

## 13. Implementation Sequence

The web-first implementation will proceed as vertical capability slices:

```text
Web Shell
  ↓
Catalogue
  ↓
Basket
  ↓
Checkout Boundary
  ↓
Orders
  ↓
Inventory / Fulfilment / Delivery
  ↓
Household / Subscription / Notifications
  ↓
AI Society
  ↓
Advanced Experiences
```

Each slice must maintain EIP-019 traceability.

## 14. Consequences

Positive consequences:

- browser-first validation of the broader platform;
- faster visual iteration;
- a reusable customer interaction foundation;
- clear separation between UI and enterprise authority;
- shared API-contract discipline across future clients.

Trade-offs:

- an additional client surface must be maintained;
- responsive/accessibility requirements increase implementation scope;
- browser security constraints require stronger backend protection of proprietary logic.

## 15. Forward-Consistency Check

Direct impacts:

- ADR-004 — API/service boundary consumed by web client.
- ADR-006 — identity/authentication boundary consumed by web client.
- ADR-015 — browser treated as an untrusted client and proprietary logic remains protected.
- ADR-016 — client operations participate in traceability and observability.
- EIP-019 — web implementation must remain traceable.
- EIP-025 — client implementation principles extend to the web surface.
- EIP-027 — repository structure gains the customer web application boundary.

Secondary impacts will be reviewed when checkout, payment, offline, AI and external integrations enter the web client.

## 16. Decision Outcome

A dedicated customer web client is approved as an implementation surface, while the enterprise architecture remains authoritative over business capabilities, data, security, events and AI authority.

## Commit Message

```text
feat(web): establish customer web client architecture
```
