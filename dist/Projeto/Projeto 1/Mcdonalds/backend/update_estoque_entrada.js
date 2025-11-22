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
  db.run('UPDATE Estoque SET Quantidade_Entrada = 50 WHERE Quantidade_Entrada != 50', function(err) {
    if (err) {
      console.error('Error updating Quantidade_Entrada:', err.message);
    } else {
      console.log(`Updated Quantidade_Entrada for ${this.changes} rows.`);
    }
    db.close();
  });
});
