
const bcrypt = require("bcryptjs");
const readline = require("readline");

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

terminal.question("Enter your new admin password: ", async (password) => {
    try {
        if (password.length < 12) {
            console.log("Use a password with at least 12 characters.");
            return;
        }

        const hash = await bcrypt.hash(password, 12);

        console.log("\nYour password hash:\n");
        console.log(hash);

    } catch (error) {
        console.error("Hash generation failed.");
    } finally {
        terminal.close();
    }
});
