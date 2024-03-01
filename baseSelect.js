// Importe o módulo sqlite3
const sqlite3 = require('sqlite3').verbose();

// Abra (ou crie) o banco de dados no arquivo database.db
let db = new sqlite3.Database('database.db');

// Crie uma tabela chamada 'usuarios' com colunas 'id' e 'nome'
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS prices (nutab TEXT, codprod TEXT, vlrvenda TEXT)");
});

db.serialize(() => {
  db.all("SELECT * FROM prices", (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    // Processa os resultados da consulta
    rows.forEach((row) => {
      console.log(row); // Aqui você pode fazer o que quiser com os dados, como imprimir no console
    });
  });
});

// Feche a conexão com o banco de dados após as operações
db.close();


