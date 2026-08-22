# Commit 010 — AI Defensive Architecture

**Parent Architecture:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 010  
**Subject:** AI Defensive Architecture  
**Status:** Proposed  
**Depends On:** Commits 002, 004, 006, 007, 008, 009; EDA-001 Part 3 AI Security; ADR-007; ADR-008; ADR-009; ADR-010; ADR-015; ADR-016  
**Purpose:** Establish the defensive engineering architecture for the Essentials Mart AI Society, Intelligence Engines, AI agents, model providers, tools, memory, retrieval systems and AI-mediated actions.

---

## 1. Purpose

Commit 010 defines how Essentials Mart protects its AI systems when AI components, their inputs, outputs, tools, identities, models, memory, retrieval systems or orchestration layers are deliberately attacked, manipulated, abused or compromised.

Part 3 establishes the AI security architecture and governance boundary.

Commit 010 establishes the defensive engineering layer that makes those AI boundaries harder to defeat.

The architecture applies to:

- AI Society agents;
- Intelligence Engines;
- model providers;
- self-hosted models;
- inference services;
- prompts and system instructions;
- retrieval-augmented generation;
- vector stores and embeddings;
- agent memory;
- tools and function calls;
- agent-to-agent communication;
- external AI APIs;
- AI-generated recommendations;
- AI-generated actions;
- AI-assisted customer interactions;
- Walk Mode AI;
- WhatsApp AI interactions;
- AI used in commerce, rewards, trust, inventory, delivery and enterprise intelligence.

---

## 2. Defensive AI Principle

> **An AI component must be treated as an untrusted computational participant whose outputs, inputs, context and actions require independent security controls.**

AI output must not become trusted merely because it originated from an approved model or internal agent.

The platform therefore separates:

```text
AI Reasoning
    ↓
AI Output
    ↓
Validation / Policy / Authority Boundary
    ↓
Permitted Action
```

The model does not become the final security authority.

---

## 3. Assume AI Compromise

Essentials Mart shall assume that any AI component may eventually experience:

- prompt manipulation;
- context manipulation;
- compromised retrieval data;
- malicious tool input;
- model-provider compromise;
- model failure;
- model hallucination;
- credential compromise;
- agent identity compromise;
- malicious agent-to-agent messages;
- poisoned memory;
- malicious documents;
- adversarial user input;
- malicious external content;
- resource exhaustion;
- or unexpected autonomous behaviour.

The architecture must therefore remain safe even when an individual AI component behaves incorrectly or maliciously.

---

## 4. AI Trust Boundaries

AI components must operate within explicit trust boundaries.

Conceptually:

```text
User / External Data
        ↓
AI Input Boundary
        ↓
Model / Agent
        ↓
Context / Retrieval Boundary
        ↓
Tool / Capability Boundary
        ↓
Policy / Authority Boundary
        ↓
Business System
```

Each boundary must be independently enforceable.

A model must not be able to bypass a downstream authorization boundary merely by producing a persuasive instruction.

---

## 5. Prompt Injection Defence

The platform must defend against direct and indirect prompt injection.

Threat sources include:

- user prompts;
- product descriptions;
- reviews;
- uploaded documents;
- web content;
- supplier content;
- emails;
- WhatsApp messages;
- retrieved documents;
- tool responses;
- external APIs;
- malicious metadata;
- and other untrusted context.

Prompt instructions must not automatically acquire authority simply because they appear inside retrieved or external content.

AI systems must distinguish, where technically possible:

- trusted system instructions;
- policy instructions;
- developer instructions;
- user intent;
- retrieved information;
- external content;
- tool output.

Prompt injection is recognised as a major current GenAI security risk by OWASP. citeturn0search3turn0search6

---

## 6. Indirect Prompt Injection

The architecture must explicitly address attacks where malicious instructions are embedded in information the AI is asked to process.

Example:

```text
Product Review
      ↓
Malicious instruction embedded in review
      ↓
AI retrieves review
      ↓
AI interprets instruction as trusted
      ↓
Unsafe behaviour
```

Retrieved content must remain data unless explicitly promoted through a governed mechanism.

---

## 7. AI Output Is Untrusted

AI-generated output must not be passed directly into privileged systems without validation appropriate to the operation.

Examples requiring independent validation include:

- SQL or database operations;
- API parameters;
- payment instructions;
- reward calculations;
- delivery actions;
- customer notifications;
- configuration changes;
- code execution;
- administrative actions;
- external communications.

OWASP identifies improper output handling as a security risk because unvalidated AI output can become an attack path into downstream systems. citeturn0search2

---

## 8. AI Authority Separation

AI reasoning and system authority must remain separate.

```text
AI
 ↓
Recommendation
 ↓
Policy Evaluation
 ↓
Authorization
 ↓
Execution
```

An AI agent must never gain authority merely because it can call a tool.

This preserves the Human-in-the-Loop and AI governance principles established by the wider architecture.

---

## 9. Least-Privilege AI Agents

Every agent must receive only the capabilities necessary for its assigned function.

An agent should not automatically receive:

- unrestricted database access;
- unrestricted network access;
- unrestricted payment access;
- unrestricted customer-data access;
- unrestricted administrative access;
- unrestricted external communications;
- unrestricted code execution.

Agent permissions must be explicit, scoped and revocable.

---

## 10. Agent Identity

Every privileged AI agent must have a distinct machine identity.

The identity must support:

- authentication;
- authorization;
- attribution;
- revocation;
- credential rotation;
- activity logging;
- capability scoping;
- and incident investigation.

An agent must not operate through a shared anonymous identity where material actions are possible.

---

## 11. Agent-to-Agent Security

AI Society agents must not implicitly trust one another.

Agent-to-agent messages must be:

- authenticated;
- attributable;
- integrity-protected;
- appropriately classified;
- authorized for the recipient;
- and observable.

An agent receiving a message must not assume that the sending agent is authorized to request the proposed action.

The receiving agent must independently enforce its own capability boundary.

---

## 12. Tool Security

Tools exposed to AI agents are privileged interfaces and must be treated as security-sensitive APIs.

Each tool must define:

- allowed callers;
- allowed operations;
- input schema;
- output schema;
- authorization requirements;
- rate limits;
- resource limits;
- audit requirements;
- failure behaviour;
- and rollback/compensation behaviour where applicable.

Tool access must be denied by default unless explicitly granted.

---

## 13. Tool Misuse Defence

The architecture must prevent an agent from combining individually legitimate capabilities into an unsafe sequence.

Example:

```text
Read Customer Data
        ↓
Generate External Message
        ↓
Send Message
```

Each operation may be legitimate independently while the combination may create an information-exfiltration path.

High-risk capability combinations therefore require policy evaluation and, where appropriate, human approval.

Agentic tool misuse and excessive agency are recognised security concerns in current OWASP agentic guidance. citeturn0search4turn0search11

---

## 14. Excessive Agency Defence

Agents must not receive autonomous authority beyond the business requirement.

High-impact operations should require additional controls such as:

- explicit authorization;
- transaction limits;
- approval thresholds;
- policy checks;
- dual control;
- human confirmation;
- or execution isolation.

Examples include:

- payments;
- refunds;
- reward issuance;
- supplier changes;
- account suspension;
- irreversible data deletion;
- external contractual communication;
- and consequential delivery changes.

---

## 15. AI Transaction Limits

Where an AI can initiate financial or resource-consuming actions, the platform must enforce hard limits independently of the model.

Examples:

- maximum transaction amount;
- maximum reward value;
- maximum number of actions per interval;
- maximum API calls;
- maximum inference budget;
- maximum delivery changes;
- maximum notification volume.

A model must not be able to increase its own limits.

---

## 16. AI Resource Exhaustion Defence

AI workloads must be protected against deliberate or accidental resource exhaustion.

Controls may include:

- request quotas;
- token budgets;
- concurrency limits;
- queue limits;
- inference timeouts;
- context limits;
- tool-call limits;
- per-user limits;
- per-agent limits;
- provider failover controls;
- and circuit breakers.

This complements Commit 006's runtime abuse controls and Commit 009's infrastructure resource-exhaustion controls.

OWASP identifies unbounded consumption and model denial-of-service as material AI application risks. citeturn0search1turn0search5

---

## 17. AI Supply-Chain Defence

AI supply chains must be treated as security-sensitive dependencies.

This includes:

- foundation models;
- fine-tuned models;
- model weights;
- inference providers;
- embedding models;
- vector databases;
- agent frameworks;
- plugins;
- tools;
- datasets;
- evaluation datasets;
- model repositories;
- package dependencies;
- MCP/A2A components where used;
- and external AI APIs.

Model provenance, integrity, versioning and provider trust must be governed.

OWASP identifies AI supply-chain vulnerabilities as a major risk category, while current incident analysis highlights attacks involving agent identities, orchestration layers and AI supply chains. citeturn0search3turn0search8

---

## 18. Model Integrity

Models used in production must have identifiable versions and provenance.

The platform should be able to determine:

- which model was used;
- which version was used;
- which provider supplied it;
- which configuration was active;
- which tools were available;
- which policy version governed execution;
- and which relevant context was supplied.

A production model must not silently change without governed visibility where the change could materially affect security or behaviour.

---

## 19. Model and Data Poisoning Defence

The architecture must protect against manipulation of:

- training data;
- fine-tuning data;
- evaluation data;
- retrieval corpora;
- embeddings;
- agent memory;
- feedback datasets;
- reward signals;
- and other learning inputs.

Controls should include provenance, integrity checks, controlled ingestion, validation, anomaly detection and rollback capability.

NIST's adversarial machine-learning taxonomy explicitly addresses attack types and mitigations across the ML lifecycle. citeturn0search14

---

## 20. Retrieval and Vector Security

Retrieval systems must enforce authorization before information enters AI context.

The system must not assume that because an agent can retrieve a vector, the agent is authorized to expose the underlying information.

Controls should address:

- tenant isolation;
- authorization-aware retrieval;
- document classification;
- embedding integrity;
- poisoned content;
- cross-user retrieval;
- cross-tenant leakage;
- stale permissions;
- and deletion/revocation propagation.

---

## 21. AI Memory Security

Agent memory must be treated as persistent state rather than harmless conversation history.

Memory controls must include:

- ownership;
- classification;
- retention;
- access control;
- provenance;
- correction;
- deletion;
- poisoning resistance;
- and auditability.

An attacker must not be able to establish persistent malicious instructions merely by manipulating a conversation.

---

## 22. System Prompt and Policy Protection

System prompts, hidden policies, capability definitions and internal instructions are sensitive configuration assets.

The architecture must resist unnecessary disclosure while recognising that prompt secrecy is not a substitute for authorization.

Critical security properties must be enforced outside the prompt.

Prompt leakage must therefore be treated as a security signal rather than as the sole security boundary.

OWASP identifies system-prompt leakage as a current LLM application risk. citeturn0search6

---

## 23. AI Data Exfiltration Defence

AI systems must prevent attackers from using models, retrieval, tools or agent communication as data-exfiltration channels.

Controls should include:

- data classification;
- output filtering where appropriate;
- authorization-aware retrieval;
- destination controls;
- external communication restrictions;
- tool allowlists;
- anomaly detection;
- and rate limits.

The system must be able to distinguish legitimate data access from suspicious aggregation or extraction behaviour.

---

## 24. External Content Isolation

AI systems processing external content should isolate that content from privileged instructions and capabilities.

Examples include:

- supplier descriptions;
- product reviews;
- websites;
- documents;
- emails;
- customer messages;
- WhatsApp content;
- and third-party API responses.

External content must be considered hostile until validated according to its trust level.

---

## 25. AI External Communication Controls

AI agents capable of sending messages externally must operate under explicit communication policies.

The policy must define:

- permitted channels;
- permitted recipients;
- message classifications;
- rate limits;
- approval requirements;
- content restrictions;
- and audit requirements.

This applies to app notifications, WhatsApp, email, SMS and other future communication channels.

---

## 26. AI Actions and Business Systems

An AI agent must not directly modify authoritative business state without passing through the appropriate governed capability.

Example:

```text
AI Recommendation
       ↓
Commerce Capability
       ↓
Authorization
       ↓
Order Mutation
       ↓
Order Event
```

The AI therefore remains a participant in the enterprise architecture rather than becoming an alternative source of truth.

---

## 27. AI Fail-Safe Behaviour

When an AI system behaves unexpectedly, the platform must fail toward the safest permissible state.

Possible responses include:

- deny the action;
- require human approval;
- reduce capability scope;
- switch to a lower-risk model;
- disable a compromised tool;
- quarantine the agent;
- fall back to deterministic business rules;
- or temporarily disable the affected capability.

Critical commerce functions must remain able to operate without unsafe AI autonomy where business continuity requires it.

---

## 28. Agent Quarantine

The platform must support rapid isolation of an AI component suspected of compromise.

Quarantine may include:

- revoke credentials;
- disable tools;
- stop new tasks;
- terminate active sessions;
- block agent-to-agent communication;
- preserve evidence;
- switch workloads to a safe fallback;
- and initiate investigation.

Quarantine must be possible without taking the entire platform offline.

---

## 29. AI Kill Switches

High-risk AI capabilities must have independently controlled disable mechanisms.

The kill mechanism must not depend on the AI being cooperative.

Examples:

- disable external messaging;
- disable autonomous purchasing;
- disable reward actions;
- disable delivery changes;
- disable tool execution;
- disable a model provider;
- disable a compromised agent.

---

## 30. AI Provider Failover

Where multiple model providers or models are available, the platform may support controlled failover.

Failover must consider:

- security classification;
- data residency;
- provider trust;
- capability compatibility;
- latency;
- cost;
- privacy;
- model behaviour;
- and contractual restrictions.

Failover must not accidentally send restricted data to a provider that is not authorized to process it.

---

## 31. Model Routing Security

AI routing decisions must be policy-controlled.

For example:

```text
Sensitive Data
      ↓
Approved Model Set

Public Data
      ↓
Broader Model Set
```

The routing layer must not select a model solely because it is cheaper or faster when policy requires a restricted provider.

---

## 32. AI Observability

Material AI operations must be observable.

Observability should include, where appropriate:

- agent identity;
- model identity;
- model version;
- request identity;
- correlation ID;
- tool calls;
- policy decisions;
- authorization decisions;
- relevant data classifications;
- execution outcome;
- latency;
- resource consumption;
- errors;
- and security signals.

Sensitive prompts and outputs must not automatically be stored in plaintext merely for observability.

---

## 33. AI Decision Traceability

Material AI decisions must be reconstructable to the extent required by the governance architecture.

The system should be able to establish:

```text
Who / what requested
        ↓
Which agent acted
        ↓
Which model was used
        ↓
Which capability was invoked
        ↓
Which policy applied
        ↓
Which authorization was granted
        ↓
What action occurred
        ↓
What outcome followed
```

This complements ADR-016 and the enterprise auditability architecture.

---

## 34. AI Security Telemetry

Security telemetry should identify anomalous patterns such as:

- unusual tool use;
- unusual data access;
- abnormal token consumption;
- repeated failed authorizations;
- unusual agent-to-agent traffic;
- prompt injection indicators;
- retrieval anomalies;
- unusual provider switching;
- excessive external communications;
- and abnormal action frequency.

These signals should feed the wider detection and automated-defence architecture.

---

## 35. AI Red Teaming

AI systems must be subjected to adversarial testing appropriate to their capabilities.

Testing should include:

- direct prompt injection;
- indirect prompt injection;
- jailbreak attempts;
- sensitive-data extraction;
- tool misuse;
- privilege escalation;
- memory poisoning;
- retrieval poisoning;
- model poisoning;
- malicious documents;
- agent impersonation;
- agent-to-agent manipulation;
- denial of service;
- and excessive autonomy.

The testing programme must evolve as the AI Society evolves.

OWASP and NIST both provide current frameworks and taxonomies that can inform this testing programme. citeturn0search4turn0search14

---

## 36. AI Security Regression Testing

Security tests must run against material changes to:

- models;
- prompts;
- tools;
- agent policies;
- retrieval systems;
- memory systems;
- orchestration;
- model routing;
- and security controls.

A model upgrade must not be treated as merely a normal dependency update when it can materially change security behaviour.

---

## 37. AI Supply-Chain Incident Response

If an AI provider, model, framework, tool or dataset is compromised, Essentials Mart must be able to:

1. identify affected components;
2. stop affected deployments;
3. revoke access;
4. switch to an approved fallback where available;
5. preserve evidence;
6. assess affected data and actions;
7. determine the exposure window;
8. invalidate compromised outputs or decisions where necessary;
9. notify affected stakeholders where required;
10. restore trusted operation.

---

## 38. AI Output and Action Provenance

Material AI-generated outputs used by the enterprise should carry sufficient provenance to establish:

- originating agent;
- model/provider;
- generation context where required;
- policy version;
- execution time;
- and resulting action.

This supports investigation, dispute resolution, auditing and model-change analysis.

---

## 39. AI Society Blast-Radius Control

An individual AI agent must not be able to compromise the entire AI Society.

Agent capabilities should be compartmentalised by:

- identity;
- data access;
- tools;
- network access;
- tenant scope;
- domain scope;
- transaction limits;
- and communication permissions.

Compromise of one agent should therefore produce a bounded blast radius.

---

## 40. AI Security and Walk Mode

Walk Mode AI must inherit the same defensive architecture.

Controls must address:

- malicious product content;
- malicious store metadata;
- adversarial user input;
- navigation manipulation;
- unauthorized basket actions;
- location-sensitive information;
- device compromise;
- tool misuse;
- and autonomous-action abuse.

AI assistance must not bypass the existing Walk Mode authority model.

---

## 41. AI Security and WhatsApp

AI interactions through WhatsApp must be treated as an external input channel.

WhatsApp messages may initiate AI workflows but must not bypass:

- identity verification;
- authorization;
- rate limits;
- transaction limits;
- sensitive-data controls;
- or action approval requirements.

The communication channel must not become an alternate privileged API.

---

## 42. AI Security and Customer Support

Customer-support agents must not expose privileged information merely because a customer persuades the model to reveal it.

Sensitive operations must be resolved through authoritative identity and authorization services.

The model must not determine customer entitlement solely from conversational claims.

---

## 43. AI Security and Commerce

AI shopping and commerce agents may recommend products and construct baskets, but authoritative commerce systems must independently validate:

- product availability;
- price;
- promotion eligibility;
- customer authorization;
- payment status;
- inventory state;
- and order validity.

The AI must not become the authoritative pricing or inventory system merely because it generated a value.

---

## 44. AI Security and Trust Intelligence

Trust Engine outputs must be treated as intelligence signals rather than unquestionable truth.

AI-generated trust signals must not independently create irreversible adverse outcomes without the controls required by the wider trust architecture.

This protects against:

- model bias;
- poisoned inputs;
- adversarial behaviour designed to manipulate scores;
- false positives;
- and model drift.

---

## 45. AI Security and Reward Intelligence

AI-generated reward recommendations must pass the existing reward authority boundary.

An AI agent must not create unlimited economic liability through repeated or manipulated reward requests.

Independent:

- eligibility;
- budget;
- transaction;
- abuse;
- and authorization checks

must remain authoritative.

---

## 46. AI Security and Delivery Intelligence

AI delivery recommendations must not bypass operational constraints.

AI may recommend a route or resource allocation, but the delivery platform must independently validate:

- vehicle capacity;
- driver availability;
- warehouse readiness;
- transport partner availability;
- delivery windows;
- safety constraints;
- and dispatch authority.

This preserves the resource-aware multimodal delivery architecture.

---

## 47. Defensive AI Governance Boundary

Commit 010 does not replace:

- ADR-007 AI Society Architecture;
- ADR-008 Intelligence Engine Architecture;
- ADR-009 AI Agent Governance & Permissions;
- ADR-010 Human-in-the-Loop Architecture;
- ADR-016 Observability, Auditability & Trust Architecture.

Those records define the architectural decisions.

Commit 010 defines the defensive engineering mechanisms that protect those decisions under attack or failure.

---

## 48. Relationship With Commit 006

Commit 006 provides runtime detection and adaptive abuse controls.

Commit 010 supplies AI-specific defensive signals and containment targets for that runtime defence layer.

The relationship is:

```text
AI Behaviour
     ↓
AI Security Telemetry
     ↓
Runtime Detection
     ↓
Risk Evaluation
     ↓
Containment / Response
```

---

## 49. Relationship With Commit 009

Commit 009 protects the infrastructure and network boundaries on which AI workloads run.

Commit 010 protects the AI-specific behaviour and trust boundaries operating above that infrastructure.

Neither replaces the other.

---

## 50. Defensive AI Laws

The following laws are established for Part 4:

1. AI inputs are not automatically trusted.
2. AI outputs are not automatically trusted.
3. Retrieved content is not automatically trusted.
4. AI agents must operate under least privilege.
5. Every privileged AI agent must be attributable.
6. Agent-to-agent communication must be authenticated and observable.
7. AI tools are privileged capabilities and must be governed as such.
8. AI reasoning does not equal authorization.
9. AI recommendations do not equal actions.
10. High-impact AI actions require independent policy enforcement.
11. AI transaction and resource limits must be externally enforced.
12. AI systems must resist prompt injection and indirect prompt injection.
13. AI memory must be protected against poisoning and unauthorized access.
14. Retrieval systems must enforce authorization before context assembly.
15. Model and data provenance must be governed.
16. AI supply-chain dependencies must be defensively controlled.
17. AI provider failover must respect security and data-residency requirements.
18. AI workloads must be protected against resource exhaustion.
19. AI components must be independently quarantineable where practical.
20. High-risk AI capabilities must have independent disable mechanisms.
21. Material AI actions must be traceable.
22. AI security telemetry must feed enterprise detection and response.
23. AI systems must undergo adversarial security testing.
24. AI security regressions must be tested when models or capabilities change materially.
25. Compromise of one AI component must not imply compromise of the entire AI Society.
26. AI must not become an alternate path around authoritative enterprise systems.
27. AI security controls must remain effective even when prompts or model behaviour are manipulated.
28. AI defensive engineering must complement, not replace, Part 3 AI security architecture.

---

## 51. Architectural Outcome

Commit 010 establishes AI as a defended computational layer rather than a trusted automation layer.

The resulting model is:

```text
                 UNTRUSTED AI INPUTS
                         │
                         ▼
                  INPUT BOUNDARY
                         │
                         ▼
                 AI / MODEL LAYER
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Memory     Retrieval     Agents
             │           │           │
             └───────────┼───────────┘
                         ▼
                   TOOL BOUNDARY
                         │
                         ▼
                POLICY / AUTHORITY
                         │
                 ┌───────┴───────┐
                 ▼               ▼
              ALLOW            DENY
                 │               │
                 ▼               ▼
             EXECUTION       CONTAINMENT
                 │
                 ▼
             AUDIT / TRACE
```

The AI Society therefore remains powerful without becoming an uncontrolled trust domain.

---

## 52. Forward-Consistency Requirements

The next Part 4 commit must build on this document without duplicating its AI defensive scope.

Commit 011 should focus specifically on **AI Intelligence & Distillation Defence**, including protection of proprietary intelligence, model behaviour, learned patterns, agent reasoning assets and resistance to extraction, distillation and competitive replication.

Affected architecture should be reviewed before Commit 011 is committed.

---

## Commit 010

```text
docs(eda): add AI defensive architecture

- Establish AI-specific defensive engineering boundary
- Define assume-compromise principles for AI components
- Establish AI trust boundaries
- Define direct and indirect prompt-injection defence
- Require independent validation of AI outputs
- Establish least-privilege AI agents and machine identities
- Secure agent-to-agent communication
- Govern AI tools as privileged capabilities
- Define excessive-agency and tool-misuse safeguards
- Establish AI transaction and resource limits
- Defend AI workloads against resource exhaustion
- Establish model, data and AI supply-chain protection
- Define model integrity and provenance requirements
- Protect retrieval, embeddings and agent memory
- Establish system-prompt and policy protection
- Define AI data-exfiltration controls
- Establish external-content isolation
- Secure AI external communications
- Preserve authoritative business-system boundaries
- Define AI fail-safe, quarantine and kill-switch mechanisms
- Establish secure AI provider failover
- Define AI observability and decision traceability
- Establish AI security telemetry
- Define AI adversarial and regression testing
- Protect Walk Mode, WhatsApp, commerce, trust, rewards and delivery AI
- Establish AI Society blast-radius controls
- Define defensive AI laws
- Establish forward-consistency requirements for Commit 011
```