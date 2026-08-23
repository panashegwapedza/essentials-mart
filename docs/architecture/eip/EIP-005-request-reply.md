# EIP-005 — Request-Reply

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Synchronous Integration

---

## 1. Context

ADR-003 explicitly retains synchronous APIs for interactions requiring an immediate response. Essentials Mart therefore needs a documented integration pattern for request/response interactions.

## 2. Problem

Treating every interaction as an event creates unnecessary latency and complexity when a caller requires information or an immediate outcome.

## 3. Decision

Essentials Mart will use Request-Reply for interactions where a caller needs a response before proceeding and where synchronous coupling is acceptable.

Examples include retrieving order status, validating a product request, obtaining a current capability result, or completing a synchronous API operation.

## 4. Pattern Intent

**Send a request to an authorised capability and receive a correlated response.**

## 5. Participants

- Requester.
- Authorised API/service capability.
- Response channel or HTTP response mechanism.
- Correlation/trace infrastructure.

## 6. Message / Event Contract

Requests and responses must have explicit contracts. A correlation ID should connect the response to the originating request. Errors must use defined error semantics rather than ambiguous empty responses.

## 7. Interaction Flow

```text
Requester
   │
   │ Request
   ▼
Authorised Capability
   │
   │ Response
   ▼
Requester
```

## 8. Reliability and Failure Handling

Timeouts, unavailable services, validation errors, and downstream failures must have explicit responses. Retries must consider whether the request changes state and whether repeating it is safe.

## 9. Idempotency and Ordering

Read-only requests are generally easier to retry. State-changing requests require explicit idempotency semantics before automated retries are allowed.

## 10. Security and Authority

The requester must be authenticated and authorised for the capability. A successful response does not imply permission to access unrelated domain data.

## 11. Observability and Auditability

Requests should carry correlation and trace identifiers. Significant state-changing requests should produce appropriate audit records and, where applicable, subsequent domain events.

## 12. AI Society Impact

AI agents may use Request-Reply when they need an immediate authorised capability result. The agent receives only the permitted response and does not gain unrestricted access to the underlying domain.

## 13. Domain Impact

The domain providing the capability remains responsible for its state and business rules.

## 14. Consequences

### Positive

- Immediate feedback.
- Simple fit for queries and bounded operations.
- Clear API contracts.

### Negative

- Runtime coupling.
- Timeouts and availability dependencies.
- Less resilient than asynchronous processing for long-running work.

## 15. Alternatives Considered

### Event Notification

Rejected where the caller requires an immediate answer.

### Asynchronous command workflow

Rejected for operations whose bounded result is required immediately.

## 16. Implementation Implications

APIs must define timeout, authentication, authorisation, error, versioning, and observability behaviour. Long-running workflows should generally move to asynchronous patterns.

## 17. Dependencies

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-016 — Observability, Auditability & Trust

## 18. Related EIPs

- EIP-004 — Command Message
- EIP-006 — Message Router
- EIP-015 — Correlation and Distributed Tracing

## 19. Review Conditions

Review if synchronous calls become long-running, highly coupled, unreliable at scale, or better represented by asynchronous workflows.

## 20. Final Decision

> Essentials Mart will use Request-Reply for bounded interactions where an immediate authorised response is required, while preserving asynchronous event and command patterns for workflows that do not require synchronous completion.
