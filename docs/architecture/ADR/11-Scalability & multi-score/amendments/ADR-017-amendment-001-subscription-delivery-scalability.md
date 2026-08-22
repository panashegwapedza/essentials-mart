# ADR-017 Amendment 001 — Subscription & Multimodal Delivery Scalability

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-017 — Scalability & Multi-Store Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020

## Purpose

This amendment extends ADR-017 to ensure recurring demand and multimodal delivery scale across stores, regions and countries.

## Amendment

Subscription demand and delivery planning must support regional resource pools, store-level fulfilment constraints, geographic partitioning and transport-provider differences without requiring a single global delivery coordinator to become a single point of failure.

Delivery optimisation may be regional or local while maintaining enterprise-wide governance and consistent canonical contracts.

Scheduled transport capabilities may vary by geography and must be represented as regional resources rather than assumed to exist globally.

Capacity, vehicle, warehouse and partner-resource models must support growth from one store to large multi-store networks.

**ADR-017 remains authoritative together with this amendment unless superseded by a later ADR.**
