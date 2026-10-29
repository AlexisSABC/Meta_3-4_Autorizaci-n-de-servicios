import express from 'express';
import * as controller from '../controllers/jugadores.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', controller.obtenerJugadores);
router.get('/:id', controller.obtenerJugadorPorId);
router.post('/', verificarToken, controller.crearJugador);
router.put('/:id', verificarToken, controller.actualizarJugador);
router.delete('/:id', verificarToken, controller.eliminarJugador);

export default router;