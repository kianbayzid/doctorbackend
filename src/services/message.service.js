import sequelize from '../libs/sequelize.js';
import HuggingFaceService from './huggingface.service.js';

const { models } = sequelize;

class MessageService {
  constructor() {
    this.hfService = new HuggingFaceService();
  }

  async create(data) {
    const newMessage = await models.Message.create(data);
    
    // Generate TLDR asynchronously if message content exists
    if (data.messageContent) {
      this.generateAndUpdateTLDR(newMessage.idMessage, data.messageContent);
    }
    
    return newMessage;
  }

  async find() {
    return await models.Message.findAll({
      include: [
        {
          model: models.Doctor,
          as: 'doctor',
          attributes: ['idDoctor', 'name', 'phone']
        },
        {
          model: models.Patient,
          as: 'patient',
          attributes: ['idPatient', 'name', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async findOne(idMessage) {
    const message = await models.Message.findByPk(idMessage, {
      include: [
        {
          model: models.Doctor,
          as: 'doctor',
          attributes: ['idDoctor', 'name', 'phone']
        },
        {
          model: models.Patient,
          as: 'patient',
          attributes: ['idPatient', 'name', 'phone']
        }
      ]
    });
    
    if (!message) {
      throw new Error('Message not found');
    }
    
    return message;
  }

  async update(idMessage, changes) {
    const message = await this.findOne(idMessage);
    const updated = await message.update(changes);
    
    // If message content was updated, regenerate TLDR
    if (changes.messageContent) {
      this.generateAndUpdateTLDR(idMessage, changes.messageContent);
    }
    
    return updated;
  }

  async delete(idMessage) {
    const message = await this.findOne(idMessage);
    await message.destroy();
    return { idMessage };
  }

  // Generate TLDR asynchronously
  async generateAndUpdateTLDR(idMessage, messageContent) {
    try {
      const tldr = await this.hfService.generateTLDR(messageContent);
      await models.Message.update(
        { tldr, isProcessed: true },
        { where: { idMessage } }
      );
      console.log(`TLDR generated for message ${idMessage}`);
    } catch (error) {
      console.error(`Failed to generate TLDR for message ${idMessage}:`, error);
      // Mark as processed even if TLDR generation failed
      await models.Message.update(
        { isProcessed: true },
        { where: { idMessage } }
      );
    }
  }

  // Get messages by doctor
  async findByDoctor(idDoctor) {
    return await models.Message.findAll({
      where: { idDoctor },
      include: [
        {
          model: models.Doctor,
          as: 'doctor',
          attributes: ['idDoctor', 'name', 'phone']
        },
        {
          model: models.Patient,
          as: 'patient',
          attributes: ['idPatient', 'name', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  // Get messages by patient
  async findByPatient(idPatient) {
    return await models.Message.findAll({
      where: { idPatient },
      include: [
        {
          model: models.Doctor,
          as: 'doctor',
          attributes: ['idDoctor', 'name', 'phone']
        },
        {
          model: models.Patient,
          as: 'patient',
          attributes: ['idPatient', 'name', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  // Manually regenerate TLDR
  async regenerateTLDR(idMessage) {
    const message = await this.findOne(idMessage);
    const tldr = await this.hfService.generateTLDR(message.messageContent);
    return await message.update({ tldr, isProcessed: true });
  }

  // Mark message as read
  async markAsRead(idMessage) {
    return await this.update(idMessage, { status: 'read' });
  }

  // Mark message as responded
  async markAsResponded(idMessage) {
    return await this.update(idMessage, { status: 'responded' });
  }

  // Get message statistics for a doctor
  async getMessageStats(idDoctor) {
    const stats = await models.Message.findAll({
      where: { idDoctor },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('idMessage')), 'total'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'unread' THEN 1 END")), 'unread'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'read' THEN 1 END")), 'read'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'responded' THEN 1 END")), 'responded'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN priority = 'urgent' THEN 1 END")), 'urgent'],
        [sequelize.fn('COUNT', sequelize.literal("CASE WHEN tldr IS NOT NULL THEN 1 END")), 'withTldr']
      ],
      raw: true
    });

    return stats[0];
  }
}

export default MessageService;