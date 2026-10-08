# Phase 8 — Frontend acceptance and regression

## Gate

PASS locally, 2026-10-08, for the approved Phase 8 scope. Runtime/test source is committed at `2773134`; contract provenance and CI pin are at `a7c5398`. Backend runtime/test source is `f7b34e99d5cf5f434fa1308ff2e90bee58fca4fc`. Subsequent documentation commits do not alter tested source. Post-push GitHub CI and user PR/merge are separate from these local results.

The [backend acceptance review](https://github.com/cdanh11/campus-service/blob/feature/local-demo-test-plan/docs/reviews/phase-8-acceptance-review.md) holds the cross-module screen/API/outcome matrix, reproduced backend findings, exact migration validation and current inventory/persistence evidence. Phase 9 walkthrough/presentation/final rehearsal is next.

## Current verification

| Command / source | Actual result | Elapsed / checkpoint (+07) |
| --- | --- | --- |
| `npm run verify` on the source later committed at `2773134` | Contract drift, ESLint, TypeScript and production build PASS; 107 Vitest tests / 28 files | Vitest 149.83s; started 2026-10-08 23:08:13 |
| `npm run test:e2e` | 13/13 mocked Chromium PASS | 59.9s |
| Complete isolated backend/browser harness on backend `f7b34e9` | 25/25 real Chromium journeys in 11 files PASS; Maven BUILD SUCCESS, one opt-in harness test | Browser 3.4m; harness 4m36s; finished 23:37:30 |
| `npm run contracts:check` after the provenance/pin update | PASS; newly exported production OpenAPI is semantically unchanged | 2026-10-08 |
| Current Docker browser verifier using the built client image `a7c5398` | Proxy/session/permissions and seeded mobile portal PASS | 23:44:48 |

Zero test failures/skips in these successful executions. The backend's independent `clean verify` passed 476 tests / 81 suites in 11m39s, finished 23:32:06; that total is separate from the one frontend-owned harness test.

The real suite covers Academic stale writes/capacity/faculty/restored enrollment; cookie rotation/Origin/reload/two-tab logout; Event lifecycle/capacity/attendance; reports/CSV/exact VND/audit; Library occupied copies/default due date/history; immutable Notification publication; Dormitory occupancy/release; partial Finance payments/reversal; People forms; all eleven functional/viewer roles and forbidden escalation; personal Inbox/Event ownership; unlinked USER; and ADMIN account/role/status/password operations. UI loading/error/empty/search/focus/responsive checks remain the separately identified component/mocked evidence.

The isolated checkout already contained an identical frontend-owned fixture. We inspected its hash/status/revision and port 3000, then invoked the existing Maven harness directly without deleting or overwriting that file. This uses the same test configuration and isolated PostgreSQL; no developer database or production account is used. The normal `scripts/test-backend.ps1` remains unchanged and continues refusing an existing fixture or unrelated backend changes. Failed/incomplete historical attempts are not counted as PASS.

## Review and corrections

Source review covered application/session routes, in-memory tokens/serialized refresh/session epochs/cache invalidation, functional menus/direct-route boundaries, shared registry/reference forms, mutation versions/no conflict replay, lossless VND/64-bit integers, report/audit/payment pages, personal ownership and dialog focus. Backend enforcement remains authoritative; source inspections are not an independent security certification.

The personal portal's raw ISO/UTC display was corrected with display-only `CampusTime`: fixed `Asia/Ho_Chi_Minh`, readable Vietnamese UTC+7 text and semantic `time` elements retaining the exact original instant. Tests cover rollover, offset inputs, empty/invalid values and microsecond preservation; real portal assertions compare the displayed time and unchanged API instant. Payloads, editors, versions and server business rules are unchanged. Commit `2773134` contains only this functional correction and its tests.

The backend review resolved JWT lifetime response metadata, final-active-admin scope, account offset overflow, uppercase Unicode identifier length and integer JSON coercion. The current frontend passed against those fixes. Production OpenAPI comparison showed no DTO/path changes; CI and contract provenance now point to the tested, pushed backend SHA rather than the older permissions checkpoint.

## Seeded demonstration and limits

Both current images were built from clean reviewed source, then reused the existing private installation/volume. The backend loader verified two global ADMIN, eleven scoped/viewer accounts, 200 linked Student accounts and substantial cross-domain data; repeat reported zero owner writes. Fresh Docker browser checks verified HttpOnly cookie/no browser token storage, rotation/reload/Origin/two-tab logout, FINANCE_ADMIN denied account API/UI without prefetch, and Student mobile Inbox/Event without administrator calls or page overflow. Visually inspected the fresh desktop Student table and mobile Inbox, including UTC+7 timestamps. Credentials and screenshots remain ignored/private.

Backend stop/restart snapshots passed for 25 business tables, role assignments, audit IDs and Flyway history. The recovery verifier reconciled its retained title using owner audit without duplicate creation or wrong-target owner writes. These dataset checks complement the isolated real suite, not a production/load/cross-browser claim.

Scoped grants represent functions with documented reference reads, not per-department row isolation or university approval chains. The personal portal remains own Inbox/Event; Student Academic/Dormitory/Finance/Library self-service is not implemented. Manual VND receipts are not a payment gateway. No new API, migration repair, database/volume deletion, merge or deployment was introduced for closure.
