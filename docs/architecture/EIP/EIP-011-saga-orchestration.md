# EIP-011 — Saga Orchestration

**Status:** Proposed
**Date:** 2026-08-17
**Pattern Type:** Distributed Workflow

---

## 1. Purpose

Coordinate long-running business workflows that span multiple domain-owned transactions without requiring a single distributed database transaction.

## 2. Context

Essentials Mart contains workflows such as:

```text
Order
  → Payment
  → Inventory
  → Fulfilment
  → Delivery
  → Customer Notification
```

These operations may belong to different domains and may fail independently. A traditional ACID transaction cannot safely encompass all participating systems.

The platform therefore requires a controlled mechanism for coordinating distributed business transactions and compensating for failures.

## 3. Decision

Essentials Mart will use **Saga orchestration** for appropriate long-running workflows that require coordinated actions across multiple domain boundaries.

A saga orchestrator will coordinate steps, track workflow state, enforce policy, and initiate compensating actions where required.

The orchestrator does not own the authoritative business data of participating domains.

## 4. Example

```text
                 Order Saga
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Payment    Inventory   Fulfilment
          │          │          │
          └──────────┼──────────┘
                     ▼
                  Delivery
                     │
                     ▼
                Completion
```

If a later step fails, the saga may invoke an appropriate compensation rather than attempting a global rollback.

## 5. Orchestrator Responsibilities

The orchestrator may:

- Start a saga
- Track saga state
- Determine the next permitted step
- Send commands to participating domains
- Correlate responses/events
- Apply timeout policies
- Initiate compensation
- Escalate unrecoverable failures
- Record workflow outcomes

It must not bypass domain APIs or directly modify domain-owned state.

## 6. Commands and Events

Saga orchestration should distinguish between:

**Commands:** requests for a domain to perform an action.

**Events:** facts indicating that a domain operation occurred.

For example:

```text
Saga
 │
 ├── ReserveInventory ──► Inventory
 │
 ├── InventoryReserved ◄── Inventory
 │
 ├── PrepareFulfilment ──► Fulfilment
 │
 └── FulfilmentPrepared ◄── Fulfilment
```

This preserves the distinction established by ADR-003.

## 7. Compensation

A compensation is a new business action that counteracts or reconciles an earlier action. It is not necessarily a technical rollback.

For example:

```text
PaymentCaptured
      │
      ▼
InventoryReservationFails
      │
      ▼
IssuePaymentRefund
```

Compensating actions must be explicitly defined by the owning domain.

The saga orchestrator must not invent compensating behaviour.

## 8. Failure Handling

The saga must define behaviour for:

- Command timeout
- Domain rejection
- Event timeout
- Duplicate events
- Orchestrator restart
- Compensation failure
- Partial completion
- External dependency failure

Unresolved workflows must be visible to operations and, where appropriate, escalated to a human.

## 9. Idempotency

Saga commands and event handling must be idempotent where repeated delivery is possible.

The saga state machine must also prevent the same logical transition from producing unintended repeated side effects.

EIP-009 governs consumer idempotency.

## 10. AI Society Impact

AI agents may recommend or request saga participation, but an AI agent does not automatically become the saga authority.

For example, a Shopping Agent may request an order-related workflow, but the resulting distributed transaction remains governed by enterprise workflow rules.

AI may assist with:

- Exception interpretation
- Recommendations
- Customer communication
- Operational prioritisation
- Human escalation

AI must not silently alter saga state outside its authorised capabilities.

## 11. Human-in-the-Loop

A saga should support escalation when a workflow reaches an ambiguous, high-risk, or unrecoverable state.

Examples include:

- Payment captured but fulfilment cannot proceed
- Delivery assignment repeatedly fails
- Compensation cannot complete
- Fraud/risk controls require review
- Customer intervention is required

This aligns with ADR-010.

## 12. Observability

Each saga must have a stable workflow identifier and maintain correlation across all participating operations.

Observable information should include:

- Saga ID
- Current state
- Initiating principal
- Initiating command/event
- Completed steps
- Pending steps
- Failed steps
- Compensation attempts
- Human escalations
- Final outcome

ADR-016 provides the broader observability and auditability requirements.

## 13. Consequences

### Positive

- Supports distributed business workflows.
- Avoids global database transactions.
- Makes failure and compensation explicit.
- Preserves domain ownership.
- Supports long-running processes.

### Negative

- Workflow complexity increases.
- Compensation logic can be difficult.
- Partial failure requires operational handling.
- Distributed state is harder to reason about.

## 14. Related ADRs

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

## 15. Related EIPs

- EIP-004 — Command Message
- EIP-005 — Request/Reply
- EIP-007 — Dead Letter Channel
- EIP-008 — Retry and Redelivery
- EIP-009 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing
- EIP-016 — Human-in-the-Loop Routing

## 16. Final Decision

> Essentials Mart will use Saga orchestration for appropriate distributed, long-running workflows spanning multiple domain-owned transactions. The saga coordinates authorised domain actions and compensations without taking ownership of participating domain state.
