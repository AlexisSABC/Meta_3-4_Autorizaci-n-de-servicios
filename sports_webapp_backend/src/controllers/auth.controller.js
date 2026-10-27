const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { adminUsers } = require('../../models');

/**
 * Genera un token CSRF criptográficamente seguro
 */
const generarTokenCSRF = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Login de administradores
 */
const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'El email del administrador es requerido' });
    }

    // Verificar si el usuario existe en la tabla de adminUsers
    const admin = await adminUsers.findOne({ where: { email: email.trim() } });

    if (!admin) {
      return res.status(401).json({ error: 'Credenciales de administrador inválidas' });
    }

    // Generar un token CSRF único para esta sesión
    const csrfToken = generarTokenCSRF();

    // Crear el payload del JWT
    const payload = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'ADMIN',
      apiKey: process.env.API_KEY,
      csrfToken: csrfToken
    };

    // Firmar el token JWT
    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    const maxAge = parseInt(process.env.COOKIE_MAX_AGE, 10) || 3600000;

    // Configurar cookie HTTP-Only para el token JWT (evita XSS)
    res.cookie('jwt_token', tokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge
    });

    // Configurar cookie para el token CSRF (accesible desde el cliente)
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

/**
 * Logout - Limpia las cookies
 */
const logout = (req, res) => {
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

/**
 * Verificar estado de sesión activa
 */
const verificarAuth = (req, res) => {
  return res.json({
    autenticado: true,
    usuario: req.usuario
  });
};

module.exports = {
  login,
  logout,
  verificarAuth
};