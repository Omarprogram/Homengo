// controllers/feedbackController.js
import Feedback from "../models/Feedback.js";

// Submit new feedback
export const submitFeedback = async (req, res) => {
  try {
    const { service, rating, comment } = req.body;
    const userId = req.user.id; // assume auth middleware sets req.user

    const feedback = new Feedback({
      user: userId,
      service,
      rating,
      comment,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update existing feedback
export const editFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const feedback = await Feedback.findOne({ _id: feedbackId, user: userId });
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    feedback.rating = rating ?? feedback.rating;
    feedback.comment = comment ?? feedback.comment;
    feedback.updatedAt = Date.now();

    await feedback.save();
    res.json({ message: "Feedback updated", feedback });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all feedbacks (for admin, worker, user)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "fullName userName") // optional, to get user info
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
