import { Usuario } from '../models/index.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

/**
 * Controlador de Usuarios
 * Maneja autenticación y gestión de usuarios
 */

/**
 * Registrar nuevo usuario
 */
export const registrar = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Nombre, email y password son requeridos',
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(409).json({
        error: 'El email ya está registrado',
      });
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'Operador',
    });

    // Generar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Iniciar sesión
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y password son requeridos',
      });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    // Verificar contraseña
    const passwordValido = await comparePassword(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
      });
    }

    // Generar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todos los usuarios (solo administradores)
 */
export const obtenerTodos = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
    });

    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener usuario por ID
 */
export const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar usuario
 */
export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    // Preparar datos de actualización
    const datosActualizacion = {
      nombre: nombre || usuario.nombre,
      email: email || usuario.email,
      rol: rol || usuario.rol,
    };

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      datosActualizacion.password = await hashPassword(password);
    }

    await usuario.update(datosActualizacion);

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar usuario
 */
export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    await usuario.destroy();

    res.json({
      mensaje: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const obtenerPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};
