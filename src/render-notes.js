import { openModal } from './ui.js';
// Notes list renderer
// Minimal, production-ready, no dependencies

/**
 * Renders a list of notes as cards with title, date, summary, snippet, tags, and buttons.
 * @param {HTMLElement} container
 * @param {Array} notes
 */
export function renderNotesList(container, notes) {
  if (!Array.isArray(notes)) return;
  container.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'notes-list';
  notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card card'; // Use .card for modern look

    // Header: Title and Date
    const header = document.createElement('div');
    header.className = 'note-header';
    header.style.marginBottom = '10px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    // Title
    const title = document.createElement('div');
    title.className = 'note-title';
    title.textContent = note.title || 'Untitled';
    title.style.fontSize = '1.35rem';
    title.style.fontWeight = '700';
    title.style.color = '#2563eb';
    title.style.marginRight = '16px';
    header.appendChild(title);
    if (note.date) {
      const date = document.createElement('div');
      date.className = 'note-date';
      date.textContent = new Date(note.date).toLocaleDateString('en-US');
      date.style.color = '#3a4a5a';
      date.style.fontSize = '0.98rem';
      header.appendChild(date);
    }
    card.appendChild(header);

    // Summary (if present)
    if (note.summary) {
      const summary = document.createElement('div');
      summary.className = 'note-summary';
      summary.textContent = note.summary;
      card.appendChild(summary);
    }

    // Snippet (first 200 chars of body)
    if (note.body) {
      const snippet = document.createElement('div');
      snippet.className = 'note-snippet';
      let text = note.body.replace(/\n+/g, ' ').slice(0, 200);
      if (note.body.length > 200) text += '…';
      snippet.textContent = text;
      card.appendChild(snippet);
    }

    // Buttons (actions)
    const btns = document.createElement('div');
    btns.className = 'note-btns';
    btns.style.marginBottom = '24px';
    // Read full
    const readBtn = document.createElement('button');
    readBtn.className = 'btn note-read-btn';
    readBtn.textContent = 'Read full';
    readBtn.onclick = () => {
      card.style.display = 'none';
      window.location.hash = `#/notes/${note.slug || note.id || ''}`;
    };
    btns.appendChild(readBtn);
    card.appendChild(btns);

    // Tags (up to 6) - now last line
    if (Array.isArray(note.tags) && note.tags.length) {
      const tags = document.createElement('div');
      tags.className = 'note-tags';
      note.tags.slice(0, 6).forEach(tag => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = tag;
        chip.style.background = '#e3f0ff'; // light blue background
        chip.style.color = '#2563eb'; // vibrant blue text
        chip.style.borderRadius = '8px';
        chip.style.padding = '4px 12px';
        chip.style.marginRight = '8px';
        chip.style.fontWeight = '500';
        chip.style.fontSize = '0.97rem';
        chip.style.border = '1px solid #b6d3fa';
        tags.appendChild(chip);
      });
      tags.style.marginTop = '8px';
      card.appendChild(tags);
    }

    // Quick view on hover (modal)
    let quickViewTimeout;
    card.addEventListener('mouseenter', () => {
      quickViewTimeout = setTimeout(() => {
        import('./markdown.js').then(mod => {
          const content = document.createElement('div');
          content.className = 'modal-content';
          const title = document.createElement('h3');
          title.textContent = note.title || 'Untitled';
          content.appendChild(title);
          const body = document.createElement('div');
          body.className = 'note-body';
          const snippet = note.body ? note.body.slice(0, 1000) : '';
          mod.renderMarkdown(snippet).then(html => {
            body.innerHTML = html;
            content.appendChild(body);
            openModal(content);
          });
        });
      }, 250); // slight delay to avoid accidental popups
    });
    card.addEventListener('mouseleave', () => {
  clearTimeout(quickViewTimeout);
  // Close modal if open
  const modals = document.querySelectorAll('.modal-card');
  modals.forEach(m => m.remove());
    });
    list.appendChild(card);
  });
  container.appendChild(list);
}
