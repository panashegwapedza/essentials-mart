# Enterprise Entity Catalogue

**Status:** Draft
**Phase:** 2 — Information Architecture
**Date:** 2026-08-23

## 1. Purpose

This catalogue establishes the first logical inventory of authoritative enterprise entities for Essentials Mart.

It is intentionally a logical model. It does not prescribe tables, columns, ORM models or storage technology.

## 2. Ownership rule

Every authoritative entity has one owning domain. Other domains may consume approved views, capabilities, events or read models without acquiring ownership.

## 3. Core entity catalogue

| Domain | Entity | Purpose | Authoritative owner |
|---|---|---|---|
| Identity & Access | User | Platform identity subject | Identity & Access |
| Identity & Access | Identity | Authentication identity record | Identity & Access |
| Identity & Access | Session | Authenticated session | Identity & Access |
| Identity & Access | Device | Registered client device | Identity & Access |
| Identity & Access | Role | Authorisation role | Identity & Access |
| Identity & Access | Permission | Authorisation capability | Identity & Access |
| Household | Household | Household aggregate | Household |
| Household | Household Member | Membership and role within household | Household |
| Household | Household Role | Household-specific authority | Household |
| Household | Shopping List | Shared household shopping intent | Household |
| Household | Shopping List Item | Item within shopping intent | Household |
| Household | Pantry | Household stock representation | Household |
| Household | Pantry Item | Pantry-held product state | Household |
| Household | Household Budget | Household spending constraint | Household |
| Household | Household Goal | Household planning objective | Household |
| Household | Household Wallet | Household financial capability | Household |
| Product | Product | Sellable product identity | Product |
| Product | Brand | Brand identity | Product |
| Product | Category | Product classification | Product |
| Product | Product Attribute | Structured product attribute | Product |
| Product | Product Specification | Product specification | Product |
| Product | Product Substitute | Approved product substitution relationship | Product |
| Store | Store | Physical store | Store |
| Store | Store Department | Store department | Store |
| Store | Aisle | Store navigation area | Store |
| Store | Shelf | Physical shelf location | Store |
| Store | Store Layout | Spatial representation of store | Store |
| Inventory | Inventory Record | Authoritative stock state | Inventory |
| Inventory | Inventory Movement | Stock movement fact | Inventory |
| Inventory | Stock Availability | Availability state exposed to consumers | Inventory |
| Inventory | Inventory Reservation | Reserved stock | Inventory |
| Commerce | Cart | Current commerce intent | Commerce |
| Commerce | Cart Item | Product within cart | Commerce |
| Commerce | Checkout Session | Checkout process state | Commerce |
| Commerce | Order | Authoritative customer order | Commerce |
| Commerce | Order Item | Item within order | Commerce |
| Commerce | Payment Transaction | Payment transaction record | Commerce |
| Commerce | Refund | Reversal/refund record | Commerce |
| Fulfilment | Fulfilment Request | Request to fulfil an order | Fulfilment |
| Fulfilment | Fulfilment Task | Operational fulfilment work | Fulfilment |
| Delivery | Delivery | Customer delivery lifecycle | Delivery |
| Delivery | Delivery Stop | Location-specific delivery stop | Delivery |
| Delivery | Delivery Assignment | Assignment of delivery work | Delivery |
| Notification | Notification | Outbound communication intent | Notification |
| Notification | Notification Delivery | Channel-specific delivery attempt | Notification |
| AI Society | Agent | Governed AI actor definition | AI Society |
| AI Society | Agent Capability | Capability available to an agent | AI Society |
| AI Society | Agent Authority Grant | Scoped authority granted to an agent | AI Society |
| AI Society | AI Decision Record | Traceable AI decision record | AI Society / Observability boundary |
| AI Society | Agent Task | Governed agent work item | AI Society |
| Intelligence | Intelligence Engine | Governed intelligence capability | Intelligence |
| Intelligence | Intelligence Output | Produced intelligence result | Intelligence |
| Intelligence | Forecast | Forecast result with provenance | Intelligence |
| Intelligence | Recommendation | Decision-support recommendation | Intelligence |
| Walk Mode | Walk Session | Active shopping navigation session | Walk Mode |
| Walk Mode | Route | Planned navigation route | Walk Mode |
| Walk Mode | Waypoint | Navigational point | Walk Mode |
| Walk Mode | Shopping Action | User/AI shopping action during Walk Mode | Walk Mode |
| Partner | Partner | External enterprise partner | Partner Integration |
| Partner | Partner Capability | Capability exposed by a partner | Partner Integration |
| Partner | Partner Agreement | Governed relationship/terms | Partner Integration |
| Subscription | Subscription | Subscription lifecycle | Subscription |
| Subscription | Subscription Plan | Available subscription offering | Subscription |
| Subscription | Subscription Entitlement | Capability granted through subscription | Subscription |
| Community | Community | Community boundary | Community |
| Community | Community Member | Membership | Community |
| Community | Community Post | User/community content | Community |
| Engagement | Loyalty Account | Customer loyalty state | Engagement |
| Engagement | Reward | Reward entitlement/record | Engagement |
| Analytics | Analytical Dataset | Governed analytical representation | Analytics |
| Analytics | Metric Definition | Shared metric semantics | Analytics |
| Enterprise | Supplier | Supplier identity | Supplier |
| Enterprise | Procurement Record | Enterprise procurement record | Embedded ERP / Procurement boundary |
| Enterprise | Warehouse | Warehouse identity | Embedded ERP / Warehouse boundary |
| Enterprise | Enterprise Financial Record | Enterprise financial record | Embedded ERP / Finance boundary |
| Audit | Audit Record | Immutable evidence of governed activity | Observability & Audit |
| Audit | Correlation Record | Cross-system trace context | Observability & Audit |

## 4. Deliberate exclusions

The following are not treated as authoritative entities in this catalogue merely because they may appear in APIs or analytics:

- DTOs;
- API response objects;
- UI state;
- cached projections;
- search indexes;
- analytics views;
- AI prompts;
- model embeddings;
- temporary workflow messages.

These may have their own storage representations, but they do not acquire domain ownership by existing.

## 5. Initial modelling rule

This catalogue is a starting logical inventory. Aggregate boundaries, relationships, identifiers and lifecycle rules must be resolved before the database blueprint is frozen.
