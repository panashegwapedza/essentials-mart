# ADR-018 Amendment 002 — Part 4 Defensive Deployment Reconciliation

**Parent:** ADR-018 — Deployment & Environment Strategy  
**Status:** Applied / Reconciled  
**Date:** 2026-08-22

## Decision

Deployment architecture must satisfy the Part 4 requirements for infrastructure defence, environment isolation, supply-chain protection, resilience, monitoring, incident response and global defensive scalability.

Relevant baseline commitments are Part 4 004, 009, 020 and 023.

Production, staging, development and recovery environments must not silently inherit weaker or uncontrolled trust relationships merely because deployment topology changes.

## Closure

Resolves GAP-006.