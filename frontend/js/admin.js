
const adminLoginForm = document.getElementById("adminLoginForm");
const adminMessage = document.getElementById("adminMessage");
const adminLoginButton = document.getElementById("adminLoginButton");

const API_URL = "http://localhost:5000/api/admin";

adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    adminMessage.style.display = "none";

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    adminLoginButton.disabled = true;
    adminLoginButton.textContent = "Signing In...";

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Administrator login failed."
            );
        }

        // Store authentication token for this browser tab
        sessionStorage.setItem("kjvAdminToken", result.token);

        // Open administrator dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Admin login error:", error.message);

        showAdminMessage(
            error.message.includes("Failed to fetch")
                ? "Cannot connect to the server. Please check that the backend is running."
                : error.message,
            "error"
        );

    } finally {
        adminLoginButton.disabled = false;
        adminLoginButton.textContent = "Sign In to Dashboard →";
        document.getElementById("adminPassword").value = "";
    }
});

function showAdminMessage(message, type) {
    adminMessage.textContent = message;
    adminMessage.style.display = "block";

    adminMessage.style.background =
        type === "success"
            ? "rgba(56, 189, 248, 0.12)"
            : "rgba(248, 113, 113, 0.12)";

    adminMessage.style.color =
        type === "success" ? "#38BDF8" : "#F87171";
}
