const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

//POST register
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
        message: "Username already exists",
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

//POST login
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
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).send({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
    // req.session.user = {
    //   id: user._id,
    //   username: user.username,
    // };
    // res.status(200).send({ id: user._id, username: user.username });
  } catch (error) {
    res.status(500).send({
      message: "Login failed",
    });
  }
});

//GET all stats
router.get("/users/stats", requireAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select("_id username")
      .sort({ username: 1 })
      .lean();
    res.status(200).send(
      users.map((user) => ({
        id: user._id,
        username: user.username,
      })),
    );
  } catch (error) {
    res.status(500).send({
      message: "Failed to get users",
    });
  }
});

router.get("/users/me", requireAuth, (req, res) => {
  res.status(200).send(req.user);
});

router.post("/users/logout", (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     res.status(500).send("Error logging out");
  //   } else {
  //     res.clearCookie("connect.sid");
  //     res.status(200).send({ message: "Logout successful" });
  //   }
  // });
  res.status(200).send({ message: "Logout successful" });
});

module.exports = router;
