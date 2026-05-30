// =============================================================
// CONFIG: db.js
// Creates and exports a PostgreSQL connection pool.
// All database modules import this pool to run queries.
// =============================================================
require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),

});

// Test connection
if (process.env.NODE_ENV !== 'test') {

  pool.connect()
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB Error:", err.message));

}

// module.exports = pool;
module.exports = {
  pool
};