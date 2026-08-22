# ADR-015 Amendment 002 — Part 4 Defensive Baseline Reconciliation

**Parent:** ADR-015 — Security & Anti-Replication Architecture  
**Status:** Applied / Reconciled  
**Date:** 2026-08-22

## Scope Separation

ADR-015 remains the foundational architectural decision for security and anti-replication.

EDA-001 Part 4 is the detailed defensive baseline governing the operational controls required to protect the platform.

## Part 4 Mapping

The anti-replication decision is implemented through layered controls covering business-logic isolation, intelligence protection, data protection, commerce abuse, API defence, trust, authenticity, monitoring, automated containment, incident response, resilience, adversarial verification, IP protection, scalability, governance and assurance.

## Authority Rule

ADR-015 does not override a specific Part 4 defensive requirement. Where the documents overlap, ADR-015 supplies the architectural intent and Part 4 supplies the detailed defensive constraint.

Client hardening, obfuscation and WebAssembly remain cost-increasing measures rather than trusted security boundaries. Authoritative logic and secrets remain server-side.

## Closure

Resolves GAP-003. ADR-015 remains active and does not require reversal.