# Phase 7B4 — Supporting services and Reporting

Status: COMPLETE. All four slices and their combined review passed; included in merged Phase 7. See the [7B4 closure](../reviews/phase-7b4-final-review.md) and [current whole-phase review](../reviews/phase-7-final-review.md). Backend contract revision: 795588e.

## Approved scope

- Notification: ADMIN templates/drafts, explicit publication to 1–100 distinct ACTIVE accounts, fresh version and immutable plain-text snapshots. Own inbox/read is delivered separately in 7C.
- Event: ADMIN catalog with UTC precision and positive int32 capacity; owner Student/Event pickers; retained membership cancellation/restoration/attendance using fresh versions and server capacity/lifecycle rules.
- Library: title/copy catalogs, immutable copy parent, ADMIN borrow/return using owner APIs, server 14-day due date, occupied-copy rejection and retained history. No renewal, fines or self-borrow.
- Audit/Reporting: read-only selected-source Audit, eight-group dashboard and five report kinds with supported filters/page/sort; exact aggregate VND and authenticated CSV with applied filters, bounded export and no partial error download.

## Required checks

Each slice was reviewed before the next, followed by full regression. Checks cover typed payload allowlists, route/query reset, validation, permissions, stale writes, lifecycle/capacity, references and history. CSV shares bounded refresh and account-change guards. No frontend database access, new backend API/migration, deployment or provisioning.

## Slice evidence

- [Notification review](../reviews/phase-7b4a-notification-review.md)
- [Event review](../reviews/phase-7b4b-event-review.md)
- [Library review](../reviews/phase-7b4c-library-review.md)
- [Audit/Reporting review](../reviews/phase-7b4d-insights-review.md)
