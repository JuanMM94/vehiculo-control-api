import { verifyToken } from '../utils/auth.js';
import { Usuario } from '../models/index.js';

/**
 * Middleware de autenticación JWT
 * Verifica que el usuario esté autenticado
 */
export const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No se proporcionó token de autenticación',
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar y decodificar el token
    const decoded = verifyToken(token);

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
      });
    }

    // Agregar usuario al request para usarlo en los controladores
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

/**
 * Middleware de autorización por rol
 * Verifica que el usuario tenga el rol requerido
 * @param {...string} rolesPermitidos - Roles que pueden acceder
 */
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
