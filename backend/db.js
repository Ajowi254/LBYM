//db.js
/** Database setup. */

const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = `postgresql://spuser:Spuser@localhost/expensebud_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `postgresql://spuser:Spuser@localhost/expensebud`;
}

const db = new Client({
  connectionString: DB_URI
});

db.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database', err));

module.exports = db;