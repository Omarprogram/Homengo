//client.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number }, 
  longitude: { type: Number }, 
  isBlocked: { type: Boolean, default: false }
});


export default mongoose.model("Client", clientSchema);