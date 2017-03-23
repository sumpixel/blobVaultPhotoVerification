import logger from './logger'

const currencyList = ['BTC', 'ETH', 'ISD'];

function showTopup(req, res) {
  var pugParam = {
    currencyList
  };
  res.render('topup', pugParam);
}

function doTopup(req, res, next) {
    const address = req.body.address;
    const amount = req.body.amount;
    const currency = currencyList[req.body.currency];
    console.log(address);
    console.log(amount);
    console.log(currency);

    res.status(200).send('OK');
}

export default {
  showTopup,
  doTopup,
}
