
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const healthcareRoutes = require("./routes/healthcare");

const app = express();

app.use(cors());
app.use(express.json());

async function startServer() {

    const db = await connectDB();

    app.locals.db = db;

    app.use("/api", healthcareRoutes);

    app.get("/", (req, res) => {
        res.json({
            message: "Healthcare API is running"
        });
    });

    app.listen(process.env.PORT || 5000, () => {
        console.log("Server running on port 6100");
    });
}

startServer().catch(console.error);
