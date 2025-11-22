const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database for sorveteria
const db = new sqlite3.Database(path.join(__dirname, 'sorveteria.db'), (err) => {
  if (err) {
    console.error('Error opening sorveteria.db:', err.message);
  } else {
    console.log('Connected to sorveteria.db SQLite database.');
  }
});

// Initialize SQLite database for estoque
const estoqueDb = new sqlite3.Database(path.join(__dirname, 'estoque.db'), (err) => {
  if (err) {
    console.error('Error opening estoque.db:', err.message);
  } else {
    console.log('Connected to estoque.db SQLite database.');
  }
});

// Create tables if they don't exist (simplified schema)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sabores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_sabor VARCHAR(100) NOT NULL UNIQUE,
      preco DECIMAL(10, 2) NOT NULL,
      quantidade_disponivel INTEGER NOT NULL DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS tamanhos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_tamanho VARCHAR(50) NOT NULL UNIQUE,
      descricao TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_pedido VARCHAR(50) NOT NULL UNIQUE,
      nome_cliente VARCHAR(255) NOT NULL,
      endereco TEXT NOT NULL,
      prazo_entrega VARCHAR(100) NOT NULL,
      preco_total DECIMAL(10, 2) NOT NULL,
      data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      sabor_id INTEGER NOT NULL,
      tamanho_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL
    )
  `);

  // Insert default tamanhos if not exists
  db.run(`
    INSERT OR IGNORE INTO tamanhos (nome_tamanho, descricao) VALUES
    ('Pequeno', 'Pequena porção de sorvete'),
    ('Médio', 'Porção média de sorvete'),
    ('Grande', 'Grande porção de sorvete')
  `);

  // Insert default sabores including Uva
  db.run(`
    INSERT OR IGNORE INTO sabores (nome_sabor, preco, quantidade_disponivel) VALUES
    ('Morango', 7.50, 100),
    ('Uva', 7.00, 100),
    ('Pistache', 7.50, 100),
    ('Chocolate', 7.00, 100)
  `);
});

  // API endpoint to receive and store orders
  app.post('/api/pedidos', (req, res) => {
    const { numero_pedido, nome_cliente, endereco, tamanho, itens, delivery_fee, preco_total } = req.body;

    if (!numero_pedido || !nome_cliente || !endereco || !tamanho || !itens || !Array.isArray(itens) || delivery_fee === undefined || preco_total === undefined) {
      return res.status(400).json({ error: 'Campos do pedido incompletos ou inválidos' });
    }

    // Map tamanho string to integer
    const tamanhoMap = {
      'Pequeno': 1,
      'Médio': 2,
      'Grande': 3
    };

    const tamanhoInt = tamanhoMap[tamanho];
    if (!tamanhoInt) {
      return res.status(400).json({ error: 'Tamanho inválido' });
    }

    // Validate if any item quantity exceeds 50
    for (const item of itens) {
      if (item.quantidade > 50) {
        return res.status(400).json({ error: `Pedido bloqueado: quantidade de sorvetes para o sabor ID ${item.sabor_id} excede o limite de 50.` });
      }
    }

    // Query sabor names from sabor_id in itens
    const saborIds = itens.map(item => item.sabor_id);
    const placeholders = saborIds.map(() => '?').join(',');
    const query = `SELECT id, nome_sabor FROM sabores WHERE id IN (${placeholders})`;

    db.all(query, saborIds, (err, rows) => {
      if (err) {
        console.error('Erro ao buscar nomes dos sabores:', err.message);
        return res.status(500).json({ error: 'Falha ao buscar nomes dos sabores' });
      }

      // Map sabor_id to nome_sabor
      const saborIdToNome = {};
      rows.forEach(row => {
        saborIdToNome[row.id] = row.nome_sabor;
      });

      // Concatenate sabores into a string
      const saboresList = itens.map(item => saborIdToNome[item.sabor_id] || '').filter(s => s !== '');
      const saboresStr = saboresList.join(', ');

      // Update Estoque quantities based on order items
      const updateEstoquePromises = itens.map(item => {
        return new Promise((resolve, reject) => {
          // Get the Tipo_Sorvete corresponding to the sabor_id
          const tipoSorvete = saborIdToNome[item.sabor_id];
          if (!tipoSorvete) {
            return resolve(); // Skip if no matching Tipo_Sorvete
          }

          // Decrease Quantidade_Total by item.quantidade
          estoqueDb.get('SELECT Quantidade_Total, Quantidade_Saida FROM Estoque WHERE Tipo_Sorvete = ?', [tipoSorvete], (err, row) => {
            if (err) {
              console.error('Erro ao buscar estoque para atualização:', err.message);
              return reject(err);
            }
            if (!row) {
              console.warn(`Tipo_Sorvete ${tipoSorvete} não encontrado no Estoque`);
              return resolve();
            }
            const novaQuantidade = row.Quantidade_Total - item.quantidade;
            const novaQuantidadeSaida = (row.Quantidade_Saida || 0) + item.quantidade;
            estoqueDb.run('UPDATE Estoque SET Quantidade_Total = ?, Quantidade_Saida = ? WHERE Tipo_Sorvete = ?', [novaQuantidade, novaQuantidadeSaida, tipoSorvete], (err) => {
              if (err) {
                console.error('Erro ao atualizar estoque:', err.message);
                return reject(err);
              }
              // Check if novaQuantidade is below alert threshold (10)
              if (novaQuantidade < 10) {
                const mensagem = `Estoque baixo para ${tipoSorvete}: ${novaQuantidade} unidades restantes.`;
                // Insert or update alert in alertas table
                estoqueDb.run(`
                  INSERT INTO alertas (Tipo_Sorvete, mensagem, data_alerta)
                  VALUES (?, ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(Tipo_Sorvete) DO UPDATE SET
                    mensagem=excluded.mensagem,
                    data_alerta=CURRENT_TIMESTAMP
                `, [tipoSorvete, mensagem], (alertErr) => {
                  if (alertErr) {
                    console.error('Erro ao inserir/atualizar alerta:', alertErr.message);
                  }
                });
              }
              resolve();
            });
          });
        });
      });

      Promise.all(updateEstoquePromises)
        .then(() => {
          // After updating stock, get updated Quantidade_Saida for each flavor in the order
          const saborNames = itens.map(item => {
            const tipoSorvete = saborIdToNome[item.sabor_id];
            return tipoSorvete;
          });

          const placeholders = saborNames.map(() => '?').join(',');
          estoqueDb.all(`SELECT Tipo_Sorvete, Quantidade_Saida FROM Estoque WHERE Tipo_Sorvete IN (${placeholders})`, saborNames, (err, rows) => {
            if (err) {
              console.error('Erro ao buscar Quantidade_Saida atualizada:', err.message);
              return res.status(500).json({ error: 'Falha ao buscar Quantidade_Saida atualizada' });
            }

            // Map Tipo_Sorvete to Quantidade_Saida
            const quantidadeSaidaMap = {};
            rows.forEach(row => {
              quantidadeSaidaMap[row.Tipo_Sorvete] = row.Quantidade_Saida;
            });

            db.run(
              `INSERT INTO Sorveteria (nome_cliente, "endereço", numero_pedido, tamanho, "Sabor", delivery_fee, preco_total) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [nome_cliente, endereco, numero_pedido, tamanhoInt, saboresStr, delivery_fee, preco_total],
              function(err) {
                if (err) {
                  console.error('Erro ao inserir pedido na tabela Sorveteria:', err.message);
                  return res.status(500).json({ error: 'Falha ao salvar pedido na tabela Sorveteria' });
                }
                res.status(201).json({ 
                  message: 'Pedido salvo com sucesso na tabela Sorveteria', 
                  pedidoId: this.lastID,
                  quantidadeSaida: quantidadeSaidaMap
                });
              }
            );
          });
        })
        .catch((error) => {
          console.error('Erro ao atualizar estoque:', error.message);
          res.status(500).json({ error: 'Falha ao atualizar estoque' });
        });
    });
  });

// API endpoint to get all flavors
app.get('/api/sabores', (req, res) => {
  db.all('SELECT id, nome_sabor, preco, quantidade_disponivel FROM sabores', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar sabores:', err.message);
      return res.status(500).json({ error: 'Falha ao buscar sabores' });
    }
    res.json(rows);
  });
});

// API endpoint to get all orders from Sorveteria table
app.get('/api/pedidos', (req, res) => {
  const query = `
    SELECT 
      id,
      nome_cliente,
      "endereço" AS endereco,
      numero_pedido,
      tamanho,
      "Sabor" AS sabor,
      preco_total
    FROM Sorveteria
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err.message);
      return res.status(500).json({ error: 'Falha ao buscar pedidos' });
    }
    res.json(rows);
  });
});

// Remove any other references to pedidos or p.tamanho if present

  
// API endpoint to get all estoque records
app.get('/api/estoque', (req, res) => {
  estoqueDb.all('SELECT * FROM Estoque', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar estoque:', err.message);
      return res.status(500).json({ error: 'Falha ao buscar estoque' });
    }
    res.json(rows);
  });
});

// API endpoint to add or update estoque record
app.post('/api/estoque', (req, res) => {
  const { Tipo_Sorvete, Quantidade_Entrada, Quantidade_Saida, Quantidade_Total } = req.body;
  if (!Tipo_Sorvete || Quantidade_Entrada === undefined || Quantidade_Saida === undefined || Quantidade_Total === undefined) {
    return res.status(400).json({ error: 'Campos do estoque incompletos ou inválidos' });
  }

  // Check if record exists
  estoqueDb.get('SELECT * FROM Estoque WHERE Tipo_Sorvete = ?', [Tipo_Sorvete], (err, row) => {
    if (err) {
      console.error('Erro ao buscar estoque:', err.message);
      return res.status(500).json({ error: 'Falha ao buscar estoque' });
    }

    if (row) {
      // Update existing record
      estoqueDb.run(
        `UPDATE Estoque SET Quantidade_Entrada = ?, Quantidade_Saida = ?, Quantidade_Total = ? WHERE Tipo_Sorvete = ?`,
        [Quantidade_Entrada, Quantidade_Saida, Quantidade_Total, Tipo_Sorvete],
        function(err) {
          if (err) {
            console.error('Erro ao atualizar estoque:', err.message);
            return res.status(500).json({ error: 'Falha ao atualizar estoque' });
          }
          res.json({ message: 'Estoque atualizado com sucesso' });
        }
      );
    } else {
      // Insert new record
      estoqueDb.run(
        `INSERT INTO Estoque (Tipo_Sorvete, Quantidade_Entrada, Quantidade_Saida, Quantidade_Total) VALUES (?, ?, ?, ?)`,
        [Tipo_Sorvete, Quantidade_Entrada, Quantidade_Saida, Quantidade_Total],
        function(err) {
          if (err) {
            console.error('Erro ao inserir estoque:', err.message);
            return res.status(500).json({ error: 'Falha ao inserir estoque' });
          }
          res.status(201).json({ message: 'Estoque inserido com sucesso' });
        }
      );
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
