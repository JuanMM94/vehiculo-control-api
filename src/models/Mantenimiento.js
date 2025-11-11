import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Mantenimiento = sequelize.define('Mantenimiento', {
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
  estadoVehiculoId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'estados_vehiculo',
      key: 'id',
    },
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterStart(value) {
        if (value && this.fechaInicio && new Date(value) < new Date(this.fechaInicio)) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      },
    },
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'mantenimientos',
  timestamps: true,
});

export default Mantenimiento;
