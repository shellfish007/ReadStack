

// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { getRoute } from '../src/router.js';

describe('router', () => {
  it('matches home route', () => {
    window.location.hash = '#/';
    expect(getRoute()).toEqual({ name: 'home', params: {} });
    window.location.hash = '';
    expect(getRoute()).toEqual({ name: 'home', params: {} });
  });

  it('matches book detail route', () => {
    window.location.hash = '#/books/abc123';
    expect(getRoute()).toEqual({ name: 'book-detail', params: { id: 'abc123' } });
  });

  it('matches note detail route', () => {
    window.location.hash = '#/notes/xyz';
    expect(getRoute()).toEqual({ name: 'note-detail', params: { slug: 'xyz' } });
  });

  it('returns not-found for unknown route', () => {
    window.location.hash = '#/unknown/route';
    expect(getRoute()).toEqual({ name: 'not-found', params: {} });
  });
});
