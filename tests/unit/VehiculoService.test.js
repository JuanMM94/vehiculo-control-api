import VehiculoService from '../../src/services/VehiculoService.js';

/**
 * Tests unitarios para VehiculoService
 * Demuestran el testing de la lógica de negocio
 */

describe('VehiculoService', () => {
  let vehiculoService;
  let mockRepository;

  beforeEach(() => {
    // Mock del repositorio (simula la capa de acceso a datos)
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByPatente: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateEstado: jest.fn(),
    };

    // Crear servicio con repositorio mockeado (Dependency Injection en testing)
    vehiculoService = new VehiculoService(mockRepository);
  });

  describe('crear', () => {
    it('debe crear un vehículo exitosamente', async () => {
      const vehiculoData = {
        patente: 'ABC123',
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2023,
        estadoActual: 'Disponible',
      };

      const vehiculoCreado = { id: '123', ...vehiculoData };

      mockRepository.findByPatente.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(vehiculoCreado);
      mockRepository.updateEstado.mockResolvedValue(vehiculoCreado);

      const resultado = await vehiculoService.crear(vehiculoData);

      expect(mockRepository.findByPatente).toHaveBeenCalledWith('ABC123');
      expect(mockRepository.create).toHaveBeenCalledWith(vehiculoData);
      expect(resultado).toEqual(vehiculoCreado);
    });

    it('debe lanzar error si la patente ya existe', async () => {
      const vehiculoData = {
        patente: 'ABC123',
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2023,
      };

      mockRepository.findByPatente.mockResolvedValue({ id: '456', patente: 'ABC123' });

      await expect(vehiculoService.crear(vehiculoData)).rejects.toThrow(
        'Ya existe un vehículo con esta patente'
      );
    });
  });

  describe('cambiarEstado', () => {
    it('debe cambiar el estado del vehículo exitosamente', async () => {
      const vehiculoId = '123';
      const vehiculoExistente = {
        id: vehiculoId,
        patente: 'ABC123',
        estadoActual: 'Disponible',
      };

      mockRepository.findById.mockResolvedValue(vehiculoExistente);
      mockRepository.updateEstado.mockResolvedValue({
        ...vehiculoExistente,
        estadoActual: 'En uso',
      });

      const resultado = await vehiculoService.cambiarEstado(vehiculoId, 'En uso', 'Asignado a proyecto X');

      expect(mockRepository.updateEstado).toHaveBeenCalledWith(vehiculoId, 'En uso', 'Asignado a proyecto X');
      expect(resultado.estadoActual).toBe('En uso');
    });

    it('debe lanzar error si se intenta poner en mantenimiento un vehículo en uso', async () => {
      const vehiculoId = '123';
      const vehiculoExistente = {
        id: vehiculoId,
        patente: 'ABC123',
        estadoActual: 'En uso',
      };

      mockRepository.findById.mockResolvedValue(vehiculoExistente);

      await expect(
        vehiculoService.cambiarEstado(vehiculoId, 'En mantenimiento', 'Requiere revisión')
      ).rejects.toThrow('No se puede poner en mantenimiento un vehículo que está en uso');
    });

    it('debe lanzar error si se intenta usar un vehículo en mantenimiento', async () => {
      const vehiculoId = '123';
      const vehiculoExistente = {
        id: vehiculoId,
        patente: 'ABC123',
        estadoActual: 'En mantenimiento',
      };

      mockRepository.findById.mockResolvedValue(vehiculoExistente);

      await expect(
        vehiculoService.cambiarEstado(vehiculoId, 'En uso', 'Asignar a proyecto')
      ).rejects.toThrow('No se puede usar un vehículo que está en mantenimiento');
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar un vehículo por ID', async () => {
      const vehiculo = {
        id: '123',
        patente: 'ABC123',
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2023,
      };

      mockRepository.findById.mockResolvedValue(vehiculo);

      const resultado = await vehiculoService.obtenerPorId('123');

      expect(resultado).toEqual(vehiculo);
      expect(mockRepository.findById).toHaveBeenCalledWith('123', { includeHistorial: false });
    });

    it('debe lanzar error si el vehículo no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(vehiculoService.obtenerPorId('999')).rejects.toThrow(
        'Vehículo no encontrado'
      );
    });
  });
});
