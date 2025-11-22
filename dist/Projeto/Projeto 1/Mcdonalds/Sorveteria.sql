BEGIN TRANSACTION;
DROP TABLE IF EXISTS "Sorveteria";
CREATE TABLE "Sorveteria" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "nome_cliente" TEXT,
  "endereço" TEXT,
  "numero_pedido" TEXT NOT NULL,
  "tamanho" INTEGER NOT NULL,
  "Sabor" TEXT,
  "delivery_fee" REAL,
  "preco_total" REAL
);
COMMIT;
