# EDA-001 Part 4 — Commit 016

## Platform Authenticity & Anti-Impersonation Defence

**Status:** Commit Ready  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 016  
**Date:** 22 August 2026  
**Classification:** Defensive Architecture

---

# 1. Purpose

Commit-016 establishes the defensive architecture used to protect Essentials Mart from impersonation, counterfeit applications, fraudulent domains, fake communications, malicious integrations and other attempts to make an attacker appear to be Essentials Mart, an authorised partner, a trusted employee, an AI agent, a delivery operator or another legitimate participant in the ecosystem.

The objective is not merely to protect the application itself. The objective is to protect the **authenticity of the entire Essentials Mart ecosystem**.

The architecture therefore covers:

- customer-facing authenticity;
- application authenticity;
- domain and DNS authenticity;
- API authenticity;
- partner authenticity;
- staff and operator authenticity;
- AI-agent authenticity;
- communication-channel authenticity;
- payment and transaction authenticity;
- delivery/operator authenticity;
- device and session authenticity;
- software and deployment authenticity;
- and evidence required to distinguish genuine activity from impersonation.

---

# 2. Constitutional Principle

> **Essentials Mart must make it difficult for an unauthorised actor to convincingly appear to be Essentials Mart or an authorised participant in the Essentials Mart ecosystem.**

Identity alone is insufficient.

The architecture must establish authenticity through multiple independently verifiable signals.

```text
Identity
   +
Credential
   +
Device / Session Context
   +
Cryptographic Proof
   +
Authorisation
   +
Channel Integrity
   +
Behaviour
   +
Provenance
        ↓
Authenticity Assessment
```

---

# 3. Threat Model

Essentials Mart must account for attempts to impersonate:

- Essentials Mart itself;
- Essentials Mart employees;
- customer-support personnel;
- delivery personnel;
- stores;
- suppliers;
- logistics partners;
- payment providers;
- external integration partners;
- AI agents;
- household members;
- customers;
- administrators;
- developers;
- and authorised service accounts.

Attackers may attempt to use:

- fake websites;
- look-alike domains;
- cloned mobile applications;
- counterfeit APIs;
- stolen credentials;
- compromised accounts;
- forged messages;
- fake support communications;
- fraudulent payment instructions;
- manipulated QR codes;
- malicious links;
- counterfeit delivery identities;
- fake partner identities;
- manipulated software packages;
- or compromised infrastructure.

---

# 4. Platform Authenticity

Customers must have a reliable method of determining whether they are interacting with the genuine Essentials Mart platform.

The architecture should support:

- authenticated application distribution;
- signed application releases where platform capabilities permit;
- verified domains;
- TLS certificate validation;
- secure API endpoints;
- controlled redirect destinations;
- official communication channels;
- trusted notification origins;
- and consistent platform identity.

No security mechanism can guarantee that every user will recognise every fraudulent communication. The architecture must therefore reduce the ability of attackers to create convincing counterfeit interactions.

---

# 5. Domain and DNS Protection

The enterprise shall protect its authoritative domains and DNS configuration.

Controls should include:

- registrar account protection;
- strong administrative authentication;
- MFA for domain administration;
- registrar lock where appropriate;
- controlled DNS administration;
- DNS change monitoring;
- certificate lifecycle monitoring;
- detection of unauthorised records;
- domain expiry protection;
- defensive registration of strategically important domains where justified;
- and monitoring for look-alike domains.

Domain compromise can undermine otherwise strong application security because customers may be redirected before reaching genuine infrastructure.

---

# 6. Look-Alike and Counterfeit Domains

Essentials Mart should monitor for domains resembling its legitimate domains.

Potential indicators include:

- character substitution;
- character omission;
- additional words;
- misleading subdomains;
- alternate top-level domains;
- homoglyphs;
- internationalised-domain abuse;
- and domains combining Essentials Mart terminology with unrelated infrastructure.

Detection should feed into the defensive monitoring and incident-response architecture.

---

# 7. Application Authenticity

The mobile and web clients must be distributed through controlled channels wherever possible.

The architecture should support:

- signed releases;
- controlled build pipelines;
- release provenance;
- integrity verification;
- version verification;
- secure update mechanisms;
- compromised-version withdrawal;
- and emergency security updates.

Client hardening defined elsewhere in Part 4 remains complementary to this control.

Client hardening makes unauthorised analysis and modification more difficult.

Platform authenticity makes counterfeit distribution easier to detect and contain.

---

# 8. API Authenticity

An API request must be distinguishable from an unauthorised imitation of a legitimate client or service.

API authenticity must therefore consider:

- authenticated service identity;
- token provenance;
- credential lifecycle;
- request signing where appropriate;
- mTLS where appropriate;
- audience restrictions;
- issuer validation;
- nonce/replay protection where required;
- request integrity;
- and service authorisation.

A valid-looking request is not automatically a trustworthy request.

---

# 9. Partner Authenticity

Every external partner must have a governed identity.

This applies to:

- payment providers;
- messaging providers;
- WhatsApp integrations;
- mapping providers;
- delivery providers;
- logistics partners;
- suppliers;
- financial partners;
- analytics providers;
- AI providers;
- cloud providers;
- and other managed services.

Partner identity must be independently verifiable through controlled credentials, certificates, contractual identifiers, API identities or equivalent mechanisms.

The architecture must never rely solely on a partner-provided display name.

---

# 10. Partner Substitution

The platform must remain provider-neutral where architecture permits substitution.

For example:

```text
Partner Capability
       ↓
Authenticated Adapter
       ↓
Essentials Mart
```

rather than:

```text
Essentials Mart
       ↓
Hard-coded Provider Identity
```

This prevents a provider name from becoming an implicit trust boundary.

A provider may be replaced without changing the fundamental security model.

---

# 11. Human Staff Authenticity

Customers interacting with human staff must be able to distinguish legitimate staff interactions from impersonation.

Where operationally appropriate, the system may provide:

- authenticated staff identities;
- staff identifiers;
- controlled communication channels;
- role-specific permissions;
- verified support sessions;
- transaction references;
- and auditable interaction records.

Staff must not request sensitive credentials through unofficial channels.

---

# 12. Customer Support Anti-Impersonation

Support workflows must be designed so an attacker cannot easily impersonate support personnel and persuade customers to:

- disclose passwords;
- disclose authentication codes;
- transfer money;
- approve fraudulent transactions;
- reveal payment credentials;
- install malicious software;
- or bypass security controls.

Support processes should favour verifiable in-app actions over unverifiable instructions communicated through arbitrary channels.

---

# 13. Delivery Operator Authenticity

Delivery personnel must be attributable to an authorised delivery operation.

Where appropriate, delivery interactions may use:

- authenticated delivery identities;
- delivery-job identifiers;
- one-time verification codes;
- customer-visible order references;
- controlled proof-of-delivery mechanisms;
- and auditable handoff records.

A person claiming to be a delivery operator must not be trusted merely because they possess customer information.

---

# 14. Payment Authenticity

Payment instructions and payment status must originate from authorised payment capabilities.

The platform must distinguish:

```text
Payment Provider Confirmation
          ✓

Customer-visible claim of payment
          ✗
```

Financial state must be derived from authoritative payment records rather than messages that merely claim payment occurred.

This principle applies to:

- checkout;
- refunds;
- rewards;
- subscriptions;
- partner payments;
- wallet features;
- and future BuckPay capabilities.

---

# 15. AI Agent Authenticity

AI Society agents must possess verifiable identities.

An AI agent must not be trusted simply because its message claims to originate from a named agent.

Agent identity should be bound to:

- an authorised agent identifier;
- capability scope;
- execution environment;
- credentials;
- model/provider context where material;
- and traceable execution records.

Conceptually:

```text
Agent Identity
      ↓
Capability
      ↓
Authority
      ↓
Action
```

These are separate concepts.

---

# 16. AI Agent Impersonation

The architecture must defend against an attacker attempting to imitate an internal AI agent in order to:

- obtain privileged data;
- trigger tools;
- issue commands;
- influence another agent;
- bypass human approval;
- manipulate trust scores;
- alter rewards;
- influence payments;
- modify delivery decisions;
- or inject false intelligence.

Agent-to-agent communication must therefore use authenticated channels and governed message identities.

---

# 17. AI Output Authenticity

An AI-generated statement must not automatically be treated as an authoritative enterprise fact.

The system should distinguish:

```text
AI Recommendation
        ≠
Authoritative Enterprise State
```

For example:

```text
AI: "Payment appears successful."
        ↓
Payment System Verification
        ↓
Authoritative Payment State
```

This prevents AI-generated text from becoming an authentication or transaction authority.

---

# 18. Communication Channel Authenticity

Essentials Mart may communicate through:

- in-app notifications;
- email;
- SMS;
- WhatsApp;
- web interfaces;
- partner applications;
- and future channels.

Each channel must have a defined authenticity model.

The platform must avoid making security-critical claims that depend solely on an unverified communication channel.

---

# 19. Notification Authenticity

Notifications should provide sufficient context for customers to distinguish genuine system events from fraudulent messages.

Where practical, notifications should reference:

- an order;
- transaction;
- delivery;
- account action;
- or other verifiable in-app record.

Sensitive actions should preferably require confirmation inside the authenticated application rather than through a link contained in an unsolicited message.

---

# 20. QR and Deep-Link Protection

QR codes and deep links may be used for:

- delivery verification;
- store interactions;
- Walk Mode;
- payments;
- promotions;
- partner discovery;
- and other workflows.

They must not automatically be trusted merely because they visually resemble Essentials Mart branding.

Security-sensitive QR/deep-link workflows should use:

- signed or authenticated references where appropriate;
- short-lived tokens;
- server-side validation;
- destination allowlists;
- and replay protection where required.

---

# 21. Session Authenticity

Authentication must not be treated as permanent proof that the current session remains legitimate.

Risk-sensitive workflows may require additional verification based on:

- device change;
- unusual location;
- unusual behaviour;
- session age;
- privilege escalation;
- transaction value;
- or other contextual signals.

This connects directly to the Trust Engine architecture established in Commit-015.

---

# 22. Device Authenticity

Where supported by the platform, Essentials Mart may use device integrity and application-attestation signals as additional evidence.

These signals must not be treated as absolute proof of trust.

A legitimate device can be compromised, and a valid attestation can become stale.

Device signals therefore contribute to contextual risk evaluation rather than replacing identity and authorisation.

---

# 23. Software and Build Authenticity

Every production software artifact should have traceable provenance.

The architecture should support:

- source-control provenance;
- reproducible or controlled builds where practical;
- signed artifacts;
- dependency verification;
- SBOM generation;
- release approval;
- artifact integrity verification;
- deployment provenance;
- and rollback capability.

NIST's current supply-chain guidance emphasises provenance, supplier assessment, software verification, SBOMs, open-source controls and vulnerability management as important components of software supply-chain security. citeturn0search1turn0search3

---

# 24. Infrastructure Authenticity

Infrastructure components must be attributable to authorised deployments.

The architecture should support verification of:

- container images;
- packages;
- deployment artifacts;
- configuration;
- infrastructure-as-code;
- service identities;
- certificates;
- and runtime workloads.

Unexpected infrastructure should be treated as a potential security event.

---

# 25. Secrets and Credential Authenticity

Credentials must be:

- uniquely attributable;
- scoped;
- time-limited where appropriate;
- rotatable;
- revocable;
- monitored;
- and protected from unauthorised duplication.

Shared long-lived credentials should be avoided where a stronger identity model is available.

---

# 26. Anti-Replay Protection

Authenticity mechanisms must account for captured legitimate messages being replayed by attackers.

Where required, the architecture should use:

- timestamps;
- nonces;
- sequence numbers;
- short-lived tokens;
- idempotency keys;
- transaction identifiers;
- and server-side state validation.

A message that was authentic once must not automatically remain valid forever.

---

# 27. Authenticity vs Authorisation

The architecture explicitly separates:

**Authentication** — Who or what is this?

**Authenticity** — Is the presented identity/provenance genuine?

**Authorisation** — What may it do?

**Trust** — How much confidence should the system currently place in it?

**Risk** — What could happen if the assumption is wrong?

These concepts must not be collapsed into a single trust flag.

---

# 28. Detection of Impersonation

Signals may include:

- look-alike domains;
- abnormal certificates;
- unknown application builds;
- impossible identity combinations;
- invalid service credentials;
- unexpected partner endpoints;
- unusual agent identifiers;
- suspicious communication patterns;
- abnormal payment instructions;
- counterfeit QR/deep links;
- anomalous delivery identities;
- and compromised accounts.

Detection must feed into Commit-017 Defensive Monitoring & Detection.

---

# 29. Response to Impersonation

Confirmed or strongly suspected impersonation should trigger proportionate response.

Possible responses include:

- credential revocation;
- session termination;
- partner isolation;
- endpoint blocking;
- domain/reporting escalation;
- application-version withdrawal;
- customer warning;
- transaction hold;
- AI-agent quarantine;
- and incident-response escalation.

Response must be governed rather than improvised.

---

# 30. Customer Protection During Impersonation Events

If Essentials Mart detects a credible impersonation campaign, it should be able to communicate trusted guidance through authenticated channels.

For example:

```text
Detected Fraudulent Campaign
          ↓
Risk Assessment
          ↓
Customer Protection Decision
          ↓
Trusted In-App Notice
          ↓
Additional Controls
```

The architecture must avoid amplifying fraudulent content while warning customers.

---

# 31. Partner Impersonation Detection

The platform should monitor for fraudulent actors claiming to represent legitimate partners.

This is particularly important for:

- payment providers;
- logistics providers;
- delivery services;
- financial services;
- WhatsApp integrations;
- mapping services;
- AI providers;
- and supplier networks.

Partner authenticity should be established through the governed adapter/integration layer rather than informal naming conventions.

---

# 32. Supply-Chain Authenticity

The authenticity boundary extends into the technology supply chain.

Essentials Mart must consider whether acquired software, services, devices or infrastructure are genuine, untampered and attributable to the expected supplier.

This includes:

- open-source dependencies;
- package registries;
- cloud services;
- AI models;
- AI providers;
- managed services;
- development tools;
- contractors;
- infrastructure providers;
- and third-party APIs.

NIST's 2024 C-SCRM guidance explicitly treats products and services as supply-chain risk surfaces and recommends provenance, supplier assessment and risk-based controls. citeturn0search2turn0search7

---

# 33. Authenticity Failure

If authenticity cannot be established for a security-sensitive action, the default should be:

```text
Authenticity Uncertain
        ↓
Reduce Authority
        ↓
Require Verification
        ↓
Hold / Reject Sensitive Action
```

The system should not silently convert uncertainty into trust.

---

# 34. Safe Degradation

Authenticity infrastructure may itself become unavailable.

The platform must define which operations can continue and which must be restricted when authenticity verification services are unavailable.

Low-risk operations may continue under constrained conditions.

High-risk operations may require stronger verification or temporary suspension.

---

# 35. Auditability

Material authenticity decisions must be attributable.

Records should allow investigators to determine:

- what identity was presented;
- what evidence supported authenticity;
- what verification occurred;
- what trust/risk context existed;
- what action was permitted;
- and what happened afterwards.

This connects to the existing observability, auditability and trust architecture.

---

# 36. Legal and Brand Protection

Technical controls should be complemented by legal and operational measures where appropriate.

Potential measures include:

- trademark protection;
- domain monitoring;
- takedown processes;
- impersonation reporting;
- abuse contacts;
- partner contractual requirements;
- evidence preservation;
- and incident documentation.

Technical security cannot substitute for legal enforcement of counterfeit activity.

---

# 37. Testing

The architecture should be tested against scenarios including:

- cloned applications;
- look-alike domains;
- fake support accounts;
- stolen employee credentials;
- fake delivery operators;
- forged partner messages;
- compromised API credentials;
- counterfeit QR codes;
- malicious deep links;
- replayed authentication messages;
- fake AI agents;
- compromised deployment artifacts;
- supply-chain substitution;
- and fraudulent payment instructions.

Testing must include both technical and social-engineering scenarios.

---

# 38. Relationship With Other Part 4 Commits

Commit-016 does not replace previous defensive layers.

```text
Commit 010
AI Defensive Architecture
        ↓
Commit 011
AI Intelligence & Distillation Defence
        ↓
Commit 012
Data & Intelligence Protection
        ↓
Commit 013
Commerce & Economic Abuse Defence
        ↓
Commit 014
API & Service Boundary Defence
        ↓
Commit 015
Trust Engine Defensive Architecture
        ↓
Commit 016
Platform Authenticity & Anti-Impersonation
```

Each layer answers a different question.

---

# 39. Constitutional Laws

1. Essentials Mart must maintain a verifiable platform identity.
2. Authentication, authenticity, authorisation, trust and risk must remain distinct.
3. A claimed identity is not sufficient proof of authenticity.
4. Security-sensitive actions must rely on authoritative verification.
5. Partner identities must be independently governed.
6. AI agents must possess attributable identities.
7. AI-generated claims must not become authoritative state merely because they appear genuine.
8. Production software must have traceable provenance.
9. Critical credentials must be scoped, revocable and attributable.
10. Replay of previously valid messages must be controlled.
11. Customer-support identities must be protected against impersonation.
12. Delivery identities must be attributable to authorised delivery operations.
13. Payment state must come from authoritative payment systems.
14. Domains and DNS are security boundaries.
15. Counterfeit applications and domains must be monitored where practical.
16. External communication channels must have defined authenticity models.
17. Authenticity uncertainty must reduce authority rather than silently increase trust.
18. Authenticity failures must be observable and actionable.
19. Supply-chain provenance must be considered part of platform authenticity.
20. Technical authenticity controls must be complemented by appropriate legal and operational controls.
21. Authenticity mechanisms must be tested adversarially.
22. Authenticity controls must integrate with Trust Engine, Monitoring, Incident Response and Supply-Chain Defence.
23. No authenticity mechanism should be treated as infallible.

---

# 40. Architectural Outcome

Commit-016 establishes authenticity as a platform-wide security property.

The resulting model is:

```text
                    ESSENTIALS MART ECOSYSTEM
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
     Customers             Partners              AI Society
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                     AUTHENTICITY LAYER
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   Identity              Provenance            Channel
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                       TRUST / RISK ENGINE
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
             Authorise                  Restrict
                 │                         │
                 └────────────┬────────────┘
                              ▼
                         ACTION / DATA
                              │
                              ▼
                       OBSERVABILITY
                              │
                              ▼
                         RESPONSE
```

Essentials Mart therefore treats authenticity as a continuously evaluated property of the platform, its people, its software, its AI, its partners, its communications and its infrastructure—not merely as a login event.

---

# Commit Message

`docs(eda): add platform authenticity and anti-impersonation defence`

# Extended Commit Message

Establish the platform authenticity and anti-impersonation defensive architecture for EDA-001 Part 4.

- Define platform-wide authenticity as a security property
- Separate authenticity from authentication, authorisation, trust and risk
- Establish domain, DNS and application authenticity controls
- Define API, partner and service authenticity requirements
- Protect human staff and customer-support identities
- Establish delivery operator authenticity controls
- Protect payment and transaction authenticity
- Define AI agent identity and anti-impersonation controls
- Establish communication, notification, QR and deep-link authenticity
- Define session and device authenticity signals
- Establish software, build and infrastructure provenance
- Define credential and anti-replay protections
- Establish impersonation detection and response integration
- Protect customers during impersonation campaigns
- Extend authenticity requirements into the technology supply chain
- Establish safe degradation when authenticity verification is unavailable
- Define authenticity auditability and legal/brand protection considerations
- Establish adversarial testing requirements
- Integrate authenticity with Trust Engine, monitoring and incident response
- Define constitutional platform authenticity laws
