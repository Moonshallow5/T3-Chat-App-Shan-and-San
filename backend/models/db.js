const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
});

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "blog",
//   password: process.env.DB_PASSWORD,
//   port: 5432,
// });


module.exports = pool;