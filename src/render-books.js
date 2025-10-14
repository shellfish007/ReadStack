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
  detail.style.background = 'rgba(255,255,255,0.98)';
  detail.style.borderRadius = '18px';
  detail.style.boxShadow = '0 8px 32px rgba(40,60,90,0.12)';
  detail.style.padding = '32px 36px';
  detail.style.maxWidth = '700px';
  detail.style.margin = '40px auto';
  // Title
  const title = document.createElement('h2');
  title.textContent = book.title || 'Untitled';
  title.style.fontSize = '2.1rem';
  title.style.fontWeight = '700';
  title.style.color = '#2a3a4a';
  title.style.marginBottom = '12px';
  detail.appendChild(title);
  // Authors
  if (book.authors && book.authors.length) {
    const authors = document.createElement('div');
    authors.innerHTML = `<strong style="color:#6c7a89;">Authors:</strong> <span style="color:#3a4a5a;">${book.authors.join(', ')}</span>`;
    authors.style.marginBottom = '8px';
    detail.appendChild(authors);
  }
  // Dates
  if (book.startDate || book.finishDate) {
    const dates = document.createElement('div');
    dates.style.marginBottom = '8px';
    dates.style.color = '#6c7a89';
    if (book.startDate) dates.innerHTML += `<span><strong>Start:</strong> ${book.startDate}</span> `;
    if (book.finishDate) dates.innerHTML += `<span><strong>Finish:</strong> ${book.finishDate}</span>`;
    detail.appendChild(dates);
  }
  // Progress
  if (typeof book.percent === 'number') {
    const percent = document.createElement('div');
    percent.innerHTML = `<strong style="color:#6c7a89;">Progress:</strong> <span style="color:#3a4a5a;">${book.percent}%</span>`;
    percent.style.marginBottom = '8px';
    detail.appendChild(percent);
  }
  // Tags
  if (book.tags && book.tags.length) {
    const tags = document.createElement('div');
    tags.innerHTML = `<strong style="color:#6c7a89;">Tags:</strong> <span style="color:#3a4a5a;">${book.tags.join(', ')}</span>`;
    tags.style.marginBottom = '18px';
    detail.appendChild(tags);
  }
  // Long description (markdown body)
  if (book.description) {
    const desc = document.createElement('div');
    desc.className = 'book-long-desc';
    desc.style.fontSize = '1.08rem';
    desc.style.lineHeight = '1.7';
    desc.style.color = '#444';
    desc.style.marginTop = '18px';
    desc.style.whiteSpace = 'pre-line';
    desc.innerText = book.description;
    detail.appendChild(desc);
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
    // Tooltip for long description
    const descTooltip = document.createElement('div');
    descTooltip.className = 'book-desc-tooltip';
    descTooltip.innerHTML = book.description
      ? `<div style="font-size:1rem;font-weight:600;margin-bottom:6px;color:#2a3a4a;">${book.title}</div><div style="font-size:0.95rem;line-height:1.6;color:#444;white-space:pre-line;">${book.description}</div>`
      : '';
    descTooltip.style.display = 'none';
    descTooltip.style.position = 'fixed';
    descTooltip.style.zIndex = '1000';
    descTooltip.style.maxWidth = '620px';
    descTooltip.style.background = 'rgba(255,255,255,0.98)';
    descTooltip.style.borderRadius = '12px';
    descTooltip.style.border = '1px solid #e0e4ea';
    descTooltip.style.padding = '18px 20px';
    descTooltip.style.boxShadow = '0 6px 24px rgba(40,60,90,0.18)';
    descTooltip.style.transition = 'opacity 0.2s';
    descTooltip.style.opacity = '0';
    descTooltip.style.pointerEvents = 'none';
    title.onmouseenter = (e) => {
      if (book.description) {
        descTooltip.style.display = 'block';
        descTooltip.style.opacity = '1';
        descTooltip.style.left = e.clientX + 16 + 'px';
        descTooltip.style.top = e.clientY + 16 + 'px';
      }
    };
    title.onmousemove = (e) => {
      if (book.description) {
        descTooltip.style.left = e.clientX + 16 + 'px';
        descTooltip.style.top = e.clientY + 16 + 'px';
      }
    };
    title.onmouseleave = () => {
      descTooltip.style.opacity = '0';
      setTimeout(() => { descTooltip.style.display = 'none'; }, 180);
    };
    row.appendChild(title);
    row.appendChild(descTooltip);
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
