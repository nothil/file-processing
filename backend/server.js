const express = require("express");
const multer = require("multer");
const cors = require("cors");
//const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please upload PDF or image files."));
    }
  },
});

// Import processing modules
const standardProcessor = require("./utils/standardProcessing");
// const aiProcessor = require("./utils/aiProcessor");
const { calculateAge, constructFullName } = require("./utils/helpers");

// Routes
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
app.post("/api/process", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { firstName, lastName, dateOfBirth, processingMethod } = req.body;

    // this is the validation of fields
    if (!firstName || !lastName || !dateOfBirth) {
      return res
        .status(400)
        .json({ error: "personal information fields are required" });
    }

    let extractionResults = {};

    // Process based on selected method
    if (processingMethod === "standard") {
      extractionResults.standardExtraction =
        await standardProcessor.processFile(req.file);
    } else if (processingMethod === "ai") {
      const [standardResult, aiResult] = await Promise.all([
        standardProcessor.processFile(req.file),
        aiProcessor.processFile(req.file),
      ]);
      extractionResults.standardExtraction = standardResult;
      extractionResults.aiExtraction = aiResult;
    }

    // Calculate derived data
    const fullName = constructFullName(firstName, lastName);
    const age = calculateAge(new Date(dateOfBirth));

    // Construct response
    const response = {
      fullName,
      age,
      processingMethod,
      ...extractionResults,
      timestamp: new Date().toISOString(),
    };

    fs.unlinkSync(req.file.path);

    res.json(response);
  } catch (error) {
    console.error("Processing error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: error.message || "An error occurred during document processing",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
