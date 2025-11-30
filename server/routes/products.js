const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Product = require("../models/Product");
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
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
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

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ created_at: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
});

// ✅ GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
});

// ✅ POST create new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      size,
      availability,
      lookbook,
      quantity,
    } = req.body;
    console.log(quantity);

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, category, and quantity are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid non-negative integer",
      });
    }

    // Validate category ID format before querying
    if (!category.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    // Validate category ID
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID" });
    }

    // Create image URL (in production, use a proper file serving URL)
    const imageUrl = `http://localhost:${process.env.PORT || 5002}/uploads/${
      req.file.filename
    }`;

    const newProduct = await Product.create({
      name,
      description,
      price: priceNum,
      category,
      size,
      isAvailable: availability === "true" || availability === true,
      images: [imageUrl],
      lookbook,
      quantity: quantityNum,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
});

// ✅ PUT update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, size, availability, quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists)
        return res
          .status(400)
          .json({ success: false, message: "Invalid category ID" });
    }

    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number",
        });
      }
      product.price = priceNum;
    }

    if (quantity !== undefined) {
      const quantityNum = parseInt(quantity, 10);
      if (isNaN(quantityNum) || quantityNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a valid non-negative integer",
        });
      }
      product.quantity = quantityNum;
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.category = category ?? product.category;
    product.size = size ?? product.size;
    if (availability !== undefined) {
      product.isAvailable = availability === "true" || availability === true;
    }

    // Update image if a new file was uploaded
    if (req.file) {
      // Delete old image file if it exists
      if (product.images && product.images.length > 0) {
        const oldImagePath = path.join(__dirname, "..", product.images[0]);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      const imageUrl = `http://localhost:${process.env.PORT || 5002}/uploads/${
        req.file.filename
      }`;
      product.images = [imageUrl];
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
});

// ✅ DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});

router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products by category" });
  }
});

router.get("/lookbook/:lookbookId", async (req, res) => {
  try {
    const products = await Product.find({ lookbook: req.params.lookbookId });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products by lookbook:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products by lookbook" });
  }
});

router.patch("/:id/quantity", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid non-negative integer",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    product.quantity = quantityNum;
    await product.save();

    res.json({
      success: true,
      message: "Quantity updated successfully",
      data: { id: product._id, quantity: product.quantity },
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({
      success: false,
      message: "Error updating quantity",
      error: error.message,
    });
  }
});

module.exports = router;
