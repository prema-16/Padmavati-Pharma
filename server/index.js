// Fix for Node.js v18+ DNS resolution issue with MongoDB Atlas SRV on Windows
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();

// Connect DB
connectDB();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(mongoSanitize());

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://padmavati-pharma-e5mzwqqo9-premanand-londhe-s-projects.vercel.app",
    /\.vercel\.app$/,
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));

// Rate limiting
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: "Too many requests" } }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/products",   require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart",       require("./routes/cart"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/reviews",    require("./routes/reviews"));
app.use("/api/wishlist",   require("./routes/wishlist"));
app.use("/api/admin",      require("./routes/admin"));

// Health check
app.get("/api/health", (req, res) => res.json({ success: true, message: "Padmavati Pharma API running ✅" }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║  🏥 Padmavati Pharma API Running        ║
  ║  Port : ${PORT}                            ║
  ║  Mode : ${process.env.NODE_ENV || "development"}               ║
  ╚══════════════════════════════════════════╝
  `);
});
