// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { loadManifest } from '../src/data.js';
import { renderError, renderLoading } from '../src/ui.js';

// Helper to create a container for DOM tests
function createContainer() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

describe('renderLoading', () => {
  it('renders loading message with default text', () => {
    const container = createContainer();
    renderLoading(container);
    expect(container.textContent).toBe('Loading...');
    expect(container.querySelector('.loading-block')).not.toBeNull();
    container.remove();
  });
  it('renders loading message with custom text', () => {
    const container = createContainer();
    renderLoading(container, 'Please wait');
    expect(container.textContent).toBe('Please wait');
    expect(container.querySelector('.loading-block')).not.toBeNull();
    container.remove();
  });
});

describe('renderError', () => {
  it('renders error message', () => {
    const container = createContainer();
    renderError(container, 'Something went wrong');
    expect(container.textContent).toBe('Something went wrong');
    expect(container.querySelector('.error-block')).not.toBeNull();
    container.remove();
  });
});

describe('loadManifest error handling', () => {
  it('renders error UI on fetch failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network fail'));
    const container = createContainer();
    // Simulate app.js error branch
    try {
      await loadManifest();
    } catch (e) {
      renderError(container, `Error: ${e.message}`);
    }
    const errorDiv = container.querySelector('.error-block');
    expect(errorDiv).not.toBeNull();
    expect(errorDiv.textContent).toContain('Error: Network fail');
    container.remove();
  });
  it('renders error UI on manifest error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const container = createContainer();
    // Simulate app.js error branch
    const result = await loadManifest();
    if (result.error) {
      renderError(container, `Error: ${result.error}`);
    }
    expect(container.textContent).toContain('Error:');
    expect(container.querySelector('.error-block')).not.toBeNull();
    container.remove();
  });
});
