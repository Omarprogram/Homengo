// routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  getCategories,
  getActiveCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoriesWithServices,
  getActiveCategoriesWithServices
} from "../controllers/categoryController.js";


const router = express.Router();

// Create category
router.post("/", createCategory);

// Get all categories
router.get("/", getCategories);

// ✅ Specific named routes MUST come before /:id
router.get("/active", getActiveCategories);
router.get("/with-services", getCategoriesWithServices);
router.get("/public", getActiveCategoriesWithServices);

// ✅ Dynamic :id routes come AFTER named routes
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id/status", toggleCategoryStatus);

export default router;