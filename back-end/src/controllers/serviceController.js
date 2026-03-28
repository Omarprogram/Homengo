// controllers/serviceController.js
import Service from "../models/Service.js";
import Category from "../models/Category.js";

// Create service
export const createService = async (req, res) => {
  try {
    const { name, description, category, status } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    // Check if service with same name exists
    const existing = await Service.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Service already exists" });
    }

    const service = await Service.create({
      name,
      description,
      category,
      status,
      image,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("category");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, category } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist" });
      }
    }

    const updated = await Service.findByIdAndUpdate(
      id,
      { name, description, status, category, ...(image && { image }) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle service status
export const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.status = service.status === "active" ? "inactive" : "active";
    await service.save();

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }



  
};

// Get only active services
export const getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ status: "active" }).populate("category").sort({ name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
