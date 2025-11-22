const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'estoque.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening estoque.db:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.all('SELECT * FROM Estoque', (err, rows) => {
    if (err) {
      console.error('Error querying Estoque table:', err.message);
      process.exit(1);
    }
    if (rows.length === 0) {
      console.log('Estoque table is empty.');
    } else {
      console.log('Estoque table contents:');
      rows.forEach((row) => {
        console.log(row);
      });
    }
    db.close();
  });
});
