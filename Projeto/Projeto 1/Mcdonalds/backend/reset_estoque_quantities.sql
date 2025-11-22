BEGIN TRANSACTION;

DELETE FROM Estoque;

INSERT INTO Estoque (Tipo_Sorvete, Quantidade_Entrada, Quantidade_Saida, Quantidade_Total) VALUES
('Morango', 50, 0, 50),
('Uva', 50, 0, 50),
('Pistache', 50, 0, 50),
('Chocolate', 50, 0, 50);

COMMIT;
