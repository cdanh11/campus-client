# Phase 7 experience, portal and closure

Current gate: all approved Phase 7 slices and closure PASS locally; post-push CI PASS (37312616255). See ../reviews/phase-7-final-review.md. Status entries below are historical checkpoints.
User-approved: use UI UX Pro Max to refactor 7A/7B and finish 7C/7D.
Inspect: 7B4 CI run 37231603933 both jobs succeeded. Baseline branch feature/supporting-services-ui, clean before local skill installation.
1. Shared experience: semantic theme, responsive sidebar, login/account/admin overview, dashboard, shared table/form/navigation surfaces. Preserve all routes, contracts and security logic. Review before portal.
2. 7C: own inbox/read and authenticated Event catalog; linked Student register/cancel/restore with fresh expectedVersion. No ADMIN API for regular accounts.
3. 7D: complete unit/build/mock/real backend regression plus responsive keyboard/overflow checks and visual inspection; documentation and PASS/FAIL evidence; commit by function after PASS.
Branch feature/frontend-experience. UI skill installed locally, ignored from source control; design decisions versioned separately. No backend user configuration changes, deployment or provisioning.
Status: implementation in progress; no new PASS claimed.

Interim verification: initial lint failed because local installed skill scripts were included; excluded .agents/skills only. Initial four-worker browser run: 5 failures / 2 passes; unchanged assertions and timeouts passed when rerun with one worker (7/7). Added dashboard viewport/exact-number cases; final mock browser run 9/9 PASS in 48.0s. First real backend run BUILD FAILURE 6m56s, 10/12 journeys passed: Dormitory selected a row before destination render; People did not retain the intended reference selection. Destination heading synchronization and explicit interactive option/selected-value checks added. Replacement real run is required before PASS.

Final npm verify: 80 tests/25 files PASS, unit duration 74.32s; build 3.35s. Nine viewport/auth/dashboard mocked journeys PASS in 48.0s; added focused pointer-reference regression PASS across five create/query-update cycles (32.8s). Replacement real run hit an Academic reference-selection wait and the aggregate 5-minute harness budget (BUILD FAILURE 6m22s; suite did not finish). Added a selected-value assertion before Academic submit and raised only the aggregate process budget to 10 minutes; per-test timeouts and exit-code assertion unchanged. Mock browser workers default to one, matching locally verified resource limits. Third full real run pending.

Refactor gate PASS locally 2026-10-05: latest lint/typecheck/contracts PASS; all ten mock browser tests PASS 1.1m and all twelve real journeys PASS 3.7m. Harness BUILD SUCCESS 5m01s, finished 18:26:54 +07, fixture removed and backend worktree clean. Earlier 13:34 run interrupted without terminal result; not classified BUILD FAILURE. See ../reviews/phase-7-experience-review.md. Next approved 7C own inbox/Event; 7D/full Phase 7 incomplete.

Refactor post-push CI both jobs PASS run 37303384628 at cf19c4a. 7C implementation begun: own paginated inbox/detail and explicit fresh-version read. UI receives text only; no auto-write on open and no ADMIN API. Event catalog/own registration and real portal regression remain pending; no 7C PASS yet.

7C final-source verification checkpoint: 92 unit/component tests in 27 files PASS (90.09s); replacement 13 mocked browser tests PASS (1.6m). Description contrast fixed and >=4.5 checked; modal focus return checked. Reference dropdown animation synchronization passed three repeated five-cycle submissions, then aggregate regression. Final-source real backend rerun is active; 7C gate, 7D closure and portal post-push CI remain pending. See ../reviews/phase-7c-portal-review.md.

Latest checkpoint: all approved Phase 7 slices and 7D closure PASS locally. Final 92 unit/component, 13 mock and 14 real journeys PASS; harness BUILD SUCCESS 4m19s at 19:49:30 +07. Earlier incomplete statements above are historical checkpoints. Post-push CI PASS (37312616255). See ../reviews/phase-7-final-review.md.

GitHub CI run 37312616255 at b70c585026ba3ae41bc476404b7c47d2ce329bc0 completed SUCCESS for both verify and backend-browser. https://github.com/cdanh11/campus-client/actions/runs/37312616255 . Subsequent evidence-recording commit changes documentation only; tested runtime/test/configuration source is unchanged.
