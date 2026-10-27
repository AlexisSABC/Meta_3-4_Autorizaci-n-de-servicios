const express = require('express');
const router = express.Router();
const controller = require('../controllers/jugadores.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// Consulta (Pública)
router.get('/', controller.obtenerJugadores);
router.get('/:id', controller.obtenerJugadorPorId);

// Modificaciones (Protegidas para ADMIN + CSRF)
router.post('/', verificarToken, controller.crearJugador);
router.put('/:id', verificarToken, controller.actualizarJugador);
router.delete('/:id', verificarToken, controller.eliminarJugador);

module.exports = router;