import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import logger from './lib/logger';
import database from './lib/database';
import logic from './lib/logic';
import topup from './lib/topup';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.get('/photo', logic.showPhotos);
app.post('/photo', logic.updateVerificationStatus);
app.get('/topup', topup.showTopup);
app.post('/topup', topup.doTopup);

database.connect()
  .then((stores) => {
    logic.setStores(stores);
    
    const port = config.port || 3000;
    app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to database', err);
  });
