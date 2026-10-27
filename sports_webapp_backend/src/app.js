import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

import jugadoresRoutes from './routes/jugadores.routes.js';
import rostersRoutes from './routes/rosters.routes.js';
import auxiliaresRoutes from './routes/auxiliares.routes.js';
import authRoutes from './routes/auth.routes.js';

const require = createRequire(import.meta.url);
const swaggerDocument = require('../swagger.json');

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