import mongoose from "mongoose";
const professionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: { type: String } // URL or Base64
});

export default mongoose.model("Profession", professionSchema);