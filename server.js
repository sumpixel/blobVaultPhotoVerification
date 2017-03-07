import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import logger from './lib/logger';
import database from './lib/database';
import logic from './lib/logic';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.get('/', logic.showPhotos);
app.post('/', logic.updateVerificationResult);

const { mongo } = config;
const uri = `${mongo.host}:${mongo.port}/${mongo.database}`;
const options = {
  user: mongo.user,
  pass: mongo.password,
  auth: {
    authdb: mongo.authDatabase,
  },
};

database.connect(uri, options)
  .then(() => {
    logger.info(`Connected to database ${uri}`);
    const port = config.port || 3000;
    app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error(`Failed to connect to database ${uri}`);
  });
