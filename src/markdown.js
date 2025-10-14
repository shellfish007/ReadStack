// Minimal Markdown parser and sanitizer (lazy-load boundary)

/**
 * Renders Markdown to sanitized HTML (headings, paragraphs, bold/italic, lists).
 * Strips <script>/<style> and dangerous attributes.
 * @param {string} mdString
 * @returns {Promise<string>} HTML string
 */
export async function renderMarkdown(mdString) {
  if (typeof mdString !== 'string') return '';
  // Minimal Markdown parsing
  let html = mdString
    // Headings: #, ##, ###
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    // Lists: - item
    .replace(/^(\s*)- (.*)$/gm, '$1<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m.replace(/\n/g, '')}</ul>\n`)
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic: *text*
  .replace(/\*(?!\*)([^*]+)\*/g, '<em>$1</em>')
    // Paragraphs: lines not in block tags
    .replace(/^(?!<h\d>|<ul>|<li>|<\/ul>|<\/li>)([^\n]+)\n/gm, '<p>$1</p>\n');

  // Trivial sanitizer: strip <script>, <style>, and on* attributes
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '');

  return html;
}
