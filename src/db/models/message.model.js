import { Model, DataTypes, Sequelize } from 'sequelize';

const MESSAGE_TABLE = 'messages';

const MessageSchema = {
  idMessage: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  idDoctor: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'doctors',
      key: 'idDoctor',
    },
  },
  idPatient: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'patients',
      key: 'idPatient',
    },
  },
  audioUrl: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'audio_url',
  },
  recordingSid: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'recording_sid',
    unique: true,
  }, 
  messageContent: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'message_content',
  },
  tldr: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  messageType: {
    allowNull: false,
    type: DataTypes.ENUM('voicemail', 'text', 'email'),
    field: 'message_type',
    defaultValue: 'voicemail',
  },
  priority: {
    allowNull: false,
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  status: {
    allowNull: false,
    type: DataTypes.ENUM('unread', 'read', 'responded'),
    defaultValue: 'unread',
  },
  isProcessed: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    field: 'is_processed',
    defaultValue: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
};

class Message extends Model {
  static associate(models) {
    this.belongsTo(models.Doctor, {
      foreignKey: 'idDoctor',
      as: 'doctor',
    });
    this.belongsTo(models.Patient, {
      foreignKey: 'idPatient',
      as: 'patient',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MESSAGE_TABLE,
      modelName: 'Message',
      timestamps: true,
    };
  }
}

// ✅ Named exports (same style as Doctor and Patient)
export { MESSAGE_TABLE, MessageSchema, Message };