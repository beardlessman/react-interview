# Frontend Exam

Popular frontend developer interview questions.

---

## HTML and semantics

### Why do we need HTML5 semantic tags?

Semantic tags (`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`) describe meaning, not just appearance. They help screen readers, SEO, and maintainability: document structure is clear without CSS. Non-semantic `div`s remain for purely presentational wrappers.

### How do `article`, `section`, `aside`, and `nav` differ?

- `article` — a self-contained piece (post, news card) that can stand alone.
- `section` — a thematic group within a page/article; usually with a heading.
- `aside` — complementary content (sidebar, callout) related to the main content but not central.
- `nav` — navigation links (menu, table of contents).  
One `main` per page; `header`/`footer` may belong to the page or to sections.

### What is accessibility (a11y) on the frontend?

Making the UI usable for people with visual, motor, hearing, and other impairments. Basics: semantic HTML, contrast, labels for fields and images, keyboard control, predictable focus. ARIA supplements HTML when native semantics are not enough; with correct markup, ARIA is often unnecessary.

### What are ARIA roles and when should you use them?

`role` and `aria-*` attributes tell assistive tech a widget’s role and state (`role="dialog"`, `aria-expanded`, `aria-label`). Rule: prefer native elements (`button`, `a`, `input`); use ARIA only when a custom control is unavoidable. Wrong ARIA is worse than none.

### How do you ensure keyboard accessibility?

Interactive elements must be in the tab order and activatable with Enter/Space. Visible `:focus` / `:focus-visible`, logical DOM order. `tabindex="0"` — include in tab flow; `tabindex="-1"` — programmatic focus; positive `tabindex` is almost always an antipattern. For modals — focus trap and restore focus to the opener.

### How should forms be marked up correctly?

Tie every field to `<label for="id">` or wrap it in `label`. Radio/checkbox groups — `fieldset` + `legend`. Required fields — `required` plus clear error text linked via `aria-describedby`. Don’t rely on color alone; use Constraint Validation API or custom validation with screen-reader-friendly messages.

### How does `<button>` differ from `<a>`?

`a` — navigation (URL, open in new tab). `button` — an action on the page (submit, open modal, toggle) without changing the address. Don’t fake a button with `href="#"` or turn a link into a button: it breaks semantics, SEO, and a11y. Inside a form, `button` defaults to `type="submit"` — set `type="button"` when submit is not intended.

### Which meta tags matter for SEO and sharing?

`title` and `meta name="description"` — search snippet. `meta name="viewport"` — correct mobile rendering. Open Graph / Twitter Card (`og:title`, `og:image`, `og:url`) — social previews. Canonical — canonical URL for duplicates. For SPAs, SSR/prerender or server-side meta matter; otherwise crawlers may see an empty shell.

### Why use `srcset` and `sizes` on `img`?

`srcset` lists image variants with width (`400w`) or density (`2x`) descriptors. `sizes` tells the browser how wide the image will be in the layout at different viewports. The browser picks a suitable file — less mobile bandwidth without losing sharpness on Retina.

### When should you use the `<picture>` element?

When you need different crops/formats, not just scaling: art direction (`media` on `<source>`), WebP/AVIF with JPEG/PNG fallback. Inside `picture` — one `img` as fallback and for a11y (`alt`). `srcset` on `img` is enough when only resolution of the same frame changes.

### Why is the `alt` attribute important?

It briefly describes the image’s content/function for screen readers and when loading fails. Decorative images get `alt=""` so they are skipped. Don’t duplicate nearby text or write “image of…”. For complex diagrams — a longer description nearby or via `aria-describedby`.

### Why set `lang` on `<html>`, and what does DOCTYPE do?

`lang` states the document language: correct screen-reader pronunciation, hyphenation, font selection. DOCTYPE (`<!DOCTYPE html>`) enables standards mode; without it the browser may enter quirks mode with a different layout model — CSS bugs “for no reason.”

### How do block and inline elements differ in HTML/CSS terms?

Block (`div`, `p`, `section`) takes the container width, starts on a new line, accepts width/height/vertical margin. Inline (`span`, `a`, `em`) flows in a line; vertical margin/width often don’t behave as expected. Inline-block is a hybrid. In modern CSS this is mostly `display`, not “tag type,” but tag semantics don’t change with display.

---

## CSS and layout

### What is CSS specificity and how do you calculate it?

Selector weight: inline style > `#id` > `.class` / attributes / pseudo-classes > tags / pseudo-elements. On a tie, the last declaration wins. `!important` breaks the cascade — use sparingly. Practice: short classes, avoid deep chains and id-based styles.

### Explain the CSS box model. How does `content-box` differ from `border-box`?

An element = content + padding + border + margin. With `box-sizing: content-box`, width is content only; padding/border grow the final size. With `border-box`, width includes content+padding+border — easier for layouts. Common global rule: `*, *::before, *::after { box-sizing: border-box; }`.

### What are the main ideas of Flexbox?

One-dimensional layout along a main axis (`flex-direction`). Container: `display: flex`, `justify-content`, `align-items`, `gap`, `flex-wrap`. Items: `flex-grow` / `shrink` / `basis` (often `flex: 1`). Good for toolbars, navbars, aligning a row/column. For two-dimensional page grids, Grid is often better.

### What are the main ideas of CSS Grid?

Two-dimensional grid: rows and columns (`grid-template-columns/rows`), areas (`grid-template-areas`), `gap`, alignment via `justify/align-items` and `place-content`. Place items with `grid-column` / `grid-row`. Great for page layouts; Flex for components inside cells.

### When Flex and when Grid?

Flex — flow in one direction, “as many items as we have, stretch them.” Grid — explicit 2D placement, aligning rows and columns together. Often combined: Grid for page layout, Flex inside cards/toolbars. There is no universal “Flex only” or “Grid only.”

### What are the `position` values and typical use cases?

- `static` — normal flow.
- `relative` — offset from itself; anchor for absolute children.
- `absolute` — relative to the nearest positioned ancestor; out of normal flow.
- `fixed` — relative to the viewport (caveat: transformed ancestors).
- `sticky` — relative/fixed hybrid while scrolling within the parent.

### How do `z-index` and stacking contexts work?

`z-index` is compared only inside one stacking context. A new context is created by, e.g.: positioned + z-index, `opacity < 1`, `transform`, `filter`, `isolation`, flex/grid children with z-index. A high z-index in a “lower” context won’t cover an “upper” context. Debug by finding who created the context.

### What is BEM?

A naming methodology: Block (`button`), Element (`button__icon`), Modifier (`button--primary`). Avoids nested selectors and global class clashes. Downsides: long names, team discipline. Neighbors/alternatives: CSS Modules, scoped CSS, utility-first (Tailwind).

### How does adaptive layout differ from responsive?

Responsive — fluid adaptation via fluid widths, `%`/`fr`/`minmax`, media/container queries. Adaptive — a set of fixed layouts at breakpoints (sometimes separate templates). In practice they mix: responsive base + adaptive tweaks at key widths. Mobile-first: narrow screen first, then `min-width`.

### How do `rem`, `em`, `vw`/`vh`, and `%` differ?

- `rem` — from the root (`html`); good for typography and spacing.
- `em` — from the parent/element font size; compounds when nested.
- `%` — relative to the parent (for width — containing block width).
- `vw`/`vh` — viewport fraction; beware mobile UI chrome (`dvh`/`svh`).  
Don’t mix units without a system (design tokens / scales).

### How do CSS transitions differ from animations?

Transition — smooth change when a property changes (hover, class). Animation (`@keyframes`) — multi-step sequence; can loop; doesn’t require an external “end state” change. For performance, animate `transform` and `opacity`; avoid frequent layout-property changes.

### What are CSS custom properties (variables)?

Properties like `--color-bg: #fff` on any node, read via `var(--color-bg)`. They cascade and change at runtime (themes, breakpoints). Unlike preprocessor variables, they live in the browser. Fallback: `var(--x, #ccc)`. A solid base for design tokens.

### What is Critical CSS?

Minimal CSS for the first screen (above the fold), inlined or loaded with high priority to speed First Paint / LCP. The rest loads async/deferred. Downsides: build complexity, duplication risk, FOUC on mistakes. Worth it on landing pages and heavy CSS bundles.

### How does reflow differ from repaint?

Reflow (layout) — recalculating geometry (size, font, DOM structure changes). Repaint (paint) — redrawing pixels without geometry change (color, shadow). Composite — GPU layers (`transform`/`opacity`). Reflow is costlier; batch DOM reads/writes and avoid forcing synchronous layout in loops.

### What are media queries and the mobile-first approach?

Media queries apply styles by conditions (`min-width`, `prefers-color-scheme`, `hover`). Mobile-first: base styles for narrow screens, then extend with `min-width`. Container queries (`@container`) react to the parent size — better for reusable components than viewport-only rules.

---

## Browser and Web APIs

### How does the browser rendering pipeline work at a high level?

HTML → DOM, CSS → CSSOM → Render Tree → Layout (geometry) → Paint → Composite. JS can mutate DOM/styles and re-trigger the pipeline. Knowing the stages explains why heavy JS, large images, and layout thrashing hurt performance.

### How do cookies, `localStorage`, `sessionStorage`, and IndexedDB differ?

- Cookie — small; sent with requests (unless `HttpOnly` hides them from JS); flags `Secure`, `SameSite`.
- `localStorage` — string key-value, survives sessions, sync API, ~5MB.
- `sessionStorage` — like local, but per tab until close.
- IndexedDB — large structured browser DB, async, for offline/data cache.  
Don’t store tokens in XSS-reachable storage without protection.

### When should you choose IndexedDB over `localStorage`?

Large volumes, indexes, binary data, complex queries, work without blocking the main thread (via async/workers). `localStorage` — simple settings and tiny flags. Offline sync layers often sit on top of IndexedDB (e.g. in PWAs).

### What can the History API do?

`pushState` / `replaceState` change the URL without reload; `popstate` handles back/forward. Foundation of SPA client routing. Cannot set cross-origin URLs. State must be cloneable. For full UX, consider scroll restoration and keeping the real URL shareable.

### What is IntersectionObserver for?

Asynchronously reports when an element enters/leaves the viewport (or a root). Typical uses: lazy-load images/blocks, infinite scroll, view analytics, start animations on appear. Easier and more efficient than a scroll listener with manual `getBoundingClientRect` math.

### How do WebSockets differ from Server-Sent Events (SSE)?

WebSocket — bidirectional full duplex over one connection; good for chats, collaboration, games. SSE — one-way server→client stream over HTTP; simpler reconnection and proxy friendliness; good for event/notification feeds. For rare requests, plain HTTP/polling often suffices.

### What is a Service Worker at a high level?

A background script between the page and the network: static/API caching, offline, push (with permission). Lifecycle: install → activate → fetch. SW bugs are hard to debug and can break updates — need a cache strategy (cache-first / network-first) and versioning.

### Why use `requestAnimationFrame`?

Schedules a callback before the next paint (~60fps). Better for animations and reading layout before paint than `setInterval`. Browsers may throttle in the background. Often paired with `cancelAnimationFrame`.

### What are Web Workers and why do frontends use them?

Separate threads without DOM access: heavy work (parsing, crypto, data processing) won’t block the UI. Communicate via `postMessage` (structured clone). Dedicated / Shared / Service Worker serve different jobs. They don’t “magic speed”; they unload the main thread.

### What is the Page Visibility API?

`document.visibilityState` / `visibilitychange` show whether the tab is visible. Pause video, stop polling, lower timer frequency in the background — saves battery and bandwidth. Don’t confuse with window focus: a tab can be visible but unfocused.

### Why use `navigator.sendBeacon`?

Reliable small analytics payloads on leave/unload: the browser queues the request and doesn’t block unload as aggressively as sync XHR. Usually POST, no response reading. Critical business operations still need other server confirmation.

### What are `matchMedia` and `prefers-reduced-motion`?

`window.matchMedia('(max-width: …)')` — JS counterpart of a media query with a `change` listener. `prefers-reduced-motion: reduce` — the user wants fewer animations; respect it (disable parallax/autoplay) as part of a11y and UX.

### When is MutationObserver useful in practice?

Observes DOM changes (children, attributes, text) without constant polling. Cases: third-party widgets, reacting to injected scripts, syntax highlighting. Not a substitute for data-driven UI in a framework; overuse easily burns main-thread time.

---

## Network, performance, security

### REST vs GraphQL from a frontend perspective?

REST — resources and HTTP methods; URL caching is simpler; multiple endpoints per screens. GraphQL — one endpoint; the client asks for needed fields (less over/under-fetching); caching and errors are harder; needs clients (Apollo/urql) or manual fetch. Choose by API contract and team, not hype.

### How do the browser and CDN cache static assets? Role of `Cache-Control`?

`Cache-Control` (`max-age`, `no-store`, `private`, `immutable`) and validators (`ETag`, `Last-Modified`) decide disk/memory cache use. A CDN caches closer to users and offloads origin. Hashed bundles — long `max-age` + `immutable`; HTML often short cache or revalidate.

### What is Core Web Vitals: LCP?

Largest Contentful Paint — time to render the largest visible content (often hero image or heading). Improve with image optimization, LCP resource priority (`fetchpriority`, preload), fast TTFB, and not blocking render with heavy CSS/JS.

### What is INP?

Interaction to Next Paint — responsiveness to click/tap/key: delay until the next paint. Hurt by long main-thread tasks, heavy handlers, excess re-renders. Fix by splitting work, `scheduler`/`requestIdleCallback`, careful memoization, less sync work in handlers.

### What is CLS and how do you reduce it?

Cumulative Layout Shift — visual stability. Shifts from images/ads/fonts without reserved space, late banner insertion. Fixes: width/height or aspect-ratio on media, same-size skeletons, `font-display`, and stable UI slots.

### What are lazy loading and code splitting from a bundler view?

Lazy load — deferred loading (images `loading="lazy"`, routes/`import()`). Code splitting — the bundler cuts chunks; dynamic `import()` creates a separate file loaded on demand. Goal — smaller initial JS and faster TTI/INP. Don’t over-split (request waterfalls).

### What is XSS and how do you defend on the frontend?

Cross-Site Scripting — injecting hostile JS into the page. Avoid `innerHTML`/`dangerouslySetInnerHTML` with untrusted data, escape output, use Trusted Types where possible, HttpOnly session cookies, CSP. HTML sanitization — carefully, with proven libraries.

### What is CSRF?

Cross-Site Request Forgery — the victim’s browser sends cookies to your site from another page. Defense: SameSite cookies, CSRF tokens, don’t rely on cookie sessions for state-changing APIs without Origin/Referer checks, prefer Authorization headers for SPA+API. GET must not change state.

### What is Content Security Policy (CSP)?

An HTTP header/meta whitelist for scripts, styles, images, connect sources. Reduces XSS impact (`script-src`, no inline without nonce/hash). Strict CSP needs build discipline (nonces on inlines). `report-uri`/`report-to` help monitor violations.

### Which CORS pitfalls matter to frontend developers?

The browser blocks cross-origin responses without `Access-Control-Allow-*`. With credentials (cookies), `Allow-Origin: *` is invalid — need a concrete origin. Preflight (OPTIONS) for “non-simple” requests. DevTools CORS errors often hide the real status; fix on server/proxy, not with fetch “magic.”

### What is mixed content?

An HTTPS page requests an HTTP resource: browsers block active mixed content (scripts) and warn on passive (images). Breaks icons/APIs after moving to HTTPS. Fix: HTTPS-only URLs, HSTS, relative/`https://` links, audit third-party widgets.

### How do preload, prefetch, and preconnect differ?

- `preconnect` / `dns-prefetch` — warm up a connection to an origin.
- `preload` — critical current-screen resource (font, LCP image) at high priority.
- `prefetch` — likely next resource at low priority.  
Mistakes: preloading everything wastes bandwidth; unused preload triggers Lighthouse warnings.

### How do you optimize font loading?

Subset glyphs, modern formats (woff2), `font-display: swap/optional`, preload the critical file, self-host vs CDN tradeoffs. Avoid long invisible text (FOIT) and metric jumps (CLS) — reserve line-height/metrics or use size-adjust.

### What is a network waterfall and how do you read it in DevTools?

The Network panel chain: length = duration, offset = waiting/queueing. Look for blocking CSS/JS, late LCP, dependency chains (`import` after `import`). Goal — parallelize critical work, defer the rest, cut TTFB and critical request count.

---

## Tools, testing, architecture

### How does Webpack differ from Vite?

Webpack — mature bundler with a huge ecosystem; dev also goes through the bundle (slower on large apps). Vite serves native ESM in dev + esbuild/SWC for dependency prebundling (fast HMR); production uses Rollup/Rolldown. Vite is easier to start; Webpack is more flexible for legacy and custom pipelines.

### npm vs yarn vs pnpm?

All install packages from a registry. npm — Node default. Yarn (classic/berry) — alternative lockfile/UX. pnpm — content-addressable store and strict `node_modules` (no phantom deps), disk-efficient in monorepos. Important: one manager per repo + lockfile in git.

### What is tree shaking?

Removing unused ESM exports at bundle time. Needs `import`/`export`, side-effects-free packages (`sideEffects` in package.json), production mode. CommonJS shakes poorly. Prefer precise imports from large libraries when the package supports it.

### Why are source maps useful?

They map minified/transpiled code back to sources in DevTools and error trackers (Sentry). In production, maps are often uploaded to the error service without public exposure. Without maps, production stack traces are nearly useless.

### How do unit, integration, and e2e tests differ?

- Unit — pure function/hook/module in isolation, fast.
- Integration — several modules together (component + router/store), Testing Library.
- E2E — real browser and user flow (Playwright/Cypress), slow and brittle.  
Pyramid: many unit, fewer integration, few e2e on critical flows.

### Jest vs Vitest for frontend?

Jest — de facto standard, rich ecosystem. Vitest — Jest-compatible API, built for Vite (faster, native ESM). Choice often follows the bundler. Both: mocks, snapshots (carefully), coverage. For DOM — jsdom/happy-dom.

### What are Testing Library principles?

Test like a user: roles, text, labels (`getByRole`, `getByLabelText`), not classes or implementation details. Prefer `user-event` over low-level fireEvent when possible. Avoid “snapshot the whole tree” tests. Goal — confidence when refactoring UI.

### Cypress vs Playwright?

Both are browser e2e tools. Playwright — multi-browser out of the box, strong automation, traces, CI-friendly. Cypress — excellent DX and time-travel; historically stronger in one browser at a time (ecosystem growing). Choose by team, CI, and cross-browser needs.

### What should you know about CI for frontend?

On PRs: lockfile install, lint, typecheck, unit/integration, build, sometimes e2e and Lighthouse. Cache `node_modules`/store, build artifacts. Preview deploys (Vercel/Netlify/Chromatic) speed UI review. Red CI blocks merge — keep tests stable.

### What are feature flags?

Feature toggles without redeploy: by user, percentage, environment. Enable canary/gradual rollout and kill switches. On the frontend — config from backend or a service (LaunchDarkly and similar); don’t hide secret logic behind a client-only flag, and remove dead flags.

### What is a monorepo in brief?

One repository with several packages/apps (apps + shared UI). Tools: pnpm workspaces, Nx, Turborepo. Pros: atomic shared-code changes, unified CI. Cons: package-boundary complexity and CI time without good cache/affected builds.

### What are microfrontends in brief?

Splitting UI into independently deployable pieces (Module Federation, iframes, web components, separate SPAs on paths). Pros — team autonomy. Cons — dependency duplication, UX/version consistency, routing and shared auth complexity. Worth it at real org scale, not as a checkbox.

### What is a design system on the frontend?

A set of UI components, tokens (color, type, spacing), a11y rules, and docs (Storybook). Goal — consistency and speed. Version the package, manage breaking changes, stay in sync with design. Not just a “button library,” but a process for adopting patterns.

### What does a good Figma handoff and task estimate look like?

Designer delivers specs: spacing, states (hover/disabled/error), breakpoints, assets. Developer clarifies edge cases, a11y, API data. Estimate: break down (layout, logic, tests, risks), buffer for unknowns, state assumptions. A range plus questions beats one “confident” number without analysis.

### Why Storybook / visual regression?

Storybook — isolated component states for development and review. Visual regressions (Chromatic, Playwright screenshots) catch accidental CSS breaks. They don’t replace logic tests, but cover the “looks as intended” layer between design and production.
