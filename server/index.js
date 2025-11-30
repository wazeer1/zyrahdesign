const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const lookbookRoutes = require("./routes/lookbook");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/lookbook", lookbookRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Initialize data directory
const dataDir = path.join(__dirname, "data");
const productsFile = path.join(dataDir, "products.json");

async function initializeData() {
  try {
    await fs.mkdir(dataDir, { recursive: true });

    // Check if products.json exists, if not create it
    try {
      await fs.access(productsFile);
    } catch {
      await fs.writeFile(productsFile, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Error initializing data directory:", error);
  }
}

// Start server
async function startServer() {
  await initializeData();
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB Atlas connected successfully");
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);
