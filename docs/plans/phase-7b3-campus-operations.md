# Phase 7B3 — Dormitory and Finance

Delivery status: COMPLETE, included in merged Phase 7. Detailed historical evidence is linked below.

Approved parent: [Phase 7](phase-7-frontend.md). Backend owner contracts at 795588e remain authoritative. No schema/API changes.

Implemented:

1. Buildings/rooms/beds create/read/update and parent filters, immutable parent, ACTIVE/INACTIVE, current status errors.
2. Current assignment create/list/detail/release; ACTIVE Student and bed; one current place enforced by backend. RELEASED terminal, later stay new UUID, history retained. Explicit release selection.
3. Fees create/edit and positive integer VND range 1..9999999999999999999. Text input -> bigint; no Number rounding. Charges snapshot fee fields, immutable amount/references/dueDate; explicit cancellation only; read coherent balance.
4. Receipts create/list/detail/full reversal. Fresh charge balance version on create; fresh receipt and charge versions on reversal. Partial payments, overpayment rejection, reason 2–500, terminal retained reversal. No gateways/transfers/refunds.
5. Bounded owner filters/sort/page, selected historical references, loading/error/stale controls. Never auto-resubmit 409.

Completed and included in merged Phase 7. See the [operations review](../reviews/phase-7b3-campus-operations-review.md) for checkpoint evidence and the [final review](../reviews/phase-7-final-review.md) for current totals/CI.
