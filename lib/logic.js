import logger from './logger'
import { IdPhotoSchema } from './database';

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

function updateVerificationResult(req, res) {
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
      res.redirect('/');
    })
    .catch((err) => {
      logger.error('Update accepted:', err);
      res.status(500).send('Failed to update database');
    });
}

export default {
  showPhotos,
  updateVerificationResult,
}
