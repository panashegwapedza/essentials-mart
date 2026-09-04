# Commerce API — v0.1

**Status:** Development vertical slice. Not production-ready.
**Service:** `services/commerce-api`
**Source of truth:** the implementation under `services/commerce-api/src/`.

## 1. Purpose

Exposes the Commerce domain and the first BuckPay value-account slice through a small HTTP boundary:

`Authenticated Customer → Product → Basket → Checkout → Order`

`Authenticated Customer → BuckPay Account → Value History`

This is not the production platform. Persistence, production authentication, inventory reservation, events, payments, financial-provider integrations and regulated financial operations remain future dependencies.

## 2. Current limitations

- Persistence is in-memory and process-local.
- No production authentication provider exists.
- Development authentication is intentionally unverified and must never be exposed in production.
- Checkout has an explicit transaction seam, but the current development adapter provides no atomicity or concurrency guarantee.
- BuckPay currently exposes account/history reads plus an application-service ledger seam; production funding, withdrawal, custody and regulated investment operations are not enabled.
- No commerce events are published yet.
- Product availability is a boolean fixture rather than tracked inventory quantity.

## 3. Authentication

Production authentication is not implemented. The process fails closed unless `AUTH_MODE=development` and `ALLOW_DEV_AUTH=true` are both explicitly set.

Development requests authenticate only through:

```text
x-dev-customer-id: <any string>
```

The value is not cryptographically verified. It exists only for local development and tests and must never be reachable from a production deployment.

## 4. Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/products` | No | List development product fixtures |
| `GET` | `/products/:productId` | No | Get a product |
| `GET` | `/basket` | Yes | Get or create the caller's basket |
| `POST` | `/basket/items` | Yes | Add or merge a basket line |
| `DELETE` | `/basket/items/:productId` | Yes | Remove a basket line |
| `POST` | `/checkout` | Yes | Create an order from the current basket |
| `GET` | `/orders/:orderId` | Yes | Get an order owned by the caller |
| `GET` | `/buckpay` | Yes | Get the caller's BuckPay account and authoritative balance |
| `GET` | `/buckpay/transactions` | Yes | Get the caller's BuckPay transaction history |

Basket and BuckPay identity are derived from the authenticated principal rather than client-supplied customer/account IDs. This makes cross-customer addressing structurally unavailable to the HTTP layer.

## 5. BuckPay boundary

BuckPay balances are server-authoritative. The customer client can display the balance and transaction history but cannot mutate the balance directly.

The application service provides controlled commands for:

- earned-value credit;
- customer funding after an approved funding rail settles;
- commerce redemption;
- and future authorised reversal.

These commands enforce positive amounts, currency consistency, account status, idempotent transaction references and non-negative balances.

Financial-provider operations remain behind the external-partner boundary. The development implementation must not be interpreted as a regulated payment, deposit, custody or investment service.

## 6. Validation and security

- Product prices are authoritative in the Product repository; the client cannot set checkout totals.
- Adding an existing product merges quantity into the existing line.
- BuckPay transaction references are idempotent per customer.
- Reusing a BuckPay reference with different transaction data is rejected.
- BuckPay redemptions cannot create negative balances.
- BuckPay mutation authority remains server-side.
- Order ownership failures intentionally return the same `404 NOT_FOUND` response shape as missing orders.
- JSON request bodies are limited to 64 KiB.
- Malformed JSON returns `400 VALIDATION_ERROR`.
- Unsupported content types on body-bearing endpoints return `415 UNSUPPORTED_MEDIA_TYPE`.
- Oversized bodies return `413 PAYLOAD_TOO_LARGE` without relying on immediate socket destruction.
- Unsupported methods on known routes return `405 METHOD_NOT_ALLOWED` with an `Allow` header.
- Invalid URI encoding returns `400 INVALID_PATH_PARAMETER`.
- Unexpected server failures return a generic `500 INTERNAL` response without stack traces or source-file details.

## 7. Request/response error shape

All API errors use:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "human-readable description"
  }
}
```

## 8. Persistence and transaction boundary

Persistence is process-local and in-memory only. The `CheckoutTransaction` port explicitly marks the boundary where a production database transaction or an appropriate optimistic-concurrency strategy must be introduced.

BuckPay similarly uses a repository boundary in this development slice. Production persistence must provide durable ledger records, uniqueness constraints for transaction references, concurrency-safe balance changes, reconciliation and audit retention.

## 9. Event and architecture boundaries

This slice does not publish events yet. When event publication is added, it must follow the existing event architecture and use authoritative domain event vocabulary rather than inventing conflicting contracts.

BuckPay follows ADR-021 and EIP-034. Provider-specific funding or financial operations cross ADR-019/EIP-017 rather than becoming part of the core BuckPay domain.

## 10. API versioning

This document describes the development-only v0.1 contract. No production URL/header versioning decision is made here; that requires an explicit architectural decision when external consumers are introduced.
