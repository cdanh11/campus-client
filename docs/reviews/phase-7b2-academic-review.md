# Phase 7B2 — Academic review

> Historical slice review: results below apply to this checkpoint. Phase 7 is complete; use the [final review](phase-7-final-review.md) for current completion evidence.

Status: PASS (local), 2026-10-05. Final explicit-action verification passed. Branch: feature/academic-ui, stacked from 7B1 commit 6262e8f.

Owner source inspected: all six Academic controllers, AcademicProgram/Term/ClassSection, AcademicLifecycle, AcademicDeliveryService, domain error handlers and docs/api/academic.md on backend 795588e6cb2e315eac8d3bb41155ccbcd37aa1af. This slice changes frontend only; no API, entities or migrations.

| Requirement | Implemented evidence |
| --- | --- |
| Program/Course management | Generated owner create/PUT DTO checks; code/name/title/organization/status, integer credits 1–30; real create and stale Program PUT/reload/success. |
| Terms | ISO LocalDate strings, required dates/start <= end form rule, PLANNED creation, allowlisted lifecycle options, frozen dates after activation. Real PLANNED -> ACTIVE. |
| Offerings | Course/term owner pickers; no text search invented; immutable references excluded from PUT. Real DRAFT -> OPEN. |
| Sections | Draft optional faculty, ACTIVE FACULTY picker, mandatory faculty decided by backend on OPEN; int32 positive capacity; admission fields frozen after DRAFT. Real missing-faculty rejection then successful OPEN and disabled controls. |
| Enrollment | ACTIVE Student and OPEN section picker; immutable references; backend capacity error shown. Same-record WITHDRAWN/ENROLLED mutations with fresh expectedVersion. No automatic action selected when opening edit: explicit selection required. |
| Queries/references | Bounded pages, owner filter/sort allowlists, field encoding, retained historical references for filters, cached owner labels including readable course/term on offerings. No unbounded fetch-all or DB access. |
| Versions/errors | Exact long versions through shared lossless serializer; 409 does not retry a write, blocks Save until explicit reload; domain error code/trace and retry for reads. |
| Regression/security | Existing ADMIN boundary, session epoch/cache clearing, USER API denial, cookie rotation and multi-tab flows; People and account journeys remain included. |

Final verification: contracts/lint/TypeScript/build passed; Vitest 41 tests/11 files, zero failures, 20.40s at 00:18:28 +07. Mocked Chromium 2 passed in 9.5s. Six real Chromium journeys passed (reported 1.0m), including explicit withdrawal/restoration choice, stale Program PUT/reload, faculty/capacity rejection and People/account/auth regression. Maven harness BUILD SUCCESS: 1 test, zero failures/errors/skips, 1m43s, finished 2026-10-05T00:20:36+07:00. Spring pool closed, temporary fixture removed; backend status only local roadmap. Post-export contract drift and final diff checks passed. No remaining blocker/major in approved 7B2 scope.

Review corrections: bound and retain selected reference filters; match createdAt,desc default for offerings/enrollments; validate codes before and after uppercase expansion; reject fractional credits rather than round them; constrain term/offering choices while leaving server admission authoritative; require deliberate enrollment action. The first combined browser run failed because a broad text selector matched an existing table cell and dropdown option, fixed by selecting the option title.

Limitations retained: no Academic Student self-service, registration windows, waitlist, grades, automatic billing or deployment. Reference labels use cached per-ID owner reads bounded by visible pages; no unsupported bulk API was introduced. Comprehensive all-domain responsive/accessibility/browser closure is 7D. GitHub CI after push is reported separately.

GitHub CI both jobs PASS in run 37220302533 (verified 2026-10-05).
