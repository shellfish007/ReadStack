// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderNoteDetail } from '../src/note-view.js';

function createContainer() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

describe('renderNoteDetail', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });
  it('renders note with title, date, and markdown body', async () => {
    const note = {
      title: 'Note Title',
      date: '2025-10-14',
      body: '# Heading\nContent.'
    };
    const container = createContainer();
    const fakeRenderMarkdown = vi.fn(async () => `<h1>Heading</h1><p>Content.</p>`);
    await renderNoteDetail(container, note, fakeRenderMarkdown);
    expect(container.innerHTML).toMatch('Note Title');
    expect(container.innerHTML).toMatch('2025');
    expect(container.innerHTML).toMatch('<h1>Heading</h1>');
    expect(container.innerHTML).toMatch('<p>Content.</p>');
  });
  it('renders only available fields', async () => {
    const note = { title: 'Only Title' };
    const container = createContainer();
    const fakeRenderMarkdown = vi.fn(async () => '');
    await renderNoteDetail(container, note, fakeRenderMarkdown);
    expect(container.innerHTML).toMatch('Only Title');
    expect(container.innerHTML).not.toMatch('note-date');
    expect(container.innerHTML).not.toMatch('note-body');
  });
});
