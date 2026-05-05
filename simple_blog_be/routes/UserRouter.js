const express = require("express");
const User = require("../db/userModel");

const router = express.Router();

router.post("/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({
        message: "Username and password are required",
      });
    }
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send({
        massage: "Username already exists",
      });
    }
    const user = new User({
      username,
      password,
    });

    await user.save();

    res.status(201).send({
      id: user._id,
      username: user.username,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({
        message: "Username and password are required",
      });
    }
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).send({
        message: "Invalid username and password",
      });
    }
    res.status(200).send({ id: user._id, username: user.username });
  } catch (error) {
    res.status(500).send({
      message: "Login failed",
    });
  }
});

module.exports = router;
