import sequelize from '../libs/sequelize.js';
const { models } = sequelize;

class PatientService {
  async create(data) {
    const newPatient = await models.Patient.create(data);
    return newPatient;
  }

  async find() {
    return await models.Patient.findAll();
  }

  async findOne(id) {
    return await models.Patient.findByPk(id);
  }

  async update(id, changes) {
    const patient = await this.findOne(id);
    return await patient.update(changes);
  }

  async delete(id) {
    const patient = await this.findOne(id);
    await patient.destroy();
    return { id };
  }
}

export default PatientService;