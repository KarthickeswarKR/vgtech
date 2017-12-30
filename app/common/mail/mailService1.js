/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var express = require('express');
var mailer = require('express-mailer');
var resHandler = require("../../common/res-handler");
var config1 = require('../../config/mail-config');
var currentMailerOptions = config1.mailer;
var commonService = require("../../common/commonService.js");
var config = require('../../config/config');

var app = express();
mailer.extend(app, currentMailerOptions);
app.set('views', __dirname + '/mobiletemplates');
app.set('view engine', 'jade');
exports.mobilesendChangePasswordURL = function(req, res, userEmail, data) {
  app.set('views', __dirname + '/mobiletemplates');
  app.set('view engine', 'jade');

  var origin = req.get('origin');
  console.log("Mail Service Started...");
  app.locals.url = data;
  app.mailer.send('email', {
      to: userEmail,
      subject: 'VG - Password Change Request otp is' + data
    },
    function(err, mailRes) {
      if (err) {
        console.log('Sending Mail Failed!');
        console.log(err);
        commonService.error(res, "We are unable to send a mail to this email id. Kindly check your email.", {
          code: "395"
        });
        return;
      };
      console.log("Mail Sent" + mailRes); {
        resHandler.success(res, "mailsend");
      }
    });
};

exports.mobileverifyemail = function(req, res, userEmail, data) {


  var origin = req.get('origin');
  console.log("Mail Service Started...");
  var baseURL = process.env.EMAILURL || config.get('domain:emailURL');
  app.locals.url = data;
  app.mailer.send('email', {
      to: userEmail,
      subject: 'VG - verifyemail otp is' + data
    },
    function(err, mailRes) {
      if (err) {
        console.log('Sending Mail Failed!');
        console.log(err);
        commonService.error(res, "We are unable to send a mail to this email id. Kindly check your email.", {
          code: "395"
        });
        return;
      };
      console.log("Mail Sent" + mailRes); {
        resHandler.success(res, "Mail sent");
      }
    });
};
