'use strict';

const { DataTypes, Sequelize } = require('sequelize');

const DOCTOR_TABLE = 'doctors';

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(DOCTOR_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      available: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(DOCTOR_TABLE);
  },
};