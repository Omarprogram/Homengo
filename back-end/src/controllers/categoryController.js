// controllers/categoryController.js
import Category from "../models/Category.js";
import Service from "../models/Service.js";

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get only active categories
export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete category and all its services
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Service.deleteMany({ category: id });

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category and its services deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle category status
export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.status = category.status === "active" ? "inactive" : "active";
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all categories with their services nested
// Fixed: was doing N+1 queries (one DB call per category).
// Now uses a single $lookup aggregation — much faster and reduces request count,
// which directly helps with the 429 rate limit issue.
export const getCategoriesWithServices = async (req, res) => {
  try {
    const result = await Category.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "services",       // MongoDB collection name (lowercase plural)
          localField: "_id",
          foreignField: "category",
          as: "services",
          pipeline: [{ $sort: { name: 1 } }],
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get active categories with their active services
// Same fix — single aggregation instead of N+1 queries
export const getActiveCategoriesWithServices = async (req, res) => {
  try {
    const result = await Category.aggregate([
      { $match: { status: "active" } },
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "category",
          as: "services",
          pipeline: [
            { $match: { status: "active" } },
            { $sort: { name: 1 } },
          ],
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};