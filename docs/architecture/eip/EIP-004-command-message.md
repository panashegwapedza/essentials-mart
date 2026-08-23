# EIP-004 — Command Message

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Command

---

## 1. Context

ADR-003 distinguishes commands from events. Essentials Mart requires explicit requests for actions across domain, service, and AI boundaries.

## 2. Problem

Using events as instructions creates semantic ambiguity and makes it unclear whether a recipient is merely being informed or is being asked to perform an action.

## 3. Decision

Essentials Mart will use Command Messages when a sender explicitly requests that an authorised recipient perform a defined action.

Examples include `CreateOrder`, `ReserveInventory`, `AssignDelivery`, or `RequestHumanApproval`.

## 4. Pattern Intent

**Ask an identified capability to perform an authorised action.**

## 5. Participants

- Command initiator.
- Command channel or routing mechanism.
- Authorised command recipient.
- Domain capability that owns the requested state change.

## 6. Message / Event Contract

Commands should contain command ID, command type, version, timestamp, initiating principal, correlation ID, target entity where applicable, requested parameters, and authority/context metadata.

A command must not be represented as a fact that already occurred.

## 7. Interaction Flow

```text
Initiator
   │
   │ ReserveInventory
   ▼
Command Channel / Router
   │
   ▼
Inventory Capability
   │
   ▼
Authoritative Inventory State
```

## 8. Reliability and Failure Handling

Command processing must provide an explicit success, rejection, or failure outcome where required. Retries must be safe and must respect command idempotency requirements.

## 9. Idempotency and Ordering

Commands that may be retried must include a stable command identifier or another idempotency mechanism. Ordering requirements must be defined for workflows where command sequence affects correctness.

## 10. Security and Authority

A command is not valid merely because it is structurally correct. The recipient must authenticate the initiator, authorise the requested capability, validate parameters, and enforce domain policy.

AI agents may initiate commands only when their explicit authority permits the action. Recommendations alone do not constitute commands.

## 11. Observability and Auditability

Command ID, initiating principal, agent identity where applicable, correlation ID, target capability, decision/policy result, execution result, and failure information should be traceable.

## 12. AI Society Impact

AI agents may produce or initiate governed commands. The architecture must distinguish:

`AI recommendation → governed command request → policy/authority check → domain action`

The model's output cannot bypass the authority boundary.

## 13. Domain Impact

The receiving domain remains authoritative for the state change. Command senders do not directly modify another domain's database.

## 14. Consequences

### Positive

- Clear intent.
- Explicit authority boundary.
- Good fit for agent-to-domain operations.
- Easier auditability.

### Negative

- Requires stronger validation than event notification.
- Failed commands require explicit handling.
- Distributed command workflows can become complex.

## 15. Alternatives Considered

### Event as instruction

Rejected because events represent facts, not requests.

### Direct database modification

Rejected because it violates domain ownership.

## 16. Implementation Implications

Command contracts, recipient routing, authentication, authorisation, idempotency, validation, outcome handling, and auditability are required.

## 17. Dependencies

- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-016 — Observability, Auditability & Trust

## 18. Related EIPs

- EIP-005 — Request-Reply
- EIP-006 — Message Router
- EIP-011 — Idempotent Consumer
- EIP-013 — Saga Orchestration
- EIP-016 — Human-in-the-Loop Routing

## 19. Review Conditions

Review if command workflows become predominantly synchronous, require long-running orchestration, or need compensation across multiple domains.

## 20. Final Decision

> Essentials Mart will use Command Messages for explicit, authorised requests to perform actions, with the receiving domain retaining authority over the resulting state change.
