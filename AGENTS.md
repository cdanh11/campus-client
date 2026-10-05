# Campus Client Agent Instructions

## Scope

Separate React/TypeScript frontend for campus-service. Follow docs/plans/phase-7-frontend.md, README.md and current Git state. Phase 7 is complete and merged; use docs/reviews/phase-7-final-review.md for current evidence. Remaining Phases 8–9 follow docs/plans/phase-8-9-local-demo.md: local tests/demo quality and portfolio handoff. Production operations and Workflow/AI are not required. Each slice still requires its own review; do not mark planned gates complete. Backend business rules/authorization remain authoritative; UI visibility is not access control.

## Workflow

Inspect -> plan -> implement -> build/test -> review diff -> report. Each slice must pass its own PASS/FAIL review before the next. Preserve unrelated changes. Use feature/<function-or-phase> branches. Commit by function after PASS when authorized; user owns PR/merge. Do not deploy, force-push, rewrite history or create public provisioning APIs.

## Security and contracts

Never commit credentials, tokens, a real .env or private data. VITE_* values are public. If environment placeholders are introduced, put only non-secret examples in .env.example; the current frontend needs no application secret. Access tokens stay in memory; refresh cookie is backend-managed HttpOnly. Match actual backend DTOs and expectedVersion semantics. Bound refresh retries and serialize refresh calls; clear query caches on account/session changes. Keep exact VND amounts and 64-bit versions intact, never round large JSON integers through JavaScript Number.

## Verification

Document only actual build/test results. Prefer meaningful auth, contract, optimistic-lock, accessibility and user-flow tests. Browser E2E with mocks is not proof of real backend integration. Maintain reproducible package lock and CI. Do not invent commands before package.json exists.

## Coordination

Backend lives in a sibling repository. Record the backend commit used for contracts. Do not access database tables from the frontend. Changes needing new owner APIs require explicit scope approval and a linked backend change. The existing backend docs/plans/project-roadmap.md remains local/untracked; never copy/stage/push it without the user's instruction.

## Documentation

README describes current product capabilities and runnable setup, not an appended execution journal. Plans retain approved scope and current delivery status. Reviews identify their checkpoint and preserve actual evidence; later whole-phase results are linked explicitly. Update existing statements instead of appending contradictory status paragraphs. Verify relative links and commands against tracked files/package scripts before reporting PASS.
