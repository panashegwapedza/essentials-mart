# ADR-018 Amendment 001 — External Partner Deployment & Environment Isolation

**Status:** Proposed
**Date:** 2026-08-20
**Parent ADR:** ADR-018 — Deployment & Environment Strategy
**Related Architecture:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Related Pattern:** EIP-017 — External Partner Adapter / Gateway
**Related Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This amendment extends deployment architecture to ensure external partner integrations remain isolated, configurable, and replaceable across environments.

## 2. Amendment

Partner adapters and credentials must be environment-specific.

Development, staging, and production must not share production partner credentials or uncontrolled partner endpoints.

Partner configuration should be externally managed and must support:

- endpoint configuration;
- capability enablement;
- credential references;
- webhook configuration;
- feature flags;
- regional routing;
- operational status;
- safe suspension.

## 3. Deployment Isolation

A partner adapter failure must not require redeployment of unrelated enterprise domains where avoidable.

Partner-specific implementation should therefore remain modular and independently operable within the platform's deployment model.

## 4. Secrets

Partner credentials, signing keys, API secrets, payment credentials, webhook secrets, and similar material must remain in the approved secrets-management boundary and must never be committed to source control or client applications.

## 5. Change Management

Partner API changes must be introduced through controlled versioning, compatibility testing, staging validation, and release governance.

A partner must be capable of being disabled or replaced through configuration and controlled deployment procedures without modifying authoritative domain data models.

**ADR-018 remains authoritative together with this amendment unless superseded by a later ADR.**
