import express from "express";
import { blockUser, getAdminProfile, updateAdminProfile, unblockUser } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${req.user.id}_${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ================= Routes ==================

// Get admin profile
router.get("/profile", authMiddleware, getAdminProfile);

// Update admin profile (including profile picture)
router.put("/update-profile", authMiddleware, upload.single("profilePicture"), updateAdminProfile);

// Only logged-in users can access this, admin check inside controller
router.post("/block-user", authMiddleware, blockUser);
router.post("/unblock-user", authMiddleware, unblockUser);

export default router;
