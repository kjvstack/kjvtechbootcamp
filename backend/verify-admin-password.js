require("dotenv").config();
const bcrypt = require("bcryptjs");
const readline = require("readline");

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

terminal.question("Enter your admin password: ", async (password) => {
    try {
        const matches = await bcrypt.compare(
            password,
            process.env.ADMIN_PASSWORD_HASH
        );

        console.log(
            matches
                ? "PASSWORD HASH MATCHES!"
                : "PASSWORD DOES NOT MATCH THE SAVED HASH."
        );
    } catch (error) {
        console.log("Password verification failed.");
    } finally {
        terminal.close();
    }
});