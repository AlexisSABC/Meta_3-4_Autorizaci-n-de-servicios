import JugadorModel from '../models/jugador.model.js';
import { ROLES, ESTADOS } from '../constants/enums.js';
import CustomError from '../utils/customError.js';

class JugadoresService {
  static async obtenerJugadores(filters) {
    return await JugadorModel.findAll(filters);
  }

  static async obtenerJugadorPorId(id) {
    const jugador = await JugadorModel.findById(id);
    if (!jugador) {
      throw new CustomError('Jugador no encontrado', 404);
    }
    return jugador;
  }

  static async crearJugador(data) {
    const { nickname, nombre_real, pais, rol, estado = 'activo' } = data;

    if (!nickname || nickname.trim() === '') {
      throw new CustomError('El nickname es obligatorio', 400);
    }
    if (!rol || !ROLES.includes(rol)) {
      throw new CustomError(`El rol es inválido. Valores permitidos: ${ROLES.join(', ')}`, 400);
    }
    if (!ESTADOS.includes(estado)) {
      throw new CustomError(`El estado es inválido. Valores permitidos: ${ESTADOS.join(', ')}`, 400);
    }

    // RN-01: Nickname único
    const existe = await JugadorModel.findByNickname(nickname);
    if (existe) {
      throw new CustomError('El nickname ya se encuentra registrado (RN-01)', 409);
    }

    return await JugadorModel.create({ nickname, nombre_real, pais, rol, estado });
  }

  static async actualizarJugador(id, data) {
    await this.obtenerJugadorPorId(id); // Lanza 404 si no existe

    const { nickname, rol, estado } = data;

    if (rol && !ROLES.includes(rol)) {
      throw new CustomError(`El rol es inválido. Valores permitidos: ${ROLES.join(', ')}`, 400);
    }
    if (estado && !ESTADOS.includes(estado)) {
      throw new CustomError(`El estado es inválido. Valores permitidos: ${ESTADOS.join(', ')}`, 400);
    }

    // RN-01: Nickname único al actualizar
    if (nickname) {
      const existe = await JugadorModel.findByNickname(nickname, id);
      if (existe) {
        throw new CustomError('El nickname ya está en uso por otro jugador (RN-01)', 409);
      }
    }

    return await JugadorModel.update(id, data);
  }

  static async eliminarJugador(id) {
    await this.obtenerJugadorPorId(id); // Lanza 404 si no existe
    await JugadorModel.delete(id);
  }
}

export default JugadoresService;