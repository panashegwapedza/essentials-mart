# Essentials Mart — Enterprise Data Architecture

## EDA Catalogue

- EDA-001 — Enterprise Data Architecture
  - Part 1 — Foundation
  - Part 2 — Enterprise/Data Boundaries
  - Part 3 — Security Architecture
  - Part 4 — Defensive Engineering & Platform Protection
- EDA-002 — External Partner Commerce, Distribution & Financial Integration
- EDA-003 — Household Subscription, Fulfilment & Multimodal Delivery Architecture

## EDA-002

EDA-002 defines the partner-neutral architecture for external commerce, distribution and financial integrations.

The architecture treats individual providers such as Mukuru as replaceable implementations behind an explicit external partner boundary.

Primary companion documents:

- EIP-017 — External Partner Adapter / Gateway
- ADR-019 — External Partner Integration Architecture
- ADR-019 Forward-Consistency Check

## EDA-003

EDA-003 defines the extension architecture for customer-configurable recurring household replenishment and the shared fulfilment and multimodal delivery capability used by both recurring and ordinary demand.

Primary companion documents:

- ADR-020 — Essentials Subscription & Multimodal Delivery Optimisation Architecture
- ADR-020 Forward-Consistency Check
- EIP-018 — Resource-Aware Multimodal Delivery Orchestration

EDA-003 explicitly does not supersede manual shopping, normal checkout, repeat purchase, AI Shopping Mode, Walk Mode, existing fulfilment or existing delivery services.

## Governance

EDA documents define enterprise-level architectural structure and boundaries. They must identify affected ADRs/EIPs and undergo forward-consistency review when they introduce or materially change architectural decisions.
