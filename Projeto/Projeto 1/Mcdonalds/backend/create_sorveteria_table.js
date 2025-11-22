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
  db.run(`
    CREATE TABLE IF NOT EXISTS Sorveteria (
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
      console.error('Error creating Sorveteria table:', err.message);
    } else {
      console.log('Sorveteria table created or already exists.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
