// imports
const mongoose = require("mongoose");
const { config } = require("../config");

// db connection
function connect() {
  return mongoose.connect(process.env.MONGO_DB_URL_PRODUCTION);
}

module.exports = connect;
