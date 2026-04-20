import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const userExists = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with that email or username" });
    }

    // Create a new User
    const newUser = await User.create({
      username: username,
      email: email,
      password: password,
    });

    // create a jwt token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
      });
  } catch (err) {
    console.log("Register error: " + err.message);
    res.status(500).json({ message: "Error during registration" });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
      });
  } catch (err) {
    console.log("Login error: " + err.message);
    res.status(500).json({ message: "Error during login" });
  }
};

// Get the currently logged in user's profile
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    bio: req.user.bio,
  });
};

// Logout - clear cookie
const logout = (req, res) => {
  res
    .clearCookie("jwt", { httpOnly: true, sameSite: "lax" })
    .json({ message: "Logged out" });
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update bio
    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    // Update username
    if (req.body.username !== undefined) {
      user.username = req.body.username;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
    });
  } catch (err) {
    console.log("Update profile error: " + err.message);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export {register, login, logout, getMe, updateProfile}
