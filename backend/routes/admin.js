
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Participant = require("../models/Participant");

const router = express.Router();

// Administrator login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;

        console.log("ADMIN CONFIG CHECK:", {
    emailLoaded: Boolean(adminEmail),
    hashLoaded: Boolean(passwordHash),
    jwtLoaded: Boolean(process.env.JWT_SECRET)
});
        if (!adminEmail || !passwordHash || !process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Administrator authentication is not configured."
            });
        }

        const emailMatches =
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase();

        const passwordMatches = await bcrypt.compare(
            password,
            passwordHash
        );

        if (!emailMatches || !passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid administrator credentials."
            });
        }

        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({
            success: true,
            message: "Administrator login successful.",
            token
        });

    } catch (error) {
        console.error("Admin login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Login could not be completed."
        });
    }
});

// Protect administrator routes
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Administrator authentication required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Your session is invalid or has expired."
        });
    }
}

// View all registered participants
router.get("/participants", authenticateAdmin, async (req, res) => {
    try {
        const participants = await Participant.find()
            .select(
                "participantCode participantName school guardianName guardianPhone guardianEmail registrationStatus createdAt"
            )
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            total: participants.length,
            participants
        });

    } catch (error) {
        console.error("Admin participants error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Could not retrieve participant records."
        });
    }
});

module.exports = router;
