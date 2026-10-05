# Phase 7B4b — ADMIN Event review

> Historical slice review: results below apply to this checkpoint. Phase 7 is complete; use the [final review](phase-7-final-review.md) for current completion evidence.

Status: PASS (local), 2026-10-05. Backend owner revision 795588e; feature/supporting-services-ui.
Inspected AdminEventController, AdminEventRegistrationController, CampusEvent, EventRegistration and docs/api/events.md. No backend/API/schema changes.

| Requirement | Evidence |
| --- | --- |
| Catalog | Typed create/update whitelist, Unicode lengths and normalized code, positive int32 capacity, validated UTC calendar and strict time ordering; original fractional seconds preserved. |
| Lifecycle | DRAFT/OPEN transitions match owner rules; CLOSED/CANCELLED read-only. OPEN alone admits registrations, including past dates. |
| Membership | Nested POST contains only studentId; OPEN Event/ACTIVE Student owner pickers. Fresh version for explicit CANCEL/RESTORE/ATTEND, immutable references; same UUID retained after restoration. |
| Capacity/history | Real second admission rejected at capacity; cancellation frees a place, restoration consumes it; attendance succeeds after event CLOSED and becomes read-only. |
| Conflict | Real competing Event PUT causes 409; save blocked until explicit reload. No automatic business retry. Exact long versions tested. |
| Navigation | Per-resource registry key resets catalog search/sort before membership list; component regression and real journey pass. |
| Security | Existing ADMIN boundary/server authorization unchanged; auth/cookie/USER denial/multi-tab journeys included. No Student ADMIN API access or date scheduler. |

Final npm run verify PASS: contracts, lint, TypeScript/build, 61 tests/19 files, 66.02s at 02:15:17 +07. Mocked Chromium 2 passed (13.6s). Real Chromium 10 passed (2.2m), including Event and Notification fix; Maven harness BUILD SUCCESS, 1 test, zero failures/errors/skips, 3m07s, finished 2026-10-05T02:19:52+07:00. Exact backend clean managed worktree used because primary checkout has unrelated user configuration changes. Flyway V25/JPA validate on isolated PostgreSQL; temporary fixture removed, pool closed, worktree clean.

Earlier real run failed because catalog sort startsAt was retained on registration navigation, where that sort is unsupported. Fixed route keys and added a navigation regression before final verification; no assertion or timeout weakened. Reviewed tracked/untracked source and payloads; no blocker/major remains in this slice. Subsequent slices and whole-phase closure have their own review evidence.

Post-push GitHub CI 37228035728 PASS both verify and backend-browser at exact head 5d5ea0aa6bf269c5368df2e6a753d476e4d91589. Notification replacement gate also resolved.

Whole 7B4 regression exposed a browser-only navigation race: EVUI also appeared in the old membership table before destination render. Test now waits for catalog heading and OPEN detail; timeout and business assertions unchanged. Final full real suite PASS 12 journeys; harness BUILD SUCCESS 3m55s at 2026-10-05T03:16:07+07:00.
