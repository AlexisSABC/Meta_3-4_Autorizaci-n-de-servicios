import express from 'express';
import * as controller from '../controllers/auxiliares.controller.js';

const router = express.Router();

router.get('/roles', controller.obtenerRoles);
router.get('/estados', controller.obtenerEstados);
router.get('/tipos-roster', controller.obtenerTiposRoster);
router.get('/health', controller.obtenerHealth);

export default router;