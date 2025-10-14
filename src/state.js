// Minimal state module for selectedTags
let selectedTags = [];
const listeners = [];

export function getSelectedTags() {
  return selectedTags.slice();
}

export function setSelectedTags(tags) {
  selectedTags = Array.isArray(tags) ? Array.from(new Set(tags)) : [];
  listeners.forEach(fn => fn(selectedTags));
}

export function subscribeSelectedTags(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}
