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
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true, // prevent duplicate accounts
    validate: {
      isEmail: true,
    },
  },
  password: {
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
      timestamps: true,
      updatedAt: false,
      createdAt: 'created_at',
    };
  }
}

export { DOCTOR_TABLE, DoctorSchema, Doctor };
