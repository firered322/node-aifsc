const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

// @route  POST /auth/login
// @desc   Login user and get auth token
// @access Public
router.post(
  "/login",
  [
    check("email", "Enter your registered Email id").isEmail(),
    check("password", "Enter your password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // Checking if a user with the same email already exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials." }],
        });
      }

      // comparing the passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Enter correct password." }],
        });
      }

      // jwt auth
      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 2 }, // 2 hours
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

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

      // jwt token generation
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 2 }, // 2 hours
        (err, token) => {
          if (err) throw err;
          // respond with the token for the new user
          res.json({ msg: "User Created", token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
