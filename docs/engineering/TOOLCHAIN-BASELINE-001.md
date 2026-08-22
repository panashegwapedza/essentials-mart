# TOOLCHAIN-BASELINE-001 — Development Toolchain Foundation

**Document ID:** TOOLCHAIN-BASELINE-001  
**Title:** Development Toolchain Foundation  
**Project:** Essentials Mart  
**Status:** Baseline  
**Parent:** EIP-027, BUILD-BASELINE-001  
**Date:** 22 August 2026

## 1. Purpose

This baseline establishes the minimum engineering-tooling controls required before production application development begins.

It exists to make builds reproducible, changes reviewable, dependencies governable, and quality/security checks automatable.

## 2. Principles

1. Tooling must support the architecture rather than redefine it.
2. Formatting and linting are automated wherever practical.
3. Tests are first-class build artefacts.
4. Dependencies must be explicit and reviewable.
5. Secrets must never be committed to source control.
6. CI must provide repeatable validation.
7. Security checks must run before release.
8. Tool versions must be pinned or otherwise reproducibly resolved.
9. Generated artefacts must be distinguishable from source.
10. A failing mandatory gate must block progression to the next environment.

## 3. Baseline Toolchain Layers

### Repository

- Git and GitHub are the source-control baseline.
- `main` represents the protected integration baseline.
- Changes should enter through reviewed commits or pull requests as repository governance matures.

### Editor and formatting

`.editorconfig` establishes common encoding, line endings, whitespace and indentation rules.

Language-specific formatters remain authoritative for their ecosystems.

### Static analysis

Each implementation language must use its ecosystem-standard formatter, linter and static-analysis tooling.

No single language tool is imposed across the entire repository.

### Testing

Testing is layered:

- unit;
- component/module;
- integration;
- contract;
- end-to-end;
- security;
- resilience;
- performance where required.

### Dependency management

Dependencies must be declared through the native package manager of each implementation ecosystem.

Lockfiles or equivalent deterministic resolution mechanisms must be committed where supported.

Unnecessary dependencies are prohibited.

### Secrets and configuration

Configuration is environment-specific.

Secrets must be supplied through approved secret/configuration mechanisms and must not be stored in source code, test fixtures or committed environment files.

### CI

CI must progressively validate:

1. repository structure;
2. formatting;
3. linting/static analysis;
4. tests;
5. dependency/security checks;
6. build/package creation;
7. provenance and release evidence where applicable.

## 4. Supply-Chain Controls

The engineering toolchain must support dependency provenance, vulnerability detection and release traceability.

Software Bill of Materials generation should be introduced for releasable software as the build pipeline matures.

Third-party and open-source dependencies must be reviewable before adoption and monitored thereafter.

## 5. Environment Separation

The toolchain recognises at minimum:

- local development;
- CI;
- test;
- staging;
- production.

Credentials, data and deployment permissions must remain appropriately separated.

## 6. Architecture Enforcement

Tooling should eventually enforce architectural boundaries mechanically where practical, including:

- forbidden dependency directions;
- domain boundary violations;
- accidental cross-database access;
- direct access to protected infrastructure;
- client-side inclusion of server-only logic;
- and unauthorised event/schema changes.

## 7. Build Gate

A change is not implementation-ready merely because it compiles.

A change must satisfy the applicable quality, security, test, architecture and traceability gates defined by the build baseline.

## 8. Evidence

The CI system should retain sufficient evidence to establish:

- source revision;
- build result;
- test result;
- dependency state;
- security-check result;
- produced artefact identity;
- and deployment provenance where applicable.

## 9. Relationship to Architecture

This document implements the engineering controls required by EIP-027 and BUILD-BASELINE-001.

It does not redefine:

- domain ownership;
- service boundaries;
- data ownership;
- event semantics;
- AI authority;
- security architecture;
- or deployment architecture.

Where tooling reveals a conflict with an architectural decision, the conflict must be recorded and resolved through the established architecture amendment process.

## 10. Exit Criteria

The development toolchain foundation is considered established when:

- repository formatting rules are active;
- language-specific tooling is defined for each implemented ecosystem;
- CI executes mandatory checks;
- dependency management is deterministic;
- secrets are excluded from source control;
- test execution is automated;
- security/dependency scanning is incorporated into the pipeline;
- and build evidence is retained.

## 11. Next Milestone

The next implementation milestone is the **Platform Foundation**, beginning with the backend/runtime and shared infrastructure required by the first vertical commerce slice.
