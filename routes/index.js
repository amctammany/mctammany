'use strict';
module.exports = function (app) {
  require('./posts')(app);
  require('./tags')(app);
  require('./molecules')(app);
  require('./maze')(app);
  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Express'
    });
  });
};
