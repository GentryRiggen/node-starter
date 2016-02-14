var jwt = require('../services/jwt.service');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');

var model = {};

model.toJson = function (user, extended) {
  var userModel = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    username: user.username
  };

  if (extended) {
    userModel.token = jwt.encode({sub: user.id});
  }

  return userModel;
};

model.fromJson = function (user) {
  return {
    id: ('id' in user) ? user.id : 0,
    first_name: ('firstName' in user) ? user.firstName : "",
    last_name: ('lastName' in user) ? user.lastName : "",
    email: ('email' in user) ? user.email : "",
    username: ('username' in user) ? user.username : ""
  };
};

model.encryptPassword = function (password) {
  var dfd = Q.defer();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      dfd.reject(err);
    } else {
      bcrypt.hash(password, salt, null, function (err, hash) {
        if (err) {
          dfd.reject();
        } else {
          dfd.resolve(hash);
        }
      });
    }
  });

  return dfd.promise;
};

model.checkPassword = function (attemptPw, hashedPw) {
  var dfd = Q.defer();

  bcrypt.compare(attemptPw, hashedPw, function (err, res) {
    if (err || !res) {
      dfd.reject();
    } else {
      dfd.resolve(res);
    }
  });

  return dfd.promise;
};

module.exports = model;
