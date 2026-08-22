# ADR-016 Amendment 001 — Subscription & Delivery Observability

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-016 — Observability, Auditability & Trust Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020  
**Related Pattern:** EIP-018

## Purpose

This amendment extends ADR-016 to ensure recurring demand and multimodal delivery decisions remain observable and auditable.

## Amendment

Material records should support reconstruction of:

- subscription lifecycle changes;
- AI replenishment recommendations;
- delivery-job creation;
- resources considered;
- transport options considered;
- selected delivery plan;
- ETA calculation;
- re-optimisation events;
- dispatch decisions;
- partner handoffs;
- delivery exceptions;
- and consequential human overrides.

The architecture should preserve the distinction between recommendation, authorisation, operational plan and completed outcome.

Operational telemetry must not automatically become permanent personal history. Retention remains purpose-driven.

**ADR-016 remains authoritative together with this amendment unless superseded by a later ADR.**
