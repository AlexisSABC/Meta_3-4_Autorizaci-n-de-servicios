import { ROLES, ESTADOS, TIPOS_ROSTER } from '../constants/enums.js';

export const obtenerRoles = (req, res) => res.status(200).json(ROLES);
export const obtenerEstados = (req, res) => res.status(200).json(ESTADOS);
export const obtenerTiposRoster = (req, res) => res.status(200).json(TIPOS_ROSTER);
export const obtenerHealth = (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });