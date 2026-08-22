# ADR-004 Amendment 002 — Subscription & Multimodal Delivery Orchestration

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-004 — API & Service Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020  
**Related Pattern:** EIP-018

## Purpose

This amendment extends ADR-004 to cover the service boundary required for customer-configurable subscriptions and shared delivery orchestration.

## Amendment

Subscription management, commerce, fulfilment, delivery jobs and delivery orchestration shall remain distinct capabilities with explicit service contracts.

Delivery orchestration must be reusable across ordinary orders, repeat purchases, AI-assisted replenishment, subscriptions and authorised partner orders. Subscription-specific delivery APIs are rejected.

The delivery service boundary may expose canonical capabilities for:

- creating and managing delivery jobs;
- evaluating delivery options;
- creating delivery plans;
- dispatching delivery plans;
- re-optimising active plans;
- and reporting delivery state.

Provider-specific mapping, traffic and transport APIs remain behind EIP-017 adapters.

## Consequence

The API architecture gains a shared delivery orchestration boundary without changing domain ownership or replacing existing commerce services.

**ADR-004 remains authoritative together with this amendment unless superseded by a later ADR.**
