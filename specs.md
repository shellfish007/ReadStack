# ReadStack --- Developer Specification

## 1. Overview

**ReadStack** is a single-page personal reading website to display
reading notes and progress.\
It is a **frontend-only SPA** built with vanilla HTML, CSS, and
JavaScript (ES Modules).\
No build step, no backend, and data are stored as static Markdown and
JSON files in the repo.

------------------------------------------------------------------------

## 2. Architecture Overview

-   **Type:** Single Page Application (SPA)
-   **Routing:** Hash-based (`#/books/:id`, `#/notes/:slug`)
-   **Hosting:** GitHub Pages (static)
-   **Scripts:** Vanilla JavaScript with ES Modules
-   **Testing:** Vitest (focus on core logic --- routing, parsing,
    filtering)
-   **Linting:** ESLint (light ruleset --- focus on error catching only)
-   **No Build Step:** Runs natively in browser

### 2.1 Folder Structure

    /
      index.html
      /src
        app.js
        router.js
        state.js
        data.js
        render-books.js
        render-notes.js
        note-view.js
        markdown.js
        ui.js
        accessibility.js
      /styles
        base.css
        layout.css
        components.css
        themes.css
      /data
        manifest.json
        /books/*.md
        /notes/*.md
        tags.json
      /tests
        router.test.js
        data.test.js
        markdown.test.js
      package.json
      .eslintrc.json
      README.md
      LICENSE

------------------------------------------------------------------------

## 3. Data Model

### 3.1 Books (Markdown)

Each book is stored as a `.md` file in `/data/books/`.

``` markdown
---
id: "atomic-habits-clear-2018"
title: "Atomic Habits"
authors: ["James Clear"]
status: "reading"
progress:
  pagesRead: 120
  totalPages: 288
startDate: "2025-09-01"
finishDate: null
tags: ["habits", "psychology", "productivity"]
---

**Short description:**  
Practical strategies for building good habits and breaking bad ones.

**Long summary:**  
This book explores how tiny, incremental changes compound over time...
```

-   **Notes:**
    -   `percent` is computed as `(pagesRead / totalPages) * 100`
    -   No cover or image assets are used
    -   Status is not displayed in UI

### 3.2 Notes (Markdown)

Each note lives under `/data/notes/`.

``` markdown
---
id: "note-2025-atomic-habits"
title: "Tiny Changes, Remarkable Results"
date: "2025-09-15"
summary: "How small habits compound into major long-term change."
tags: ["habits", "psychology"]
---

Main note content...
```

### 3.3 Manifest

Used only for file discovery (since static hosting cannot list
directories).

``` json
{
  "books": ["data/books/AtomicHabits.md", "data/books/DeepWork.md"],
  "notes": ["data/notes/note-2025-atomic-habits.md"]
}
```

### 3.4 Tags

`data/tags.json` defines tag categories.

``` json
{
  "categories": [
    { "name": "Self-Improvement", "tags": ["habits", "motivation", "psychology"] },
    { "name": "Technology", "tags": ["software", "engineering", "ai"] }
  ]
}
```

------------------------------------------------------------------------

## 4. UI / UX Requirements

### 4.1 Layout

-   Single scrollable main page with two sections: Books and Notes.
-   Header scrolls away on scroll.
-   Responsive design:
    -   Single-column on small screens (stacked cards)
    -   Multi-column grid on larger screens

### 4.2 Books Section

-   Displays as linear rows (title + progress bar)
-   Hover reveals all metadata except long summary
-   Click → full page view
-   Kebab menu → modal quick view (floating, no overlay)
-   Static progress (no UI editing)

### 4.3 Notes Section

-   Cards display:
    -   Title
    -   Date (`en-US`, e.g. "Sep 15, 2025")
    -   Summary
    -   First 200 chars of body + ellipsis (`…`)
    -   Tags (max 6)
    -   Buttons: "Read full" and "Quick view"
-   Click → full page note view (reader mode)
-   Modal quick view (floating card, no overlay)

### 4.4 About Section

-   Compact "About" block at bottom of page with short bio and site
    purpose.

### 4.5 Filter Panel

-   Collapsible dropdown panel
-   Multi-select by tags
-   Grouped by tag categories from `tags.json`
-   Filtering uses OR logic (items match any selected tag)
-   Resets on refresh (filters not persisted)
-   Reflects selection visually, but not in hash

### 4.6 Theme

-   Light/dark mode auto-detect via `prefers-color-scheme`
-   "System Clean" base typography (system UI fonts)
-   Hierarchical font sizing (larger titles, smaller metadata)

### 4.7 Accessibility

-   Default browser focus and click handling only
-   No keyboard navigation customizations

### 4.8 Loading and Errors

-   Show `"Loading..."` text during data fetch or parse
-   Inline error message on invalid/missing data
-   No cover images or placeholders
-   Consistent card width across all devices

------------------------------------------------------------------------

## 5. Behavior & Logic

### 5.1 Routing

-   Hash-based:
    -   `#/` --- main page
    -   `#/books/:id` --- book detail
    -   `#/notes/:slug` --- note detail
-   Nonexistent routes → inline "Not found" message
-   Full pages push history entries (Back returns correctly)
-   Modals do **not** alter URL

### 5.2 Data Handling

-   On load:
    -   Fetch and parse `manifest.json`
    -   Fetch each `.md` listed
    -   Extract YAML front matter manually via regex
    -   Parse Markdown body using lightweight custom parser
-   Lazy-load Markdown parser only when needed (on open)
-   Always fetch fresh files (no caching or LocalStorage)

### 5.3 Filtering

-   Filter logic: OR matching for selected tags
-   Applies to both books and notes simultaneously
-   No text search

### 5.4 Rendering Rules

-   Book cards sorted by status:
    -   Reading → Finished → Unread
    -   Within Reading: by progress (desc)
    -   Within Finished: by finishDate (desc)
    -   Unread hidden by default
-   Notes sorted by latest `date` or `updated` descending
-   Ellipsis truncation for note previews

------------------------------------------------------------------------

## 6. Metadata and SEO

-   Title: `ReadStack`
-   Static `<title>` (no per-page updates)
-   Rich metadata:
    -   Favicon `/favicon.png`
    -   `<meta name="description">`
    -   Open Graph tags (`og:title`, `og:description`, `og:image`,
        `og:url`)
    -   Twitter Card tags
    -   `<meta name="theme-color">`
    -   Canonical link
    -   No analytics/tracking

------------------------------------------------------------------------

## 7. Error Handling Strategy

  Scenario                Behavior

----------------------- ----------------------------------------

  Missing Markdown file   Show inline "Not found"
  Malformed YAML          Show inline "Error parsing file"
  Missing fields          Skip field, log to console
  Manifest missing        Render error card "Manifest not found"
  Network failure         Inline error + console log

------------------------------------------------------------------------

## 8. Testing Plan (Vitest)

**Scope:** Core logic only\

- **router.test.js** --- hash parsing, route resolution, fallback
  handling\
- **data.test.js** --- Markdown fetch and YAML front matter extraction\
- **markdown.test.js** --- Markdown-to-HTML correctness\
- **filter.test.js** --- OR filtering, reset behavior, hidden unread
  logic

Mock DOM where necessary using jsdom.

------------------------------------------------------------------------

## 9. Accessibility & Performance

-   Semantic HTML elements
-   Lazy-load Markdown parser and large text files
-   No animations or transitions
-   No external fonts
-   Fast static hosting (GitHub Pages)

------------------------------------------------------------------------

## 10. Summary of Key Constraints

-   **No backend / build process**
-   **Static files only**
-   **Light/dark mode auto-switch**
-   **Hash routing with history**
-   **Static title "ReadStack"**
-   **All data loaded from Markdown + manifest**
-   **Filtering only by tags**
-   **No user interactivity for editing**

------------------------------------------------------------------------

## 11. Deliverables

1.  SPA implementation as specified\
2.  Unit tests (Vitest)\
3.  Linting setup (ESLint)\
4.  Deployment via GitHub Pages\
5.  Documentation (README.md, this specs.md)