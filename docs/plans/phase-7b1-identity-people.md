# Phase 7B1 — Identity and People

Approved parent scope: Phase 7 independent frontend, see phase-7-frontend.md. Phase 7A is reviewed PASS locally and both jobs of GitHub workflow 37214290802 passed. 7B1 reviewed PASS locally; see ../reviews/phase-7b1-identity-people-review.md.

## Prerequisite: reliable owner contracts

Inspection found that production OpenAPI uses the same Request/UpdateRequest/Response/PageResponse names for nested records in different controllers. Organization and Faculty/Staff POST schemas currently resolve to Student Request fields. Do not build typed forms on those incorrect references.

Correct schema naming in the backend on feature/api-contracts, using production configuration/annotations supported by springdoc, with regression tests proving unique request, response and page references for the actual owner controllers. This is a documentation-contract correction, not an API feature/schema migration. Verify and review it before regenerating the frontend snapshot/types and updating the pinned CI backend revision. Keep production JSON field names, routes, authorization and database behavior unchanged.

Reference for the supported configuration approach: https://springdoc.org/v2/ (springdoc.use-fqn). Inspect actual generated names; do not assume their spelling.

## Frontend implementation

Use feature/identity-people after the 7A gate (stack it from the reviewed branch if main has not been merged). Each owner API stays authoritative.

- ADMIN users: list/search/status/role filters and approved sort; create with initial password and roles; detail; status, role replacement and password reset using expectedVersion. No public registration or self-service reset API.
- Organization units: create/get/list/update; real code/name/unitType/status fields; expectedVersion on update.
- Students: create/get/list/update with studentNumber/fullName, optional email/Identity link, required organizationUnitId and ACTIVE/INACTIVE status.
- Faculty/Staff: create/get/list/update with personnelNumber/fullName/email/optional Identity link, FACULTY/STAFF type, required organization and ACTIVE/INACTIVE status.
- Owner API pickers for organizations and optional Identity users; bounded search and paging. Do not invent an Academic program field for Student: the current approved DTO exposes organizationUnitId only.
- Modal/drawer forms with meaningful validation based on owner domain rules. Preserve server business decisions and expose domain error code/trace where available.
- Read current detail when opening edits; serialize exact rowVersion; surface 409 and require explicit reload/review, never auto-resubmit a business mutation.
- Clear/abort stale list data across filter/account changes. Loading/error/empty states, keyboard labels and responsive tables.
- Route visibility/guard for ADMIN, with server-side authorization unchanged.

## Verification gate

Component tests for forms, query parameters, pickers and conflict handling; mocked journeys explicitly labeled. Extend the isolated real-browser harness for ADMIN create/update, duplicate rejection, stale update, Identity roles/status/reset, organization references and USER denial. Test password fields are never persisted/logged.

Run npm ci when dependencies change, npm run verify, npm run test:e2e and real backend harness. Review exact contracts, security, no precision loss, all affected source/diffs and documentation. Report PASS/FAIL before 7B2; commit by function only after PASS. No migration, new endpoint, deploy or production account provisioning.

## Verified form rules for implementation

Owner source inspection confirms 2–32 Unicode characters for unit/student/personnel codes, 2–160 for unit/profile names; Identity displayName is 2–100. Initial/reset passwords require 12–64 code points and at most 72 UTF-8 bytes. Do not trim passwords. Status/type/sort choices must match the exact owner enums and allowlists.

Student and Faculty/Staff require an ACTIVE organization on mutation. Optional Identity links check account existence, not ACTIVE status; the picker must not invent an active-account-only policy. Read labels/statuses from the owner APIs and retain a selected reference for edit display, while the server decides whether the current reference is valid.

Current checkpoint: backend owner-schema correction reviewed PASS and pushed at 795588e6cb2e315eac8d3bb41155ccbcd37aa1af. Full clean verify BUILD SUCCESS: 417 tests/75 suites, zero failures/errors/skips, 10m35s. Frontend feature/identity-people now contains organization, Student, personnel and ADMIN account screens. Contract drift/lint/TypeScript/build and 29 tests/7 files passed locally. Browser verification and remaining component/error cases are still in progress; this is not the 7B1 PASS gate.

Final gate: PASS local. 32 tests/9 files, 2 mocked and 5 expanded real browser journeys passed. Real harness BUILD SUCCESS 1m28s at 23:50:20 +07; contract drift and diff checks passed, temporary backend fixture removed. Commit by function and push are authorized; user handles PR/merge. Next: 7B2 Academic.
