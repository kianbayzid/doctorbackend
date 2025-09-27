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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
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
      timestamps: false,
    };
  }
}

export { PATIENT_TABLE, PatientSchema, Patient };