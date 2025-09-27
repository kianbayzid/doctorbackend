'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('messages', 'recording_sid', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('messages', 'recording_sid');
  }
};