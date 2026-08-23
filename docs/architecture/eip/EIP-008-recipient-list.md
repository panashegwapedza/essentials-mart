# EIP-008 — Recipient List

**Status:** Proposed  
**Date:** 2026-08-17  
**Pattern Type:** Routing / Distribution

---

## Purpose

Deliver a message to a dynamically determined set of authorised recipients without requiring the producer to hard-code every destination.

## Context

Essentials Mart may need to distribute a business event or command-related notification to different consumers depending on the workflow, store, user permissions, channel configuration, or active capabilities.

## Decision

Essentials Mart will use Recipient Lists where the set of destinations must be determined dynamically from governed routing information.

A Recipient List must not become a mechanism for bypassing authorisation or domain boundaries.

## Flow

```text
                 Message
                    │
                    ▼
              Recipient List
             /       |       \
            ▼        ▼        ▼
       Consumer A Consumer B Consumer C
```

## Recipient Selection

Recipient selection may consider authorised metadata such as:

- Event/message type
- Store or operational scope
- Workflow role
- Capability
- User communication permissions
- Channel availability

Selection rules must be explicit and observable.

## Notifications and WhatsApp

The pattern is particularly relevant to multi-channel communication. A user may be eligible for an in-app notification and, where permission exists, a WhatsApp notification.

The recipient list must distinguish legitimate multi-channel delivery from duplicate processing. EIP-011 governs idempotent processing.

## AI Society Impact

An AI Society workflow may have multiple authorised consumers, but recipient selection does not grant an agent additional authority. Each recipient remains subject to its own capability and permission boundary.

## Reliability

If one recipient fails, the architecture must define whether the remaining recipients continue independently or whether the entire workflow fails. This must be explicit for each use case.

## Observability

The system should record the selected recipient set, selection rule/version, delivery outcomes, and correlation identifier without exposing unnecessary sensitive data.

## Consequences

### Positive

- Flexible distribution.
- Lower producer/consumer coupling.
- Supports multi-channel and multi-store workflows.

### Negative

- Recipient selection becomes an important integration concern.
- Partial delivery requires explicit handling.
- Recipient permissions must be evaluated carefully.

## Related ADRs

- ADR-006 — Identity, Authentication & Authorisation
- ADR-009 — AI Agent Governance & Permissions
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

## Related EIPs

- EIP-002 — Publish/Subscribe Channel
- EIP-006 — Message Router
- EIP-007 — Content-Based Router
- EIP-011 — Idempotent Consumer
- EIP-015 — Correlation and Distributed Tracing

## Final Decision

> Essentials Mart will use Recipient Lists for governed dynamic distribution where the appropriate set of authorised consumers cannot be fixed at the producer.
