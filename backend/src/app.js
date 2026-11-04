
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Gestión de Inventario',
    status: 'Servidor funcionando'
  });
});

// Ruta de salud
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();

    res.status(200).json({
      status: 'OK',
      message: 'Servidor y base de datos conectados'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'No se pudo conectar con PostgreSQL'
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log('Conexión con PostgreSQL establecida correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
