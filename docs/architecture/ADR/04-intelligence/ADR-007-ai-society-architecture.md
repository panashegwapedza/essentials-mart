# ADR-007 — AI Society Architecture

**Status:** Proposed
**Date:** 2026-08-11
**Decision Type:** AI Architecture

---

## 1. Context

Essentials Mart is not intended to use AI as a collection of isolated features.

The platform is intended to contain a coordinated **AI Society** in which specialised AI agents and Intelligence Engines collaborate to assist customers, households, store operations, fulfilment, delivery, commerce, and the wider enterprise.

The AI Society may eventually contain agents responsible for areas such as:

* Household assistance
* Shopping
* Product discovery
* Recommendations
* Inventory intelligence
* Pricing intelligence
* Customer support
* Delivery coordination
* Store operations
* Personalisation
* Notifications
* Demand forecasting
* Fraud and risk analysis
* Enterprise intelligence
* Walk Mode assistance

These agents will have different responsibilities, capabilities, permissions, and information requirements.

A collection of independent AI features would create duplicated reasoning, inconsistent behaviour, conflicting recommendations, and uncontrolled access to enterprise capabilities.

Essentials Mart therefore requires an architecture in which AI agents operate as members of a coordinated system rather than as unrelated features.

---

## 2. Problem

The platform needs to determine:

* What constitutes an AI agent;
* What constitutes an Intelligence Engine;
* How agents communicate;
* How agents collaborate;
* How agents receive context;
* How agents interact with enterprise domains;
* How authority is assigned;
* How conflicts are resolved;
* How human authority is preserved;
* How AI actions are audited;
* How agents can be added without destabilising the platform.

Without a defined AI Society architecture, AI functionality could gradually become a collection of tightly coupled prompts, APIs, and autonomous processes with no coherent governance model.

---

## 3. Decision

Essentials Mart will adopt an **AI Society architecture** consisting of specialised, governed AI agents and Intelligence Engines operating within explicit enterprise boundaries.

The AI Society will be treated as an architectural subsystem of the enterprise rather than as a collection of UI features.

The architecture will distinguish between:

### AI Agents

Actors capable of:

* Receiving goals or tasks;
* Reasoning over authorised context;
* Calling authorised capabilities;
* Collaborating with other agents;
* Producing recommendations;
* Requesting actions;
* Executing authorised actions;
* Escalating decisions when required.

### Intelligence Engines

Specialised computational or AI capabilities responsible for producing intelligence from enterprise data.

Examples may include:

* Recommendation Engine
* Demand Forecasting Engine
* Inventory Intelligence Engine
* Pricing Intelligence Engine
* Customer Intelligence Engine
* Delivery Optimisation Engine

An Intelligence Engine does not automatically possess authority to execute enterprise actions.

### AI Society

The coordinated system through which agents and Intelligence Engines collaborate under enterprise governance.

---

## 4. Rationale

A society model allows Essentials Mart to distribute intelligence according to responsibility.

For example:

```text id="1j4fzw"
                         AI SOCIETY
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        Household AI     Shopping AI      Store AI
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
                       Intelligence Engines
                              │
                              ▼
                       Enterprise Domains
```

The AI Society does not replace the enterprise domains.

Instead:

> **Enterprise domains own business state.**

> **Intelligence Engines produce intelligence.**

> **AI agents reason, coordinate, recommend, and request or perform authorised actions.**

This separation prevents AI from becoming an alternative business architecture.

---

## 5. Architectural Principles

The AI Society will follow these principles:

### 5.1 Specialisation

Agents should have clearly defined responsibilities.

### 5.2 Least Authority

Agents receive only the capabilities required for their responsibilities.

### 5.3 Domain Respect

Agents interact with enterprise domains through authorised interfaces.

### 5.4 Explicit Identity

Every agent must have an identifiable identity.

### 5.5 Human Authority

AI does not automatically supersede human authority.

### 5.6 Auditability

AI decisions and actions must be attributable and reviewable.

### 5.7 Controlled Collaboration

Agents may collaborate through governed communication mechanisms.

### 5.8 Separation of Intelligence and Authority

The ability to determine what should happen does not automatically grant permission to make it happen.

### 5.9 Contextual Reasoning

Agents should receive relevant context rather than unrestricted enterprise data.

### 5.10 Replaceability

Individual agents and Intelligence Engines should be replaceable without redesigning the entire enterprise.

---

## 6. AI Society Model

The AI Society will conceptually operate as:

```text id="y5u6pi"
                         ENTERPRISE
                             │
                             ▼
                      AI GOVERNANCE
                             │
                             ▼
                       AI SOCIETY
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
       Agents           Intelligence        Orchestration
                           Engines
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
                    Enterprise Capabilities
                             │
                             ▼
                         Domains
```

The AI Society therefore sits **above enterprise domains as a consumer and orchestrator of intelligence**, while remaining subordinate to enterprise authority and governance.

---

## 7. Agent Responsibilities

Each AI agent should have an explicit responsibility.

An agent definition should conceptually contain:

```text id="l1m0or"
Agent
├── Identity
├── Purpose
├── Responsibilities
├── Accessible Domains
├── Allowed Capabilities
├── Restricted Capabilities
├── Context Requirements
├── Collaboration Rules
├── Escalation Rules
├── Human Approval Requirements
└── Audit Requirements
```

An agent should not become a general-purpose administrator of the enterprise simply because its underlying model is capable of performing many tasks.

---

## 8. Agent Collaboration

Agents may collaborate when a task crosses multiple areas of responsibility.

For example:

```text id="z6k1eu"
Customer
   │
   ▼
Household AI
   │
   ├── Shopping Agent
   │       │
   │       └── Recommendation Engine
   │
   ├── Inventory Agent
   │       │
   │       └── Inventory Intelligence
   │
   └── Delivery Agent
           │
           └── Delivery Optimisation
```

The collaborating agents should not directly manipulate one another's internal state.

They should exchange structured requests, responses, events, or governed messages.

---

## 9. AI Orchestration

The AI Society will require an orchestration mechanism capable of:

* Routing tasks;
* Selecting appropriate agents;
* Managing agent collaboration;
* Managing context;
* Enforcing permissions;
* Tracking execution;
* Handling failures;
* Managing retries;
* Escalating decisions;
* Maintaining correlation across multi-agent workflows.

The orchestrator must not become an unrestricted super-agent.

Its role is to coordinate the system according to defined policies.

---

## 10. Context Architecture

AI agents should receive context according to their responsibilities.

Context may include:

* Customer context
* Household context
* Product context
* Inventory context
* Order context
* Store context
* Delivery context
* Conversation context
* Historical context
* Intelligence outputs

Access to context must remain subject to authorisation.

The platform should avoid indiscriminately passing entire enterprise datasets into model context.

This reduces:

* Privacy exposure
* Token consumption
* Security risk
* Context confusion
* Unnecessary coupling

---

## 11. Agent-to-Domain Interaction

AI agents will not directly manipulate enterprise databases.

The preferred pattern is:

```text id="l3k8pf"
AI Agent
    │
    ▼
AI Governance / Policy
    │
    ▼
Authorised API / Capability
    │
    ▼
Enterprise Domain
    │
    ▼
Authoritative State
```

This preserves the decisions established by ADR-004 and ADR-005.

---

## 12. Agent-to-Agent Interaction

Agent communication must be governed.

An agent may request another agent's assistance where permitted.

For example:

```text id="0k7l9w"
Shopping Agent
      │
      │ Request inventory assessment
      ▼
Inventory Agent
      │
      ▼
Inventory Intelligence
      │
      ▼
Result
```

The Shopping Agent does not automatically inherit the Inventory Agent's permissions.

Agent collaboration therefore transfers **information or requests**, not unrestricted authority.

---

## 13. Intelligence Engine Architecture

Intelligence Engines will provide specialised intelligence to agents and enterprise domains.

For example:

```text id="v5m2qn"
Enterprise Data
      │
      ▼
Intelligence Engine
      │
      ├── Prediction
      ├── Recommendation
      ├── Classification
      └── Optimisation
              │
              ▼
          AI Agent
```

Intelligence Engines may consume large amounts of enterprise information where authorised, but their outputs remain governed data products.

They do not automatically receive permission to perform the actions suggested by their outputs.

ADR-008 will define this architecture in greater detail.

---

## 14. AI Society and Human Interaction

Humans remain authoritative participants in the enterprise.

The AI Society may:

* Recommend actions;
* Prepare actions;
* Execute low-risk authorised actions;
* Request approvals;
* Escalate ambiguous situations;
* Notify users of relevant events.

Where an action exceeds an agent's authority, the workflow must stop or escalate rather than silently proceed.

This establishes the foundation for ADR-010 — Human-in-the-Loop Architecture.

---

## 15. AI Society and Events

The AI Society will participate in the enterprise event architecture established by ADR-003.

Agents may subscribe to authorised events.

For example:

```text id="c1d5hv"
OrderCreated
     │
     ▼
Event Backbone
     │
     ├── Shopping Agent
     ├── Customer Agent
     ├── Inventory Agent
     └── Intelligence Engines
```

Events provide awareness.

They do not automatically provide authority.

An event consumer must still evaluate whether it is permitted to act.

---

## 16. AI Society and Identity

Every AI agent will have an explicit identity under ADR-006.

The platform must be able to determine:

* Which agent acted;
* Which user or process initiated the workflow;
* Which authority was delegated;
* Which capabilities were used;
* Which domain was affected;
* Which policy permitted the action.

This creates a complete chain of accountability.

---

## 17. Failure Handling

AI agents are probabilistic systems and may produce:

* Incorrect reasoning;
* Ambiguous results;
* Tool failures;
* Timeouts;
* Conflicting recommendations;
* Hallucinated information;
* Unexpected outputs.

The AI Society must therefore support:

* Validation;
* Confidence evaluation where appropriate;
* Tool-result verification;
* Retries;
* Fallbacks;
* Escalation;
* Human review;
* Safe termination.

AI failure must not automatically become enterprise state corruption.

Enterprise state changes must occur through controlled domain capabilities.

---

## 18. Security Impact

The AI Society will be treated as a privileged enterprise subsystem.

Security requirements include:

* Explicit agent identity
* Least privilege
* Capability-based access
* Context filtering
* Tool restrictions
* Secure agent communication
* Prompt/input protection
* Output validation
* Audit logging
* Rate limiting
* Abuse detection
* Credential isolation
* Human approval for sensitive actions

An AI model's capability must never be treated as equivalent to its authority.

**Security impact:** Foundational.

---

## 19. Observability Impact

Every significant AI workflow should be traceable.

The architecture should capture appropriate information such as:

* Agent identity
* Workflow ID
* Correlation ID
* Initiating principal
* Requested task
* Tools invoked
* Domains accessed
* Decisions produced
* Actions requested
* Actions executed
* Approval decisions
* Errors
* Final outcome

Sensitive model inputs and outputs must be handled according to applicable privacy and security policies.

Detailed observability will be established in ADR-016.

---

## 20. Consequences

### Positive

* Clear AI responsibilities.
* Reduced duplication.
* Governed AI collaboration.
* Controlled enterprise access.
* Better auditability.
* Easier introduction of new agents.
* Reusable Intelligence Engines.
* Strong separation between intelligence and authority.
* Better support for household assistance.
* Strong foundation for Walk Mode and WhatsApp AI.

### Negative

* AI orchestration introduces complexity.
* Agent communication requires governance.
* Context management becomes an architectural concern.
* AI failures require explicit handling.
* Model changes may affect behaviour.
* Testing multi-agent workflows is more difficult.

### Neutral / Trade-offs

* Not every AI capability requires an autonomous agent.
* Some intelligence can remain a simple service or engine.
* Agents may use different models where appropriate.
* The architecture does not require one universal AI model.

---

## 21. Alternatives Considered

### Alternative A — One General-Purpose AI

**Description:**
Use one large AI agent for all platform intelligence and operations.

**Why not selected:**
This creates excessive authority concentration, unclear responsibilities, larger security boundaries, and difficult governance.

---

### Alternative B — Independent AI Features

**Description:**
Implement AI separately inside each product feature.

**Why not selected:**
This creates duplicated intelligence, inconsistent behaviour, and fragmented context.

---

### Alternative C — AI Microservices Without Agent Governance

**Description:**
Create multiple AI services but allow them broad access to enterprise capabilities.

**Why not selected:**
Service decomposition alone does not provide authority, identity, or governance.

---

### Alternative D — Governed AI Society

**Description:**
Create specialised agents and Intelligence Engines operating through explicit identity, permissions, orchestration, and domain boundaries.

**Why selected:**
This provides the flexibility and intelligence required while maintaining enterprise control.

---

## 22. Implementation Implications

The AI architecture will eventually require:

* Agent registry
* Agent identity
* Agent capability registry
* Agent permissions
* Agent orchestration
* Agent communication
* Context management
* Tool registry
* Intelligence Engine registry
* Model management
* Prompt/version management
* Evaluation framework
* Guardrails
* Human escalation
* AI audit trail
* Cost controls
* AI observability

These components will be designed progressively through subsequent ADRs and backend architecture.

---

## 23. Dependencies

This ADR depends upon:

* ADR-001 — Enterprise Architecture Principles
* ADR-002 — Domain-Driven Enterprise Architecture
* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation

It establishes the foundation for:

* ADR-008 — Intelligence Engine Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-010 — Human-in-the-Loop Architecture
* ADR-011 — Notification & Communication Architecture
* ADR-012 — WhatsApp Integration Architecture
* ADR-014 — Walk Mode / Living Digital Supermarket
* ADR-016 — Observability, Auditability & Trust

---

## 24. Related Architecture Documents

* `AI-001-ai-society.md`
* `DOMAINS.md`
* `EVENT-ARCHITECTURE.md`
* `SECURITY-ARCHITECTURE.md`

---

## 25. Related ADRs

* ADR-001 — Enterprise Architecture Principles
* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation
* ADR-008 — Intelligence Engine Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-010 — Human-in-the-Loop Architecture
* ADR-016 — Observability, Auditability & Trust

---

## 26. Decision Lifecycle

**Current Status:** Proposed

### Review Conditions

This ADR should be reviewed if:

* The AI Society model changes fundamentally.
* Agent responsibilities become difficult to maintain.
* AI governance requirements change.
* New categories of autonomous AI are introduced.
* Regulatory requirements impose additional AI controls.
* Intelligence Engines and agents require a fundamentally different interaction model.

### Supersession

If this decision is replaced, the replacement ADR must reference ADR-007 and explain why the AI Society architecture has changed.

---

## 27. Final Decision

> **Essentials Mart will implement a governed AI Society consisting of specialised AI agents and Intelligence Engines that collaborate through controlled orchestration, explicit identity, authorised capabilities, enterprise events, and domain APIs. AI agents will not become alternative owners of enterprise state, and intelligence will not automatically confer authority. Human and enterprise governance remain superior to AI autonomy.**

**ADR-007 remains authoritative unless superseded by a subsequent ADR.**
