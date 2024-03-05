var { Client } = require('pg');
require('dotenv').config();

var dbConn = process.env.DB_URL;

const client = new Client(dbConn);
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');

    // Execute SQL queries here

    client.query('SELECT * FROM prices', (err, result) => {
      if (err) {
        console.error('Error executing query', err);
      } else {
        console.log('Query result:', result.rows);
      }

      // Close the connection when done
      client.end()
        .then(() => {
          console.log('Connection to PostgreSQL closed');
        })
        .catch((err) => {
          console.error('Error closing connection', err);
        });
    });
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });
