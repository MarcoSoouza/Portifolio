BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Estoque" (
	"Tipo_Sorvete"	TEXT,
	"Quantidade_Entrada"	INTEGER,
	"Quantidade_Saida"	INTEGER,
	"Quantidade_Total"	INTEGER
);
COMMIT;
