# ADR-010 — Human-in-the-Loop Architecture

**Status:** Proposed  
**Date:** 2026-08-12  
**Decision Type:** AI Governance & Human Control

---

## 1. Context

ADR-007 establishes the Essentials Mart AI Society as a coordinated system of specialised AI agents.

ADR-008 establishes Intelligence Engines as specialised providers of intelligence.

ADR-009 establishes that AI agents operate under explicit, least-privilege authority and that capability, permission, authority, and autonomy are separate concepts.

Some actions within Essentials Mart will require human involvement rather than autonomous AI execution.

These actions may include operations that exceed an agent's delegated authority, require explicit user consent, involve significant consequences, or are otherwise designated by enterprise policy as requiring human judgement.

A consistent architecture is therefore required for transferring control between AI systems and authorised humans.

---

## 2. Problem

Without a defined Human-in-the-Loop architecture:

- AI agents may handle approval requirements inconsistently.
- Human approval may not be properly associated with the action being approved.
- Approval may be reused after circumstances have changed.
- Agents may continue executing while approval is pending.
- Rejection and escalation may be handled inconsistently.
- Human intervention may become dependent on a particular interface.
- AI agents could bypass human-control requirements through alternative tools or agents.

Essentials Mart therefore requires a common architectural model for human intervention that preserves authority, security, accountability, and auditability.

---

## 3. Decision

Essentials Mart will implement a **policy-governed Human-in-the-Loop architecture**.

AI agents may operate autonomously only within their authorised boundaries established under ADR-009.

Where policy determines that human involvement is required, the proposed action must enter an explicit human-control workflow.

The architecture will support:

- Approval
- Confirmation
- Rejection
- Review
- Escalation
- Delegated human authority
- Approval expiration
- Approval cancellation
- Approval re-evaluation
- Auditability

An AI agent must not execute an action requiring human approval until valid approval has been obtained.

Human approval does not replace normal authentication, authorisation, or policy enforcement.

---

## 4. Human Authority

Human authority remains distinct from AI authority.

An AI agent may:

- propose an action;
- prepare an action;
- explain an action;
- request approval;
- provide supporting information.

An AI agent may not approve its own restricted action.

The conceptual flow is:

AI Agent
    |
    v
Proposed Action
    |
    v
Policy Evaluation
    |
    +---- No human required ----> Authorised Execution
    |
    +---- Human required
              |
              v
        Human Decision
              |
              +---- Approve
              |
              +---- Reject
              |
              +---- Escalate

---

## 5. Approval Scope

Human approval must be explicitly associated with the action for which it was granted.

An approval must not automatically authorise unrelated actions.

Where applicable, approval scope will include:

- Initiating principal
- AI agent
- Action
- Resource
- Relevant parameters
- Authority context
- Approval identity
- Approval time
- Approval status

---

## 6. Approval Re-evaluation

Approval does not permanently authorise an action.

Before execution, the system must ensure that:

- the approval remains valid;
- the approving human remains authorised;
- the action has not materially changed;
- applicable policies remain satisfied;
- required resources remain available.

If relevant conditions have materially changed, the action must undergo appropriate re-evaluation.

---

## 7. Human Unavailability

Human silence or unavailability must not automatically be interpreted as approval for consequential actions.

Depending on applicable policy, an approval request may:

- remain pending;
- expire;
- be escalated;
- be cancelled;
- or return to the AI workflow for an alternative action.

The default behaviour for consequential approval-required actions is to **not execute without valid approval**.

---

## 8. Escalation

The architecture will support escalation where:

- the required human is unavailable;
- the human lacks sufficient authority;
- the situation requires specialised judgement;
- the action exceeds the current approval scope.

Escalation must remain subject to explicit authority.

Availability alone must not grant a person approval authority.

---

## 9. Delegated Human Authority

Human approval authority may be delegated where permitted by enterprise or household policy.

Delegation must be:

- Explicit
- Scoped
- Attributable
- Revocable
- Policy-governed

Delegation must not grant authority beyond the scope originally delegated.

---

## 10. Multiple Approvers

The architecture will support policies requiring:

- A single approver;
- Multiple approvers;
- Sequential approval;
- Independent approval;
- Role-based approval.

The exact approval requirements will be defined by applicable domain and business policies rather than this ADR.

---

## 11. Multi-Channel Human Control

Human intervention may occur through authorised interfaces and communication channels, including:

- Essentials Mart Flutter application;
- Web interfaces where applicable;
- WhatsApp;
- Internal operational interfaces;
- Future authorised channels.

The communication channel must not change the underlying authority or policy requirements.

A future WhatsApp approval must therefore be subject to the same governance rules as an in-app approval.

---

## 12. AI Agent Responsibilities

When human intervention is required, the AI agent may:

- explain why intervention is required;
- present relevant information;
- request approval;
- provide alternatives;
- wait for the decision;
- continue unrelated authorised work.

The AI agent must not:

- manufacture approval;
- impersonate an approver;
- modify an approval;
- bypass an approval requirement;
- treat an expired approval as valid;
- repeatedly request the same rejected action solely to circumvent rejection.

---

## 13. Approval Security

Human approval mechanisms must be protected against:

- Unauthorised approval;
- Approval spoofing;
- Replay of previous approvals;
- Approval of modified actions;
- Cross-user approval;
- Cross-household approval;
- Privilege escalation.

Authentication and authorisation requirements remain governed by ADR-006 and the security architecture.

---

## 14. Bypass Prevention

Human-control requirements must remain enforced regardless of how the action is attempted.

For example:

AI Agent
    |
    v
Restricted Capability
    |
    v
Human Approval Required

The agent must not bypass the requirement through:

AI Agent
    |
    v
Another Agent
    |
    v
Same Restricted Capability

Agent-to-agent communication does not transfer authority.

The underlying enterprise capability must enforce the applicable policy.

---

## 15. Failure Handling

If the Human-in-the-Loop mechanism is unavailable, approval-required consequential actions must fail safely.

Approval System Unavailable
          |
          v
Approval Cannot Be Obtained
          |
          v
Do Not Execute

Where policy permits, lower-risk workflows may continue through safe alternatives such as queuing, notification, or non-executing recommendations.

Failure of the approval mechanism must never silently convert a restricted action into an autonomous action.

---

## 16. Auditability

Human intervention must remain attributable.

The system should be able to reconstruct:

Initiating Principal
        |
        v
AI Agent
        |
        v
Proposed Action
        |
        v
Policy Decision
        |
        v
Approval Request
        |
        v
Human Decision
        |
        v
Final Policy Check
        |
        v
Execution / Rejection

This establishes the foundation for the observability and audit architecture defined by ADR-016.

---

## 17. Consequences

### Positive

- Preserves meaningful human control.
- Provides consistent approval workflows.
- Supports controlled AI autonomy.
- Prevents silent execution of restricted actions.
- Supports multiple communication channels.
- Improves accountability and auditability.
- Provides a foundation for WhatsApp-based human intervention.
- Prevents approval requirements from being bypassed through alternate AI pathways.

### Negative

- Introduces additional workflow complexity.
- Some operations may experience additional latency.
- Approval infrastructure requires monitoring and availability.
- Poorly designed approval workflows may create user friction.

### Trade-offs

Essentials Mart prioritises **appropriate human control over maximum automation**.

Human intervention should be required where justified by authority, risk, policy, or explicit user preference rather than indiscriminately for every AI action.

---

## 18. Alternatives Considered

### Alternative A — Fully Autonomous AI

Allow AI agents to execute all technically available operations.

**Rejected because:**  
This conflicts with the authority boundaries established by ADR-009 and removes meaningful human control over consequential operations.

### Alternative B — Human Approval for Every AI Action

Require human approval for every AI-generated action.

**Rejected because:**  
This would unnecessarily reduce automation, increase friction, and undermine the value of controlled AI autonomy.

### Alternative C — Agent-Specific Approval Logic

Allow individual AI agents to implement their own approval mechanisms.

**Rejected because:**  
This would create inconsistent governance and make enterprise-wide enforcement difficult.

### Alternative D — Policy-Governed Human-in-the-Loop

Use a common architectural model in which applicable policy determines when and how human intervention is required.

**Selected because:**  
It provides consistent governance while allowing different domains and workflows to apply appropriate levels of human control.

---

## 19. Implementation Implications

The implementation will eventually require mechanisms for:

- Approval requests
- Approval states
- Human identity
- Approval authentication
- Approval expiration
- Delegation
- Escalation
- Policy evaluation
- Approval audit records
- Notifications
- Multi-channel approval
- Failure handling

The specific technical implementation is intentionally deferred to the backend, identity, security, notification, and communication architectures.

---

## 20. Dependencies

This ADR depends upon:

- ADR-001 — Enterprise Architecture Principles
- ADR-004 — API & Service Architecture
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-008 — Intelligence Engine Architecture
- ADR-009 — AI Agent Governance & Permissions

It establishes requirements for:

- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 21. Related Architecture Documents

- AI-001-ai-society.md
- SECURITY-ARCHITECTURE.md
- EVENT-ARCHITECTURE.md

---

## 22. Related ADRs

- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-008 — Intelligence Engine Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-011 — Notification & Communication Architecture
- ADR-012 — WhatsApp Integration Architecture
- ADR-016 — Observability, Auditability & Trust

---

## 23. Decision Lifecycle

**Current Status:** Proposed

This ADR should be reviewed if:

- The fundamental human-control model changes.
- AI autonomy requirements materially change.
- New approval mechanisms are introduced.
- New high-impact AI capabilities are introduced.
- Regulatory requirements materially change.
- The approval architecture becomes insufficient.

Any replacement ADR must reference ADR-010 and explain the reason for changing the Human-in-the-Loop model.

---

## 24. Final Decision

> **Essentials Mart will implement a policy-governed Human-in-the-Loop architecture in which AI agents may operate autonomously only within their authorised boundaries. Actions requiring human involvement will be routed through an explicit, auditable approval, confirmation, review, or escalation workflow. Human approval will be scoped to the action for which it was granted, subject to re-evaluation before execution where necessary, and must not be bypassable through alternative agents, tools, interfaces, or communication channels.**

**ADR-010 remains authoritative unless superseded by a subsequent ADR.**
