// imports
const mongoose = require("mongoose");
const { config } = require("../config");

// db connection
function connect() {
  return mongoose.connect(process.env.MONGODB_URI);
}

module.exports = connect;
