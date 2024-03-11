// Importe o módulo sqlite3
const sqlite3 = require('sqlite3').verbose();

// Abra (ou crie) o banco de dados no arquivo database.db
let db = new sqlite3.Database('database.db');


db.serialize(() => {
  db.all("DELETE FROM prices", (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
});

db.close();


