# ADR-004 Amendment 003 — Part 4 API Defence Reconciliation

**Parent:** ADR-004 — API & Service Architecture  
**Status:** Applied / Reconciled  
**Date:** 2026-08-22

## Scope

ADR-004 remains the authoritative decision for contract-driven, domain-aligned APIs and services.

EDA-001 Part 4, especially Commit 014 — API & Service Boundary Defence, defines the defensive constraints applied to those interfaces.

## Clarification

ADR-004 establishes **what the API/service architecture is and why**.

Part 4 establishes **the defensive controls the API/service boundary must satisfy**.

This includes authentication, authorisation, resource controls, rate limiting, abuse detection, request validation, replay protection, service identity, boundary isolation, observability and assurance.

## Consequence

No API architecture may interpret ADR-004 as permitting a capability that violates Part 4 defensive requirements.

## Closure

Resolves GAP-002. No reversal of ADR-004 is required.