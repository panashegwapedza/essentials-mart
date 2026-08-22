# EDA-001 Part 4 — Commit 013

## Commerce & Economic Abuse Defence

**Status:** Commit Ready  
**Parent Architecture:** EDA-001 Part 4  
**Commit:** 013  
**Classification:** Defensive Architecture  

## 1. Purpose

This commit establishes the defensive architecture for protecting Essentials Mart's commercial and economic systems from abuse, fraud, manipulation, resource exploitation and financially harmful automation.

It complements the infrastructure, AI, data and intelligence protections established by earlier Part 4 commits. It does not replace fraud, trust, payment, identity or business-domain architecture; it establishes the security boundary and control requirements those systems must satisfy.

## 2. Protected Economic Surfaces

Protection applies to, where relevant:

- registration and onboarding incentives;
- checkout;
- carts and inventory holds;
- payments;
- refunds;
- cancellations;
- discounts;
- coupons and promotions;
- referrals;
- rewards;
- gift cards and vouchers;
- loyalty balances;
- subscriptions;
- delivery pricing;
- delivery credits;
- partner incentives;
- marketplace or supplier settlement;
- BuckPay when introduced;
- AI-generated offers and recommendations;
- employee or operator value-dispensing actions.

## 3. Constitutional Principle

> Any operation capable of creating, transferring, discounting, reserving, refunding, crediting or otherwise changing economic value must be treated as a security-sensitive operation.

The client is never the authority for prices, eligibility, balances, permissions, limits or financial outcomes.

## 4. Server-Side Economic Truth

The backend must independently calculate and validate:

- product price;
- discount eligibility;
- promotion eligibility;
- tax and fee calculations;
- delivery charges;
- subscription charges;
- reward eligibility;
- refund amounts;
- credit amounts;
- inventory availability;
- purchase limits;
- account limits;
- settlement values.

Client-provided values are inputs and must not be treated as authoritative economic state.

## 5. Business-Logic Abuse

Critical workflows must be implemented as explicit server-side state transitions.

The architecture must defend against:

- skipping required workflow steps;
- replaying completed operations;
- manipulating object state;
- bypassing purchase limits;
- concurrent redemption;
- race conditions;
- stale-token use;
- expired-offer use;
- coupon stacking outside policy;
- refund manipulation;
- subscription abuse;
- referral farming;
- reward farming;
- inventory hoarding;
- cart camping;
- artificial demand generation.

OWASP identifies concurrent workflow bypass, action-limit overrun, object-state manipulation and resource-quota violations as current business-logic abuse classes. citeturn0search5

## 6. Economic Rate Limiting

Rate limits must operate at the feature level rather than relying solely on a global API limit.

Controls may apply independently to:

- account;
- authenticated identity;
- device or device class;
- IP/network source;
- payment instrument;
- shipping destination;
- promotion;
- referral source;
- API key;
- partner;
- tenant;
- high-value operation.

Rate limiting must be adaptive where appropriate and must not create unnecessary denial-of-service conditions for legitimate customers.

## 7. Automated Abuse

Essentials Mart must distinguish legitimate automation from abusive automation.

Threats include:

- credential stuffing;
- fake-account creation;
- scraping;
- inventory hoarding;
- card testing;
- coupon enumeration;
- referral automation;
- reward farming;
- fake reviews;
- checkout automation;
- account takeover automation;
- high-volume API harvesting.

OWASP specifically identifies scraping, scalping, carding, fake-account creation, coupon/token cracking and denial of inventory as automated threats to web applications. citeturn0search6

## 8. Payment Abuse

Payment-related controls must address:

- stolen payment instruments;
- card testing;
- repeated low-value authorization attempts;
- suspicious payment velocity;
- payment-method reuse across accounts;
- refund abuse;
- chargeback patterns;
- settlement manipulation;
- payment-provider failures;
- duplicate payment requests.

Payment authorization and settlement authority remain with governed payment capabilities and providers.

## 9. Promotion and Discount Abuse

Promotions must have explicit:

- eligibility rules;
- issuance limits;
- redemption limits;
- temporal validity;
- account limits;
- source limits;
- value limits;
- concurrency protection;
- audit records.

Discounts must be calculated server-side.

## 10. Rewards and Referral Abuse

Reward and referral systems must defend against:

- self-referral;
- household/account farming;
- synthetic identities;
- device farms;
- payment-instrument farming;
- circular referrals;
- repeated reward claims;
- coordinated abuse;
- artificial engagement.

Value-dispensing actions require tamper-evident audit records.

## 11. Subscription Abuse

Subscription controls must protect against:

- repeated introductory offers;
- cancellation/re-registration abuse;
- price manipulation;
- unauthorised plan changes;
- duplicate billing;
- delivery entitlement abuse;
- excessive resource consumption;
- referral or reward farming through subscriptions.

Subscription state must be authoritative on the server.

## 12. Inventory Abuse

Inventory controls must defend against deliberate stock denial and hoarding.

Where appropriate, the system should enforce:

- reservation expiry;
- purchase limits;
- identity-linked limits;
- payment-linked limits;
- queueing or waiting-room controls;
- release of unpaid inventory;
- anomaly detection.

## 13. Refund and Cancellation Abuse

Refunds and cancellations must be governed by explicit state machines and policy.

The system must prevent:

- duplicate refunds;
- refund replay;
- refund-after-final-settlement abuse;
- refund amount manipulation;
- cancellation after prohibited state transitions;
- coordinated refund fraud.

High-value or anomalous refunds may require additional verification or human review.

## 14. AI-Driven Economic Decisions

AI systems may recommend:

- discounts;
- promotions;
- rewards;
- delivery options;
- subscription configurations;
- pricing actions.

AI must not acquire unrestricted economic authority merely by producing a recommendation.

Consequential economic actions must pass through authorised business capabilities and applicable controls.

## 15. Economic Guardrails

Value-dispensing capabilities should have layered limits, including where appropriate:

- per-action limits;
- per-account limits;
- per-day limits;
- per-device limits;
- per-payment-instrument limits;
- per-promotion limits;
- per-partner limits;
- enterprise-wide exposure limits.

## 16. Concurrency Protection

Security-sensitive economic operations must be atomic or otherwise protected against race conditions.

Examples include:

- coupon redemption;
- inventory reservation;
- reward issuance;
- wallet crediting;
- refund issuance;
- subscription activation;
- payment capture.

A request that is valid in isolation must not become invalid through concurrent execution.

## 17. Economic Abuse Detection

Detection should correlate signals across:

- identity;
- device;
- IP/network;
- payment method;
- address;
- account history;
- transaction history;
- order behaviour;
- promotion behaviour;
- delivery behaviour;
- AI interactions;
- partner activity.

No single signal should automatically be treated as proof of fraud.

## 18. Adaptive Response

Responses should be proportionate to risk.

Possible responses include:

```text
Observe
  ↓
Increase friction
  ↓
Step-up verification
  ↓
Temporarily restrict operation
  ↓
Quarantine value-dispensing action
  ↓
Human review
  ↓
Block / recover / release
```

Controls should avoid unnecessary harm to legitimate customers.

## 19. Economic Abuse Auditability

Material value-changing operations must produce auditable records containing sufficient context to reconstruct:

- actor;
- target;
- action;
- value before;
- value after;
- reason or rule;
- timestamp;
- correlation identifier;
- relevant request context;
- approval or authorization context.

OWASP recommends audit trails for value-dispensing operations and enough business context to reconstruct what happened. citeturn0search3

## 20. Abuse Economics

Security controls must consider the attacker's economics.

The architecture should increase the cost of abuse through:

- bounded operations;
- progressive friction;
- rate limits;
- quotas;
- verification;
- delayed value release where appropriate;
- anomaly detection;
- transaction limits.

The goal is not merely to detect abuse after economic damage has occurred.

## 21. Partner and Provider Abuse

Economic controls must apply to external partners and providers.

This includes:

- payment providers;
- delivery partners;
- referral partners;
- advertising partners;
- scheduled transport providers;
- merchant partners;
- external APIs.

Partner credentials and quotas must be separately governed.

## 22. Observability

The platform must monitor:

- transaction velocity;
- failed payments;
- refund rates;
- promotion redemption rates;
- referral conversion anomalies;
- reward issuance;
- subscription churn anomalies;
- inventory reservation behaviour;
- API abuse;
- automated traffic;
- suspicious account clusters;
- economic losses prevented and incurred.

Security metrics must feed enterprise risk management. NIST recommends integrating cybersecurity risk information into enterprise risk management and maintaining risk information that supports prioritisation and response. citeturn0search2

## 23. Privacy-Constrained Detection

Abuse detection must use proportionate signals and avoid unnecessary collection of personal information.

Detection mechanisms must remain subject to privacy, security and data-governance requirements.

## 24. Fail-Safe Behaviour

When fraud or abuse systems are unavailable, the platform must have defined degraded behaviour.

Critical commerce should not automatically become unavailable because a non-critical detection component is degraded.

Conversely, high-risk value-dispensing operations may require fail-closed behaviour where appropriate.

## 25. Recovery

After confirmed abuse, the platform must support:

- account recovery;
- transaction reversal where legally and operationally possible;
- reward reversal;
- promotion invalidation;
- inventory release;
- partner notification;
- evidence preservation;
- control improvement.

## 26. Testing

Security testing must include adversarial business scenarios, including:

- concurrent coupon redemption;
- refund races;
- repeated promotional onboarding;
- synthetic-account creation;
- inventory hoarding;
- payment-method reuse;
- referral loops;
- reward farming;
- subscription cycling;
- automated checkout;
- API quota abuse.

## 27. Architectural Laws

1. Economic value must have an authoritative server-side representation.
2. Client state is never the authority for financial or economic outcomes.
3. Security-sensitive workflows must be explicitly stateful and validated server-side.
4. Value-dispensing operations require layered controls.
5. Critical economic operations must be protected against concurrency abuse.
6. Rate limits must exist at economically meaningful boundaries.
7. Legitimate automation must not be indiscriminately blocked.
8. AI recommendations do not automatically grant economic authority.
9. Promotions, rewards, referrals and refunds require abuse controls.
10. Material value-changing operations must be auditable.
11. Economic abuse detection must be privacy-conscious.
12. Controls must be proportionate to risk.
13. External partners remain subject to economic security boundaries.
14. Economic security controls must be observable.
15. Recovery and control improvement must follow confirmed abuse.

## 28. Relationship to Earlier Part 4 Commits

Commit 013 builds on:

- **009 — Infrastructure & Network Defence** for infrastructure-level protection;
- **010 — AI Defensive Architecture** for AI runtime protection;
- **011 — AI Intelligence & Distillation Defence** for protection against intelligence extraction;
- **012 — Data & Intelligence Protection** for data integrity, confidentiality and availability.

It does not redefine those layers.

## 29. Architectural Outcome

Essentials Mart's economic systems are treated as security-sensitive resources rather than ordinary application features.

The resulting model is:

```text
Customer / Partner / AI
          ↓
     Economic Action
          ↓
   Server-side Validation
          ↓
 Identity + Policy + Limits
          ↓
 Concurrency Protection
          ↓
 Risk / Abuse Detection
          ↓
 Authorised Economic Effect
          ↓
 Audit + Monitoring
          ↓
 Recovery / Response if required
```

The objective is to make economic abuse difficult, detectable, attributable and recoverable while preserving legitimate commerce.
