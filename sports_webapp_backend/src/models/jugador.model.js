const db = require('../config/db');

class JugadorModel {
  static async findAll({ rol, estado, search }) {
    let sql = 'SELECT id, nickname, nombre_real, pais, rol, estado FROM jugadores WHERE 1=1';
    const params = [];

    if (rol) {
      sql += ' AND rol = ?';
      params.push(rol);
    }
    if (estado) {
      sql += ' AND estado = ?';
      params.push(estado);
    }
    if (search) {
      sql += ' AND nickname LIKE ?';
      params.push(`%${search}%`);
    }

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM jugadores WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByNickname(nickname, excludeId = null) {
    let sql = 'SELECT * FROM jugadores WHERE nickname = ?';
    const params = [nickname];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await db.query(sql, params);
    return rows[0] || null;
  }

  static async create({ nickname, nombre_real, pais, rol, estado }) {
    const [result] = await db.query(
      'INSERT INTO jugadores (nickname, nombre_real, pais, rol, estado) VALUES (?, ?, ?, ?, ?)',
      [nickname, nombre_real || null, pais || null, rol, estado]
    );
    return this.findById(result.insertId);
  }

  static async update(id, { nickname, nombre_real, pais, rol, estado }) {
    await db.query(
      `UPDATE jugadores 
       SET nickname = COALESCE(?, nickname),
           nombre_real = COALESCE(?, nombre_real),
           pais = COALESCE(?, pais),
           rol = COALESCE(?, rol),
           estado = COALESCE(?, estado)
       WHERE id = ?`,
      [nickname, nombre_real, pais, rol, estado, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM jugadores WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = JugadorModel;