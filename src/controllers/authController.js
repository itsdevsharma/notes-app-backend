// backend/src/controllers/auth.controller.js
import Auth from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Auth.create({
      username,  // ✅ fixed
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        username: newUser.username,  // ✅ fixed
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await Auth.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        username: user.username,  // ✅ fixed
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
