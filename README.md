# beyond-copilot

## ReadStack: Setup, Run, Test, Deploy

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
```sh
npm install
```

### Run (Development)
Open `index.html` in your browser using a static server:
```sh
npx http-server .
# or
python3 -m http.server
```
Then visit `http://localhost:8080` (or the port shown).

### Lint
```sh
npm run lint
```

### Test
```sh
npm test
```

### Deploy to GitHub Pages
1. Commit all changes to your main branch.
2. Push to GitHub.
3. In your repo settings, enable GitHub Pages for the root or `/docs` folder.
4. (Optional) Copy all files to `/docs` and push, or use a deploy script.

### Project Structure
- `src/` — All JS modules (SPA, router, data, UI, etc.)
- `styles/` — CSS (tokens, layout, components, themes)
- `data/` — Manifest, tags, and Markdown content
- `tests/` — Vitest unit/integration tests

### Features
- Vanilla JS SPA, hash routing, no build tools
- Responsive, accessible, light/dark theme
- Markdown/YAML parsing, tag filtering, modals
- Inline error/loading UI, robust test coverage

---

For more, see `prompt_plan.md` and `specs.md`.