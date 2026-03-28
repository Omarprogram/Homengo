// models/ServiceProvider.js
// ✅ Converted from CommonJS (require/module.exports) to ES Modules (import/export)
// The rest of your codebase uses ES Modules — mixing them causes a startup crash
import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["construction", "plumbing", "electrical", "carpentry", "painting", "other"],
    },
    location: {
      city: String,
      country: String,
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
    isVerified:          { type: Boolean, default: false },
    verifiedAt:          { type: Date, default: null },
    rating:              { type: Number, min: 0, max: 5, default: 0 },
    totalReviews:        { type: Number, default: 0 },
    services: [{ name: String, description: String, price: Number }],
    status:              { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    contractsCompleted:  { type: Number, default: 0 },
  },
  { timestamps: true } // ✅ auto-manages createdAt + updatedAt
);

serviceProviderSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model("ServiceProvider", serviceProviderSchema);