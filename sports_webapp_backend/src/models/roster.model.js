import db from '../config/db.js';

class RosterModel {
  static async findAll({ tipo, temporada }) {
    let sql = `
      SELECT r.id, r.nombre, r.juego, r.tipo, r.temporada, 
             COUNT(rj.id_jugador) AS cantidad_jugadores
      FROM rosters r
      LEFT JOIN roster_jugadores rj ON r.id = rj.id_roster
      WHERE 1=1
    `;
    const params = [];

    if (tipo) {
      sql += ' AND r.tipo = ?';
      params.push(tipo);
    }
    if (temporada) {
      sql += ' AND r.temporada = ?';
      params.push(temporada);
    }

    sql += ' GROUP BY r.id';
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM rosters WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create({ nombre, juego, tipo, temporada }) {
    const [result] = await db.query(
      'INSERT INTO rosters (nombre, juego, tipo, temporada) VALUES (?, ?, ?, ?)',
      [nombre, juego, tipo, temporada]
    );
    return this.findById(result.insertId);
  }

  static async update(id, { nombre, juego, tipo, temporada }) {
    await db.query(
      `UPDATE rosters 
       SET nombre = COALESCE(?, nombre),
           juego = COALESCE(?, juego),
           tipo = COALESCE(?, tipo),
           temporada = COALESCE(?, temporada)
       WHERE id = ?`,
      [nombre, juego, tipo, temporada, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM rosters WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // --- Métodos de Asignación de Jugadores ---

  static async findJugadoresByRoster(id_roster) {
    const [rows] = await db.query(
      `SELECT j.id, j.nickname, j.nombre_real, j.pais, j.rol, rj.rol_en_roster
       FROM roster_jugadores rj
       JOIN jugadores j ON rj.id_jugador = j.id
       WHERE rj.id_roster = ?`,
      [id_roster]
    );
    return rows;
  }

  static async findAsignacion(id_roster, id_jugador) {
    const [rows] = await db.query(
      'SELECT * FROM roster_jugadores WHERE id_roster = ? AND id_jugador = ?',
      [id_roster, id_jugador]
    );
    return rows[0] || null;
  }

  static async getTitulares(id_roster, excludeJugadorId = null) {
    let sql = `
      SELECT j.id, j.rol 
      FROM roster_jugadores rj
      JOIN jugadores j ON rj.id_jugador = j.id
      WHERE rj.id_roster = ? AND rj.rol_en_roster = 'Titular'
    `;
    const params = [id_roster];

    if (excludeJugadorId) {
      sql += ' AND rj.id_jugador != ?';
      params.push(excludeJugadorId);
    }

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async asignarJugador(id_roster, id_jugador, rol_en_roster) {
    await db.query(
      'INSERT INTO roster_jugadores (id_roster, id_jugador, rol_en_roster) VALUES (?, ?, ?)',
      [id_roster, id_jugador, rol_en_roster]
    );
  }

  static async actualizarRolJugador(id_roster, id_jugador, rol_en_roster) {
    await db.query(
      'UPDATE roster_jugadores SET rol_en_roster = ? WHERE id_roster = ? AND id_jugador = ?',
      [rol_en_roster, id_roster, id_jugador]
    );
  }

  static async quitarJugador(id_roster, id_jugador) {
    const [result] = await db.query(
      'DELETE FROM roster_jugadores WHERE id_roster = ? AND id_jugador = ?',
      [id_roster, id_jugador]
    );
    return result.affectedRows > 0;
  }
}

export default RosterModel;