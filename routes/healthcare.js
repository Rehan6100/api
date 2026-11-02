
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const allowedCollections = [
    "patients",
    "doctors",
    "hospitals",
    "appointments",
    "medical_records",
    "prescriptions",
    "billing",
    "encounters"
];

// ==========================================
// GET ALL RECORDS FROM A COLLECTION
// ==========================================

router.get("/:collection", async (req, res) => {

    try {
        const { collection } = req.params;

        // Validate collection
        if (!allowedCollections.includes(collection)) {
            return res.status(400).json({
                success: false,
                message: "Invalid collection"
            });
        }

        const db = req.app.locals.db;

        // Fetch ALL records without pagination
        const data = await db
            .collection(collection)
            .find({})
            .toArray();

        res.status(200).json({
            success: true,
            collection: collection,
            totalRecords: data.length,
            data: data
        });

    } catch (error) {

        console.error("Fetch Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch records",
            error: error.message
        });
    }
});


// ==========================================
// GET SINGLE RECORD BY MONGODB ID
// ==========================================

router.get("/:collection/id/:id", async (req, res) => {

    try {

        const { collection, id } = req.params;

        // Validate collection
        if (!allowedCollections.includes(collection)) {
            return res.status(400).json({
                success: false,
                message: "Invalid collection"
            });
        }

        // Validate MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid MongoDB ID"
            });
        }

        const db = req.app.locals.db;

        // Find single record
        const record = await db
            .collection(collection)
            .findOne({
                _id: new ObjectId(id)
            });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });
        }

        res.status(200).json({
            success: true,
            collection: collection,
            data: record
        });

    } catch (error) {

        console.error("Find Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch record",
            error: error.message
        });
    }
});

module.exports = router;
