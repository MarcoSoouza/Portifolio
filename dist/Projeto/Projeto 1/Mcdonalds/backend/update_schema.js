const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'sorveteria.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.serialize(() => {
  // Rename old Sorveteria table
  db.run('ALTER TABLE Sorveteria RENAME TO Sorveteria_old;', (err) => {
    if (err) {
      console.error('Error renaming Sorveteria table:', err.message);
      return;
    }
    console.log('Renamed Sorveteria to Sorveteria_old.');

    // Create new Sorveteria table with correct schema
    db.run(`
      CREATE TABLE Sorveteria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cliente TEXT,
        "endereço" TEXT,
        numero_pedido INTEGER NOT NULL,
        tamanho INTEGER NOT NULL,
        "Sabor" TEXT,
        delivery_fee REAL,
        preco_total REAL
      );
    `, (err) => {
      if (err) {
        console.error('Error creating new Sorveteria table:', err.message);
        return;
      }
      console.log('Created new Sorveteria table.');

      // Copy data from old table to new table (set delivery_fee to 0 if missing)
      db.run(`
        INSERT INTO Sorveteria (id, nome_cliente, "endereço", numero_pedido, tamanho, "Sabor", preco_total)
        SELECT id, nome_cliente, "endereço", numero_pedido, tamanho, "Sabor", preco_total FROM Sorveteria_old;
      `, (err) => {
        if (err) {
          console.error('Error copying data to new Sorveteria table:', err.message);
          return;
        }
        console.log('Copied data to new Sorveteria table.');

        // Drop old table
        db.run('DROP TABLE Sorveteria_old;', (err) => {
          if (err) {
            console.error('Error dropping old Sorveteria table:', err.message);
            return;
          }
          console.log('Dropped old Sorveteria_old table.');

          // Close database connection after all operations
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
  });
});
