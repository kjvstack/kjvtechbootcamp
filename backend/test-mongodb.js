require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

console.log("MongoDB test started...");
console.log("MONGODB_URI loaded:", Boolean(process.env.MONGODB_URI));

async function testMongoDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 15000
        });

        console.log("MongoDB CONNECTED SUCCESSFULLY!");
        console.log("Database:", mongoose.connection.name);

    } catch (error) {
        console.log("MongoDB CONNECTION FAILED");
        console.log("Error:", error.message);

    } finally {
        await mongoose.disconnect().catch(() => {});
        console.log("Test completed.");
    }
}

testMongoDB();