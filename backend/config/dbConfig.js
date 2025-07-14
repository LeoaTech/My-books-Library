
const pg = require("pg");
const { Pool } = pg;

require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.CONNECTION_URL,
});

module.exports = pool;
