require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const Participant = require("./models/Participant");

async function checkParticipant() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const participant = await Participant.findById(
            "6aee5b1f1468f9c7f6419964"
        );

        console.log("SAVED PARTICIPANT:");
        console.log(participant);

    } catch (error) {
        console.error("ERROR:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkParticipant();