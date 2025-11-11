import VehiculoRepository from './VehiculoRepository.js';
import MantenimientoRepository from './MantenimientoRepository.js';
import VehiculoService from './VehiculoService.js';
import MantenimientoService from './MantenimientoService.js';

/**
 * Service Container / Dependency Injection Container
 * Maneja la creación e inyección de dependencias de forma centralizada
 */
class ServiceContainer {
  constructor() {
    // Inicializar repositorios (capa de acceso a datos)
    this.vehiculoRepository = new VehiculoRepository();
    this.mantenimientoRepository = new MantenimientoRepository();

    // Inicializar servicios con dependencias inyectadas
    this.vehiculoService = new VehiculoService(this.vehiculoRepository);

    // MantenimientoService recibe dos dependencias inyectadas
    this.mantenimientoService = new MantenimientoService(
      this.mantenimientoRepository,
      this.vehiculoRepository
    );
  }

  getVehiculoService() {
    return this.vehiculoService;
  }

  getMantenimientoService() {
    return this.mantenimientoService;
  }

  getVehiculoRepository() {
    return this.vehiculoRepository;
  }

  getMantenimientoRepository() {
    return this.mantenimientoRepository;
  }
}

// Exportar una instancia singleton del contenedor
const serviceContainer = new ServiceContainer();

export default serviceContainer;
