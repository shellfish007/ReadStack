// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';

globalThis.fetch = vi.fn(async (url) => {
  if (url.endsWith('manifest.json')) {
    return { ok: true, json: async () => ({ books: [], notes: ['data/notes/n1.md'] }) };
  }
  if (url.endsWith('n1.md')) {
    return { ok: true, text: async () => (
      `---\ntitle: Note 1\ndate: 2025-10-14\nsummary: Test\ntags: [t1, t2]\n---\n# Heading\nBody`)
    };
  }
  if (url.endsWith('tags.json')) {
    return { ok: true, json: async () => ({ categories: [] }) };
  }
  return { ok: false };
});

describe('Note detail route integration', () => {
  it('renders note detail for valid slug', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import('../src/app.js');
    window.location.hash = '#/notes/n1';
    // Wait for rendering
    await new Promise(r => setTimeout(r, 200));
    const app = document.getElementById('app');
    expect(app.innerHTML).toMatch('Note 1');
    expect(app.innerHTML).toMatch('2025');
    expect(app.innerHTML).toMatch('Heading');
    expect(app.innerHTML).toMatch('Body');
  });
  it('shows Not found for missing slug', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import('../src/app.js');
    window.location.hash = '#/notes/doesnotexist';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await new Promise(r => setTimeout(r, 200));
    const app = document.getElementById('app');
    const errorDiv = app.querySelector('.error-block');
    if (errorDiv) {
      expect(errorDiv.textContent.trim()).toBe('Not found');
    } else {
      const text = app.textContent.trim() || app.innerHTML.trim();
      expect(text).toBe('Not found');
    }
  });
});
