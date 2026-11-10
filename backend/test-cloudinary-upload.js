require("dotenv").config();

const cloudinary = require("./config/cloudinary");

async function testUpload() {
    try {
        const result = await cloudinary.uploader.upload(
            "C:/Users/hp/Pictures/test.jpeg",
            {
                folder: "kjv-bootcamp/test",
                resource_type: "image"
            }
        );

        console.log("SUCCESS:", result.public_id);

    } catch (error) {
        console.log("Error name:", error.name);
        console.log("HTTP status:", error.http_code);
        console.log("Error message:", error.message);

        if (error.response) {
            console.log(
                "Response headers:",
                error.response.headers
            );
        }
    }
}

testUpload();