import MantenimientoService from '../../src/services/MantenimientoService.js';

/**
 * Tests unitarios para MantenimientoService
 * Demuestra testing con múltiples dependencias inyectadas
 */

describe('MantenimientoService', () => {
  let mantenimientoService;
  let mockMantenimientoRepository;
  let mockVehiculoRepository;

  beforeEach(() => {
    // Mock de ambos repositorios
    mockMantenimientoRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByVehiculoId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      finalizarMantenimiento: jest.fn(),
    };

    mockVehiculoRepository = {
      findById: jest.fn(),
      updateEstado: jest.fn(),
    };

    // Crear servicio con múltiples dependencias inyectadas
    mantenimientoService = new MantenimientoService(
      mockMantenimientoRepository,
      mockVehiculoRepository
    );
  });

  describe('crear', () => {
    it('debe crear un mantenimiento y cambiar el estado del vehículo', async () => {
      const mantenimientoData = {
        vehiculoId: '123',
        fechaInicio: new Date(),
        descripcion: 'Cambio de aceite',
        costo: 5000,
      };

      const vehiculo = {
        id: '123',
        patente: 'ABC123',
        estadoActual: 'Disponible',
      };

      const mantenimientoCreado = {
        id: '456',
        ...mantenimientoData,
        estadoVehiculoId: '789',
      };

      mockVehiculoRepository.findById.mockResolvedValue(vehiculo);
      mockMantenimientoRepository.create.mockResolvedValue(mantenimientoCreado);
      mockVehiculoRepository.updateEstado.mockResolvedValue(vehiculo);

      const resultado = await mantenimientoService.crear(mantenimientoData);

      expect(mockVehiculoRepository.findById).toHaveBeenCalledWith('123');
      expect(mockMantenimientoRepository.create).toHaveBeenCalled();
      expect(mockVehiculoRepository.updateEstado).toHaveBeenCalledWith(
        '123',
        'En mantenimiento',
        expect.any(String)
      );
    });

    it('debe lanzar error si el vehículo no existe', async () => {
      const mantenimientoData = {
        vehiculoId: '999',
        fechaInicio: new Date(),
        descripcion: 'Cambio de aceite',
      };

      mockVehiculoRepository.findById.mockResolvedValue(null);

      await expect(mantenimientoService.crear(mantenimientoData)).rejects.toThrow(
        'Vehículo no encontrado'
      );
    });

    it('debe lanzar error si el vehículo está en uso', async () => {
      const mantenimientoData = {
        vehiculoId: '123',
        fechaInicio: new Date(),
        descripcion: 'Cambio de aceite',
      };

      const vehiculo = {
        id: '123',
        patente: 'ABC123',
        estadoActual: 'En uso',
      };

      mockVehiculoRepository.findById.mockResolvedValue(vehiculo);

      await expect(mantenimientoService.crear(mantenimientoData)).rejects.toThrow(
        'No se puede iniciar mantenimiento en un vehículo que está en uso'
      );
    });
  });

  describe('finalizar', () => {
    it('debe finalizar un mantenimiento y cambiar el estado del vehículo a Disponible', async () => {
      const mantenimientoId = '456';
      const mantenimiento = {
        id: mantenimientoId,
        vehiculoId: '123',
        descripcion: 'Cambio de aceite',
        fechaInicio: new Date(),
        fechaFin: null,
      };

      const mantenimientoFinalizado = {
        ...mantenimiento,
        fechaFin: new Date(),
        costo: 5000,
      };

      mockMantenimientoRepository.findById.mockResolvedValue(mantenimiento);
      mockMantenimientoRepository.finalizarMantenimiento.mockResolvedValue(mantenimientoFinalizado);
      mockVehiculoRepository.updateEstado.mockResolvedValue({});

      const resultado = await mantenimientoService.finalizar(mantenimientoId, new Date(), 5000);

      expect(mockMantenimientoRepository.finalizarMantenimiento).toHaveBeenCalledWith(
        mantenimientoId,
        expect.any(Date),
        5000
      );
      expect(mockVehiculoRepository.updateEstado).toHaveBeenCalledWith(
        '123',
        'Disponible',
        expect.any(String)
      );
    });

    it('debe lanzar error si el mantenimiento ya está finalizado', async () => {
      const mantenimiento = {
        id: '456',
        vehiculoId: '123',
        descripcion: 'Cambio de aceite',
        fechaInicio: new Date(),
        fechaFin: new Date(),
      };

      mockMantenimientoRepository.findById.mockResolvedValue(mantenimiento);

      await expect(
        mantenimientoService.finalizar('456', new Date(), 5000)
      ).rejects.toThrow('Este mantenimiento ya está finalizado');
    });
  });

  describe('obtenerPorVehiculo', () => {
    it('debe retornar los mantenimientos de un vehículo', async () => {
      const vehiculoId = '123';
      const vehiculo = { id: vehiculoId, patente: 'ABC123' };
      const mantenimientos = [
        { id: '1', vehiculoId, descripcion: 'Mantenimiento 1' },
        { id: '2', vehiculoId, descripcion: 'Mantenimiento 2' },
      ];

      mockVehiculoRepository.findById.mockResolvedValue(vehiculo);
      mockMantenimientoRepository.findByVehiculoId.mockResolvedValue(mantenimientos);

      const resultado = await mantenimientoService.obtenerPorVehiculo(vehiculoId);

      expect(mockVehiculoRepository.findById).toHaveBeenCalledWith(vehiculoId);
      expect(mockMantenimientoRepository.findByVehiculoId).toHaveBeenCalledWith(vehiculoId);
      expect(resultado).toEqual(mantenimientos);
    });
  });
});
