import { Vehiculo, EstadoVehiculo } from '../models/index.js';

/**
 * Repositorio para operaciones de acceso a datos de Vehículos
 * Patrón Repository - separa la lógica de acceso a datos
 */
class VehiculoRepository {
  async findAll(options = {}) {
    return await Vehiculo.findAll({
      include: options.includeHistorial ? [
        {
          model: EstadoVehiculo,
          as: 'historialEstados',
          order: [['fecha', 'DESC']],
        }
      ] : [],
      ...options,
    });
  }

  async findById(id, options = {}) {
    return await Vehiculo.findByPk(id, {
      include: options.includeHistorial ? [
        {
          model: EstadoVehiculo,
          as: 'historialEstados',
          order: [['fecha', 'DESC']],
        }
      ] : [],
    });
  }

  async findByPatente(patente) {
    return await Vehiculo.findOne({ where: { patente } });
  }

  async create(vehiculoData) {
    return await Vehiculo.create(vehiculoData);
  }

  async update(id, vehiculoData) {
    const vehiculo = await this.findById(id);
    if (!vehiculo) {
      return null;
    }
    return await vehiculo.update(vehiculoData);
  }

  async delete(id) {
    const vehiculo = await this.findById(id);
    if (!vehiculo) {
      return false;
    }
    await vehiculo.destroy();
    return true;
  }

  async updateEstado(id, nuevoEstado, observaciones = '') {
    const vehiculo = await this.findById(id);
    if (!vehiculo) {
      return null;
    }

    await vehiculo.update({ estadoActual: nuevoEstado });

    // Registrar el cambio en el historial
    await EstadoVehiculo.create({
      vehiculoId: id,
      estado: nuevoEstado,
      observaciones,
      fecha: new Date(),
    });

    return vehiculo;
  }
}

export default VehiculoRepository;
