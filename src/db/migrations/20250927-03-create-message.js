import { DataTypes, Sequelize } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('messages', {
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
        key: 'idDoctor'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    idPatient: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'patients',
        key: 'idPatient'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    message_content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    tldr: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    message_type: {
      allowNull: false,
      type: DataTypes.ENUM('voicemail', 'text', 'email'),
      defaultValue: 'voicemail'
    },
    priority: {
      allowNull: false,
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('unread', 'read', 'responded'),
      defaultValue: 'unread'
    },
    is_processed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  // Add indexes for better performance
  await queryInterface.addIndex('messages', ['idDoctor']);
  await queryInterface.addIndex('messages', ['idPatient']);
  await queryInterface.addIndex('messages', ['status']);
  await queryInterface.addIndex('messages', ['created_at']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('messages');
}