import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../src/markdown.js';

// Helper to strip whitespace for easier comparison
function stripWS(str) {
  return str.replace(/\s+/g, ' ').trim();
}

describe('renderMarkdown', () => {
  it('renders headings and paragraphs', async () => {
    const md = '# Title\n## Sub\nText.\n';
    const html = await renderMarkdown(md);
    expect(stripWS(html)).toContain('<h1>Title</h1>');
    expect(stripWS(html)).toContain('<h2>Sub</h2>');
    expect(stripWS(html)).toContain('<p>Text.</p>');
  });

  it('renders bold and italic', async () => {
    const md = 'This is **bold** and *italic*.';
    const html = await renderMarkdown(md);
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('renders lists', async () => {
    const md = '- One\n- Two\n- Three\n';
    const html = await renderMarkdown(md);
    expect(stripWS(html)).toContain('<ul><li>One</li><li>Two</li><li>Three</li></ul>');
  });

  it('sanitizes script/style and on* attributes', async () => {
    const md = '<script>alert(1)</script><style>body{}</style><a href="#" onclick="evil()">X</a>';
    const html = await renderMarkdown(md);
    expect(html).not.toMatch(/<script|<style|on\w+=/);
  });
});
