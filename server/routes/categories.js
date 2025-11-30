const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Category = require("../models/Category");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "category-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ✅ GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ created_at: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching categories" });
  }
});

// ✅ POST create new category
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Category name and image are required",
      });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Create image URL (in production, use a proper file serving URL)
    const imageUrl = `http://localhost:${process.env.PORT || 5002}/uploads/${req.file.filename}`;

    const category = await Category.create({ name, image: imageUrl, description });
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ success: false, message: "Error adding category" });
  }
});

// ✅ PUT update category
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    if (name && name !== category.name) {
      const exists = await Category.findOne({ name });
      if (exists)
        return res.status(400).json({
          success: false,
          message: "Another category with this name exists",
        });
    }

    category.name = name ?? category.name;
    category.description = description ?? category.description;

    // Update image if a new file was uploaded
    if (req.file) {
      // Delete old image file if it exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, "..", category.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      const imageUrl = `http://localhost:${process.env.PORT || 5002}/uploads/${req.file.filename}`;
      category.image = imageUrl;
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating category" });
  }
});

// ✅ DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    res.json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting category" });
  }
});

module.exports = router;
