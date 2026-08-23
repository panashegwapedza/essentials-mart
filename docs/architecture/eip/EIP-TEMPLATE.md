# EIP Template

**Pattern:** EIP-XXX — Pattern Name  
**Status:** Proposed  
**Date:** YYYY-MM-DD  
**Pattern Type:** Event / Command / Request-Reply / Routing / Reliability / Workflow / Governance

---

## 1. Context

Describe the Essentials Mart integration context in which this pattern is required.

## 2. Problem

Describe the integration problem this pattern solves.

## 3. Decision

State exactly how Essentials Mart will use the pattern.

## 4. Pattern Intent

Describe the intended behaviour in one concise statement.

## 5. Participants

Identify producers, consumers, channels, routers, orchestrators, domains, agents, or external systems involved.

## 6. Message / Event Contract

Describe the message semantics, required metadata, payload expectations, versioning, and ownership.

Minimum metadata should be considered where applicable:

- Message/event ID
- Message/event type
- Version
- Timestamp
- Source
- Correlation ID
- Causation ID where applicable
- Entity/aggregate ID where applicable
- Schema/version identifier

## 7. Interaction Flow

Provide a concise sequence or diagram showing the message flow.

## 8. Reliability and Failure Handling

Define timeout, retry, redelivery, dead-letter, fallback, compensation, and safe-termination behaviour as applicable.

## 9. Idempotency and Ordering

Define whether duplicate delivery is possible and how consumers preserve correctness. Define ordering requirements where they matter.

## 10. Security and Authority

Define authentication, authorisation, data minimisation, sensitive-data handling, and whether the message grants or merely communicates authority.

## 11. Observability and Auditability

Define correlation, tracing, metrics, logs, audit records, and operational signals required to understand the integration.

## 12. AI Society Impact

If applicable, define how AI agents or Intelligence Engines participate. Explicitly distinguish awareness, recommendation, request, and authority.

## 13. Domain Impact

Identify affected domains and preserve authoritative ownership of business state.

## 14. Consequences

### Positive

- 

### Negative

- 

### Trade-offs

- 

## 15. Alternatives Considered

### Alternative A

**Description:**  
**Why not selected:**

### Alternative B

**Description:**  
**Why not selected:**

## 16. Implementation Implications

Describe implementation requirements without prematurely locking the architecture to a specific technology unless another ADR requires it.

## 17. Dependencies

List the ADRs and architecture documents this EIP depends upon.

## 18. Related EIPs

List complementary or dependent EIPs.

## 19. Review Conditions

Describe circumstances that should trigger review or supersession.

## 20. Final Decision

> State the authoritative decision in one concise paragraph.
