# ADR-008 — Intelligence Engine Architecture

**Status:** Proposed
**Date:** 2026-08-12
**Decision Type:** AI & Intelligence Architecture

---

## 1. Context

ADR-007 established the **AI Society** as a coordinated system of specialised AI agents, Intelligence Engines, and orchestration.

The AI Society will require specialised intelligence that can be reused by multiple agents, enterprise domains, and applications.

Examples include:

* Product recommendations
* Demand forecasting
* Inventory forecasting
* Customer preference analysis
* Basket intelligence
* Pricing intelligence
* Delivery optimisation
* Store optimisation
* Fraud and anomaly detection
* Personalisation
* Household consumption forecasting
* Search and product relevance
* Walk Mode intelligence

These capabilities should not be implemented independently inside every AI agent.

If each agent develops its own intelligence, Essentials Mart could develop:

* duplicated models;
* inconsistent predictions;
* conflicting recommendations;
* repeated data processing;
* inconsistent evaluation;
* difficult model governance;
* and unnecessary computational cost.

The architecture therefore requires a dedicated concept for **Intelligence Engines**.

---

## 2. Problem

The platform must distinguish between:

* AI agents;
* Intelligence Engines;
* enterprise services;
* analytical systems;
* machine-learning models;
* deterministic algorithms;
* and enterprise business rules.

It must also establish:

* how Intelligence Engines obtain data;
* how intelligence is generated;
* how outputs are represented;
* how outputs are consumed;
* how engines are evaluated;
* how models are versioned;
* how confidence is represented;
* how failures are handled;
* and how intelligence is prevented from becoming uncontrolled enterprise authority.

---

## 3. Decision

Essentials Mart will implement **specialised Intelligence Engines as reusable intelligence-producing capabilities within the AI Society and enterprise architecture.**

An Intelligence Engine is defined as:

> **A specialised capability that transforms authorised enterprise data, contextual information, models, rules, algorithms, or machine-learning systems into structured intelligence that can be consumed by authorised agents, services, or applications.**

An Intelligence Engine may use:

* Machine learning
* Large language models
* Statistical models
* Optimisation algorithms
* Deterministic algorithms
* Rules
* Search systems
* Knowledge graphs
* Embeddings
* Forecasting systems
* Hybrid approaches

The architecture will not require every Intelligence Engine to use generative AI.

---

## 4. Core Separation

Essentials Mart will maintain a clear distinction:

```text
┌─────────────────────────────────────────┐
│              AI SOCIETY                 │
│                                         │
│   AI Agents       Intelligence Engines  │
│      │                    │              │
│      │ reasoning          │ intelligence │
│      │                    │              │
│      └──────────┬─────────┘              │
│                 ▼                        │
│        Governed Capabilities             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
          Enterprise Domains
```

The fundamental distinction is:

### AI Agent

Primarily responsible for:

* interpreting goals;
* reasoning;
* coordinating;
* deciding within authority;
* communicating;
* requesting actions;
* executing authorised actions.

### Intelligence Engine

Primarily responsible for:

* analysing;
* predicting;
* ranking;
* recommending;
* classifying;
* forecasting;
* optimising;
* detecting;
* generating specialised intelligence.

An Intelligence Engine does not automatically receive authority to execute the action implied by its output.

---

## 5. Architectural Principles

### 5.1 Specialisation

Each Intelligence Engine should have a clearly defined intelligence responsibility.

### 5.2 Reusability

Intelligence should be reusable across multiple authorised consumers.

### 5.3 Explainability Where Appropriate

Where an output materially influences a user or enterprise decision, the system should provide appropriate evidence, rationale, or supporting signals.

### 5.4 Versionability

Models, algorithms, configurations, and intelligence logic must be versioned.

### 5.5 Evaluability

Intelligence Engines must be measurable against defined quality criteria.

### 5.6 Data Governance

Engines may only access data they are authorised to consume.

### 5.7 Separation of Intelligence and Authority

Producing an intelligence output does not grant permission to act on it.

### 5.8 Replaceability

An engine should be replaceable without redesigning every consumer.

### 5.9 Deterministic Reproducibility Where Required

Where business or audit requirements demand it, the platform must preserve sufficient version and input information to reproduce or explain an output.

### 5.10 Continuous Improvement

Intelligence quality may improve through new models, algorithms, data, or configurations without requiring consumers to change.

---

## 6. Intelligence Engine Model

An Intelligence Engine should conceptually contain:

```text
Intelligence Engine
│
├── Engine Identity
├── Purpose
├── Input Contract
├── Output Contract
├── Data Requirements
├── Model / Algorithm
├── Configuration
├── Version
├── Evaluation Metrics
├── Confidence / Quality Signals
├── Access Policy
├── Runtime Policy
└── Audit Metadata
```

The exact implementation may vary by engine.

---

## 7. Engine Categories

The platform may eventually contain several classes of Intelligence Engines.

### 7.1 Recommendation Engines

Examples:

* Product recommendations
* Basket recommendations
* Household recommendations
* Substitution recommendations

---

### 7.2 Forecasting Engines

Examples:

* Demand forecasting
* Household consumption forecasting
* Inventory forecasting
* Delivery demand forecasting

---

### 7.3 Optimisation Engines

Examples:

* Delivery route optimisation
* Shopping route optimisation
* Store layout optimisation
* Inventory allocation

---

### 7.4 Detection Engines

Examples:

* Fraud detection
* Anomaly detection
* Inventory anomaly detection
* Operational risk detection

---

### 7.5 Ranking Engines

Examples:

* Product ranking
* Search ranking
* Recommendation ranking
* Personalised content ranking

---

### 7.6 Classification Engines

Examples:

* Product classification
* Customer segmentation
* Order classification
* Support-ticket classification

---

### 7.7 Generative Intelligence Engines

Examples:

* Product explanation
* Shopping-list generation
* Household summaries
* Natural-language synthesis
* AI-generated operational summaries

Generative engines remain subject to the same governance principles as other engines.

---

## 8. Input Architecture

An Intelligence Engine may consume:

* Authoritative enterprise data;
* Approved derived data;
* Events;
* Historical data;
* Real-time signals;
* User preferences;
* Household context;
* Store context;
* External information where authorised.

Inputs must be governed.

For example:

```text
Product Domain ───────┐
Inventory Domain ─────┤
Customer Context ─────┼──► Recommendation Engine
Household Context ────┤
Historical Signals ───┘
```

The engine should receive only the information necessary to perform its function.

---

## 9. Output Architecture

Intelligence outputs should be structured wherever practical.

A recommendation may conceptually contain:

```text
Recommendation
├── Recommendation ID
├── Subject
├── Suggested Item
├── Reason / Signals
├── Confidence / Quality
├── Engine ID
├── Engine Version
├── Generated At
└── Expiry / Validity
```

The exact structure will vary by intelligence type.

Outputs should contain sufficient metadata to identify:

* Which engine produced them;
* Which version produced them;
* When they were produced;
* What type of intelligence they represent;
* How long they remain valid where applicable.

---

## 10. Intelligence Does Not Equal Authority

This is a foundational rule.

Consider:

```text
Inventory Engine
       │
       ▼
"Product X is likely to run out tomorrow."
       │
       ▼
Shopping Agent
       │
       ▼
Recommendation
```

The Intelligence Engine has identified a condition.

It has not automatically:

* modified inventory;
* created a purchase order;
* notified a supplier;
* changed pricing;
* or placed an order.

Those actions require the appropriate enterprise capability and authority.

Therefore:

> **Intelligence informs authority. It does not replace authority.**

---

## 11. Agent Consumption

AI agents may consume intelligence from multiple engines.

For example:

```text
                    Household AI
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
       Recommendation  Forecast   Inventory
          Engine        Engine      Engine
             │           │           │
             └───────────┼───────────┘
                         ▼
                  Agent Reasoning
                         │
                         ▼
                  Authorised Action
```

The agent remains responsible for interpreting the intelligence in the context of the user's goal and its own authority.

---

## 12. Multiple Engine Collaboration

Intelligence Engines may themselves participate in multi-stage intelligence workflows.

For example:

```text
Demand Forecast
      │
      ▼
Inventory Forecast
      │
      ▼
Stock Risk Analysis
      │
      ▼
Recommendation Engine
      │
      ▼
Shopping Agent
```

This should be implemented through controlled contracts rather than unrestricted engine-to-engine access.

---

## 13. Model Architecture

An Intelligence Engine may contain one or more models.

For example:

```text
Recommendation Engine
│
├── Candidate Generation Model
├── Personalisation Model
├── Ranking Model
└── Business Constraint Layer
```

Models may be:

* Proprietary
* Open-source
* Internally trained
* Third-party
* Statistical
* Deterministic
* Hybrid

The enterprise architecture should remain model-agnostic where practical.

This prevents the platform from becoming structurally dependent on a single AI provider.

---

## 14. Model Versioning

Intelligence outputs may change when:

* A model changes;
* Training data changes;
* Configuration changes;
* Business constraints change;
* Ranking logic changes;
* External data changes.

The platform should therefore track relevant versions.

Conceptually:

```text
Engine
  │
  ├── Engine Version
  │
  ├── Model Version
  │
  ├── Configuration Version
  │
  └── Policy Version
```

This allows the platform to understand which intelligence configuration produced a particular result.

---

## 15. Evaluation

Every production Intelligence Engine should have defined evaluation criteria appropriate to its purpose.

Examples include:

### Recommendation

* Relevance
* Conversion
* Acceptance
* Diversity
* User satisfaction

### Forecasting

* Forecast error
* Bias
* Stability
* Calibration

### Detection

* Precision
* Recall
* False-positive rate
* False-negative rate

### Optimisation

* Cost reduction
* Time reduction
* Constraint satisfaction
* Operational efficiency

No single metric will be mandatory for every engine.

The evaluation framework must match the engine's purpose.

---

## 16. Confidence and Quality

Where meaningful, an Intelligence Engine should expose confidence or quality signals.

However:

> **Confidence is not the same thing as truth.**

A model may be highly confident and still be wrong.

Therefore confidence should be treated as an input to decision-making rather than an absolute guarantee.

For high-impact decisions, additional validation may be required.

---

## 17. Staleness and Validity

Intelligence may become stale.

For example:

```text
Inventory prediction
       │
       ▼
Generated 10:00
       │
       ▼
Inventory changes 10:05
       │
       ▼
Previous prediction may be stale
```

Where applicable, outputs should therefore have:

* Generation timestamp
* Validity period
* Expiration
* Refresh policy
* Relevant source version

Consumers should not blindly assume that previously generated intelligence remains valid indefinitely.

---

## 18. Event Integration

Intelligence Engines may consume enterprise events.

For example:

```text
OrderCreated
     │
     ▼
Event Backbone
     │
     ▼
Demand Forecast Engine
     │
     ▼
Updated Forecast
```

Engines may also produce intelligence-related events.

Examples:

* ForecastUpdated
* RecommendationGenerated
* RiskDetected
* IntelligenceModelUpdated

These events must remain distinct from authoritative domain events where appropriate.

---

## 19. Security and Data Access

Intelligence Engines must operate under explicit data-access policies.

Controls may include:

* Engine identity
* Dataset permissions
* Domain permissions
* Purpose restrictions
* Data minimisation
* Sensitive-data filtering
* Tenant/store restrictions
* Audit logging
* Rate limits
* Credential isolation

An engine should not receive unrestricted access to the enterprise database simply because it is an internal intelligence component.

---

## 20. Privacy Impact

Intelligence may involve highly contextual information.

Examples include:

* Shopping behaviour
* Household consumption
* Preferences
* Purchase history
* Location
* Store activity

The architecture therefore requires:

* Purpose limitation
* Data minimisation
* Access control
* Retention policies
* Appropriate anonymisation or aggregation where possible
* Controlled derived-data storage

The detailed privacy architecture will be established through the broader security and data architecture.

---

## 21. AI Society Impact

Intelligence Engines become shared intelligence resources within the AI Society.

For example:

```text
                     AI Society
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Household AI      Shopping AI       Store AI
        │                 │                 │
        └────────────┬────┴─────┬───────────┘
                     ▼          ▼
              Intelligence Engines
```

This allows multiple agents to benefit from the same specialised intelligence without duplicating models or logic.

---

## 22. Failure Handling

An Intelligence Engine may fail because of:

* Model failure;
* Infrastructure failure;
* Missing data;
* Invalid input;
* Timeout;
* Dependency failure;
* Model degradation;
* Unexpected output.

Failure must not automatically result in unsafe enterprise actions.

Consumers should support:

* Retry;
* Fallback;
* Cached intelligence where safe;
* Alternative engine;
* Rule-based fallback;
* Human escalation;
* Safe refusal.

For example:

```text
Recommendation Engine
        │
        ├── Success → Recommendation
        │
        └── Failure
              │
              ├── Fallback engine
              ├── Deterministic rules
              └── No recommendation
```

---

## 23. Observability

Production engines should expose operational and quality telemetry.

This may include:

* Request volume
* Latency
* Error rate
* Input quality
* Output quality
* Model version
* Engine version
* Confidence distribution
* Drift indicators
* Cost
* Resource utilisation
* Evaluation metrics

AI observability will be integrated with the broader enterprise observability architecture established later in ADR-016.

---

## 24. Cost Management

Intelligence computation may become expensive at scale.

The architecture should therefore support:

* Caching
* Batch processing
* Event-triggered computation
* Scheduled computation
* Model selection
* Smaller models where appropriate
* Request prioritisation
* Result reuse
* Cost monitoring

The most sophisticated model should not automatically be used for every task.

---

## 25. Consequences

### Positive

* Reusable intelligence.
* Reduced duplication.
* Consistent intelligence across agents.
* Model and vendor independence.
* Better evaluation.
* Better auditability.
* Clear separation of intelligence and authority.
* Easier optimisation of AI costs.
* Easier replacement of models.
* Strong foundation for the AI Society.

### Negative

* Intelligence infrastructure introduces complexity.
* Model governance becomes necessary.
* Evaluation requires ongoing work.
* Outputs can become stale.
* Quality can degrade over time.
* Different engines may produce conflicting outputs.

### Neutral / Trade-offs

* Not every intelligence capability requires machine learning.
* Some engines may be deterministic.
* Some engines may combine multiple models.
* Intelligence may be generated synchronously or asynchronously.

---

## 26. Alternatives Considered

### Alternative A — Intelligence Inside Every Agent

**Description:**
Each agent implements its own recommendation, forecasting, ranking, and analytical capabilities.

**Why not selected:**
This creates duplication, inconsistent results, and difficult governance.

---

### Alternative B — One Universal Intelligence Engine

**Description:**
Create a single engine responsible for all intelligence.

**Why not selected:**
Different intelligence problems have different data, evaluation, latency, and governance requirements.

---

### Alternative C — External AI Provider as the Intelligence Layer

**Description:**
Delegate all intelligence to one external AI provider.

**Why not selected:**
This creates excessive vendor dependency and does not provide appropriate enterprise-domain governance.

---

### Alternative D — Specialised Intelligence Engines

**Description:**
Create reusable intelligence capabilities organised around specific intelligence responsibilities.

**Why selected:**
This provides specialisation while allowing agents and enterprise capabilities to reuse intelligence.

---

## 27. Implementation Implications

The backend architecture will eventually define:

* Intelligence Engine registry
* Engine APIs
* Input contracts
* Output contracts
* Model registry
* Model versioning
* Feature/data pipelines
* Evaluation pipelines
* Quality monitoring
* Engine permissions
* Engine deployment
* Engine scaling
* Caching
* Cost controls
* Failure handling
* Observability

The initial implementation should prioritise only engines required by active product capabilities.

---

## 28. Dependencies

This ADR depends upon:

* ADR-001 — Enterprise Architecture Principles
* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation
* ADR-007 — AI Society Architecture

It establishes the foundation for:

* ADR-009 — AI Agent Governance & Permissions
* ADR-010 — Human-in-the-Loop Architecture
* ADR-014 — Walk Mode / Living Digital Supermarket
* ADR-016 — Observability, Auditability & Trust
* Future ML/AI platform architecture

---

## 29. Related Architecture Documents

* `AI-001-ai-society.md`
* `EDA-001-enterprise-data-architecture.md`
* `DOMAINS.md`
* `EVENT-ARCHITECTURE.md`
* `SECURITY-ARCHITECTURE.md`

---

## 30. Related ADRs

* ADR-003 — Event-Driven Architecture
* ADR-004 — API & Service Architecture
* ADR-005 — Data Ownership & Database Boundaries
* ADR-006 — Identity, Authentication & Authorisation
* ADR-007 — AI Society Architecture
* ADR-009 — AI Agent Governance & Permissions
* ADR-010 — Human-in-the-Loop Architecture
* ADR-016 — Observability, Auditability & Trust

---

## 31. Decision Lifecycle

**Current Status:** Proposed

### Review Conditions

This ADR should be reviewed if:

* Intelligence responsibilities need restructuring.
* Model governance requirements materially change.
* New intelligence categories are introduced.
* AI provider dependencies change.
* Engine performance or scalability requirements change.
* Regulatory requirements impose new controls.
* Intelligence and agent boundaries become unsuitable.

### Supersession

If this decision is replaced, the replacement ADR must reference ADR-008 and explain why the Intelligence Engine architecture has changed.

---

## 32. Final Decision

> **Essentials Mart will implement specialised, reusable Intelligence Engines that transform authorised enterprise data and contextual signals into governed intelligence. Intelligence Engines may use models, algorithms, rules, optimisation systems, or hybrid approaches and will be versioned, evaluated, observable, and access-controlled. Intelligence outputs inform enterprise and AI-agent decisions but do not independently confer authority to execute those decisions.**

**ADR-008 remains authoritative unless superseded by a subsequent ADR.**
