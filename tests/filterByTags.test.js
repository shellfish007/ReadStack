import { describe, it, expect } from 'vitest';
import { filterByTags } from '../src/data.js';

describe('filterByTags', () => {
  const items = [
    { id: 1, tags: ['a', 'b'] },
    { id: 2, tags: ['b', 'c'] },
    { id: 3, tags: ['d'] },
    { id: 4, tags: [] },
    { id: 5 }
  ];
  it('returns all items if selectedTags is empty', () => {
    expect(filterByTags(items, [])).toEqual(items);
  });
  it('returns items with any matching tag (single)', () => {
    expect(filterByTags(items, ['a'])).toEqual([items[0]]);
    expect(filterByTags(items, ['d'])).toEqual([items[2]]);
  });
  it('returns items with any matching tag (multi)', () => {
    expect(filterByTags(items, ['b', 'c'])).toEqual([items[0], items[1]]);
  });
  it('returns empty if no matches', () => {
    expect(filterByTags(items, ['z'])).toEqual([]);
  });
  it('ignores items with no tags array', () => {
    expect(filterByTags(items, ['a', 'b', 'c', 'd'])).not.toContain(items[4]);
  });
});
