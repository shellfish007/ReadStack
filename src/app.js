


import { initRouter, getRoute } from './router.js';
import { loadManifest, loadTags, filterByTags, sortBooks, sortNotes } from './data.js';
import { renderBooksList, renderBookDetail } from './render-books.js';
import { renderNotesList } from './render-notes.js';
import { renderNoteDetail } from './note-view.js';
import { renderTagFilter, renderLoading, renderError } from './ui.js';
import { getSelectedTags, setSelectedTags, subscribeSelectedTags } from './state.js';


const app = document.getElementById('app');
window._readstackDebug = { app };


let tagsData = { categories: [] };

function render(route, manifest, allData) {
	console.debug('[ReadStack] render', { route, manifest, allData });
	app.innerHTML = '';
	if (route.name === 'home') {
		console.debug('[ReadStack] Rendering home route');

		// Main container for page padding
		const main = document.createElement('div');
		main.style.maxWidth = '900px';
		main.style.margin = '2.5rem auto 2rem auto';
		main.style.padding = '0 1.5rem';

	// App header
	const header = document.createElement('header');
	header.style.display = 'flex';
	header.style.alignItems = 'center';
	header.style.justifyContent = 'flex-start';
	header.style.marginBottom = '2.5rem';

	// Title and tag filter row
	const titleRow = document.createElement('div');
	titleRow.style.display = 'flex';
	titleRow.style.alignItems = 'center';
	titleRow.style.gap = '1.2rem';

	const h1 = document.createElement('h1');
	h1.textContent = 'ReadStack';
	h1.style.fontSize = '2.5rem';
	h1.style.fontWeight = '800';
	h1.style.letterSpacing = '-0.02em';
	h1.style.margin = '0';
	h1.style.color = 'var(--color-primary)';

	// Tag filter dropdown (with chips)
	const tagFilter = document.createElement('div');
	tagFilter.id = 'tag-filter';
	tagFilter.style.display = 'flex';
	tagFilter.style.alignItems = 'center';
	tagFilter.style.gap = '0.5em';
	renderTagFilter(tagFilter, tagsData.categories, getSelectedTags(), setSelectedTags);

	titleRow.appendChild(h1);
	titleRow.appendChild(tagFilter);
	header.appendChild(titleRow);

	main.appendChild(header);

		// Books Section
		const booksSection = document.createElement('section');
		booksSection.id = 'books-section';
		booksSection.className = 'main-section';
		booksSection.style.background = 'var(--color-bg-alt)';
		booksSection.style.borderRadius = '1.2rem';
		booksSection.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.04)';
		booksSection.style.padding = '2rem 1.5rem 1.5rem 1.5rem';
		booksSection.style.marginBottom = '2.5rem';

		const booksTitle = document.createElement('h2');
		booksTitle.textContent = 'Books';
		booksTitle.style.fontSize = '1.5rem';
		booksTitle.style.fontWeight = '700';
		booksTitle.style.margin = '0 0 1.2rem 0';
		booksSection.appendChild(booksTitle);

		let booksList = (allData && allData.books) ? allData.books : [];
		booksList = filterByTags(booksList, getSelectedTags());
		booksList = sortBooks(booksList);
		renderBooksList(booksSection, booksList);
		main.appendChild(booksSection);

		// Notes Section
		const notesSection = document.createElement('section');
		notesSection.id = 'notes-section';
		notesSection.className = 'main-section';
		notesSection.style.background = 'var(--color-bg-alt)';
		notesSection.style.borderRadius = '1.2rem';
		notesSection.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.04)';
		notesSection.style.padding = '2rem 1.5rem 1.5rem 1.5rem';

		const notesTitle = document.createElement('h2');
		notesTitle.textContent = 'Notes';
		notesTitle.style.fontSize = '1.5rem';
		notesTitle.style.fontWeight = '700';
		notesTitle.style.margin = '0 0 1.2rem 0';
		notesSection.appendChild(notesTitle);

		let notesList = (allData && allData.notes) ? allData.notes : [];
		notesList = filterByTags(notesList, getSelectedTags());
		notesList = sortNotes(notesList);
		renderNotesList(notesSection, notesList);
		main.appendChild(notesSection);

		app.appendChild(main);
	} else if (route.name === 'book-detail') {
		console.debug('[ReadStack] Rendering book-detail route', route.params);
		// Find book by id (filename-based)
		const booksList = (allData && allData.books) ? allData.books : [];
		const book = booksList.find(b => b.id === route.params.id);
		if (!book) {
			renderError(app, 'Not found');
		} else {
			renderBookDetail(app, book);
		}
	} else if (route.name === 'note-detail') {
		console.debug('[ReadStack] Rendering note-detail route', route.params);
		// Find note by slug
		const notesList = (allData && allData.notes) ? allData.notes : [];
		const note = notesList.find(n => n.slug === route.params.slug);
		if (!note) {
			renderError(app, 'Not found');
		} else {
			console.debug('[ReadStack] Rendering not-found route', route);
			// Lazy-load markdown.js for rendering
			import('./markdown.js').then(mod => {
				renderNoteDetail(app, note, mod.renderMarkdown);
			});
		}
	} else {
		renderError(app, 'Not found');
	}
}



async function start() {
	try {
		renderLoading(app);
		const [manifest, tags] = await Promise.all([
			loadManifest(),
			loadTags()
		]);
		console.debug('[ReadStack] Loaded manifest:', manifest);
		console.debug('[ReadStack] Loaded tags:', tags);
		if (manifest.error) {
			renderError(app, `Error: ${manifest.error}`);
			console.error('[ReadStack] Manifest error:', manifest.error);
			return;
		}
		if (tags.error) {
			renderError(app, `Error: ${tags.error}`);
			console.error('[ReadStack] Tags error:', tags.error);
			return;
		}
		tagsData = tags;
		// Load all metadata (books/notes)
		let allData;
		try {
			allData = await import('./data.js').then(m => m.loadAllMetadata(manifest));
			if (allData.error) {
				renderError(app, `Error: ${allData.error}`);
				console.error('[ReadStack] allData error:', allData.error);
				return;
			}
		} catch (err) {
			renderError(app, `Error loading data: ${err && err.message ? err.message : err}`);
			console.error('[ReadStack] Exception loading allData:', err);
			return;
		}
		render(getRoute(), manifest, allData);
		subscribeSelectedTags(() => render(getRoute(), manifest, allData));
		initRouter({ onRouteChange: (route) => render(route, manifest, allData) });
	} catch (fatal) {
		renderError(app, `Fatal error: ${fatal && fatal.message ? fatal.message : fatal}`);
		console.error('[ReadStack] Fatal error:', fatal);
	}
}

start();
