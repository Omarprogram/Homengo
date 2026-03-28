// models/Worker.js
import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phoneNumber: { type: String },
  professionId: { type: mongoose.Schema.Types.ObjectId, ref: "Profession" },
  address: { type: String },
  isAvailable: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false }
});

export default mongoose.model("Worker", workerSchema);
