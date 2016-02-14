# Node Starter Project

I start new Node.js projects all the time. I find myself doing the same things over and over. NO MORE!
This project uses Express with MySql. I leave the configuration to serve static files so you can choose whatever client-side framework you'd like

## Quick start Guide
- git clone git@github.com:GentryRiggen/node-starter.git
- npm install
- copy ./config/conf.example.js to ./config/conf.js and update all the settings for you project
- Ensure you have a mysql database with a schema configuration matching your conf.js settings
- Initialize the db -> mysql -u <USERNAME> -p -h <HOSTNAME_OR_IP> <SCHEMA_NAME> < db_migrations/db_init_1.sql
- gulp
- Now in postman you can authenticate by doing:
    - POST: http://localhost:8000/api/auth 
    - HEADERS: Content-Type - application/json
    - BODY: {"username": "admin", "password": "admin"}
- Now you have a JSON Web Token that you can pass on every request in the HEADER: Authorization - Bearer <JWT>
