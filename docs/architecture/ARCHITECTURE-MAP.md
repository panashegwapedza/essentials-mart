# Essentials Mart — Architecture Map

**Status:** Baseline  
**Date:** 2026-08-23

## 1. Purpose

This document provides the high-level map of the Essentials Mart architecture corpus. It is a navigation and relationship document, not a replacement for the authoritative ADR, EDA, EIP, UXA or AI architecture records.

## 2. Architecture Layers

```text
                           ESSENTIALS MART
                                  |
                    +-------------+-------------+
                    |                           |
             Enterprise Architecture      Experience / AI
                    |                           |
          +---------+---------+          +------+------+
          |                   |          |             |
         EDA                 ADR        UXA            AIA
          |                   |          |             |
          |            +------+-----+    |       AI Society
          |            |            |    |             |
          |       Decisions     Governance |       Agents / Engines
          |            |            |    |             |
          +------------+------------+----+-------------+
                       |
                      EIP
                       |
          Reusable integration patterns
                       |
          +------------+-------------+
          |            |             |
       Events       Commands      External
       / streams    / requests     partners
          |            |             |
          +------------+-------------+
                       |
                 Implementation
                       |
              Services / clients / data
                       |
                 Runtime evidence
```

## 3. Enterprise Architecture

The EDA layer establishes enterprise capabilities and ownership boundaries.

Current records include:

- EDA-001 — Enterprise Data Architecture
- EDA-002 — External Partner Commerce, Distribution & Financial Integration
- EDA-003 — Household Subscription, Fulfilment & Multimodal Delivery Architecture

## 4. Architecture Decision Records

ADR-001 through ADR-018 form the original architecture baseline.

ADR-019 extends the architecture with a provider-neutral External Partner Integration Boundary.

ADR-020 extends the architecture with customer-configurable subscription and shared resource-aware multimodal delivery capabilities.

Supporting forward-consistency, amendment and closure records preserve the relationship between later decisions and earlier decisions.

## 5. Enterprise Integration Patterns

The EIP layer defines reusable messaging and integration patterns, including:

- event notification;
- publish-subscribe;
- event streams;
- command messages;
- request-reply;
- routing and filtering;
- dead-letter handling;
- retry and redelivery;
- idempotent consumption;
- saga orchestration;
- transactional outbox;
- correlation and distributed tracing;
- human-in-the-loop routing;
- external partner adapter/gateway;
- resource-aware multimodal delivery orchestration.

EIPs are reusable patterns. They do not become independent sources of business ownership.

## 6. Experience Architecture

UXA-001 defines the shopping experience architecture.

Walk Mode is governed by ADR-014 and remains explicitly divided into:

- Manual Mode;
- Autopilot Mode;
- AI Assisted Mode.

## 7. AI Architecture

AIA-001 establishes the AI Society architecture. ADR-007 through ADR-010 provide the principal governance decisions for AI society structure, intelligence engines, agent permissions and human control.

The governing invariant is:

> **AI capability does not imply AI authority.**

## 8. Cross-Cutting Architecture

The following cross-cutting concerns span multiple layers:

```text
Security
  |
Identity / Authorisation
  |
Data Ownership
  |
Eventing / Contracts
  |
Observability / Auditability / Trust
  |
Scalability / Multi-Store
  |
Deployment / Environment
```

These are governed primarily through ADR-004 through ADR-006 and ADR-015 through ADR-018, with related EIPs and EDAs where applicable.

## 9. External Integration Flow

```text
External Partner
      |
      v
Partner Integration Boundary
      |
      v
Partner Adapter / Gateway
      |
      v
Canonical Contract
      |
      v
Owning Domain
      |
      +--> Events / Commands
      +--> Fulfilment
      +--> Delivery
      +--> Notifications
      +--> Audit / Observability
```

The partner boundary prevents provider-specific APIs and credentials from becoming core domain dependencies.

## 10. Architecture-to-Implementation Flow

```text
Business / Platform Capability
            |
            v
EDA / Domain Ownership
            |
            v
ADR / Architectural Decision
            |
            v
EIP / Reusable Integration Pattern
            |
            v
Requirement / Change
            |
            v
Implementation
            |
            v
Verification
            |
            v
Release
            |
            v
Runtime Evidence
```

Material changes must remain traceable through this chain.

## 11. Source-of-Truth Rule

The architecture map is a navigation layer. The authoritative decision remains in the relevant architecture record:

- enterprise capability → EDA;
- architectural decision → ADR;
- reusable integration pattern → EIP;
- shopping experience architecture → UXA;
- AI architecture → AIA.

No document in this map should silently redefine another document's authority.

## 12. Governance Rule

A new architectural capability must identify:

1. its owning architecture layer;
2. its dependencies;
3. affected decisions and patterns;
4. direct and secondary impacts;
5. required amendments;
6. forward-consistency status;
7. implementation traceability.

This map should be updated when the architecture corpus gains a new top-level architectural layer, materially changes its relationships, or introduces a new enterprise capability family.
