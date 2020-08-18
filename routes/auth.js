const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

// @route  POST /auth/login
// @desc   Login user
// @access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  // const payload = {
  //   user: {
  //     id: user.id,
  //   },
  // };
  // jwt.sign(
  //   payload,
  //   process.env.JWT_SECRET,
  //   { expiresIn: 360000 },
  //   (err, token) => {
  //     if (err) throw err;
  //     res.json({ token });
  //   }
  // );

  res.json({ email, password });
});

// @route  POST /auth/signup
// @desc   Sign up user
// @access Public
router.post(
  "/signup",
  [
    check("name", "Please enter your name").not().isEmpty(),
    check("email", "Please enter E mail").not().isEmpty(),
    check("password", "Please enter a password").not().isEmpty(),
  ],
  async (req, res) => {
    // handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // Checking if a user with the same email already exists
      let existingUserCheck = await User.findOne({ email });
      if (existingUserCheck) {
        return res.status(400).json({
          errors: [{ msg: "User with that email already exists" }],
        });
      }

      const user = new User({
        name,
        email,
        password,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      // create a hash and puts it in the user object
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server err");
    }
  }
);

module.exports = router;
