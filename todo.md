# ReadStack — TODO Checklist

Use this as your end‑to‑end implementation checklist. Each task is small, integrated, and mapped to the **specs.md** and **prompt_plan.md**.

> Conventions:  
>
> - Mark completed items with `[x]`.  
> - Run `npm run lint && npm test` after each **Step** section.  
> - Keep all code as ES Modules; no build tools.

---

## 0) Prereqs

- [x] Node.js LTS installed
- [x] Git repo initialized
- [x] Decide license (MIT in plan) and author fields

---

## 1) Project Scaffolding

- [x] Create top-level files
  - [x] `index.html` (SPA shell, static title, metadata, script type=module)
  - [x] `README.md`, `LICENSE`
- [x] Create folders
  - [x] `/src` (empty to start)
  - [x] `/styles` (`base.css`, `layout.css`, `components.css`, `themes.css`)
  - [x] `/data` (`manifest.json`, `tags.json`, `/books/`, `/notes/`)
  - [x] `/tests`
- [ ] Initialize `package.json`
  - [ ] Scripts: `"lint"`, `"test"`
  - [ ] Dev deps: `eslint`, `vitest`, `jsdom`
- [ ] Add `.eslintrc.json` (lighter rules)
- [ ] Verify: `npm i && npm run lint && npm test`

---

## 2) HTML & CSS Foundations

- [ ] `index.html` structure
  - [ ] `<meta name="description">`
  - [ ] Open Graph + Twitter Card tags (placeholders)
  - [ ] `<div id="app"></div>`
  - [ ] `<script type="module" src="/src/app.js"></script>`
- [ ] `styles/base.css`
  - [ ] Reset/normalize
  - [ ] System UI font stack
  - [ ] Typography scale (hierarchical)
  - [ ] Color tokens (CSS variables)
  - [ ] `prefers-color-scheme` (auto light/dark)
- [ ] `styles/layout.css`
  - [ ] Page container / content widths
  - [ ] Responsive grid (1-col small, multi-col >=768px)
  - [ ] Consistent card widths
- [ ] `styles/components.css`
  - [ ] Card styles (book row, note card)
  - [ ] Buttons + kebab menu
  - [ ] Tag chips + dropdown panel
  - [ ] Progress bar (track/fill)
  - [ ] Modal card (floating, no overlay)
  - [ ] “Loading…” and error styles
- [ ] `styles/themes.css`
  - [ ] Light/dark tokens synchronized with base
- [ ] Lint/tests

---

## 3) Router

- [ ] `src/router.js`
  - [ ] Hash parsing: `#/`, `#/books/:id`, `#/notes/:slug`
  - [ ] Route matcher (no deps)
  - [ ] `initRouter({ onRouteChange })`, `getRoute()`, `navigateTo()`
  - [ ] 404: `{ name: "not-found" }`
- [ ] `src/app.js` temporary render for each route
- [ ] Tests: `/tests/router.test.js` (happy paths + 404)
- [ ] Lint/tests

---

## 4) Data Layer (Manifest + Fetch Scaffolding)

- [ ] `src/data.js`
  - [ ] `loadManifest()` fetches `/data/manifest.json`
  - [ ] Returns `{ books:[], notes:[] }` structure
  - [ ] Graceful error if missing
  - [ ] `loadAllMetadata(manifest)` placeholder
- [ ] `src/app.js` startup flow
  - [ ] Show “Loading…”
  - [ ] Load manifest, then render main placeholders
- [ ] Tests: `/tests/data.test.js` basic manifest happy path (mock fetch)
- [ ] Lint/tests

---

## 5) Front Matter Parsing

- [ ] In `src/data.js`
  - [ ] `extractFrontMatter(markdownText)`
  - [ ] Regex find `---` (start) to next `---`
  - [ ] Parse simple YAML (scalars, arrays, nested `progress`)
  - [ ] Return `{ attributes, body }` or `{ error }`
- [ ] Tests: valid, malformed, nested progress
- [ ] Lint/tests

---

## 6) Markdown Rendering (Lazy) + Sanitization

- [ ] `src/markdown.js`
  - [ ] `renderMarkdown(mdString)` async
  - [ ] Minimal Markdown support: headings, paragraphs, emphasis, lists
  - [ ] Sanitizer strips script/style/dangerous attrs
  - [ ] Implement lazy path (loaded only when first needed)
- [ ] Tests: headings, paragraphs, list items, sanitization
- [ ] Lint/tests

---

## 7) Load & Normalize Metadata

- [ ] `src/data.js` `loadAllMetadata(manifest)`
  - [ ] Fetch each file in `manifest.books`, `manifest.notes`
  - [ ] Extract front matter + body
  - [ ] **Books**
    - [ ] Compute `percent = Math.round((pagesRead/totalPages) * 100)`
    - [ ] Store: id/title/authors/status/progress/startDate/finishDate/tags/body
  - [ ] **Notes**
    - [ ] Store: id/title/date/summary/tags/body
  - [ ] In-memory session cache (plain JS objects)
- [ ] `src/app.js` calls `loadAllMetadata()` and keeps results
- [ ] Tests: mock fetch book + note; percent computed; keys present
- [ ] Lint/tests

---

## 8) Books List Rendering

- [ ] `src/render-books.js`
  - [ ] `renderBooksList(container, books)`
  - [ ] Row: title + progress bar (% label)
  - [ ] Hover: reveal metadata (authors, dates, tags; **no long summary**)
  - [ ] Click row → `#/books/:id`
  - [ ] Kebab → “Quick view” handler (placeholder)
- [ ] Integrate in `app.js` main route
- [ ] Lint/tests

---

## 9) Notes List Rendering

- [ ] `src/render-notes.js`
  - [ ] `renderNotesList(container, notes)`
  - [ ] Card fields: title, date (en-US), summary, first 200 chars + `…`, tags (≤6)
  - [ ] Buttons: “Read full”, “Quick view”
  - [ ] “Read full” → `#/notes/:slug`
- [ ] Integrate in `app.js` main route
- [ ] Lint/tests

---

## 10) Tags & Filter UI

- [ ] `src/data.js` `loadTags()`
- [ ] `src/ui.js` `renderTagFilter(container, categories, selectedTags, onChange)`
  - [ ] Grouped by category from `tags.json`
  - [ ] Multi-select checkboxes
- [ ] `src/state.js` or simple state holder for `selectedTags`
- [ ] Place dropdown at top of main page
- [ ] Lint/tests

---

## 11) Filtering Logic (OR)

- [ ] `src/data.js` `filterByTags(items, selectedTags)`
  - [ ] Empty selection → passthrough
  - [ ] Non-empty → item.tags ∩ selectedTags ≠ ∅
- [ ] Apply to books and notes in `app.js`
- [ ] Behavior: filters reset on refresh (no persistence or hash params)
- [ ] Tests: empty, single tag, multi-tag OR
- [ ] Lint/tests

---

## 12) Sorting

- [ ] `src/data.js`
  - [ ] `sortBooks(books)`
    - [ ] Group order: Reading → Finished → Unread
    - [ ] Reading: by progress desc
    - [ ] Finished: by finishDate desc
    - [ ] Hide Unread by default (decide: filter out here or earlier)
  - [ ] `sortNotes(notes)`: by latest `date` or `updated` desc
- [ ] Apply before rendering in `app.js`
- [ ] Tests: both sorters
- [ ] Lint/tests

---

## 13) Book Detail Page

- [ ] `renderBookDetail(container, book)` (in `render-books.js` or separate)
  - [ ] Show: title, authors, dates, computed percent, tags
  - [ ] **No long summary**
- [ ] Router integration for `#/books/:id`
- [ ] Missing id → “Not found”
- [ ] Tests: route & not-found
- [ ] Lint/tests

---

## 14) Note Detail Reader Mode

- [ ] `src/note-view.js` `renderNoteDetail(container, note)`
  - [ ] Full Markdown render via `renderMarkdown()`
  - [ ] Minimal reader layout (no header/filters)
- [ ] Router integration for `#/notes/:slug`
- [ ] Missing slug → “Not found”
- [ ] Tests: lookup + not-found
- [ ] Lint/tests

---

## 15) Modals (Quick View, No Overlay)

- [ ] `src/ui.js`
  - [ ] `openModal(node)`, `closeModal()`
  - [ ] Floating card, close button, shadow; **no overlay**
- [ ] Hook Quick View in books and notes
- [ ] Basic focus handling (no trap required)
- [ ] Lint/tests

---

## 16) Loading & Error UX

- [ ] `src/ui.js` components
  - [ ] `renderLoading(container, "Loading...")`
  - [ ] `renderError(container, message)`
- [ ] Use during: manifest load, content fetch, parse errors
- [ ] Error cases:
  - [ ] Manifest missing → “Manifest not found”
  - [ ] File fetch fail → inline error
  - [ ] Malformed YAML → inline error
  - [ ] Unknown route → “Not found”
- [ ] Tests: error branches (mock fetch failures)
- [ ] Lint/tests

---

## 17) Accessibility & Responsive Pass

- [ ] Verify semantic HTML for lists, headings, buttons
- [ ] Ensure focus outlines are visible
- [ ] Check color contrast in light/dark
- [ ] Verify small vs large screen layout
- [ ] Lint/tests

---

## 18) Metadata & Theming

- [ ] `<title>`: ReadStack (static)
- [ ] Meta description finalized
- [ ] OG/Twitter tags set (placeholder image references OK even if not used)
- [ ] `<meta name="theme-color">`
- [ ] Canonical link
- [ ] Verify prefers-color-scheme auto behavior
- [ ] Lint/tests

---

## 19) Content Prep

- [ ] `data/manifest.json` filled with initial paths
- [ ] `data/tags.json` categories populated
- [ ] Create initial sample book `.md` (with front matter & sections)
- [ ] Create initial sample note `.md`
- [ ] Validate front matter parses and renders
- [ ] Lint/tests

---

## 20) Deployment (GitHub Pages)

- [ ] Ensure all asset paths are relative-safe (leading `/` acceptable for Pages root)
- [ ] Create/verify branch and Pages settings
- [ ] Optional: Add minimal CI to run `npm run lint && npm test` on PRs
- [ ] Manual smoke test on live URL

---

## 21) Final QA Checklist

- [ ] Landing route renders “Loading…” then books+notes
- [ ] Tag dropdown filters both lists (OR)
- [ ] Unread books hidden by default
- [ ] Book row hover shows metadata; click goes to detail
- [ ] Note card shows truncation with `…`; “Read full” opens reader
- [ ] Quick view modals open/close (no overlay)
- [ ] 404 route shows inline “Not found”
- [ ] Dark/light auto based on system
- [ ] No console errors during happy path
- [ ] Lint and tests pass

---

## Commands

- [ ] Install: `npm i`
- [ ] Lint: `npm run lint`
- [ ] Test: `npm test`
- [ ] Local static server (optional): `npx http-server .`