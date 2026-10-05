# Phase 7B1 — Identity and People

Delivery status: COMPLETE, included in merged Phase 7. Detailed historical evidence is linked below.

Approved parent scope: [Phase 7 independent frontend](phase-7-frontend.md). This slice passed its review before Academic implementation; checkpoint evidence is linked below.

## Prerequisite: reliable owner contracts

The original backend OpenAPI snapshot collided on nested Request/UpdateRequest/Response/PageResponse record names, causing Organization and Faculty/Staff schemas to resolve to Student fields. Backend commit 795588e corrected naming with springdoc fully qualified names and owner-controller regression tests. Frontend contracts were regenerated and CI was pinned to that revision. The prerequisite is resolved; production JSON fields, routes, authorization and database behavior were preserved.

## Frontend implementation

Implemented after the 7A gate. Each owner API remains authoritative.

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

## Delivery evidence

Completed and included in merged Phase 7. See the [7B1 review](../reviews/phase-7b1-identity-people-review.md) for checkpoint results and the [final review](../reviews/phase-7-final-review.md) for current totals/CI. The backend owner-schema correction at 795588e preserves API/database/security behavior.
