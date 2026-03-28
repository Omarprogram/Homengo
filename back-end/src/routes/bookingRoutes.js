// bookingRoutes.js
import express from "express";
import {
  createBooking,
  getAllBookings,        // ✅ new — fixes 404 on GET /api/bookings
  getUpcomingBookings,
  updateBookingStatus,
  updateBookingProgress,
  createManualBooking,
  getMyBookings,
  getBookingStatusStatistics,
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getActiveServices } from "../controllers/serviceController.js";

const router = express.Router();

// ✅ All named routes BEFORE dynamic /:id routes

// Stats
router.get("/statistics/status", authMiddleware, getBookingStatusStatistics);

// Upcoming (admin)
router.get("/upcoming", authMiddleware, getUpcomingBookings);

// My bookings (client)
router.get("/my", authMiddleware, getMyBookings);

// Manual booking (admin)
router.post("/manual", authMiddleware, createManualBooking);

// Active services list (public)
router.get("/services", getActiveServices);

// ALL bookings — used by Bookings.jsx, History.jsx, Calendar.jsx
// ✅ This route was missing — caused all the 404s on GET /api/bookings
router.get("/", authMiddleware, getAllBookings);

// Create booking (client)
router.post("/", authMiddleware, createBooking);

// ✅ Dynamic :id routes LAST
router.put("/:id/status", authMiddleware, updateBookingStatus);
router.patch("/:id/progress", authMiddleware, updateBookingProgress);

export default router;