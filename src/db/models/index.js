import { Doctor, DoctorSchema } from './doctor.model.js';

function setupModels(sequelize) {
  Doctor.init(DoctorSchema, Doctor.config(sequelize));
}

export default setupModels;