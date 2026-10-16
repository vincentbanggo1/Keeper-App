const {Pool} = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
    try{
        await pool.query('SELECT 1');
        console.log('Connected to Postgres successfully.');
        return true;
    }catch (error) {
      console.error('Postgres connection failed. Check DATABASE_URL in server/.env');
      console.error(error.message);
      return false;
    }     
};

async function initializeSchema() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT ''
      )
    `);
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    testConnection,
    initializeSchema,
};