# Supabase Migration Reconciliation — 2026-09-13

## Purpose

Record the authoritative migration history observed in the live Essentials Mart Supabase project and prevent unsafe rewriting of already-applied migration versions.

## Production project

Project: Essentials Mart

Project ref: `gnmcfenenikvvvvmeuwp`

## Live migration ledger

The live project currently records 21 migrations, in this order:

1. `20260905175133_commerce_core_persistence`
2. `20260905175201_harden_commerce_rls`
3. `20260905175338_add_external_customer_identity`
4. `20260905180000_atomic_checkout_and_buckpay_persistence`
5. `20260905182552_auth_customer_identity_hardening`
6. `20260905182803_harden_auth_rpc_execution`
7. `20260905192102_link_customers_to_supabase_auth`
8. `20260905192145_harden_auth_helper_functions_v3`
9. `20260907065826_checkout_idempotency`
10. `20260908210111_order_delivery_and_history`
11. `20260908210602_harden_checkout_search_path`
12. `20260908210843_retire_legacy_checkout_function`
13. `20260908210959_harden_delivery_checkout_idempotency`
14. `20260908231647_order_lifecycle_notifications_payment_transactions`
15. `20260908232325_backfill_order_operational_records`
16. `20260909070833_delivery_lifecycle_hardening`
17. `20260909070917_fix_delivery_history_previous_status`
18. `20260910124008_add_customer_profile_fields`
19. `20260910124047_secure_customer_profile_access`
20. `20260910124120_configure_customer_avatar_storage`
21. `20260910224543_catalogue_product_variants`

## Reconciliation rule

These versions are already applied to production. They must not be renamed, deleted, or reordered in Git merely to make the migration directory look cleaner. Any correction to the production schema must use a new forward migration.

## Current remediation status

- CI control gaps: remediation implemented on this branch.
- ADR-009 malformed/legacy paths: corrected on this branch.
- ADR-021 numbering collision: corrected by retaining Web Client as ADR-021 and renumbering BuckPay to ADR-022.
- Production migration history: verified and recorded; source reconstruction remains a separate controlled task.

## Required next step

Before declaring migration drift closed, the repository must contain a reproducible representation of the authoritative production schema and migration history. A clean database rebuild must then be tested from source control before any migration-history cleanup is considered complete.

## Safety rule

No destructive migration-history rewrite is authorised by this record. Existing production data and the applied migration ledger take precedence over cosmetic filename alignment.
