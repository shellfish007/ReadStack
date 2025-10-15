import { renderMarkdown } from './markdown.js';
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
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '24px';
  notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card card'; // Use .card for modern look
    card.style.width = '100%';
    card.style.maxWidth = '900px';
    card.style.margin = '0 auto';

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
      date.textContent = note.date; // Show raw date string from front matter
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

    // Snippet (first 400 chars of body)
    if (note.body) {
      const snippet = document.createElement('div');
      snippet.className = 'note-snippet';
      let text = note.body.replace(/\n+/g, ' ').slice(0, 400);
      if (note.body.length > 400) text += '…';
      // Use renderMarkdown for preview snippet
      import('./markdown.js').then(mod => {
        mod.renderMarkdown(text).then(html => {
          snippet.innerHTML = html;
        });
      });
      snippet.style.fontSize = '1.08rem';
      snippet.style.lineHeight = '1.7';
      snippet.style.color = '#222';
      snippet.style.background = '#f6f8fa';
      snippet.style.borderRadius = '10px';
      snippet.style.padding = '16px 18px';
      snippet.style.margin = '10px 0 18px 0';
      snippet.style.boxShadow = '0 2px 8px rgba(40,60,90,0.06)';
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
      // Remove any open modal (hover quick view) BEFORE hiding card or changing hash
      document.querySelectorAll('.modal-card, .modal-content').forEach(m => m.remove());
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
    // Removed overlay on hover for cleaner UI
    list.appendChild(card);
  });
  container.appendChild(list);
}
