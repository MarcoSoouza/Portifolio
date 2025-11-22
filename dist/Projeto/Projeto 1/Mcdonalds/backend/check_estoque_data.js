const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'estoque.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening estoque.db:', err.message);
    return;
  }
  console.log('Connected to estoque.db');
});

db.all('SELECT * FROM Estoque', [], (err, rows) => {
  if (err) {
    console.error('Error querying Estoque table:', err.message);
  } else {
    console.log('Estoque table data:');
    console.table(rows);
  }
  db.close();
});
