
// Simple hash router for ReadStack
const ROUTES = [
	{ name: 'home', pattern: /^#\/?$/ },
	{ name: 'book-detail', pattern: /^#\/books\/([^/]+)$/ },
	{ name: 'note-detail', pattern: /^#\/notes\/([^/]+)$/ }
];

let onRouteChangeHandler = null;

export function getRoute() {
	const hash = window.location.hash || '#/';
	for (const route of ROUTES) {
		const match = hash.match(route.pattern);
		if (match) {
			if (route.name === 'book-detail') {
				return { name: 'book-detail', params: { id: match[1] } };
			}
			if (route.name === 'note-detail') {
				return { name: 'note-detail', params: { slug: match[1] } };
			}
			return { name: 'home', params: {} };
		}
	}
	return { name: 'not-found', params: {} };
}

export function navigateTo(hash) {
	window.location.hash = hash;
}

export function initRouter({ onRouteChange }) {
	onRouteChangeHandler = onRouteChange;
	window.addEventListener('hashchange', () => {
		if (onRouteChangeHandler) onRouteChangeHandler(getRoute());
	});
}
