import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true, enum: ['workers','locations','contracts','rating', ] },
  value: { type: Number, required: true, default: 0 },
  label: { type: String, required: true },
  icon: { type: String, default: null },
  displayFormat: { type: String, default: 'number' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });


export default mongoose.model("Counter", counterSchema);