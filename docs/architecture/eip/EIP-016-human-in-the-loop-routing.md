# EIP-016 — Human-in-the-Loop Routing

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Governance / Escalation

---

## Purpose

Route a workflow, decision, or action to an authorised human when policy, risk, ambiguity, or authority requirements prevent safe autonomous completion.

## Context

Essentials Mart preserves human authority over actions that exceed AI or service permissions, require review, or cannot be safely resolved automatically.

This pattern provides an explicit integration mechanism for escalation rather than allowing an agent or service to silently continue.

## Decision

Essentials Mart will use Human-in-the-Loop Routing for workflows requiring human authority or review.

```text
AI / Service Workflow
        │
        ▼
Policy / Authority Check
        │
   ┌────┴─────┐
   │          │
Allowed    Review Required
   │          │
   ▼          ▼
Continue   Human Route
              │
              ▼
       Authorised Staff
              │
              ▼
       Decision / Action
              │
              ▼
          Workflow
```

## Escalation Triggers

Examples include:

- Action exceeds agent authority.
- High-risk transaction.
- Ambiguous customer situation.
- Fraud/risk review.
- Failed compensation.
- Delivery or fulfilment exception requiring staff intervention.
- Service desk, returns, information point, or parcel-collection interaction requiring a real Essentials Mart staff member.

## Human Authority

The routing system must identify the required human role or operational queue. It must not fabricate staff identity, contact information, or approval.

Where a channel such as WhatsApp or voice is used, the integration must respect user permissions and communication policy.

## AI Society Impact

AI agents may prepare context, recommendations, and suggested actions for the human reviewer. They must not represent a recommendation as a human decision or manufacture approval.

## State and Resumption

The workflow must record that escalation occurred, preserve correlation, and define whether the workflow is paused, rejected, modified, or resumed after the human decision.

Human decisions must be attributable and auditable.

## Observability

Record appropriate information such as:

- Workflow ID
- Escalation reason
- Initiating principal
- AI/service identity
- Required human role
- Time escalated
- Decision/action
- Decision-maker identity
- Final workflow outcome

Sensitive information must be minimised.

## Consequences

### Positive

- Preserves human authority.
- Provides safe escalation for exceptional workflows.
- Makes human decisions auditable.
- Supports AI-assisted operations without uncontrolled autonomy.

### Negative

- Human intervention introduces latency.
- Operational queues require ownership and staffing.
- Escalation rules require careful design.

## Related ADRs

- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-010 — Human-in-the-Loop Architecture
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-014 — Walk Mode / Living Digital Supermarket Architecture
- ADR-016 — Observability, Auditability & Trust

## Related EIPs

- EIP-004 — Command Message
- EIP-006 — Message Router
- EIP-008 — Recipient List
- EIP-013 — Saga Orchestration
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will use governed Human-in-the-Loop Routing whenever a workflow requires human authority, review, or intervention, preserving explicit identity, correlation, auditability, and safe workflow resumption.
