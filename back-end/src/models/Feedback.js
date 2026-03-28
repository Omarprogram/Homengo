// models/Feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true }, // or reference a service schema
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
