# ADR-007 Amendment 001 — Subscription & Delivery AI Participation

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-007 — AI Society Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020

## Purpose

This amendment extends ADR-007 to cover AI Society participation in household replenishment and delivery intelligence.

## Amendment

AI Society agents and Intelligence Engines may:

- identify likely replenishment needs;
- recommend subscriptions;
- recommend subscription changes;
- predict demand;
- identify delivery optimisation opportunities;
- evaluate operational conditions;
- and communicate governed recommendations.

AI recommendations do not create subscription authority or delivery authority merely by being generated or consumed.

Customer-controlled subscription changes require the appropriate customer authority. Deterministic delivery constraints such as capacity, eligibility and committed delivery windows remain enforceable execution constraints.

AI agents must not gain additional authority merely by subscribing to delivery or household events.

**ADR-007 remains authoritative together with this amendment unless superseded by a later ADR.**
