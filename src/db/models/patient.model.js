import { Model, DataTypes, Sequelize } from 'sequelize';

const PATIENT_TABLE = 'patients';

const PatientSchema = {
  idPatient: {
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
};

class Patient extends Model {
  static associate(models) {
    // future: Patient.hasMany(models.Message)
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PATIENT_TABLE,
      modelName: 'Patient',
      timestamps: true,
      updatedAt: false,
      createdAt: 'created_at',
    };
  }
}

export { PATIENT_TABLE, PatientSchema, Patient };