import { Router } from 'express';
import * as vehiculoController from '../controllers/vehiculoController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags: [Vehiculos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: incluirHistorial
 *         schema:
 *           type: boolean
 *         description: Incluir historial de estados
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 */
router.get('/', authenticate, vehiculoController.obtenerTodos);

/**
 * @swagger
 * /api/vehiculos/estado/{estado}:
 *   get:
 *     summary: Obtener vehículos por estado
 *     tags: [Vehiculos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Disponible, En uso, En mantenimiento, Dado de baja]
 *     responses:
 *       200:
 *         description: Lista de vehículos con el estado especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 */
router.get('/estado/:estado', authenticate, vehiculoController.obtenerPorEstado);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     tags: [Vehiculos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: incluirHistorial
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 */
router.get('/:id', authenticate, vehiculoController.obtenerPorId);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear un nuevo vehículo (Solo Administradores)
 *     tags: [Vehiculos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patente
 *               - marca
 *               - modelo
 *               - año
 *             properties:
 *               patente:
 *                 type: string
 *                 example: ABC123
 *               marca:
 *                 type: string
 *                 example: Toyota
 *               modelo:
 *                 type: string
 *                 example: Corolla
 *               año:
 *                 type: integer
 *                 example: 2023
 *               estadoActual:
 *                 type: string
 *                 enum: [Disponible, En uso, En mantenimiento, Dado de baja]
 *                 example: Disponible
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Error en los datos
 */
router.post('/', authenticate, authorize('Administrador'), vehiculoController.crear);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo (Solo Administradores)
 *     tags: [Vehiculos]
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
 *               patente:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               año:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 *       404:
 *         description: Vehículo no encontrado
 */
router.put('/:id', authenticate, authorize('Administrador'), vehiculoController.actualizar);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar vehículo (Solo Administradores)
 *     tags: [Vehiculos]
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
 *         description: Vehículo eliminado
 *       404:
 *         description: Vehículo no encontrado
 */
router.delete('/:id', authenticate, authorize('Administrador'), vehiculoController.eliminar);

/**
 * @swagger
 * /api/vehiculos/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de un vehículo
 *     tags: [Vehiculos]
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
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Disponible, En uso, En mantenimiento, Dado de baja]
 *                 example: En uso
 *               observaciones:
 *                 type: string
 *                 example: Asignado a proyecto X
 *     responses:
 *       200:
 *         description: Estado cambiado exitosamente
 *       400:
 *         description: Transición de estado no permitida
 *       404:
 *         description: Vehículo no encontrado
 */
router.patch('/:id/estado', authenticate, vehiculoController.cambiarEstado);

export default router;
