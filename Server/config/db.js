const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is missing. Set it in Server/.env for local development or in your hosting provider environment for deployment.',
  );
}

if (process.env.NODE_ENV === 'production') {
  let databaseHost;

  try {
    databaseHost = new URL(databaseUrl).hostname.toLowerCase();
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }

  if (
    databaseHost === 'localhost' ||
    databaseHost === '127.0.0.1' ||
    databaseHost === '0.0.0.0' ||
    databaseHost === '[::1]' ||
    databaseHost.endsWith('.localhost')
  ) {
    throw new Error(
      'DATABASE_URL points to localhost in production. Set it to your hosted PostgreSQL database URL in the hosting provider environment.',
    );
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
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
