
require("dotenv").config();

const dns = require("dns");

// Use Google's DNS for MongoDB SRV resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const registrationRoutes = require("./routes/registration");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
}));

// Request body limit
app.use(express.json({ limit: "1mb" }));
app.use("/api/registration", registrationRoutes);
app.use("/api/admin", adminRoutes);

// API rate limiting
app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
}));

// API health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "KJV Tech Bootcamp API"
    });
});

// Start server after MongoDB connects
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");
        console.log("Database:", mongoose.connection.name);

        app.listen(PORT, () => {
            console.log(`KJV Tech Bootcamp API running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
