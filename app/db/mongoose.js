var mongoose = require('mongoose');
var app = process.cwd() + '/app/';
var config = require(app + 'config/config');
var connect = process.env.MONGO_URL || config.get('mongoose:uri');
var options = {
  replset: {
    socketOptions: {
      keepAlive: 120
    }
  },
  server: {
    poolSize: 5,
    reconnectTries: 10,
    socketOptions: {
      keepAlive: 120
    }
  }
};
mongoose.connect(connect, {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30});
var db = mongoose.connection;
db.on('error', function(err) {});
db.once('open', function callback() {});

module.exports = mongoose;
