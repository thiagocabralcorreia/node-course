require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Open Route / Public Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome!" });
});

app.listen(8000);
