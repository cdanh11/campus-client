# Phase 7B3 — Dormitory and Finance
Status: PASS (local), 2026-10-05. Branch feature/campus-operations-ui stacked from 7B2 c717076; approved parent phase-7-frontend.md.
Backend owner contracts at 795588e remain authoritative. No schema/API changes.

Implemented:
1. Buildings/rooms/beds create/read/update and parent filters, immutable parent, ACTIVE/INACTIVE, current status errors.
2. Current assignment create/list/detail/release; ACTIVE Student and bed; one current place enforced by backend. RELEASED terminal, later stay new UUID, history retained. Explicit release selection.
3. Fees create/edit and positive integer VND range 1..9999999999999999999. Text input -> bigint; no Number rounding. Charges snapshot fee fields, immutable amount/references/dueDate; explicit cancellation only; read coherent balance.
4. Receipts create/list/detail/full reversal. Fresh charge balance version on create; fresh receipt and charge versions on reversal. Partial payments, overpayment rejection, reason 2–500, terminal retained reversal. No gateways/transfers/refunds.
5. Bounded owner filters/sort/page, selected historical references, loading/error/stale controls. Never auto-resubmit 409.

Verification: 49 tests/14 files, contract drift/lint/build passed; two mocked and eight real Chromium journeys passed. Real Maven harness BUILD SUCCESS 2m06s, one test, zero failures/errors/skips, finished 2026-10-05T00:40:23+07:00. See ../reviews/phase-7b3-campus-operations-review.md.
User owns PR/merge; no deploy/provisioning. 7B4/7C/7D remain incomplete.
