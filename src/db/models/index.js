import { Doctor, DoctorSchema } from './doctor.model.js';
import { Patient, PatientSchema } from './patient.model.js';

function setupModels(sequelize) {
  Doctor.init(DoctorSchema, Doctor.config(sequelize));
  Patient.init(PatientSchema, Patient.config(sequelize));

  // future associations
  // Doctor.hasMany(Patient) ? Probably not
}

export default setupModels;