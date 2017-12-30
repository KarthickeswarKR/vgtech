var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var config = require('./app/config/config');
var mongoose = require('mongoose');
var statuscode = require('./app/models/statuscode');
var message = require('./app/controllers/messagecontroller');
var suggest = require('./app/controllers/suggestproductcontroller');
var notification = require('./app/controllers/notificationcontroller');
var organisation = require('./app/controllers/organisationcontroller');
var brandmaterial = require('./app/controllers/brandmaterialcontroller');
var imagethumb = require('./app/controllers/imagethumbcontroller');
var material = require('./app/models/material');
var country = require('./app/models/countrycode');
var brand = require('./app/controllers/brandcontroller');
var report = require('./app/controllers/reportcontroller');
var material = require('./app/controllers/materialcontroller');
var package = require('./app/controllers/packagecontroller');
var variant = require('./app/models/variants');
var token = require('./app/controllers/tokencontroller');
var user = require('./app/controllers/user-controller');
var unit = require('./app/controllers/unitcontroller');
var stockarea = require('./app/controllers/stockareacontroller');
var buysell = require('./app/controllers/buysellcontroller');
var productstock = require('./app/controllers/productstockcontroller');
var product = require('./app/controllers/productcontroller');
var privateproduct = require('./app/controllers/privateproductcontroller');
var sell = require('./app/controllers/sellcontroller');
var transactionhistory = require('./app/controllers/transactionhistorycontroller');
var order = require('./app/controllers/ordercontroller');
var db = require('./app/db/mongoose');
var config = require('./app/config/config');
var vg = express();
var port = process.env.PORT || 80;
const authentication = require('./app/auth')
const publicCert = fs.readFileSync('key/public.pem');

// Requires setup for auth module
const issuer = config.get('auth:issuer');
const audience = config.get('auth:aud')
const securedurl = config.get('auth:securedurl')
authentication.setup({
  app: vg,
  securedURL: securedurl,
  issuer: issuer,
  audience: audience,
  signCert: publicCert
});
vg.use('/api/*', authentication.authenticate);
var api = require('./app/routes/api')
var html = require('./html.js');
vg.use(bodyParser.json());
vg.use(bodyParser.urlencoded({
  extended: false
}));
var environment = process.env.ENV || config.get('env');
if (environment == 'development') {
  vg.use('/', express.static(__dirname + '/webapp'));
} else {
  vg.use('/', express.static(__dirname + '/dist'));
}

vg.use('/api/unit', unit);
vg.use('/api/orders', order);
vg.use('/api/stockarea', stockarea);
vg.use('/api/products', product);
vg.use('/api/privateproduct', privateproduct);
vg.use('/api/productstock', productstock);
vg.use('/api/token', token);
vg.use('/api/brandmaterial', brandmaterial);
vg.use('/api/buysell', buysell);
vg.use('/api/brand', brand);
vg.use('/api/message', message);
vg.use('/api/suggest', suggest);
vg.use('/api/users', user);
vg.use('/api/material', material);
vg.use('/api/sell', sell);
vg.use('/api/organisation', organisation)
vg.use('/api/history', transactionhistory);
vg.use('/api/secured/unit', unit);
vg.use('/api/secured/orders', order);
vg.use('/api/secured/stockarea', stockarea);
vg.use('/api/secured/message', message);
vg.use('/api/secured/products', product);
vg.use('/api/secured/privateproduct', privateproduct);
vg.use('/api/secured/productstock', productstock);
vg.use('/api/secured/token', token);
vg.use('/api/secured/brandmaterial', brandmaterial);
vg.use('/api/secured/buysell', buysell);
vg.use('/api/secured/suggest', suggest);
vg.use('/api/secured/users', user);
vg.use('/api/secured/material', material);
vg.use('/api/secured/sell', sell);
vg.use('/api/secured/report', report);
vg.use('/api/secured/package', package);
vg.use('/api/secured/brand', brand);
vg.use('/api/secured/organisation', organisation)
vg.use('/api/secured/history', transactionhistory);
vg.use('/api/secured/authorize/unit', unit);
vg.use('/api/secured/authorize/orders', order);
vg.use('/api/secured/authorize/stockarea', stockarea);
vg.use('/api/secured/authorize/products', product);
vg.use('/api/secured/authorize/privateproduct', privateproduct);
vg.use('/api/secured/authorize/productstock', productstock);
vg.use('/api/secured/authorize/token', token);
vg.use('/api/secured/authorize/brandmaterial', brandmaterial);
vg.use('/api/secured/authorize/buysell', buysell);
vg.use('/api/secured/authorize/brand', brand);
vg.use('/api/secured/authorize/suggest', suggest);
vg.use('/api/secured/authorize/users', user);
vg.use('/api/secured/authorize/material', material);
vg.use('/api/secured/authorize/sell', sell);
vg.use('/api/secured/authorize/notification', notification);
vg.use('/api/secured/authorize/organisation', organisation)
vg.use('/api/secured/authorize/history', transactionhistory);
vg.use('/api/secured/authorize/message', message);
vg.use('/api/secured/authorize/package', package);
vg.use('/*', html);
module.exports = vg;
vg.listen(port);
console.log("vg is started and listening");
