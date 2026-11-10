const API_URL = "https://kjv-bootcamp-api.onrender.com/api/admin";
const MAX_CAPACITY = 40;

const token = sessionStorage.getItem("kjvAdminToken");

const participantsTableBody = document.getElementById("participantsTableBody");
const totalParticipants = document.getElementById("totalParticipants");
const availableSpaces = document.getElementById("availableSpaces");
const searchInput = document.getElementById("searchInput");
const dashboardMessage = document.getElementById("dashboardMessage");

const refreshButton = document.getElementById("refreshButton");
const exportButton = document.getElementById("exportButton");
const logoutButton = document.getElementById("logoutButton");

let allParticipants = [];

// Check whether an administrator session exists.
if (!token) {
    window.location.href = "admin.html";
}

// Display dashboard messages.
function showDashboardMessage(message, type = "info") {
    dashboardMessage.textContent = message;
    dashboardMessage.style.display = "block";

    dashboardMessage.style.background =
        type === "error"
            ? "rgba(248, 113, 113, 0.12)"
            : "rgba(56, 189, 248, 0.12)";

    dashboardMessage.style.color =
        type === "error" ? "#F87171" : "#38BDF8";
}

// Create a table cell safely.
function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "—";
    return cell;
}

// Render participants in the table.
function renderParticipants(participants) {
    participantsTableBody.replaceChildren();

    if (participants.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 8;
        cell.textContent = "No participants found.";
        cell.style.textAlign = "center";
        cell.style.padding = "25px";

        row.appendChild(cell);
        participantsTableBody.appendChild(row);
        return;
    }

    participants.forEach((participant, index) => {
        const row = document.createElement("tr");

        const registrationDate = participant.createdAt
            ? new Date(participant.createdAt).toLocaleDateString()
            : "—";

        row.appendChild(createCell(index + 1));
        row.appendChild(createCell(participant.participantCode));
        row.appendChild(createCell(participant.participantName));
        row.appendChild(createCell(participant.school));
        row.appendChild(createCell(participant.guardianName));
        row.appendChild(createCell(participant.guardianPhone));
        row.appendChild(createCell(participant.guardianEmail));
        row.appendChild(createCell(registrationDate));

        participantsTableBody.appendChild(row);
    });
}

// Update dashboard statistics.
function updateStatistics() {
    totalParticipants.textContent = allParticipants.length;

    const spaces = Math.max(
        0,
        MAX_CAPACITY - allParticipants.length
    );

    availableSpaces.textContent = spaces;
}

// Search participants by name or registration number.
function searchParticipants() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredParticipants = allParticipants.filter((participant) => {
        const name = (participant.participantName || "").toLowerCase();
        const code = (participant.participantCode || "").toLowerCase();

        return name.includes(searchTerm) || code.includes(searchTerm);
    });

    renderParticipants(filteredParticipants);
}

// Retrieve participant records from the backend.
async function loadParticipants() {
    refreshButton.disabled = true;
    refreshButton.textContent = "Loading...";

    try {
        const response = await fetch(`${API_URL}/participants`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("kjvAdminToken");
            window.location.href = "admin.html";
            return;
        }

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Could not load participants."
            );
        }

        allParticipants = Array.isArray(result.participants)
            ? result.participants
            : [];

        updateStatistics();
        searchParticipants();

        showDashboardMessage(
            `Successfully loaded ${allParticipants.length} participant record(s).`,
            "success"
        );

    } catch (error) {
        console.error("Dashboard error:", error.message);

        showDashboardMessage(
            error.message.includes("Failed to fetch")
                ? "Cannot connect to the server. Check that your backend is running."
                : error.message,
            "error"
        );

    } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "Refresh Records";
    }
}

// Protect exported CSV fields against spreadsheet formulas.
function escapeCSV(value) {
    let text = String(value ?? "");

    if (/^[\s]*[=+\-@]/.test(text) || /^[\t\r]/.test(text)) {
        text = "'" + text;
    }

    return `"${text.replace(/"/g, '""')}"`;
}

// Export participant records as a CSV file.
function exportParticipants() {
    if (allParticipants.length === 0) {
        showDashboardMessage(
            "There are no participant records to export.",
            "error"
        );
        return;
    }

    const headers = [
        "Registration Number",
        "Participant Name",
        "School",
        "Guardian Name",
        "Guardian Phone",
        "Guardian Email",
        "Registration Date"
    ];

    const rows = allParticipants.map((participant) => [
        participant.participantCode,
        participant.participantName,
        participant.school,
        participant.guardianName,
        participant.guardianPhone,
        participant.guardianEmail,
        participant.createdAt
            ? new Date(participant.createdAt).toLocaleDateString()
            : ""
    ]);

    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(","))
    ].join("\r\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "KJV-Tech-Bootcamp-Participants.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
}

// Refresh participant records.
refreshButton.addEventListener("click", loadParticipants);

// Search as the administrator types.
searchInput.addEventListener("input", searchParticipants);

// Export all participant records.
exportButton.addEventListener("click", exportParticipants);

// Log out the administrator.
logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("kjvAdminToken");
    window.location.href = "admin.html";
});

// Load records when the dashboard opens.
if (token) {
    loadParticipants();
}