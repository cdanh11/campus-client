# Phase 7A — Foundation and authentication review

Date: 2026-10-04. Branch: feature/frontend-foundation.
Backend contract: 7d130f41525e3692eb19087b90918abad3e156ab.

**PASS — approved local foundation/authentication scope.** No remaining blocker/major found in this slice. 7B–7D remain unimplemented and the whole Phase 7 is not complete.

## Requirement audit

| Requirement | Evidence |
| --- | --- |
| Independent repo, hygiene, npm lock, CI | Baseline dcfd195; ignore/attributes/agent rules; npm ci passed; workflow includes unit/mocked and pinned-backend real jobs |
| React/TypeScript/Vite/Ant Design/Router/Query foundation | Production build and lint passed; lazy login/workspace routes; responsive desktop screenshot inspected and mobile overflow test passed |
| Backend contract snapshot and typed API | Production /v3/api-docs exported from isolated test application; source.json records full Git revision; generated types check passed after a second export |
| login/refresh/logout/me | Three real Chromium journeys plus unit tests; exact backend auth contracts validated at runtime |
| Role navigation and forbidden access | ADMIN-only link/route boundary; USER component rejection; real USER API 403 |
| 401, 403, conflicts and unavailable backend | Bounded 401 refresh/retry, session clear; component 403/409 error presentation; network restoration/logout regressions and retry UI |
| Memory token, cookie, Origin | No local/session storage; browser cannot read HttpOnly cookie; local Secure=false/path/SameSite checked; refresh succeeds through proxy; foreign Origin rejected |
| Session/cache isolation and races | Shared refresh, epoch rejection, login/logout ordering, query cache clears, Web Locks/BroadcastChannel; two-tab real refresh/logout test |
| Exact numbers | Bigint/LosslessNumber parser/serializer, generated int64/numeric unions and round-trip tests for VND/long versions/decimal totals |
| No production/schema modifications | Frontend-owned fixture copied only for test and removed in finally; backend status only local roadmap; V1–V25 untouched; no provisioning endpoint/deploy |

## Verified commands

- npm ci: passed; 333 packages audited, zero reported vulnerabilities.
- npm run verify: contract drift check, ESLint, TypeScript and Vite build passed; **21 tests/4 files**, zero failures; latest unit duration **25.41s**.
- npm run test:e2e: **2 mocked Chromium tests passed**, **7.6s**.
- ./scripts/test-backend.ps1: **BUILD SUCCESS**, **1 JUnit harness test**, zero failures/errors/skips, **1m10s**, finished **2026-10-04 22:43:26 +07**; harness runs **3 real Chromium journeys**, **22.8s**. PostgreSQL 17.6, Flyway V1–V25 and Hibernate validate; context and Hikari pool closed normally. XML/log independently inspected.
- npm run contracts:check after that export: passed.
- git diff --check: passed; repeat on staged final files before commit.

Review covered changed source, auth DTO/security filters, generated declarations, schema provenance, runner cleanup, workflow commands, package/lock and diff. Initial findings (button accessible name, duplicate email locator, restoration 403, late login/logout cookie race, exact-number types and runner script) were fixed and rerun.

## Limits and next gate

No production HTTPS hosting, all-browser certification or full accessibility audit is claimed. Multi-tab behavior is verified on Chromium localhost with Web Locks/BroadcastChannel; unsupported browsers retain single-tab fallback. Largest production chunk now **407.33 kB** minified (135.49 kB gzip), no size warning; route splitting is measured rather than a latency claim.

Both GitHub jobs verify and backend-browser passed after push: https://github.com/cdanh11/campus-client/actions/runs/37214290802. The Linux integration runner was therefore verified too. Linux runner uses sh for the backend Maven Wrapper because that repo tracks it as mode 100644; no backend chmod/history modification is needed. Additional 7B1 inspection identified pre-existing nested DTO schema-name collisions in Organization/Student/FacultyStaff contracts. Auth contracts used by 7A are unaffected; correct those owner schemas before typed business forms. See ../plans/phase-7b1-identity-people.md.

ADMIN/portal landing shells have no business features yet. Proceed to 7B1 Identity/People; then separate 7B2 Academic, 7B3 Dormitory/Finance, 7B4 supporting/reporting, 7C personal inbox/Event and 7D whole-phase closure reviews.
