const registrationForm = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");

// Backend API address
const API_URL = "http://localhost:5000/api/registration";

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formMessage.style.display = "none";

    const formData = {
        participantName: document.getElementById("participantName").value.trim(),
        school: document.getElementById("school").value.trim(),
        guardianName: document.getElementById("guardianName").value.trim(),
        guardianPhone: document.getElementById("guardianPhone").value.trim(),
        guardianEmail: document.getElementById("guardianEmail").value.trim(),
        guardianConsent: document.getElementById("guardianConsent").checked
    };

    if (!formData.guardianConsent) {
        showMessage("Parent or guardian consent is required.", "error");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting Registration...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
            throw new Error(
                result.message || "Registration could not be completed."
            );
        }

        // Save the registration details for the next pages
        sessionStorage.setItem(
            "kjvParticipant",
            JSON.stringify(result.registration)
        );

        // Move to the payment page
        window.location.href = "payment.html";

    } catch (error) {
        console.error("Registration error:", error);

        showMessage(
            error.message.includes("Failed to fetch")
                ? "Cannot connect to the server. Please make sure your backend is running."
                : error.message,
            "error"
        );

        submitButton.disabled = false;
        submitButton.textContent = "Continue Registration →";
    }
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.style.display = "block";

    formMessage.style.color =
        type === "success" ? "#38BDF8" : "#F87171";
}