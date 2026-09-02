# EIP-034 — Customer Web Client Implementation Pattern

**Status:** Proposed
**Date:** 2026-09-02
**Decision Type:** Implementation Architecture
**Parent Architecture:** ADR-021
**Depends On:** EIP-019, EIP-021, EIP-022, EIP-025, EIP-027

## 1. Purpose

EIP-034 defines the reusable implementation pattern for the Essentials Mart customer web client.

It translates ADR-021 into an implementation boundary without moving enterprise authority into the browser.

## 2. Pattern

```text
Web UI
  ↓
Feature State
  ↓
Typed API Client
  ↓
Governed API
  ↓
Application Capability
  ↓
Domain Authority
  ↓
Authoritative Data
```

## 3. First Slice

The first executable web slice is the customer commerce journey:

```text
Application Shell
    ↓
Catalogue
    ↓
Product Discovery
    ↓
Basket
```

Checkout and order processing remain subsequent slices because their contracts and transactional boundaries must be implemented deliberately.

## 4. Client Responsibilities

The web client owns:

- rendering;
- interaction state;
- navigation state;
- search/filter state;
- loading and error presentation;
- accessibility behaviour;
- API request orchestration;
- and non-authoritative derived presentation state.

The web client does not own authoritative business state.

## 5. API Boundary

All backend communication passes through a typed API client.

UI components must not construct arbitrary backend requests.

The API client must make endpoint and DTO boundaries explicit so backend changes can be detected by tests and review.

## 6. Basket Rule

Basket contents and authoritative basket mutations remain owned by the Commerce capability.

The browser may display a transient interaction state, but successful basket mutations are confirmed by the backend response.

## 7. Security

The browser is untrusted.

No secret, privileged backend credential or proprietary authoritative decision algorithm may be shipped merely to support the UI.

## 8. Accessibility

The implementation must use semantic HTML, keyboard-accessible controls, visible focus and appropriate labels.

## 9. Verification

The implementation should provide:

- unit tests for models and state transformations;
- API client tests;
- component tests for material interactions;
- accessibility checks where practical;
- and integration tests against the governed Commerce API as the slice matures.

## 10. Traceability

Every material web capability must identify:

- ADR-021;
- EIP-034;
- owning backend capability;
- API contract;
- data ownership;
- security boundary;
- verification method;
- and evidence.

## 11. Forward-Consistency Check

Direct impacts:

- ADR-004 — API/service contracts.
- ADR-006 — identity and authorisation.
- ADR-015 — browser security boundary.
- ADR-016 — observability and trust.
- ADR-021 — web client architecture.
- EIP-019 — traceability.
- EIP-021 — backend API implementation.
- EIP-025 — client implementation principles.
- EIP-027 — repository/workspace boundary.

No existing domain authority is transferred to the client.

## 12. Outcome

EIP-034 establishes the customer web client as a governed interaction surface and defines the first web-first vertical slice without creating a parallel enterprise architecture.
