const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sorveteria.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening sorveteria.db:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run('DELETE FROM Sorveteria', function(err) {
    if (err) {
      console.error('Error clearing Sorveteria table:', err.message);
    } else {
      console.log(`Cleared Sorveteria table, ${this.changes} rows deleted.`);
    }
    db.close();
  });
});
