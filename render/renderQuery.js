import 'dotenv/config'
import pg from 'pg'
var { Client } = pg;

export function executeQuery(query) {

  var dbConn = process.env.DB_URL;
  const client = new Client(dbConn);

  client.connect()
    .then(() => {
      client.query(query, (err, result) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log('Query result:', result.rows);
        }

        // Close the connection when done
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

