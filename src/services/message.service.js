import sequelize from '../libs/sequelize.js';

const { models } = sequelize;

class MessageService {
  async find() {
    return await models.Message.findAll();
  }

  async findOne(idMessage) {
    return await models.Message.findByPk(idMessage);
  }

  async create(data) {
    return await models.Message.create(data);
  }

  async update(idMessage, changes) {
    return await models.Message.update(changes, { where: { idMessage } });
  }

  async delete(idMessage) {
    return await models.Message.destroy({ where: { idMessage } });
  }

  // ✅ Nuevo método: mensajes por doctor con info del paciente
  async findByDoctor(doctorId) {
    return await models.Message.findAll({
      where: { idDoctor: doctorId },
      include: [
        {
          model: models.Patient,
          as: 'patient',
          attributes: ['name', 'phone'],
        },
      ],
      order: [['created_at', 'DESC']], // o 'createdAt' según tu modelo
    });
  }
}

export default MessageService;