# Essentials Mart — Architecture Definition of Terms

## Purpose

This document provides the canonical definitions of recurring architecture terms used across the Essentials Mart architecture corpus.

## Core Terms

### ADR — Architecture Decision Record

A durable record of an architectural decision, including context, decision, consequences, dependencies, and governance implications. An ADR explains **why** an architectural choice was made.

### EDA — Enterprise Data Architecture

The enterprise-level architecture defining authoritative data ownership, domains, bounded contexts, data boundaries, governance, and the principles governing enterprise data.

### EIP — Enterprise Integration Pattern

A reusable integration mechanism defining **how** systems, domains, services, agents, channels, or external participants communicate or coordinate. EIPs implement architectural intent; they do not replace ADRs or EDAs.

### Architecture Corpus

The governed collection of ADRs, EDAs, EIPs, UX/AIA architecture records, amendments, forward-consistency records, and related architectural documentation.

### Forward-Consistency Check

A review performed when an architectural change is introduced to identify direct and secondary impacts on existing architecture records, dependencies, contracts, boundaries, capabilities, security controls, and operational behaviour.

### Source of Truth

The authoritative owner of a piece of information, state, capability, or architectural responsibility. Other components may consume or project that information but must not silently create competing authority.

### Domain

A coherent area of business responsibility with defined ownership, capabilities, data responsibilities, policies, and boundaries.

### Bounded Context

A deliberately defined boundary within which a domain model, terminology, contracts, and ownership rules are consistent.

### Contract

A governed agreement describing an interface or exchanged message, including structure, semantics, compatibility expectations, authority boundaries, and evolution rules.

### API Contract

The governed contract for synchronous interaction between consumers and a service or capability.

### Event Contract

The governed contract describing an asynchronous message representing a fact that occurred, including schema, semantics, versioning, compatibility, and consumer expectations.

### Event

A representation of a fact that has occurred. Events communicate facts; they do not inherently grant the receiver authority to perform an action.

### Command

An explicit request for an authorised participant to perform an action. A command expresses intent; it is not proof that the action occurred.

### Query

A request for information without requesting a state-changing action.

### AI Society

The coordinated ecosystem of specialised AI agents and Intelligence Engines within Essentials Mart. Agents operate as governed members of a larger system rather than isolated AI features.

### AI Agent

A governed software intelligence component capable of interpreting objectives, using authorised capabilities, and producing or executing actions within explicitly defined authority boundaries.

### Intelligence Engine

A reusable intelligence capability providing analysis, prediction, optimisation, ranking, inference, or other specialised intelligence to authorised agents and platform capabilities.

### Human-in-the-Loop

A governance mechanism in which a human retains required authority to review, approve, reject, intervene in, or take over consequential actions according to policy.

### Walk Mode

The Essentials Mart shopping experience using navigation, product recognition, basket interaction, and AI assistance to support movement through a store. Walk Mode has three distinct operating modes: **Manual**, **Autopilot**, and **AI Assisted**.

### Observability

The ability to understand system behaviour from emitted telemetry such as logs, metrics, traces, events, and operational signals.

### Auditability

The ability to reconstruct and examine material actions, decisions, changes, approvals, and outcomes using retained evidence.

### Trust

The architectural property that allows users, operators, and governed systems to understand, verify, and appropriately rely on system behaviour and decisions.

### Release

A governed promotion of an identifiable platform state into an operational environment. A successful deployment alone does not constitute a governed release.

### Incident

A material event or condition that negatively affects, or threatens to affect, confidentiality, integrity, availability, security, customer outcomes, financial correctness, or operational continuity.

### Resilience

The capability of the platform to continue providing required services, degrade safely, recover correctly, and withstand expected failures or disruptions.

### Idempotency

The property that repeated processing of the same logical request or message does not create unintended additional effects.

### Correlation

The mechanism used to associate related requests, events, commands, traces, decisions, and outcomes across distributed processing.

### External Partner

An independently operated organisation or provider that interacts with Essentials Mart through a governed integration boundary.

## Governance Rule

When a term is used differently by a new architecture document, the document must explicitly define the deviation or initiate a forward-consistency review. New documents must not silently redefine established architectural terminology.

## Relationship Summary

```text
ADR       → why an architectural decision exists
EDA       → enterprise structure, ownership and data architecture
EIP       → how integration is implemented
Contract  → what participants agree to exchange or expose
Implementation → concrete technology and code
Evidence  → how implementation and behaviour are verified
```
