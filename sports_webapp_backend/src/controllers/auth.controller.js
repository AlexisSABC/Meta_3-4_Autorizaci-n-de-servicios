import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import db from '../../models/index.js';

const { adminUsers, generalUsers } = db;

// Cliente de Google OAuth 2.0
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'https://localhost:3000/auth/google/callback'
  );
};

export const generarTokenCSRF = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Login tradicional de administrador
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
      sameSite: 'lax',
      maxAge: maxAge
    });

    res.cookie('csrf_token', csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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

// --- Google OAuth 2.0 Controllers ---

// GET /auth/google/login
export const googleLogin = (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    });

    // Redirigir directamente al usuario o enviar la URL según se prefiera
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect(authUrl);
    }
    return res.json({ url: authUrl });
  } catch (error) {
    console.error('Error al generar URL de Google Auth:', error);
    return res.status(500).json({ error: 'Error al iniciar autenticación con Google' });
  }
};

// GET /auth/google/callback
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Código de autorización no proporcionado' });
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Obtener información del usuario desde la API de Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Buscar o registrar usuario en la tabla generalUsers
    let usuario = await generalUsers.findOne({
      where: { email: data.email }
    });

    if (usuario) {
      // Actualizar información existente
      await usuario.update({
        googleId: data.id,
        name: data.name || usuario.name,
        avatar: data.picture || usuario.avatar,
        ultimoAcceso: new Date()
      });
    } else {
      // Crear nuevo registro
      usuario = await generalUsers.create({
        googleId: data.id,
        name: data.name,
        email: data.email,
        avatar: data.picture,
        ultimoAcceso: new Date()
      });
    }

    // Generar tokens JWT y CSRF
    const csrfToken = generarTokenCSRF();
    const payload = {
      id: usuario.id,
      googleId: usuario.googleId,
      name: usuario.name,
      email: usuario.email,
      role: 'USER',
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
      sameSite: 'lax',
      maxAge: maxAge
    });

    res.cookie('csrf_token', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge
    });

    return res.json({
      mensaje: 'Autenticación con Google exitosa',
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        avatar: usuario.avatar,
        role: 'USER'
      },
      csrfToken: csrfToken
    });
  } catch (error) {
    console.error('Error en callback de Google OAuth:', error);
    return res.status(500).json({ error: 'Error durante la autenticación con Google' });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('jwt_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.clearCookie('csrf_token', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
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