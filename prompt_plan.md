# ReadStack — Implementation Blueprint and Incremental Prompt Plan

This document provides:

1) A **detailed build blueprint** (systematic plan).  
2) An **iterative work-breakdown** refined into right-sized steps.  
3) A **series of prompts** for a code-generation LLM. Each prompt builds on prior steps, avoids dead code, and ends with lint + test verification.

The plan aligns with the **specs.md** requirements (vanilla JS, ES Modules, SPA with hash routing, Markdown data, client-side YAML parsing, no images, GitHub Pages, ESLint + Vitest, responsive + accessible by default).

---

## 1) Detailed, Step-by-Step Blueprint

### 1.1 Project Scaffolding

- Create repo with base files: `index.html`, `/src`, `/styles`, `/data`, `/tests`.
- Add `package.json` with `eslint`, `vitest`, `jsdom`, and test/lint scripts.
- Add minimal `.eslintrc.json` (lighter rules).
- Add base CSS files with tokens and responsive grid; light/dark via `prefers-color-scheme`.
- Prepare `data/manifest.json`, `data/tags.json`, and sample Markdown in `data/books/` and `data/notes/`.

### 1.2 Core App Structure

- `src/app.js`: Bootstraps app, mounts UI, coordinates startup (manifest load → data load → initial render).
- `src/router.js`: Hash router supporting `#/`, `#/books/:id`, `#/notes/:slug` and 404 fallback. History integration for full pages.
- `src/state.js`: Holds UI state (selected tags, modal open/closed) and exposes getters/setters and events.
- `src/data.js`: Fetch and parse manifest, then fetch+parse each Markdown file. Exposes pure functions and caches in memory only for session.
- `src/markdown.js`: Lazy-load parser functions; implement minimal, safe Markdown to HTML (using DOMPurify or custom sanitizer if desired) and custom YAML front matter extractor (regex-based).
- `src/render-books.js`: Renders list (rows with title+progress), hover metadata reveal, detail view (no long summary), and modal quick view (no overlay).
- `src/render-notes.js`: Renders note list (title/date/summary/snippet/tags/buttons), and note preview truncation logic.
- `src/note-view.js`: Standalone “reader mode” rendering for full note page.
- `src/ui.js`: Reusable DOM utilities (create element helpers, kebab menu, tag chips, dropdown, skeleton “Loading…” block).
- `src/accessibility.js`: Minimal focus management helpers where needed (close modal on Escape if we later decide; default behavior otherwise).

### 1.3 Data & Parsing

- **Manifest**: `{ "books": [...paths], "notes": [...paths] }`.
- **Front matter**: parse YAML between leading `---` … `---` using regex; convert simple scalars/arrays; validate required keys.
- **Books**: compute `percent = Math.round((pagesRead / totalPages) * 100)` (guard against divide-by-zero).
- **Notes**: capture `title`, `date`, `summary`, `tags`, and the Markdown body.
- Error handling: Return structured errors to renderer; render inline error messages.

### 1.4 Filtering & Sorting

- Tags: load `tags.json` for grouped dropdown; allow multi-select (OR logic).
- Books: sort by status group (Reading → Finished → Unread), then by progress desc (Reading), finishDate desc (Finished); hide Unread by default.
- Notes: sort by last update/date desc.
- Filters apply to both lists; reset on refresh (no persistence).

### 1.5 Routing & Views

- Main page `#/`: shows filter dropdown + Books + Notes sections.
- Book detail `#/books/:id`: shows metadata only (no long summary).
- Note detail `#/notes/:slug`: reader mode (full Markdown rendering, minimal chrome).
- Nonexistent routes → inline “Not found” message.
- Modals don’t impact URL; full pages push history entries.

### 1.5.1 Progressive Enhancement

- Show “Loading…” text while fetching/processing.
- Lazy-load markdown parser only when opening detail or modal views for the first time.

### 1.6 Styling

- System UI fonts; hierarchical sizes; consistent card widths; no images.
- Light/dark automatic via CSS media query.
- Cards/rows minimalist; hover reveal for book metadata; modal is floating card without overlay.

### 1.7 Testing & Linting

- **Vitest**: focus on core logic (router parsing, front matter parsing, filter logic, sort logic).
- **ESLint**: lighter config; run on each step.
- CI (optional later): GitHub Actions to run lint + test.

---

## 2) Iterative Breakdown (Refined to Right-Sized Steps)

### 2.1 First Pass Chunks

1. Project bootstrap (files, npm, scripts, eslint, vitest).
2. Basic HTML skeleton and CSS tokens.
3. Hash router with route parsing + 404.
4. Manifest loader + data fetch scaffolding.
5. YAML front matter parser (regex) + safety.
6. Markdown renderer (lazy-loaded) + sanitizer.
7. Data assembly: books + notes with computed fields.
8. Books list rendering (rows, hover metadata, progress bar).
9. Notes list rendering (cards, snippet truncation, buttons).
10. Tag dropdown (grouped, multi-select OR).
11. Apply filters across books/notes.
12. Book detail page.
13. Note detail reader view.
14. Modals (book quick view, note quick view) without overlay.
15. Error handling + “Loading…” UI.
16. Final accessibility & responsive polish.
17. Tests for core logic; wire scripts to npm.
18. Final pass: deployment prep (GitHub Pages).

### 2.2 Second Pass — Smaller Steps

- (1) → 1a npm init, 1b eslint, 1c vitest, 1d scripts, 1e folder structure.
- (3) → 3a parse hash, 3b route matchers, 3c 404 renderer, 3d history behavior tests.
- (5) → 5a extract block, 5b YAML lines → object, 5c data typing/validation, 5d unit tests.
- (6) → 6a lazy module boundary, 6b minimal Markdown (headings, paragraphs, lists), 6c sanitize, 6d unit tests.
- (8) → 8a render container, 8b row component, 8c progress bar, 8d hover metadata.
- (10) → 10a fetch tags.json, 10b dropdown UI, 10c multi-select state, 10d visual grouping.
- (11) → 11a OR filter fn, 11b apply to views, 11c reset-on-refresh behavior.
- (12) → 12a route → load book, 12b detail template, 12c navigation back.
- (13) → 13a route → load note, 13b full render, 13c code block/inline emphasis (if any).
- (14) → 14a modal UI shell, 14b open/close controls, 14c floating card style.
- (15) → 15a loading msg component, 15b inline error component, 15c data fetch failure paths.

### 2.3 Third Pass — Right-Sized Micro-Steps

- Each micro-step results in integrated, working code with tests/lint green.
- No dangling files or dead code; prompts ensure wiring.

---

## 3) Prompts for a Code-Generation LLM

> **Instructions**  
>
> - Each prompt is standalone and cumulative.  
> - After completing a prompt, **run `npm run lint` and `npm test`**.  
> - Keep code minimal and production-ready; avoid adding unused files.  
> - Use ES Modules. No build tools.  
> - Follow specs.md choices strictly.

### Prompt 1 — Initialize Project Scaffolding

```text
Create the base project files and npm config for "ReadStack".

1) Files & folders:
- index.html
- /src (empty)
- /styles (empty)
- /data (with empty manifest.json, tags.json)
- /tests (empty)
- package.json
- .eslintrc.json
- README.md
- LICENSE (MIT)

2) package.json:
- scripts: 
  - "lint": "eslint ."
  - "test": "vitest --run"
- devDependencies: eslint, vitest, jsdom

3) .eslintrc.json:
- env: browser, es2021, node, jest: false
- extends: ["eslint:recommended"]
- parserOptions: { ecmaVersion: "latest", sourceType: "module" }
- rules: { "no-unused-vars": "warn", "no-undef": "error" }

4) index.html:
- HTML5 boilerplate
- Static <title> ReadStack
- Meta description
- OG + Twitter meta tags (placeholders)
- Link to styles/base.css, styles/layout.css, styles/components.css, styles/themes.css
- <div id="app"></div>
- <script type="module" src="/src/app.js"></script>

5) Create empty files:
- /styles/base.css, /styles/layout.css, /styles/components.css, /styles/themes.css
- /src/app.js

Finally, run: npm i, npm run lint, npm test (should pass with zero tests). Do not add extra files.
```

### Prompt 2 — Minimal CSS Tokens & Responsive Foundations

```text
Populate CSS files with minimal, production-ready styles:

- base.css: CSS reset, system UI font stack, color tokens, typography scale (hierarchical), prefers-color-scheme support.
- layout.css: container max-width, grid helpers (single-column on small screens, multi-column at >=768px), consistent card width.
- components.css: basic card style, button, chip, kebab, progress bar track/fill, modal card (no overlay), hover metadata block.
- themes.css: light/dark tokens using media queries.

No images; ensure readability and sufficient contrast. Keep styles modest and consistent.
```

### Prompt 3 — Router Skeleton with Hash Parsing and 404

```text
Add /src/router.js and wire it into app.js.

Requirements:
- Routes: "#/", "#/books/:id", "#/notes/:slug".
- Export: initRouter({ onRouteChange }), getRoute(), navigateTo(hash).
- Implement simple matcher (no deps): parse location.hash and return { name, params }.
- 404: if no match, return { name: "not-found" }.
- app.js: initialize router and render a placeholder for each route:

  - "#/": H1 "ReadStack", placeholders for Books and Notes sections.
  - "#/books/:id": text "Book detail for :id".
  - "#/notes/:slug": text "Note detail for :slug".
  - "not-found": text "Not found".

Add a unit test /tests/router.test.js (Vitest) to cover route parsing and 404.
Run lint and tests.
```

### Prompt 4 — Manifest Loader & Data Module Scaffolding

```text
Create /src/data.js that exports:
- loadManifest(): fetch '/data/manifest.json' and return { books: [], notes: [] } structure; render inline error if missing.
- loadAllMetadata(manifest): for now, return empty arrays (will implement later).

Update app.js to:
- On startup, show "Loading..." text.
- Call loadManifest(), then render main page with empty Books/Notes sections.
- Handle not-found route with inline message.

Add /tests/data.test.js with a stub test for loadManifest() happy path (mock fetch).
Run lint and tests.
```

### Prompt 5 — YAML Front Matter Extractor (Regex) with Validation

```text
In /src/data.js add a pure function:
- extractFrontMatter(markdownText): returns { attributes, body }.
  - Find leading '---' ... '---' block; parse simple YAML (keys, arrays, scalars, nested 'progress' {pagesRead,totalPages}).
  - Be robust to whitespace; ignore unknown keys.
  - If malformed, return { error: 'Malformed front matter' }.

Add unit tests in /tests/data.test.js for:
- Correct extraction on valid input.
- Malformed cases -> error.
- Proper extraction of nested progress.

Run lint and tests.
```

### Prompt 6 — Markdown Renderer (Lazy) + Basic Sanitization

```text
Create /src/markdown.js with lazy loading:
- export async function renderMarkdown(mdString): returns sanitized HTML string.
- For now, implement a minimal Markdown parser (headings '#', paragraphs, bold/italic, lists). Keep it simple and safe.
- Add a trivial sanitizer that strips script/style and dangerous attributes.

Wire into app.js but do not call yet. Add /tests/markdown.test.js to verify rendering of headings, paragraphs, list items, and sanitization.
Run lint and tests.
```

### Prompt 7 — Implement Metadata Loading from Manifest (Books & Notes)

```text
In /src/data.js:
- Implement loadAllMetadata(manifest):
  - For each path in manifest.books and manifest.notes, fetch file text.
  - Use extractFrontMatter() to parse metadata + body.
  - For books: compute percent = Math.round((pagesRead/totalPages)*100) when valid; store fields and retain body for long summary.
  - For notes: store title, date, summary, tags, body.

Return { books: [...], notes: [...] }.

Update app.js to call loadAllMetadata() after loadManifest() and store results in memory.
Add tests that mock fetch of a book and a note markdown and assert metadata fields and computed percent.
Run lint and tests.
```

### Prompt 8 — Books List Rendering (Rows with Hover Metadata & Progress)

```text
Create /src/render-books.js with:
- renderBooksList(container, books): Renders rows (title + progress bar).
- Each row: on hover, show metadata (authors, start/finish dates, tags; exclude long summary).
- Clicking row navigates to "#/books/:id".
- Provide a small kebab menu button per row that opens a modal quick view (do not implement modal yet; just a placeholder handler).

Update app.js: on main route, call renderBooksList().
Add minimal CSS for rows and progress in components.css if needed.
Run lint and tests (add a DOM render test if desired, or skip for now since focus is core logic).
```

### Prompt 9 — Notes List Rendering (Cards with Snippet & Buttons)

```text
Create /src/render-notes.js with:
- renderNotesList(container, notes): Renders cards showing title, date (en-US), summary, first 200 chars of body + ellipsis, tags (up to 6), and two buttons: "Read full" and "Quick view".
- "Read full" navigates to "#/notes/:slug".
- "Quick view" will open a modal (not yet implemented).

Wire into app.js main route rendering after books list.
Run lint and tests.
```

### Prompt 10 — Tag Categories & Dropdown UI

```text
Add tags loading to /src/data.js:
- loadTags(): fetch '/data/tags.json' returning { categories: [ { name, tags[] } ] }.

Create tag filter UI in /src/ui.js:
- renderTagFilter(container, categories, selectedTags, onChange). Multi-select with grouped headings; checkboxes for tags.

Update app.js:
- Load tags alongside manifest.
- Manage selectedTags in simple module-scoped state (or a tiny /src/state.js with subscribe/notify).
- Display dropdown at top of main page.

Run lint and tests (pure logic tests for selectedTags behavior).
```

### Prompt 11 — Apply OR Tag Filtering to Books & Notes

```text
Implement a pure function filterByTags(items, selectedTags) in /src/data.js:
- If selectedTags empty -> return all.
- Else return items where item.tags intersects selectedTags.

Update rendering:
- On tag change -> re-render both books and notes with filtered collections.
- Books: also hide Unread by default even after filtering.

Add unit test for filterByTags() including empty selection, single tag, multi-tag OR behavior.
Run lint and tests.
```

### Prompt 12 — Sorting Logic

```text
Add pure sorters to /src/data.js:
- sortBooks(books): Reading -> Finished -> Unread; within Reading: progress desc; within Finished: finishDate desc; hide Unread by default (return two arrays or filtered list; choose clean approach).
- sortNotes(notes): latest date/updated desc.

Apply the sorters before rendering in app.js.
Add tests for both sorters.
Run lint and tests.
```

### Prompt 13 — Book Detail Page

```text
Add to /src/render-books.js:
- renderBookDetail(container, book): Renders static metadata (title, authors, dates, computed percent, tags). Exclude long summary.

Update router handling in app.js:
- For "#/books/:id" route, find book by id (filename-based ID). If not found -> "Not found". Otherwise call renderBookDetail().

Add tests: route to detail, missing id -> not found.
Run lint and tests.
```

### Prompt 14 — Note Detail Reader Mode

```text
Create /src/note-view.js:
- renderNoteDetail(container, note): Uses renderMarkdown(note.body) to produce full HTML; minimal reader layout (no header/filters).

Update router handling in app.js:
- For "#/notes/:slug", find note by slug; if not found -> "Not found"; else renderNoteDetail().
- Ensure markdown.js is lazy-loaded on first render.

Add tests: ensure note lookup and not found handling.
Run lint and tests.
```

### Prompt 15 — Modal Quick Views (No Overlay)

```text
Add modal helpers to /src/ui.js:
- openModal(contentNode) and closeModal(); modal is a floating card with shadow; no background overlay; close button.
- Trap focus minimally if possible; otherwise rely on default browser handling (as per spec).

Hook into render-books.js and render-notes.js:
- "Quick view" shows metadata (book) or a partial markdown render (note) inside the modal.

Run lint and tests (unit test modal open/close events only if feasible).
```

### Prompt 16 — Loading & Inline Error Components

```text
Add to /src/ui.js:
- renderLoading(container, text="Loading...")
- renderError(container, message)

Update app.js and data flows:
- Show loading while fetching manifest and content.
- On any fetch or parse error, show inline error using renderError().

Add tests for error branch (mock fetch failure).
Run lint and tests.
```

### Prompt 17 — Polish & Accessibility Pass

```text
Adjust components and styles for:
- Keyboard focus outlines visible.
- Sufficient color contrast in both light/dark.
- Ensure modal is reachable by keyboard and closeable via explicit close button.

No custom keybindings required. Validate responsive layout and consistent card width.

Run lint and tests.
```

### Prompt 18 — Final Wire-Up & Cleanup

```text
Do a full pass:
- Remove unused code/exports.
- Ensure all imports are used and paths correct.
- Confirm lazy-load boundaries for markdown parser.
- Validate routes and history behavior.

Update README with setup/run/test/deploy instructions (GitHub Pages).

Run npm run lint and npm test.
```

---

## 4) Verification Loop After Each Prompt

- **Static analysis**: `npm run lint`
- **Unit tests**: `npm test` (Vitest)
- **Manual check** (optional locally): open `index.html` via a simple static server (e.g., `npx http-server`) to verify hash routing.

---

## 5) Notes on Best Practices Embedded in Prompts

- ES Modules and pure functions where possible for testability.
- Data module returns plain objects; renderers are side-effectful but small and focused.
- Sorting/filtering remain pure and unit-tested.
- Lazy-loading of Markdown renderer to reduce boot cost.
- “Loading…” and inline error UX for reliability.
- No dead code; every addition is wired into app.js and/or tests immediately.