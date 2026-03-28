// controllers/adminController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// export const blockUser = async (req, res) => {
//   try {
//     const { userId, adminPassword } = req.body;

//     // Check if current user is admin
//     const admin = await User.findById(req.user.id);
//     if (!admin || admin.role !== "admin") {
//       return res.status(403).json({ message: "Only admins can block users" });
//     }

//     // Verify admin password
//     const isAdminPasswordCorrect = await bcrypt.compare(adminPassword, admin.password);
//     if (!isAdminPasswordCorrect) {
//       return res.status(401).json({ message: "Incorrect admin password" });
//     }

//     // Block the target user
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.isBlocked = true;
//     await user.save();

//     res.json({ message: `User ${user.userName} has been blocked successfully` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
// }
// };