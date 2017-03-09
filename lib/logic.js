import logger from './logger'
import { IdPhotoSchema } from './database';
import AccountLevel from './accountLevel';

let blobVaultStore;

function setStores(stores) {
  blobVaultStore = stores.blobvault;
}

function showPhotos(req, res) {
  function constructInfos(doc) {
    return {
      address: doc.address,
      idPhoto: {
        contentType: doc.id_photo.content_type,
        data: doc.id_photo.data.toString('base64'),
      },
      selfiePhoto: {
        contentType: doc.selfie_photo.content_type,
        data: doc.selfie_photo.data.toString('base64'),
      },
      accepted: doc.accepted,
    };
  }

  IdPhotoSchema.find()
    .then((docs) => {
      const infos = docs.map(constructInfos);
      res.render('index', { infos });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send(`Failed to query photos ${err.message}`);
    });
}

function updateVerificationStatus(req, res) {
  const objHasProperty = Object.prototype.hasOwnProperty;

  let accepted = undefined;
  let address = undefined;

  if (objHasProperty.call(req.body, 'accept')) {
    address = req.body.accept;
    accepted = true;
  } else if (objHasProperty.call(req.body, 'reject')) {
    address = req.body.reject;
    accepted = false;
  }

  if (accepted === undefined) {
    res.status(400).send('Invalid operation');
    return;
  }

  IdPhotoSchema.update({ address }, { $set: { accepted } })
    .then((resp) => {
      if (resp.ok !== 1 || resp.nModified === 0) {
        return Promise.reject(new Error('Address not found'));
      }
      if (!accepted) {
        logger.info(`Account ${address} - photos are rejected`);
        return Promise.resolve();
      }
      return blobVaultStore('blob')
        .update({ account_level: AccountLevel.ID_PHOTO_VERIFIED })
        .where({ address, account_level: AccountLevel.PHONE_VERIFIED });
    })
    .then((resp) => {
      if (resp === 0) {
        logger.warn(`Account ${address} - photos are accepted but level is not upgraded`);
      } else {
        logger.info(`Account ${address} - photos are accepted and level is upgraded`);
      }
      res.redirect('/');
    })
    .catch((err) => {
      logger.error('Update status:', err);
      res.status(500).send('Failed to update database');
    });
}

export default {
  setStores,
  showPhotos,
  updateVerificationStatus,
}
