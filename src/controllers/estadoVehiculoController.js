import { EstadoVehiculo, Vehiculo } from '../models/index.js';

export const obtenerTodos = async (req, res, next) => {
  try {
    const estados = await EstadoVehiculo.findAll({
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          attributes: ['id', 'patente', 'marca', 'modelo'],
        }
      ],
      order: [['fecha', 'DESC']],
    });

    res.json(estados);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorVehiculo = async (req, res, next) => {
  try {
    const { vehiculoId } = req.params;

    const vehiculo = await Vehiculo.findByPk(vehiculoId);

    if (!vehiculo) {
      return res.status(404).json({
        error: 'Vehículo no encontrado',
      });
    }

    const estados = await EstadoVehiculo.findAll({
      where: { vehiculoId },
      order: [['fecha', 'DESC']],
    });

    res.json(estados);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const estado = await EstadoVehiculo.findByPk(id, {
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          attributes: ['id', 'patente', 'marca', 'modelo'],
        }
      ],
    });

    if (!estado) {
      return res.status(404).json({
        error: 'Estado no encontrado',
      });
    }

    res.json(estado);
  } catch (error) {
    next(error);
  }
};
