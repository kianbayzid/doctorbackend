import sequelize from '../libs/sequelize.js';
const { models } = sequelize;

class DoctorService {
  async create(data) {
    const newDoctor = await models.Doctor.create(data);
    return newDoctor;
  }

  async find() {
    return await models.Doctor.findAll();
  }

  async findOne(id) {
    return await models.Doctor.findByPk(id);
  }

  async update(id, changes) {
    const doctor = await this.findOne(id);
    return await doctor.update(changes);
  }

  async delete(id) {
    const doctor = await this.findOne(id);
    await doctor.destroy();
    return { id };
  }
}

export default DoctorService;