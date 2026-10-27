import express from 'express';
import * as controller from '../controllers/rosters.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', controller.obtenerRosters);
router.get('/:id', controller.obtenerRosterPorId);
router.get('/:id/jugadores', controller.obtenerJugadoresRoster);

router.post('/', verificarToken, controller.crearRoster);
router.put('/:id', verificarToken, controller.actualizarRoster);
router.delete('/:id', verificarToken, controller.eliminarRoster);

router.post('/:id/jugadores', verificarToken, controller.asignarJugadorARoster);
router.put('/:id/jugadores/:id_jugador', verificarToken, controller.cambiarRolEnRoster);
router.delete('/:id/jugadores/:id_jugador', verificarToken, controller.quitarJugadorDeRoster);

export default router;