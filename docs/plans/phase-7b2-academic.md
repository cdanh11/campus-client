# Phase 7B2 — Academic administration
Status: PASS local, 2026-10-05. See ../reviews/phase-7b2-academic-review.md.
Approved scope: phase-7-frontend.md. Stack feature/academic-ui from locally reviewed 7B1; do not merge PRs. Backend revision 795588e remains authoritative.

Implement Programs, Courses, Terms, Offerings, Sections and ADMIN Enrollment through existing owner APIs. Extend the existing paginated/version-aware editor only where the six resources need numeric/date/reference/lifecycle controls; keep People behavior covered by regression tests. Each resource whitelists its actual create/update DTO fields with generated types.

- Catalog: code/name or title, ACTIVE organization, ACTIVE/INACTIVE; credits integer 1–30.
- Terms: PLANNED creation, inclusive ISO LocalDate start <= end; PLANNED -> ACTIVE/CANCELLED, ACTIVE -> CLOSED. Freeze dates after PLANNED; code/name remain editable under backend rules.
- Offerings: immutable course/term references; creation DRAFT, opening needs ACTIVE term/current ACTIVE course and organization. DRAFT -> OPEN/CANCELLED, OPEN -> CLOSED.
- Sections: immutable offering; code/capacity/faculty editable only in DRAFT. Positive int32 capacity. Optional ACTIVE FACULTY in DRAFT, mandatory for OPEN. Freeze these fields thereafter.
- Enrollment: immutable Student/section; ACTIVE Student and OPEN section on POST. ENROLLED -> WITHDRAWN releases capacity; restore WITHDRAWN -> ENROLLED on the same record with fresh expectedVersion. No duplicate POST restoration.
- Filters/paging/sort follow actual controller allowlists. Reference pickers for filters include historical values; mutation choices use current eligibility where meaningful. Backend rechecks all decisions.
- No grading, schedules, Student Academic self-service, new API, schema or migrations.

Verification: typed payload/immutable-field/transition/form/query tests, People/auth regression, real-browser create/open/enroll/full/withdraw/restore/history/error journeys against isolated backend Flyway + Hibernate validation. Query/cache/session errors and stale writes must not auto-resubmit. Run verify, mocked and real suites, diff review, PASS/FAIL document, then functional commits/push if PASS. CI outcomes reported separately. No production provisioning/deployment.

Final gate: contract drift/lint/TypeScript/build, 41 tests/11 files, 2 mocked and 6 real Chromium journeys passed. Real harness BUILD SUCCESS 1m43s at 00:20:36 +07. No backend source/migration changes. GitHub CI after push remains separate; user handles PR/merge. Next: 7B3 Dormitory and Finance.
