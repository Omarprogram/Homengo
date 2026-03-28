import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  isActive: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date, default: null },
  preferences: {
    services: { type: Boolean, default: true },
    offers: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true }
  },
  source: { type: String, default: 'website' },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });


subscriptionSchema.index({ email: 1, isActive: 1 });



export default mongoose.model("Subscription", subscriptionSchema);