import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
import fs from 'fs';
import https from 'https';
import path from 'path';

import jugadoresRoutes from './routes/jugadores.routes.js';
import rostersRoutes from './routes/rosters.routes.js';
import auxiliaresRoutes from './routes/auxiliares.routes.js';
import authRoutes from './routes/auth.routes.js';
import * as authController from './controllers/auth.controller.js';

const require = createRequire(import.meta.url);
const swaggerDocument = require('../swagger.json');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Documentación OpenAPI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas principales requeridas directamente en la raíz /auth/google
app.get('/auth/google/login', authController.googleLogin);
app.get('/auth/google/callback', authController.googleCallback);

// Rutas de la API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', auxiliaresRoutes);
app.use('/api/v1/jugadores', jugadoresRoutes);
app.use('/api/v1/rosters', rostersRoutes);

// Manejador 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5000;

// Inicialización condicional de HTTPS si existen llaves/certificados
const certPath = path.resolve('cert/server.crt');
const keyPath = path.resolve('cert/server.key');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`Servidor HTTPS ejecutándose en https://localhost:${HTTPS_PORT}`);
  });
}

app.listen(PORT, () => {
  console.log(`Servidor HTTP ejecutándose en http://localhost:${PORT}`);
  console.log(`Documentación OpenAPI en http://localhost:${PORT}/docs`);
});