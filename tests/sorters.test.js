import { describe, it, expect } from 'vitest';
import { sortBooks, sortNotes } from '../src/data.js';

describe('sortBooks', () => {
  const books = [
    { id: '1', percent: 0, finishDate: undefined, title: 'Unread' },
    { id: '2', percent: 50, finishDate: undefined, title: 'Reading 50' },
    { id: '3', percent: 100, finishDate: '2023-01-01', title: 'Finished 2023-01-01' },
    { id: '4', percent: 80, finishDate: undefined, title: 'Reading 80' },
    { id: '5', percent: 100, finishDate: '2024-01-01', title: 'Finished 2024-01-01' },
    { id: '6', percent: undefined, finishDate: undefined, title: 'Unread 2' },
    { id: '7', percent: 100, finishDate: undefined, title: 'Finished (no date)' },
  ];

  it('sorts books: Reading -> Finished, hides Unread', () => {
    const sorted = sortBooks(books);
    // Only Reading and Finished, Unread omitted
    expect(sorted.map(b => b.id)).toEqual(['4', '2', '5', '3', '7']);
  });

  it('sorts Reading by progress desc', () => {
    const sorted = sortBooks(books);
    const reading = sorted.filter(b => b.percent > 0 && b.percent < 100);
    expect(reading.map(b => b.id)).toEqual(['4', '2']);
  });

  it('sorts Finished by finishDate desc, fallback percent', () => {
    const sorted = sortBooks(books);
    const finished = sorted.filter(b => b.percent === 100 || b.finishDate);
    // 2024-01-01 > 2023-01-01 > undefined
    expect(finished.map(b => b.id)).toEqual(['5', '3', '7']);
  });

  it('returns empty array if input is not array', () => {
    expect(sortBooks(null)).toEqual([]);
    expect(sortBooks(undefined)).toEqual([]);
  });
});

describe('sortNotes', () => {
  const notes = [
    { slug: 'a', date: '2022-01-01', title: 'Old' },
    { slug: 'b', date: '2024-01-01', title: 'New' },
    { slug: 'c', date: '2023-01-01', title: 'Mid' },
    { slug: 'd', title: 'No date' },
  ];
  it('sorts notes by latest date desc', () => {
    const sorted = sortNotes(notes);
    expect(sorted.map(n => n.slug)).toEqual(['b', 'c', 'a', 'd']);
  });
  it('returns empty array if input is not array', () => {
    expect(sortNotes(null)).toEqual([]);
    expect(sortNotes(undefined)).toEqual([]);
  });
});
