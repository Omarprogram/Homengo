//seedAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // adjust path
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "A" });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.email);
      return process.exit(0);
    }

    const plainPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log("🔑 Default admin credentials:");
    console.log("Email: admin@example.com");
    console.log("Password:", plainPassword);

    const admin = new User({
      fullName: "Super Admin",
      userName: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "A",
      phoneNumber: "",
      profilePicture: "",
    });

    await admin.save();
    console.log("Default admin created successfully");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
};

// ✅ Export as default
export default seedAdmin;