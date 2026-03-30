// back-end/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/Routes.js";
import authRoutes from "./src/routes/authRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import adminRoutes from "./src/routes/AdminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import subscriptionRoutes from "./src/routes/subscriptionRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import counterRoutes from "./src/routes/counterRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";

// -------------------- Environment --------------------
dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET || "";
const mongoUri = process.env.MONGO_URI || "";
const corsOrigin = process.env.CORS_ORIGIN || "";

const knownWeakJwtSecrets = new Set([
  "changeme",
  "secret",
  "mysecret",
  "Fanni_super_secretKey",
]);

const allowedOrigins = corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const normalizeOrigin = (value = "") => String(value).trim().replace(/\/$/, "");
const normalizedAllowedOrigins = allowedOrigins.map(normalizeOrigin);

// -------------------- Required env validation --------------------
if (!mongoUri) {
  console.error("❌ Missing required environment variable: MONGO_URI");
  process.exit(1);
}

if (!jwtSecret) {
  console.error("❌ Missing required environment variable: JWT_SECRET");
  process.exit(1);
}

if (isProduction && (jwtSecret.length < 32 || knownWeakJwtSecrets.has(jwtSecret))) {
  console.error("❌ JWT_SECRET is too weak for production. Use a long random secret.");
  process.exit(1);
}

if (isProduction && /(localhost|127\.0\.0\.1)/i.test(mongoUri)) {
  console.error("❌ MONGO_URI points to localhost in production.");
  process.exit(1);
}

if (isProduction && allowedOrigins.length === 0) {
  console.error("❌ CORS_ORIGIN must be set in production.");
  process.exit(1);
}

// -------------------- Database --------------------
// ✅ Connect BEFORE registering routes so models are ready
connectDB();

// -------------------- Rate Limiter --------------------
// ✅ Skip entirely in development — was causing all the 429 errors during testing
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== "production",
  message: { success: false, message: "Too many requests, please try again later." },
});

// -------------------- Core Middleware --------------------
if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      const normalizedIncomingOrigin = normalizeOrigin(origin);
      if (
        !origin ||
        normalizedAllowedOrigins.length === 0 ||
        normalizedAllowedOrigins.includes(normalizedIncomingOrigin)
      ) {
        return callback(null, true);
      }

      const corsError = new Error(`Not allowed by CORS: ${origin}`);
      corsError.status = 403;
      return callback(corsError);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static uploads — must come BEFORE rate limiter so image requests aren't rate-limited
app.use("/uploads", express.static("uploads"));

// Apply rate limiter to all /api routes
app.use("/api", limiter);

// -------------------- Routes --------------------
// ✅ Fixed: adminRoutes was registered TWICE (once before and once inside connectDB block)
// ✅ Fixed: all routes are now in one place, in a logical order
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/counters", counterRoutes);
app.use("/api", routes); // ✅ General routes last — most specific routes above take priority

// -------------------- Utility Endpoints --------------------
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "🚀 API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// -------------------- Error Handling --------------------
// ✅ Fixed: errorHandler must come BEFORE the 404 catch-all
// Express identifies error handlers by their 4-argument signature (err, req, res, next)
app.use(errorHandler);

// 404 — must be the very last middleware
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  if (allowedOrigins.length > 0) {
    console.log(` Allowed CORS origins: ${allowedOrigins.join(", ")}`);
  }
});