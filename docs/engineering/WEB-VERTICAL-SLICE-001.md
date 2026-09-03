# WEB-VERTICAL-SLICE-001 — Customer Web Commerce Foundation

**Status:** Product Detail Slice Implemented
**Date:** 2026-09-03
**Governing ADR:** ADR-021
**Governing EIP:** EIP-034
**Traceability:** EIP-019

## 1. Purpose

Establish the first customer-facing web implementation slice for Essentials Mart using the architecture-to-implementation method.

## 2. Scope

The implemented slice establishes:

- React + TypeScript + Vite application bootstrap;
- customer web application shell;
- catalogue presentation;
- product discovery interaction;
- authoritative product-detail retrieval;
- basket presentation and commands;
- checkout interaction against Commerce;
- typed CommerceClient boundary;
- responsive presentation;
- baseline accessibility behaviour;
- explicit separation between UI state and enterprise authority.

## 3. Current Runtime Path

The browser now uses the governed Commerce API for catalogue, product detail, basket and checkout operations.

```text
Customer Web UI
    ↓
Feature State
    ↓
Typed CommerceClient
    ↓
Commerce API
    ↓
Commerce Application Service
    ↓
Commerce Domain
    ↓
Authoritative Data
```

The local development adapter remains available as a deterministic non-authoritative fallback for UI work, but is not the active runtime client.

## 4. Product Detail Slice

Product discovery now supports an explicit Product Detail surface.

The card provides a lightweight discovery projection. Opening Product Detail calls `GET /products/:productId` through `CommerceClient.getProduct()` so the detail surface is refreshed from Commerce before the user adds the item.

The browser does not calculate or override authoritative price or availability.

## 5. Verification

Before this slice is considered complete:

- TypeScript compilation must pass;
- production web build must pass;
- client tests must pass;
- the development shell must render in a browser;
- API integration must remain behind the typed client boundary;
- contract tests must verify the browser/API boundary;
- accessibility checks must cover material customer interactions.

## 6. Explicit Non-Goals

This slice does not implement:

- Walk Mode;
- payment processing;
- production identity provider integration;
- authoritative inventory logic in the client;
- AI authority;
- household state;
- delivery orchestration.

## 7. Forward-Consistency Check

The implementation affects ADR-004, ADR-006, ADR-015, ADR-016, ADR-021 and EIP-019, EIP-021, EIP-025, EIP-027 and EIP-034.

No authoritative domain ownership is moved into the browser.
