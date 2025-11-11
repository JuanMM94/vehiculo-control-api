import VehiculoRepository from './VehiculoRepository.js';
import MantenimientoRepository from './MantenimientoRepository.js';
import VehiculoService from './VehiculoService.js';
import MantenimientoService from './MantenimientoService.js';

class ServiceContainer {
  constructor() {
    this.vehiculoRepository = new VehiculoRepository();
    this.mantenimientoRepository = new MantenimientoRepository();

    this.vehiculoService = new VehiculoService(this.vehiculoRepository);

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

const serviceContainer = new ServiceContainer();

export default serviceContainer;
