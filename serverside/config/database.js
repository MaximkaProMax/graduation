const { Pool } = require('pg');

const pool = new Pool({
  user: 'Max',
  host: '127.0.0.1',
  database: 'photoproject',
  password: 'Max',
  port: 5432,
});

module.exports = pool;