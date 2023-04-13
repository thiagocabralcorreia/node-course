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
  return res.status(200).json({ msg: "Welcome!" });
});

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // Check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }

  return res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // token
  // If "Bearer saSkjhASakj", so authHeader.split(" ")[1] = saSkjhASakj

  if (!token) {
    return res.status(401).json({ msg: "Access denied." });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(404).json({ msg: "Invalid token." });
  }
}

// Register
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  // Validations
  if (!name) {
    return res.status(422).json({ msg: "Invalid name." });
    // 422:  the server can't process your request, although it understands it
  }
  if (!email) {
    return res.status(422).json({ msg: "Invalid email." });
  }
  if (!password) {
    return res.status(422).json({ msg: "Invalid password." });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "The passwords do not match." });
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res
      .status(422)
      .json({ msg: "A user with this email already exists." });
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

    return res.status(201).json({ msg: "User created successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server. Please try again later.",
    });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validations
  if (!email) {
    return res.status(422).json({ msg: "Invalid email." });
    // 422:  the server can't process your request, although it understands it
  }
  if (!password) {
    return res.status(422).json({ msg: "Invalid password." });
  }

  // Check if the user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }

  // Check if the password matches
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(404).json({ msg: "Invalid password." });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    return res.status(201).json({ msg: "Authentication successful", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
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
