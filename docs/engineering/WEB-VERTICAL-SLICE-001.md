# WEB-VERTICAL-SLICE-001 — Customer Web Commerce Foundation

**Status:** Build Started
**Date:** 2026-09-02
**Governing ADR:** ADR-021
**Governing EIP:** EIP-034
**Traceability:** EIP-019

## 1. Purpose

Establish the first customer-facing web implementation slice for Essentials Mart using the architecture-to-implementation method.

## 2. Scope

The slice establishes:

- React + TypeScript + Vite application bootstrap;
- customer web application shell;
- catalogue presentation;
- product discovery interaction;
- basket presentation;
- typed CommerceClient boundary;
- responsive presentation;
- baseline accessibility behaviour;
- explicit separation between UI state and enterprise authority.

## 3. Current Development Adapter

The initial browser shell uses a local development CommerceClient adapter so the interaction architecture can be exercised before the governed Commerce API is connected.

This adapter is explicitly non-authoritative and must not be treated as production commerce persistence.

## 4. Target Runtime Path

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

## 5. Verification

Before this slice is considered complete:

- TypeScript compilation must pass;
- production web build must pass;
- client tests must pass;
- the development shell must render in a browser;
- API integration must replace the development adapter;
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
