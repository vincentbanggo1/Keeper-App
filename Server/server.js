const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/noteRoutes');
const db = require('./config/db');
dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors());
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
    console.error('Failed to initialize the database:', error.message);
    process.exitCode = 1;
  }
}

startServer();