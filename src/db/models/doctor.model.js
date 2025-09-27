import { Model, DataTypes, Sequelize } from 'sequelize';

const DOCTOR_TABLE = 'doctors';

const DoctorSchema = {
  idDoctor: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  phone: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  available: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class Doctor extends Model {
  static associate(models) {
    // future: Doctor.hasMany(models.Message)
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DOCTOR_TABLE,
      modelName: 'Doctor',
      timestamps: false,
    };
  }
}

export { DOCTOR_TABLE, DoctorSchema, Doctor };