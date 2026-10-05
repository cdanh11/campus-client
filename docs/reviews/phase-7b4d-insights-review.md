# Phase 7B4d — ADMIN Audit/Reporting review

> Historical slice review: results below apply to this checkpoint. Phase 7 is complete; use the [final review](phase-7-final-review.md) for current completion evidence.

Status: PASS (local), 2026-10-05. Backend owner revision 795588e; feature/supporting-services-ui.
Inspected AuditViewing controller/search/source/view, DashboardService, DetailReportService/ReportKind/ReportRow, CSV writer/error handler and owner API documents. No backend endpoints/schema/migrations changed.

| Requirement | Evidence |
| --- | --- |
| Dashboard | Eight owner groups with asOf and current-state explanation. Exact BigInt/LosslessNumber aggregates, including 19999999999999999998 VND beyond per-charge limit; no Number coercion. |
| Audit | One source per page, source-specific resources/action bounds, UUID/time validation, bounded paging and occurredAt sort. Read-only detail uses stored version and sanitized status; React text rendering. Source change resets resource/action/page. |
| Reports | All five owner kinds, fixed owner columns, supported Student/resource/state/overdue/time filters, id sort and safe page counts. Kind change clears unsupported filters; current-state/asOf and non-historical semantics explained. |
| Export | Same applied non-page filters and sort; server CSV downloaded unchanged, fixed filename and object URL released. Unit 422 limit message and no partial download; actual 400 JSON error verified through production client. Backend enforces 5,000-row cap; browser does not seed 5,001 rows. |
| Exact data/content | Real Student-filtered debt JSON/UI/CSV retain aggregate digits. Real Event title =2+2 remains unchanged in JSON/UI, receives backend apostrophe in CSV. Five real report routes and selected Finance audit detail pass. |
| Session | CSV shares existing bounded 401 refresh and epoch checks, same-origin owner route allowlist, bearer/cookies/no-store/20s timeout. Late response after invalidation rejected; repeated 401 clears session. Unexpected content type rejected; errors retain code/trace. |
| Authorization/regression | All routes remain under existing ADMIN AccessBoundary; server remains authoritative. Existing auth, USER denial, cookie/multi-tab, People/Academic/operations/Notification/Event/Library journeys included. |

Final app verification: npm run verify PASS (contracts, lint, TypeScript/build and 78 tests/24 files), 80.02s starting 03:03:58 +07. Mocked Chromium 2 passed (13.1s). After an Event browser synchronization correction, lint and the entire real suite rerun: 12 Chromium journeys passed (3.0m), Maven harness BUILD SUCCESS, 1 test, zero failures/errors/skips, 3m55s, finished 2026-10-05T03:16:07+07:00. XML checked. Exact clean backend worktree, PostgreSQL/Flyway V25/Hibernate validation; temporary fixture removed and pool closed. Primary backend user configuration changes preserved. Contract metadata changed property order only, restored.

Verification history: earlier complete real run passed at 03:02:38. Later app-final run failed Event at 03:11:05 (actual BUILD FAILURE 5m27s, 11 browser journeys passed) because an EVUI row selector could match the old membership table while navigation was still changing. Wait for destination heading and OPEN detail before closing Event; no timeout/assertion weakening. Final full real rerun passes. Export Accept permits both CSV success and JSON error, matching actual handler contract.
No blocker/major remained in this slice. Later portal and whole-phase reviews record 7C/7D evidence.
