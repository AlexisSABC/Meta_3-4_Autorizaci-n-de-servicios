const RosterModel = require('../models/roster.model');
const JugadorModel = require('../models/jugador.model');
const { TIPOS_ROSTER, ROLES_EN_ROSTER } = require('../constants/enums');
const CustomError = require('../utils/customError');

class RostersService {
  static async obtenerRosters(filters) {
    return await RosterModel.findAll(filters);
  }

  static async obtenerRosterPorId(id) {
    const roster = await RosterModel.findById(id);
    if (!roster) {
      throw new CustomError('Roster no encontrado', 404);
    }
    const jugadores = await RosterModel.findJugadoresByRoster(id);
    return { ...roster, jugadores };
  }

  static async crearRoster(data) {
    const { nombre, juego = 'League of Legends', tipo = 'Principal', temporada } = data;

    if (!nombre || nombre.trim() === '') {
      throw new CustomError('El nombre del roster es obligatorio', 400);
    }
    if (!temporada) {
      throw new CustomError('La temporada es obligatoria', 400);
    }
    if (!TIPOS_ROSTER.includes(tipo)) {
      throw new CustomError(`Tipo de roster inválido. Permitidos: ${TIPOS_ROSTER.join(', ')}`, 400);
    }

    return await RosterModel.create({ nombre, juego, tipo, temporada });
  }

  static async actualizarRoster(id, data) {
    await this.obtenerRosterPorId(id); // Lanza 404 si no existe

    if (data.tipo && !TIPOS_ROSTER.includes(data.tipo)) {
      throw new CustomError(`Tipo de roster inválido. Permitidos: ${TIPOS_ROSTER.join(', ')}`, 400);
    }

    return await RosterModel.update(id, data);
  }

  static async eliminarRoster(id) {
    await this.obtenerRosterPorId(id); // Lanza 404 si no existe
    // RN-05: Al eliminar el roster, la relación en DB se elimina por CASCADE pero los jugadores permanecen intactos
    await RosterModel.delete(id);
  }

  // --- Asignación y Reglas de Negocio (RN-02 y RN-03) ---

  static async obtenerJugadoresRoster(id_roster) {
    await this.obtenerRosterPorId(id_roster); // Lanza 404 si el roster no existe
    return await RosterModel.findJugadoresByRoster(id_roster);
  }

  static async asignarJugadorARoster(id_roster, id_jugador, rol_en_roster) {
    if (!id_jugador || !rol_en_roster) {
      throw new CustomError('id_jugador y rol_en_roster son obligatorios', 400);
    }
    if (!ROLES_EN_ROSTER.includes(rol_en_roster)) {
      throw new CustomError('rol_en_roster debe ser Titular o Suplente', 400);
    }

    // Verificar existencia de roster y jugador
    await this.obtenerRosterPorId(id_roster);
    const jugador = await JugadorModel.findById(id_jugador);
    if (!jugador) {
      throw new CustomError('Jugador no encontrado', 404);
    }

    // Verificar si ya está asignado
    const yaAsignado = await RosterModel.findAsignacion(id_roster, id_jugador);
    if (yaAsignado) {
      throw new CustomError('El jugador ya pertenece a este roster', 409);
    }

    // Validar reglas si la asignación es como Titular
    if (rol_en_roster === 'Titular') {
      const titularesActuales = await RosterModel.getTitulares(id_roster);

      // RN-02: Máximo 5 titulares
      if (titularesActuales.length >= 5) {
        throw new CustomError('El roster ya tiene el límite máximo de 5 titulares (RN-02)', 409);
      }

      // RN-03: No dos titulares con el mismo rol
      const mismoRol = titularesActuales.some(t => t.rol === jugador.rol);
      if (mismoRol) {
        throw new CustomError(`Ya existe un titular en el roster con el rol '${jugador.rol}' (RN-03)`, 409);
      }
    }

    await RosterModel.asignarJugador(id_roster, id_jugador, rol_en_roster);
    return {
      message: 'Jugador asignado exitosamente',
      id_roster: Number(id_roster),
      id_jugador: Number(id_jugador),
      rol_en_roster
    };
  }

  static async cambiarRolEnRoster(id_roster, id_jugador, rol_en_roster) {
    if (!rol_en_roster || !ROLES_EN_ROSTER.includes(rol_en_roster)) {
      throw new CustomError('rol_en_roster debe ser Titular o Suplente', 400);
    }

    const asignacion = await RosterModel.findAsignacion(id_roster, id_jugador);
    if (!asignacion) {
      throw new CustomError('El jugador no pertenece a este roster', 404);
    }

    if (rol_en_roster === 'Titular' && asignacion.rol_en_roster !== 'Titular') {
      const jugador = await JugadorModel.findById(id_jugador);
      const titularesActuales = await RosterModel.getTitulares(id_roster, id_jugador);

      // RN-02: Máximo 5 titulares
      if (titularesActuales.length >= 5) {
        throw new CustomError('El roster ya tiene el límite máximo de 5 titulares (RN-02)', 409);
      }

      // RN-03: No dos titulares con el mismo rol
      const mismoRol = titularesActuales.some(t => t.rol === jugador.rol);
      if (mismoRol) {
        throw new CustomError(`Ya existe un titular en el roster con el rol '${jugador.rol}' (RN-03)`, 409);
      }
    }

    await RosterModel.actualizarRolJugador(id_roster, id_jugador, rol_en_roster);
    return { message: 'Rol en roster actualizado exitosamente', rol_en_roster };
  }

  static async quitarJugadorDeRoster(id_roster, id_jugador) {
    const eliminado = await RosterModel.quitarJugador(id_roster, id_jugador);
    if (!eliminado) {
      throw new CustomError('El jugador no se encuentra en el roster especificado', 404);
    }
  }
}

module.exports = RostersService;