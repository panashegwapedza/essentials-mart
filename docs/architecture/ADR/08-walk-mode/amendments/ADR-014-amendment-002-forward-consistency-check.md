# ADR-014 Amendment 002 — Forward-Consistency Check

**Status:** Proposed / Reviewed  
**Date:** 2026-08-27  
**Parent Decision:** ADR-014 — Walk Mode / Living Digital Supermarket Architecture  
**Amendment:** ADR-014 Amendment 002 — Walk Mode Discovery and Product Asset Fidelity

## 1. Change Under Review

The Walk Mode product thesis has been refined so that its primary purpose is to restore product visibility, incidental discovery and familiarity that physical supermarket browsing provides but conventional online shopping can remove.

The amendment also establishes high-fidelity 3D/AR product representation as an intended product requirement, with product assets remaining linked to authoritative product identity.

## 2. Direct Impacts

- Walk Mode experience architecture.
- Flutter Walk Mode presentation and spatial implementation.
- Product digital asset requirements.
- Walk Mode discovery behaviour.
- Walk Mode verification requirements.

## 3. Related Impacts

- AI authority and human-control behaviour.
- Shared server-authoritative basket capability.
- Observability and auditability of discovery versus recommendation versus purchase.
- Client security and anti-replication boundaries.
- Performance, caching and progressive rendering.

## 4. Affected ADRs

### ADR-014 — Walk Mode

**Amended:** Yes. Amendment 002 is the authoritative refinement of Walk Mode's product thesis and product asset fidelity requirements.

### ADR-007 — AI Society Architecture

**Amended:** No.

Reason: the amendment does not change the AI Society model. It applies the existing coordinated AI model to Walk Mode.

### ADR-009 — AI Agent Governance & Permissions

**Amended:** No.

Reason: the amendment reinforces that capability does not imply authority and does not introduce new authority.

### ADR-010 — Human-in-the-Loop Architecture

**Amended:** No.

Reason: customer authority and human-control requirements remain governed by the existing decision.

### ADR-013 — Flutter Client Architecture

**Amended:** No direct amendment required.

Reason: the existing client boundary already establishes Walk Mode as a feature module and keeps enterprise truth outside the client. EIP-025 Amendment 001 provides the implementation refinement.

### ADR-015 — Security & Anti-Replication Architecture

**Amended:** No.

Reason: the change strengthens the existing requirement to keep proprietary intelligence and authority outside the untrusted client environment.

### ADR-016 — Observability, Auditability & Trust

**Amended:** No direct amendment required.

Reason: existing auditability principles already support attribution and traceability. The Walk Mode implementation adds specific event distinctions through EIP-034.

### ADR-017 — Scalability & Multi-Store Architecture

**Amended:** No.

Reason: the change does not alter the multi-store ownership model. It adds fidelity and discovery requirements within each store representation.

## 5. Affected EIPs

### EIP-025 — Flutter Client Implementation Architecture

**Amended:** Yes, through EIP-025 Amendment 001.

### EIP-030 — Testing & Verification Architecture

**Amended:** No direct amendment required.

Reason: its existing Walk Mode verification section is broad enough to govern the additional verification; EIP-034 makes the new requirements concrete.

### EIP-034 — Walk Mode Spatial Discovery and Product Asset Implementation Architecture

**Added:** Yes.

Reason: the refined Walk Mode requirements warrant a dedicated implementation pattern covering spatial discovery, product asset identity, 3D/AR representation, progressive rendering and discovery telemetry.

## 6. EDA Impact

**EDA-001:** No amendment required.

The change does not introduce a new enterprise domain, change authoritative data ownership, or create a new event ownership boundary.

Walk Mode remains a consumer of authoritative product, store, inventory and commerce domains.

## 7. Secondary Impact Review

The following secondary concerns were reviewed:

- **Basket:** discovery remains separate from basket mutation and purchase.
- **AI:** recommendation remains separate from spatial product visibility.
- **Privacy:** discovery analytics must not require unrestricted movement tracking.
- **Security:** high-value ranking/discovery logic remains server-side where appropriate.
- **Performance:** progressive loading and level-of-detail are permitted without lowering the intended fidelity target.
- **Multi-store:** product assets and spatial placement remain store-contextual while product identity remains authoritative.
- **Offline:** cached assets do not imply current inventory or pricing.

No additional architectural amendment is required by this review.

## 8. Consistency Result

**Result: Consistent after amendment.**

The refined Walk Mode thesis is consistent with the existing enterprise architecture, AI authority model, Flutter client boundary, security model, observability model and multi-store strategy.

The required documentation chain is:

```text
EDA-001
   ↓
ADR-014
   ↓
ADR-014 Amendment 002
   ↓
EIP-025 Amendment 001
   ↓
EIP-034
   ↓
Flutter Walk Mode Implementation
   ↓
EIP-030 Verification
   ↓
EIP-028 Runtime Evidence
```

No implementation should proceed against the refined Walk Mode requirements without respecting this chain.
