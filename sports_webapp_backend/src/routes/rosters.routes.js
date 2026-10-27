const express = require('express');
const router = express.Router();
const controller = require('../controllers/rosters.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// Consulta (Pública)
router.get('/', controller.obtenerRosters);
router.get('/:id', controller.obtenerRosterPorId);
router.get('/:id/jugadores', controller.obtenerJugadoresRoster);

// Operaciones de Administración (Protegidas para ADMIN + CSRF)
router.post('/', verificarToken, controller.crearRoster);
router.put('/:id', verificarToken, controller.actualizarRoster);
router.delete('/:id', verificarToken, controller.eliminarRoster);

// Asignaciones
router.post('/:id/jugadores', verificarToken, controller.asignarJugadorARoster);
router.put('/:id/jugadores/:id_jugador', verificarToken, controller.cambiarRolEnRoster);
router.delete('/:id/jugadores/:id_jugador', verificarToken, controller.quitarJugadorDeRoster);

module.exports = router;