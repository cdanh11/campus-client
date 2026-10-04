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

Foundation navigation and session handling are 7A. ADMIN business screens are 7B1–7B4 and personal inbox/Event flows are 7C. Empty foundation landing areas are not claims that those business screens exist.

Vitest uses at most two workers and preserves per-file isolation and existing timeouts. With 16 jsdom files, the unbounded local run timed out a pre-existing password-reset test at 15s; that test passed independently (7.71s total), and the bounded full run passed 53 tests/16 files in 43.86s. This is test-runner resource control; no assertions/timeouts were relaxed.
