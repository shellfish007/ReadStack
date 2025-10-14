import { describe, it, expect } from 'vitest';
import { getSelectedTags, setSelectedTags } from '../src/state.js';

describe('selectedTags state', () => {
  it('starts empty', () => {
    expect(getSelectedTags()).toEqual([]);
  });
  it('can set and get tags', () => {
    setSelectedTags(['foo', 'bar']);
    expect(getSelectedTags().sort()).toEqual(['bar', 'foo']);
  });
  it('dedupes tags', () => {
    setSelectedTags(['a', 'a', 'b']);
    expect(getSelectedTags().sort()).toEqual(['a', 'b']);
  });
  it('clears tags with empty array', () => {
    setSelectedTags([]);
    expect(getSelectedTags()).toEqual([]);
  });
  it('ignores non-array input', () => {
    setSelectedTags('bad');
    expect(getSelectedTags()).toEqual([]);
  });
});
