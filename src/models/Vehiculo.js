import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patente: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  año: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
  },
  estadoActual: {
    type: DataTypes.ENUM('Disponible', 'En uso', 'En mantenimiento', 'Dado de baja'),
    allowNull: false,
    defaultValue: 'Disponible',
  },
}, {
  tableName: 'vehiculos',
  timestamps: true,
});

export default Vehiculo;
