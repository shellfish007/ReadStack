/**
 * Sorts books: Reading -> Finished -> Unread; within Reading: progress desc; within Finished: finishDate desc.
 * Hides Unread by default (returns only Reading and Finished).
 * @param {Array} books
 * @returns {Array} sorted books
 */
export function sortBooks(books) {
	if (!Array.isArray(books)) return [];
	// Partition books by status
	const reading = [];
	const finished = [];
	// Unread are omitted (hidden by default)
	for (const book of books) {
		// Heuristic: status by percent and finishDate
		if (typeof book.percent === 'number' && book.percent > 0 && book.percent < 100) {
			reading.push(book);
		} else if (book.percent === 100 || book.finishDate) {
			finished.push(book);
		}
		// else: Unread (percent 0 or undefined, no finishDate)
	}
	// Sort Reading by progress desc
	reading.sort((a, b) => (b.percent || 0) - (a.percent || 0));
	// Sort Finished by finishDate desc (fallback to percent desc)
	finished.sort((a, b) => {
		if (a.finishDate && b.finishDate) {
			return new Date(b.finishDate) - new Date(a.finishDate);
		}
		if (a.finishDate) return -1;
		if (b.finishDate) return 1;
		return (b.percent || 0) - (a.percent || 0);
	});
	return [...reading, ...finished];
}

/**
 * Sorts notes by latest date/updated desc.
 * @param {Array} notes
 * @returns {Array} sorted notes
 */
export function sortNotes(notes) {
	if (!Array.isArray(notes)) return [];
	return notes.slice().sort((a, b) => {
		const da = a.date ? new Date(a.date) : 0;
		const db = b.date ? new Date(b.date) : 0;
		return db - da;
	});
}
/**
 * Returns items where item.tags intersects selectedTags (OR logic).
 * If selectedTags is empty, returns all items.
 */
export function filterByTags(items, selectedTags) {
	if (!Array.isArray(selectedTags) || selectedTags.length === 0) return items;
	return (items || []).filter(item => {
		if (!Array.isArray(item.tags)) return false;
		return item.tags.some(tag => selectedTags.includes(tag));
	});
}
/**
 * Fetches data/tags.json and returns { categories } or { error }.
 */
export async function loadTags() {
	try {
		   const res = await fetch('data/tags.json');
		   if (!res.ok) return { error: 'Tags not found' };
		   const data = await res.json();
		   // Support both array and object format for categories
		   let categories = [];
		   if (Array.isArray(data.categories)) {
			   // Old format: flat array
			   categories = [{ name: 'All', tags: data.categories }];
		   } else if (typeof data.categories === 'object' && data.categories !== null) {
			   // New format: object with category names as keys
			   categories = Object.entries(data.categories).map(([name, tags]) => ({ name, tags }));
		   } else {
			   return { error: 'Malformed tags.json' };
		   }
		   return { categories };
	} catch (e) {
		return { error: 'Failed to load tags' };
	}
}
/**
 * Extracts YAML front matter from markdown text.
 * Returns { attributes, body } or { error } if malformed.
 */
export function extractFrontMatter(markdownText) {
	if (typeof markdownText !== 'string') return { error: 'Malformed front matter' };
	const fmMatch = markdownText.match(/^\s*---\s*\n([\s\S]*?)\n---\s*\n?/);
	if (!fmMatch) {
		return { error: 'Malformed front matter' };
	}
	const yaml = fmMatch[1];
	const body = markdownText.slice(fmMatch[0].length);
	const attributes = {};
	let currentKey = null;
	let isInProgress = false;
	try {
		for (const line of yaml.split(/\r?\n/)) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) continue;
			// Nested progress block (multi-line)
			if (/^progress\s*:\s*{?\s*$/.test(trimmed)) {
				isInProgress = true;
				attributes.progress = {};
				continue;
			}
			if (isInProgress) {
				if (/^}/.test(trimmed)) {
					isInProgress = false;
					continue;
				}
				const kv = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*(.+)$/);
				if (kv) {
					const k = kv[1];
					let v = kv[2].trim();
					if (/^-?\d+(\.\d+)?$/.test(v)) {
						v = Number(v);
					}
					attributes.progress[k] = v;
				}
				continue;
			}
			// Inline progress: { pagesRead: 100, totalPages: 200 }
			const inlineProgress = trimmed.match(/^progress\s*:\s*{(.+)}\s*$/);
			if (inlineProgress) {
				const obj = {};
				inlineProgress[1].split(',').forEach(pair => {
					const kv = pair.split(':');
					if (kv.length === 2) {
						const k = kv[0].trim();
						let v = kv[1].trim();
						if (/^-?\d+(\.\d+)?$/.test(v)) {
							v = Number(v);
						}
						obj[k] = v;
					}
				});
				attributes.progress = obj;
				continue;
			}
			// Key: value or Key: [array]
				const arrMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*\[(.*)]$/);
				if (arrMatch) {
					const k = arrMatch[1];
					const arr = arrMatch[2]
						.split(',')
						.map(s => s.trim().replace(/^['"]|['"]$/g, ''))
						.filter(Boolean);
					attributes[k] = arr;
					continue;
				}
			const kv = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*(.+)$/);
			if (kv) {
				const k = kv[1];
				let v = kv[2];
				if (/^\d+$/.test(v)) v = parseInt(v, 10);
				attributes[k] = v;
				continue;
			}
			// Ignore unknown or malformed lines
		}
		return { attributes, body };
	} catch (e) {
		return { error: 'Malformed front matter' };
	}
}
// Data module: manifest loader and metadata stubs

/**
 * Fetches data/manifest.json and returns { books: [], notes: [] } structure.
 * If missing or invalid, returns { error } and logs to console.
 */
export async function loadManifest() {
	try {
		const res = await fetch('data/manifest.json');
		if (!res.ok) {
			return { error: 'Manifest not found' };
		}
		const data = await res.json();
		// Defensive: ensure books/notes arrays
		return {
			books: Array.isArray(data.books) ? data.books : [],
			notes: Array.isArray(data.notes) ? data.notes : []
		};
	} catch (err) {
		return { error: 'Failed to load manifest' };
	}
}

/**
 * For now, returns empty arrays for books/notes metadata.
 * @param {Object} manifest
 */
export async function loadAllMetadata(manifest) {
	if (!manifest || !Array.isArray(manifest.books) || !Array.isArray(manifest.notes)) {
		return { books: [], notes: [] };
	}
	// Helper to fetch and parse a file
	async function fetchAndParse(path) {
		try {
			const res = await fetch(path);
			if (!res.ok) return null;
			const text = await res.text();
			const { attributes, body, error } = extractFrontMatter(text);
			if (error) return null;
			return { ...attributes, body };
		} catch {
			return null;
		}
	}
	// Books
	const books = await Promise.all(
		manifest.books.map(async (path) => {
			const meta = await fetchAndParse(path);
			if (!meta) return null;
			// Compute percent if progress present
			let percent = undefined;
			if (meta.progress && typeof meta.progress.pagesRead === 'number' && typeof meta.progress.totalPages === 'number' && meta.progress.totalPages > 0) {
				percent = Math.round((meta.progress.pagesRead / meta.progress.totalPages) * 100);
			}
			return {
				id: path.split('/').pop().replace(/\.md$/, ''),
				title: meta.title,
				authors: meta.authors || [],
				tags: meta.tags || [],
				startDate: meta.startDate,
				finishDate: meta.finishDate,
				percent,
				progress: meta.progress,
				body: meta.body
			};
		})
	);
	// Notes
	const notes = await Promise.all(
		manifest.notes.map(async (path) => {
			const meta = await fetchAndParse(path);
			if (!meta) return null;
			return {
				slug: path.split('/').pop().replace(/\.md$/, ''),
				title: meta.title,
				date: meta.date,
				summary: meta.summary,
				tags: meta.tags || [],
				body: meta.body
			};
		})
	);
	return {
		books: books.filter(Boolean),
		notes: notes.filter(Boolean)
	};
}
