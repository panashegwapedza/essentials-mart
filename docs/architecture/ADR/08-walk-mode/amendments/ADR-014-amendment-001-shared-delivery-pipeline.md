# ADR-014 Amendment 001 — Walk Mode Shared Delivery Pipeline

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-014 — Walk Mode / Living Digital Supermarket Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020

## Purpose

This amendment ensures Walk Mode remains compatible with the shared commerce, fulfilment and delivery architecture.

## Amendment

Walk Mode may create or modify authorised shopping and order intent that ultimately produces a delivery obligation.

Once a delivery obligation exists, it enters the shared delivery pipeline and may use the same delivery orchestration, resource evaluation, routing and dispatch capabilities as orders originating from ordinary shopping, repeat purchase, AI replenishment or subscriptions.

Walk Mode must not create a parallel delivery subsystem.

**ADR-014 remains authoritative together with this amendment unless superseded by a later ADR.**
