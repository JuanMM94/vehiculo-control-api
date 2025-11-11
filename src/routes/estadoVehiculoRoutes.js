import { Router } from 'express';
import * as estadoVehiculoController from '../controllers/estadoVehiculoController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, estadoVehiculoController.obtenerTodos);

router.get('/vehiculo/:vehiculoId', authenticate, estadoVehiculoController.obtenerPorVehiculo);

router.get('/:id', authenticate, estadoVehiculoController.obtenerPorId);

export default router;
