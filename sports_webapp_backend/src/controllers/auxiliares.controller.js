const { ROLES, ESTADOS, TIPOS_ROSTER } = require('../constants/enums');

exports.obtenerRoles = (req, res) => res.status(200).json(ROLES);
exports.obtenerEstados = (req, res) => res.status(200).json(ESTADOS);
exports.obtenerTiposRoster = (req, res) => res.status(200).json(TIPOS_ROSTER);
exports.obtenerHealth = (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });