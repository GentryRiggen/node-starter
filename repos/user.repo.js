var userModel = require('../models/user.model');
var Q = require('q');
var tableName = 'user';
var db = require('../db');
var baseRepo = require('./base.repo')(tableName, userModel);

var userRepo = {};

userRepo.getAll = baseRepo.getAll;
userRepo.getById = baseRepo.getById;
userRepo.createOrUpdate = baseRepo.createOrUpdate;

userRepo.updateUserPassword = function (id, password) {
  var dfd = Q.defer();
  function catchError(err) {
    dfd.reject(err);
  }

  userModel.encryptPassword(password)
    .then(function (encryptedPass) {
      db(tableName).where('id', id)
        .update({ password: encryptedPass })
        .then(function () {
          dfd.resolve();
        })
        .catch(catchError);
    })
    .catch(catchError);

  return dfd.promise;
};

userRepo.authorizeUser = function (username, password) {
  var dfd = Q.defer();
  function catchError(err) {
    dfd.reject(err);
  }

  db(tableName).select('id', 'password')
    .where('username', username).first()
    .then(function (user) {
      userModel
        .checkPassword(password, user.password)
        .then(function () {
          userRepo.getById(user.id, true)
            .then(function (userModel) {
              dfd.resolve(userModel);
            })
            .catch(catchError);
        })
        .catch(catchError);
    })
    .catch(catchError);

  return dfd.promise;
};

module.exports = userRepo;
