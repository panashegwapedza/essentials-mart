# ADR-009 — AI Agent Governance & Permissions

**Status:** Proposed
**Date:** 2026-08-12
**Decision Type:** AI Governance

---

## Decision

Essentials Mart will use a **policy-governed, least-privilege model for AI agent authority**.

Every production AI agent must have explicit governance covering identity, purpose, responsibilities, capabilities, accessible domains/data, permitted actions, authority boundaries, approval requirements, delegation constraints, audit requirements, and lifecycle status.

Technical capability must not automatically constitute authority. Agent-to-agent communication does not transfer authority or permissions. The AI model is not the security boundary; consequential authorization must be enforced by trusted platform infrastructure.

## Authority Model

```text
Capability
    ↓
What the system can technically perform

Permission
    ↓
What the agent is authorised to perform

Authority
    ↓
What the agent is authorised to act upon

Autonomy
    ↓
Whether the authorised action requires additional approval
```

These layers are evaluated independently.

## Security Principles

- AI agents operate with least privilege.
- Delegated authority is explicit, scoped, revocable and attributable.
- Agents cannot grant themselves additional authority.
- Untrusted content cannot modify governance authority.
- Consequential actions remain attributable and auditable.
- Human approval is required where policy determines autonomous authority is insufficient.
- Governance applies consistently across Flutter, Web, WhatsApp, internal services, automated workflows, Walk Mode and future interfaces.

## Agent Lifecycle

```text
Proposed → Validated → Approved → Active → Restricted / Suspended → Deprecated → Retired
```

A production agent must not become active without an appropriate governance definition.

## Consequences

This establishes controlled AI autonomy while preserving enterprise authority, security and accountability. It intentionally accepts additional governance complexity rather than treating model capability as authorization.

## Dependencies

ADR-001, ADR-002, ADR-004, ADR-005, ADR-006, ADR-007, ADR-008, ADR-010, ADR-011, ADR-012, ADR-015, ADR-016, ADR-018.

## Final Decision

> **Essentials Mart will govern AI agents through explicit, least-privilege policies that separate capability, permission, authority, and autonomy. AI agents may only perform actions for which they possess appropriate authority in the current context. Authority may not be self-escalated, agent-to-agent communication does not transfer permissions, and trusted system infrastructure—not the AI model—must enforce consequential access and action boundaries. Human approval will be required where applicable policy determines that autonomous authority is insufficient. Consequential AI activity must remain attributable and auditable.**

**ADR-009 remains authoritative unless superseded by a subsequent ADR.**
