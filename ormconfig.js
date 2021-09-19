const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
   "type": "mysql",
   "host": "localhost",
   "port": process.env.DATABASE_PORT,
   "username": process.env.DATABASE_USERNAME,
   "password":  process.env.DATABASE_PASSWORD,
   "database":  process.env.DATABASE_NAME,
   "synchronize": true,
   "logging": false,
   "entities": [
      isProduction ? path.join(__dirname, "/build/src/entity/*{.ts,.js}"): "src/entity/**/*.ts"
   ],
   "migrations": [
      isProduction ? path.join(__dirname, "/build/src/migration/*{.ts,.js}"): "src/migration/**/*.ts"
   ],
   "subscribers": [
      isProduction ? path.join(__dirname, "/build/src/subscriber/*{.ts,.js}"):  "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir":  isProduction ? path.join(__dirname, "/build/src/entity/*{.ts,.js}"):  "src/entity",
      "migrationsDir": isProduction ? path.join(__dirname, "/build/src/migration/*{.ts,.js}"): "src/migration",
      "subscribersDir":isProduction ? path.join(__dirname, "/build/src/subscriber/*{.ts,.js}"): "src/subscriber"
   }
}