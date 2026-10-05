# Campus Platform design system
Product: Vietnamese campus administration and authenticated personal portal. Stack React/TypeScript/Ant Design; backend contracts unchanged.
Source: UI UX Pro Max installed with uipro init --ai codex. Queries university administration dashboard and enterprise SaaS dashboard produced marketing layouts, rejected. Focused style query minimalism dashboard returned Minimalism & Swiss Style (active, enterprise/dashboard use); UX keyboard focus navigation returned web keyboard navigation and focus states.
Adapted design: solid light surfaces, slate text, indigo primary, restrained mint accent, 8px spacing rhythm, sans-serif system fonts supporting Vietnamese. No remote font dependency, glass blur, decorative charts or invented metrics.
Semantic tokens live in src/theme.ts, CSS mirrors shared shell colors. Sidebar grouped by business domain; active route visible and announced, mobile navigation uses modal drawer. Content grows to available width with max-width and border-box; tables scroll inside their container.
Typography: body 14/16px, titles 28-36px, secondary text high contrast. Controls minimum 40px; navigation 44px. Focus ring 3px; skip link to main; reduced motion supported.
Tables/forms: white bordered surfaces, clear filters/action separation, bounded inner scroll, persistent labels and same error/version semantics.
Dashboard: responsive metric grid from real eight-group API; no sample totals.
Review at 375, 768, 1024 and 1440px; no page overflow, keyboard opening/closing drawer and navigating, visible focus, long identifiers and exact VND wrap. Functional tests alone do not prove visual quality.
