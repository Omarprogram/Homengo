// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // link to category
  status: { 
    type: String, 
    enum: ["active", "inactive"], 
    default: "inactive" 
  },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Service", serviceSchema);
