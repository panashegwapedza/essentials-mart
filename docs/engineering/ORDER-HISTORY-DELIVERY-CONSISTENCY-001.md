# Essentials Mart — Order History & Delivery Implementation Consistency

**Status:** Implemented / Consistency Checked
**Date:** 2026-09-09

## 1. Scope

This consistency check covers the customer-facing Order History capability, mandatory delivery-method selection, delivery lifecycle enforcement, delivery history, and lifecycle notifications.

Implemented behaviour:

- authenticated customer can retrieve their own order history;
- order detail preserves line items and quantities;
- order detail exposes subtotal, delivery method, delivery fee, total, status, and order date;
- checkout requires a delivery method;
- delivery fee is calculated authoritatively by Commerce rather than trusted from the browser;
- delivery selection and fee are persisted with the order;
- delivery transitions are restricted to valid lifecycle paths;
- delivery status history is append-oriented and customer-readable through the ownership boundary;
- genuine delivery transitions create customer notifications linked to the exact Order ID;
- customer-web access is through the Commerce API rather than direct database access.

## 2. Architecture alignment

### EDA

Aligned with the enterprise data/domain boundary: Commerce owns the authoritative Order transaction, while Delivery/Fulfilment owns subsequent delivery execution. The customer history view is a read capability over Commerce-owned order history; it does not create a second order authority.

Delivery state transitions remain with the Delivery/Fulfilment boundary. Cross-domain Order status changes are derived operational consequences and do not replace the Delivery history.

### ADR-003 — Event-Driven Architecture

No conflict identified. Delivery transitions are durable facts and customer notifications are downstream communication consequences. The delivery history does not become a second Order authority.

### ADR-004 — API & Service Architecture

Aligned. Customer Web calls the Commerce API. Authoritative lifecycle validation remains server-side in the service-role delivery command boundary.

### ADR-005 — Data Ownership & Database Boundaries

Aligned. Order and Order Item data remain Commerce-owned. Delivery execution and Delivery history remain separately owned. Customer access is ownership-scoped.

### ADR-006 — Identity, Authentication & Authorisation

Aligned. Delivery history and current delivery state are customer-readable only when the authenticated principal owns the Delivery/Customer relationship. Mutation remains unavailable to normal customer roles.

### ADR-016 — Observability, Auditability & Trust

Aligned. Material delivery transitions are now durably recorded in `delivery_status_history`, with previous state, resulting state, tracking reference and transition time. Customer notifications are correlated to the exact Order aggregate.

### ADR-017 — Scalability & Multi-Store Architecture

Aligned at the current single-store implementation stage. Delivery pricing remains a governed baseline tariff and must evolve into store/region-specific configuration before multi-store rollout.

### ADR-018 — Deployment & Environment Strategy

Aligned. The implementation is delivered through the existing Git/Vercel production pipeline and the migration is applied to the connected Supabase production project.

## 3. Information architecture alignment

`ENTITY-LIFECYCLES.md` requires explicit lifecycle states, rejected invalid transitions, terminal-state discipline and auditable state changes. The delivery implementation now enforces those requirements at the authoritative database command boundary.

The current physical delivery vocabulary is `pending`, `preparing`, `ready_for_pickup`, `out_for_delivery`, `delivered`, `failed`, and `cancelled`. Method-specific guards prevent pickup deliveries from entering `out_for_delivery` and non-pickup deliveries from entering `ready_for_pickup`.

## 4. EIP alignment

### EIP-019 — Architecture-to-Implementation Traceability

This implementation is recorded explicitly here so the delivery/order-history capability has an architecture-to-code traceability record.

### EIP-020 — Enterprise Domain / Bounded Context Implementation Map

Commerce remains the owning bounded context for Order and Order Item history. Delivery remains a downstream operational capability rather than a second owner of Order.

### EIP-021 — Backend Service/API Implementation Architecture

The browser consumes the Commerce API. Delivery mutation is not exposed as a customer API capability; authoritative lifecycle enforcement is server-side.

### EIP-029 — API Contract Engineering

The existing Order contract remains backward compatible. Delivery lifecycle evidence is additive and does not move business authority into the client.

### EIP-030 — Testing & Verification Architecture

Required verification includes valid transition paths, invalid transition rejection, terminal-state rejection, method-specific transition guards, history persistence, customer ownership isolation, notification creation, and idempotent notification channels.

### EIP-031 — Release & Change Management

The change is delivered through the existing Git/Vercel pipeline. Supabase production now contains the delivery lifecycle hardening migration.

## 5. Forward-consistency check

### Direct impacts

- Delivery lifecycle authority
- Delivery status history
- Customer delivery visibility
- Order status synchronization
- Delivery notifications
- Supabase RLS and service-role command boundary

### Secondary impacts

- Order Detail delivery presentation
- Notification centre and exact Order deep links
- Observability/audit evidence
- Fulfilment/provider integration
- Multi-store delivery policy
- BuckPay payment correlation

### Result

No architectural contradiction was found. Delivery remains independently lifecycle-owned while Order remains the authoritative commercial transaction.

The previously identified executable `SECURITY DEFINER` trigger function exposure was also closed by explicitly revoking RPC execution from `public`, `anon`, and `authenticated`, leaving the function available only to the service-role execution boundary.

## 6. Remaining architecture work

Before enabling real BuckPay payment authorization:

1. expose the current Delivery summary/history through the authenticated Order Detail contract;
2. add/verify delivery-region/store configuration rather than relying on the baseline tariff;
3. add delivery-provider command/webhook adapters behind the Delivery boundary;
4. correlate BuckPay payment transactions with the authoritative Order;
5. implement verified payment webhook/idempotency handling;
6. close the related observability and release verification gates.
