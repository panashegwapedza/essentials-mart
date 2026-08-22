# EIP-024 — AI Society Runtime Implementation Architecture

**Document ID:** EIP-024  
**Title:** AI Society Runtime Implementation Architecture  
**Status:** Proposed / Implementation Baseline  
**Parent Architecture:** EDA-001  
**Depends On:** ADR-007, ADR-008, ADR-009, ADR-010, ADR-016, EIP-019, EIP-020, EIP-021, EIP-022, EIP-023  
**Scope:** Essentials Mart AI Society runtime

---

## 1. Purpose

EIP-024 defines the implementation architecture for the Essentials Mart AI Society: the runtime environment in which specialised AI agents, Intelligence Engines, shared AI capabilities, governance controls and human oversight operate as one coordinated system.

The AI Society is not implemented as a collection of unrelated AI features. Agents collaborate through governed capabilities, APIs, events, shared context and explicit authority boundaries while domain systems remain authoritative for business truth.

---

## 2. Constitutional Runtime Principle

> **AI agents are participants in the enterprise system, not owners of enterprise truth or holders of implicit authority.**

An agent may reason, recommend, retrieve authorised information, request an action or perform an authorised action. It may not acquire authority merely because it can access an event, invoke a tool or communicate with another agent.

The runtime therefore separates:

```text
Reasoning
   ↓
Capability
   ↓
Authority
   ↓
Action
```

Each layer must be independently governed.

---

## 3. Runtime Model

The conceptual runtime is:

```text
                    AI SOCIETY CONTROL PLANE
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
 Agent Registry       Capability Registry     Policy Engine
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             ▼
                    SOCIETY ORCHESTRATION
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
     AI Agents       Intelligence Engines   Shared AI Services
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                    Governed Tool Layer
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
        APIs              Events              Data
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                     Enterprise Domains
```

The control plane governs participation. The execution plane performs authorised work.

---

## 4. Agent Registry

Every production AI agent must have a registered identity.

The registry should define at minimum:

- agent ID;
- agent purpose;
- owning capability/domain;
- model/provider class;
- allowed tools;
- allowed data classes;
- permitted actions;
- risk classification;
- human oversight requirements;
- lifecycle state;
- version;
- evaluation status;
- deployment scope;
- audit configuration;
- and emergency disablement state.

Unregistered production agents must not participate in the enterprise AI Society.

---

## 5. Capability Registry

Capabilities are the controlled operations available to agents.

Examples include:

- search catalogue;
- retrieve inventory;
- create basket;
- submit order;
- recommend product;
- request delivery quote;
- send notification;
- retrieve receipt;
- inspect pantry state;
- generate route recommendation;
- request human approval.

Capabilities must be separately registered from agents so that authority can be changed without redesigning the agent itself.

---

## 6. Authority Model

The runtime must distinguish capability from permission.

```text
Agent
  ↓
Capability requested
  ↓
Policy evaluation
  ↓
Context evaluation
  ↓
Authority decision
  ↓
Allow / Deny / Require Human Approval
```

Authority decisions may consider:

- agent identity;
- user identity;
- tenant/store/region;
- action sensitivity;
- data classification;
- transaction value;
- current system state;
- risk signals;
- human approval requirements;
- and applicable policy.

---

## 7. Intelligence Engines

Intelligence Engines provide specialised reasoning capabilities to the Society.

Initial categories include:

- Shopping Intelligence;
- Recommendation Intelligence;
- Inventory Intelligence;
- Pricing Intelligence;
- Demand Intelligence;
- Customer Intelligence;
- Trust Intelligence;
- Reward Intelligence;
- Delivery Intelligence;
- Store Operations Intelligence;
- Enterprise Intelligence;
- Learning Intelligence.

Intelligence Engines do not automatically own the underlying business data. Their outputs remain subject to domain authority and governance.

---

## 8. Agent Specialisation

Agents should have clear responsibilities.

Examples:

```text
Shopping Agent
     ↓
Shopping-related reasoning

Inventory Agent
     ↓
Inventory-related reasoning

Delivery Agent
     ↓
Fulfilment and delivery coordination

Household Agent
     ↓
Household-level assistance
```

The runtime should avoid creating multiple agents with overlapping authority over the same business decision unless the overlap is explicitly designed.

---

## 9. Society Orchestration

The Society Orchestrator coordinates multi-agent tasks.

It should manage:

- task decomposition;
- agent selection;
- capability discovery;
- context propagation;
- sequencing;
- timeouts;
- retries;
- cancellation;
- escalation;
- result aggregation;
- conflict detection;
- and final action routing.

The orchestrator must not become an unrestricted super-agent.

It coordinates authorised agents but remains subject to the same policy and audit controls.

---

## 10. Agent-to-Agent Communication

Agents should communicate through governed mechanisms rather than arbitrary direct access.

Preferred mechanisms include:

- governed capability calls;
- internal APIs;
- event subscriptions;
- structured task messages;
- shared governed context references.

Direct unrestricted agent-to-agent network access is prohibited for production workflows unless explicitly approved and governed.

---

## 11. Context Management

AI context must be deliberately assembled.

The runtime should distinguish:

- user context;
- household context;
- session context;
- task context;
- domain context;
- historical context;
- event context;
- and model context.

Agents must receive only the context required for the task.

This limits unnecessary data exposure and reduces context pollution.

---

## 12. Memory Architecture

AI memory must be separated by purpose.

Possible categories include:

- session memory;
- task memory;
- user preference memory;
- household memory;
- operational memory;
- learned patterns;
- analytical memory.

Memory must not become an uncontrolled second database for authoritative enterprise state.

For example:

```text
Order status
   ↓
Commerce domain = authority

AI memory
   ↓
May remember relevant context
   ✗ Does not become order authority
```

---

## 13. Retrieval Architecture

Agents should retrieve governed information through controlled retrieval capabilities.

Retrieval may use:

- APIs;
- databases through governed services;
- search indexes;
- vector stores;
- event streams;
- knowledge repositories.

Retrieval must enforce identity, authorisation, classification and purpose constraints.

---

## 14. Tool Execution

Tools are executable capabilities and therefore require stronger governance than passive information retrieval.

A tool invocation should carry:

- agent identity;
- user/principal context;
- capability ID;
- correlation ID;
- causation ID where applicable;
- requested parameters;
- policy decision;
- approval state;
- and audit metadata.

Consequential tools must never rely solely on natural-language instructions for authorization.

---

## 15. Human-in-the-Loop

Human approval must be required where the risk classification or business policy demands it.

Examples may include:

- high-value transactions;
- irreversible account actions;
- sensitive customer decisions;
- consequential supplier actions;
- exceptional rewards;
- security overrides;
- policy exceptions.

The runtime must support:

```text
AI Recommendation
       ↓
Human Review
       ↓
Approve / Reject / Modify
       ↓
Authorised Action
```

Human review must be meaningful rather than a decorative approval step.

NIST's AI RMF treats governance, accountability, human-AI configurations, monitoring and review as lifecycle concerns rather than one-time controls. citeturn0search6turn0search9

---

## 16. AI Decision Traceability

Material AI decisions must be reconstructable.

The runtime should capture:

- agent;
- model/provider;
- model version;
- capability used;
- relevant input references;
- policy decision;
- recommendation;
- human intervention;
- resulting action;
- outcome;
- and associated correlation identifiers.

Sensitive raw prompts or outputs must be retained only where justified by policy.

---

## 17. AI Event Integration

The Society integrates with EIP-023 through governed event subscriptions and publication.

Example:

```text
InventoryAdjusted
      ↓
Inventory Intelligence
      ↓
InventoryRiskDetected
      ↓
Operations Agent
      ↓
ReplenishmentRecommendation
      ↓
Authorisation
      ↓
ReplenishmentApproved
```

Event consumption does not grant authority to execute the resulting action.

---

## 18. AI Action Pipeline

Consequential AI actions should follow:

```text
Signal
  ↓
Interpretation
  ↓
Recommendation
  ↓
Policy Evaluation
  ↓
Risk Evaluation
  ↓
Human Approval if required
  ↓
Capability Execution
  ↓
Domain Transaction
  ↓
Result Event
  ↓
Audit / Learning
```

This prevents reasoning from being confused with execution authority.

---

## 19. Conflict Resolution

The Society must detect conflicting recommendations.

For example:

```text
Shopping Agent
    ↓
Recommendation A

Reward Intelligence
    ↓
Recommendation B

Trust Intelligence
    ↓
Risk constraint
```

The orchestrator must not simply select the last response.

Conflicts should be resolved using:

- domain authority;
- policy;
- explicit priority;
- risk constraints;
- evidence quality;
- and human escalation where necessary.

---

## 20. AI Society and Domain Authority

Domain systems remain authoritative.

```text
AI Society
    ↓
Reason / Recommend / Request
    ↓
Domain Service
    ↓
Authoritative Transaction
```

AI must not directly mutate authoritative databases.

---

## 21. AI Society and Trust Engine

Trust signals may influence AI authority but must not become an automatic declaration of personal truth.

For example:

```text
Trust Signal
     ↓
Risk Assessment
     ↓
Policy Decision
     ↓
Possible Restriction / Review
```

AI agents must not independently convert probabilistic trust signals into irreversible punitive actions unless explicitly authorised.

---

## 22. AI Society and Walk Mode

Walk Mode uses the Society as a coordinated intelligence layer.

Possible flow:

```text
Shopper Context
      ↓
Walk Mode Agent
      ↓
Route / Product / Inventory Intelligence
      ↓
Recommendations
      ↓
Customer Decision
      ↓
Basket / Checkout Capability
```

Manual, AI Assisted and Autopilot modes retain their distinct authority models.

AI assistance must not silently convert an AI-assisted interaction into autonomous action.

---

## 23. AI Society and Household Intelligence

Household assistance may use:

- receipts;
- repeat purchases;
- pantry information;
- shopping history;
- preferences;
- subscriptions;
- and authorised household context.

The agent should be able to identify likely replenishment needs while preserving customer control.

Example:

```text
Historical Purchase Pattern
        +
Pantry State
        +
Subscription
        ↓
Replenishment Prediction
        ↓
Customer Notification
        ↓
Customer / Authorised Mode
```

---

## 24. AI Society and Essentials Subscription

Subscription intelligence extends existing commerce rather than replacing it.

The Society may:

- detect low pantry items;
- predict replenishment;
- suggest subscription changes;
- identify missed deliveries;
- optimise delivery timing;
- and notify customers.

The subscription system remains the authority for subscription state and billing.

---

## 25. AI Society and Delivery Intelligence

Delivery Intelligence may consume:

- orders;
- subscription schedules;
- vehicle capacity;
- vehicle availability;
- warehouse staffing;
- dispatch status;
- route conditions;
- scheduled transport;
- delivery windows;
- and customer preferences.

It may recommend routes or schedules, but fulfilment systems remain authoritative for actual dispatch commitments.

---

## 26. Scheduled Transport Integration

The Society may reason over approved scheduled transport options, including external transport partners.

Possible modes include:

- scheduled delivery;
- shared delivery;
- personalised delivery;
- express delivery;
- fast delivery;
- scheduled commuter-linked delivery where legally and operationally supported.

External transport availability must be represented through governed integration adapters rather than hard-coded assumptions in AI agents.

---

## 27. Model Gateway

The runtime should use a model gateway or equivalent abstraction where practical.

The gateway may provide:

- provider routing;
- model selection;
- fallback;
- cost controls;
- latency controls;
- safety policies;
- evaluation metadata;
- usage tracking;
- and provider isolation.

Changing an underlying model provider should not require rewriting every agent.

---

## 28. Model Selection

Model selection should be task-specific.

Factors may include:

- task complexity;
- latency;
- cost;
- privacy;
- context requirements;
- reasoning capability;
- reliability;
- availability;
- and risk classification.

The most capable model must not automatically be used for every task.

---

## 29. AI Provider Abstraction

External AI providers are dependencies, not architectural authorities.

The runtime must preserve the ability to replace or supplement providers.

This protects against:

- provider outages;
- pricing changes;
- policy changes;
- model retirement;
- regional availability changes;
- and strategic dependency.

---

## 30. AI Data Boundary

AI access to enterprise data must pass through governed boundaries established by EIP-022.

The AI runtime must not create unrestricted database credentials for agents or model providers.

Sensitive data should be minimised before being supplied to models.

---

## 31. Prompt and Context Security

The runtime must defend against:

- prompt injection;
- indirect prompt injection;
- malicious retrieved content;
- tool-manipulation attempts;
- context poisoning;
- cross-user context leakage;
- secret extraction;
- and instruction hierarchy attacks.

Untrusted retrieved content must never automatically become trusted system instruction.

---

## 32. Tool Abuse Prevention

The runtime must constrain tools according to:

- capability;
- agent;
- principal;
- environment;
- transaction value;
- rate;
- risk;
- and policy.

High-impact tools should support stronger confirmation and monitoring.

---

## 33. AI Rate and Cost Governance

The runtime must control:

- requests per agent;
- model tokens;
- tool calls;
- concurrent tasks;
- recursive calls;
- retries;
- and external-provider spend.

AI agents must not be able to create uncontrolled recursive workloads.

---

## 34. Recursive Agent Calls

Agent recursion must be bounded.

```text
Agent A
  ↓
Agent B
  ↓
Agent C
  ↓
Agent A
```

The runtime must detect and prevent uncontrolled cycles using task lineage, depth limits, budgets and cancellation policies.

---

## 35. AI Failure Handling

AI failures must degrade safely.

Possible outcomes include:

- retry;
- model fallback;
- alternate agent;
- deterministic business rule;
- human escalation;
- graceful feature degradation;
- or refusal to act.

Critical commerce operations must not depend on an AI response when a deterministic authoritative path is required.

---

## 36. AI Observability

The runtime must expose:

- agent activity;
- task latency;
- model latency;
- token usage;
- tool calls;
- failures;
- policy denials;
- human overrides;
- escalation rates;
- hallucination/error indicators where measurable;
- provider health;
- and cost.

Monitoring must cover both technical and behavioural performance.

---

## 37. Evaluation Architecture

Every production agent should have an evaluation profile appropriate to its risk.

Evaluation may include:

- accuracy;
- reliability;
- safety;
- policy adherence;
- tool-use correctness;
- privacy behaviour;
- adversarial robustness;
- latency;
- cost;
- and human override behaviour.

NIST AI RMF describes Govern, Map, Measure and Manage as continuous functions for AI risk management and supports evaluation and monitoring across the lifecycle. citeturn0search6turn0search10

---

## 38. AI Deployment Lifecycle

Agents and models follow:

```text
Proposed
   ↓
Designed
   ↓
Evaluated
   ↓
Approved
   ↓
Staged
   ↓
Deployed
   ↓
Monitored
   ↓
Re-evaluated
   ↓
Deprecated / Retired
```

Changes to models, tools, prompts, policies or capabilities may require re-evaluation according to risk.

---

## 39. AI Versioning

The runtime should version independently:

- agent definition;
- model/provider;
- system instructions;
- capability set;
- policy set;
- retrieval configuration;
- evaluation profile;
- and deployment configuration.

A model change must not be hidden as an ordinary code deployment when it materially changes AI behaviour.

---

## 40. AI Kill Switch

The Society must support controlled disablement at multiple levels:

- individual tool;
- individual agent;
- agent class;
- model/provider;
- capability;
- workflow;
- or entire AI Society function.

Disabling AI must not unnecessarily disable the underlying deterministic enterprise capability.

---

## 41. Audit and Evidence

Material AI actions must generate evidence sufficient for investigation and assurance.

Evidence must connect:

```text
Principal
  ↓
Agent
  ↓
Task
  ↓
Model
  ↓
Capability
  ↓
Policy
  ↓
Action
  ↓
Outcome
```

This integrates with EDA-001 Part 4 and EIP-019.

---

## 42. Privacy

The AI runtime must implement data minimisation and purpose limitation.

It must not permanently retain all customer conversations or retrieved data simply because storage is technically possible.

Retention must be governed by:

- purpose;
- classification;
- legal requirements;
- customer rights;
- analytical requirements;
- and security needs.

---

## 43. AI Learning

Learning systems may consume outcomes from the Society but must not silently alter production behaviour without governed evaluation and deployment.

```text
Outcome
  ↓
Learning Data
  ↓
Analysis
  ↓
Candidate Improvement
  ↓
Evaluation
  ↓
Approval
  ↓
Deployment
```

This prevents uncontrolled self-modification.

---

## 44. AI Society Security

The runtime inherits the defensive requirements of EDA-001 Part 4.

Particular controls include:

- agent identity;
- capability authorization;
- model/provider isolation;
- prompt and tool security;
- adversarial testing;
- monitoring;
- containment;
- incident response;
- resilience;
- IP protection;
- governance;
- and assurance.

---

## 45. Implementation Boundaries

The AI Society runtime should be implemented as distinct components where appropriate:

```text
Agent Registry
Capability Registry
Policy / Authority Engine
Society Orchestrator
Context Service
Memory Services
Retrieval Gateway
Tool Gateway
Model Gateway
Evaluation Service
AI Observability
AI Audit / Trace Service
Human Approval Service
```

These components may initially be deployed as modules rather than separate services.

Service extraction must follow EIP-021 rather than being assumed at the outset.

---

## 46. Resilience

The AI Society must tolerate:

- model-provider failure;
- agent failure;
- retrieval failure;
- event delay;
- tool failure;
- regional failure;
- quota exhaustion;
- and orchestration failure.

Critical deterministic business functions must remain available when AI is unavailable wherever the underlying capability permits.

---

## 47. AI Society Constitutional Laws

1. AI agents do not own enterprise truth.
2. AI agents do not gain authority merely through access.
3. Capabilities and permissions remain distinct.
4. Consequential actions require governed authority.
5. Domain services remain authoritative for domain state.
6. AI agents must not directly mutate authoritative databases.
7. Agent identities must be registered.
8. Production capabilities must be governed.
9. Agent-to-agent communication must be controlled.
10. AI context must be purpose-limited.
11. Sensitive information must be minimised.
12. Human oversight must be meaningful where required.
13. Material AI decisions must be traceable.
14. AI event consumption does not imply execution authority.
15. Agent recursion must be bounded.
16. AI workloads must be rate- and cost-governed.
17. AI failures must degrade safely.
18. AI providers must not become unnecessary architectural authorities.
19. Model changes must be governed and evaluated.
20. Learning must not silently self-modify production behaviour.
21. AI systems must remain observable.
22. AI systems must be independently disableable where practical.
23. AI Society capabilities must remain aligned with Part 4 defensive architecture.
24. AI must extend enterprise capabilities rather than create shadow business systems.
25. The AI Society remains subordinate to enterprise governance, domain authority and customer rights.

---

## 48. Implementation Readiness

EIP-024 is implementation-ready when:

- every production agent has a registered identity;
- capabilities have explicit owners;
- authority policies are defined;
- model/provider dependencies are abstracted;
- domain data boundaries are enforced;
- tool execution is governed;
- human approval paths are implemented where required;
- AI traces are available;
- evaluation gates exist;
- monitoring exists;
- kill switches exist;
- failure paths are tested;
- and security/adversarial testing is integrated.

---

## 49. Relationship to Existing Architecture

```text
ADR-007
AI Society Architecture
        ↓
ADR-008
Intelligence Engine Architecture
        ↓
ADR-009
AI Agent Governance & Permissions
        ↓
ADR-010
Human-in-the-Loop
        ↓
EIP-019
Traceability
        ↓
EIP-020
Domain Boundaries
        ↓
EIP-021
Service/API Boundaries
        ↓
EIP-022
Data Boundaries
        ↓
EIP-023
Event Infrastructure
        ↓
EIP-024
AI Society Runtime
```

EIP-024 implements these decisions; it does not replace them.

---

## 50. Final Principle

> **The Essentials Mart AI Society shall operate as a coordinated, governed runtime of specialised intelligence—not as an uncontrolled collection of autonomous bots.**

Its purpose is to increase the intelligence, responsiveness and adaptability of the enterprise while preserving:

**authority → safety → traceability → privacy → resilience → human control → domain truth.**
