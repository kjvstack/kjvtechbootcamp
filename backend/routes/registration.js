
const express = require("express");
const mongoose = require("mongoose");
const Participant = require("../models/Participant");

const router = express.Router();

// POST: Register a new participant
router.post("/", async (req, res) => {
    try {
        const {
            participantName,
            school,
            guardianName,
            guardianPhone,
            guardianEmail,
            guardianConsent
        } = req.body;

        // Validate required fields
        if (
            !participantName ||
            !school ||
            !guardianName ||
            !guardianPhone ||
            !guardianEmail
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        // Validate guardian consent
        if (guardianConsent !== true) {
            return res.status(400).json({
                success: false,
                message: "Guardian consent is required."
            });
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(guardianEmail.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid guardian email address."
            });
        }

        // Create participant record
        const participant = await Participant.create({
            participantName: participantName.trim(),
            school: school.trim(),
            guardianName: guardianName.trim(),
            guardianPhone: guardianPhone.trim(),
            guardianEmail: guardianEmail.trim().toLowerCase(),
            guardianConsent: true,
            registrationStatus: "completed"
        });

        // Generate a unique registration number from MongoDB ID
        participant.participantCode =
            `KJV2026-${participant._id.toString().toUpperCase()}`;

        await participant.save();

        return res.status(201).json({
            success: true,
            message: "Participant registration submitted successfully.",

            registration: {
                id: participant._id,
                participantCode: participant.participantCode,
                participantName: participant.participantName,
                school: participant.school,
                registrationStatus: participant.registrationStatus
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                message: "Please check the submitted information."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration could not be completed. Please try again."
        });
    }
});

module.exports = router;
