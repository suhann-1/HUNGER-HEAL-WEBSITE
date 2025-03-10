const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback"); // Create this model
const router = express.Router();

// Submit feedback (Only volunteers can submit)
router.post("/feedback", async (req, res) => {
  try {
    const { donorId, volunteerId, message } = req.body;
    const feedback = new Feedback({ donorId, volunteerId, message });
    await feedback.save();
    res.status(201).json({ success: true, message: "Feedback submitted!" });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

// Get feedback for a specific donor
router.get("/feedback/:donorId", async (req, res) => {
  try {
    const donorId = req.params.donorId;
    const feedbacks = await Feedback.find({ donorId });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;
