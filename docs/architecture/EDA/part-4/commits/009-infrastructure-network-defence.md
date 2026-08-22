# EDA-001 Part 4 — Commit 009 — Infrastructure & Network Defence

**Status:** Proposed  
**Part:** EDA-001 Part 4 — Platform Protection, Resilience & Defensive Engineering  
**Commit:** 009  
**Decision Type:** Defensive Infrastructure & Network Architecture

## 1. Purpose

This commit establishes the defensive engineering architecture for protecting the infrastructure and network boundary of Essentials Mart against hostile activity, compromise, lateral movement, service disruption and attempts to bypass application-layer controls.

Part 3 establishes the underlying infrastructure and network security architecture. Part 4 Commit 009 defines how those boundaries are hardened, segmented, monitored, degraded safely and defended when deliberately attacked or when a trusted component becomes compromised.

Commit 009 follows Commit 008 — Cyber Threat Defence & Application Attack Resistance. It moves the defensive boundary below the application layer into the infrastructure, network, workload and service-connectivity layers.

## 2. Defensive Boundary

The infrastructure and network defensive boundary includes:

- cloud infrastructure;
- compute workloads;
- containers and orchestration platforms;
- databases, caches and storage;
- queues, brokers and event infrastructure;
- internal and external networks;
- management interfaces;
- DNS;
- ingress and egress paths;
- gateways and load balancers;
- firewalls and network policies;
- service-to-service communication;
- development and deployment infrastructure;
- observability infrastructure;
- backup and disaster-recovery infrastructure;
- edge infrastructure; and
- infrastructure supporting stores, warehouses and other operational locations.

## 3. Infrastructure Trust Principle

Infrastructure components must not be trusted merely because they are inside a private network or belong to Essentials Mart.

```text
Network Location
      ≠
Trust
```

A compromised workload, credential, service or network segment must not automatically provide unrestricted access to other resources.

This complements the identity and authorization architecture rather than replacing it.

## 4. Network Segmentation

The platform must use segmentation to reduce blast radius.

Logical boundaries should separate, as appropriate:

- public-facing workloads;
- application services;
- data services;
- management systems;
- security systems;
- build and deployment systems;
- development, staging and production environments;
- highly sensitive workloads;
- partner connectivity; and
- operational/store connectivity.

Segmentation must be based on actual trust and business requirements rather than simply on network topology.

## 5. East-West Defence

Defence must operate not only at the internet perimeter but also between internal workloads.

The platform should restrict unnecessary service-to-service communication through:

- explicit service identities;
- network policies;
- service authorization;
- workload isolation;
- least-privilege connectivity;
- authenticated service communication;
- encrypted transport; and
- monitoring of unexpected communication.

An attacker who compromises one service must not automatically gain unrestricted lateral movement.

## 6. North-South Defence

Internet-facing and external connectivity must be protected through layered controls appropriate to the service.

Controls may include:

- DDoS protection;
- edge filtering;
- web application firewalls;
- API gateways;
- rate controls;
- ingress validation;
- TLS protection;
- network access controls;
- traffic inspection where appropriate; and
- anomaly detection.

Perimeter controls are not sufficient by themselves. Application and service-level controls remain mandatory.

## 7. Egress Defence

Outbound traffic must be controlled because a compromised workload may attempt to exfiltrate data, contact command-and-control infrastructure, exploit internal services through external pivots, abuse external APIs, consume uncontrolled resources or establish persistence.

Where practical, egress should use:

- allow-lists;
- destination restrictions;
- DNS controls;
- proxy or gateway enforcement;
- protocol restrictions;
- workload-specific network policy;
- logging; and
- anomaly detection.

## 8. DNS Defence

DNS must be treated as a security-sensitive infrastructure capability.

Defensive controls should address:

- unauthorized DNS changes;
- malicious domains;
- DNS tunnelling;
- unexpected external resolution;
- domain impersonation;
- compromised DNS credentials;
- cache poisoning risks; and
- unauthorized resolver use.

Critical service discovery must not depend on uncontrolled external DNS behaviour.

## 9. Administrative Access

Infrastructure administration must be strongly isolated from ordinary application traffic.

Administrative access should require:

- strong identity assurance;
- least privilege;
- privileged-access controls;
- secure administrative endpoints;
- multi-factor authentication where applicable;
- session logging;
- time-bounded privilege where appropriate; and
- auditable administrative actions.

Administrative interfaces must not be unnecessarily exposed to the public internet.

## 10. Workload Isolation

Workloads must be isolated according to their sensitivity and required privileges.

The platform should minimise:

- shared credentials;
- shared privileged execution;
- unnecessary host access;
- unnecessary filesystem access;
- unrestricted network access; and
- shared secrets.

Where containers or similar workload technologies are used, the platform should additionally protect against container escape, insecure runtime configuration, excessive privileges and compromised images.

## 11. Infrastructure Hardening

Infrastructure must be hardened before production use.

Hardening should address:

- unnecessary services;
- default credentials;
- unnecessary ports;
- insecure protocols;
- excessive privileges;
- unsupported software;
- insecure configurations;
- exposed management interfaces;
- insecure storage; and
- unneeded network paths.

Configuration must be managed as controlled infrastructure rather than relying on undocumented manual changes.

## 12. Patch and Vulnerability Response

Infrastructure vulnerabilities must be prioritised according to exploitability, exposure, asset criticality, available mitigations, active exploitation, business impact and recovery options.

Critical internet-facing vulnerabilities may require emergency remediation outside normal release cycles.

Where immediate patching is not possible, compensating controls must reduce exposure.

## 13. Infrastructure Configuration Integrity

Production infrastructure configuration must be protected against unauthorized modification.

The platform should maintain:

- version-controlled configuration;
- approved deployment pathways;
- configuration drift detection;
- change records;
- privileged-action logging; and
- rollback capability.

A successful configuration change must not automatically be considered an authorized change.

## 14. Secrets and Credential Defence

Infrastructure secrets must not be embedded in source code, client applications, images or public configuration.

The architecture should use governed secret-management capabilities for:

- service credentials;
- database credentials;
- API credentials;
- signing keys;
- encryption keys;
- deployment credentials;
- partner credentials; and
- infrastructure credentials.

Compromise of one credential must be contained through scoped permissions, rotation and revocation.

## 15. Service-to-Service Protection

Internal services must authenticate and authorize one another where trust is required.

The platform should use:

- service identities;
- authenticated communication;
- encryption in transit;
- scoped credentials;
- authorization policies;
- certificate or key rotation; and
- service-level observability.

A private IP address must never be treated as sufficient proof of service identity.

## 16. Database and Data-Service Network Defence

Databases, caches and other data services should not be directly exposed to untrusted networks unless explicitly required.

Access should be restricted by service identity, network policy, authorization, encryption, private connectivity and monitoring.

A compromised application service must not automatically obtain unrestricted access to every data store.

## 17. Queue, Broker and Event Infrastructure Defence

Queues, brokers and event infrastructure must be treated as security-sensitive infrastructure.

Controls should address:

- producer authentication;
- consumer authentication;
- topic or stream authorization;
- tenant isolation;
- message-size limits;
- resource quotas;
- replay access;
- administrative access;
- encryption; and
- monitoring.

This complements EDA-013 rather than redefining event semantics.

## 18. DDoS and Resource Exhaustion Defence

The infrastructure must resist attempts to exhaust bandwidth, compute, memory, connections, database capacity, queues, storage, API quotas and third-party service limits.

Defences may include:

- upstream DDoS mitigation;
- rate limiting;
- connection limits;
- quotas;
- autoscaling with safeguards;
- circuit breakers;
- load shedding;
- priority handling; and
- isolation of critical workloads.

Autoscaling must not become an attacker-controlled mechanism for generating unlimited infrastructure cost.

## 19. Failure Isolation

Infrastructure failures must be contained where practical.

The architecture should avoid unnecessary shared failure domains between:

- customer-facing commerce;
- payments;
- identity;
- fulfilment;
- delivery;
- AI workloads;
- analytics;
- development systems; and
- administrative systems.

Critical services should have appropriate redundancy and independent recovery paths.

## 20. Dependency Failure Defence

A compromised or unavailable infrastructure provider must not automatically compromise unrelated platform capabilities.

Where practical, critical dependencies should have:

- bounded permissions;
- health monitoring;
- timeout controls;
- circuit breakers;
- fallback behaviour;
- alternative providers where justified;
- data portability; and
- recovery procedures.

This extends the provider-neutral architecture established elsewhere in Essentials Mart.

## 21. Third-Party Network Connectivity

Partner and external connectivity must terminate at controlled integration boundaries.

Examples include:

- payment providers;
- WhatsApp;
- mapping providers;
- delivery providers;
- AI providers;
- analytics providers;
- suppliers;
- cloud services;
- managed services; and
- external transport partners.

External network connectivity must not create unrestricted routes into internal networks.

## 22. Store and Operational Network Defence

Physical stores, warehouses and operational locations may introduce additional network boundaries.

Where connected, these environments should use controlled segmentation for:

- point-of-sale systems;
- staff devices;
- customer Wi-Fi;
- inventory equipment;
- cameras and physical security systems where integrated;
- IoT devices;
- warehouse systems; and
- administrative systems.

Compromise of a low-trust device must not provide unrestricted access to commerce or enterprise systems.

## 23. Development and Deployment Infrastructure

Development and deployment infrastructure must be treated as a high-value attack surface because compromise may allow malicious code to reach production.

Controls should include:

- isolated environments;
- protected source repositories;
- protected build credentials;
- controlled deployment identities;
- signed or verified build artefacts where appropriate;
- build provenance;
- CI/CD access controls; and
- monitoring of privileged deployment activity.

This complements Commit 004's software supply-chain defence.

## 24. Backup Infrastructure Defence

Backups must be protected against the same compromise that affects production systems.

Where appropriate, backups should provide:

- isolation;
- access separation;
- immutable or protected copies;
- encryption;
- retention controls;
- integrity verification; and
- tested restoration.

A backup that an attacker can silently delete or alter during the primary compromise cannot be treated as a dependable recovery control.

## 25. Infrastructure Telemetry

Infrastructure security telemetry should provide visibility into:

- unusual network connections;
- authentication failures;
- privilege escalation;
- configuration changes;
- unexpected egress;
- service failures;
- resource exhaustion;
- lateral movement indicators;
- infrastructure anomalies; and
- security-control failures.

Telemetry must feed the broader detection and response architecture rather than becoming an isolated logging system.

## 26. Compromise Containment

When infrastructure compromise is suspected, the platform must be capable of reducing the attacker's available paths.

Possible actions include:

- isolating workloads;
- revoking credentials;
- blocking network paths;
- disabling compromised integrations;
- quarantining infrastructure;
- restricting egress;
- scaling down affected services; and
- moving critical operations to protected recovery environments.

Containment actions must be auditable and must avoid unnecessary destruction of evidence.

## 27. Safe Degradation

Security controls must account for service degradation.

If a non-critical security or infrastructure dependency fails, the platform should prefer controlled degradation over uncontrolled failure where safe.

For critical security decisions, fail-closed behaviour may be required.

For non-critical enrichment or analytics, fail-open or deferred processing may be acceptable where explicitly governed.

The failure mode must therefore be determined by business and security criticality rather than applied universally.

## 28. Infrastructure Recovery

Infrastructure recovery must support restoration from a known-good state.

Recovery should address:

- compromised credentials;
- corrupted infrastructure configuration;
- compromised workloads;
- compromised images;
- network misconfiguration;
- damaged data services;
- regional infrastructure failure; and
- provider outages.

Recovery procedures must be tested rather than assumed to work.

## 29. Infrastructure Attack Paths

Part 4 threat modelling must consider attack paths such as:

```text
Compromised Client
      ↓
Application
      ↓
Service Credential
      ↓
Internal Service
      ↓
Data Store
```

```text
Compromised Dependency
      ↓
Build / Deployment System
      ↓
Production Workload
      ↓
Internal Network
      ↓
Data / Control Plane
```

```text
Exposed Network Service
      ↓
Exploit
      ↓
Workload Compromise
      ↓
Credential Theft
      ↓
Lateral Movement
```

Defensive engineering must seek to break these chains at multiple points.

## 30. Infrastructure Security Testing

Infrastructure defences must be tested through:

- configuration assessment;
- vulnerability scanning;
- network segmentation testing;
- privilege testing;
- attack-path analysis;
- DDoS and resource-exhaustion exercises where safe;
- disaster-recovery testing;
- credential-revocation exercises;
- backup restoration tests; and
- controlled adversarial testing.

Testing belongs to the broader adversarial verification programme and must not create unnecessary production risk.

## 31. Relationship to Part 3

Part 3 remains authoritative for infrastructure security requirements, network security architecture, identity, access control, encryption, security governance and enterprise security boundaries.

Commit 009 addresses the defensive problem of making those controls resilient against deliberate attack, compromise and failure.

## 32. Relationship to Previous Part 4 Commits

Commit 009 depends directly on:

- Commit 001 — Defensive Engineering Foundation;
- Commit 002 — Platform Threat & Attack Model;
- Commit 004 — Software Supply-Chain Security Architecture;
- Commit 006 — Runtime Threat Detection, Bot Defence & Adaptive Abuse Control; and
- Commit 008 — Cyber Threat Defence & Application Attack Resistance.

It also provides infrastructure-level support for later commits covering AI defensive architecture, data and intelligence protection, automated containment, incident response, resilience and continuity, and adversarial verification.

## 33. Constitutional Defensive Laws

1. Network location does not establish trust.
2. Infrastructure must be segmented according to trust and business requirements.
3. Internal traffic must not be inherently trusted.
4. Egress must be controlled according to service requirements.
5. Administrative access must be isolated and auditable.
6. Workloads must operate with least privilege.
7. Infrastructure configuration must be controlled and traceable.
8. Secrets must be centrally governed and rotatable.
9. Service-to-service communication must be authenticated where trust is required.
10. Data services must not be unnecessarily exposed.
11. Event and broker infrastructure must be security-controlled.
12. DDoS and resource exhaustion must be treated as infrastructure threats.
13. Autoscaling must not create uncontrolled economic exposure.
14. External partners must not receive unrestricted internal network access.
15. Store and warehouse networks must be appropriately segmented.
16. Development and deployment infrastructure must be treated as production-adjacent high-value assets.
17. Backups must be protected from primary-environment compromise.
18. Infrastructure telemetry must support detection and response.
19. Infrastructure compromise must be containable.
20. Critical infrastructure must have tested recovery paths.
21. Infrastructure controls must be tested adversarially.
22. Infrastructure defence must complement, not duplicate, Part 3 security architecture.

## 34. Architectural Outcome

Commit 009 establishes infrastructure and network defence as a distinct defensive layer beneath the application security boundary.

```text
Threat
  ↓
Network / Edge Defence
  ↓
Infrastructure Defence
  ↓
Workload Isolation
  ↓
Service-to-Service Defence
  ↓
Application Defence
  ↓
Business Logic Defence
  ↓
Runtime Detection & Abuse Defence
  ↓
Containment
  ↓
Recovery
```

The objective is not to create an impenetrable perimeter. The objective is to ensure that a successful compromise at one layer does not automatically become a successful compromise of the enterprise.

> **Essentials Mart shall engineer its infrastructure and networks so that compromise is difficult, lateral movement is constrained, abnormal connectivity is observable, critical resources are isolated, and recovery remains possible even when an attacker defeats an individual control.**
