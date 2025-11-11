import Usuario from './Usuario.js';
import Vehiculo from './Vehiculo.js';
import EstadoVehiculo from './EstadoVehiculo.js';
import Mantenimiento from './Mantenimiento.js';

// Relaciones entre Vehiculo y EstadoVehiculo
Vehiculo.hasMany(EstadoVehiculo, {
  foreignKey: 'vehiculoId',
  as: 'historialEstados',
  onDelete: 'CASCADE',
});

EstadoVehiculo.belongsTo(Vehiculo, {
  foreignKey: 'vehiculoId',
  as: 'vehiculo',
});

// Relaciones entre Vehiculo y Mantenimiento
Vehiculo.hasMany(Mantenimiento, {
  foreignKey: 'vehiculoId',
  as: 'mantenimientos',
  onDelete: 'CASCADE',
});

Mantenimiento.belongsTo(Vehiculo, {
  foreignKey: 'vehiculoId',
  as: 'vehiculo',
});

// Relación entre Mantenimiento y EstadoVehiculo (según feedback del profesor)
// Un mantenimiento puede estar asociado a un registro de estado
Mantenimiento.belongsTo(EstadoVehiculo, {
  foreignKey: 'estadoVehiculoId',
  as: 'estadoAsociado',
  onDelete: 'SET NULL',
});

EstadoVehiculo.hasOne(Mantenimiento, {
  foreignKey: 'estadoVehiculoId',
  as: 'mantenimiento',
});

// Relación entre Usuario y Vehiculo (el usuario gestiona vehículos)
// Esta relación no está en el diagrama original pero puede ser útil para auditoría
Usuario.hasMany(Vehiculo, {
  foreignKey: 'creadoPor',
  as: 'vehiculosCreados',
  constraints: false,
});

export { Usuario, Vehiculo, EstadoVehiculo, Mantenimiento };
