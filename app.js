var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    path = require('path');

var app = express();
app.directory = __dirname;

mongoose.connect('mongodb://heroku_app19600414:ogfv46qaemspfkc4egrp45v0fc@ds053838.mongolab.com:53838/heroku_app19600414');
var db = mongoose.connection;
db.once('open', function () {
  console.log('DB Connection Open');
})
require('./db');

require('./config/environments')(app);
require('./routes')(app);

module.exports = app;
