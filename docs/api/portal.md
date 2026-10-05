# Personal portal API and interaction contract

Approved Phase 7C scope: authenticated own inbox and Event catalog/membership. UI routes: /portal/inbox, /portal/events, /portal/registrations. Any authenticated account can browse the catalog; Event registration requires a linked ACTIVE Student. No personal Academic, Dormitory, Finance or Library screen is implied.

| UI operation | Backend request |
| --- | --- |
| Own inbox/filter/page | GET /api/v1/notifications?page&size&status&sort |
| Fresh message detail | GET /api/v1/notifications/{id} |
| Explicit mark read | PUT /api/v1/notifications/{id}/read, expectedVersion |
| Catalog/search/filter/page | GET /api/v1/events?page&size&q&status&sort |
| Event detail | GET /api/v1/events/{id} |
| Own registration history | GET /api/v1/event-registrations?page&size&status&sort |
| Membership for a selected Event | GET own history with eventId, then GET /api/v1/event-registrations/{id} |
| Register current account | POST /api/v1/events/{eventId}/registrations, no body |
| Cancel/restore retained membership | PUT /api/v1/event-registrations/{id}, action and expectedVersion |

Lists use bounded sizes 10/20/50/100. Search is submitted explicitly and filters reset page. Counts are checked before conversion to Ant Design pagination numbers. Dates retain backend UTC strings and precision; dates do not automatically close admission. Exact 64-bit versions flow through the existing lossless API client.

Details always load fresh before mutation. Opening a message never writes. Plain-text notification/Event content is rendered as React text, never HTML. Pending writes disable duplicate submission and closing. Rejected Event writes require close/reopen and fresh reads; no automatic mutation retry. REGISTERED allows CANCEL even when the Event has closed; CANCELLED allows RESTORE only while OPEN. ATTENDED is read-only and users cannot submit ATTEND. Restoration keeps the same registration ID/history. Backend ownership, link status, capacity and lifecycle validation remain authoritative.

An unlinked account receives a helpful message for own membership 404 and can continue browsing. Other errors expose the shared safe code/trace contract. The browser never calls ADMIN endpoints for portal data. Session changes clear the existing query cache; access tokens remain in memory.

Catalog uses responsive cards; history resolves names through authenticated Event GETs, cached by event ID and bounded by the current page. No unbounded all-page fetch or invented remaining-seat count is used. The backend checks actual remaining capacity at admission.

Verification evidence belongs to the Phase 7C review; this contract document alone is not a PASS claim.
