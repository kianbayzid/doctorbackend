'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('patients', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
      name: { allowNull: false, type: DataTypes.STRING },
      phone: { allowNull: false, type: DataTypes.STRING, unique: true },
      created_at: { allowNull: false, type: DataTypes.DATE, defaultValue: Sequelize.fn('NOW') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('patients');
  },
};