# ADR-008 Amendment 001 — Resource-Aware Delivery Intelligence

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-008 — Intelligence Engine Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020  
**Related Pattern:** EIP-018

## Purpose

This amendment extends ADR-008 to cover intelligence capabilities supporting recurring household demand and delivery optimisation.

## Amendment

Intelligence Engines may analyse:

- recurring consumption;
- household replenishment patterns;
- delivery demand;
- resource utilisation;
- vehicle capacity;
- warehouse and dispatch capacity;
- transport availability;
- delivery windows;
- ETA reliability;
- and route performance.

Intelligence may generate forecasts and recommendations, but the operational delivery engine remains responsible for enforcing hard execution constraints and authorised actions.

Intelligence output must remain distinguishable from authoritative subscription, order, inventory, fulfilment and delivery state.

**ADR-008 remains authoritative together with this amendment unless superseded by a later ADR.**
