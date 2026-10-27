import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';

const { adminUsers } = db;

export const generarTokenCSRF = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'El email del administrador es requerido' });
    }

    const admin = await adminUsers.findOne({ where: { email: email.trim() } });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciales de administrador inválidas' });
    }

    const csrfToken = generarTokenCSRF();

    const payload = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'ADMIN',
      apiKey: process.env.API_KEY,
      csrfToken: csrfToken
    };

    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    const maxAge = parseInt(process.env.COOKIE_MAX_AGE, 10) || 3600000;

    res.cookie('jwt_token', tokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge
    });

    res.cookie('csrf_token', csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge
    });

    return res.json({
      mensaje: 'Login de administrador exitoso',
      usuario: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'ADMIN'
      },
      csrfToken: csrfToken
    });
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    return res.status(500).json({ error: 'Error interno en el inicio de sesión' });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.clearCookie('csrf_token', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.json({ mensaje: 'Cierre de sesión exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    return res.status(500).json({ error: 'Error en el proceso de cierre de sesión' });
  }
};

export const verificarAuth = (req, res) => {
  return res.json({
    autenticado: true,
    usuario: req.usuario
  });
};