// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { getRoute } from '../src/router.js';

// Integration test for book detail route handling in app.js

globalThis.fetch = vi.fn(async (url) => {
  if (url.endsWith('manifest.json')) {
    return { ok: true, json: async () => ({ books: ['data/books/b1.md'], notes: [] }) };
  }
  if (url.endsWith('b1.md')) {
    return { ok: true, text: async () => (
      `---\ntitle: Book 1\nauthors: [A, B]\nstartDate: 2022-01-01\nfinishDate: 2022-02-01\ntags: [t1, t2]\nprogress: {\n  pagesRead: 100\n  totalPages: 100\n}\n---\nBody`)
    };
  }
  if (url.endsWith('tags.json')) {
    return { ok: true, json: async () => ({ categories: [] }) };
  }
  return { ok: false };
});

describe('Book detail route integration', () => {
  it('renders book detail for valid id', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    // Dynamically import app.js to trigger startup
    await import('../src/app.js');
    window.location.hash = '#/books/b1';
    // Wait for rendering
    await new Promise(r => setTimeout(r, 100));
    const app = document.getElementById('app');
    expect(app.innerHTML).toMatch('Book 1');
    expect(app.innerHTML).toMatch('Authors');
    expect(app.innerHTML).toMatch('2022-01-01');
    expect(app.innerHTML).toMatch('2022-02-01');
    expect(app.innerHTML).toMatch('100%');
    expect(app.innerHTML).toMatch('t1, t2');
  });
  it('shows Not found for missing id', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import('../src/app.js');
    window.location.hash = '#/books/doesnotexist';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await new Promise(r => setTimeout(r, 200));
    const app = document.getElementById('app');
    // Accept error-block div or fallback to textContent
    const errorDiv = app.querySelector('.error-block');
    if (errorDiv) {
      expect(errorDiv.textContent.trim()).toBe('Not found');
    } else {
      const text = app.textContent.trim() || app.innerHTML.trim();
      expect(text).toBe('Not found');
    }
  });
});
