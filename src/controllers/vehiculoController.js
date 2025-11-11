import serviceContainer from '../services/ServiceContainer.js';

const vehiculoService = serviceContainer.getVehiculoService();

export const obtenerTodos = async (req, res, next) => {
  try {
    const incluirHistorial = req.query.incluirHistorial === 'true';
    const vehiculos = await vehiculoService.obtenerTodos(incluirHistorial);

    res.json(vehiculos);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const incluirHistorial = req.query.incluirHistorial === 'true';

    const vehiculo = await vehiculoService.obtenerPorId(id, incluirHistorial);

    res.json(vehiculo);
  } catch (error) {
    if (error.message === 'Vehículo no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const { patente, marca, modelo, año, estadoActual } = req.body;

    if (!patente || !marca || !modelo || !año) {
      return res.status(400).json({
        error: 'Patente, marca, modelo y año son requeridos',
      });
    }

    const vehiculo = await vehiculoService.crear({
      patente,
      marca,
      modelo,
      año,
      estadoActual: estadoActual || 'Disponible',
    });

    res.status(201).json({
      mensaje: 'Vehículo creado exitosamente',
      vehiculo,
    });
  } catch (error) {
    if (error.message === 'Ya existe un vehículo con esta patente') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { patente, marca, modelo, año } = req.body;

    const vehiculo = await vehiculoService.actualizar(id, {
      patente,
      marca,
      modelo,
      año,
    });

    res.json({
      mensaje: 'Vehículo actualizado exitosamente',
      vehiculo,
    });
  } catch (error) {
    if (error.message === 'Vehículo no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    await vehiculoService.eliminar(id);

    res.json({
      mensaje: 'Vehículo eliminado exitosamente',
    });
  } catch (error) {
    if (error.message === 'Vehículo no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    if (!estado) {
      return res.status(400).json({
        error: 'El estado es requerido',
      });
    }

    const estadosValidos = ['Disponible', 'En uso', 'En mantenimiento', 'Dado de baja'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      });
    }

    const vehiculo = await vehiculoService.cambiarEstado(id, estado, observaciones || '');

    res.json({
      mensaje: 'Estado del vehículo actualizado exitosamente',
      vehiculo,
    });
  } catch (error) {
    if (error.message.includes('no puede')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Vehículo no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

export const obtenerPorEstado = async (req, res, next) => {
  try {
    const { estado } = req.params;

    const estadosValidos = ['Disponible', 'En uso', 'En mantenimiento', 'Dado de baja'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`,
      });
    }

    const vehiculos = await vehiculoService.obtenerPorEstado(estado);

    res.json(vehiculos);
  } catch (error) {
    next(error);
  }
};
