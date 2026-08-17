# EIP-008 — Retry and Redelivery

**Status:** Proposed
**Date:** 2026-08-17
**Pattern Type:** Reliability / Messaging

---

## 1. Purpose

Provide controlled retry and redelivery behaviour for messages that fail because of conditions that may recover without changing the message itself.

## 2. Context

Essentials Mart contains asynchronous workflows spanning Commerce, Inventory, Fulfilment, Delivery, Notification, Intelligence, Store Operations, and the AI Society. Transient failures are expected in distributed systems.

Retries must improve resilience without creating duplicate actions, retry storms, indefinite processing, or masking permanent failures.

## 3. Decision

Essentials Mart will implement explicit retry policies for asynchronous message processing.

Retries must be bounded, observable, and appropriate to the failure class. They must be combined with idempotent processing and a Dead Letter Channel for exhausted failures.

## 4. Retry Policy

A retry policy should define:

- Maximum attempts
- Initial delay
- Backoff strategy
- Maximum delay
- Jitter where appropriate
- Retryable failure classes
- Non-retryable failure classes
- Dead-letter destination
- Alerting threshold

Exponential backoff with jitter should be preferred for transient infrastructure failures where appropriate.

## 5. Processing Flow

```text
Message
  │
  ▼
Consumer
  │
  ├── Success ──► Complete
  │
  └── Failure
        │
        ▼
   Classify Failure
        │
   ┌────┴───────────┐
   │                │
Retryable      Non-retryable
   │                │
   ▼                ▼
Retry Policy     Dead Letter
   │
   ├── Success ──► Complete
   │
   └── Exhausted ─► Dead Letter
```

## 6. Failure Classification

Retry should normally be considered for conditions such as:

- Temporary network failure
- Temporary dependency unavailability
- Transient infrastructure failure
- Rate limiting where the retry policy permits it
- Temporary timeout

Retry should normally not be used for:

- Invalid message schema
- Invalid business data
- Permanent authorisation failure
- Unsupported message version
- Deterministic application defects that will fail identically
- Business-rule rejection

The exact classification is owned by the consuming capability and platform reliability policy.

## 7. Idempotency Requirement

Retry and redelivery can produce multiple delivery attempts for the same logical message.

Consumers must therefore be designed so that repeated processing does not produce unintended duplicate business effects.

Idempotent processing is defined separately in **EIP-009 — Idempotent Consumer**.

## 8. Retry Storm Prevention

The platform must prevent uncontrolled retry amplification.

Controls should include:

- Bounded retry counts
- Backoff
- Jitter
- Concurrency limits
- Circuit-breaking where appropriate
- Dead-lettering after exhaustion
- Monitoring and alerting

## 9. AI Society Impact

AI workflows may encounter model-provider, tool, network, or downstream-service failures.

Retrying an AI workflow must not automatically repeat a side effect such as placing an order, changing a basket, issuing a notification, or initiating a delivery action.

Where an AI workflow includes side effects, the side-effecting capability must enforce its own idempotency and authority checks.

## 10. Observability

Every retry should remain associated with the original message and distributed workflow.

Metrics should include:

- Retry count
- Retry rate
- Retry success rate
- Retry exhaustion
- Failure type
- Consumer
- Message type
- Processing latency

Repeated retries for a single message should be visible as one correlated workflow rather than unrelated failures.

## 11. Consequences

### Positive

- Better tolerance of transient failures.
- Reduced unnecessary permanent failures.
- Improved resilience of asynchronous workflows.
- Controlled recovery without manual intervention for common transient failures.

### Negative

- Processing latency may increase.
- Incorrect retry policies can amplify outages.
- Retry requires operational monitoring.
- Duplicate execution remains a risk without idempotency.

## 12. Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-016 — Observability, Auditability & Trust
- ADR-018 — Deployment & Environment Strategy

## 13. Related EIPs

- EIP-007 — Dead Letter Channel
- EIP-009 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## 14. Final Decision

> Essentials Mart will use bounded, observable, failure-aware retry and redelivery policies for appropriate transient message-processing failures, with idempotency and dead-letter handling as mandatory supporting controls.
