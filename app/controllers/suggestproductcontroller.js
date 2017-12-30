var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var resHandler = require("../common/res-handler");
var uuid = require("node-uuid");
var suggestproduct = require('../models/suggestproduct');
router.post('/suggestproduct', function(req, res, next) {
  var variantId = uuid.v1();
  var variants = new suggestproduct({
    _id: variantId,
    materialId: req.body.materialId,
    specifications: req.body.filters
  });
  variants.save(function(err, add) {
    if (err) {
      commonService.error(res, "admin not added");
    } else {

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'karthickeswar@virtualgodown.com',
          pass: 'Rukp1995'
        }
      });

      var mailOptions1 = {
        from: 'karthickeswar@gmail.com',
        to: 'info@virtualgodown.com',
        subject: 'Sending Email using Node.js',
        text: add
      };
      var mailOptions = {
        from: 'karthickeswar@gmail.com',
        to: 'info@virtualgodown.com',
        subject: 'Sending Email using Node.js',
        text: "A suggestion is added"
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          resHandler.success(res, add);
        }
      });
    }
  });
});
module.exports = router;
