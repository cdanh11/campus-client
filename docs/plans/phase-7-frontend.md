# Phase 7 — Frontend Product

User-approved direction: independent campus-client repository beside campus-service. React + TypeScript + Vite, Ant Design, React Router, TanStack Query; npm lockfile. Preserve backend layout and identifiers. Phase 6 backend merged at 7d130f4.

## 7A — Foundation and authentication

Repository hygiene, README/agent rules, CI, lint/typecheck/build/unit/component/browser setup; theme/layout/routing; API client with versioned OpenAPI snapshot; login/refresh/logout/me, role-based navigation, 401/403/error/conflict handling. Memory-only access token, HttpOnly cookie, single-flight refresh and no secret frontend environment. Local frontend port 3000/proxy preserves the approved Origin policy. Test the actual browser cookie flow before claiming integration PASS.

## 7B1 — Identity and People

ADMIN accounts, organizations, Students and Faculty/Staff; bounded search/pages, validation, version conflicts, status/roles/reset actions as actual contracts define. No public account registration.

## 7B2 — Academic

Programs, courses, terms, offerings, sections and ADMIN enrollment. Reference selection through authorized owner APIs; expose only supported lifecycle actions, capacity/faculty rules and retained withdrawal/restoration.

## 7B3 — Campus operations

Dormitory inventory/current assignment/release and Finance fees/charges/manual partial receipts/full reversal/balance. Preserve exact VND and expectedVersion; display retained history and domain errors.

## 7B4 — Supporting services and Reporting

Notification templates/draft/publish, Event catalog/ADMIN membership/attendance, Library title/copy/borrow/return, selected-source Audit viewing, dashboard/detail reports and bounded CSV downloads. Do not imply SMTP, payment gateway, grading or historical reporting.

## 7C — Student portal

Existing approved authenticated capabilities: own inbox/read, Event catalog and linked Student registration/cancel/restore. Missing personal Academic/Dormitory/Finance/Library/Faculty read APIs require separate approval; never consume ADMIN routes from a regular-user UI.

## 7D — Closure

Responsive/error/loading/empty states, accessibility baseline, component/API contract checks, browser E2E for critical ADMIN/Student journeys using an isolated real backend database; report mocked tests separately. Security/session/cache/exact-number/optimistic-lock regression, documentation and per-requirement review. No deployment or production first-admin provisioning.

Every slice requires inspect/plan/implementation/verification/diff/PASS review before moving on. Branches use feature/ prefixes. User owns PR/merge. Repository baseline initialization will be a small separate commit before feature/frontend-foundation so an empty remote has a main branch to compare PRs against.

Status: 7A and 7B1 reviewed PASS locally and on GitHub CI (runs 37214290802 and 37218317374). 7B2 Academic reviewed PASS locally, 2026-10-05: contracts/lint/build, 41 tests/11 files, 2 mocked and 6 real Chromium journeys; harness BUILD SUCCESS 1m43s. See ../reviews/phase-7b2-academic-review.md. Next 7B3; 7B3/7B4/7C/7D remain incomplete. Whole Phase 7 is not complete.

7B2 GitHub CI both jobs PASS run 37220302533. 7B3 local PASS: inventory/accommodation and exact VND fee/snapshot/partial receipt/reversal/balance screens; 49 tests/14 files, two mocked and eight real journeys; Maven harness BUILD SUCCESS 2m06s. See ../reviews/phase-7b3-campus-operations-review.md. Next 7B4 supporting services/Reporting; 7C/7D also incomplete.
