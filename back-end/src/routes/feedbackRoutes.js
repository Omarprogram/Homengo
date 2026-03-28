// routes/feedbackRoutes.js
import express from "express";
import { submitFeedback, editFeedback, getAllFeedback } from "../controllers/feedbackController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // your JWT auth

const router = express.Router();

// Submit feedback
router.post("/", authMiddleware, submitFeedback);

// Edit feedback
router.put("/:feedbackId", authMiddleware, editFeedback);

// Get all feedbacks (everyone can view)
router.get("/", authMiddleware, getAllFeedback);

export default router;
