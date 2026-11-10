const continueButton = document.getElementById("continueButton");

continueButton.addEventListener("click", () => {
    const participant = sessionStorage.getItem("kjvParticipant");

    if (!participant) {
        alert("Registration information was not found. Please register first.");
        window.location.href = "register.html";
        return;
    }

    window.location.href = "success.html";
});