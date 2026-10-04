# Phase 7B4c — ADMIN Library review
Status: PASS (local), 2026-10-05. Backend 795588e, feature/supporting-services-ui.
Inspected AdminLibraryController, LibraryService, BookTitle/BookCopy/BookLoan and docs/api/library.md; no backend/API/schema changes.

| Requirement | Evidence |
| --- | --- |
| Catalog | Typed title/copy create/update, six-character trim/uppercase code validation, Unicode title/author lengths. Copy title immutable on edit and excluded from PUT. |
| Queries | Actual supported sorts, bounded owner pagination/search and historical title/copy/Student filters. Per-resource route keys prevent filter/sort leakage. |
| Admission | ACTIVE owner references; server determines eligibility and occupied status. Real second borrow on occupied copy rejected with LIBRARY_COPY_ALREADY_LOANED. |
| Return | Explicit RETURN selection before save; fresh exact version, owner PUT /loans/{id}/return body contains only expectedVersion. Inactive references retained in disabled pickers; no automatic action on opening. |
| History | Real dueAt exactly 14 elapsed days after borrowedAt. Return after title/copy/Student INACTIVE retains UUID, borrowedAt, dueAt and createdAt. RETURNED read-only; later borrow creates a new UUID and both records remain visible. |
| Conflict | Component 409 stale return blocks replay; exact signed-64-bit version tested. Existing stale Event/People/Academic/Notification journeys pass. |
| Security/regression | ADMIN boundary unchanged; real auth/cookie/USER denial/multi-tab and all previous owner journeys pass. No fines, renewal, reservation, self-borrow or automatic Finance/Notification writes. |

Final npm run verify PASS: contract drift, ESLint, TypeScript/build and 65 tests/21 files, 71.89s at 02:32:33 +07. Mocked Chromium 2 passed (12.6s); real Chromium 11 passed (2.6m). Maven harness BUILD SUCCESS, one test, no failures/errors/skips, 3m30s, finished 2026-10-05T02:37:38+07:00. Flyway V25/Hibernate validate on isolated PostgreSQL at exact backend revision. Owned temporary fixture removed; worktree clean, pool closes. Primary backend user configuration edits untouched.

Diff reviewed, no blocker/major remains in approved Library slice. Shared registry extension limited to optional updatePath and owner references/filters; unchanged resources keep original PUT paths and passed regression. Generated contract metadata reordered only and restored. Notification/Event CI both jobs PASS run 37228035728 at 5d5ea0a. Library post-push CI remains separate; Audit/Reporting, Student portal and full Phase 7 closure remain incomplete.

Post-push GitHub CI 37229077410 PASS both verify and backend-browser at exact head 09945d362787fe251fb9353c66caee7f01079d92.
