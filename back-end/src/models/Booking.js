// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  workerName: { type: String }, 
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number }, 
  facilityType: { type: String, required: true },
  note: { type: String },
  serviceDate: { type: Date, required: true },
  status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
  progress: { type: String, enum: ["in-progress", "completed", "cancelled"], default: "in-progress"},
  createdAt: { type: Date, default: Date.now },
  feedback: {review: { type: String }, stars: { type: Number, min: 1, max: 5 }}
});

export default mongoose.model("Booking",bookingSchema);