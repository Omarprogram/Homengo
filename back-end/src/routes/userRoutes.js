import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";
//import { updateUserProfile } from "../controllers/userController.js";
const router = express.Router();

// ✅ Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ✅ Signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, username, email, password, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      phoneNumber,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = req.body.fullName || user.fullName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;


    // Update password only if provided
    if (req.body.newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      // Set new password (hashing happens in model pre-save hook)
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




export default router;