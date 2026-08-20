# ADR-006 Amendment 001 — External Partner Identity & Delegated Authority

**Status:** Proposed
**Date:** 2026-08-20
**Parent ADR:** ADR-006 — Identity, Authentication & Authorisation
**Related Architecture:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Related Pattern:** EIP-017 — External Partner Adapter / Gateway
**Related Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This amendment extends the principal model to provide explicit treatment of external commerce and distribution partners.

## 2. Amendment

External partners are first-class integration principals but receive no implicit platform-wide authority.

A partner principal must have:

- a unique partner identity;
- an authenticated integration identity;
- registered capabilities;
- scoped permissions;
- applicable geography or market scope;
- lifecycle status;
- revocation controls;
- audit identity.

```text
External Partner
      |
      +-- Identity
      +-- Capabilities
      +-- Permissions
      +-- Market Scope
      +-- Trust / Risk State
      +-- Lifecycle Status
      +-- Audit Identity
```

## 3. Delegated Customer Context

Where a partner initiates an action on behalf of a customer, the system must distinguish:

- the partner principal;
- the customer principal;
- the delegated authority or consent;
- the requested action;
- the resource;
- the policy decision.

Partner authentication does not replace customer authorisation.

Partner-provided KYC or identity assurance may be an input into trust evaluation but does not automatically grant unrestricted Essentials Mart access.

## 4. Capability-Scoped Access

Permissions must be capability-specific.

For example, a partner may be permitted to:

- initiate a grocery order;
- submit a payment confirmation;
- receive an order status;
- access a limited catalogue;

without being permitted to:

- enumerate customers;
- access unrelated households;
- read internal AI context;
- access staff data;
- access internal operational systems.

## 5. Revocation and Suspension

Partner identities must support immediate or appropriately bounded suspension and revocation.

Partner status must be capable of being changed independently from the underlying domain architecture.

## 6. Audit

Partner-originated actions must identify both the external partner and, where applicable, the customer on whose behalf the action was initiated.

**ADR-006 remains authoritative together with this amendment unless superseded by a later ADR.**
