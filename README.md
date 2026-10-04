# Campus Platform — Campus Client

Web frontend of Campus Platform, maintained independently from [Campus Service](https://github.com/cdanh11/campus-service). This repository is the product entry point; the backend owns authentication, authorization and business rules.

## Current status

Phase 7A foundation/authentication reviewed PASS on `feature/frontend-foundation`: React/TypeScript/Vite, Ant Design, React Router, TanStack Query, login/session UI and regression tooling. 7B1 ADMIN accounts/organization/Student/personnel screens are reviewed PASS locally on feature/identity-people. See [7B1 review](docs/reviews/phase-7b1-identity-people-review.md). 7B2 Academic screens are reviewed PASS locally; see [Academic review](docs/reviews/phase-7b2-academic-review.md). 7B3 Dormitory/Finance is reviewed PASS locally; 7B4a ADMIN Notification is reviewed PASS locally; Event/Library/Audit/Reporting screens and Student portal remain planned. See [Notification review](docs/reviews/phase-7b4a-notification-review.md). See [operations review](docs/reviews/phase-7b3-campus-operations-review.md). See [Phase 7 plan](docs/plans/phase-7-frontend.md) and [foundation review](docs/reviews/phase-7a-foundation-progress.md).

Backend contract reference: `795588e` (reviewed owner-schema correction on feature/api-contracts). OpenAPI snapshot/types and real-backend browser integration are verified. Mocked and real browser suites are reported separately.

## Local development

Clone the repositories as siblings:

```text
D:\Project\
  campus-service\
  campus-client\
```

Requires Node.js 24 (tested with 24.13.1), npm and a separately configured backend. In this repository:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Vite proxies `/api` to http://localhost:8080; port 3000 is fixed to match the backend's approved Origin. Follow the backend's own README to run it; frontend setup does not provision administrators or modify a database. No application feature needs a frontend secret. Never put credentials in `VITE_*` variables.

Access tokens stay in memory. Browser credentials carry the backend-managed HttpOnly refresh cookie. Development uses the backend local cookie configuration; production hosting configuration is not verified.

## Verification

```powershell
npm run verify
npx playwright install chromium
npm run test:e2e
```

`verify` runs ESLint, TypeScript/production build and Vitest. The default browser suite verifies mocked login/logout and mobile form behavior. Run ./scripts/test-backend.ps1 for the real Academic, People/account and cookie/authorization/multi-tab journeys using an isolated backend. See docs/development.md for setup and contract regeneration. CI config includes both suites with a pinned backend revision.

Verified locally on 2026-10-04: clean npm ci, contracts/lint/build passed; 21 tests across 4 files, 2 mocked and 3 real Chromium tests passed. Backend harness BUILD SUCCESS in 1m10s. Routes are split; no bundle size warning. Both GitHub CI jobs passed in run 37214290802. This is the historical 7A checkpoint; full Phase 7 remains in progress.

7B1 verified: contract drift/lint/TypeScript/build, 32 tests/9 files; 2 mocked and 5 real Chromium tests passed. Final real harness BUILD SUCCESS 1m28s, 2026-10-04T23:50:20+07:00. Local PASS does not claim post-push GitHub CI or full Phase 7 completion.

7B1 GitHub CI passed both jobs in run 37218317374. 7B2 local final: 41 tests/11 files, 2 mocked and 6 real Chromium journeys passed; harness BUILD SUCCESS 1m43s, finished 2026-10-05T00:20:36+07:00. Next is 7B3 Dormitory/Finance; post-push Academic CI remains separate.

7B2 GitHub CI both jobs PASS in run 37220302533. 7B3 local final: 49 tests/14 files, 2 mocked and 8 real Chromium journeys passed; real harness BUILD SUCCESS 2m06s, finished 2026-10-05T00:40:23+07:00. 7B4/7C/7D remain incomplete; post-push CI is reported separately.

7B3 GitHub CI both jobs PASS run 37221857088. 7B4a local final: 53 tests/16 files, 2 mocked and 9 real Chromium journeys passed; harness BUILD SUCCESS 2m30s, finished 2026-10-05T01:01:53+07:00. Full Phase 7 is incomplete.

7B4b Event local PASS: ADMIN catalog, capacity/lifecycle and retained registration/attendance with fresh versions. Final contracts/lint/build and 61 tests/19 files passed; two mocked and ten real Chromium journeys passed. Maven harness BUILD SUCCESS 3m07s, finished 2026-10-05T02:19:52+07:00. Notification accessible-name CI defect corrected and included in this regression. See [Event review](docs/reviews/phase-7b4b-event-review.md). Library/Audit/Reporting/Student portal and whole Phase 7 closure remain incomplete; replacement GitHub CI is pending.
