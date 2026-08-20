# ADR-005 Amendment 001 — External Partner Data Boundaries

**Status:** Proposed
**Date:** 2026-08-20
**Parent ADR:** ADR-005 — Data Ownership & Database Boundaries
**Related Architecture:** EDA-002 — External Partner Commerce, Distribution & Financial Integration
**Related Decision:** ADR-019 — External Partner Integration Architecture

---

## 1. Purpose

This amendment extends ADR-005 to define the data boundary between Essentials Mart and external partners.

## 2. Amendment

External partners may provide or consume data necessary for an authorised capability, but partner systems do not become authoritative owners of Essentials Mart enterprise entities merely because they initiate, facilitate, or replicate a transaction.

Essentials Mart remains authoritative for its own:

- customer and household state;
- product and catalogue state where owned by Essentials Mart;
- cart and order state;
- fulfilment state;
- delivery state where owned by Essentials Mart;
- internal payment and settlement records;
- audit records;
- AI and intelligence state;
- partner relationship state.

Partner-specific identifiers must be retained as external references rather than silently becoming replacements for Essentials Mart canonical identifiers.

## 3. Data Exchange

Partner data exchange must use approved APIs, commands, events, webhooks, or other governed interfaces.

Direct partner access to authoritative database tables is prohibited.

```text
Partner Data
     |
     v
Partner Adapter
     |
     v
Validated Canonical Contract
     |
     v
Owning Essentials Mart Domain
```

## 4. Delegated and Derived Data

A partner may hold data required to fulfil its own responsibilities. Such data does not alter Essentials Mart ownership.

Derived, cached, attribution, reconciliation, or analytical partner data must be classified according to its purpose and must not silently become a competing source of truth.

## 5. Privacy and Minimisation

Partner data exchange must be limited to the minimum information necessary for the authorised capability and must respect applicable consent, purpose, retention, regional, and access-control requirements.

## 6. Consequences

This amendment allows external partners to participate in commerce while preserving enterprise data sovereignty, canonical identifiers, domain ownership, and controlled data exposure.

**ADR-005 remains authoritative together with this amendment unless superseded by a later ADR.**
