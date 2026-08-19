# EDA-001 Part 4 — Commit 008 — Cyber Threat Defence & Application Attack Resistance

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 008  
**Decision Type:** Defensive Engineering Architecture

## 1. Purpose

This commit establishes the defensive engineering architecture for protecting Essentials Mart against application-layer cyber attacks and hostile input that may bypass ordinary business-logic controls.

Part 3 establishes the security architecture and control requirements. Part 4 Commit 008 defines how the platform is hardened, tested, monitored and contained when exposed to hostile application traffic, malicious payloads, exploit attempts or compromised clients.

This commit complements Commit 006, which establishes runtime threat detection and adaptive abuse control, and Commit 007, which establishes business-logic and API protection. It does not replace either.

## 2. Threat Boundary

The defensive boundary includes:

- web and mobile clients;
- public APIs;
- internal APIs;
- service-to-service interfaces;
- authentication endpoints;
- administrative interfaces;
- partner and supplier integrations;
- WhatsApp integration endpoints;
- webhook receivers;
- file and media upload paths;
- search and query interfaces;
- AI tool interfaces;
- Walk Mode real-time interfaces;
- event ingestion endpoints;
- third-party API responses;
- application infrastructure exposed to hostile traffic.

## 3. Attack Classes

Essentials Mart must defend against, at minimum:

- injection attacks;
- SQL and NoSQL injection;
- command injection;
- template injection;
- cross-site scripting;
- cross-site request forgery where applicable;
- path traversal;
- malicious file uploads;
- deserialisation attacks;
- request smuggling;
- HTTP protocol abuse;
- SSRF;
- credential attacks;
- session attacks;
- token theft and replay;
- API enumeration;
- automated exploitation;
- denial-of-service attempts;
- resource exhaustion;
- malicious bots;
- scraping;
- exploit chaining;
- supply-chain-delivered application compromise;
- malicious third-party API responses;
- AI prompt and tool abuse;
- malicious content and payload delivery.

OWASP's API Security Top 10 identifies broken authorization, unrestricted resource consumption, sensitive business-flow abuse, SSRF, security misconfiguration, improper API inventory and unsafe API consumption among the major API risks. These risks are therefore treated as explicit defensive concerns rather than assumed to be solved by perimeter controls alone. citeturn0search2turn0search3

## 4. Layered Application Defence

Application defence must operate in multiple layers:

1. edge filtering;
2. transport protection;
3. request validation;
4. authentication and authorization enforcement;
5. business-rule enforcement;
6. payload sanitisation;
7. safe data access;
8. service isolation;
9. runtime detection;
10. containment and recovery.

No single layer may be treated as sufficient protection.

## 5. Input and Payload Defence

All untrusted input must be treated as hostile until validated.

Controls include:

- strict schema validation;
- type validation;
- length limits;
- encoding validation;
- canonicalisation;
- allow-list validation where practical;
- rejection of malformed requests;
- safe parsing;
- content-type enforcement;
- upload size limits;
- file-type verification;
- malware scanning for uploaded content;
- safe filename handling;
- path traversal prevention;
- parameterised database access;
- safe command execution boundaries.

Validation must occur server-side even when equivalent client-side validation exists.

## 6. Injection Defence

The platform must prevent untrusted data from becoming executable instructions.

This applies to:

- SQL;
- NoSQL;
- shell commands;
- templates;
- HTML;
- JavaScript;
- regular-expression processing;
- search queries;
- graph/query languages;
- structured document processors;
- AI prompts and tool parameters.

Security controls must use safe APIs, parameterisation, contextual encoding and strict validation rather than relying on string filtering alone.

## 7. SSRF Defence

Services that retrieve remote resources must not blindly trust user-supplied destinations.

Controls include:

- destination allow-lists;
- URL parsing and canonicalisation;
- DNS resolution controls;
- private-network blocking;
- metadata-service blocking;
- redirect validation;
- outbound network restrictions;
- protocol restrictions;
- egress monitoring;
- per-service network policy.

This is particularly important for webhook, integration, media, mapping, delivery and third-party API functionality.

## 8. File and Media Security

Uploaded files must be treated as untrusted content.

The platform should provide:

- file size limits;
- extension and MIME validation;
- content inspection;
- malware scanning;
- isolated processing;
- storage outside executable application paths;
- generated safe filenames;
- access-controlled retrieval;
- retention controls;
- quarantine for suspicious files.

A successful upload must never imply that the uploaded content is trusted.

## 9. Web and Client Attack Resistance

Client-facing applications must defend against:

- XSS;
- CSRF where applicable;
- malicious deep links;
- malicious redirects;
- session theft;
- token exposure;
- unsafe local storage;
- browser exploitation;
- manipulated client requests.

Client hardening from Commit 005 remains complementary. Client controls must never be treated as the authoritative security boundary; critical controls remain server-enforced.

## 10. Authentication and Session Attack Resistance

The platform must resist attempts to compromise authenticated sessions through:

- credential stuffing;
- brute force;
- token theft;
- token replay;
- session fixation;
- session hijacking;
- device impersonation;
- abnormal authentication behaviour.

Controls include appropriate session lifetimes, secure token handling, revocation, anomaly detection, adaptive authentication and step-up verification where risk warrants it.

## 11. API Attack Resistance

Commit 007 defines the intrinsic API protection model. Commit 008 adds adversarial resistance around those controls.

The platform must defend API surfaces against:

- endpoint discovery;
- parameter fuzzing;
- malformed requests;
- excessive request depth;
- oversized payloads;
- request replay;
- protocol abuse;
- automated exploitation;
- resource exhaustion;
- API version abuse;
- exposed debug interfaces;
- unsafe third-party API responses.

API inventories must remain current so abandoned, deprecated or undocumented endpoints do not become hidden attack surfaces. OWASP specifically identifies improper API inventory management and unsafe consumption of APIs as API security risks. citeturn0search2

## 12. Third-Party and Integration Defence

Every external integration must be treated as an untrusted boundary.

This includes:

- payment providers;
- WhatsApp;
- mapping providers;
- delivery providers;
- analytics providers;
- cloud services;
- AI providers;
- supplier systems;
- contractor systems;
- external APIs.

External responses must be validated before they influence trusted internal state.

A compromised provider must not automatically gain authority over unrelated Essentials Mart domains.

## 13. AI Attack Resistance

AI interfaces require additional controls because hostile content may attempt to influence model behaviour or tool execution.

The platform must defend against:

- prompt injection;
- indirect prompt injection;
- context poisoning;
- malicious retrieved content;
- tool parameter manipulation;
- tool impersonation;
- unauthorized tool invocation;
- model-context exfiltration;
- AI-generated malicious payloads;
- agent-to-agent manipulation;
- attempts to bypass human approval thresholds.

AI-generated instructions must never override the platform's authoritative authorization and policy layers.

## 14. WhatsApp Attack Resistance

WhatsApp must be treated as a communication channel, not a trust boundary.

The platform must defend against:

- spoofed messages;
- replayed commands;
- account takeover;
- unauthorized action requests;
- malicious links;
- command injection through messages;
- social-engineering attempts;
- channel enumeration;
- abusive message volumes.

Sensitive actions must be authorized against the actual Essentials Mart identity and permissions before execution.

## 15. Walk Mode Attack Resistance

Walk Mode introduces real-time attack surfaces involving location, store context, device state and navigation.

Controls must defend against:

- location spoofing;
- manipulated store context;
- unauthorized inventory inference;
- malicious real-time events;
- navigation manipulation;
- proximity abuse;
- device impersonation;
- unauthorized autonomous actions.

Walk Mode must fail safely when trusted positioning, inventory or authorization signals become unreliable.

## 16. Malware and Compromised Client Defence

Essentials Mart must assume that some clients may be compromised.

The backend must therefore detect and limit suspicious behaviour originating from:

- rooted or modified mobile environments where detectable;
- automated browsers;
- malicious extensions;
- scripted clients;
- stolen credentials;
- reverse-engineered clients;
- modified application binaries;
- malware-controlled sessions.

Client compromise must not grant backend authority beyond the permissions associated with the authenticated identity and current context.

## 17. Exploit Containment

When an application attack is detected, the system must support graduated containment rather than relying exclusively on account termination.

Possible controls include:

- request rejection;
- endpoint isolation;
- token revocation;
- session termination;
- device challenge;
- temporary action suspension;
- network isolation;
- feature disablement;
- service circuit breakers;
- quarantine;
- escalation to security operations.

Containment actions must be auditable.

## 18. Security Headers and Secure Configuration

Application infrastructure must use secure configurations appropriate to each service.

This includes:

- secure HTTP headers;
- strict transport security where appropriate;
- safe cookie attributes;
- controlled CORS policies;
- disabled debug endpoints in production;
- hardened error handling;
- secure default configurations;
- removal of unnecessary services;
- production configuration validation.

Security configuration must be continuously checked for drift.

## 19. Error Handling and Information Disclosure

Application errors must not reveal unnecessary internal information.

Production responses must avoid exposing:

- secrets;
- credentials;
- internal network information;
- stack traces;
- database details;
- infrastructure identifiers;
- internal service topology;
- proprietary business rules;
- AI system prompts or protected context.

Detailed diagnostic information belongs in controlled internal telemetry.

## 20. Defensive Testing

Application security must be continuously tested through:

- static analysis;
- dependency analysis;
- dynamic application testing;
- API security testing;
- fuzzing;
- malicious payload testing;
- authentication testing;
- authorization testing;
- SSRF testing;
- upload testing;
- abuse-case testing;
- penetration testing;
- adversarial AI testing;
- regression testing after security fixes.

Security tests must be incorporated into CI/CD where technically appropriate.

## 21. Relationship to Previous Commits

### Commit 006 — Runtime Threat Detection & Bot Defence

Provides detection, adaptive controls, rate limiting, behavioural signals and runtime response.

### Commit 007 — Business Logic & API Protection

Provides authoritative business-rule, authorization and API control enforcement.

### Commit 008 — Cyber Threat Defence & Application Attack Resistance

Provides the adversarial hardening and attack-resistance layer around those controls.

### Commit 005 — Client Hardening

Provides additional resistance against client inspection, manipulation and replication.

### Part 3

Defines the enterprise security architecture, trust model, identity model, data security, AI security, privacy, monitoring and governance boundaries that this defensive engineering programme implements and strengthens.

## 22. Architectural Principles

Essentials Mart must:

- assume application traffic may be hostile;
- never trust client-side enforcement alone;
- validate at trust boundaries;
- minimise exposed attack surface;
- isolate failures;
- contain compromised components;
- preserve authoritative server-side state;
- protect sensitive business operations from automation abuse;
- treat third-party responses as untrusted input;
- make security controls observable and auditable;
- continuously test defensive assumptions.

## 23. Success Criteria

Commit 008 succeeds when:

- hostile input cannot directly become trusted execution;
- application attack surfaces are systematically hardened;
- compromised clients cannot bypass server authority;
- third-party integrations remain isolated by trust boundary;
- malicious files are contained before execution or distribution;
- SSRF paths are controlled;
- AI and WhatsApp interfaces cannot bypass authorization;
- application attacks can be detected and contained;
- security fixes can be regression-tested;
- defensive controls remain effective as the platform scales.

## 24. Forward Consistency Check

Before subsequent Part 4 commits are accepted, they must identify whether they affect:

- Commit 005 — Client Hardening;
- Commit 006 — Runtime Threat Detection & Bot Defence;
- Commit 007 — Business Logic & API Protection;
- Commit 008 — Cyber Threat Defence & Application Attack Resistance;
- Part 3 security architecture;
- ADR-015 — Security & Anti-Replication Architecture;
- ADR-016 — Observability, Auditability & Trust Architecture;
- relevant AI Society, Walk Mode, WhatsApp and integration architecture decisions.

Any material conflict must be resolved through an explicit amendment or reconciliation record before the next dependent commit is finalized.