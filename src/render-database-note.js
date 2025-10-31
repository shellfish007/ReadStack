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

// Render Databases.csv data as a separate note
export async function renderDatabaseNoteFromCSV(container) {
  const databaseNote = document.createElement('div');
  databaseNote.className = 'note-card card';
  databaseNote.style.width = '100%';
  databaseNote.style.maxWidth = '900px';
  databaseNote.style.margin = '0 auto';
  databaseNote.style.padding = '16px';
  databaseNote.style.background = '#f6f8fa';
  databaseNote.style.borderRadius = '10px';
  databaseNote.style.boxShadow = '0 2px 8px rgba(40,60,90,0.06)';

  const header = document.createElement('div');
  header.className = 'note-header';
  header.style.marginBottom = '10px';
  header.style.display = 'flex';
  header.style.alignItems = 'center';

  const title = document.createElement('div');
  title.textContent = 'Databases Overview (from CSV)';
  title.style.fontSize = '1.35rem';
  title.style.fontWeight = '700';
  title.style.color = '#2563eb';
  header.appendChild(title);
  databaseNote.appendChild(header);

  const content = document.createElement('div');
  content.style.fontSize = '1rem';
  content.style.lineHeight = '1.6';
  content.style.color = '#222';

  try {
    const response = await fetch('data/notes/Databases.csv');
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

    content.appendChild(table);
  } catch (error) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load database data from CSV.';
    errorMessage.style.color = 'red';
    content.appendChild(errorMessage);
  }

  databaseNote.appendChild(content);
  container.appendChild(databaseNote);
}