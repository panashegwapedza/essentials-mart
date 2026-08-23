# Essentials Mart — Information Architecture

**Status:** In Progress
**Phase:** 2 — Information Architecture
**Date:** 2026-08-23

## Purpose

This directory defines the information architecture that follows from the Enterprise Architecture.

It is the blueprint between enterprise/domain architecture and the eventual database and service implementation.

The information architecture defines:

- enterprise entities;
- entity ownership;
- aggregate boundaries;
- identifiers;
- relationships;
- lifecycle states;
- event ownership and semantics.

## Governing principle

> The database must implement the architecture, not define it.

Information architecture therefore precedes physical database schema design.

## Source of truth

The information architecture is derived from and constrained by:

1. EDA — Enterprise Domain Architecture;
2. ADRs — Architecture Decision Records;
3. EIPs — Enterprise Integration Patterns;
4. approved enterprise/domain boundaries;
5. security, identity, auditability and trust constraints.

This layer must not create a competing source of truth for domain ownership.

## Phase 2 sequence

```text
Enterprise Domains
        ↓
Entity Catalogue
        ↓
Aggregate Boundaries
        ↓
Identifier Strategy
        ↓
Domain Relationships
        ↓
Entity Lifecycles
        ↓
Event Ownership Matrix
        ↓
Phase 2 Consistency Review / Freeze
        ↓
Database Blueprint
```

## Authoritative Phase 2 corpus

- `ENTITY-CATALOGUE.md` — authoritative enterprise entity vocabulary, ownership and identity references.
- `RELATIONSHIPS-AGGREGATE-MAP.md` — aggregate boundaries, relationships and consistency expectations.
- `IDS-001-ids-and-identity-strategy.md` — enterprise identifier strategy.
- `OWNERSHIP-DATA-BOUNDARIES.md` — data ownership and boundary rules.
- `ENTITY-LIFECYCLES.md` — lifecycle states and transitions.
- `EVENT-OWNERSHIP-MATRIX.md` — authoritative event ownership and integration semantics.
- `commerce/COMMERCE-ENTITY-VALUE-OBJECT-MODEL.md` — detailed Commerce entity/value-object model.
- `PHASE-2-CONSISTENCY-REVIEW.md` — Phase 2 gate and freeze decision.

## Phase 2 rules

- Domain ownership must remain explicit.
- An entity has one authoritative owner.
- Read models and projections do not become source-of-truth entities.
- Cross-domain relationships must not create accidental shared ownership.
- Identifiers must support distributed operation and long-term scale.
- Lifecycle transitions must be explicit and auditable.
- Events represent facts owned by their source domain.
- AI and analytics may consume information but do not silently acquire ownership of operational records.
- Physical schema decisions wait until the logical information model is approved.
