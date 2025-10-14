import { openModal } from './ui.js';
/**
 * Renders static metadata for a book (title, authors, dates, percent, tags). Excludes long summary.
 * @param {HTMLElement} container
 * @param {Object} book
 */
export function renderBookDetail(container, book) {
  if (!container || !book) return;
  container.innerHTML = '';
  const detail = document.createElement('div');
  detail.className = 'book-detail';
  // Title
  const title = document.createElement('h2');
  title.textContent = book.title || 'Untitled';
  detail.appendChild(title);
  // Authors
  if (book.authors && book.authors.length) {
    const authors = document.createElement('div');
    authors.innerHTML = `<strong>Authors:</strong> ${book.authors.join(', ')}`;
    detail.appendChild(authors);
  }
  // Dates
  if (book.startDate) {
    const start = document.createElement('div');
    start.innerHTML = `<strong>Start:</strong> ${book.startDate}`;
    detail.appendChild(start);
  }
  if (book.finishDate) {
    const finish = document.createElement('div');
    finish.innerHTML = `<strong>Finish:</strong> ${book.finishDate}`;
    detail.appendChild(finish);
  }
  // Percent
  if (typeof book.percent === 'number') {
    const percent = document.createElement('div');
    percent.innerHTML = `<strong>Progress:</strong> ${book.percent}%`;
    detail.appendChild(percent);
  }
  // Tags
  if (book.tags && book.tags.length) {
    const tags = document.createElement('div');
    tags.innerHTML = `<strong>Tags:</strong> ${book.tags.join(', ')}`;
    detail.appendChild(tags);
  }
  container.appendChild(detail);
}
// Book list renderer
// Minimal, production-ready, no dependencies

/**
 * Renders a list of books as rows with title and progress bar.
 * @param {HTMLElement} container
 * @param {Array} books
 */
export function renderBooksList(container, books) {
  if (!Array.isArray(books)) return;
  container.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'books-list';
  books.forEach(book => {
    // Debug: log percent for each book
    console.debug('[renderBooksList] book', book.title, 'percent:', book.percent, 'progress:', book.progress);
    const row = document.createElement('div');
    row.className = 'book-row';
    // Kebab menu (quick view placeholder) - now on the left
    const kebab = document.createElement('button');
    kebab.className = 'kebab-btn';
    kebab.title = 'Quick view';
    kebab.innerHTML = '<span class="kebab">⋮</span>';
    kebab.onclick = e => {
      e.stopPropagation();
      // Modal content: reuse book detail (no long summary)
      const content = document.createElement('div');
      content.className = 'modal-content';
      // Reuse renderBookDetail but into content
      renderBookDetail(content, book);
      openModal(content);
    };
    row.appendChild(kebab);
    // Title clickable
    const title = document.createElement('button');
    title.className = 'book-title';
    title.textContent = book.title || 'Untitled';
    title.onclick = () => {
      window.location.hash = `#/books/${book.id || book.slug || ''}`;
    };
    row.appendChild(title);
    // Progress bar
    if (typeof book.percent === 'number') {
      const progress = document.createElement('div');
      progress.className = 'progress-bar';
      const fill = document.createElement('div');
      fill.className = 'progress-fill';
      fill.style.width = Math.max(0, Math.min(100, book.percent)) + '%';
      progress.appendChild(fill);
      row.appendChild(progress);
    }
    // Metadata hover block (only on kebab hover)
    const meta = document.createElement('div');
    meta.className = 'book-meta';
    meta.innerHTML = [
      book.authors ? `<div><strong>Authors:</strong> ${book.authors.join(', ')}</div>` : '',
      book.startDate ? `<div><strong>Start:</strong> ${book.startDate}</div>` : '',
      book.finishDate ? `<div><strong>Finish:</strong> ${book.finishDate}</div>` : '',
      book.tags ? `<div><strong>Tags:</strong> ${book.tags.join(', ')}</div>` : ''
    ].filter(Boolean).join('');
    row.appendChild(meta);
    // Show meta only on kebab hover
    kebab.onmouseenter = () => meta.classList.add('show');
    kebab.onmouseleave = () => meta.classList.remove('show');
    list.appendChild(row);
  });
  container.appendChild(list);
}
