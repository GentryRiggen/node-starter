var conf = require('./config/conf');
var devMode = process.env.DATA_ENV === 'development';
var knex = require('knex')(devMode ? conf.db.knex.development : conf.db.knex.production);

function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}

knex.toMysqlFormat = function (date) {
  return date.getUTCFullYear() + "-" +
    twoDigits(1 + date.getUTCMonth()) + "-" + 
    twoDigits(date.getUTCDate()) + " " + 
    twoDigits(date.getUTCHours()) + ":" + 
    twoDigits(date.getUTCMinutes()) + ":" + 
    twoDigits(date.getUTCSeconds());
};

module.exports = knex;
