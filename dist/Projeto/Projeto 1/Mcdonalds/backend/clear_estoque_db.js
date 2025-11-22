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
  db.run('DELETE FROM Estoque', function(err) {
    if (err) {
      console.error('Error clearing Estoque table:', err.message);
      process.exit(1);
    }
    console.log(`Cleared Estoque table ${this.changes} rows deleted.`);
    db.close();
  });
});
