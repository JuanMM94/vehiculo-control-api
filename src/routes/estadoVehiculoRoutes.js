import { Router } from 'express';
import * as estadoVehiculoController from '../controllers/estadoVehiculoController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 * Estas rutas son de solo lectura (historial)
 */

// Obtener todo el historial de estados
router.get('/', authenticate, estadoVehiculoController.obtenerTodos);

// Obtener historial de un vehículo específico
router.get('/vehiculo/:vehiculoId', authenticate, estadoVehiculoController.obtenerPorVehiculo);

// Obtener un estado específico por ID
router.get('/:id', authenticate, estadoVehiculoController.obtenerPorId);

export default router;
