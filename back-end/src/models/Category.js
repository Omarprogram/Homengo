// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // ✅ Removed manual createdAt — using Mongoose timestamps option instead.
    // Manual createdAt fields are not indexed and can cause sort inconsistencies.
  },
  { timestamps: true } // auto-adds createdAt + updatedAt, properly indexed
);

export default mongoose.model("Category", categorySchema);