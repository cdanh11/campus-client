# Campus Platform — Campus Client

Campus Client is the Vietnamese web frontend of Campus Platform. It uses the APIs provided by [Campus Service](https://github.com/cdanh11/campus-service), which owns authentication, authorization and business rules.

## Project status

The approved Phase 7 frontend is complete and reviewed PASS locally and on GitHub CI. It was merged into `main` through [PR #1](https://github.com/cdanh11/campus-client/pull/1). The [Phase 7 final review](docs/reviews/phase-7-final-review.md) records the tested revision, results and limits. Phase 8 release/demo preparation has not started; production hosting is not configured or verified.

## Available features

| Audience | Features |
| --- | --- |
| ADMIN | Accounts and roles; organization units; Student and Faculty/Staff profiles |
| ADMIN | Academic programs, courses, terms, offerings, sections and enrollment |
| ADMIN | Dormitory buildings/rooms/beds and current accommodation; VND fees, charges, manual receipts and reversal |
| ADMIN | Notification publication; Event membership/attendance; Library borrowing/return; read-only Audit |
| ADMIN | Eight-group dashboard, five reports and filtered CSV export |
| Authenticated accounts | Own inbox and explicit mark-read; Event catalog and own registration history |
| Accounts linked to a Student | Own Event membership cancellation; registration/restoration additionally require an ACTIVE Student and OPEN Event under backend capacity rules |

Student Academic, Dormitory, Finance and Library self-service screens are outside the approved frontend scope. See the [portal API contract](docs/api/portal.md).

## Technology

React, TypeScript, Vite, Ant Design, React Router and TanStack Query. The API client keeps access tokens in memory, uses the backend-managed HttpOnly refresh cookie and preserves exact VND amounts and 64-bit versions. Shared visual rules are in the [design system](design-system/campus-platform/MASTER.md).

## Run locally

Requires Node.js 24.13 or newer within major 24, npm and a configured backend. Keep the repositories as siblings:

```text
D:\Project\
  campus-service\
  campus-client\
```

Start the backend using its own README, then run in `campus-client`:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Vite proxies `/api` to http://localhost:8080. Port 3000 matches the backend's local Origin policy. Account provisioning follows the backend runbook; the frontend does not create a first administrator. Frontend configuration contains no application secrets; `VITE_*` values are public.

## Verify

```powershell
npm run verify
npx playwright install chromium
npm run test:e2e
```

`verify` checks generated API contracts, ESLint, TypeScript, the production build and Vitest. The mocked Chromium suite covers authentication, responsive layout, keyboard/focus behavior, portal privacy/contrast and reference selection. Mocks do not prove backend integration.

With Java 21, Docker running and a clean sibling backend checkout, run the separate integration suite:

```powershell
.\scripts\test-backend.ps1
```

It runs real ADMIN and personal-portal journeys against isolated PostgreSQL/Flyway/Hibernate, including session rotation, authorization, stale versions, capacity, history and exact VND. The runner refuses unrelated backend changes; an explicit clean checkout can be supplied with `-BackendPath`. See [development and contracts](docs/development.md) for setup and cleanup behavior.

CI runs both suites against the backend revision recorded in [contract provenance](contracts/source.json). The merged main revision passed both jobs in [GitHub Actions run 37314653968](https://github.com/cdanh11/campus-client/actions/runs/37314653968). Detailed totals and historical slice evidence belong in [documentation](docs/README.md), rather than this README.
