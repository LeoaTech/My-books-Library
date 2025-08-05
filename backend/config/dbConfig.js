const pg = require("pg");
const { Pool } = pg;

require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// pool.on('connect', () => {
//   console.log('DB Connected successfully!');
// });
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to Database !");
  });
});
module.exports = { pool, query: (text, params) => pool.query(text, params) };
