# ADR-017 Amendment 001 — Partner Scalability & Multi-Market Routing

**Status:** Proposed
**Date:** 2026-08-20
**Parent ADR:** ADR-017 — Scalability & Multi-Store Architecture
**Related Architecture:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Related Pattern:** EIP-017 — External Partner Adapter / Gateway
**Related Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This amendment extends the scalability architecture to support multiple external partners across stores, countries, regions, currencies, and transaction volumes.

## 2. Amendment

Partner integration must be horizontally scalable and must not require partner-specific architectural changes to the core commerce domains.

A **Partner Capability Registry** must allow the platform to determine which partner can perform a capability for a given market and operating context.

Relevant attributes may include:

- geography;
- currency;
- payment capability;
- order capability;
- settlement capability;
- transaction limits;
- operational status;
- risk status;
- commercial eligibility.

## 3. Partner Routing

Partner routing may select among eligible partners based on capability, availability, customer eligibility, risk, cost, operational status, and applicable commercial rules.

Partner selection must not create a hard dependency on one provider.

## 4. Failure Isolation

Partner failures must be isolated from core platform operation where the business process permits.

The architecture must support:

- timeouts;
- retries where safe;
- circuit breaking;
- dead-letter handling;
- partner suspension;
- alternative partner routing where permitted;
- asynchronous reconciliation.

## 5. Global Scale

The partner boundary must remain compatible with the platform's future multi-country and multi-region operation and must not require a separate bespoke architecture for every partner.

**ADR-017 remains authoritative together with this amendment unless superseded by a later ADR.**
