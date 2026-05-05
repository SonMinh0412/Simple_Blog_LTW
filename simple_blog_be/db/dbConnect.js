const mongoose = require("mongoose");
const User = require("./userModel.js");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected!");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = dbConnect;
