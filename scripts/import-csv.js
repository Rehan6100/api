
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const files = {
    "patients.csv": "patients",
    "doctors.csv": "doctors",
    "hospitals.csv": "hospitals",
    "appointments.csv": "appointments",
    "medical_records.csv": "medical_records",
    "prescriptions.csv": "prescriptions",
    "billing.csv": "billing",
    "encounters.csv": "encounters"
};

async function importCSV(db, fileName, collectionName) {

    const filePath = path.join(__dirname, "../data", fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${fileName}`);
        return;
    }

    const collection = db.collection(collectionName);

    let batch = [];
    let totalRecords = 0;
    const BATCH_SIZE = 1000;

    console.log(`Starting import: ${fileName}`);

    const stream = fs.createReadStream(filePath)
        .pipe(csv());

    async function insertBatch() {
        if (batch.length === 0) return;

        const currentBatch = batch;
        batch = [];

        await collection.insertMany(currentBatch, {
            ordered: false
        });

        totalRecords += currentBatch.length;

        console.log(
            `${collectionName}: ${totalRecords} records inserted`
        );
    }

    for await (const row of stream) {

        // Ignore completely empty rows
        if (Object.values(row).every(value => !value.trim())) {
            continue;
        }

        batch.push(row);

        if (batch.length >= BATCH_SIZE) {
            await insertBatch();
        }
    }

    await insertBatch();

    console.log(
        `Completed ${collectionName}: ${totalRecords} records`
    );
}

async function main() {

    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);

        for (const [fileName, collectionName] of Object.entries(files)) {
            await importCSV(db, fileName, collectionName);
        }

        console.log("All CSV files imported successfully!");

    } catch (error) {
        console.error("Import failed:", error);
    } finally {
        await client.close();
    }
}

main();
