# Phase 7B4 — Supporting services and Reporting
Status: IN PROGRESS. Stacked from 7B3 2b3b26c; backend 795588e.
7B4a Notification: ADMIN templates/draft/edit/explicit publish to 1–100 distinct ACTIVE accounts, fresh version, immutable published plain-text snapshots. Own inbox/read belongs to 7C.
7B4b Event: ADMIN catalog/membership/attendance; same-record cancellation/restoration, capacity and version.
7B4c Library: title/copy/borrow/return/history, no fines.
7B4d Audit/Reporting: selected-source audit and dashboard/detail reports, bounded CSV.
Each part requires owner-contract inspection, verification and PASS before next; then whole 7B4 regression. No API/migration/deploy/provisioning changes.

7B4a Notification PASS local 2026-10-05: 53 tests/16 files, two mocked/nine real journeys, harness BUILD SUCCESS 2m30s. See ../reviews/phase-7b4a-notification-review.md. 7B4b–d incomplete; next Event ADMIN catalog/registration/attendance.

7B4b implementation plan: typed Event catalog with UTC ISO input preserving fractional seconds, positive int32 capacity and allowed lifecycle; ADMIN nested owner registration POST and retained-record PUT actions with fresh version. OPEN/ACTIVE owner pickers, bounded event/student filters. Validate time/order/fractions, whitelist payloads and real capacity/cancel/restore/attendance/stale flows before PASS.

7B4b Event reviewed PASS locally: exact UTC/fractional-time validation, bounded catalog queries, nested membership creation, explicit cancel/restore/attendance and terminal states. Navigation sort leakage fixed with regression. Final 61 unit/component tests, two mocked/ten real Chromium journeys passed; harness BUILD SUCCESS 3m07s. See ../reviews/phase-7b4b-event-review.md. Replacement CI must resolve Notification's failed prior run before advancing to 7B4c.

Replacement CI run 37228035728 PASS both jobs at frontend 5d5ea0a. 7B4c plan: typed title/copy catalogs, immutable copy parent, bounded historical filters; fresh explicit return using owner PUT suffix, exact version and server dates. Test occupied rejection, 14-day due time, return after inactive references and new UUID on later borrow. No renewal/fines/self-borrow or schema changes.

7B4c Library local PASS: owner title/copy catalog, immutable parent, explicit fresh-version return and retained history; due date/occupied copy/inactive return/new UUID proven in real browser. Final 65 tests/21 files, two mocked/eleven real journeys, Maven BUILD SUCCESS 3m30s. See ../reviews/phase-7b4c-library-review.md. Next 7B4d Audit/Reporting after CI; whole Phase 7 incomplete.
