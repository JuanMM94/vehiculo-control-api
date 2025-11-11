import { verifyToken } from '../utils/auth.js';
import { Usuario } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No se proporcionó token de autenticación',
      });
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
      });
    }

    req.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: error.message || 'Token inválido',
    });
  }
};

export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuario no autenticado',
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        error: 'No tiene permisos para realizar esta acción',
      });
    }

    next();
  };
};
