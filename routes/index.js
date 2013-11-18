'use strict';
module.exports = function (app) {
  require('./posts')(app);
  require('./tags')(app);
  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Express'
    });
  });
};
