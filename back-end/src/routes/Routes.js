import express from "express";
import { getAllUsers, blockUser, unblockUser, getAdminProfile, updateAdminProfile } from "../controllers/adminController.js";
import { register, login, getUserById, updateUserProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { permit } from "../middlewares/roleMiddleware.js";
import { createBooking, getUpcomingBookings } from "../controllers/bookingController.js";

const router = express.Router();

// ===== AUTH =====
router.post("/register", register);
router.post("/login", login);

// ===== PROFILE =====
router.get("/profile", authMiddleware, getUserById);
router.put("/profile", authMiddleware, updateUserProfile);

// ===== ADMIN =====
// ✅ permit now includes both "admin" and "A" to match both role formats
router.get("/admin/users", authMiddleware, permit("admin", "A"), getAllUsers);
router.get("/admin/profile", authMiddleware, permit("admin", "A"), getAdminProfile);
router.put("/admin/profile", authMiddleware, permit("admin", "A"), updateAdminProfile);
router.post("/admin/block", authMiddleware, permit("admin", "A"), blockUser);
router.post("/admin/unblock", authMiddleware, permit("admin", "A"), unblockUser);

// ===== USERS =====
router.get("/users/:id", authMiddleware, getUserById);

// ===== BOOKINGS =====
router.post("/bookings", authMiddleware, createBooking); // ✅ added authMiddleware for security
router.get("/admin/bookings/upcoming", authMiddleware, permit("admin", "A"), getUpcomingBookings);

export default router;