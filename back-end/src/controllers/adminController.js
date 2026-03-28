// adminController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import path from "path"; // ✅ was missing
import fs from "fs";     // ✅ was missing

// Block a user
export const blockUser = async (req, res) => {
  try {
    const { userId, adminPassword } = req.body;

    const admin = await User.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // ✅ unified role check across all admin functions
    if (admin.role !== "admin" && admin.role !== "A")
      return res.status(403).json({ message: "Not authorized" });

    const isAdminPassCorrect = await bcrypt.compare(adminPassword, admin.password);
    if (!isAdminPassCorrect)
      return res.status(401).json({ message: "Invalid admin password" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = true;
    await user.save();

    res.json({ message: `User ${user.userName} has been blocked successfully.` });
  } catch (err) {
    console.error("Block user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Unblock a user
export const unblockUser = async (req, res) => {
  try {
    const { userId, adminPassword } = req.body;

    const admin = await User.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.role !== "admin" && admin.role !== "A")
      return res.status(403).json({ message: "Not authorized" });

    const isAdminPassCorrect = await bcrypt.compare(adminPassword, admin.password);
    if (!isAdminPassCorrect)
      return res.status(401).json({ message: "Invalid admin password" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();

    res.json({ success: true, message: `User ${user.userName} has been unblocked successfully.` });
  } catch (err) {
    console.error("Unblock user error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    // ✅ was only checking "A", now allows both "admin" and "A"
    if (req.user.role !== "admin" && req.user.role !== "A")
      return res.status(403).json({ success: false, message: "Not authorized" });

    const admin = await User.findById(req.user.id).select("-password"); // ✅ use req.user.id consistently
    res.json({ success: true, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    const { fullName, userName, email, phoneNumber, password } = req.body;

    admin.fullName = fullName || admin.fullName;
    admin.userName = userName || admin.userName;
    admin.email = email || admin.email;
    admin.phoneNumber = phoneNumber || admin.phoneNumber;
    if (password) admin.password = password;

    // ✅ path and fs are now imported so this block works correctly
    if (req.file) {
      if (admin.profilePicture) {
        const oldPath = path.join("uploads", admin.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      admin.profilePicture = req.file.filename;
    }

    await admin.save();

    res.json({ success: true, message: "Profile updated", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};