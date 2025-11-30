const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Lookbook = require("../models/Lookbook");

// Multer config
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "lookbook-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// GET all lookbooks
router.get("/", async (req, res) => {
  try {
    const lookbooks = await Lookbook.find().sort({ created_at: -1 });
    res.json({ success: true, data: lookbooks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching lookbooks" });
  }
});

// POST create lookbook
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !req.file)
      return res
        .status(400)
        .json({
          success: false,
          message: "Lookbook name and image are required",
        });

    const existing = await Lookbook.findOne({ name });
    if (existing)
      return res
        .status(400)
        .json({
          success: false,
          message: "Lookbook with this name already exists",
        });

    const imageUrl = `http://localhost:${process.env.PORT || 5002}/uploads/${
      req.file.filename
    }`;

    const lookbook = await Lookbook.create({
      name,
      image: imageUrl,
      description,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Lookbook added successfully",
        data: lookbook,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding lookbook" });
  }
});

// PUT update lookbook
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const lookbook = await Lookbook.findById(req.params.id);
    if (!lookbook)
      return res
        .status(404)
        .json({ success: false, message: "Lookbook not found" });

    if (name && name !== lookbook.name) {
      const exists = await Lookbook.findOne({ name });
      if (exists)
        return res
          .status(400)
          .json({
            success: false,
            message: "Another lookbook with this name exists",
          });
    }

    lookbook.name = name ?? lookbook.name;
    lookbook.description = description ?? lookbook.description;

    if (req.file) {
      if (lookbook.image) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          path.basename(lookbook.image)
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error(err);
        }
      }
      lookbook.image = `http://localhost:${process.env.PORT || 5002}/uploads/${
        req.file.filename
      }`;
    }

    await lookbook.save();
    res.json({
      success: true,
      message: "Lookbook updated successfully",
      data: lookbook,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating lookbook" });
  }
});

// DELETE lookbook
router.delete("/:id", async (req, res) => {
  try {
    const lookbook = await Lookbook.findByIdAndDelete(req.params.id);
    if (!lookbook)
      return res
        .status(404)
        .json({ success: false, message: "Lookbook not found" });

    res.json({
      success: true,
      message: "Lookbook deleted successfully",
      data: lookbook,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting lookbook" });
  }
});

module.exports = router;
