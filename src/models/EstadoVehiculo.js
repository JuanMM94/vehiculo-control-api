import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EstadoVehiculo = sequelize.define('EstadoVehiculo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vehiculoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehiculos',
      key: 'id',
    },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('Disponible', 'En uso', 'En mantenimiento', 'Dado de baja'),
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'estados_vehiculo',
  timestamps: true,
});

export default EstadoVehiculo;
