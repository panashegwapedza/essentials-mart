# ADR-014 — Walk Mode / Living Digital Supermarket Architecture

**Status:** Proposed  
**Date:** 2026-08-12  
**Decision Type:** Experience & Spatial Architecture

---

## 1. Context

Essentials Mart is intended to provide more than conventional online grocery shopping.

The platform will provide a **Walk Mode** experience that digitally represents the physical supermarket and connects the user's digital shopping experience with the real store.

Walk Mode is intended to allow a user to interact with a Living Digital Supermarket that may contain:

- Real store locations;
- Real store layouts;
- Real products;
- Real inventory;
- Product locations;
- Shopping lists;
- Shopping carts;
- Navigation;
- AI assistance;
- Personalised recommendations;
- Household shopping context;
- Promotions;
- Store services;
- Delivery and collection options;
- Operational information.

The objective is not to create a game or an artificial virtual supermarket.

Walk Mode represents a digital interaction layer over the real-world supermarket.

The experience must therefore remain synchronised with authoritative enterprise systems while providing a responsive and intuitive client experience.

---

## 2. Problem

Without a defined Walk Mode architecture:

- The digital store could become disconnected from real inventory.
- Product locations could become inaccurate.
- Navigation could become dependent on static client data.
- Walk Mode could create duplicate product or inventory systems.
- AI recommendations could become disconnected from the user's physical context.
- Changes to store layouts could require application releases.
- Multiple stores could become difficult to support.
- Real-time operational changes could be difficult to represent.
- Privacy risks could arise from representing shoppers or movement.
- Walk Mode could accidentally become a separate platform rather than an extension of Essentials Mart.

Essentials Mart therefore requires an architecture that represents the physical supermarket digitally while preserving enterprise authority and privacy.

---

## 3. Decision

Essentials Mart will implement Walk Mode as a **spatial, context-aware client capability backed by authoritative enterprise services**.

Walk Mode will not create independent authoritative systems for products, inventory, pricing, users, orders, or stores.

Instead, it will compose information from existing enterprise domains.

The conceptual architecture is:

Physical Store
      |
      v
Store Representation
      |
      +---- Store Layout
      |
      +---- Product Locations
      |
      +---- Inventory
      |
      +---- Services
      |
      +---- Operational State
      |
      v
Walk Mode Services
      |
      v
Flutter Walk Mode Experience
      |
      v
User

---

## 4. Living Digital Supermarket

The Living Digital Supermarket will represent the current state of a physical supermarket as accurately as practical.

It may include:

- Store boundaries;
- Floors;
- Sections;
- Aisles;
- Shelves;
- Product positions;
- Service points;
- Entrances;
- Exits;
- Checkout areas;
- Collection points;
- Returns areas;
- Information points;
- Parcel collection areas;
- Other relevant store infrastructure.

The digital representation should be capable of evolving as the physical store changes.

---

## 5. Physical Store as the Source Context

The physical supermarket remains the real-world context represented by Walk Mode.

The digital representation must not be treated as a replacement for the physical environment.

Instead:

Physical Store
    |
    v
Enterprise Store Data
    |
    v
Digital Representation
    |
    v
Walk Mode

This establishes a connection between operational reality and the digital experience.

---

## 6. Store Layout Ownership

Store layout information will have an authoritative owner within the enterprise architecture.

The Walk Mode client will consume this information rather than independently defining the store.

Layout information may include:

- Store dimensions;
- Areas;
- Aisles;
- Sections;
- Product placement zones;
- Service locations;
- Navigation nodes;
- Navigation paths;
- Accessibility routes.

Changes to the physical store should be reflected through the appropriate enterprise data and synchronisation mechanisms.

---

## 7. Product Location

Products displayed in Walk Mode must be associated with authoritative product and store-location information.

A conceptual relationship is:

Product
   |
   v
Store
   |
   v
Location
   |
   v
Aisle / Section / Shelf / Position

The system must distinguish between:

- Product identity;
- Product availability;
- Product location;
- Product pricing;
- Product presentation.

These may change independently.

---

## 8. Inventory Integration

Walk Mode must use authoritative inventory information.

The experience may display:

- Available;
- Low stock;
- Out of stock;
- Limited availability;
- Unknown availability.

Inventory information must not be treated as permanently static.

Where real-time inventory cannot be guaranteed, the user interface must communicate the appropriate level of certainty.

The system should avoid presenting uncertain inventory information as guaranteed availability.

---

## 9. Shopping List Integration

The user's shopping list may become spatially aware.

For example:

Shopping List
    |
    v
Product Locations
    |
    v
Optimised Route
    |
    v
Walk Mode

The system may:

- Group products by store area;
- Suggest an efficient route;
- Identify nearby items;
- Track shopping progress;
- Highlight missing products;
- Suggest alternatives;
- Recalculate routes when products are unavailable.

---

## 10. AI Companion

The AI assistant may participate directly in Walk Mode.

The AI may assist with:

- Navigation;
- Product discovery;
- Shopping-list organisation;
- Product recommendations;
- Alternatives;
- Budget awareness;
- Household preferences;
- Dietary or preference constraints where authorised;
- Store services;
- Shopping progress.

The AI does not own store data or navigation authority.

Instead, it consumes authorised information and capabilities from the appropriate enterprise systems.

---

## 11. Context-Aware Assistance

Walk Mode may provide contextual assistance based on the user's current shopping context.

Possible context may include:

- Current store;
- Current store area;
- Current shopping list;
- Products already selected;
- Remaining shopping items;
- Inventory availability;
- Store operating state;
- User preferences;
- Household context;
- Current route.

Context must only be collected and used where appropriate and authorised.

---

## 12. Navigation

Walk Mode will provide navigation using a digital representation of the store.

The navigation system may support:

- Destination search;
- Product-to-product routing;
- Shopping-list routing;
- Accessible routes;
- Service-point navigation;
- Re-routing;
- Blocked-path handling;
- Store-area awareness.

The navigation engine should operate against a store-specific spatial model rather than hard-coded application coordinates.

---

## 13. Route Optimisation

The platform may optimise routes based on the user's shopping requirements.

For example:

User enters store
       |
       v
Shopping List
       |
       v
Product Locations
       |
       v
Route Optimisation
       |
       v
Suggested Shopping Path

Route optimisation may consider:

- Number of products;
- Product locations;
- Store layout;
- User preferences;
- Accessibility requirements;
- Current store conditions;
- Temporary restrictions.

The route remains a recommendation rather than an authoritative instruction.

---

## 14. Real-Time Store State

Where infrastructure permits, Walk Mode may incorporate real-time operational information.

Examples include:

- Temporary aisle closures;
- Store-area restrictions;
- Product availability changes;
- Checkout congestion;
- Service-point availability;
- Temporary store events.

Real-time state should be represented separately from static store structure.

---

## 15. Multi-Store Support

Walk Mode must be designed to support multiple physical stores.

The store must therefore be represented as an enterprise entity rather than a hard-coded application environment.

Conceptually:

Enterprise
   |
   +---- Store A
   |
   +---- Store B
   |
   +---- Store C
   |
   +---- Future Store

Each store may have its own:

- Layout;
- Product locations;
- Inventory;
- Services;
- Operational state;
- Navigation graph.

This establishes a foundation for ADR-017.

---

## 16. Store Layout Versioning

Store layouts may change.

The architecture must therefore support layout versioning.

A layout may transition through:

Draft
   |
   v
Published
   |
   v
Active
   |
   v
Superseded

The client must be able to determine which layout version is currently authoritative.

Historical layouts may be retained where required for auditability.

---

## 17. Spatial Data

The spatial model should support progressively richer representations.

Possible representations include:

- Store areas;
- Points;
- Lines;
- Paths;
- Polygons;
- Product locations;
- Navigation nodes;
- Navigation edges.

The architecture should avoid prematurely locking the platform to a single rendering technology.

---

## 18. Device Location

Where the user explicitly permits location-based functionality, Walk Mode may use device location to improve navigation.

Possible technologies may include:

- GPS;
- Bluetooth beacons;
- Wi-Fi positioning;
- Visual positioning;
- Other indoor-positioning technologies.

The architecture must treat positioning technology as replaceable.

Walk Mode should consume a normalised location representation rather than being tightly coupled to a specific positioning provider.

---

## 19. Location Accuracy

Indoor positioning may be imperfect.

The system must account for uncertainty.

The experience should avoid implying false precision where the underlying positioning system cannot provide it.

Where appropriate, the client may display:

- Approximate location;
- Confidence;
- Recalibration prompts;
- Navigation corrections.

---

## 20. User Privacy

Walk Mode must be privacy-first.

The system must not assume that a user's physical movement should be permanently tracked.

Location collection should be:

- Explicitly authorised where required;
- Limited to the purpose;
- Minimized;
- Protected;
- Retained only as necessary;
- Deletable according to applicable policy.

Users should be able to understand when location-based Walk Mode functionality is active.

---

## 21. Live Shopper Representation

The platform may eventually support privacy-controlled representations of shoppers within the digital supermarket.

This must not imply unrestricted real-time tracking.

If shopper representation is introduced, the system must use privacy-preserving abstractions.

For example, the platform may represent:

- Approximate congestion;
- Anonymous density;
- Busy areas;
- Availability indicators.

It should not expose identifiable shopper movement without explicit and appropriate authorisation.

---

## 22. AI and Privacy

AI agents must only receive the contextual information necessary for their authorised task.

For example, an AI navigation capability may require:

- Current store;
- Approximate location;
- Destination;
- Relevant shopping list.

It should not automatically receive unrelated personal or household information.

This follows the least-privilege principles established by ADR-009.

---

## 23. Physical-Digital Synchronisation

The Living Digital Supermarket requires synchronisation between physical operations and digital representation.

Changes may originate from:

- Store staff;
- Inventory systems;
- Product systems;
- Store-management systems;
- Enterprise services;
- Operational events.

These changes should propagate through the event-driven architecture established by ADR-003.

---

## 24. Event-Driven Updates

Examples of events that may affect Walk Mode include:

- ProductLocationChanged;
- InventoryUpdated;
- StoreLayoutPublished;
- StoreAreaClosed;
- StoreAreaOpened;
- ProductRemovedFromStore;
- ProductAddedToStore;
- StoreServiceChanged.

Walk Mode consumers may subscribe to relevant events or receive updated state through appropriate APIs.

---

## 25. Offline Behaviour

Walk Mode may cache appropriate store information to support resilience.

Cached information may include:

- Store layout;
- Navigation data;
- Product locations;
- Previously retrieved product information.

However, cached inventory and operational information must be clearly distinguished from live information.

The client must not present stale information as guaranteed current state.

---

## 26. Accessibility

Walk Mode must support users who cannot rely exclusively on visual navigation.

Where feasible, the architecture should support:

- Accessible routes;
- Voice guidance;
- Text guidance;
- Clear directional instructions;
- High-contrast visualisation;
- Screen-reader-compatible information;
- Alternative interaction modes.

Accessibility requirements should be integrated into the client architecture established by ADR-013.

---

## 27. Store Services

Walk Mode may provide navigation and information for physical store services, including:

- Service desk;
- Returns counter;
- Information point;
- Parcel collection area;
- Collection points;
- Other customer-service locations.

Where a service requires human assistance, Walk Mode should connect the user to the appropriate authorised Essentials Mart service workflow.

---

## 28. Integration with Orders and Delivery

Walk Mode may connect the physical-store experience with:

- Click-and-collect;
- Parcel collection;
- Delivery;
- Order pickup;
- Returns;
- Store fulfilment.

These capabilities remain owned by their respective enterprise domains.

Walk Mode acts as the contextual experience layer.

---

## 29. Product Discovery

A user should be able to search for a product and transition naturally from:

Product Discovery
    |
    v
Product Information
    |
    v
Store Availability
    |
    v
Store Location
    |
    v
Navigation

This provides a connection between digital shopping and physical shopping.

---

## 30. Product Alternatives

If a product is unavailable, the AI or application may recommend alternatives based on authorised intelligence.

For example:

Requested Product
      |
      v
Unavailable
      |
      v
Alternative Intelligence
      |
      v
Candidate Products
      |
      v
User Decision

The recommendation must not silently substitute the product unless the applicable user or household policy explicitly permits such behaviour.

---

## 31. Security Boundary

Walk Mode is a client-facing experience and therefore must be treated as an untrusted environment.

The client must not be trusted to determine:

- Inventory truth;
- Product pricing;
- User authority;
- Store access;
- Payment status;
- Order state.

All security-sensitive decisions remain server-side.

---

## 32. Performance

Walk Mode must remain responsive despite potentially complex spatial data.

The implementation should consider:

- Spatial-data caching;
- Incremental loading;
- Level-of-detail strategies;
- Efficient map rendering;
- Background updates;
- Network optimisation;
- Device capability;
- Battery consumption.

The architecture should support progressively richer visual experiences without requiring the entire supermarket model to be loaded simultaneously.

---

## 33. Observability

Walk Mode should provide appropriate operational telemetry for:

- Navigation failures;
- Positioning failures;
- Stale store data;
- Inventory synchronisation problems;
- Layout-version mismatches;
- Rendering failures;
- Performance problems;
- Service-point availability issues.

Telemetry must remain privacy-conscious.

---

## 34. Consequences

### Positive

- Connects digital and physical shopping experiences.
- Creates a differentiated Essentials Mart experience.
- Provides context-aware AI assistance.
- Allows shopping lists to become spatially intelligent.
- Connects products to real store locations.
- Supports real inventory integration.
- Establishes a foundation for multiple physical stores.
- Enables future indoor-positioning technologies.
- Supports accessibility-aware navigation.
- Creates a foundation for a genuinely living digital supermarket.

### Negative

- Requires accurate store and spatial data.
- Requires continuous synchronisation.
- Indoor positioning can be technically difficult.
- Real-time inventory accuracy may be limited.
- Spatial rendering increases client complexity.
- Privacy requirements become more significant when location is involved.
- Store operations must maintain accurate digital representations.

### Trade-offs

Essentials Mart prioritises **useful physical-digital integration over superficial visual complexity**.

Walk Mode will focus on providing genuine utility rather than attempting to turn the supermarket into a game.

---

## 35. Alternatives Considered

### Alternative A — Static Store Map

Provide users with a static image or map of the supermarket.

**Rejected because:**
It would not provide sufficient integration with inventory, products, navigation, AI, or changing store conditions.

### Alternative B — Independent Virtual Supermarket

Create a fully independent virtual supermarket environment.

**Rejected because:**
It would duplicate enterprise data and move the experience away from the real physical supermarket.

### Alternative C — Game-Like Virtual Store

Create a gamified digital supermarket primarily focused on exploration.

**Rejected because:**
The purpose of Walk Mode is practical shopping utility rather than gaming.

### Alternative D — Living Digital Supermarket

Represent the real supermarket digitally while connecting it to authoritative products, inventory, store data, navigation, AI, and operational systems.

**Selected because:**
It provides genuine digital-physical integration while preserving enterprise authority and creating a differentiated platform experience.

---

## 36. Implementation Implications

The implementation will eventually require:

- Store spatial model;
- Store layout management;
- Product-location mapping;
- Navigation graph;
- Route optimisation;
- Inventory integration;
- Spatial-data APIs;
- Layout versioning;
- Real-time event processing;
- Client-side spatial rendering;
- Location abstraction;
- Optional indoor positioning;
- Privacy controls;
- Store-service integration;
- AI context integration;
- Caching and synchronisation;
- Accessibility support;
- Operational telemetry.

Specific spatial technologies, positioning technologies, and rendering engines are intentionally deferred to implementation.

---

## 37. Dependencies

This ADR depends upon:

- ADR-001 — Enterprise Architecture Principles
- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-011 — Notification & Communication Architecture
- ADR-013 — Flutter Client Architecture

It establishes requirements for:

- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

---

## 38. Related Architecture Documents

- EDA-001-enterprise-data-architecture.md
- DOMAINS.md
- EVENT-ARCHITECTURE.md
- SECURITY-ARCHITECTURE.md
- AI-001-ai-society.md

---

## 39. Related ADRs

- ADR-001 — Enterprise Architecture Principles
- ADR-002 — Domain-Driven Enterprise Architecture
- ADR-003 — Event-Driven Architecture
- ADR-004 — API & Service Architecture
- ADR-005 — Data Ownership & Database Boundaries
- ADR-006 — Identity, Authentication & Authorisation
- ADR-007 — AI Society Architecture
- ADR-009 — AI Agent Governance & Permissions
- ADR-011 — Notification & Communication Architecture
- ADR-013 — Flutter Client Architecture
- ADR-015 — Security & Anti-Replication Architecture
- ADR-016 — Observability, Auditability & Trust
- ADR-017 — Scalability & Multi-Store Architecture

---

## 40. Decision Lifecycle

**Current Status:** Proposed

This ADR should be reviewed if:

- The Walk Mode concept materially changes;
- The Living Digital Supermarket becomes a separate product;
- Spatial data architecture materially changes;
- Indoor positioning becomes mandatory;
- Store representation requirements materially change;
- Privacy requirements materially change;
- Multi-store requirements require architectural revision.

Any replacement ADR must reference ADR-014 and explain the reason for changing the Walk Mode architecture.

---

## 41. Final Decision

> **Essentials Mart will implement Walk Mode as a context-aware digital representation of the physical supermarket, backed by authoritative enterprise services for store structure, products, inventory, locations, services, and operational state. Walk Mode will not be a game or an independent virtual supermarket. It will function as a Living Digital Supermarket that connects the user's digital shopping experience with the real physical store, while supporting AI assistance, intelligent navigation, shopping-list optimisation, privacy-controlled contextual information, and future multi-store operation.**

**ADR-014 remains authoritative unless superseded by a subsequent ADR.**
