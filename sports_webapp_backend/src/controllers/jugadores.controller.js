const JugadoresService = require('../services/jugadores.service');

exports.obtenerJugadores = async (req, res) => {
  try {
    const jugadores = await JugadoresService.obtenerJugadores(req.query);
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

exports.obtenerJugadorPorId = async (req, res) => {
  try {
    const jugador = await JugadoresService.obtenerJugadorPorId(req.params.id);
    return res.status(200).json(jugador);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

exports.crearJugador = async (req, res) => {
  try {
    const nuevo = await JugadoresService.crearJugador(req.body);
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

exports.actualizarJugador = async (req, res) => {
  try {
    const actualizado = await JugadoresService.actualizarJugador(req.params.id, req.body);
    return res.status(200).json(actualizado);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

exports.eliminarJugador = async (req, res) => {
  try {
    await JugadoresService.eliminarJugador(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};