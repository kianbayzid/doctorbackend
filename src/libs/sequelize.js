import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import setupModels from '../db/models/index.js';

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    host: config.dbHost,
    port: config.dbPort,
    dialect: 'postgres',
    logging: console.log,
  }
);

setupModels(sequelize);

export default sequelize;
