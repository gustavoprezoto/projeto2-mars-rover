require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const { initDb } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

initDb();

app.use(helmet());
app.use(compression());
app.use(express.json());

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.json({ message: 'Mars Rover API - Projeto 2' });
});

app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});
