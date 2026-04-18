const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const Feedback = require("./models/Feedback");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // ✅ KEY FIX - stops the 10000ms buffering timeout
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.log("❌ Connection error:", err);
    throw err;
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed!" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/feedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!", feedback });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/feedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found!" });
    res.status(200).json({ message: "Feedback deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ NO app.listen() here — Vercel handles this

module.exports = app;