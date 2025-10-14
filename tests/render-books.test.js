import { renderBookDetail } from '../src/render-books.js';

describe('renderBookDetail', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });
  it('renders all static metadata fields', () => {
    const book = {
      title: 'Test Book',
      authors: ['Alice', 'Bob'],
      startDate: '2023-01-01',
      finishDate: '2023-02-01',
      percent: 80,
      tags: ['fiction', 'sci-fi']
    };
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBookDetail(container, book);
    expect(container.innerHTML).toMatch('Test Book');
    expect(container.innerHTML).toMatch('Alice, Bob');
    expect(container.innerHTML).toMatch('2023-01-01');
    expect(container.innerHTML).toMatch('2023-02-01');
    expect(container.innerHTML).toMatch('80%');
    expect(container.innerHTML).toMatch('fiction, sci-fi');
  });
  it('renders only available fields', () => {
    const book = { title: 'Only Title' };
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBookDetail(container, book);
    expect(container.innerHTML).toMatch('Only Title');
    expect(container.innerHTML).not.toMatch('Authors:');
    expect(container.innerHTML).not.toMatch('Start:');
    expect(container.innerHTML).not.toMatch('Finish:');
    expect(container.innerHTML).not.toMatch('Progress:');
    expect(container.innerHTML).not.toMatch('Tags:');
  });
});
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
// @vitest-environment jsdom
import { renderBooksList } from '../src/render-books.js';

let container;
beforeEach(() => {
  container = document.createElement('div');
});

describe('renderBooksList', () => {
  it('renders book rows with title and progress', () => {
    const books = [
      { id: 'b1', title: 'Book 1', percent: 50, authors: ['A'], tags: ['t1'], startDate: '2022-01-01', finishDate: '2022-02-01' }
    ];
    renderBooksList(container, books);
    expect(container.querySelector('.book-title').textContent).toBe('Book 1');
    expect(container.querySelector('.progress-fill').style.width).toBe('50%');
  });

  it('handles empty books array', () => {
    renderBooksList(container, []);
    expect(container.querySelectorAll('.book-row').length).toBe(0);
  });

  it('shows metadata on hover', () => {
    const books = [
      { id: 'b2', title: 'Book 2', percent: 80, authors: ['B'], tags: ['t2'], startDate: '2022-03-01', finishDate: '2022-04-01' }
    ];
    renderBooksList(container, books);
    const row = container.querySelector('.book-row');
    const meta = container.querySelector('.book-meta');
    row.dispatchEvent(new Event('mouseenter'));
    expect(meta.classList.contains('show')).toBe(true);
    row.dispatchEvent(new Event('mouseleave'));
    expect(meta.classList.contains('show')).toBe(false);
  });
});
