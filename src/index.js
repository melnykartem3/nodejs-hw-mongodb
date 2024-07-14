import setupServer from './server.js';
import initMongoDB from './db/initMongoCollection.js';
import createDirIfNotExist from './utils/createDirIfNotExist.js';
import {
  TEMP_UPLOAD_DIR,
  PUBLIC_DIR,
  PUBLIC_PHOTOS_DIR,
} from './constants/index.js';

const bootstrap = async () => {
  createDirIfNotExist(TEMP_UPLOAD_DIR);
  createDirIfNotExist(PUBLIC_DIR);
  createDirIfNotExist(PUBLIC_PHOTOS_DIR);
  await initMongoDB();
  setupServer();
};

bootstrap();
