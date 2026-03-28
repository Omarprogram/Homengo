import bcrypt from "bcryptjs";

// Hash a password
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

// Compare password with hash
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
