# Personal portal visual decisions

Inherits ../MASTER.md. Responsive text-first cards, consistent indigo/slate surfaces and domain status tags. Catalog cards show real title/code/start time/capacity, never an invented remaining-seat count. Own history resolves names by authenticated Event GET rather than requiring users to interpret only UUIDs.

Inbox previews remain text, with complete text in a fresh detail dialog. Explicit read/registration buttons have stable accessible names while loading. Pending mutation feedback, safe domain errors, disabled duplicate submission and close/reopen after rejection are part of the interaction design.

Conditional dialogs restore focus to the opener after closing; if refresh removes that row, focus falls back to main content. List refresh is awaited before closing. This behavior was added after browser tests revealed missing focus restoration, and verified at 375/768/1440px.

Design system search "student portal inbox" returned a marketing/video layout unsuitable for this app. The narrower UX search "inbox status feedback" supplied relevant loading/success/error guidance; mobile haptic advice was rejected for this web product. Existing shared tokens were retained instead of persisting the unsuitable generated palette/layout.

Visual inspection covered desktop and mobile catalog screenshots. No horizontal page overflow at measured sizes; filters wrap, cards stay readable, navigation remains accessible. Screenshots contain only mock data. Verification totals belong to the review document.
