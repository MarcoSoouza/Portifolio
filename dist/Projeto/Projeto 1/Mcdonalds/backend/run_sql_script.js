const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node run_sql_script.js <database_path> <sql_file_path>');
  process.exit(1);
}

const dbPath = path.resolve(process.argv[2]);
const sqlFilePath = path.resolve(process.argv[3]);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

fs.readFile(sqlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading SQL file:', err.message);
    process.exit(1);
  }

  db.exec(data, (err) => {
    if (err) {
      console.error('Error executing SQL script:', err.message);
      process.exit(1);
    }
    console.log('SQL script executed successfully.');
    db.close();
  });
});
