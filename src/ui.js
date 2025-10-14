
// Modal helpers
let _modal = null;
let _lastActive = null;

/**
 * Opens a floating modal with the given content node. No overlay. Focuses modal.
 * @param {HTMLElement} contentNode
 */
export function openModal(contentNode) {
  closeModal();
  _lastActive = document.activeElement;
  _modal = document.createElement('div');
  _modal.className = 'modal-card';
  _modal.tabIndex = -1;
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = closeModal;
  _modal.appendChild(closeBtn);
  // Content
  if (contentNode) _modal.appendChild(contentNode);
  document.body.appendChild(_modal);
  // Minimal focus trap: focus modal, return to last active on close
  setTimeout(() => _modal && _modal.focus(), 0);
}

/**
 * Closes the modal if open and restores focus.
 */
export function closeModal() {
  if (_modal) {
    if (_modal.parentNode) _modal.parentNode.removeChild(_modal);
    _modal = null;
  }
  if (_lastActive && typeof _lastActive.focus === 'function') {
    setTimeout(() => _lastActive.focus(), 0);
    _lastActive = null;
  }
}
// Tag filter UI: grouped, multi-select
/**
 * Renders a loading message in the given container.
 * @param {HTMLElement} container
 * @param {string} [text="Loading..."]
 */
export function renderLoading(container, text = "Loading...") {
  if (!container) return;
  container.innerHTML = '';
  const loading = document.createElement('div');
  loading.className = 'loading-block';
  loading.textContent = text;
  container.appendChild(loading);
}

/**
 * Renders an error message in the given container.
 * @param {HTMLElement} container
 * @param {string} message
 */
export function renderError(container, message) {
  if (!container) return;
  container.innerHTML = '';
  const error = document.createElement('div');
  error.className = 'error-block';
  error.textContent = message;
  container.appendChild(error);
}

/**
 * Renders a grouped tag filter dropdown with checkboxes.
 * @param {HTMLElement} container
 * @param {Array} categories [{ name, tags: [] }]
 * @param {Array} selectedTags
 * @param {Function} onChange (selectedTags) => void
 */
export function renderTagFilter(container, categories, selectedTags, onChange) {
  container.innerHTML = '';
  if (!Array.isArray(categories)) return;
  // Flatten all tags from all categories
  const allTags = Array.from(new Set(categories.flatMap(cat => cat.tags)));
  // Dropdown wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'tag-dropdown-wrapper';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '0.7em';
  // Dropdown button
  const dropdownBtn = document.createElement('button');
  dropdownBtn.type = 'button';
  dropdownBtn.className = 'tag-dropdown-btn';
  dropdownBtn.textContent = 'Select tags';
  wrapper.appendChild(dropdownBtn);
  // Selected tags chips (right of button)
  const chips = document.createElement('div');
  chips.className = 'tag-chips';
  chips.style.display = 'flex';
  chips.style.flexWrap = 'wrap';
  chips.style.gap = '0.4em';
  selectedTags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = tag;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'tag-chip-remove';
    remove.textContent = '×';
    remove.onclick = () => {
      onChange(selectedTags.filter(t => t !== tag));
    };
    chip.appendChild(remove);
    chips.appendChild(chip);
  });
  wrapper.appendChild(chips);
  // Dropdown menu
  const dropdown = document.createElement('div');
  dropdown.className = 'tag-dropdown';
  dropdown.style.display = 'none';
  // Search box
  const search = document.createElement('input');
  search.type = 'text';
  search.className = 'tag-search';
  search.placeholder = 'Type to search tags...';
  dropdown.appendChild(search);
  // Tag list
  const tagList = document.createElement('div');
  tagList.className = 'tag-list';
  dropdown.appendChild(tagList);
  // Render tag options
  function renderTagOptions(filter = '') {
    tagList.innerHTML = '';
    allTags.filter(tag => tag.toLowerCase().includes(filter.toLowerCase()) && !selectedTags.includes(tag)).forEach(tag => {
      const option = document.createElement('div');
      option.className = 'tag-option';
      option.textContent = tag;
      option.onclick = () => {
        onChange([...selectedTags, tag]);
        dropdown.style.display = 'none';
        search.value = '';
      };
      tagList.appendChild(option);
    });
    if (tagList.innerHTML === '') {
      const none = document.createElement('div');
      none.className = 'tag-option-none';
      none.textContent = 'No tags found';
      tagList.appendChild(none);
    }
  }
  renderTagOptions();
  search.oninput = () => renderTagOptions(search.value);
  // Dropdown open/close logic
  dropdownBtn.onclick = e => {
    e.preventDefault();
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    search.focus();
    renderTagOptions(search.value);
  };
  document.addEventListener('click', e => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
  wrapper.appendChild(dropdown);
  container.appendChild(wrapper);
}
