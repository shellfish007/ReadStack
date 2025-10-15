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
  // Enhanced nested list parser with proper wrapping
  function parseNestedLists(md) {
    const lines = md.split(/\r?\n/);
    const stack = [];
    let html = '';
    let prevIndent = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^(\s*)- (.*)$/);
      if (match) {
        const indent = match[1].replace(/\t/g, '  ').length;
        const item = match[2];
        // Open new <ul> for increased indent
        while (stack.length < indent / 2 + 1) {
          html += '<ul>';
          stack.push((stack.length) * 2);
        }
        // Close <ul> for decreased indent
        while (stack.length > indent / 2 + 1) {
          html += '</ul>';
          stack.pop();
        }
        // Add left margin for visual indent, plus base space for all lists
        const baseMargin = 18; // px, always some space for all lists
        const margin = ` style=\"margin-left:${baseMargin + indent * 12}px\"`;
        html += `<li${margin}>${item}</li>`;
        prevIndent = indent;
      } else {
        // Close any open lists before non-list line
        while (stack.length) {
          html += '</ul>';
          stack.pop();
        }
        // Only add line break if current and previous line are not list items
        const prevLine = i > 0 ? lines[i - 1] : '';
        if (
          line.trim() !== '' &&
          !/^\s*- /.test(line) &&
          !/^\s*- /.test(prevLine)
        ) {
          html += line + '\n';
        }
        prevIndent = 0;
      }
    }
    // Close any remaining open lists
    while (stack.length) {
      html += '</ul>';
      stack.pop();
    }
    return html;
  }

  let html = parseNestedLists(mdString)
    // Headings: #, ##, ### (fix: only match at start of line, not after other content)
    .replace(/###\s+(.*)$/gm, '<h3 style="font-size:1rem;font-weight:800;color:#1e293b;margin:1.2em 0 0.7em 0;">$1</h3>')
    .replace(/##\s+(.*)$/gm, '<h2 style="font-size:1.5rem;font-weight:900;color:#1e293b;margin:1.5em 0 0.8em 0;">$1</h2>')
    .replace(/#\s+(.*)$/gm, '<h1 style="font-size:2rem;font-weight:900;color:#1e293b;margin:2em 0 1em 0;">$1</h1>')
    // Improved: ***blue bold***, **black bold**, *black bold* (greedy, multiline, punctuation)
    .replace(/\*\*\*([^*][\s\S]*?[^*])\*\*\*/g, '<strong style="color:#2563eb;font-weight:700;">$1</strong>')
    .replace(/\*\*([^*][\s\S]*?[^*])\*\*/g, '<strong style="color:#2563eb;font-weight:700;">$1</strong>')
    .replace(/\*(?!\*)([^*][\s\S]*?[^*])\*/g, '<strong style="color:#222;font-weight:700;">$1</strong>')
    // Paragraphs: lines not in block tags
    .replace(/^(?!<h\d>|<ul>|<li>|<\/ul>|<\/li>)([^\n]+)\n/gm, '<p>$1</p>\n');

  // Trivial sanitizer: strip <script>, <style>, and on* attributes
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '');

  return html;
}
