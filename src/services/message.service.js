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
      order: [['createdAt', 'DESC']],
    });
  }

  // ✅ NUEVOS MÉTODOS
  async markAsRead(idMessage) {
    const [updatedRows] = await models.Message.update(
      { status: 'read', updatedAt: new Date() }, 
      { where: { idMessage } }
    );
    
    if (updatedRows === 0) {
      throw new Error('Message not found');
    }
    
    return await models.Message.findByPk(idMessage, {
      include: [
        {
          model: models.Patient,
          as: 'patient',
          attributes: ['idPatient', 'name', 'phone'],
        },
      ],
    });
  }

  async markAllAsReadByDoctor(doctorId) {
    const [updatedRows] = await models.Message.update(
      { status: 'read', updatedAt: new Date() },
      { 
        where: { 
          idDoctor: doctorId,
          status: 'unread'
        } 
      }
    );
    
    return { updatedCount: updatedRows };
  }
}

export default MessageService;