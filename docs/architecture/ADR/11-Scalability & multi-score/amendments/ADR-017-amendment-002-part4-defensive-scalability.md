# ADR-017 Amendment 002 — Defensive Scalability Reconciliation

**Parent:** ADR-017 — Scalability & Multi-Store Architecture  
**Status:** Applied / Reconciled  
**Date:** 2026-08-22

## Decision

ADR-017's scalability model must preserve the defensive baseline as scale increases from one store to global deployment.

Part 4 Commit 023 establishes that scaling traffic, stores, users, AI agents, telemetry, events and partners must not weaken authentication, authorisation, isolation, monitoring, abuse controls, resilience or assurance.

Part 4 Commit 020 additionally establishes resilience requirements for regional and multi-store operation.

## Rule

Scaling mechanisms must scale defensive controls with workload rather than bypass them.

## Closure

Resolves GAP-005.