var db = require('./db');
var Q = require('q');
var dbMigrationsTable = 'db_migrations';

function ensureMigrationTable() {
  var migrationTable = "CREATE TABLE IF NOT EXISTS `" + dbMigrationsTable + "`" +
    "(id VARCHAR(64) PRIMARY KEY NOT NULL," +
    "author VARCHAR(64)," +
    "date_run DATETIME);";

  return db.raw(migrationTable);
}

ensureMigrationTable()
  .then(function () {
    var files = require("path").join(__dirname, "db_migrations");
    var migrations = [];
    require("fs")
      .readdirSync(files)
      .forEach(function (file) {
        var migration = require('./db_migrations/' + file);
        console.log('Checking migrations table for: ', migration.id);
        var findMigrationQuery = db(dbMigrationsTable).where('id', migration.id).first();
        console.log(findMigrationQuery.toString());
        findMigrationQuery.then(function (result) {
            console.log('result', result);
            if (!result) {
              console.log('Running migration:', migration.id);
              var promises = [];
              migration.updates.forEach(function (item) {
                var sql = item.sql.join('\n');
                promises.push(db.raw(sql));
              });

              Q.all(promises).then(function () {
                migrations.push(db.insert({
                  id: migration.id,
                  author: migration.author,
                  date_run: db.toMysqlFormat(new Date())
                }).into(dbMigrationsTable));
              });
            } else {
              console.log('Migration:', migration.id, ' already run!');
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      });

    Q.all(migrations).then(function () {
      process.exit('Migrations Complete!');
    });

    if (migrations.length === 0) {
      process.exit('Nothing to migrate');
    }
  });
