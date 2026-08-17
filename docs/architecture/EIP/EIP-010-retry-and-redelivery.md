# EIP-010 — Retry and Redelivery

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Reliability / Messaging

---

## Purpose

Recover from transient message-processing failures without creating retry storms, indefinite processing, or unintended duplicate effects.

## Decision

Essentials Mart will use bounded, observable retry policies for retryable failures.

A policy should define:

- Maximum attempts
- Initial delay
- Backoff strategy
- Maximum delay
- Jitter where appropriate
- Retryable and non-retryable failure classes
- Dead-letter destination
- Alerting thresholds

Exponential backoff with jitter should be preferred for appropriate transient failures.

## Flow

```text
Failure → Classify → Retryable? → Retry Policy → Success
                         │                    └→ Exhausted → EIP-009
                         └→ No → EIP-009
```

Permanent validation, authorisation, schema, and business-rule failures should not normally be retried.

## Idempotency

Repeated delivery is expected to be possible. Side-effecting consumers must therefore follow EIP-011.

## AI Society Impact

Retrying an AI workflow must not automatically repeat a side effect such as placing an order, changing a basket, issuing a notification, or initiating delivery. Authorised side-effect capabilities must enforce their own idempotency and policy.

## Observability

Track retry count, retry rate, success rate, exhaustion, failure type, consumer, message type, and processing latency. Retries should remain correlated to the original workflow.

## Consequences

### Positive

- Better tolerance of transient failures.
- Reduced unnecessary permanent failures.
- Controlled automated recovery.

### Negative

- Adds latency.
- Poor policies can amplify outages.
- Requires monitoring and idempotency.

## Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust
- ADR-018 — Deployment & Environment Strategy

## Related EIPs

- EIP-009 — Dead Letter Channel
- EIP-011 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will use bounded, failure-aware retry and redelivery policies for appropriate transient message-processing failures, supported by idempotency and dead-letter handling.
