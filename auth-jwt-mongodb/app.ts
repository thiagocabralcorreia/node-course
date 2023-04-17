import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User, { User as UserDocument } from "./models/User";

const app = express();

// Config JSON responser
app.use(express.json());

// Open Route / Public Route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ msg: "Welcome!" });
});

// Private Route
app.get("/user/:id", checkToken, async (req: Request, res: Response) => {
  const id: string = req.params.id;

  // Check if user exists
  const user: UserDocument | null = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }

  return res.status(200).json({ user });
});

// Middleware
function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader: string | undefined = req.headers["authorization"];
  const token: string | undefined = authHeader && authHeader.split(" ")[1]; // token
  // If "Bearer saSkjhASakj", so authHeader.split(" ")[1] = saSkjhASakj

  if (!token) {
    return res.status(401).json({ msg: "Access denied." });
  }

  try {
    const secret: string | undefined = process.env.SECRET;

    if (!secret) {
      throw new Error("Invalid secret");
    }

    jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(404).json({ msg: "Invalid token." });
  }
}

// Register
app.post("/auth/register", async (req: Request, res: Response) => {
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
  const userExists: UserDocument | null = await User.findOne({ email: email });

  if (userExists) {
    return res
      .status(422)
      .json({ msg: "A user with this email already exists." });
  }

  // Create password
  const salt: string = await bcrypt.genSalt(12);
  const passwordHash: string = await bcrypt.hash(password, salt);

  // Create user
  const user: UserDocument = new User({
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
app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  // Validations
  if (!email) {
    return res.status(422).json({ msg: "Invalid email." });
    // 422: the server can't process your request, although it understands it
  }
  if (!password) {
    return res.status(422).json({ msg: "Invalid password." });
  }

  // Check if the user exists
  const user: UserDocument | null = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }

  // Check if the password matches
  const checkPassword: boolean = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(404).json({ msg: "Invalid password." });
  }

  try {
    const secret: string | undefined = process.env.SECRET;
    const token: string = jwt.sign(
      {
        id: user._id,
      },
      secret || ""
    );

    return res
      .status(201)
      .json({ msg: "Authentication successful", token, user });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server. Please try again later.",
    });
  }
});

// Update user
app.put("/auth/:id/update", async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;
  const id: string = req.params.id;

  // Check if user exists
  const user: UserDocument | null = await User.findById(id, "-password");

  if (!email) {
    return res.status(422).json({ msg: "New email required." });
  }

  try {
    if (user) {
      user.email = email;
      await user.save();
      console.log(user);

      return res.status(201).json({ msg: "User updated successfully!" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server. Please try again later.",
    });
  }
});

// Cancel account / delete user
app.delete("/auth/:id/delete", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const user: UserDocument | null = await User.findById(id, "-password");
  if (!user) {
    return res.status(404).json({ msg: "User not found." });
  }

  try {
    await User.findByIdAndDelete(id);
    return res.status(204).send({ msg: "User deleted successfully!" }); // 204 indicate that the request was successful but there is no response body
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "We do not have any user with the ID yet" });
  }
});

// Credentials
const dbUser: string | undefined = process.env.DB_USER;
const dbPassword: string | undefined = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@authjwtcluster.bfusk5k.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8000);
    console.log("Connected!");
  })
  .catch((error) => console.log(error));
