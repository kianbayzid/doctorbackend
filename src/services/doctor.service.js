import bcrypt from 'bcrypt';
import sequelize from '../libs/sequelize.js';

const { models } = sequelize;

class DoctorService {
  async create(data) {
    // hash password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newDoctor = await models.Doctor.create({
      ...data,
      password: hashedPassword, // save hashed, not plain
    });

    return newDoctor;
  }

  async find() {
    return await models.Doctor.findAll();
  }

  async findOne(id) {
    return await models.Doctor.findByPk(id);
  }

  async update(id, changes) {
    return await models.Doctor.update(changes, { where: { id } });
  }

  async delete(id) {
    return await models.Doctor.destroy({ where: { id } });
  }
}

export default DoctorService;