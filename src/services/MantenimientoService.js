import { EstadoVehiculo } from '../models/index.js';

/**
 * Servicio de lógica de negocio para Mantenimientos
 * Implementa Dependency Injection - recibe múltiples repositorios como dependencias
 * Demuestra inyección de dependencias entre dos objetos (MantenimientoRepository y VehiculoRepository)
 */
class MantenimientoService {
  /**
   * Constructor con inyección de dependencias
   * @param {MantenimientoRepository} mantenimientoRepository - Repositorio de mantenimientos inyectado
   * @param {VehiculoRepository} vehiculoRepository - Repositorio de vehículos inyectado
   */
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
    // Verificar que el vehículo existe usando el repositorio inyectado
    const vehiculo = await this.vehiculoRepository.findById(vehiculoId);

    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    return await this.mantenimientoRepository.findByVehiculoId(vehiculoId);
  }

  async crear(mantenimientoData) {
    // Validar que el vehículo existe
    const vehiculo = await this.vehiculoRepository.findById(mantenimientoData.vehiculoId);

    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    // Validar que el vehículo no esté en uso
    if (vehiculo.estadoActual === 'En uso') {
      throw new Error('No se puede iniciar mantenimiento en un vehículo que está en uso');
    }

    // Crear el registro de estado asociado al mantenimiento (según feedback del profesor)
    const estadoVehiculo = await EstadoVehiculo.create({
      vehiculoId: mantenimientoData.vehiculoId,
      estado: 'En mantenimiento',
      observaciones: `Inicio de mantenimiento: ${mantenimientoData.descripcion}`,
      fecha: mantenimientoData.fechaInicio || new Date(),
    });

    // Crear el mantenimiento con la relación al estado
    const mantenimiento = await this.mantenimientoRepository.create({
      ...mantenimientoData,
      estadoVehiculoId: estadoVehiculo.id,
    });

    // Actualizar el estado del vehículo a "En mantenimiento"
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

    // Finalizar el mantenimiento
    const mantenimientoFinalizado = await this.mantenimientoRepository.finalizarMantenimiento(
      id,
      fechaFin || new Date(),
      costo
    );

    // Cambiar el estado del vehículo a "Disponible"
    await this.vehiculoRepository.updateEstado(
      mantenimiento.vehiculoId,
      'Disponible',
      `Mantenimiento finalizado: ${mantenimiento.descripcion}`
    );

    return mantenimientoFinalizado;
  }
}

export default MantenimientoService;
