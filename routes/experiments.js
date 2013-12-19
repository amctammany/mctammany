//'use strict';
//var fs = require('fs');
//var readline = require('readline');
//var stream = require('stream');

//module.exports = function (app) {
//// GET /posts => Index
  //app.get('/words', function (req, res) {
    //var lines = [];
    //var instream = fs.createReadStream('app/scrabble_words.txt');
    //var outstream = new stream();

    //var rl = readline.createInterface(instream, outstream);

    //rl.on('line', function (line) {
      //lines.push(line);
      ////res.send(outstream);
    //});
    //rl.on('close', function () {
      //res.send(lines);
      //console.log('close');
    //});
  //}); 

  //app.get('/dictionaries', function (req, res) {
    
  //});
//};
'use strict';
var mongoose = require('mongoose');
    //_ = require('underscore');
module.exports = function (app) {
	var	Dictionary = mongoose.model('Dictionary');
// GET /mazes => Index
  app.get('/dictionaries', function (req, res) {
    Dictionary.find()
      .exec(function (err, dicts) {
        if (err) { console.log(err); }
        res.send(dicts);
      });
  });
// GET /mazes/name => Read
  app.get('/dictionaries/:name', function (req, res) {
    Dictionary.findOne({urlString: req.params.name})
    .exec(function (err, dict) {
      if (err) { console.log(err); }
      res.send(dict);
    });
  });
// maze /mazes/name => Update
  app.post('/dictionaries/:name', function (req, res) {
    console.log(req.body);
    Dictionary.findOne({urlString: req.params.name}, function (err, dict) {
      if (err) {console.log(err);}
      dict.name = req.body.name;
      dict.words = req.body.words;
      dict.save(function (err) {
        if (err ) { console.log(err); }
        res.send(dict);
      });
    });

  });

// DEL /mazes/name => Remove
  app.del('/dictionaries/:name', function (req, res) {
    Dictionary.findOneAndRemove({urlString: req.params.name}, function (err, dict) {
      if (err) {console.log(err);}
      res.send(dict);
    });
  });
// maze /mazes => Create
  app.post('/dictionaries', function (req, res) {
    var dict = new Dictionary(req.body);
    dict.save(function (err) {
      if (err) { console.log(err); }
      res.send(dict);
    });
  });
};

