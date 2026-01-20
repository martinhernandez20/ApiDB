// db/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '2024',
  database: 'Remoras',
  port: 5432,
});

module.exports = pool;
