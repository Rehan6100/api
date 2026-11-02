
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);

        console.log("MongoDB Atlas Connected Successfully!");

        return db;

    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
}

module.exports = connectDB;
