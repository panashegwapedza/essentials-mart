# ADR-019 Amendment 001 — Scheduled Transport & Delivery Capabilities

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-019 — External Partner Integration Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020  
**Related Pattern:** EIP-017, EIP-018

## Purpose

This amendment extends ADR-019 to explicitly cover external transport, mapping, traffic and logistics capabilities used by the delivery orchestration layer.

## Amendment

External transport and infrastructure providers may expose governed capabilities including:

- scheduled routes and departures;
- capacity;
- transport availability;
- handoff locations;
- courier fulfilment;
- traffic information;
- mapping and routing information;
- and delivery-status information.

All such providers remain behind the partner adapter/gateway boundary.

Provider-specific contracts must not leak into the core delivery job or subscription domains.

A provider's timetable does not establish guaranteed delivery capacity. Contractual availability, capacity, accepted goods, restrictions, handoff capability and operational status must be validated before a delivery plan uses the service.

Mukuru or any other provider remains replaceable and must not become a foundational architectural dependency.

**ADR-019 remains authoritative together with this amendment unless superseded by a later ADR.**
