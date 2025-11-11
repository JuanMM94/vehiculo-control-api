import { Router } from 'express';
import * as vehiculoController from '../controllers/vehiculoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, vehiculoController.obtenerTodos);

router.get('/estado/:estado', authenticate, vehiculoController.obtenerPorEstado);

router.get('/:id', authenticate, vehiculoController.obtenerPorId);

router.post('/', authenticate, authorize('Administrador'), vehiculoController.crear);

router.put('/:id', authenticate, authorize('Administrador'), vehiculoController.actualizar);

router.delete('/:id', authenticate, authorize('Administrador'), vehiculoController.eliminar);

router.patch('/:id/estado', authenticate, vehiculoController.cambiarEstado);

export default router;
