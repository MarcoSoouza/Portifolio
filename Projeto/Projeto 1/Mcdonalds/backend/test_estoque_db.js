const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'estoque.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening estoque.db:', err.message);
    return;
  }
  console.log('Connected to estoque.db');

  // Check tables existence
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      db.close();
      return;
    }
    console.log('Tables in estoque.db:', tables.map(t => t.name).join(', '));

    // Check some data from Estoque table
    db.all("SELECT * FROM Estoque LIMIT 5", (err, rows) => {
      if (err) {
        console.error('Error querying Estoque table:', err.message);
        db.close();
        return;
      }
      console.log('Sample data from Estoque table:', rows);

      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });
    });
  });
});
