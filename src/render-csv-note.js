// Utility function to parse CSV content
export function parseCSV(csvContent) {
  const rows = csvContent.split('\n');
  const headers = rows[0].split(',');
  return rows.slice(1).map(row => {
    const values = row.split(',');
    return headers.reduce((acc, header, index) => {
      acc[header.trim()] = values[index]?.trim();
      return acc;
    }, {});
  });
}

// Render Databases.csv data as a body of a note
export async function renderDatabaseNoteFromCSV(container, file, singlePage = false) {
  const content = document.createElement('div');
  content.style.fontSize = '1rem';
  content.style.lineHeight = '1.6';
  content.style.color = '#222';

  try {
    const response = await fetch(file);
    const csvContent = await response.text();
    const databases = parseCSV(csvContent);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '16px';
    table.style.border = '1px solid #ddd';
    table.style.fontSize = '0.9rem';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(databases[0]).forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.border = '1px solid #ddd';
      th.style.padding = '12px';
      th.style.backgroundColor = '#f2f2f2';
      th.style.textAlign = 'left';
      th.style.fontWeight = 'bold';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    databases.forEach(db => {
      const row = document.createElement('tr');
      Object.values(db).forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        td.style.border = '1px solid #ddd';
        td.style.padding = '12px';
        td.style.textAlign = 'left';
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    const scrollableContainer = document.createElement('div');
    scrollableContainer.style.maxHeight = '400px'; // Set a fixed height for the scrollable area
    if (singlePage) {
      scrollableContainer.style.maxHeight = 'none'; // No height limit for single page view
      scrollableContainer.style.width = '120%';
    }
    scrollableContainer.style.overflowY = 'auto'; // Enable vertical scrolling
    scrollableContainer.style.border = '1px solid #ddd'; // Optional: Add a border for better visibility
    scrollableContainer.style.marginTop = '16px';

    scrollableContainer.appendChild(table);
    content.appendChild(scrollableContainer);
  } catch (error) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load database data from CSV.';
    errorMessage.style.color = 'red';
    content.appendChild(errorMessage);
  }

  return content;
}