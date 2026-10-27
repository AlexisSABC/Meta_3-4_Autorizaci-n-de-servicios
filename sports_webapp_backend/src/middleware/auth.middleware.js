const jwt = require('jsonwebtoken');

/**
 * Middleware para validar la API Key en las cabeceras (requerido para login)
 */
const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key no proporcionada' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }

  next();
};

/**
 * Middleware para verificar la cookie JWT y validar la protección CSRF
 */
const verificarToken = (req, res, next) => {
  try {
    // 1. Obtener el token JWT desde la cookie HTTP-Only
    const tokenJWT = req.cookies.jwt_token;

    if (!tokenJWT) {
      return res.status(401).json({ error: 'Acceso no autorizado: Token JWT no proporcionado' });
    }

    // 2. Obtener el token CSRF desde la cabecera personalizada
    const csrfToken = req.headers['x-csrf-token'];

    if (!csrfToken) {
      return res.status(401).json({ error: 'Acceso denegado: Token CSRF no proporcionado' });
    }

    // 3. Decodificar y verificar la firma del JWT
    const decoded = jwt.verify(tokenJWT, process.env.JWT_SECRET);

    // 4. Validar que el token CSRF coincida con el embebido en el JWT
    if (decoded.csrfToken !== csrfToken) {
      return res.status(401).json({ error: 'Acceso rechazado: Token CSRF inválido' });
    }

    // 5. Validar que la API Key coincida con la configuración
    if (decoded.apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'API Key inválida dentro del token' });
    }

    // 6. Validar que el usuario posea el rol ADMIN
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acceso prohibido: Requiere rol ADMIN' });
    }

    // Adjuntar la información decodificada a la solicitud
    req.usuario = decoded;

    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token JWT inválido' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token JWT expirado' });
    }

    return res.status(500).json({ error: 'Error interno en la autenticación' });
  }
};

module.exports = {
  validarApiKey,
  verificarToken
};