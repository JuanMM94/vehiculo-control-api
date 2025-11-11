import { beforeAll, afterAll } from '@jest/globals';
import sequelize from './src/config/database.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
