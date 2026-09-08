# Essentials Mart — Order History & Delivery Implementation Consistency

**Status:** Implemented / Consistency Checked
**Date:** 2026-09-08

## 1. Scope

This consistency check covers the customer-facing Order History capability and mandatory delivery-method selection introduced into the Commerce checkout flow.

Implemented behaviour:

- authenticated customer can retrieve their own order history;
- order detail preserves line items and quantities;
- order detail exposes subtotal, delivery method, delivery fee, total, status, and order date;
- checkout requires a delivery method;
- delivery fee is calculated authoritatively by Commerce rather than trusted from the browser;
- delivery selection and fee are persisted with the order;
- customer-web access is through the Commerce API rather than direct database access.

## 2. Architecture alignment

### EDA

Aligned with the enterprise data/domain boundary: Commerce owns the authoritative Order transaction, while Delivery/Fulfilment owns subsequent delivery execution. The customer history view is a read capability over Commerce-owned order history; it does not create a second order authority.

The implementation preserves the EDA principle that state transitions remain with the authoritative domain and that cross-domain delivery execution can consume order facts without mutating the historical order directly.

### ADR-003 — Event-Driven Architecture

No conflict identified. Order history is a read capability over authoritative commerce state. Future order-status and delivery-status notifications can be emitted as domain events without changing the ownership model.

### ADR-004 — API & Service Architecture

Aligned. Customer Web calls the Commerce API. Authoritative validation and delivery pricing remain server-side.

### ADR-005 — Data Ownership & Database Boundaries

Aligned. Order and Order Item data remain Commerce-owned. Delivery execution remains a separate concern. Customer access is ownership-scoped rather than implemented as unrestricted client-side database access.

### ADR-006 — Identity, Authentication & Authorisation

Aligned. Order history requires the authenticated customer principal and must be scoped to that customer's identity. The UI must never be treated as the authorization boundary.

### ADR-016 — Observability, Auditability & Trust

Aligned. Historical orders remain durable records. Delivery cost and selected method are persisted with the transaction so the customer-visible history can be reconciled against the authoritative order.

### ADR-017 — Scalability & Multi-Store Architecture

Aligned at the current single-store implementation stage. Delivery pricing is currently a governed baseline tariff and must evolve into store/region-specific configuration before multi-store rollout.

### ADR-018 — Deployment & Environment Strategy

Aligned. The customer-web implementation is deployed through the existing Vercel production pipeline and continues to use the existing Supabase production persistence boundary.

## 3. Information architecture alignment

`ENTITY-LIFECYCLES.md` defines Order as the authoritative commercial transaction record and requires historical order information to remain stable rather than being reconstructed from current Product data. The implementation follows this rule.

Delivery is separately lifecycle-owned. The current checkout records the customer's selected delivery method and fee on the Order; later delivery execution should remain a Delivery/Fulfilment concern.

## 4. EIP alignment

### EIP-019 — Architecture-to-Implementation Traceability

This implementation is recorded explicitly here so the delivery/order-history capability has an architecture-to-code traceability record.

### EIP-020 — Enterprise Domain / Bounded Context Implementation Map

Commerce remains the owning bounded context for Order and Order Item history. Delivery remains a downstream capability rather than a second owner of Order.

### EIP-021 — Backend Service/API Implementation Architecture

The browser consumes the Commerce API. Customer ownership and authoritative delivery pricing are enforced at the backend boundary.

### EIP-029 — API Contract Engineering

The Order response exposes the fields required by the customer history view without moving business authority into the client.

### EIP-030 — Testing & Verification Architecture

Required verification includes authenticated ownership isolation, order-detail correctness, mandatory delivery selection, authoritative delivery-fee calculation, and retry/idempotency behaviour.

### EIP-031 — Release & Change Management

The change is delivered through the existing Git/Vercel pipeline and must be verified in production before the BuckPay payment checkpoint is enabled.

## 5. Forward-consistency check

### Direct impacts

- Commerce Order aggregate/read model
- Order API contract
- Customer Web account/order-history UI
- Checkout delivery selection
- Delivery pricing authority
- Customer authorization boundary

### Secondary impacts

- Delivery/Fulfilment integration
- Order status notifications
- Observability/audit records
- Multi-store pricing configuration
- BuckPay payment correlation

### Result

No architectural contradiction was found. The implementation follows the existing EDA/ADR/EIP ownership model.

One implementation defect was found during this review: `AuthOverlay` captured every click on the `Account` button and opened the authentication overlay even when the customer was already authenticated. This prevented the Commerce account drawer from opening. The defect has been corrected so the authentication interceptor only handles `Account` clicks when there is no authenticated user.

## 6. Remaining architecture work

Before enabling real BuckPay payment authorization:

1. complete production verification of Order History and order-detail access;
2. add/verify delivery-region/store configuration rather than relying on the baseline tariff;
3. verify delivery status integration remains owned by Delivery/Fulfilment;
4. correlate BuckPay payment transactions with the authoritative Order;
5. implement verified payment webhook/idempotency handling;
6. close the related observability and release verification gates.
