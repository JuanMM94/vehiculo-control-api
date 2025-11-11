import { Router } from 'express';
import * as mantenimientoController from '../controllers/mantenimientoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, mantenimientoController.obtenerTodos);

router.get('/vehiculo/:vehiculoId', authenticate, mantenimientoController.obtenerPorVehiculo);

router.get('/:id', authenticate, mantenimientoController.obtenerPorId);

router.post('/', authenticate, mantenimientoController.crear);

router.put('/:id', authenticate, authorize('Administrador'), mantenimientoController.actualizar);

router.delete('/:id', authenticate, authorize('Administrador'), mantenimientoController.eliminar);

router.patch('/:id/finalizar', authenticate, mantenimientoController.finalizar);

export default router;
