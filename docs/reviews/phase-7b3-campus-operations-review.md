# Phase 7B3 — Campus operations review
Status: PASS (local), 2026-10-05. Branch feature/campus-operations-ui stacked from Academic c717076.
Backend owner revision: 795588e6cb2e315eac8d3bb41155ccbcd37aa1af. Production controllers, domain contracts, docs/api/dormitory.md and docs/api/finance.md inspected; no backend/API/schema change.

| Requirement | Evidence |
| --- | --- |
| Inventory | Building/room/bed create/read/PUT, typed owner DTOs, ACTIVE/INACTIVE, immutable parents excluded from PUT, bounded parent filter. Real create hierarchy and reject occupied-bed deactivation. |
| Current accommodation | ACTIVE Student/bed owner pickers; explicit release selection with fresh expectedVersion; RELEASED is read-only. Real occupied-bed rejection, retained released UUID/time/references, later stay creates a different UUID. |
| Fee/charge snapshots | Positive integer VND text inputs, bigint request serialization, no float conversion. Charge creation only approved fields, cancellation excludes immutable snapshot fields. Real 19-digit fee/charge and unchanged snapshot after fee edit. |
| Payments/balance | Coherent owner balance API, fresh charge version for POST; fresh receipt and charge versions for full reversal. Exact amount/history, reason 2–500, terminal reversal. Real partial payment > Number safe range, overpayment rejection, cancellation blocked while paid, reversal then cancellation. |
| Stale/error behavior | CONCURRENT_MODIFICATION blocks replay until editor is closed/reopened; mismatch between selected charge and balance disables mutation. Component test proves exact fresh versions, reason validation, fractional rejection and single failed write. Error code/trace remains visible. |
| Query/security/regression | Supported sorts/filters, 10/20/50/100 pages, safe totals, historical references; existing ADMIN boundary and server permission checks. Prior cookie/USER denial/multi-tab/People/account/Academic real journeys still pass. |

Final frontend verification: npm run verify passed contract drift, ESLint, TypeScript/production build and 49 tests/14 files, zero failures, 28.35s (00:45:06 +07). npm run test:e2e: two mocked Chromium journeys passed in 10.2s. Production source was unchanged after the final real run; only component tests/documentation were added.
Real integration: eight Chromium journeys passed (1.4m); isolated PostgreSQL Testcontainers, Flyway V25 and Hibernate validate. Maven harness BUILD SUCCESS, one test, zero failures/errors/skips, 2m06s, finished 2026-10-05T00:40:23+07:00. Pool shut down and temporary fixture removed. Backend Git status only local roadmap; V1–V25/source unchanged. Contract metadata content unchanged; property-order-only export drift removed.

Diff review: no dependencies/secrets/public provisioning/payment gateway/DB access; generated owner schemas checked with satisfies; immutable fields whitelisted, exact integer/version path reviewed end to end. Remaining whole-platform responsiveness/accessibility and combined workflows belong to 7D. No blocker/major remains in this slice. Post-push GitHub CI is a separate gate, not claimed by local PASS.
