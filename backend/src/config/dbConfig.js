const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'database.sqlite');

module.exports = {
  DB_PATH,
};
