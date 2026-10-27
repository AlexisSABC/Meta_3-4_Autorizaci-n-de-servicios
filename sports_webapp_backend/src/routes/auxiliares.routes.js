const express = require('express');
const router = express.Router();
const controller = require('../controllers/auxiliares.controller');

router.get('/roles', controller.obtenerRoles);
router.get('/estados', controller.obtenerEstados);
router.get('/tipos-roster', controller.obtenerTiposRoster);
router.get('/health', controller.obtenerHealth);

module.exports = router;