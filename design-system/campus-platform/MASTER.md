# Campus Platform design system

Product: Vietnamese campus administration and authenticated personal portal. Stack React/TypeScript/Ant Design; backend contracts unchanged.

Source: UI UX Pro Max installed locally with `uipro init --ai codex` and used as advisory research only. The shipped decisions below are implemented by hand in `src/styles.css` and `src/theme.ts`; no generated component library is included.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `--primary` | `#176b87` | Primary actions, links, focus, active navigation |
| `--primary-dark` | `#0d5069` | Hover/pressed primary |
| `--primary-soft` | `#e8f4f7` | Selected navigation, icon tiles, badges |
| `--teal` | `#188b83` | Success accent and page-chrome rule |
| `--accent` | `#f0a35e` | Warm accent, used sparingly |
| `--navy` | `#102a43` | Headings and sidebar |
| `--ink` | `#19324a` | Body text |
| `--muted` | `#5a7183` | Secondary text |
| `--border` | `#dce7ee` | Dividers and input borders |
| `--canvas` | `#f5f8fa` | Page background |
| `--surface` | `#ffffff` | Cards and tables |

Both files must stay in sync. Change a token in `src/styles.css` and mirror the matching Ant Design token in `src/theme.ts`.

## Shape and spacing

- Spacing rhythm: 4/8/12/16/20/24/32/48px.
- Radii: `10px` controls, `14px` alerts and icon tiles, `20px` cards and panels.
- Elevation: two levels only; static cards keep `--shadow-sm` and do not lift on hover.
- Controls: 40px minimum height (buttons, inputs, selects); navigation links 44px.
- Typography: body 14/16px, page titles 30–46px, section titles 20–24px, secondary text keeps AA contrast.
- Focus: 2px primary outline with 3px offset; skip link to `#main-content`.
- Motion: one short rise-in for page content; disabled under `prefers-reduced-motion`.

## Layout

- Sidebar grouped by business domain; active route visible and announced.
- Mobile navigation uses the Ant Design drawer below 1024px.
- Content grows to available width with a 1680px cap; tables scroll inside their container.
- One `<h1>` per page. Section navigation uses links, not headings.
- Tables and forms: white bordered surfaces, filters separated from actions, persistent labels.

## Data and language

- Vietnamese-first copy; timestamps display and are entered in `Asia/Ho_Chi_Minh` (UTC+7) while API payloads stay UTC.
- Exact VND and 64-bit versions are never rounded through JavaScript `Number`.
- No invented metrics: dashboard values come from real APIs.

## Review sizes

375, 768, 1024 and 1440px. Check no page overflow, keyboard drawer open/close, visible focus, long identifiers wrapping and exact VND display.
