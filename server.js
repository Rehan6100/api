
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const healthcareRoutes = require("./routes/healthcare");


    const PORT = process.env.PORT || 6100;

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


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
}

startServer().catch(console.error);
