import { Router } from 'express';
import * as mantenimientoController from '../controllers/mantenimientoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 */

// Obtener todos los mantenimientos
router.get('/', authenticate, mantenimientoController.obtenerTodos);

// Obtener mantenimientos de un vehículo
router.get('/vehiculo/:vehiculoId', authenticate, mantenimientoController.obtenerPorVehiculo);

// Obtener mantenimiento por ID
router.get('/:id', authenticate, mantenimientoController.obtenerPorId);

// Crear mantenimiento (operadores y administradores)
router.post('/', authenticate, mantenimientoController.crear);

// Actualizar mantenimiento (solo administradores)
router.put('/:id', authenticate, authorize('Administrador'), mantenimientoController.actualizar);

// Eliminar mantenimiento (solo administradores)
router.delete('/:id', authenticate, authorize('Administrador'), mantenimientoController.eliminar);

// Finalizar mantenimiento (operadores y administradores)
router.patch('/:id/finalizar', authenticate, mantenimientoController.finalizar);

export default router;
