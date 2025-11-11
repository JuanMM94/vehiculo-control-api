import { Router } from 'express';
import * as mantenimientoController from '../controllers/mantenimientoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /api/mantenimientos:
 *   get:
 *     summary: Obtener todos los mantenimientos
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mantenimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mantenimiento'
 */
router.get('/', authenticate, mantenimientoController.obtenerTodos);

/**
 * @swagger
 * /api/mantenimientos/vehiculo/{vehiculoId}:
 *   get:
 *     summary: Obtener mantenimientos de un vehículo
 *     tags: [Mantenimientos]
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
 *         description: Lista de mantenimientos del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mantenimiento'
 *       404:
 *         description: Vehículo no encontrado
 */
router.get('/vehiculo/:vehiculoId', authenticate, mantenimientoController.obtenerPorVehiculo);

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   get:
 *     summary: Obtener mantenimiento por ID
 *     tags: [Mantenimientos]
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
 *         description: Mantenimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mantenimiento'
 *       404:
 *         description: Mantenimiento no encontrado
 */
router.get('/:id', authenticate, mantenimientoController.obtenerPorId);

/**
 * @swagger
 * /api/mantenimientos:
 *   post:
 *     summary: Crear un nuevo mantenimiento
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehiculoId
 *               - descripcion
 *             properties:
 *               vehiculoId:
 *                 type: string
 *                 format: uuid
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-01-10T10:00:00Z
 *               descripcion:
 *                 type: string
 *                 example: Cambio de aceite y filtros
 *               costo:
 *                 type: number
 *                 format: float
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Mantenimiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mantenimiento'
 *       400:
 *         description: Error - vehículo en uso o datos inválidos
 *       404:
 *         description: Vehículo no encontrado
 */
router.post('/', authenticate, mantenimientoController.crear);

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   put:
 *     summary: Actualizar mantenimiento (Solo Administradores)
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               costo:
 *                 type: number
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Mantenimiento actualizado
 *       404:
 *         description: Mantenimiento no encontrado
 */
router.put('/:id', authenticate, authorize('Administrador'), mantenimientoController.actualizar);

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   delete:
 *     summary: Eliminar mantenimiento (Solo Administradores)
 *     tags: [Mantenimientos]
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
 *         description: Mantenimiento eliminado
 *       404:
 *         description: Mantenimiento no encontrado
 */
router.delete('/:id', authenticate, authorize('Administrador'), mantenimientoController.eliminar);

/**
 * @swagger
 * /api/mantenimientos/{id}/finalizar:
 *   patch:
 *     summary: Finalizar un mantenimiento
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-01-11T16:00:00Z
 *               costo:
 *                 type: number
 *                 format: float
 *                 example: 5500
 *     responses:
 *       200:
 *         description: Mantenimiento finalizado exitosamente
 *       400:
 *         description: Mantenimiento ya finalizado
 *       404:
 *         description: Mantenimiento no encontrado
 */
router.patch('/:id/finalizar', authenticate, mantenimientoController.finalizar);

export default router;
