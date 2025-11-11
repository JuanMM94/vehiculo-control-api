import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

/**
 * Rutas públicas (sin autenticación)
 */
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

/**
 * Rutas protegidas (requieren autenticación)
 */
router.get('/perfil', authenticate, usuarioController.obtenerPerfil);

/**
 * Rutas de administración (solo administradores)
 */
router.get('/', authenticate, authorize('Administrador'), usuarioController.obtenerTodos);
router.get('/:id', authenticate, authorize('Administrador'), usuarioController.obtenerPorId);
router.put('/:id', authenticate, authorize('Administrador'), usuarioController.actualizar);
router.delete('/:id', authenticate, authorize('Administrador'), usuarioController.eliminar);

export default router;
