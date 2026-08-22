# ADR-005 Amendment 002 — Subscription & Delivery Data Boundaries

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-005 — Data Ownership & Database Boundaries  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020

## Purpose

This amendment extends ADR-005 to define ownership boundaries introduced by subscriptions and multimodal delivery orchestration.

## Amendment

The following remain authoritative in their responsible domains:

- subscription configuration and lifecycle;
- household replenishment state;
- order state;
- inventory state;
- fulfilment state;
- delivery state;
- resource availability;
- route and dispatch plans.

A route plan is an operational projection and does not replace order, inventory, fulfilment or subscription truth.

Delivery resource availability may be consumed by the orchestration layer without transferring ownership of the underlying resource records.

Historical receipts remain authoritative for completed purchases and may support repeat-purchase and learning workflows without becoming subscription state.

**ADR-005 remains authoritative together with this amendment unless superseded by a later ADR.**
