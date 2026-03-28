// middlewares/signToken.js
import jwt from "jsonwebtoken";

// ✅ Never hardcode secrets — always use environment variables
export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};