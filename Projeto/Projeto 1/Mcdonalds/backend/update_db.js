const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'sorveteria.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Function to clear all data from Sorveteria table
function clearSorveteriaTable() {
  db.serialize(() => {
    db.run('DELETE FROM Sorveteria', (err) => {
      if (err) {
        console.error('Error clearing Sorveteria table:', err.message);
      } else {
        console.log('Sorveteria table cleared successfully.');
      }
    });
  });
}

// Run the clear function
clearSorveteriaTable();

// Close the database connection after operation
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
