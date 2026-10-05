# Phase 7 — Frontend Product

Status: COMPLETE, reviewed PASS locally and in [source CI](https://github.com/cdanh11/campus-client/actions/runs/37312616255); merged through PR #1. See [final review](../reviews/phase-7-final-review.md).

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

## Review and delivery rules

Each slice requires inspect -> plan -> implement -> verify -> review diff -> PASS/FAIL before the next. Branches use feature/ prefixes; commits are grouped by function after PASS. The user owns PR/merge. Detailed checkpoint evidence is indexed in [documentation](../README.md). Phase 8 requires a separate plan; deployment and production first-admin provisioning remain outside Phase 7.
