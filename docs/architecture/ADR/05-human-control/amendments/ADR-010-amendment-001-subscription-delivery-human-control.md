# ADR-010 Amendment 001 — Subscription & Delivery Human Control

**Status:** Proposed  
**Date:** 2026-08-22  
**Parent ADR:** ADR-010 — Human-in-the-Loop Architecture  
**Related Architecture:** EDA-003  
**Related Decision:** ADR-020  
**Related Pattern:** EIP-016

## Purpose

This amendment extends ADR-010 to cover human authority in subscription and delivery operations.

## Amendment

Human approval may be required for consequential actions outside pre-authorised operational autonomy, including material subscription exceptions, unusual delivery interventions, partner failures and operational overrides.

The normal flow remains:

```text
Recommendation → Customer / Authorised Human Decision → Execution
```

Operational route optimisation may proceed automatically within established constraints and authority.

Human intervention must not silently rewrite historical order or subscription truth.

**ADR-010 remains authoritative together with this amendment unless superseded by a later ADR.**
