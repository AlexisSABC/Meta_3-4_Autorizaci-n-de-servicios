const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { validarApiKey, verificarToken } = require('../middleware/auth.middleware');

// Iniciar sesión (público pero exige X-API-KEY)
router.post('/login', validarApiKey, controller.login);

// Cerrar sesión y limpiar cookies (requiere token JWT válido)
router.post('/logout', verificarToken, controller.logout);

// Verificar la autenticación activa
router.get('/verify', verificarToken, controller.verificarAuth);

module.exports = router;