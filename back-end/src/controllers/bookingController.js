// bookingController.js
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import mongoose from "mongoose";

// ✅ REMOVED: authMiddleware was here before — now lives in middlewares/authMiddleware.js only

// ------------------------
// Client creates booking
// ------------------------
export const createBooking = async (req, res) => {
  try {
    const {
      clientName,
      phoneNumber,
      location,
      latitude,
      longitude,
      facilityType,
      note,
      serviceDate,
      serviceId,
    } = req.body;

    const booking = await Booking.create({
      clientName,
      clientId: req.user?._id || null, // ✅ use ._id (authMiddleware sets full user object)
      serviceId,
      phoneNumber,
      location,
      latitude,
      longitude,
      facilityType,
      note,
      serviceDate,
      status: "pending",
      progress: "in-progress",
    });

    res.status(201).json({ message: "Booking submitted", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------
// Admin fetch upcoming bookings (with optional status/date filter)
// ------------------------
export const getUpcomingBookings = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    let filter = {};

    if (status) filter.status = status;
    else filter.status = { $in: ["pending", "approved"] };

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filter.serviceDate = { $gte: fromDate, $lte: toDate };
    }

    const bookings = await Booking.find(filter)
      .populate("clientId", "fullName email")
      .populate("workerId", "fullName")
      .sort({ serviceDate: 1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------
// Get ALL bookings (used by Bookings.jsx and History.jsx)
// ✅ Was missing — caused 404 on GET /api/bookings
// ------------------------
export const getAllBookings = async (req, res) => {
  try {
    const { from, to, status } = req.query;
    let filter = {};

    if (status) filter.status = status;

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filter.serviceDate = { $gte: fromDate, $lte: toDate };
    }

    const bookings = await Booking.find(filter)
      .populate("clientId", "fullName email")
      .populate("workerId", "fullName")
      .populate("serviceId", "name")
      .sort({ serviceDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------
// Admin updates booking status
// ------------------------
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------
// Worker/Client updates progress
// ------------------------
export const updateBookingProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (!["in-progress", "completed", "cancelled"].includes(progress)) {
      return res.status(400).json({ message: "Invalid progress value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ message: `Booking marked as ${progress}`, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------
// Admin manual booking (no client account)
// ------------------------
export const createManualBooking = async (req, res) => {
  try {
    const { clientName, phoneNumber, location, serviceDate, serviceId, note, workerName } = req.body;

    if (!clientName || !phoneNumber || !location || !serviceDate || !serviceId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid serviceId" });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const booking = await Booking.create({
      clientName,
      clientId: req.user?._id || null, // ✅ ._id not .id
      serviceId,
      phoneNumber,
      location,
      serviceDate: new Date(serviceDate),
      note,
      workerName: workerName || null,
      facilityType: service.name,
      status: "pending",
      progress: "in-progress",
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating manual booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------
// Client fetches own bookings
// ------------------------
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ clientId: req.user._id }) // ✅ ._id not .id
      .populate("serviceId", "name")
      .sort({ serviceDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------
// GET /api/bookings/statistics/status?month=3&year=2026
// ------------------------
export const getBookingStatusStatistics = async (req, res) => {
  try {
    const { month, year } = req.query;
    const matchStage = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      matchStage.serviceDate = { $gte: start, $lt: end };
    }

    const stats = await Booking.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const result = {};
    stats.forEach(({ _id, count }) => { result[_id] = count; });

    res.json(result);
  } catch (err) {
    console.error("Statistics error:", err);
    res.status(500).json({ message: err.message });
  }
};