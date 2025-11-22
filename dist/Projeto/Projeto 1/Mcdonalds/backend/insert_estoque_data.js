const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'estoque.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening estoque.db:', err.message);
    process.exit(1);
  }
});

// List of sorvete types to insert/update
const sorveteTypes = ['Morango', 'Uva', 'Pistache', 'Chocolate'];

db.serialize(() => {
  let completed = 0;
  sorveteTypes.forEach(tipo => {
    db.get('SELECT * FROM Estoque WHERE Tipo_Sorvete = ?', [tipo], (err, row) => {
      if (err) {
        console.error('Error querying Estoque:', err.message);
        checkDone();
        return;
      }
      if (row) {
        // Update existing record
        db.run(
          `UPDATE Estoque SET Quantidade_Entrada = 50, Quantidade_Saida = 0, Quantidade_Total = 50 WHERE Tipo_Sorvete = ?`,
          [tipo],
          function(err) {
            if (err) {
              console.error('Error updating Estoque:', err.message);
            } else {
              console.log(`Updated Estoque for ${tipo}`);
            }
            checkDone();
          }
        );
      } else {
        // Insert new record
        db.run(
          `INSERT INTO Estoque (Tipo_Sorvete, Quantidade_Entrada, Quantidade_Saida, Quantidade_Total) VALUES (?, 50, 0, 50)`,
          [tipo],
          function(err) {
            if (err) {
              console.error('Error inserting Estoque:', err.message);
            } else {
              console.log(`Inserted Estoque for ${tipo}`);
            }
            checkDone();
          }
        );
      }
    });
  });

  function checkDone() {
    completed++;
    if (completed === sorveteTypes.length) {
      db.close();
    }
  }
});
