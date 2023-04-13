require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Config JSON responser
app.use(express.json());

// Models
const User = require("./models/User");

// Open Route / Public Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome!" });
});

// Register
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  // Validations
  if (!name) {
    res.status(422).json({ msg: "Invalid name." });
  }
  if (!email) {
    res.status(422).json({ msg: "Invalid email." });
  }
  if (!password) {
    res.status(422).json({ msg: "Invalid password." });
  }

  if (password !== confirmpassword) {
    res.status(422).json({ msg: "The passwords do not match." });
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(422).json({ msg: "A user with this email already exists." });
  }

  // Create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({ msg: "User created successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "An error occurred on the server. Please try again later.",
    });
  }
});

// Credentials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@authjwtcluster.bfusk5k.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000);
    console.log("Connected!");
  })
  .catch((error) => console.log(error));
