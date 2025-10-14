import { describe, it, expect, vi } from 'vitest';
import { loadAllMetadata } from '../src/data.js';

describe('loadAllMetadata', () => {
  it('parses book and note metadata and computes percent', async () => {
    const manifest = {
      books: ['data/books/b1.md'],
      notes: ['data/notes/n1.md']
    };
    // Mock fetch for book and note
    globalThis.fetch = vi.fn()
      .mockImplementationOnce(async (path) => ({
        ok: true,
        text: async () => (
          '---\ntitle: Book Title\nauthors: [Alice, Bob]\ntags: [fiction]\nstartDate: 2022-01-01\nfinishDate: 2022-02-01\nprogress: {\n  pagesRead: 50\n  totalPages: 100\n}\n---\nBook body here.'
        )
      }))
      .mockImplementationOnce(async (path) => ({
        ok: true,
        text: async () => (
          '---\ntitle: Note Title\ndate: 2022-03-01\nsummary: A note.\ntags: [tag1, tag2]\n---\nNote body here.'
        )
      }));
    const result = await loadAllMetadata(manifest);
    expect(result.books.length).toBe(1);
    expect(result.books[0].title).toBe('Book Title');
    expect(result.books[0].authors).toEqual(['Alice', 'Bob']);
    expect(result.books[0].tags).toEqual(['fiction']);
    expect(result.books[0].percent).toBe(50);
    expect(result.books[0].body).toMatch('Book body here');
    expect(result.notes.length).toBe(1);
    expect(result.notes[0].title).toBe('Note Title');
    expect(result.notes[0].date).toBe('2022-03-01');
    expect(result.notes[0].summary).toBe('A note.');
    expect(result.notes[0].tags).toEqual(['tag1', 'tag2']);
    expect(result.notes[0].body).toMatch('Note body here');
  });
});
