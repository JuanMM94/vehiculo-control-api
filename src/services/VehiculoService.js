/**
 * Servicio de lógica de negocio para Vehículos
 * Implementa Dependency Injection - recibe el repositorio como dependencia
 */
class VehiculoService {
  /**
   * Constructor con inyección de dependencias
   * @param {VehiculoRepository} vehiculoRepository - Repositorio inyectado
   */
  constructor(vehiculoRepository) {
    this.vehiculoRepository = vehiculoRepository;
  }

  async obtenerTodos(incluirHistorial = false) {
    return await this.vehiculoRepository.findAll({
      includeHistorial: incluirHistorial,
    });
  }

  async obtenerPorId(id, incluirHistorial = false) {
    const vehiculo = await this.vehiculoRepository.findById(id, {
      includeHistorial: incluirHistorial,
    });

    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    return vehiculo;
  }

  async crear(vehiculoData) {
    // Validar que no exista un vehículo con la misma patente
    const vehiculoExistente = await this.vehiculoRepository.findByPatente(vehiculoData.patente);

    if (vehiculoExistente) {
      throw new Error('Ya existe un vehículo con esta patente');
    }

    const vehiculo = await this.vehiculoRepository.create(vehiculoData);

    // Crear el primer registro de estado
    await this.vehiculoRepository.updateEstado(
      vehiculo.id,
      vehiculoData.estadoActual || 'Disponible',
      'Estado inicial del vehículo'
    );

    return vehiculo;
  }

  async actualizar(id, vehiculoData) {
    const vehiculo = await this.vehiculoRepository.update(id, vehiculoData);

    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    return vehiculo;
  }

  async eliminar(id) {
    const eliminado = await this.vehiculoRepository.delete(id);

    if (!eliminado) {
      throw new Error('Vehículo no encontrado');
    }

    return true;
  }

  async cambiarEstado(id, nuevoEstado, observaciones = '') {
    const vehiculo = await this.vehiculoRepository.findById(id);

    if (!vehiculo) {
      throw new Error('Vehículo no encontrado');
    }

    // Validación: un vehículo no puede estar "En uso" y "En mantenimiento" al mismo tiempo
    if (vehiculo.estadoActual === 'En uso' && nuevoEstado === 'En mantenimiento') {
      throw new Error('No se puede poner en mantenimiento un vehículo que está en uso. Primero márquelo como disponible.');
    }

    if (vehiculo.estadoActual === 'En mantenimiento' && nuevoEstado === 'En uso') {
      throw new Error('No se puede usar un vehículo que está en mantenimiento. Primero márquelo como disponible.');
    }

    return await this.vehiculoRepository.updateEstado(id, nuevoEstado, observaciones);
  }

  async obtenerPorEstado(estado) {
    return await this.vehiculoRepository.findAll({
      where: { estadoActual: estado },
    });
  }
}

export default VehiculoService;
