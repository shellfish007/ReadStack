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
  detail.style.maxWidth = '900px';
  detail.style.margin = '40px auto';
  detail.style.background = '#fff';
  detail.style.borderRadius = '16px';
  detail.style.boxShadow = '0 8px 32px rgba(40,60,90,0.10)';
  detail.style.padding = '36px 44px';
  // Title
  const title = document.createElement('h2');
  title.textContent = note.title || 'Untitled';
  detail.appendChild(title);
  // Date
  if (note.date) {
    const date = document.createElement('div');
    date.className = 'note-date';
    date.textContent = note.date; // Show raw date string from front matter
    detail.appendChild(date);
  }
  // Render markdown body
  if (note.body) {
    const body = document.createElement('div');
    body.className = 'note-body';
    body.style.fontSize = '1.08rem';
    body.style.lineHeight = '1.7';
    body.style.color = '#222';
    body.style.background = '#f6f8fa';
    body.style.borderRadius = '10px';
    body.style.padding = '24px 28px';
    body.style.marginTop = '18px';
    body.style.boxShadow = '0 2px 8px rgba(40,60,90,0.06)';
    body.innerHTML = await renderMarkdownAsync(note.body);
    detail.appendChild(body);
  }
  container.appendChild(detail);
}
