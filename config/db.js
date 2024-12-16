const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'city_signals',
    password: '17212430',
    port: 5432,
});

module.exports = pool;