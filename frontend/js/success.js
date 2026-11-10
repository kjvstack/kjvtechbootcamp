
const participantData = sessionStorage.getItem("kjvParticipant");

if (!participantData) {
    alert("Registration information was not found. Please register first.");
    window.location.href = "register.html";
} else {
    try {
        const participant = JSON.parse(participantData);

        document.getElementById("participantName").textContent =
            participant.participantName || "Not available";

        document.getElementById("participantSchool").textContent =
            participant.school || "Not available";

        document.getElementById("participantCode").textContent =
            participant.participantCode || "Not available";

    } catch (error) {
        alert("Your registration information could not be loaded.");
        window.location.href = "register.html";
    }
}
