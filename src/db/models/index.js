import { Doctor, DoctorSchema } from './doctor.model.js';
import { Patient, PatientSchema } from './patient.model.js';
import { Message, MessageSchema } from './message.model.js';

function setupModels(sequelize) {
  // Initialize models
  Doctor.init(DoctorSchema, Doctor.config(sequelize));
  Patient.init(PatientSchema, Patient.config(sequelize));
  Message.init(MessageSchema, Message.config(sequelize));
 
  // Set up associations
  Doctor.associate(sequelize.models);
  Patient.associate(sequelize.models);
  Message.associate(sequelize.models);
}

export default setupModels;