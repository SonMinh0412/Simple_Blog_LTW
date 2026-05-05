const mongoose = require("mongoose");
const User = require("./userModel.js");
require("dotenv").config();

async function dbConnect() {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected!");
    })
    .catch((error) => {
      console.error(error);
    });
  await User.findOneAndUpdate(
    { username: "admin" },
    { username: "admin", password: "123456" },
    { upsert: true, new: true, runValidators: true },
  );
}

module.exports = dbConnect;
