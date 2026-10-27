import RostersService from '../services/rosters.service.js';

export const obtenerRosters = async (req, res) => {
  try {
    const rosters = await RostersService.obtenerRosters(req.query);
    return res.status(200).json(rosters);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const obtenerRosterPorId = async (req, res) => {
  try {
    const roster = await RostersService.obtenerRosterPorId(req.params.id);
    return res.status(200).json(roster);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const crearRoster = async (req, res) => {
  try {
    const nuevo = await RostersService.crearRoster(req.body);
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const actualizarRoster = async (req, res) => {
  try {
    const actualizado = await RostersService.actualizarRoster(req.params.id, req.body);
    return res.status(200).json(actualizado);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const eliminarRoster = async (req, res) => {
  try {
    await RostersService.eliminarRoster(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const obtenerJugadoresRoster = async (req, res) => {
  try {
    const jugadores = await RostersService.obtenerJugadoresRoster(req.params.id);
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const asignarJugadorARoster = async (req, res) => {
  try {
    const resultado = await RostersService.asignarJugadorARoster(
      req.params.id,
      req.body.id_jugador,
      req.body.rol_en_roster
    );
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const cambiarRolEnRoster = async (req, res) => {
  try {
    const resultado = await RostersService.cambiarRolEnRoster(
      req.params.id,
      req.params.id_jugador,
      req.body.rol_en_roster
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const quitarJugadorDeRoster = async (req, res) => {
  try {
    await RostersService.quitarJugadorDeRoster(req.params.id, req.params.id_jugador);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};