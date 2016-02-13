var config = {};

/*** MISC ***/
config.appUrl = 'http://node-starter.com';

config.jwt = {
  issuer: 'node-starter.com',
  secret: 'potatosalad'
};

/*** DATABASE ***/
var devDBInfo = {
  host: 'localhost',
  user: 'blah',
  password: 'blah',
  database: 'nodeStarterDB',
  debug: true
};
var prodDBInfo = {
  host: 'localhost',
  user: 'blah',
  password: 'blah',
  database: 'nodeStarterDB',
  debug: false
};
config.db = {
  knex: {
    development: {
      client: 'mysql',
      connection: {
        host: devDBInfo.host,
        user: devDBInfo.user,
        password: devDBInfo.password,
        database: devDBInfo.database
      },
      debug: devDBInfo.debug
    },
    production: {
      client: 'mysql',
      connection: {
        host: prodDBInfo.host,
        user: prodDBInfo.user,
        password: prodDBInfo.password,
        database: prodDBInfo.database
      },
      debug: prodDBInfo.debug
    }
  }
};


module.exports = config;
