# Phase 7B2 — Academic administration

Delivery status: COMPLETE, included in merged Phase 7. Detailed historical evidence is linked below.

Approved scope: [Phase 7](phase-7-frontend.md). Backend revision 795588e remains authoritative.

Implement Programs, Courses, Terms, Offerings, Sections and ADMIN Enrollment through existing owner APIs. Extend the existing paginated/version-aware editor only where the six resources need numeric/date/reference/lifecycle controls; keep People behavior covered by regression tests. Each resource whitelists its actual create/update DTO fields with generated types.

- Catalog: code/name or title, ACTIVE organization, ACTIVE/INACTIVE; credits integer 1–30.
- Terms: PLANNED creation, inclusive ISO LocalDate start <= end; PLANNED -> ACTIVE/CANCELLED, ACTIVE -> CLOSED. Freeze dates after PLANNED; code/name remain editable under backend rules.
- Offerings: immutable course/term references; creation DRAFT, opening needs ACTIVE term/current ACTIVE course and organization. DRAFT -> OPEN/CANCELLED, OPEN -> CLOSED.
- Sections: immutable offering; code/capacity/faculty editable only in DRAFT. Positive int32 capacity. Optional ACTIVE FACULTY in DRAFT, mandatory for OPEN. Freeze these fields thereafter.
- Enrollment: immutable Student/section; ACTIVE Student and OPEN section on POST. ENROLLED -> WITHDRAWN releases capacity; restore WITHDRAWN -> ENROLLED on the same record with fresh expectedVersion. No duplicate POST restoration.
- Filters/paging/sort follow actual controller allowlists. Reference pickers for filters include historical values; mutation choices use current eligibility where meaningful. Backend rechecks all decisions.
- No grading, schedules, Student Academic self-service, new API, schema or migrations.

Verification: typed payload/immutable-field/transition/form/query tests, People/auth regression, real-browser create/open/enroll/full/withdraw/restore/history/error journeys against isolated backend Flyway + Hibernate validation. Query/cache/session errors and stale writes must not auto-resubmit. Run verify, mocked and real suites, diff review, PASS/FAIL document, then functional commits/push if PASS. CI outcomes reported separately. No production provisioning/deployment.

Completed and included in merged Phase 7. Checkpoint verification is in the [Academic review](../reviews/phase-7b2-academic-review.md); current totals/CI are in the [final review](../reviews/phase-7-final-review.md).
