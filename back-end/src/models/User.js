//User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true }, // store hashed password here
  phoneNumber: { type: String },
  role: { type: String, enum: ["A", "C", "W"], required: true }, // A=Admin, C=Client, W=Worker
  createdAt: { type: Date, default: Date.now }

});

// Method to check password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // use 'password' field
};

//Hooks called pre It runs before a document (User) is saved into MongoDB automatically do hash password before saving
userSchema.pre('save', async function (next) {
   if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  //isModified check if the user field changes
  if (!this.isModified('password')) return next(); //next mean skip
  
  //random string
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


export default mongoose.model("User", userSchema);


