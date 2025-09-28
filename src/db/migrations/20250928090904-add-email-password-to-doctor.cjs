'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('doctors', 'email', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn('doctors', 'password', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('doctors', 'email');
    await queryInterface.removeColumn('doctors', 'password');
  }
};