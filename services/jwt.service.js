var crypto = require('crypto');
var conf = require('../config/conf');
var Q = require('q');

var jwtService = {};

jwtService.base64Encode = function (str) {
  return new Buffer(str).toString('base64');
};

jwtService.base64Decode = function (str) {
  return new Buffer(str, 'base64').toString();
};

jwtService.verify = function (rawSignature, signature, secret) {
  return signature == jwtService.sign(rawSignature, secret);
};

jwtService.sign = function (str, key) {
  return crypto.createHmac('sha256', key).update(str).digest('base64');
};

jwtService.encode = function (payload) {
  var algorithm = 'HS256';

  var header = {
    typ: 'JWT',
    alg: algorithm
  };

  payload.iss = conf.jwt.issuer;

  var jwt = jwtService.base64Encode(JSON.stringify(header)) + '.' +
    jwtService.base64Encode(JSON.stringify(payload));
  var signature = jwtService.sign(jwt, conf.jwt.secret);
  return jwt + '.' + signature;
};

jwtService.decode = function (token) {
  var segments = token.split('.');
  if (segments.length !== 3) {
    throw new Error('Token structure incorrect');
  }

  var header = JSON.parse(jwtService.base64Decode(segments[0]));
  var payload = JSON.parse(jwtService.base64Decode(segments[1]));

  var rawSignature = segments[0] + '.' + segments[1];
  if (!jwtService.verify(rawSignature, segments[2], conf.jwt.secret)) {
    throw new Error('JWT Signature Verification Failed!');
  }

  return {
    header: header,
    payload: payload
  };
};

jwtService.tokenFilter = function (req) {
  var dfd = Q.defer();
  var userRepo = require('../repos/user.repo');

  req.currentUser = false;
  if (req.headers.authorization && req.headers.authorization.split(' '.length > 1)) {
    var token = req.headers.authorization.split(' ')[1];
    var decodedToken = jwtService.decode(token);
    if (decodedToken.payload.sub) {
      // Get the user and their roles
      userRepo.getById(decodedToken.payload.sub)
        .then(function (user) {
          req.currentUser = user;
          dfd.resolve();
        })
        .catch(dfd.resolve());
    } else {
      dfd.resolve();
    }
  } else {
    dfd.resolve();
  }

  return dfd.promise;
};

module.exports = jwtService;
