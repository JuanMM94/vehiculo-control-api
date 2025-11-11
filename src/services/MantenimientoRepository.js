import { Mantenimiento, Vehiculo, EstadoVehiculo } from '../models/index.js';

class MantenimientoRepository {
  async findAll(options = {}) {
    return await Mantenimiento.findAll({
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
        },
        {
          model: EstadoVehiculo,
          as: 'estadoAsociado',
        }
      ],
      ...options,
    });
  }

  async findById(id) {
    return await Mantenimiento.findByPk(id, {
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
        },
        {
          model: EstadoVehiculo,
          as: 'estadoAsociado',
        }
      ],
    });
  }

  async findByVehiculoId(vehiculoId) {
    return await Mantenimiento.findAll({
      where: { vehiculoId },
      include: [
        {
          model: EstadoVehiculo,
          as: 'estadoAsociado',
        }
      ],
      order: [['fechaInicio', 'DESC']],
    });
  }

  async create(mantenimientoData) {
    return await Mantenimiento.create(mantenimientoData);
  }

  async update(id, mantenimientoData) {
    const mantenimiento = await this.findById(id);
    if (!mantenimiento) {
      return null;
    }
    return await mantenimiento.update(mantenimientoData);
  }

  async delete(id) {
    const mantenimiento = await this.findById(id);
    if (!mantenimiento) {
      return false;
    }
    await mantenimiento.destroy();
    return true;
  }

  async finalizarMantenimiento(id, fechaFin, costo) {
    const mantenimiento = await this.findById(id);
    if (!mantenimiento) {
      return null;
    }

    return await mantenimiento.update({
      fechaFin,
      costo: costo || mantenimiento.costo,
    });
  }
}

export default MantenimientoRepository;
