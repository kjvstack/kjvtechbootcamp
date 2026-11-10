const paymentAcknowledged = document.getElementById(
    "paymentAcknowledged"
);

const continueButton = document.getElementById("continueButton");

continueButton.addEventListener("click", () => {
    if (!paymentAcknowledged.checked) {
        alert("Please acknowledge the payment instructions before continuing.");
        return;
    }

    window.location.href = "manual.html";
});