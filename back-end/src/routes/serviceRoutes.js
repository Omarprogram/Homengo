// src/routes/serviceRoutes.js
import express from "express";
import multer from "multer";
import {
  createService,
  getServices,
  updateService,
  deleteService,
  toggleServiceStatus,
  getActiveServices, // ✅ added missing import
} from "../controllers/serviceController.js";
import Service from "../models/Service.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Named/specific routes BEFORE /:id
router.get("/", getServices);
router.get("/active", getActiveServices); // ✅ was missing entirely

router.post("/", upload.single("image"), createService);
router.put("/:id", upload.single("image"), updateService);
router.delete("/:id", deleteService);
router.patch("/:id/status", toggleServiceStatus);

// ✅ Dynamic :id route LAST
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("category");
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;