import mongoose from 'mongoose';
import Knex from 'knex';
import config from '../config';
import logger from './logger';

mongoose.Promise = global.Promise;

const schema = mongoose.Schema({
  address: String,
  id_photo: { data: Buffer, content_type: String },
  selfie_photo: { data: Buffer, content_type: String },
  accepted: Boolean,
  uploaded_date: { type: Date, default: Date.now },
});
const IdPhotoSchema = mongoose.model('IdPhoto', schema);

export default {
  connect() {
    const { postgres, mongo } = config;
    const mongoUri = `${mongo.host}:${mongo.port}/${mongo.database}`;
    const options = {
      user: mongo.user,
      pass: mongo.password,
      auth: {
        authdb: mongo.authDatabase,
      },
    };
    
    return mongoose.connect(mongoUri, options)
      .then(() => {
        logger.info(`Connected to mongo database ${mongoUri}`);

        const knex = Knex({
          client: 'postgres',
          connection: postgres,
        });
        logger.info(`Connected to postgres database ${postgres.host}`);

        return Promise.resolve({file: mongoose, blobvault: knex});
      })
      .catch((err) => {
        logger.error(`Failed to connect to mongo database ${mongoUri}`);
        return Promise.reject(err);
      })
  },
}
export { IdPhotoSchema };
