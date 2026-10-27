import jwt from 'jsonwebtoken';

export const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key no proporcionada' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }

  next();
};

export const verificarToken = (req, res, next) => {
  try {
    const tokenJWT = req.cookies.jwt_token;

    if (!tokenJWT) {
      return res.status(401).json({ error: 'Acceso no autorizado: Token JWT no proporcionado' });
    }

    const csrfToken = req.headers['x-csrf-token'];

    if (!csrfToken) {
      return res.status(401).json({ error: 'Acceso denegado: Token CSRF no proporcionado' });
    }

    const decoded = jwt.verify(tokenJWT, process.env.JWT_SECRET);

    if (decoded.csrfToken !== csrfToken) {
      return res.status(401).json({ error: 'Acceso rechazado: Token CSRF inválido' });
    }

    if (decoded.apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'API Key inválida dentro del token' });
    }

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acceso prohibido: Requiere rol ADMIN' });
    }

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