
const express = require("express");
const router = express.Router();

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

// GET all records with pagination
router.get("/:collection", async (req, res) => {

    try {
        const { collection } = req.params;

        if (!allowedCollections.includes(collection)) {
            return res.status(400).json({
                message: "Invalid collection"
            });
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number(req.query.limit) || 20)
        );

        const db = req.app.locals.db;

        const data = await db.collection(collection)
            .find({})
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        const totalRecords = await db.collection(collection)
            .countDocuments();

        res.json({
            collection,
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET record by MongoDB ID
router.get("/:collection/id/:id", async (req, res) => {

    try {
        const { ObjectId } = require("mongodb");
        const { collection, id } = req.params;

        if (!allowedCollections.includes(collection)) {
            return res.status(400).json({
                message: "Invalid collection"
            });
        }

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid MongoDB ID"
            });
        }

        const db = req.app.locals.db;

        const record = await db.collection(collection)
            .findOne({ _id: new ObjectId(id) });

        if (!record) {
            return res.status(404).json({
                message: "Record not found"
            });
        }

        res.json(record);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
