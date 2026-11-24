# Design

How the UI of this site is designed. Read this before changing any page, component or style.

The site is a **blueprint**: a calm, near-monochrome canvas drawn on a ruled grid. Thin rules frame a single content column, hatched bands separate rows, and the margins carry drafting annotations (measurements, handwritten notes). Color comes from real things only: official brand marks, a GitHub contribution graph, the green "live" dot. Motion is **spring**: everything that moves settles with a small overshoot.

## Making a UI change

1. **Place it on the grid.** New home or blog content is a row inside the page's bleed wrapper, separated from its neighbours by `<Hatch />` (see [Layout](#layout)). Done when the row's content edges line up with the bio text and the column rails.
2. **Build from the existing primitives** in [Components](#components) and the tokens in [Color and type](#color-and-type). Done when the change adds no new hex color outside `app/global.css` (brand marks excepted) and reuses an existing card, row or annotation before inventing one.
3. **Verify.** Run `pnpm build`, start it with `pnpm start -p 3457`, and screenshot the page with Playwright (Chromium lives at `~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`). Done when you have looked at **light and dark** at **390px, ~1130px and 1440px**, and `document.documentElement.scrollWidth - innerWidth` is `0` at each. Stop the server afterwards.

To check layouts that need more posts than exist, add temporary `zz-temp-*.mdx` files to `app/blog/posts/`, screenshot, then delete them and rebuild. Never edit the real posts' content.

## Layout

- **The column.** All content lives in one centred column, `min(42rem, 100% - 1rem)` wide, framed by vertical rails (`.column` in `app/global.css`). `main` and the footer both use it, so the rails run from the top of the page through the footer. The 672 (42rem) width is also what the margin `Dimension` reads, so keep the two in sync.
- **Bleed rows.** Page content sits in a wrapper with `-mx-4 sm:-mx-5` so rows run rail to rail. Each row then pads its own content with `px-4 sm:px-5`; that padding is the alignment edge everything else lines up with.
- **Rules and bands.** `.rule-top` draws a full-screen-width line above an element. `<Hatch />` (`app/components/grid.tsx`) is a full-width diagonal-hatched band with ruled edges, placed between every row. Both reach past the column using a `100vw` pseudo-element; the layout root has `overflow-x-clip` to trim them, which is what keeps horizontal scroll at zero.
- **Ruled cells.** Inside a row, split content into cells with `border-line` rules (e.g. the home intro: avatar cell, then name cell with a rule under the name). Prefer rules over gaps.
- **Alignment over whitespace.** Cards and rows fill the column width. Footer row, wordmark and content share the same left and right edges.
- **Header.** A fixed, centred pill (`app/components/nav.tsx`) floats over the top of the column. There is no navbar.

## Color and type

Tokens live in `app/global.css` as CSS variables written with `light-dark()`, exposed to Tailwind through `@theme inline`. That file is the single source of truth for values; use the token names, never raw hex.

| Token (Tailwind) | Role |
| --- | --- |
| `bg`, `fg` | page background, primary text |
| `muted` | body copy and secondary text (meets AA on `bg` and `card`) |
| `subtle` | decorative only: rules inside annotations, placeholder glyphs |
| `line` | every rule, border and divider |
| `card`, `card-2` | raised surfaces; `card-2` for hover fills and tinted boxes |
| `ink` | handwritten margin notes |
| `shadow-soft`, `shadow-float` | resting cards; floating previews and the pill |
| `ease-spring` | CSS spring easing for transforms |
| `--gh-0`…`--gh-4` | GitHub contribution levels |

- **Theme.** `data-theme` on `<html>` is set before paint by the script in `app/layout.tsx` (stored as `light`, `dark` or `system`). Components never branch on theme in JS; `light-dark()` handles it. Box shadows can't use `light-dark()`, so they are swapped per theme in the `--elev-*` rules.
- **Type.** Geist Sans for UI and prose, Geist Mono for captions, dates and labels in the blueprint voice (taglines, year headers, measurements), Caveat (`font-hand`) only for margin notes. Bold inside body copy is `font-semibold text-fg` against `muted` text: that contrast is the rhythm of the bio and the article.

## Components

| Component | File | Use it for |
| --- | --- | --- |
| Header pill + ⌘K menu | `components/nav.tsx` | Site navigation, theme switcher. Arrow-key menu, Esc closes. |
| Social row + hover previews | `components/social.tsx` | Contact links. One floating card morphs between previews (GitHub graph, X profile, RSS, email). |
| `LatestPost` | `components/latest-post.tsx` | The newest post on the home page as ruled rows: header strip, post with faded excerpt, "All posts" row. |
| `PostListItem` | `components/posts.tsx` | A ruled post row on the grid (`/blog`, "Keep reading"). |
| `Hatch` | `components/grid.tsx` | Band between rows; `measure="32"` adds a margin dimension. |
| `Dimension`, `Note` | `components/annotations.tsx` | Margin annotations (below). |
| `BrandIcon` | `components/icons.tsx` | Official brand marks in official colors. |
| `LinkIcon`, `Icon` | `components/icons.tsx` | Mono glyphs (`LinkIcon` for links, `Icon` for UI strokes). |
| `CopyPage` | `components/copy-page.tsx` | Copies a post as Markdown. |

**Cards** share one shape: `rounded-[22px] border border-line bg-card shadow-soft`, with inner surfaces at `rounded-[18px]`. Reserve cards for floating things (hover previews, the ⌘K menu). Content sits directly on the grid, never in a card: the home "Latest writing" block (`LatestPost`), post lists (`divide-y divide-line` rows of `PostListItem`: a mono meta cell ruled off from the content cell on `sm` up, stacked on phones) and the article page are all ruled rows.

**Hover.** Things are fully colored at rest. When one item in a set is hovered, it stays highlighted and its siblings fade (grayscale or opacity), via a `:has(:hover)` rule on the parent. Hovered links lift slightly (`-translate-y-0.5`) or nudge their arrow; titles in list rows soften to `muted`.

**Icons.** Social and contact links use `BrandIcon`: GitHub and X in black (white in dark mode), RSS as the orange square, email as the blue square. Footer icons are static (no hover animation). Navigation and UI glyphs stay mono.

## Annotations

Margin details make the page read as a drawing. They live outside the column, are `aria-hidden` and `pointer-events-none`, and show only from `lg` (1024px) up, except the column-width `Dimension`, which shows from `md`.

- `Dimension`: a measurement line with ticks, arrowheads and a mono label. Label real values (column `672`, avatar `Ø96`, band `32`). Use `compact` for short spans.
- `Note`: a handwritten note with a hand-drawn arrow (`left`, `right`, `down-left`, `down-right`) pointing at the thing it describes. Place it with `absolute left-full ml-3` or `right-full mr-…` on a `relative` row, and keep it inside its own row so it never sits on a hatched band.
- Copy is short, lowercase and personal ("that's me", "follow me", "start here", "grab a coffee"). One note per row at most.

## Motion

- **Springs.** JS animation uses `motion/react` springs (stiffness ~320–420, damping ~30–34) inside `<MotionConfig reducedMotion="user">`. CSS transforms use `ease-spring` at 500–700ms.
- **Previews** expand from the hovered element's center (`transformOrigin` at the anchor), blur in, and morph width and height between targets instead of closing and reopening. Mouse hover and keyboard `:focus-visible` both open them; Esc closes.
- **Theme switches** are instant: `.theme-switching` disables transitions for one frame.
- **Reduced motion** is respected globally in CSS and per component; content and navigation never depend on animation.

## Content and data

- **`app/site.ts`** holds everything personal: name, tagline, bio (`**bold**` spans), links, X profile. Links take `hidden: true` to stay in config but off the site; render `visibleLinks`, never `site.links` directly.
- **GitHub** profile and contribution graph are fetched at build time (`app/lib/github.ts`) and return `null` on failure, so every consumer needs a fallback. Data refreshes on each deploy.
- **X** details are static in `site.ts` (counts go stale; they carry a "copied on" date), with avatar and banner stored in `public/x/`.
- **Posts** are MDX in `app/blog/posts/`. Frontmatter: `title`, `publishedAt`, `summary`, optional `tag` (label before the date) and `image`. `getExcerpt` in `app/blog/utils.ts` pulls plain-text opening paragraphs for previews.

## Working with references

When the user shares a reference site, take its patterns (layout, spacing, motion idea), not its pixels: no copied copy, logos, illustrations or brand names, and no navbar unless asked. Restyle it into this system's tokens, grid and voice, then verify as in [Making a UI change](#making-a-ui-change).
