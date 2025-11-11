import serviceContainer from '../services/ServiceContainer.js';

const mantenimientoService = serviceContainer.getMantenimientoService();

/**
 * Controlador de Mantenimientos
 * Utiliza el servicio inyectado desde el contenedor de dependencias
 */

/**
 * Obtener todos los mantenimientos
 */
export const obtenerTodos = async (req, res, next) => {
  try {
    const mantenimientos = await mantenimientoService.obtenerTodos();

    res.json(mantenimientos);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener mantenimiento por ID
 */
export const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mantenimiento = await mantenimientoService.obtenerPorId(id);

    res.json(mantenimiento);
  } catch (error) {
    if (error.message === 'Mantenimiento no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Obtener mantenimientos de un vehículo
 */
export const obtenerPorVehiculo = async (req, res, next) => {
  try {
    const { vehiculoId } = req.params;

    const mantenimientos = await mantenimientoService.obtenerPorVehiculo(vehiculoId);

    res.json(mantenimientos);
  } catch (error) {
    if (error.message === 'Vehículo no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Crear nuevo mantenimiento
 */
export const crear = async (req, res, next) => {
  try {
    const { vehiculoId, fechaInicio, descripcion, costo } = req.body;

    // Validar campos requeridos
    if (!vehiculoId || !descripcion) {
      return res.status(400).json({
        error: 'VehiculoId y descripcion son requeridos',
      });
    }

    const mantenimiento = await mantenimientoService.crear({
      vehiculoId,
      fechaInicio: fechaInicio || new Date(),
      descripcion,
      costo: costo || null,
    });

    res.status(201).json({
      mensaje: 'Mantenimiento iniciado exitosamente',
      mantenimiento,
    });
  } catch (error) {
    if (error.message === 'Vehículo no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('no se puede')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Actualizar mantenimiento
 */
export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { descripcion, costo, fechaInicio } = req.body;

    const mantenimiento = await mantenimientoService.actualizar(id, {
      descripcion,
      costo,
      fechaInicio,
    });

    res.json({
      mensaje: 'Mantenimiento actualizado exitosamente',
      mantenimiento,
    });
  } catch (error) {
    if (error.message === 'Mantenimiento no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Eliminar mantenimiento
 */
export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    await mantenimientoService.eliminar(id);

    res.json({
      mensaje: 'Mantenimiento eliminado exitosamente',
    });
  } catch (error) {
    if (error.message === 'Mantenimiento no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Finalizar mantenimiento
 */
export const finalizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fechaFin, costo } = req.body;

    const mantenimiento = await mantenimientoService.finalizar(
      id,
      fechaFin || new Date(),
      costo
    );

    res.json({
      mensaje: 'Mantenimiento finalizado exitosamente',
      mantenimiento,
    });
  } catch (error) {
    if (error.message === 'Mantenimiento no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('ya está finalizado')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};
