
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({

    // Unique participant identification
    participantCode: {
        type: String,
        unique: true,
        sparse: true
    },

    // Participant information
    participantName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    school: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    // Guardian information
    guardianName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    guardianPhone: {
        type: String,
        required: true,
        trim: true
    },

    guardianEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    // Guardian consent
    guardianConsent: {
        type: Boolean,
        required: true,
        validate: {
            validator: value => value === true,
            message: "Guardian consent is required."
        }
    },

    consentDate: {
        type: Date,
        default: Date.now
    },

    // Payment information
    paymentStatus: {
        type: String,
        enum: ["pending", "submitted", "verified", "rejected"],
        default: "pending"
    },

    paymentProof: {
        publicId: {
            type: String,
            default: null
        },
        uploadedAt: {
            type: Date,
            default: null
        }
    },

    // Access to learning materials
    manualUnlocked: {
        type: Boolean,
        default: false
    },

    registrationStatus: {
        type: String,
        enum: ["incomplete", "completed"],
        default: "incomplete"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Participant", participantSchema);
