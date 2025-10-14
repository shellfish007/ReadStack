// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { openModal, closeModal } from '../src/ui.js';

describe('modal helpers', () => {
  afterEach(() => {
    closeModal();
    document.body.innerHTML = '';
  });
  it('opens and closes a modal with content', () => {
    const content = document.createElement('div');
    content.textContent = 'Modal content';
    openModal(content);
    const modal = document.querySelector('.modal-card');
    expect(modal).toBeTruthy();
    expect(modal.textContent).toMatch('Modal content');
    closeModal();
    expect(document.querySelector('.modal-card')).toBeNull();
  });
  it('modal close button closes modal', () => {
    const content = document.createElement('div');
    openModal(content);
    const closeBtn = document.querySelector('.modal-close');
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    expect(document.querySelector('.modal-card')).toBeNull();
  });
});
