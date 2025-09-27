import { DataTypes, Sequelize } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('patients', {
    idPatient: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('patients');
}