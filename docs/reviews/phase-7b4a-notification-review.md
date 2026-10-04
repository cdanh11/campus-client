# Phase 7B4a — ADMIN Notification review
Status: PASS (local), 2026-10-05. Part of feature/supporting-services-ui, stacked from 7B3 2b3b26c.
Owner evidence inspected: AdminNotificationController, NotificationService, NotificationValues, Notice and NotificationTemplate; docs/api/notifications.md at backend 795588e. No backend schema/API or migration changes.

| Requirement | Evidence |
| --- | --- |
| Templates | Typed create/update payload, ACTIVE/INACTIVE, six-character trim and 2–32 code after uppercase expansion, name/title 2–160, body 2–4000 Unicode characters. Plain-text multiline editor; exact version and immutable snapshot tests. |
| Drafts | Create solely from ACTIVE owner template; edit title/body with fresh detail version. Template reference excluded from PUT. Real create followed by template edit proves original draft content retained. |
| Publication | Explicit preview and confirmation; 1–100 distinct ACTIVE owner accounts, bounded owner search/pages, removable recipient tags. Fresh DRAFT version read before POST; no broadcast or automatic send. |
| State/version | PUBLISHED read-only and publish action disabled. Stale publication blocked until close/reopen; no automatic retry. Real competing PUT causes 409, then fresh reopening publishes successfully. |
| Content/security | React text rendering, no executable markup. Component tests assert script/img source remains text. Existing ADMIN boundary/server policies unchanged; previous USER denial/auth/cookie/multi-tab tests pass. |
| Regression | Previous Academic, People/account and Dormitory/Finance browser journeys included; shared registry changes limited to textarea and optional row action. |

Final npm run verify PASS: contracts, ESLint, TypeScript/build and 53 tests/16 files, zero failures; 43.86s at 00:58:23 +07. Two mocked Chromium tests PASS (10.7s). Nine real Chromium journeys PASS (1.7m); Maven harness BUILD SUCCESS, one test, zero failures/errors/skips, 2m30s, finished 2026-10-05T01:01:53+07:00. Flyway V25/JPA validate on isolated PostgreSQL; pool closes and owned temporary fixture removed. Generated source metadata unchanged except export property order, restored after semantic review.
Verification correction: one unbounded parallel Vitest run timed out a pre-existing 15s password-reset test. Independent test passed in 7.71s; maxWorkers=2 retains assertions, isolation and timeouts, and the full final suite passed. No assertion was weakened.
Diff reviewed: no credentials, persistent token, public provisioning, SMTP/SMS/scheduler or schema policy. No blocker/major remains in this approved slice. Own inbox/read is 7C; Event/Library/Audit/Reporting and full responsive/accessibility closure remain incomplete. Post-push CI is reported separately.

Post-push CI run 37222905737 at head 4199e32: verify PASS; backend-browser FAIL at integration runner. Artifact inspection with user-approved GitHub authentication proved the loading icon changed the accessible button name. Added a stable aria-label and a pending/rejected publication regression; local PASS does not claim CI PASS. This CI gate must be resolved before whole supporting-services closure.

Final corrective verification: npm verify PASS 61 tests/19 files; two mocked and ten real Chromium journeys PASS. Maven harness BUILD SUCCESS 3m07s, finished 2026-10-05T02:19:52+07:00. Replacement CI remains pending until pushed.
