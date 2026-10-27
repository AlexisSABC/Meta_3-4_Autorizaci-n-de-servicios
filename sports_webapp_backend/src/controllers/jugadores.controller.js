import JugadoresService from '../services/jugadores.service.js';

export const obtenerJugadores = async (req, res) => {
  try {
    const jugadores = await JugadoresService.obtenerJugadores(req.query);
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const obtenerJugadorPorId = async (req, res) => {
  try {
    const jugador = await JugadoresService.obtenerJugadorPorId(req.params.id);
    return res.status(200).json(jugador);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const crearJugador = async (req, res) => {
  try {
    const nuevo = await JugadoresService.crearJugador(req.body);
    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const actualizarJugador = async (req, res) => {
  try {
    const actualizado = await JugadoresService.actualizarJugador(req.params.id, req.body);
    return res.status(200).json(actualizado);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const eliminarJugador = async (req, res) => {
  try {
    await JugadoresService.eliminarJugador(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};