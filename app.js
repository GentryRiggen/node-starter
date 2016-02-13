var express = require('express');
var jwt = require('./services/jwt.service');
var bodyParser = require('body-parser');
var path = require('path');

console.log('NODE_ENV: ', process.env.NODE_ENV, process.env.PORT);
var app = express();
var port = process.env.PORT || 8888;
var devMode = process.env.NODE_ENV === 'development';
app.use(bodyParser.json());

app.use('/api', function (req, res, next) {
  function callNext() {
    next();
  }
  jwt.tokenFilter(req)
    .then(callNext)
    .catch(callNext);
});

app.use('/api/auth', require('./controllers/auth.ctrl.js')());
app.use('/api/user', require('./controllers/user.ctrl')());

// If you want to serve up a client
// if (devMode) {
//   app.use(express.static(path.join(__dirname, 'client')));
//   app.use(express.static(path.join(__dirname, 'client/.tmp/serve')));
//   app.use(express.static(path.join(__dirname, 'client/src')));
// } else {
//   app.use(express.static(path.join(__dirname, 'client/dist')));
// }

// START THE APP
app.listen(port, function () {
  console.log('Listening on PORT: ', port);
});
