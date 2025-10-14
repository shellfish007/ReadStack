// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderNotesList } from '../src/render-notes.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderNotesList', () => {
  it('renders note card with title, date, summary, snippet, tags, and buttons', () => {
    const notes = [
      {
        slug: 'n1',
        title: 'Note 1',
        date: '2022-01-01',
        summary: 'Summary',
        body: 'Body text here. '.repeat(20),
        tags: ['t1', 't2', 't3', 't4', 't5', 't6', 't7']
      }
    ];
    renderNotesList(container, notes);
    expect(container.querySelector('.note-title').textContent).toBe('Note 1');
    expect(container.querySelector('.note-date').textContent).toMatch(/2022/);
    expect(container.querySelector('.note-summary').textContent).toBe('Summary');
    expect(container.querySelector('.note-snippet').textContent.length).toBeLessThanOrEqual(201); // 200 + ellipsis
    expect(container.querySelectorAll('.chip').length).toBe(6);
    expect(container.querySelector('.note-read-btn').textContent).toBe('Read full');
    expect(container.querySelector('.note-quick-btn').textContent).toBe('Quick view');
  });

  it('handles empty notes array', () => {
    renderNotesList(container, []);
    expect(container.querySelectorAll('.note-card').length).toBe(0);
  });
});
