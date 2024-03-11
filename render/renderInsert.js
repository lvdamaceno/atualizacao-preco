import 'dotenv/config'
import pg from 'pg'
var { Client } = pg;

export function insertValues(nutab, codprod, vlrvenda) {
  var renderConnectionUrl = process.env.DB_URL;
  const client = new Client(renderConnectionUrl);

  client.connect()
    .then(() => {
      client.query(`INSERT INTO prices (nutab, codprod, vlrvenda) VALUES (${nutab} ,${codprod}, ${vlrvenda})`, (err, result) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log('Query result:', result.rows);
        }

        client.end()
          .then(() => {
            // console.log('Connection to PostgreSQL closed');
          })
          .catch((err) => {
            console.error('Error closing connection', err);
          });
      });
    })
    .catch((err) => {
      console.error('Error connecting to PostgreSQL database', err);
    });
}

insertValues(7777, 777777, 777)