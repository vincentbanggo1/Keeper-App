const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const noteRoutes = require('./routes/noteRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8000;
const configuredOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production' && !configuredOrigins?.length) {
  throw new Error('CORS_ORIGIN must be set in production.');
}

app.use(cors({ origin: configuredOrigins?.length ? configuredOrigins : '*' }));
app.use(express.json());

app.use('/api/notes', noteRoutes);

app.use((req, res) => { res.status(404).json({ message:'Routes not found!'});
});   

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).json({ message });
});

async function startServer() {
  try {
    await db.initializeSchema();
    app.listen(PORT, () => {
      console.log(`Notes server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const code =
      error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? ` (${error.code})`
        : '';
    console.error(
      `Failed to initialize the database${code}: ${message || 'No error message provided.'}`,
    );
    process.exitCode = 1;
  }
}

startServer();