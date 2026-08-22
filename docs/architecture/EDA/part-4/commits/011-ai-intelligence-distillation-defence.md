# Commit 011 — AI Intelligence & Distillation Defence

**Parent Architecture:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 011  
**Subject:** AI Intelligence & Distillation Defence  
**Status:** Proposed  
**Depends On:** Commits 003, 006, 007, 009, 010; EDA-001 Part 3 AI Security; ADR-007; ADR-008; ADR-009; ADR-015; ADR-016  
**Purpose:** Protect Essentials Mart's proprietary AI intelligence, learned behaviour, intelligence-engine outputs, model assets and associated intellectual property against extraction, replication, distillation, unauthorized use and disclosure.

---

## 1. Purpose

Commit 011 establishes the defensive architecture for protecting the intelligence that differentiates Essentials Mart from a conventional commerce platform.

The protected asset is broader than model weights.

It may include:

- proprietary models;
- model configurations;
- prompts and orchestration logic;
- intelligence-engine logic;
- recommendation policies;
- ranking behaviour;
- demand and inventory intelligence;
- pricing intelligence;
- trust intelligence;
- reward intelligence;
- delivery optimisation intelligence;
- household intelligence;
- learned patterns;
- feature representations;
- proprietary datasets;
- evaluation assets;
- synthetic training data;
- feedback loops;
- agent coordination patterns;
- model-routing strategies;
- and the resulting behavioural advantage of the platform.

---

## 2. Intelligence Is Intellectual Property

Essentials Mart shall treat material intelligence assets as protected intellectual property.

```text
                 ESSENTIALS MART IP
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Software      Data       Intelligence
          │            │            │
          └────────────┼────────────┘
                       ▼
                Competitive Advantage
```

Protection must therefore address both direct theft and indirect replication.

---

## 3. Model Theft and Model Extraction

Model extraction occurs when an attacker uses access to a model or AI service to infer information about its architecture, parameters or behaviour.

NIST defines model extraction as an attack that extracts details of model architecture and/or parameters. citeturn0search2

OWASP identifies model theft as including unauthorized access to proprietary models and extraction of model information through repeated queries. citeturn0search0

Essentials Mart must therefore protect against both:

- direct model-asset theft;
- black-box behavioural extraction.

---

## 4. Functional Replication

Exact copying is not the only threat.

An attacker may attempt to reproduce the functional behaviour of a proprietary intelligence system using its outputs as training data.

```text
Essentials Mart Intelligence
          ↓
      API Queries
          ↓
    Large Output Set
          ↓
 Synthetic Training Data
          ↓
    External Model
          ↓
Functional Approximation
```

NIST's adversarial-ML taxonomy recognises model extraction through queries and notes that functionally equivalent models can be reconstructed even when exact parameter extraction is not achieved. citeturn0search24

The architecture therefore protects the **behavioural surface**, not only the underlying model files.

---

## 5. Distillation Defence

Knowledge distillation can be legitimate when performed under authorized development processes, but unauthorized distillation of Essentials Mart intelligence is an IP threat.

The platform must identify and constrain suspicious attempts to systematically collect outputs for replication.

Potential indicators include:

- unusually high query volume;
- systematic prompt variation;
- repeated probing of the same capability;
- broad coverage of a model's decision space;
- automated response harvesting;
- coordinated accounts;
- unusual output diversity requests;
- repeated boundary probing;
- and combinations of these signals.

---

## 6. Intelligence Surface Minimisation

The safest intelligence surface is the smallest surface that provides the required product capability.

The platform should not expose unnecessarily detailed:

- confidence values;
- rankings;
- internal scores;
- feature weights;
- intermediate reasoning artefacts;
- model metadata;
- hidden classifications;
- internal decision thresholds;
- or detailed policy explanations.

Where a customer only needs a decision, the platform should generally return the decision rather than the internal machinery used to produce it.

---

## 7. API Boundary Protection

Proprietary intelligence must be accessed through controlled backend capabilities.

```text
Client
  ↓
Authenticated API
  ↓
Authorization
  ↓
Intelligence Capability
  ↓
Minimal Result
  ↓
Client
```

Core intelligence must not be shipped into the browser merely to simplify application development.

This extends the server-side IP isolation established by Commit 003.

---

## 8. Query Rate and Volume Controls

Rate limiting is an important extraction defence, but it must not be the only defence.

Controls should operate across multiple dimensions:

- account;
- tenant;
- IP/network;
- device/session;
- API key;
- capability;
- model;
- intelligence engine;
- time window;
- and behavioural identity.

OWASP explicitly identifies rate limiting and query controls as mitigations against model extraction and unbounded consumption. citeturn0search0turn0search9

---

## 9. Behavioural Extraction Detection

The platform should detect patterns that distinguish ordinary use from systematic extraction.

Examples:

```text
Normal User
   ↓
Occasional Recommendations
   ↓
Normal Variation
```

versus:

```text
Extraction Behaviour
   ↓
Thousands of structured queries
   ↓
Systematic parameter variation
   ↓
Output harvesting
   ↓
Capability coverage
```

Detection should use multiple signals rather than a single threshold.

---

## 10. Adaptive Response

When extraction behaviour is suspected, the system may progressively respond.

```text
Normal
  ↓
Observe
  ↓
Increase Monitoring
  ↓
Rate Limit
  ↓
Reduce Exposure
  ↓
Challenge / Verify
  ↓
Restrict Capability
  ↓
Quarantine
```

Responses must be proportionate to avoid unnecessarily degrading legitimate customers.

---

## 11. Output Shaping

Where appropriate, outputs may be deliberately shaped to reduce extraction value without degrading legitimate functionality.

Examples may include:

- returning ranked recommendations without exposing internal scores;
- returning bounded confidence categories instead of precise values;
- reducing unnecessary metadata;
- limiting bulk output;
- and suppressing internal model identifiers.

Output shaping must not create misleading customer information.

---

## 12. Sensitive Intermediate Data

Intermediate intelligence data should remain server-side where possible.

Examples include:

- feature vectors;
- embeddings;
- ranking scores;
- fraud scores;
- trust signals;
- demand forecasts;
- route optimisation scores;
- customer propensity estimates;
- and internal recommendation features.

These should not be exposed merely because a client could technically consume them.

---

## 13. Intelligence Engine Isolation

Intelligence Engines should be isolated according to their sensitivity and business impact.

A compromise of one engine must not automatically expose all intelligence assets.

For example:

```text
Inventory Intelligence
       X
Customer Intelligence
       X
Trust Intelligence
       X
Reward Intelligence
```

Cross-engine access must be capability-based and purpose-specific.

---

## 14. AI Society Protection

The AI Society itself is a valuable intellectual asset.

Its protected characteristics may include:

- agent specialisation;
- collaboration protocols;
- delegation patterns;
- routing policies;
- capability boundaries;
- escalation logic;
- learning loops;
- and orchestration behaviour.

Agents should not expose internal coordination details to untrusted parties.

---

## 15. Agent Output Exposure

AI agents should return only the information necessary for the requested task.

Internal messages such as:

```text
Agent A → Agent B
Agent B → Intelligence Engine
Agent C → Trust Engine
```

must not automatically become visible to customers or external partners.

External responses should expose the governed product result rather than the internal coordination graph.

---

## 16. Proprietary Recommendation Logic

Recommendation intelligence may include proprietary:

- ranking rules;
- customer segmentation;
- contextual signals;
- substitution logic;
- purchase-pattern analysis;
- household preferences;
- timing models;
- and optimisation functions.

These should remain behind authorized service boundaries.

---

## 17. Proprietary Pricing Intelligence

Pricing intelligence may contain:

- demand signals;
- elasticity models;
- promotion logic;
- competitive signals;
- inventory constraints;
- margin policies;
- and optimization strategies.

Internal pricing logic must not be exposed through unnecessary API metadata or client-side code.

---

## 18. Proprietary Inventory Intelligence

Inventory intelligence may expose useful customer-facing availability information without exposing internal prediction mechanisms.

For example:

```text
Customer
  ↓
Available / unavailable
```

rather than:

```text
Customer
  ↓
Demand forecast
  ↓
Replenishment probability
  ↓
Safety stock calculation
  ↓
Internal confidence score
```

The latter remains protected intelligence.

---

## 19. Proprietary Delivery Intelligence

The multimodal delivery system established by ADR-020 and EIP-018 may produce proprietary optimisation behaviour.

Protected assets may include:

- resource allocation models;
- route-selection logic;
- capacity allocation;
- scheduled-transport selection;
- ETA prediction;
- fulfilment prioritisation;
- vehicle assignment;
- demand clustering;
- and multimodal transfer decisions.

The platform should expose the resulting delivery promise rather than the complete optimization strategy.

---

## 20. Learning Loop Protection

The learning system may create significant competitive advantage through:

```text
Recommendation
      ↓
Customer Action
      ↓
Outcome
      ↓
Feedback
      ↓
Learning
      ↓
Improved Recommendation
```

The architecture must protect the proprietary feedback loop as an asset.

Bulk extraction of historical outcomes should therefore require explicit authorization.

---

## 21. Training Data Protection

Training and fine-tuning datasets may contain both sensitive information and proprietary business knowledge.

Controls should include:

- access control;
- encryption;
- provenance;
- dataset versioning;
- export restrictions;
- audit logging;
- environment isolation;
- and controlled deletion.

NIST distinguishes training-data extraction from model extraction and defines it as an attack that attempts to extract training data through targeted prompting. citeturn0search14

---

## 22. Model Registry Protection

Production model artifacts should reside in controlled registries or equivalent repositories.

Access should be restricted by:

- role;
- environment;
- project;
- service identity;
- deployment authority;
- and business need.

Production models should not be freely downloadable by ordinary application components.

---

## 23. Model Artifact Protection

Where self-hosted or proprietary models are used, the platform should protect:

- weights;
- tokenizer assets;
- configuration;
- adapters;
- fine-tuning artifacts;
- embeddings;
- evaluation assets;
- and deployment packages.

Protection may include encryption, controlled access, isolated runtime environments and monitored retrieval.

---

## 24. Insider Threat

Intelligence theft may originate from legitimate access.

Therefore controls must address:

- privileged employees;
- contractors;
- developers;
- operators;
- AI engineers;
- vendors;
- and compromised internal identities.

High-value intelligence access should be attributable and monitored.

---

## 25. Export Controls

Bulk export of intelligence assets should require explicit authorization.

Examples include:

- model downloads;
- dataset exports;
- embedding exports;
- bulk recommendation outputs;
- internal score exports;
- model evaluation exports;
- and large-scale inference result extraction.

Where possible, export operations should have additional approval and auditing.

---

## 26. Watermarking and Fingerprinting

Where technically and legally appropriate, Essentials Mart may use model or output fingerprinting to help identify unauthorized copies or systematic reuse.

Watermarking is not a substitute for access control, encryption or monitoring.

It is an attribution and detection layer.

OWASP identifies watermarking as one possible supporting measure for model-theft defence. citeturn0search0turn0search26

---

## 27. Canary and Detection Signals

Where appropriate, carefully designed canary signals may help detect unauthorized replication or misuse.

Such mechanisms must not create unsafe behaviour for legitimate users and must be evaluated for privacy, reliability and legal implications before deployment.

---

## 28. Client-Side Intelligence Boundary

Client-side code must be assumed observable.

Therefore:

```text
Browser / Mobile Client
       ↓
Publicly inspectable
       ↓
Non-secret presentation logic
```

while:

```text
Backend
   ↓
Proprietary intelligence
   ↓
Protected
```

WebAssembly, minification and obfuscation may raise reverse-engineering cost for code that must execute on the client, but they must not be treated as equivalent to server-side confidentiality.

---

## 29. API Enumeration Defence

Attackers may attempt to discover intelligence capabilities through API enumeration.

Controls include:

- authenticated capability discovery;
- minimal error detail;
- endpoint authorization;
- schema minimization;
- rate limits;
- anomaly detection;
- and retirement of unused endpoints.

Internal intelligence endpoints should not be publicly discoverable unless required.

---

## 30. Economic Protection

Model extraction can become an economic attack even without stealing the underlying model.

Attackers may consume expensive inference resources while simultaneously collecting training data for replication.

The architecture therefore connects:

```text
IP Protection
      +
Abuse Detection
      +
Rate Limiting
      +
Cost Controls
      +
Monitoring
```

OWASP identifies model extraction and denial-of-wallet behaviour as related risks of uncontrolled inference. citeturn0search9

---

## 31. Extraction Investigation

Suspected extraction events must be traceable.

Investigations should be able to reconstruct:

- identity;
- account;
- device/session;
- API capability;
- query patterns;
- model/engine accessed;
- output volume;
- timing;
- rate-limit events;
- and defensive actions taken.

This connects to the enterprise observability and trust architecture.

---

## 32. Response to Confirmed Extraction

A confirmed or highly probable extraction attempt may trigger:

1. capability restriction;
2. API key revocation;
3. account suspension;
4. IP/network controls;
5. model access restriction;
6. output-surface reduction;
7. legal investigation;
8. evidence preservation;
9. intelligence rotation where feasible;
10. and security incident response.

Response must be proportionate and auditable.

---

## 33. Intelligence Rotation

Where practical, sensitive intelligence systems should support controlled rotation.

Examples include:

- changing model versions;
- changing ranking strategies;
- rotating exposed identifiers;
- changing API capabilities;
- replacing compromised keys;
- updating detection signatures;
- and retiring compromised model endpoints.

Rotation must not destroy legitimate customer continuity unnecessarily.

---

## 34. Legal and Trade-Secret Boundary

Technical controls are one layer of IP protection.

Legal protection may include:

- trade-secret controls;
- confidentiality agreements;
- contractor obligations;
- access agreements;
- licensing terms;
- contractual restrictions;
- and patent strategy where appropriate.

Commit 021 will address the broader IP & Legal Protection Strategy.

Commit 011 therefore establishes the technical defensive boundary without prematurely defining legal policy.

---

## 35. Testing and Red Teaming

The platform should test whether intelligence can be reconstructed through:

- automated query harvesting;
- prompt variation;
- output clustering;
- account farming;
- API enumeration;
- adversarial probing;
- insider access simulation;
- model artifact compromise;
- and synthetic-data distillation experiments.

These tests belong within the broader adversarial verification programme established later in Part 4.

---

## 36. Defensive Limits

Essentials Mart shall not claim that model extraction or behavioural replication can be made mathematically impossible.

The objective is to:

- minimise exposed intelligence;
- increase extraction cost;
- detect systematic extraction;
- limit the quantity and quality of extractable outputs;
- isolate high-value assets;
- preserve evidence;
- respond quickly;
- and maintain legal and technical remedies.

This is a **risk-reduction architecture**, not a promise of absolute secrecy.

---

## 37. Relationship With Commit 010

Commit 010 protects the AI runtime:

- agent identity;
- tool security;
- prompt injection;
- model integrity;
- excessive agency;
- AI resource protection;
- quarantine;
- and safe AI operation.

Commit 011 protects the **intelligence asset itself**:

- model behaviour;
- proprietary intelligence;
- distillation resistance;
- extraction detection;
- output-surface minimisation;
- intelligence isolation;
- and IP preservation.

The two commits are complementary and must not be merged into a single generic AI-security document.

---

## 38. Constitutional Intelligence Protection Laws

1. Proprietary intelligence is an enterprise IP asset.
2. Model weights are not the only protected AI asset.
3. Behavioural replication is an IP threat even without exact model theft.
4. Functional model extraction must be treated as a defensive risk.
5. Intelligence surfaces must be minimised.
6. Internal scores and intermediate representations must not be exposed unnecessarily.
7. Proprietary intelligence must remain server-side where practical.
8. Client hardening is not a substitute for server-side confidentiality.
9. AI query access must be rate-limited and monitored.
10. Extraction detection must consider behavioural patterns, not only request volume.
11. Intelligence engines must be isolated according to sensitivity and blast radius.
12. Training data and learning assets require independent protection.
13. Production model artifacts require controlled access.
14. Insider access to high-value intelligence must be attributable.
15. Bulk intelligence export requires explicit governance.
16. Watermarking or fingerprinting is supplemental, not foundational.
17. AI output must expose only what the product requires.
18. Intelligence protection must connect to runtime abuse defence.
19. Confirmed extraction must trigger proportionate response.
20. Technical protection must operate alongside legal and contractual IP protection.
21. Absolute non-extractability must not be claimed.
22. Defensive effectiveness must be verified through adversarial testing.

---

## 39. Architectural Outcome

Commit 011 establishes a dedicated defensive boundary around the intelligence that gives Essentials Mart its competitive advantage.

```text
                 ESSENTIALS MART
                       │
                 AI / INTELLIGENCE
                       │
              ┌────────┴────────┐
              ▼                 ▼
       Functional Use       IP Protection
              │                 │
              ▼                 ▼
        Minimal Output    Protected Engines
              │                 │
              ▼                 ▼
       Customer Result     Extraction Defence
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
             Monitoring      Rate Limits    Isolation
                 │              │              │
                 └──────────────┼──────────────┘
                                ▼
                         Adaptive Response
                                │
                                ▼
                        Evidence / Recovery
```

The objective is not merely to hide a model. It is to protect the **entire intelligence advantage** of Essentials Mart against unauthorized extraction, replication and disclosure.
