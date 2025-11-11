import { EstadoVehiculo } from '../models/index.js';

class MantenimientoService {
  constructor(mantenimientoRepository, vehiculoRepository) {
    this.mantenimientoRepository = mantenimientoRepository;
    this.vehiculoRepository = vehiculoRepository;
  }

  async obtenerTodos() {
    return await this.mantenimientoRepository.findAll();
  }

  async obtenerPorId(id) {
    const mantenimiento = await this.mantenimientoRepository.findById(id);

    if (!mantenimiento) {
      throw new Error('Mantenimiento no encontrado');
    }

    return mantenimiento;
  }

  async obtenerPorVehiculo(vehiculoId) {
    const vehiculo = await this.vehiculoRepository.findById(vehiculoId);

    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    return await this.mantenimientoRepository.findByVehiculoId(vehiculoId);
  }

  async crear(mantenimientoData) {
    const vehiculo = await this.vehiculoRepository.findById(mantenimientoData.vehiculoId);

    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    if (vehiculo.estadoActual === 'En uso') {
      throw new Error('No se puede iniciar mantenimiento en un vehículo que está en uso');
    }

    const estadoVehiculo = await EstadoVehiculo.create({
      vehiculoId: mantenimientoData.vehiculoId,
      estado: 'En mantenimiento',
      observaciones: `Inicio de mantenimiento: ${mantenimientoData.descripcion}`,
      fecha: mantenimientoData.fechaInicio || new Date(),
    });

    const mantenimiento = await this.mantenimientoRepository.create({
      ...mantenimientoData,
      estadoVehiculoId: estadoVehiculo.id,
    });

    await this.vehiculoRepository.updateEstado(
      mantenimientoData.vehiculoId,
      'En mantenimiento',
      `Mantenimiento iniciado: ${mantenimientoData.descripcion}`
    );

    return mantenimiento;
  }

  async actualizar(id, mantenimientoData) {
    const mantenimiento = await this.mantenimientoRepository.update(id, mantenimientoData);

    if (!mantenimiento) {
      throw new Error('Mantenimiento no encontrado');
    }

    return mantenimiento;
  }

  async eliminar(id) {
    const eliminado = await this.mantenimientoRepository.delete(id);

    if (!eliminado) {
      throw new Error('Mantenimiento no encontrado');
    }

    return true;
  }

  async finalizar(id, fechaFin, costo) {
    const mantenimiento = await this.mantenimientoRepository.findById(id);

    if (!mantenimiento) {
      throw new Error('Mantenimiento no encontrado');
    }

    if (mantenimiento.fechaFin) {
      throw new Error('Este mantenimiento ya está finalizado');
    }

    const mantenimientoFinalizado = await this.mantenimientoRepository.finalizarMantenimiento(
      id,
      fechaFin || new Date(),
      costo
    );

    await this.vehiculoRepository.updateEstado(
      mantenimiento.vehiculoId,
      'Disponible',
      `Mantenimiento finalizado: ${mantenimiento.descripcion}`
    );

    return mantenimientoFinalizado;
  }
}

export default MantenimientoService;
