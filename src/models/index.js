import Usuario from './Usuario.js';
import Vehiculo from './Vehiculo.js';
import EstadoVehiculo from './EstadoVehiculo.js';
import Mantenimiento from './Mantenimiento.js';

Vehiculo.hasMany(EstadoVehiculo, {
  foreignKey: 'vehiculoId',
  as: 'historialEstados',
  onDelete: 'CASCADE',
});

EstadoVehiculo.belongsTo(Vehiculo, {
  foreignKey: 'vehiculoId',
  as: 'vehiculo',
});

Vehiculo.hasMany(Mantenimiento, {
  foreignKey: 'vehiculoId',
  as: 'mantenimientos',
  onDelete: 'CASCADE',
});

Mantenimiento.belongsTo(Vehiculo, {
  foreignKey: 'vehiculoId',
  as: 'vehiculo',
});

Mantenimiento.belongsTo(EstadoVehiculo, {
  foreignKey: 'estadoVehiculoId',
  as: 'estadoAsociado',
  onDelete: 'SET NULL',
});

EstadoVehiculo.hasOne(Mantenimiento, {
  foreignKey: 'estadoVehiculoId',
  as: 'mantenimiento',
});

Usuario.hasMany(Vehiculo, {
  foreignKey: 'creadoPor',
  as: 'vehiculosCreados',
  constraints: false,
});

export { Usuario, Vehiculo, EstadoVehiculo, Mantenimiento };
