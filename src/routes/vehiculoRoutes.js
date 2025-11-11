import { Router } from 'express';
import * as vehiculoController from '../controllers/vehiculoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 */

// Obtener todos los vehículos
router.get('/', authenticate, vehiculoController.obtenerTodos);

// Obtener vehículos por estado
router.get('/estado/:estado', authenticate, vehiculoController.obtenerPorEstado);

// Obtener vehículo por ID
router.get('/:id', authenticate, vehiculoController.obtenerPorId);

// Crear vehículo (solo administradores)
router.post('/', authenticate, authorize('Administrador'), vehiculoController.crear);

// Actualizar vehículo (solo administradores)
router.put('/:id', authenticate, authorize('Administrador'), vehiculoController.actualizar);

// Eliminar vehículo (solo administradores)
router.delete('/:id', authenticate, authorize('Administrador'), vehiculoController.eliminar);

// Cambiar estado de vehículo (operadores y administradores)
router.patch('/:id/estado', authenticate, vehiculoController.cambiarEstado);

export default router;
