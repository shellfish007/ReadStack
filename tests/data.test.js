import { extractFrontMatter } from '../src/data.js';
describe('extractFrontMatter', () => {
  it('extracts attributes and body from valid front matter', () => {
    const md = `---\ntitle: Test Note\ntags: [foo, bar]\nsummary: Hello\n---\nBody text here.`;
    const { attributes, body } = extractFrontMatter(md);
    expect(attributes.title).toBe('Test Note');
    expect(attributes.tags).toEqual(['foo', 'bar']);
    expect(attributes.summary).toBe('Hello');
    expect(body.trim()).toBe('Body text here.');
  });

  it('returns error for missing or malformed front matter', () => {
    const md = 'No front matter here.';
    const result = extractFrontMatter(md);
    expect(result.error).toBe('Malformed front matter');
  });

  it('extracts nested progress block', () => {
    const md = `---\ntitle: Book\nprogress: {\n  pagesRead: 10\n  totalPages: 100\n}\n---\nBook body.`;
    const { attributes, body } = extractFrontMatter(md);
    expect(attributes.title).toBe('Book');
    expect(attributes.progress).toEqual({ pagesRead: 10, totalPages: 100 });
    expect(body.trim()).toBe('Book body.');
  });
});
import { describe, it, expect, vi } from 'vitest';
import { loadManifest } from '../src/data.js';

// Stub test for loadManifest() happy path

describe('loadManifest', () => {
  it('returns books and notes arrays from manifest.json', async () => {
    // Mock fetch to return a valid manifest
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ books: ['a.md'], notes: ['n.md'] })
    });
    const result = await loadManifest();
    expect(result.books).toEqual(['a.md']);
    expect(result.notes).toEqual(['n.md']);
  });
});
