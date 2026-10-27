require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const jugadoresRoutes = require('./routes/jugadores.routes');
const rostersRoutes = require('./routes/rosters.routes');
const auxiliaresRoutes = require('./routes/auxiliares.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Documentación OpenAPI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de la API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', auxiliaresRoutes);
app.use('/api/v1/jugadores', jugadoresRoutes);
app.use('/api/v1/rosters', rostersRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Documentación OpenAPI disponible en http://localhost:${PORT}/docs`);
});