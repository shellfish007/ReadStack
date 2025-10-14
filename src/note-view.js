// Note detail reader mode
// Minimal, production-ready, no dependencies

/**
 * Renders full note in reader mode using renderMarkdown(note.body).
 * Minimal layout: no header/filters.
 * @param {HTMLElement} container
 * @param {Object} note
 * @param {Function} renderMarkdownAsync - async (md) => html
 */
export async function renderNoteDetail(container, note, renderMarkdownAsync) {
  if (!container || !note) return;
  container.innerHTML = '';
  const detail = document.createElement('div');
  detail.className = 'note-detail';
  // Title
  const title = document.createElement('h2');
  title.textContent = note.title || 'Untitled';
  detail.appendChild(title);
  // Date
  if (note.date) {
    const date = document.createElement('div');
    date.className = 'note-date';
    date.textContent = new Date(note.date).toLocaleDateString('en-US');
    detail.appendChild(date);
  }
  // Render markdown body
  if (note.body) {
    const body = document.createElement('div');
    body.className = 'note-body';
    body.innerHTML = await renderMarkdownAsync(note.body);
    detail.appendChild(body);
  }
  container.appendChild(detail);
}
