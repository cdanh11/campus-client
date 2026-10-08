# Development and backend contracts

Frontend and backend remain independent repositories. Node 24 is the frontend runtime. Backend Java 21, Maven Wrapper and Docker are required only for real integration checks.

## Commands

- npm ci: reproducible dependency installation.
- npm run dev: http://localhost:3000 with /api proxy to localhost:8080.
- npm run verify: generated-contract drift check, lint, TypeScript/production build and unit/component tests.
- npm run test:e2e: isolated mocked browser flows.
- ./scripts/test-backend.ps1: real backend integration using the sibling campus-service repository.
- npm run contracts:generate: regenerate types from the checked-in OpenAPI snapshot.

For the real suite install Chromium first: npx playwright install chromium. The PowerShell runner refuses unrelated backend changes, copies exactly one frontend-owned test fixture, and removes only that unchanged file in finally. The backend test profile uses a new PostgreSQL Testcontainer, Flyway and Hibernate validate. Test accounts are created only in that database; the password is random per run and passed to the child browser process, never tracked. Existing developer databases/volumes are not touched. No production provisioning endpoint is introduced.

The real suite starts Vite on fixed port 3000. Stop a frontend development server before running it; the runner never reuses an unknown existing server. Maven remains a persistent process while browser tests execute, then Spring closes its context and pool.

## API snapshot

contracts/source.json identifies the production backend Git revision. contracts/openapi.json comes from that application's /v3/api-docs, with only the random test server URL normalized. src/api/schema.d.ts is generated; change the source contract then regenerate rather than editing declarations. CI checks the same backend revision; update the backend checkout ref together with an approved contract update.

OpenAPI response properties are optional where springdoc has no required annotation. Authentication validates required values at runtime before constructing a session. Generated int64 types allow number or bigint; unformatted numeric values also allow LosslessNumber. The parser uses bigint for integers outside JavaScript's safe range, and LosslessNumber for decimals. Always use the API mutation wrapper to serialize these values; do not JSON.stringify a request containing bigint or round money/version values with Number.

## Session and browser behavior

Access tokens are memory-only. Refresh is bounded and shared within a tab. On secure contexts (including localhost), Web Locks serialize login/refresh/logout cookie requests between tabs. BroadcastChannel invalidates other tabs' views and query caches on login/logout; messages contain no tokens or user data. Browsers without these APIs retain single-tab behavior; multi-tab support has been tested in Chromium on localhost, not all browsers or production hosting.

The local backend cookie is HttpOnly, SameSite=Lax, path /api/v1/auth and Secure=false. The backend production default remains Secure=true and requires HTTPS; this frontend does not override that policy. Refresh/logout send the real browser Origin through Vite. No Origin allowlist weakening is needed.

Queries/mutations do not retry business writes automatically. API 401 retries once after refresh; repeated failure clears the session. 403 is a permission error, 409 requires reloading current data before deciding on another write. Request/response timeouts are bounded; logout network failure clears local data and displays a retry action because server cookie revocation is not yet confirmed.

## Scope

Foundation navigation and session handling are 7A. ADMIN business screens are 7B1–7B4 and personal inbox/Event flows are 7C. All approved screens are implemented; personal Academic/Dormitory/Finance/Library flows are outside Phase 7.

Vitest uses at most two workers with per-file isolation. Run Maven, Vitest and browser regressions sequentially on resource-constrained local machines; Phase 8A2 concurrent UI wait failures disappeared in complete isolated runs without changing timeouts/assertions. Mocked and real Playwright suites use one worker to bound local resource usage. See the [final review](reviews/phase-7-final-review.md) for measured results; commands alone do not establish a PASS.

## Current UI and portal scope

Shared experience rules: [design system](../design-system/campus-platform/MASTER.md); personal portal: [API contract](api/portal.md). Own inbox/Event routes are implemented; regular-user pages use authenticated owner APIs only. Production nullable readAt/cancelledAt/attendedAt fields are represented explicitly in local portal view types. Local UI UX Pro Max tooling is ignored; curated design decisions are versioned. Phase 7 closure evidence is in the [final review](reviews/phase-7-final-review.md); older counts are historical checkpoints.

## Local demo and remaining phases

Use the sibling backend `.\scripts\start-local.ps1` to load its ignored environment and start PostgreSQL/backend, then `npm run dev` here. See the [local demo guide](runbooks/local-demo.md). The approved [Phase 8–9 scope](plans/phase-8-9-local-demo.md) emphasizes acceptance/regression tests and demo/portfolio preparation, with no required hosting or Workflow/AI. Existing test evidence stays tied to its actual checkpoint.
