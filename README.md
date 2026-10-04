# Campus Platform — Campus Client

Web frontend of Campus Platform, maintained independently from [Campus Service](https://github.com/cdanh11/campus-service). This repository is the product entry point; the backend owns authentication, authorization and business rules.

## Current status

Phase 7A foundation/authentication reviewed PASS on `feature/frontend-foundation`: React/TypeScript/Vite, Ant Design, React Router, TanStack Query, login/session UI and regression tooling. 7B1 ADMIN accounts/organization/Student/personnel screens are reviewed PASS locally on feature/identity-people. See [7B1 review](docs/reviews/phase-7b1-identity-people-review.md). Academic and subsequent operations screens, plus Student portal, remain planned. See [Phase 7 plan](docs/plans/phase-7-frontend.md) and [foundation review](docs/reviews/phase-7a-foundation-progress.md).

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

`verify` runs ESLint, TypeScript/production build and Vitest. The default browser suite verifies mocked login/logout and mobile form behavior. Run ./scripts/test-backend.ps1 for three real cookie/authorization/multi-tab journeys using an isolated backend. See docs/development.md for setup and contract regeneration. CI config includes both suites with a pinned backend revision.

Verified locally on 2026-10-04: clean npm ci, contracts/lint/build passed; 21 tests across 4 files, 2 mocked and 3 real Chromium tests passed. Backend harness BUILD SUCCESS in 1m10s. Routes are split; no bundle size warning. Both GitHub CI jobs passed in run 37214290802. Full Phase 7 remains in progress; next is the 7B1 owner-contract correction and Identity/People screens.

7B1 verified: contract drift/lint/TypeScript/build, 32 tests/9 files; 2 mocked and 5 real Chromium tests passed. Final real harness BUILD SUCCESS 1m28s, 2026-10-04T23:50:20+07:00. Local PASS does not claim post-push GitHub CI or full Phase 7 completion.
