import { Router } from 'express';
import * as estadoVehiculoController from '../controllers/estadoVehiculoController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /api/estados:
 *   get:
 *     summary: Obtener todo el historial de estados
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los estados históricos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstadoVehiculo'
 */
router.get('/', authenticate, estadoVehiculoController.obtenerTodos);

/**
 * @swagger
 * /api/estados/vehiculo/{vehiculoId}:
 *   get:
 *     summary: Obtener historial de estados de un vehículo
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehiculoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Historial de estados del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EstadoVehiculo'
 *       404:
 *         description: Vehículo no encontrado
 */
router.get('/vehiculo/:vehiculoId', authenticate, estadoVehiculoController.obtenerPorVehiculo);

/**
 * @swagger
 * /api/estados/{id}:
 *   get:
 *     summary: Obtener estado por ID
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Estado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoVehiculo'
 *       404:
 *         description: Estado no encontrado
 */
router.get('/:id', authenticate, estadoVehiculoController.obtenerPorId);

export default router;
