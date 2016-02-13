var express = require('express');

var ctrl = function () {
  var authCtrl = express.Router();
  var userRepo = require('../repos/user.repo');

  authCtrl.route('/')
    .post(function (req, res) {
      userRepo.authorizeUser(req.body.username, req.body.password)
        .then(function (user) {
          res.json(user);
        })
        .catch(function () {
          res.status(401).send({ message: 'Invalid username and/or password' });
        });
    });

  return authCtrl;
};

module.exports = ctrl;
