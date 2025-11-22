const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'estoque.db');
const sqlFilePath = path.join(__dirname, '..', 'Estoque.sql');

// Do not delete estoque.db if it is locked or in use
try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
} catch (err) {
  console.warn('Could not delete estoque.db, it may be in use:', err.message);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening estoque.db:', err.message);
    return;
  }
  console.log('Connected to estoque.db');
  
  // Read Estoque.sql file
  const sql = fs.readFileSync(sqlFilePath, 'utf-8');
  
  // Execute SQL script to create Estoque table
  db.exec(sql, (err) => {
    if (err) {
      console.error('Error executing Estoque.sql:', err.message);
      db.close();
      return;
    }
    console.log('Estoque table created successfully');

    // Create alertas table
    db.run(`
      CREATE TABLE IF NOT EXISTS alertas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Tipo_Sorvete TEXT NOT NULL UNIQUE,
        mensagem TEXT NOT NULL,
        data_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating alertas table:', err.message);
        db.close();
        return;
      }
      console.log('Alertas table created successfully');

      // Insert initial quantities of 50 for each sorvete flavor
      const flavors = ['Morango', 'Uva', 'Pistache', 'Chocolate'];
      const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO Estoque (Tipo_Sorvete, Quantidade_Entrada, Quantidade_Saida, Quantidade_Total)
        VALUES (?, 50, 0, 50)
      `);
      flavors.forEach(flavor => {
        insertStmt.run(flavor);
      });
      insertStmt.finalize(() => {
        console.log('Initial estoque quantities inserted');
        db.close();
      });
    });
  });
});
