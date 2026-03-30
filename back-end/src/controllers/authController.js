// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

// Generate JWT
const generateToken = (id, role) => jwt.sign({ id, role }, SECRET, { expiresIn: "30d" });

// ==================== REGISTER ====================

export const register = async (req, res) => {
  try {
    const { fullName, userName, email, password, phoneNumber, role } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedUserName = String(userName || "").trim();

    if (!fullName || !normalizedUserName || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: "Full name, username, email and password are required" });
    }

    // Check for duplicates
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) return res.status(409).json({ success: false, message: "Email already exists" });

    const existingUsername = await User.findOne({ userName: normalizedUserName });
    if (existingUsername) return res.status(409).json({ success: false, message: "Username already exists" });

    // Create user (password hashed automatically by schema)
    const user = await User.create({
      fullName: String(fullName).trim(),
      userName: normalizedUserName,
      email: normalizedEmail,
      password,
      phoneNumber,
      role: role || "C",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    // Validate input
    if (!normalizedEmail || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// ==================== GET USER PROFILE ====================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// ==================== UPDATE PROFILE ====================
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if username is being changed and if it's already taken
    if (req.body.userName && req.body.userName !== user.userName) {
      const usernameExists = await User.findOne({ 
        userName: req.body.userName,
        _id: { $ne: user._id } 
      });
      if (usernameExists) {
        return res.status(409).json({ 
          success: false,
          message: "Username already taken" 
        });
      }
    }

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: user._id } 
      });
      if (emailExists) {
        return res.status(409).json({ 
          success: false,
          message: "Email already exists" 
        });
      }
    }

    // Update fields
    user.fullName = req.body.fullName || user.fullName;
    user.userName = req.body.userName || user.userName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    // Update password if provided (will be hashed automatically by pre-save hook)
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        userName: updatedUser.userName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ 
        success: false,
        message: `${field} already exists` 
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: "Validation failed", 
        errors 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};