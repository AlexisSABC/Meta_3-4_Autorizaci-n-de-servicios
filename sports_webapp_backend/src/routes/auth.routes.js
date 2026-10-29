import express from 'express';
import * as controller from '../controllers/auth.controller.js';
import { validarApiKey, verificarToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas de OAuth Google
router.get('/google/login', controller.googleLogin);
router.get('/google/callback', controller.googleCallback);

// Rutas de autenticación local
router.post('/login', validarApiKey, controller.login);
router.post('/logout', verificarToken, controller.logout);
router.get('/verify', verificarToken, controller.verificarAuth);

export default router;