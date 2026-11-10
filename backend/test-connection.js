require("dotenv").config({ path: require("path").join(__dirname, ".env") });


const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinary");
const jwt = require("jsonwebtoken");

async function testConnections() {
    console.log("\n==================================");
    console.log(" KJV TECH BOOTCAMP CONNECTION TEST");
    console.log("==================================\n");

    // 1. Test MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("1. MongoDB: CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.log("1. MongoDB: CONNECTION FAILED");
        console.log("   Reason:", error.message);
    }

    // 2. Test Cloudinary
    try {
        const result = await cloudinary.api.ping();

        if (result.status === "ok") {
            console.log("2. Cloudinary: CONNECTED SUCCESSFULLY");
        } else {
            console.log("2. Cloudinary: UNEXPECTED RESPONSE");
        }
    } catch (error) {
        console.log("2. Cloudinary: CONNECTION FAILED");
        console.log("   Reason:", error.message);
    }

    // 3. Test JWT
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from .env");
        }

        const token = jwt.sign(
            { test: "KJV Tech Bootcamp" },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.test === "KJV Tech Bootcamp") {
            console.log("3. JWT: SIGNING AND VERIFICATION SUCCESSFUL");
        }
    } catch (error) {
        console.log("3. JWT: TEST FAILED");
        console.log("   Reason:", error.message);
    }

    // Close database connection
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.log("Database disconnect warning:", error.message);
    }

    console.log("\n==================================");
    console.log(" CONNECTION TEST COMPLETED");
    console.log("==================================\n");
}

testConnections();
