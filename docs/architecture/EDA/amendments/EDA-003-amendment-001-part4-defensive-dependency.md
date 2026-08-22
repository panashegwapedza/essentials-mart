# EDA-003 Amendment 001 — Part 4 Defensive Dependency

**Parent:** EDA-003 — Household Subscription, Fulfilment & Multimodal Delivery Architecture  
**Status:** Applied / Reconciled  
**Date:** 2026-08-22

## Decision

EDA-003 remains the capability architecture for household subscription, fulfilment and multimodal delivery. It does not replace ordinary shopping, repeat purchase, AI replenishment or existing checkout/delivery capabilities.

All EDA-003 implementations inherit EDA-001 Part 4 requirements applicable to identity, APIs, partner integrations, commerce abuse, monitoring, containment, incident response, resilience, scalability and assurance.

## Delivery Rule

The shared delivery orchestration capability remains the common execution layer for checkout delivery, subscription delivery, AI-triggered replenishment and other authorised delivery demand.

## Closure

Resolves GAP-008 without changing the underlying EDA-003 decision.