const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        console.log(`Connected to MongoDB Successfully`);
        console.log("  ▀▄   ▄▀");
        console.log(" ▄█▀███▀█▄");
        console.log("█▀███████▀█");
        console.log("█ █▀▀▀▀▀█ █");
        console.log("   ▀▀ ▀▀");
        console.log(
            "Hello Adventurer, Time to get to work!!!!"
        );
        console.log(process.env.DATABASE_URL)
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;